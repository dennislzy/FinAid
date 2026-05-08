package org.financial.financialaibackend.BL;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.concurrent.ExecutorService;
import java.util.stream.Collectors;

import org.financial.financialaibackend.Dto.audioAndSummary.AudioTextRequest;
import org.financial.financialaibackend.Dto.file.FileInsertRequest;
import org.financial.financialaibackend.Dto.file.FileUpdateRequest;
import org.financial.financialaibackend.Dto.mapping.MappingRequest;
import org.financial.financialaibackend.Entity.CaseInfo;
import org.financial.financialaibackend.Entity.File;
import org.financial.financialaibackend.Enums.Status;
import org.financial.financialaibackend.Repository.FileRepository;
import org.financial.financialaibackend.Utils.AttributeCheck;
import org.financial.financialaibackend.Utils.DateUtil;
import org.financial.financialaibackend.Utils.EntityModelMapper;
import org.financial.financialaibackend.service.AudioSplitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class AIBL {

    private final WebClient webClient=WebClient.create();

    private final String baseUrl = "http://localhost:7000/api/ai";


    @Autowired
    private FileBL fileBL;
    @Autowired
    private CaseInfoBL caseInfoBL;

    @Autowired
    private StockPurchaseBL stockPurchaseBL;
    @Autowired
    private EntityModelMapper entityModelMapper;

    @Autowired
    private HouseholdYearFinancialRecordsBL householdYearFinancialRecordsBL;

    @Autowired
    private HouseholdMonthlyFinancialRecordsBL householdMonthlyFinancialRecordsBL;

    @Autowired
    private InsuranceListBL insuranceListBL;

    @Autowired
    private FundInvestBL fundInvestBL;

    @Autowired
    private BiddingRecordsBL aidAssociationBL;
    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private ExecutorService executorService;

    @Autowired
    private AudioSplitService audioSplitService;


    public String audioToText(MultipartFile file,byte[] fileBytes,String caseInfoId) throws IOException {
        ByteArrayResource resource = new ByteArrayResource(fileBytes) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        };

        MultiValueMap<String, Object> formData = new LinkedMultiValueMap<>();
        formData.add("audio_file", resource);

       return webClient.post()
        .uri(baseUrl + "/audio/"+caseInfoId)
        .contentType(MediaType.MULTIPART_FORM_DATA)
        .body(BodyInserters.fromMultipartData(formData))
        .retrieve()
        .onStatus(HttpStatusCode::isError, response -> {
            log.error("WebClient Error: Status {} - {}", response.statusCode(), response.bodyToMono(String.class).block());
            return response.createException();
        })
        .bodyToMono(String.class)
        .block();

    }


    public String summary(String audioTexts){
        return webClient
                .post()
                .uri(baseUrl+"/summary")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(new AudioTextRequest(audioTexts))
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public void addToVector(String audioTexts,String fileName){
        webClient
            .get()
            .uri(baseUrl)
            .retrieve()
            .bodyToMono(String.class)
            .block();
        // webClient
        //         .post()
        //         .uri(baseUrl+"/add_to_vector")
        //         .contentType(MediaType.APPLICATION_JSON)
        //         .bodyValue(new SummaryRequest(audioTexts,fileName))
        //         .retrieve()
        //         .bodyToMono(String.class)
        //         .block();
    }

    //立即將臨時文件讀入内存避免文件不可讀
    private byte[] saveTemptFile(MultipartFile file){
        byte[] fileBytes;
        try (InputStream in = file.getInputStream();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = in.read(buffer)) != -1) {
                baos.write(buffer, 0, bytesRead);
            }
            fileBytes = baos.toByteArray();
            return fileBytes;
        } catch (IOException e) {
            throw new RuntimeException("讀取上傳文件失敗", e);
        }   
    }

    public File handleTranscription(MultipartFile file, String caseInfoId) throws IOException {
        // 1. 立即將文件內容讀入內存，避免異步時文件不可讀
        byte[] fileBytes = saveTemptFile(file);
        
    
        // 2. 檔案上傳（這裡假設該方法不會影響原始文件的可讀性）
        fileBL.uploadFile(file, caseInfoId);

        String formatTime = null;
        try {
            formatTime = calculateAudioDuration(file);
        } catch (IOException e) {
            e.printStackTrace();
        }
    
        // 3. 建立初始資料庫記錄s
        FileInsertRequest fileInsertRequest = new FileInsertRequest();
        fileInsertRequest.setFileName(file.getOriginalFilename());
        fileInsertRequest.setTotalText("處理中...");
        fileInsertRequest.setSummary("處理中...");
        fileInsertRequest.setStatus(Status.UNCOMPLETE);
        fileInsertRequest.setCreateTime(LocalDate.now());
        fileInsertRequest.setDuration(formatTime);
    
        File file1 = entityModelMapper.map(fileInsertRequest, File.class);
        CaseInfo caseInfo = new CaseInfo();
        caseInfo.setCaseInfoId(caseInfoId);
        file1.setCaseInfo(caseInfo);
    
        // 4. 🔹 立即存入資料庫，然後立刻返回，不等待後續處理
        File originalFile = fileRepository.save(file1);
    
        // 5. 🔹 在後台異步執行音頻轉文字和摘要
        CompletableFuture.runAsync(() -> processAudioAndSummary(originalFile, file, fileBytes,caseInfoId), executorService);
    
        return originalFile; // 🔹 立即返回，不等待處理完成
    }

    private void processAudioAndSummary(File originalFile, MultipartFile file, byte[] fileBytes, String caseInfoId) {
        try {
            // 1. 設置音頻分段時長（120秒）
            int SEGMENT_DURATION = 120;
            
            // 2. 異步切割音頻
            audioSplitService.splitAudioFileWithFFmpegAsync(fileBytes, file.getOriginalFilename(), SEGMENT_DURATION)
                .thenAccept(chunks -> {
                    try {
                        // 3. 創建音頻轉文字的異步任務
                        List<CompletableFuture<String>> transcriptionFutures = new ArrayList<>();
                        
                        for (int i = 0; i < chunks.size(); i++) {
                            final int chunkIndex = i;
                            CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
                                try {
                                    return audioToText(file, chunks.get(chunkIndex), caseInfoId);
                                } catch (IOException e) {
                                    throw new CompletionException(e);
                                }
                            }, executorService);
                            transcriptionFutures.add(future);
                        }

                        // 4. 等待所有轉錄完成並合併文本
                        StringBuilder fullText = new StringBuilder();
                        CompletableFuture.allOf(transcriptionFutures.toArray(new CompletableFuture[0]))
                            .thenApply(v -> {
                                // 按順序合併所有文本
                                return transcriptionFutures.stream()
                                    .map(CompletableFuture::join)
                                    .collect(Collectors.joining("\n"));
                            })
                            .thenCompose(finalText -> {
                                fullText.append(finalText);  // 保存完整文本
                                // 5. 新增：為文本添加標點符號
                                return CompletableFuture.supplyAsync(() -> {
                                    try {
                                        return addPunctuation(fullText.toString());
                                    } catch (Exception e) {
                                        log.error("標點處理失敗: {}", e.getMessage());
                                        return fullText.toString(); // 回退到原始文本
                                    }
                                }, executorService);
                            })
                            .thenCompose(punctuatedText -> {
                                fullText.setLength(0); // 清空原始文本
                                fullText.append(punctuatedText); // 更新為標點後文本
                                // 6. 生成摘要
                                return CompletableFuture.supplyAsync(
                                    () -> summary(punctuatedText), 
                                    executorService
                                );
                            })
                            .thenAccept(summaryResult -> {
                                // 7. 一次性更新最終結果
                                updateFinalResult(originalFile, fullText.toString(), summaryResult);
                            })
                            .exceptionally(error -> {
                                handleError(originalFile, error);
                                return null;
                            });

                    } catch (Exception e) {
                        handleError(originalFile, e);
                    }
                })
                .exceptionally(error -> {
                    handleError(originalFile, error);
                    return null;
                });

        } catch (Exception e) {
            handleError(originalFile, e);
        }
    }

    private String addPunctuation(String text) {
        return webClient
                .post()
                .uri(baseUrl + "/punctuate")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(new AudioTextRequest(text))
                .retrieve()
                .onStatus(HttpStatusCode::isError, response -> {
                    log.error("Punctuate API Error: Status {} - {}", response.statusCode(), response.bodyToMono(String.class).block());
                    return response.createException();
                })
                .bodyToMono(Map.class) // 使用 Map.class，假設 WebClient 能解析 JSON 物件
                .map(response -> {
                    Object result = response.get("result");
                    if (result instanceof String) {
                        return (String) result;
                    }
                    log.warn("Invalid punctuate response: {}", response);
                    return text; // 回退到原始文本
                })
                .onErrorReturn(text)
                .block();
    }

    // 輔助方法：更新最終結果
    private void updateFinalResult(File file, String text, String summary) {
        FileUpdateRequest updateRequest = new FileUpdateRequest();
        updateRequest.setTotalText(text.replace("\"", ""));
        updateRequest.setSummary(summary.replace("\"",""));
        updateRequest.setStatus(Status.COMPLETE);
        entityModelMapper.map(updateRequest, file);
        fileRepository.save(file);
    }

    public File regenerateSummary(Integer fileId) {
        // 1. 找到檔案
        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("找不到檔案 ID: " + fileId));
    
        // 2. 確認 totalText 不是空的
        if (file.getTotalText() == null || file.getTotalText().isEmpty() || file.getTotalText().equals("處理中...") || file.getTotalText().equals("處理失敗")) {
            throw new RuntimeException("這檔案的轉錄文字有問題，無法生成摘要");
        }
    
        // 3. 用 totalText 重新生成摘要
        String newSummary = summary(file.getTotalText());
    
        // 4. 只更新摘要，不動其他欄位
        FileUpdateRequest updateRequest = new FileUpdateRequest();
        updateRequest.setSummary(newSummary.replace("\"", ""));
        updateRequest.setStatus(Status.COMPLETE);
        entityModelMapper.map(updateRequest, file);
        return fileRepository.save(file);
    }

    // 輔助方法：處理錯誤
    private void handleError(File file, Throwable error) {
        log.error("處理失敗", error);
        FileUpdateRequest errorRequest = new FileUpdateRequest();
        errorRequest.setStatus(Status.ERROR);
        errorRequest.setTotalText("處理失敗");
        errorRequest.setSummary("處理失敗");
        entityModelMapper.map(errorRequest, file);
        fileRepository.save(file);
    }

    private static final Set<String> SUPPORTED_FORMATS = new HashSet<>(Arrays.asList(
        "mp3", "m4a", "wav", "aac", "ogg", "flac"
    ));
    
    private static String getFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf(".");
        if (lastDotIndex == -1) {
            return "";
        }
        return fileName.substring(lastDotIndex + 1);
    }
    
    private static boolean isSupportedAudioFormat(String extension) {
        if (SUPPORTED_FORMATS.contains(extension.toLowerCase())){
            return true;
        }else{
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,"上傳檔案格式錯誤");
        }
    }
    
    public static String calculateAudioDuration(MultipartFile file) throws IOException {
        // 檢查是否為音訊檔案
        String fileName = file.getOriginalFilename();
        if (fileName == null) {
            throw new IllegalArgumentException("檔案名稱無效");
        }
        
        String extension = getFileExtension(fileName).toLowerCase();
        
        isSupportedAudioFormat(extension);

        // 建立臨時檔案
        Path tempFile = Files.createTempFile("audio_", "." + extension);
        file.transferTo(tempFile.toFile());

        try {
            // 使用 FFmpeg 獲取音訊時長
            ProcessBuilder processBuilder = new ProcessBuilder(
                "ffprobe", 
                "-v", "error",
                "-show_entries", "format=duration",
                "-of", "default=noprint_wrappers=1:nokey=1",
                tempFile.toString()
            );
            
            Process process = processBuilder.start();
            String output = new String(process.getInputStream().readAllBytes()).trim();
            
            // 等待處理完成
            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new IOException("FFmpeg 處理失敗");
            }

            // 解析時長（秒）
            double durationInSeconds = Double.parseDouble(output);
            return DateUtil.formatDuration(durationInSeconds);
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IOException("處理被中斷", e);
        } finally {
            // 清理臨時檔案
            Files.deleteIfExists(tempFile);
        }
    }
    @Transactional
    public String mapping(MappingRequest mappingRequest, String socialWorkerEmail) {
        CaseInfo caseInfo = entityModelMapper.map(mappingRequest.getCase_info(), CaseInfo.class);

        //個案新增
        caseInfoBL.insert(caseInfo, socialWorkerEmail);

        // 處理股票記錄
        mappingRequest.getStock_purchase_records().stream()
                .filter(record -> !AttributeCheck.notNullObject(record))
                .filter(record -> record.getStockPurchaseDate() != null)
                .forEach(record -> stockPurchaseBL.insert(caseInfo.getCaseInfoId(), record));

        // 處理年度財務記錄
        List<String> financialTypeList = List.of("收入", "支出", "資產", "負債");
        mappingRequest.getHousehold_year_financial_records().stream()
                .filter(record -> !AttributeCheck.notNullObject(record))
                .filter(record -> financialTypeList.contains(record.getFinancialType()))
                .filter(record -> !record.getFinancialCategory().isEmpty())
                .forEach(record -> householdYearFinancialRecordsBL.insert(caseInfo, record));

        // 處理月度財務記錄
        mappingRequest.getHousehold_monthly_financial_records().stream()
                .filter(record -> !AttributeCheck.notNullObject(record))
                .filter(record -> financialTypeList.contains(record.getFinancialType()))
                .filter(record -> !record.getFinancialCategory().isEmpty())
                .forEach(record -> householdMonthlyFinancialRecordsBL.insert(caseInfo, record));

        // 處理保險清單
        mappingRequest.getInsurance_list().stream()
                .filter(record -> !AttributeCheck.notNullObject(record))
                .forEach(record -> insuranceListBL.insert(caseInfo.getCaseInfoId(), record));

        // 處理基金投資
        mappingRequest.getFund_invest().stream()
                .filter(record -> !AttributeCheck.notNullObject(record))
                .filter(record -> record.getFundPurchaseDate() != null)
                .forEach(record -> fundInvestBL.insert(caseInfo, record));

        // 處理補助關聯
        mappingRequest.getAid_association().stream()
                .filter(record -> !AttributeCheck.notNullObject(record))
                .filter(record -> record.getEndDate() != null && record.getStartDate() != null)
                .forEach(record -> aidAssociationBL.insert(caseInfo.getCaseInfoId(), record));

        return "success";
    }

    public String mapToDatabase(AudioTextRequest audioTextRequest, String socialWorkerEmail) {
        return webClient
                .post()
                .uri(baseUrl+"/"+socialWorkerEmail+"/mapping")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(audioTextRequest)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
