package org.financial.financialaibackend.BL;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.financial.financialaibackend.Dto.audioAndSummary.AudioTextRequest;
import org.financial.financialaibackend.Dto.common.FilterObject;
import org.financial.financialaibackend.Dto.file.FileInsertRequest;
import org.financial.financialaibackend.Dto.file.FileUpdateRequest;
import org.financial.financialaibackend.Entity.CaseInfo;
import org.financial.financialaibackend.Entity.File;
import org.financial.financialaibackend.Repository.CaseInfoRepository;
import org.financial.financialaibackend.Repository.FileRepository;
import org.financial.financialaibackend.Utils.EntityModelMapper;
import org.financial.financialaibackend.Utils.FileUtils;
import org.financial.financialaibackend.service.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Component
@Slf4j
@RequiredArgsConstructor
public class FileBL {

    @Value("${file.upload.dir:${user.dir}/src/main/resources/static/files}")
    private String fileUploadDir;

    @Value("${file.upload.dir:${user.dir}/src/main/resources/static/audios}")
    private String audioUploadDir;

    @Value("${spring.file.path.files}")
    private String filePath;

    @Value("${spring.file.path.audios}")
    private String audioPath;

    private final String baseUrl = "http://localhost:8080/";

    private final S3Service s3Service;
    private final FileRepository fileRepository;
    private final CaseInfoRepository caseInfoRepository;
    private final EntityModelMapper entityModelMapper;
    private final ExecutorService executorService;
    

    private final WebClient webClient=WebClient.create();

    private String generateNewFileName(String originalFileName, String caseInfoId) {
        String extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        return caseInfoId + originalFileName + extension;
    }

    // 轉為 PDF 並存到files檔案夾裡面
    public void generatePdf(String text, String pdfFileName) {
        try (PDDocument document = new PDDocument()) {
            // 載入中文字體
            InputStream fontStream = getClass().getClassLoader().getResourceAsStream("fonts/NotoSansTC-Regular.ttf");
            if (fontStream == null) {
                throw new RuntimeException("找不到字體文件");
            }
            PDFont font = PDType0Font.load(document, fontStream);

            float fontSize = 12;
            float leading = 14.5f;
            float margin = 50;
            PDRectangle pageSize = PDRectangle.A4;
            float width = pageSize.getWidth() - 2 * margin;
            float startY = pageSize.getHeight() - margin;
            int linesPerPage = (int) ((pageSize.getHeight() - 2 * margin) / leading);
            int currentLineCount = 0;

            String[] lines = text.split("\n");
            PDPage page = new PDPage(pageSize);
            document.addPage(page);
            PDPageContentStream contentStream = new PDPageContentStream(document, page);
            contentStream.setFont(font, fontSize);
            contentStream.setLeading(leading);
            contentStream.beginText();
            contentStream.newLineAtOffset(margin, startY);

            for (String line : lines) {
                if (line.trim().isEmpty()) {
                    contentStream.newLine();
                    currentLineCount++;
                    if (currentLineCount >= linesPerPage) {
                        contentStream.endText();
                        contentStream.close();
                        page = new PDPage(pageSize);
                        document.addPage(page);
                        contentStream = new PDPageContentStream(document, page);
                        contentStream.setFont(font, fontSize);
                        contentStream.setLeading(leading);
                        contentStream.beginText();
                        contentStream.newLineAtOffset(margin, startY);
                        currentLineCount = 0;
                    }
                    continue;
                }

                List<String> wrappedLines = wrapText(line, font, fontSize, width);
                for (String wrapLine : wrappedLines) {
                    contentStream.showText(wrapLine);
                    contentStream.newLine();
                    currentLineCount++;

                    if (currentLineCount >= linesPerPage) {
                        contentStream.endText();
                        contentStream.close();
                        page = new PDPage(pageSize);
                        document.addPage(page);
                        contentStream = new PDPageContentStream(document, page);
                        contentStream.setFont(font, fontSize);
                        contentStream.setLeading(leading);
                        contentStream.beginText();
                        contentStream.newLineAtOffset(margin, startY);
                        currentLineCount = 0;
                    }
                }
            }

            contentStream.endText();
            contentStream.close();

            // 儲存 PDF 到指定路徑
            if (!pdfFileName.toLowerCase().endsWith(".pdf")) {
                pdfFileName = pdfFileName + ".pdf";
            }

            Path resourceDirectory = Paths.get("src", "main", "resources", "static", "files");
            if (!Files.exists(resourceDirectory)) {
                Files.createDirectories(resourceDirectory);
            }
            Path pdfPath = resourceDirectory.resolve(pdfFileName);
            document.save(pdfPath.toFile());

            System.out.println("✅ PDF 已成功生成：" + pdfPath.toAbsolutePath());
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("PDF 生成失敗: " + e.getMessage());
        }
    }


