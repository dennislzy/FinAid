package org.financial.financialaibackend.Controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.financial.financialaibackend.BL.AIBL;
import org.financial.financialaibackend.BL.CaseInfoBL;
import org.financial.financialaibackend.BL.FileBL;
import org.financial.financialaibackend.BL.SocialWorkerBL;
import org.financial.financialaibackend.Dto.common.FilterObject;
import org.financial.financialaibackend.Dto.common.Message;
import org.financial.financialaibackend.Dto.common.Result;
import org.financial.financialaibackend.Dto.file.FileUpdateRequest;
import org.financial.financialaibackend.Entity.CaseInfo;
import org.financial.financialaibackend.Entity.File;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/{socialWorkerEmail}/case/{caseInfoId}")
public class AudioTextController {

    @Autowired
    private AIBL aibl;

    @Autowired
    private SocialWorkerBL socialWorkerBL;
    @Autowired
    private CaseInfoBL caseInfoBL;
    @Autowired
    private FileBL fileBL;

    @PostMapping("/audio")
    public ResponseEntity<Object> createAIBL(
            @RequestParam("audio_file") MultipartFile file,
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId
    ) throws IOException {
        // 檢查 SocialWorker 和 CaseInfo
        socialWorkerBL.checkSocialWorker(socialWorkerEmail);

        caseInfoBL.checkCaseInfo(caseInfoId);
        File handleTranscription = aibl.handleTranscription(file,caseInfoId);
        return ResponseEntity.ok(handleTranscription);
    }

    @DeleteMapping("/audio/{fileId}")
    public ResponseEntity<Object> deleteFile(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @PathVariable Integer fileId) {
        socialWorkerBL.checkSocialWorker(socialWorkerEmail);
        caseInfoBL.checkCaseInfo(caseInfoId);

        fileBL.deleteFileById(fileId,caseInfoId);
        Map<String,String> map = new HashMap<>();
        map.put("messages", "檔案已成功刪除");
        return ResponseEntity.ok(map);
    }

    @GetMapping("/audio/{fileId}")
    public ResponseEntity<Object> getFileById(
        @PathVariable Integer fileId,
        @PathVariable String caseInfoId,
        @PathVariable String socialWorkerEmail
    ){
        socialWorkerBL.checkSocialWorker(socialWorkerEmail);
        caseInfoBL.checkCaseInfo(caseInfoId);
        File file = fileBL.getFileById(fileId);
        if (file == null){
            return ResponseEntity.notFound().build();
        }else{
            return ResponseEntity.ok(file);
        }
    }

     // 查詢該個案的所有語音檔案
     @PostMapping("/audio/search")
     public ResponseEntity<Object> getAllFilesByCaseInfoId(
             @PathVariable String socialWorkerEmail,
             @PathVariable String caseInfoId,
             @RequestBody FilterObject filterObject
             ) {
         socialWorkerBL.checkSocialWorker(socialWorkerEmail);
         caseInfoBL.checkCaseInfo(caseInfoId);
         Page<File> pageFiles = fileBL.findAllFilesByCaseInfoId(caseInfoId, filterObject);
         CaseInfo caseInfo = new CaseInfo();
         caseInfo.setCaseInfoId(caseInfoId);
         List<File> content = pageFiles.getContent();
         content.forEach(file->{
            file.setCaseInfo(caseInfo);
         });
         Result result = new Result(content.size(),content,pageFiles.getTotalPages());
         return ResponseEntity.ok(result);
    }

    @PatchMapping("/audio/{fileId}")
    public ResponseEntity<Object> updateFile(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @PathVariable Integer fileId,
            @RequestBody FileUpdateRequest request) {
        socialWorkerBL.checkSocialWorker(socialWorkerEmail);
        caseInfoBL.checkCaseInfo(caseInfoId);

        File file = fileBL.updateFile(fileId, request);
        return ResponseEntity.ok(file);
    }


    private String cleanText(String raw) {
        if (raw == null) return "";
    
        return raw
            .replaceAll("<[^>]+>", "")      // 移除 HTML 標籤，如 <p>、<br>
            .replaceAll("###*", "")         // 移除 Markdown 標題符號（###、####）
            .replaceAll("\\\\n", "\n")      // 將 \n（字串）換成真正換行
            .replaceAll("&nbsp;", " ")      // 處理空白符號
            .replaceAll("\\*", "")          // 移除粗體符號（**...**）
            .trim();
    }
    
    @PostMapping("/audio/generate-pdf/{fileId}")
    public ResponseEntity<Object> generatePdf(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @PathVariable Integer fileId,
            @RequestBody FileUpdateRequest request) {

        socialWorkerBL.checkSocialWorker(socialWorkerEmail);
        caseInfoBL.checkCaseInfo(caseInfoId);

        // 🔧 清洗 summary + totalText 內容
        String summary = cleanText(request.getSummary());
        String totalText = cleanText(request.getTotalText());

        // 合併內容
        String text = "訪談逐字稿:\n" + totalText + "\n\n訪談摘要:\n" + summary;

        // 產生 PDF
        fileBL.generatePdf(text, caseInfoId + fileId);

        return ResponseEntity.ok(new Message("匯出成功"));
    }

    @PostMapping("/audio/{fileId}/regenerate-summary")
     public ResponseEntity<Object> regenerateSummary(
        @PathVariable String socialWorkerEmail,
        @PathVariable String caseInfoId,
        @PathVariable Integer fileId) {
    try {
        // 1. 檢查社工和個案
        socialWorkerBL.checkSocialWorker(socialWorkerEmail);
        caseInfoBL.checkCaseInfo(caseInfoId);

        // 2. 確認檔案存在且屬於這個個案
        File file = fileBL.getFileById(fileId);
        if (file == null || !file.getCaseInfo().getCaseInfoId().equals(caseInfoId)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "找不到檔案或檔案不屬於此個案");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        // 3. 重新生成摘要
        File updatedFile = aibl.regenerateSummary(fileId);

        // 4. 回傳更新後的檔案
        return ResponseEntity.ok(updatedFile);
    } catch (Exception e) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "重新生成摘要失敗: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}

}
