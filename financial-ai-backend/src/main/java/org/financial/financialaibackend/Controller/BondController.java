package org.financial.financialaibackend.Controller;

import jakarta.validation.Valid;
import org.financial.financialaibackend.BL.CaseInfoBL;
import org.financial.financialaibackend.BL.SocialWorkerBL;

import java.util.List;

import org.financial.financialaibackend.BL.BondBL;
import org.financial.financialaibackend.Dto.*;
import org.financial.financialaibackend.Dto.common.FilterObject;
import org.financial.financialaibackend.Dto.common.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/{socialWorkerEmail}/case/{caseInfoId}/bond")
public class BondController {

    @Autowired
    private SocialWorkerBL socialWorkerBl;

    @Autowired
    private CaseInfoBL caseInfoBl;

    @Autowired
    private BondBL bondBL;

    // 新增債券
    @PostMapping
    public ResponseEntity<BondResponse> insertBond(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @RequestBody @Valid BondInsertRequest request) {
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        caseInfoBl.checkCaseInfo(caseInfoId);
        BondResponse response = bondBL.insertBond(caseInfoId, request);
        return ResponseEntity.ok(response);
    }

    // 更新債券
    @PatchMapping("/{bondId}")
    public ResponseEntity<BondResponse> updateBond(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @PathVariable Integer bondId,
            @RequestBody @Valid BondUpdateRequest request) {
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        caseInfoBl.checkCaseInfo(caseInfoId);
        BondResponse response = bondBL.updateBond(bondId, request);
        return ResponseEntity.ok(response);
    }

    // 刪除債券
    @DeleteMapping("/{bondId}")
    public ResponseEntity<String> deleteBond(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @PathVariable Integer bondId) {
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        caseInfoBl.checkCaseInfo(caseInfoId);
        bondBL.deleteBond(bondId);
        return ResponseEntity.ok("債券已成功刪除");
    }

    // 查詢單筆債券
    @GetMapping("/{bondId}")
    public ResponseEntity<BondResponse> getBondById(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @PathVariable Integer bondId) {
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        caseInfoBl.checkCaseInfo(caseInfoId);
        BondResponse response = bondBL.getBondById(bondId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<BondResponse>> getAllBonds(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId
    ) {
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        caseInfoBl.checkCaseInfo(caseInfoId);
        List<BondResponse> bonds = bondBL.getAllBonds(caseInfoId);
        return ResponseEntity.ok(bonds);
    }

}
