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
import org.financial.financialaibackend.service.S3Service;
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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@RequiredArgsConstructor
public class AIBL {

    private final WebClient webClient=WebClient.create();

    private final String baseUrl = "http://localhost:7000/api/ai";
    private final CaseInfoBL caseInfoBL;
    private final StockPurchaseBL stockPurchaseBL;
    private final EntityModelMapper entityModelMapper;
    private final HouseholdYearFinancialRecordsBL householdYearFinancialRecordsBL;
    private final HouseholdMonthlyFinancialRecordsBL householdMonthlyFinancialRecordsBL;
    private final InsuranceListBL insuranceListBL;
    private final FundInvestBL fundInvestBL;
    private final BiddingRecordsBL aidAssociationBL;
    private final FileRepository fileRepository;
    private final ExecutorService executorService;
    private final AudioSplitService audioSplitService;
    private final S3Service s3Service;

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
        s3Service.upload(file, "audios", caseInfoId);

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
        final int SEGMENT_DURATION = 120;

        try {
            // 1. 切割音頻(同步等待完成)
            List<byte[]> chunks = audioSplitService.splitAudioFileWithFFmpeg(
                    fileBytes, file.getOriginalFilename(), SEGMENT_DURATION);

            log.info("音檔切割完成, fileId={}, 共{}段", originalFile.getFileId(), chunks.size());

            // 2. 平行轉文字(唯一值得平行化的步驟)
            List<CompletableFuture<String>> transcriptionFutures = new ArrayList<>();
            for (int i = 0; i < chunks.size(); i++) {
                final int chunkIndex = i;
                CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
                    try {
                        return audioToText(file, chunks.get(chunkIndex), caseInfoId);
                    } catch (IOException e) {
                        throw new CompletionException("第" + chunkIndex + "段轉文字失敗", e);
                    }
                }, executorService);
                transcriptionFutures.add(future);
            }

            // 3. 等待所有段落完成,按順序合併
            String fullText;
            try {
                fullText = transcriptionFutures.stream()
                        .map(CompletableFuture::join)
                        .collect(Collectors.joining("\n"));
            } catch (CompletionException e) {
                log.error("轉文字階段失敗, fileId={}", originalFile.getFileId(), e);
                handleError(originalFile, e.getCause() != null ? e.getCause() : e);
                return;
            }

            // 4. 加標點符號(失敗則退回原始文本,不中斷流程)
            String punctuatedText;
            try {
                punctuatedText = addPunctuation(fullText);
            } catch (Exception e) {
                log.warn("標點處理失敗, fileId={}, 使用原始文本: {}", originalFile.getFileId(), e.getMessage());
                punctuatedText = fullText;
            }

            // 5. 生成摘要
            String summaryResult;
            try {
                summaryResult = summary(punctuatedText);
            } catch (Exception e) {
                log.error("摘要生成失敗, fileId={}", originalFile.getFileId(), e);
                handleError(originalFile, e);
                return;
            }

            // 6. 一次性更新最終結果
            updateFinalResult(originalFile, punctuatedText, summaryResult);
            log.info("音檔處理完成, fileId={}", originalFile.getFileId());

        } catch (Exception e) {
            log.error("音檔處理發生未預期錯誤, fileId={}", originalFile.getFileId(), e);
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