    private List<String> wrapText(String text, PDFont font, float fontSize, float maxWidth) throws IOException {
        List<String> lines = new ArrayList<>();
        StringBuilder line = new StringBuilder();
        for (String word : text.split("(?<=\\p{IsHan}|\\s|\\p{Punct})")) {
            if (font.getStringWidth(line + word) / 1000 * fontSize > maxWidth) {
                lines.add(line.toString());
                line = new StringBuilder();
            }
            line.append(word);
        }
        if (!line.toString().isEmpty()) {
            lines.add(line.toString());
        }
        return lines;
    }
    

    public String uploadFile(MultipartFile file, String caseInfoId) {
        boolean checkIsAudio = FileUtils.checkIsAudio(file);
        String folderName = checkIsAudio ? "audios" : "files";

        String originalFilename = file.getOriginalFilename();
        String newFileName = caseInfoId + originalFilename;

        if (checkIsAudio && !newFileName.toLowerCase().endsWith(".m4a")) {
            newFileName += ".m4a";
        }

        try {
            return s3Service.upload(file, folderName, newFileName);
        } catch (IOException e) {
            throw new RuntimeException("文件上傳失敗: " + e.getMessage());
        }
    }

    public boolean deleteFileFromStaticFolder(String fileName) {
        // 删除 resources 目录下的文件
        Path resourceFilePath = Paths.get("src", "main", "resources", "static", "audios", fileName);
        deleteFile(resourceFilePath);
    
        // 删除 target 目录下的文件
        Path targetFilePath = Paths.get("target", "classes", "static", "audios", fileName);
        deleteFile(targetFilePath);
    
        // 返回删除结果
        return !Files.exists(resourceFilePath) && !Files.exists(targetFilePath);
    }
    
