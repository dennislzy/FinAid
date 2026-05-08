package org.financial.financialaibackend.service;

import java.io.BufferedReader;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.concurrent.TimeUnit;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class AudioSplitService {
    
    // 支援的音訊格式列表
    private static final List<String> SUPPORTED_FORMATS = List.of(
        "m4a", "mp3", "wav", "ogg", "flac", "aac", "wma"
    );

    public CompletableFuture<List<byte[]>> splitAudioFileWithFFmpegAsync(byte[] fileBytes, String originalFileName, int segmentDurationSeconds) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                // 獲取原始檔案的副檔名
                String extension = getFileExtension(originalFileName).toLowerCase();
                if (!SUPPORTED_FORMATS.contains(extension)) {
                    throw new IllegalArgumentException("不支援的音訊格式: " + extension);
                }

                // 1. 創建臨時輸入文件（使用原始副檔名）
                java.io.File tempInputFile = java.io.File.createTempFile("audio_input", "." + extension);
                try (FileOutputStream fos = new FileOutputStream(tempInputFile)) {
                    fos.write(fileBytes);
                }

                // 2. 獲取音頻時長（異步）
                CompletableFuture<Double> durationFuture = getDurationAsync(tempInputFile);
                double totalDuration = durationFuture.get(5, TimeUnit.MINUTES);

                // 3. 計算切割段數
                int totalSegments = (int) Math.ceil(totalDuration / segmentDurationSeconds);
                List<byte[]> chunks = new ArrayList<>(totalSegments);
                
                // 4. 創建輸出目錄
                java.io.File outputDir = new java.io.File(tempInputFile.getParent(), "segments");
                outputDir.mkdir();
                
                // 5. 執行FFmpeg切割（異步）
                CompletableFuture<Void> ffmpegFuture = executeFFmpegAsync(
                    tempInputFile, 
                    outputDir,
                    extension, 
                    segmentDurationSeconds
                );
                ffmpegFuture.get(30, TimeUnit.MINUTES);

                // 6. 收集並讀取切割後的片段
                List<CompletableFuture<byte[]>> chunkFutures = new ArrayList<>();
                for (int i = 0; i < totalSegments; i++) {
                    final int index = i;
                    CompletableFuture<byte[]> chunkFuture = CompletableFuture.supplyAsync(() -> {
                        try {
                            java.io.File segmentFile = new java.io.File(
                                outputDir, 
                                String.format("segment_%d.%s", index, extension)
                            );
                            if (!segmentFile.exists()) return null;
                            
                            byte[] data = Files.readAllBytes(segmentFile.toPath());
                            segmentFile.delete();
                            return data;
                        } catch (IOException e) {
                            throw new CompletionException(e);
                        }
                    });
                    chunkFutures.add(chunkFuture);
                }

                // 7. 等待所有片段處理完成
                CompletableFuture.allOf(chunkFutures.toArray(new CompletableFuture[0])).join();
                
                // 8. 收集結果
                for (CompletableFuture<byte[]> future : chunkFutures) {
                    byte[] chunk = future.join();
                    if (chunk != null) {
                        chunks.add(chunk);
                    }
                }

                // 9. 清理臨時文件
                tempInputFile.delete();
                outputDir.delete();

                return chunks;
            } catch (Exception e) {
                throw new CompletionException("音頻切割失敗", e);
            }
        });
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