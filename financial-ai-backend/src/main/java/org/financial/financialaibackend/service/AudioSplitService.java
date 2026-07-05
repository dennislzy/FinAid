package org.financial.financialaibackend.service;

import java.io.BufferedReader;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.TimeUnit;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@RequiredArgsConstructor
public class AudioSplitService {
    
    // 支援的音訊格式列表
    private static final List<String> SUPPORTED_FORMATS = List.of(
        "m4a", "mp3", "wav", "ogg", "flac", "aac", "wma"
    );
    private final ExecutorService executorService;

    public List<byte[]> splitAudioFileWithFFmpeg(byte[] fileBytes, String originalFileName, int segmentDurationSeconds) {
        String extension = getFileExtension(originalFileName).toLowerCase();
        if (!SUPPORTED_FORMATS.contains(extension)) {
            throw new IllegalArgumentException("不支援的音訊格式: " + extension);
        }

        java.io.File tempInputFile = null;
        java.io.File outputDir = null;

        try {
            // 1. 創建臨時輸入文件
            tempInputFile = java.io.File.createTempFile("audio_input", "." + extension);
            try (FileOutputStream fos = new FileOutputStream(tempInputFile)) {
                fos.write(fileBytes);
            }

            // 2. 獲取音頻時長(反正已在背景執行緒,直接同步等待即可)
            double totalDuration = getDurationAsync(tempInputFile).get(5, TimeUnit.MINUTES);

            // 3. 計算切割段數
            int totalSegments = (int) Math.ceil(totalDuration / segmentDurationSeconds);

            // 4. 創建輸出目錄
            outputDir = new java.io.File(tempInputFile.getParent(), "segments_" + UUID.randomUUID());
            if (!outputDir.mkdir()) {
                throw new IOException("無法建立暫存輸出目錄: " + outputDir.getAbsolutePath());
            }

            // 5. 執行FFmpeg切割
            executeFFmpegAsync(tempInputFile, outputDir, extension, segmentDurationSeconds)
                    .get(30, TimeUnit.MINUTES);

            // 6. 平行讀取切割後的片段(I/O密集,值得平行化,且明確帶入指定的 executor)
            List<CompletableFuture<byte[]>> chunkFutures = new ArrayList<>();
            java.io.File finalOutputDir = outputDir;
            for (int i = 0; i < totalSegments; i++) {
                final int index = i;
                CompletableFuture<byte[]> chunkFuture = CompletableFuture.supplyAsync(() -> {
                    try {
                        java.io.File segmentFile = new java.io.File(
                                finalOutputDir, String.format("segment_%d.%s", index, extension));
                        if (!segmentFile.exists()) return null;

                        byte[] data = Files.readAllBytes(segmentFile.toPath());
                        Files.deleteIfExists(segmentFile.toPath());
                        return data;
                    } catch (IOException e) {
                        throw new CompletionException(e);
                    }
                }, executorService); // 明確指定,不再用預設 commonPool
                chunkFutures.add(chunkFuture);
            }

            // 7. 等待所有片段讀取完成並收集結果
            List<byte[]> chunks = new ArrayList<>(totalSegments);
            for (CompletableFuture<byte[]> future : chunkFutures) {
                byte[] chunk = future.join();
                if (chunk != null) {
                    chunks.add(chunk);
                }
            }

            return chunks;

        } catch (Exception e) {
            throw new CompletionException("音頻切割失敗", e);
        } finally {
            // 無論成功或失敗,確保暫存檔案一定被清理
            if (tempInputFile != null && tempInputFile.exists()) {
                tempInputFile.delete();
            }
            if (outputDir != null && outputDir.exists()) {
                deleteDirectoryQuietly(outputDir);
            }
        }
    }

    private void deleteDirectoryQuietly(java.io.File dir) {
        java.io.File[] files = dir.listFiles();
        if (files != null) {
            for (java.io.File f : files) {
                f.delete();
            }
        }
        dir.delete();
    }