    private void deleteFile(Path filePath) {
        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // 处理删除文件时的异常
            e.printStackTrace();
        }
    }

    public File getFileById(Integer fileId){
        File file = fileRepository.findByFileId(fileId).orElse(null);
        String caseInfoId = file.getCaseInfo().getCaseInfoId();
        CaseInfo caseInfo = new CaseInfo();
        caseInfo.setCaseInfoId(caseInfoId);
        file.setCaseInfo(caseInfo);
        return file;
    }

    public Page<File> findAllFilesByCaseInfoId(String caseInfoId, FilterObject filterObject) {

        // 1. 準備分頁與排序參數
        Sort sort = null;
        PageRequest pageRequest;

        if (filterObject.getOrder() != null) {
            // 根據order欄位值 (asc / desc)，決定升冪或降冪排序
            sort = filterObject.getOrder().equalsIgnoreCase("asc")
                    ? Sort.by(filterObject.getSortBy()).ascending()
                    : Sort.by(filterObject.getSortBy()).descending();
            
            pageRequest = PageRequest.of(filterObject.getPage(), filterObject.getSize(), sort);
        } else {
            // 若沒有指定排序，僅做分頁
            pageRequest = PageRequest.of(filterObject.getPage(), filterObject.getSize());
        }

        if (filterObject.getQuery()!=null && !filterObject.getQuery().trim().isEmpty()){
            return fileRepository.findByCaseInfo_CaseInfoIdAndFileNameContainingIgnoreCase(caseInfoId, filterObject.getQuery(), pageRequest);
        }else{
            return fileRepository.findByCaseInfo_CaseInfoId(caseInfoId, pageRequest);
        }
    }
    

    public File insertFile(FileInsertRequest request, String caseInfoId) {

        CaseInfo caseInfo = caseInfoRepository.findById(caseInfoId)
                .orElseThrow(() -> new RuntimeException("CaseInfo not found for ID: " + caseInfoId));
        String caseInfoName = caseInfo.getCaseInfoName();
        CaseInfo caseInfo1 =new CaseInfo();
        caseInfo1.setCaseInfoId(caseInfoId);
    
        File file = entityModelMapper.map(request,File.class);
        file.setCaseInfo(caseInfo1);
        file.setCreateTime(LocalDate.now());
    
        File savedFile = fileRepository.save(file);
        Integer fileId = savedFile.getFileId();
    
        String pdfFileName = caseInfoId + "-" + caseInfoName + "-" + fileId + ".pdf";
        String pdfContent = "Title: " + savedFile.getFileName() + "\n" +
                            "Summary: " + savedFile.getSummary() + "\n" +
                            "Total Text: " + savedFile.getTotalText();

        CompletableFuture.runAsync(()->{
            generatePdf(pdfContent, pdfFileName);
        },executorService);
        return savedFile;
    }

    // 更新檔案
    public File updateFile(Integer fileId, FileUpdateRequest request) {
        // 查詢檔案是否存在
        Optional<File> fileOpt = fileRepository.findById(fileId);
    
        if (!fileOpt.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "此file 不存在");
        } else {
            File existingFile = fileOpt.get();
            
            // 保存舊的檔案名稱和案件ID，用於後續重命名
            String oldFileName = existingFile.getFileName();
            String oldCaseInfoId = existingFile.getCaseInfo().getCaseInfoId();
            
            // 更新檔案資訊
            CaseInfo caseInfo = new CaseInfo();
            caseInfo.setCaseInfoId(existingFile.getCaseInfo().getCaseInfoId());
            existingFile.setCaseInfo(caseInfo);
            entityModelMapper.map(request, existingFile);
            
            // 判斷是否需要重命名檔案
            boolean needRename = !oldFileName.equals(existingFile.getFileName());
            
            if (needRename) {
                try {
                    // 將 URL 轉換為實際的檔案系統路徑
                    // 假設 static 資源目錄在專案中的實際路徑
                    String staticResourcePath = getStaticResourcePath();
                    log.debug("靜態資源目錄路徑: " + staticResourcePath);
                    
                    // 舊檔案的物理路徑 (不是 URL)
                    String oldFilePath = staticResourcePath + "/files/" + oldCaseInfoId + oldFileName + ".m4a";
                    Path source = Paths.get(oldFilePath);
                    
                    // 檢查檔案是否存在
                    if (!Files.exists(source)) {
                        log.warn("源檔案不存在: " + oldFilePath);
                        
                        // 嘗試其他可能的路徑格式
                        if (oldFileName.toLowerCase().endsWith(".m4a")) {
                            oldFilePath = staticResourcePath + "/files/" + oldCaseInfoId + oldFileName;
                            source = Paths.get(oldFilePath);
                            
                            if (!Files.exists(source)) {
                                log.warn("替代路徑的源檔案也不存在: " + oldFilePath);
                                return fileRepository.save(existingFile); // 無法重命名，但仍更新數據庫
                            }
                        } else {
                            return fileRepository.save(existingFile); // 無法重命名，但仍更新數據庫
                        }
                    }
                    
                    // 新檔案路徑
                    String newFileName = existingFile.getFileName();
                    if (!newFileName.toLowerCase().endsWith(".m4a")) {
                        newFileName += ".m4a";
                    }
                    
                    String newFilePath = staticResourcePath + "/files/" + existingFile.getCaseInfo().getCaseInfoId() + newFileName;
                    Path target = Paths.get(newFilePath);
                    
                    // 創建目標目錄（如果不存在）
                    Files.createDirectories(target.getParent());
                    
                    // 重命名檔案
                    Files.move(source, target, StandardCopyOption.REPLACE_EXISTING);
                    log.info("檔案重命名成功: 從 " + oldFilePath + " 到 " + newFilePath);
                } catch (IOException e) {
                    log.error("檔案重命名失敗: " + e.getMessage(), e);
                    // 記錄錯誤但繼續處理
                }
            }
            
            File savedFile = fileRepository.save(existingFile);
            
            // 異步調用其他API
            CompletableFuture.runAsync(() -> {
                try {
                    callExternalApi(savedFile.getCaseInfo().getCaseInfoId(), request.getTotalText());
                } catch (Exception e) {
                    // 記錄異常但不影響主流程
                    log.error("異步調用API失敗: " + e.getMessage(), e);
                }
            });
            
            return savedFile;
        }
    }
    
    // 獲取靜態資源目錄的實際路徑
    private String getStaticResourcePath() {
        try {
            // 方法1：使用 ResourceLoader 獲取 (如果使用 Spring)
            // Resource resource = resourceLoader.getResource("classpath:static");
            // return resource.getFile().getAbsolutePath();
            
            // 方法2：基於當前應用程序配置獲取
            // 對於 Spring Boot 應用，檢查配置中的 spring.web.resources.static-locations
            String configuredPath = System.getProperty("app.static-resources-path");
            if (configuredPath != null && !configuredPath.isEmpty()) {
                return configuredPath;
            }
            
            // 方法3：使用預設位置
            // 通常 Spring Boot 的靜態資源目錄在這些位置之一
            String[] commonPaths = {
                System.getProperty("user.dir") + "/src/main/resources/static",
                System.getProperty("user.dir") + "/target/classes/static",
                System.getProperty("user.dir") + "/static",
                System.getProperty("catalina.base") + "/webapps/ROOT/static",
                "/home/app/static" // 適用於 Docker 容器
            };
            
            for (String path : commonPaths) {
                if (Files.exists(Paths.get(path))) {
                    return path;
                }
            }
            
            // 方法4：如果以上都不適用，使用當前工作目錄
            return System.getProperty("user.dir");
        } catch (Exception e) {
            log.error("無法確定靜態資源路徑: " + e.getMessage(), e);
            return System.getProperty("user.dir"); // 返回默認值
        }
    }

    private void callExternalApi(String fileName,String audioTexts){
        webClient
            .post()
            .uri("http://localhost:7000/api/ai/rebuild-vector/"+fileName)
            .bodyValue(new AudioTextRequest(audioTexts))
            .retrieve()
            .bodyToMono(String.class)
            .block();
    }

    public void deleteToVector(String fileName){
        webClient
                .delete()
                .uri("http://localhost:7000/api/ai/delete_vector/"+fileName)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
    

    // 刪除單一檔案
    public void deleteFileById(Integer fileId,String caseInfoId) {
        CompletableFuture.runAsync(()->{
            File file = fileRepository.findById(fileId).orElse(null);
            //執行刪除操作
            CompletableFuture<Void> dbDelete = CompletableFuture.runAsync(() -> {
                if (file != null) {
                    fileRepository.delete(file);
                }
            }, executorService);
            //刪除向量資料庫檔案
            CompletableFuture<Void> vectorDelete = CompletableFuture.runAsync(() -> {
               deleteToVector(caseInfoId);
            });

            //刪除檔案
            CompletableFuture<Void> fileProcess = CompletableFuture.runAsync(() -> {
                String fileName = file.getCaseInfo().getCaseInfoId() + file.getFileName();
                String fileExtension = fileName.substring(fileName.lastIndexOf("."));
                deleteFileFromStaticFolder(fileName+fileExtension);
            }, executorService);
            CompletableFuture.allOf(dbDelete,fileProcess).join();
        },executorService);
    }
}
