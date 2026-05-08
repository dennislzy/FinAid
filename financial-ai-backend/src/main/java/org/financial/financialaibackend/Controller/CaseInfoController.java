package org.financial.financialaibackend.Controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.financial.financialaibackend.BL.CaseAnalysisBL;
import org.financial.financialaibackend.BL.CaseInfoBL;
import org.financial.financialaibackend.BL.ChatBL;
import org.financial.financialaibackend.BL.FileBL;
import org.financial.financialaibackend.BL.SocialWorkerBL;
import org.financial.financialaibackend.Dto.caseInfo.CaseInfoInsertRequest;
import org.financial.financialaibackend.Dto.caseInfo.CaseInfoUpdateRequest;
import org.financial.financialaibackend.Dto.chat.Riskment;
import org.financial.financialaibackend.Dto.common.Message;
import org.financial.financialaibackend.Entity.CaseAnalysis;
import org.financial.financialaibackend.Entity.CaseInfo;
import org.financial.financialaibackend.Entity.SocialWorker;
import org.financial.financialaibackend.Enums.AnalysisType;
import org.financial.financialaibackend.Repository.CaseInfoRepository;
import org.financial.financialaibackend.Utils.EntityModelMapper;
import org.financial.financialaibackend.Utils.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/{socialWorkerEmail}/case")
public class CaseInfoController {

    @Autowired
    private EntityModelMapper entityModelMapper;

    @Autowired
    private CaseInfoBL caseInfoBl;

    @Autowired
    private SocialWorkerBL socialWorkerBl;

    @Autowired
    private FileBL fileBL;

    @Autowired
    private CaseInfoRepository caseInfoRepository;

    @Autowired
    private ChatBL chatBL;

    @Autowired
    private  CaseAnalysisBL caseAnalysisBL;
    

    @GetMapping("/search")
    public ResponseEntity<List<CaseInfo>> findAll(
        @PathVariable("socialWorkerEmail") String socialWorkerEmail,
        @RequestParam(value = "keyword", required = false) String keyword
    ) {
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);

        List<CaseInfo> caseInfos = caseInfoBl.findAllCases(socialWorkerEmail, keyword);

