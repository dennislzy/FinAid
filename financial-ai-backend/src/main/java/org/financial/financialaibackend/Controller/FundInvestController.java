package org.financial.financialaibackend.Controller;

import jakarta.validation.Valid;

import java.util.List;

import org.financial.financialaibackend.BL.CaseInfoBL;
import org.financial.financialaibackend.BL.FundInvestBL;
import org.financial.financialaibackend.BL.SocialWorkerBL;
import org.financial.financialaibackend.Dto.*;
import org.financial.financialaibackend.Dto.common.FilterObject;
import org.financial.financialaibackend.Dto.common.Result;
import org.financial.financialaibackend.Dto.fund.FundInvestInsertRequest;
import org.financial.financialaibackend.Dto.fund.FundInvestResponse;
import org.financial.financialaibackend.Dto.fund.FundUpdateRequest;
import org.financial.financialaibackend.Entity.CaseInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/{socialWorkerEmail}/case/{caseInfoId}")
public class FundInvestController {

    @Autowired
    private FundInvestBL fundInvestBl;

    @Autowired
    private CaseInfoBL caseInfoBl;

    @Autowired
    private SocialWorkerBL socialWorkerBl;


    @PostMapping("/fund")
    public ResponseEntity<Object> save(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @RequestBody @Valid FundInvestInsertRequest fundInvestInsertRequest)
    {
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        final CaseInfo caseInfo = caseInfoBl.checkCaseInfo(caseInfoId);
        FundInvestResponse fundInvestResponse = fundInvestBl.insert(caseInfo, fundInvestInsertRequest);
        return ResponseEntity.ok(fundInvestResponse);
    }

    @PatchMapping("/fund/{fundName}/{fundPurchaseDate}")
    public ResponseEntity<Object> update(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @PathVariable String fundName,
            @PathVariable String fundPurchaseDate,
            @RequestBody @Valid FundUpdateRequest fundUpdateRequest)
    {
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        final CaseInfo caseInfo = caseInfoBl.checkCaseInfo(caseInfoId);
        FundInvestResponse fundInvestResponse = fundInvestBl.update(caseInfo, fundName,fundPurchaseDate, fundUpdateRequest);
        return ResponseEntity.ok(fundInvestResponse);
    }

    @DeleteMapping("/fund/{fundName}/{fundPurchaseDate}")
    public ResponseEntity<Object> delete(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @PathVariable String fundName,
            @PathVariable String fundPurchaseDate
    ){
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        final CaseInfo caseInfo = caseInfoBl.checkCaseInfo(caseInfoId);
        FundInvestResponse fundInvestResponse = fundInvestBl.delete(caseInfo, fundName, fundPurchaseDate);
        return ResponseEntity.ok(fundInvestResponse);
    }

    @GetMapping("/fund")
    public ResponseEntity<Object> getAll(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId
    ) {
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        final CaseInfo caseInfo = caseInfoBl.checkCaseInfo(caseInfoId);
        List<FundInvestResponse> list = fundInvestBl.getAllFundInvest(caseInfo);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/fund/{fundName}/{fundPurchaseDate}")
    public ResponseEntity<Object> get(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @PathVariable String fundName,
            @PathVariable String fundPurchaseDate
    ){
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        final CaseInfo caseInfo = caseInfoBl.checkCaseInfo(caseInfoId);

        FundInvestResponse fundInvest = fundInvestBl.getFundInvest(caseInfo, fundName, fundPurchaseDate);
        return ResponseEntity.ok(fundInvest);
    }
}
