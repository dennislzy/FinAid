package org.financial.financialaibackend.Controller;

import java.util.List;
import java.util.Map;

import org.financial.financialaibackend.BL.CaseInfoBL;
import org.financial.financialaibackend.BL.InsuranceListBL;
import org.financial.financialaibackend.BL.SocialWorkerBL;
import org.financial.financialaibackend.Dto.insurance.InsuranceListInsertRequest;
import org.financial.financialaibackend.Dto.insurance.InsuranceListResponse;
import org.financial.financialaibackend.Dto.insurance.InsuranceListUpdateRequest;
import org.financial.financialaibackend.Enums.InsuranceType;
import org.springframework.beans.factory.annotation.Autowired;
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

import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/{socialWorkerEmail}/case/{caseInfoId}/insurance")
public class InsuranceListController {


    @Autowired
    private SocialWorkerBL socialWorkerBl;

    @Autowired
    private CaseInfoBL caseInfoBl;
    @Autowired
    private InsuranceListBL insuranceListBl;

    @PostMapping
    public ResponseEntity<Object> save(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @RequestBody @Valid InsuranceListInsertRequest insuranceListInsertRequest
            ){
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);

        caseInfoBl.checkCaseInfo(caseInfoId);

        InsuranceListResponse insuranceListResponse = insuranceListBl.insert(caseInfoId, insuranceListInsertRequest);

        return ResponseEntity.ok(insuranceListResponse);
    }

    @DeleteMapping("/{insuranceId}")
    public ResponseEntity<Object> delete(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @PathVariable Long insuranceId
    ){
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        caseInfoBl.checkCaseInfo(caseInfoId);

        InsuranceListResponse response = insuranceListBl.deleteInsuranceList(insuranceId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{insuranceId}")
    public ResponseEntity<Object> update(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @PathVariable Long insuranceId,
            @RequestBody InsuranceListUpdateRequest updateRequest
    ){
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        caseInfoBl.checkCaseInfo(caseInfoId);

        InsuranceListResponse response = insuranceListBl.updateInsuranceList(insuranceId, updateRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<Object> searchInsuranceList(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @RequestParam(value = "keyword", required = false) String keyword
    ) {
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        caseInfoBl.checkCaseInfo(caseInfoId);

        List<InsuranceListResponse> insuranceListResponses = insuranceListBl.searchInsuranceList(caseInfoId, keyword);
        return ResponseEntity.ok(insuranceListResponses);
    }


    @GetMapping
    public ResponseEntity<Object> get(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @RequestParam(value = "insuranceType",required = false) String insuranceType
    ){
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);

        caseInfoBl.checkCaseInfo(caseInfoId);

        InsuranceType insuranceTypeEnum=null;

        //將string 轉爲enum
        if (insuranceType != null) {
            insuranceTypeEnum=InsuranceType.fromValue(insuranceType);
        }

        List<InsuranceListResponse> insuranceListResponses = insuranceListBl.getInsuranceList(caseInfoId, insuranceTypeEnum);
        return ResponseEntity.ok(insuranceListResponses);
    }

    @GetMapping("/insurance_chart")
    public ResponseEntity<Object> getInsuranceAmountPerPersonAndType(
        @PathVariable String socialWorkerEmail,
        @PathVariable String caseInfoId
    ) {
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        caseInfoBl.checkCaseInfo(caseInfoId);
        List<Map<String, Object>> result = insuranceListBl.getInsuranceAmountPerPersonAndType(caseInfoId);
        return ResponseEntity.ok(result);
    }


}