        return ResponseEntity.ok(caseInfos);
    }



    @GetMapping("/{caseInfoId}")
    public ResponseEntity<CaseInfo> findById(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId)
    {
        //驗證身份
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        CaseInfo caseInfo = caseInfoBl.findCaseInfoById(caseInfoId);
        return ResponseEntity.ok(caseInfo);
    }

    @PostMapping(value = "/{caseInfoId}/uploadFile",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> uploadFile(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @RequestParam("files") MultipartFile multipartFile)
    {
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);

        caseInfoBl.checkCaseInfo(caseInfoId);

        String uploadFile = fileBL.uploadFile(multipartFile,caseInfoId);

        CaseInfoUpdateRequest caseInfoUpdateRequest = new CaseInfoUpdateRequest();

        caseInfoUpdateRequest.setCaseInfoImage(uploadFile);

        caseInfoBl.updateCaseInfoById(caseInfoId,caseInfoUpdateRequest);

        FileUtils.FileResponse fileResponse=new FileUtils.FileResponse(uploadFile,multipartFile.getContentType());

        return ResponseEntity.ok(fileResponse);
    }

    @PostMapping
    public ResponseEntity<CaseInfo> save(
            @PathVariable String socialWorkerEmail,
            @RequestBody @Valid CaseInfoInsertRequest caseInfoRequest)
    {
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        CaseInfo caseInfo = entityModelMapper.mapWithStrictStrategy(caseInfoRequest, CaseInfo.class);
        CaseInfo caseInfoResponse = caseInfoBl.insert(caseInfo, socialWorkerEmail);
        return ResponseEntity.ok(caseInfoResponse);
    }

    @DeleteMapping
    public ResponseEntity<Object> delete(
            @PathVariable String socialWorkerEmail,
            @RequestBody List<String> caseInfoIds
        ) throws IOException {
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        Message deleteMessage = caseInfoBl.deleteCaseInfoIdList(caseInfoIds);
        return ResponseEntity.ok(deleteMessage);
    }

    @PatchMapping("/{caseInfoId}")
    public ResponseEntity<CaseInfo> update(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @RequestBody @Valid CaseInfoUpdateRequest caseInfoUpdateRequest)
    {
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        return  ResponseEntity.ok(caseInfoBl.updateCaseInfoById(caseInfoId,caseInfoUpdateRequest));
    }

    @GetMapping("/searchCases")
    public ResponseEntity<List<Map<String, String>>> searchCasesWithBasicSocialWorker(
            @PathVariable String socialWorkerEmail,
            @RequestParam("keyword") String keyword
    ) {
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        
        List<Map<String, String>> results = caseInfoBl.searchCasesWithBasicSocialWorker(keyword);
        
        return ResponseEntity.ok(results);
    }

    @GetMapping("/incomestability/{caseInfoId}")
    public ResponseEntity<Map<String, Object>> getIncomeStabilityEvaluation(@PathVariable String caseInfoId) {
        Optional<CaseInfo> caseInfoOpt = caseInfoRepository.findByCaseInfoId(caseInfoId);

        if (caseInfoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> result = caseInfoBl.evaluateIncomeStability(caseInfoOpt.get());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/{caseInfoId}/dependencyratio")
    public ResponseEntity<Map<String, Object>> getDependencyRatioEvaluation(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId) {

        // 檢查社工與個案是否存在
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        CaseInfo caseInfo = caseInfoBl.checkCaseInfo(caseInfoId);

        // 呼叫 BL 計算扶養比
        Map<String, Object> result = caseInfoBl.evaluateDependencyRatio(caseInfo);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/{caseInfoId}/riskall")
    public ResponseEntity<Object> getAllRiskIndicators(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId) {

        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        CaseInfo caseInfo = caseInfoBl.checkCaseInfo(caseInfoId);

        Map<String, Object> result = caseInfoBl.getAllRiskIndicators(caseInfo);

        String riskInfo = (String) result.get("summary");

        SocialWorker socialWorker = socialWorkerBl.findByEmail(socialWorkerEmail);

        Riskment riskment = chatBL.riskment(new Message(riskInfo), caseInfoId);

        CaseAnalysis saveAnalysis = caseAnalysisBL.saveAnalysis(
                            riskment.getRisk(),
                            caseInfo,
                            socialWorker,
                            AnalysisType.RISK,
                            riskment.getLight()
        );
        return ResponseEntity.ok(saveAnalysis);
    }

    @GetMapping("/{caseInfoId}/getRisk/{analysisType}/{analysisId}")
    public ResponseEntity<Object> getCaseInfoRisk(
        @PathVariable String socialWorkerEmail,
        @PathVariable String caseInfoId,
        @PathVariable AnalysisType analysisType,
        @PathVariable Integer analysisId
        ){
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        CaseInfo caseInfo = caseInfoBl.checkCaseInfo(caseInfoId);
        CaseAnalysis analysis = caseAnalysisBL.getAnalysis(caseInfo, analysisType, (long) analysisId);
        return ResponseEntity.ok(analysis);
    }
    
    @GetMapping("/{caseInfoId}/{analysisType}/getAllRisk")
    public ResponseEntity<Object> getAllRisk(
        @PathVariable String socialWorkerEmail,
        @PathVariable String caseInfoId,
        @PathVariable AnalysisType analysisType
    ){
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        CaseInfo caseInfo = caseInfoBl.checkCaseInfo(caseInfoId);
        List<CaseAnalysis> allAnalysis = caseAnalysisBL.getAllAnalysis(caseInfoId, analysisType);
        return ResponseEntity.ok(allAnalysis);
    }
}