    private CompletableFuture<Double> getDurationAsync(java.io.File file) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                ProcessBuilder pb = new ProcessBuilder(
                    "ffprobe",
                    "-v", "error",
                    "-show_entries", "format=duration",
                    "-of", "default=noprint_wrappers=1:nokey=1",
                    file.getAbsolutePath()
                );
                
                Process process = pb.start();
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                    String result = reader.readLine();
                    if (!process.waitFor(5, TimeUnit.MINUTES)) {
                        process.destroyForcibly();
                        throw new CompletionException("FFprobe timeout", null);
                    }
                    return Double.parseDouble(result.trim());
                }
            } catch (Exception e) {
                throw new CompletionException("獲取音頻時長失敗", e);
            }
        });
    }

    private CompletableFuture<Void> executeFFmpegAsync(
            java.io.File inputFile, 
            java.io.File outputDir,
            String outputFormat,
            int segmentDurationSeconds) {
        return CompletableFuture.runAsync(() -> {
            try {
                // 首先嘗試直接複製
                final Process copyProcess = executeFFmpegCommand(inputFile, outputDir, outputFormat, segmentDurationSeconds, true);
                
                // 開啟一個新的線程來讀取錯誤輸出
                Thread errorThread = new Thread(() -> {
                    try (BufferedReader errorReader = new BufferedReader(
                            new InputStreamReader(copyProcess.getErrorStream()))) {
                        String line;
                        while ((line = errorReader.readLine()) != null) {
                            log.debug("FFmpeg: " + line);
                        }
                    } catch (IOException e) {
                        log.error("Error reading FFmpeg output", e);
                    }
                });
                errorThread.start();

                if (!copyProcess.waitFor(30, TimeUnit.MINUTES)) {
                    copyProcess.destroyForcibly();
                    throw new CompletionException("FFmpeg processing timeout", null);
                }

                // 如果直接複製失敗，嘗試重新編碼
                if (copyProcess.exitValue() != 0) {
                    final Process reencodeProcess = executeFFmpegCommand(inputFile, outputDir, outputFormat, segmentDurationSeconds, false);
                    
                    if (!reencodeProcess.waitFor(30, TimeUnit.MINUTES)) {
                        reencodeProcess.destroyForcibly();
                        throw new CompletionException("FFmpeg re-encoding timeout", null);
                    }
                }
            } catch (Exception e) {
                throw new CompletionException("FFmpeg執行失敗", e);
            }
        });
    }

    private Process executeFFmpegCommand(
            java.io.File inputFile,
            java.io.File outputDir,
            String outputFormat,
            int segmentDurationSeconds,
            boolean copyCodec) throws IOException {
        List<String> command = new ArrayList<>();
        command.add("ffmpeg");
        command.add("-i");
        command.add(inputFile.getAbsolutePath());
        command.add("-f");
        command.add("segment");
        command.add("-segment_time");
        command.add(String.valueOf(segmentDurationSeconds));
        command.add("-reset_timestamps");
        command.add("1");
        command.add("-write_empty_segments");
        command.add("0");
        
        if (copyCodec) {
            command.add("-c");
            command.add("copy");
        } else {
            command.add("-c:a");
            command.add(getDefaultCodecForFormat(outputFormat));
        }
        
        command.add("-hide_banner");
        command.add("-loglevel");
        command.add("error");
        command.add(String.format("%s/segment_%%d.%s", outputDir.getAbsolutePath(), outputFormat));

        ProcessBuilder pb = new ProcessBuilder(command);
        return pb.start();
    }

    private String getDefaultCodecForFormat(String format) {
        return switch (format.toLowerCase()) {
            case "mp3" -> "libmp3lame";
            case "aac" -> "aac";
            case "ogg" -> "libvorbis";
            case "m4a" -> "aac";
            case "flac" -> "flac";
            case "wav" -> "pcm_s16le";
            case "wma" -> "wmav2";
            default -> "aac";  // 預設使用 AAC 編碼器
        };
    }

    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex > 0) {
            return filename.substring(lastDotIndex + 1);
        }
        return "";
    }
}