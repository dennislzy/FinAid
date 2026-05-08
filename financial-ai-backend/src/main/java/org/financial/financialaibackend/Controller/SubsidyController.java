package org.financial.financialaibackend.Controller;

import java.util.List;

import org.financial.financialaibackend.BL.CaseInfoBL;
import org.financial.financialaibackend.BL.SocialWorkerBL;
import org.financial.financialaibackend.BL.SubsidyBL;
import org.financial.financialaibackend.Dto.SubsidyInsertRequest;
import org.financial.financialaibackend.Dto.SubsidyResponse;
import org.financial.financialaibackend.Dto.SubsidyUpdateRequest;
import org.financial.financialaibackend.Dto.common.FilterObject;
import org.financial.financialaibackend.Dto.common.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/{socialWorkerEmail}/case/{caseInfoId}/subsidy")
public class SubsidyController {

    @Autowired
    private SocialWorkerBL socialWorkerBl;

    @Autowired
    private CaseInfoBL caseInfoBl;

    @Autowired
    private SubsidyBL subsidyBL;

    // 新增補助
    @PostMapping
    public ResponseEntity<SubsidyResponse> insertSubsidy(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @RequestBody @Valid SubsidyInsertRequest request) {
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        caseInfoBl.checkCaseInfo(caseInfoId);
        SubsidyResponse response = subsidyBL.insertSubsidy(caseInfoId, request);
        return ResponseEntity.ok(response);
    }

    
    // 更新補助
    @PatchMapping("/{subsidyId}")
    public ResponseEntity<SubsidyResponse> updateSubsidy(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @PathVariable Integer subsidyId,
            @RequestBody @Valid SubsidyUpdateRequest request) {
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        caseInfoBl.checkCaseInfo(caseInfoId);
        SubsidyResponse response = subsidyBL.updateSubsidy(subsidyId, request);
        return ResponseEntity.ok(response);
    }

    // 刪除補助
    @DeleteMapping("/{subsidyId}")
    public ResponseEntity<String> deleteSubsidy(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @PathVariable Integer subsidyId) {
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        caseInfoBl.checkCaseInfo(caseInfoId);
        subsidyBL.deleteSubsidy(subsidyId);
        return ResponseEntity.ok("補助已成功刪除");
    }

    // 查詢單筆補助
    @GetMapping("/{subsidyId}")
    public ResponseEntity<SubsidyResponse> getSubsidyById(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @PathVariable Integer subsidyId) {
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        caseInfoBl.checkCaseInfo(caseInfoId);
        SubsidyResponse response = subsidyBL.getSubsidyById(subsidyId);
        return ResponseEntity.ok(response);
    }


    // 查詢個案的所有補助 
    @GetMapping
    public ResponseEntity<List<SubsidyResponse>> getAllSubsidies(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId
    ) {
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        caseInfoBl.checkCaseInfo(caseInfoId);
        List<SubsidyResponse> result = subsidyBL.getAllSubsidies(caseInfoId);
        return ResponseEntity.ok(result);
    }
}
