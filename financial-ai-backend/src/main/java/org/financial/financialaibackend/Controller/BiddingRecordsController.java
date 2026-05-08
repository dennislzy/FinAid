package org.financial.financialaibackend.Controller;

import java.util.List;

import org.financial.financialaibackend.BL.BiddingRecordsBL;
import org.financial.financialaibackend.BL.CaseInfoBL;
import org.financial.financialaibackend.BL.SocialWorkerBL;
import org.financial.financialaibackend.Dto.*;
import org.financial.financialaibackend.Dto.bidding.BiddingRecordsInsertRequest;
import org.financial.financialaibackend.Dto.bidding.BiddingRecordsResponse;
import org.financial.financialaibackend.Dto.bidding.BiddingRecordsUpdateRequest;
import org.financial.financialaibackend.Dto.common.FilterObject;
import org.financial.financialaibackend.Dto.common.Message;
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
@RequestMapping("/api/{socialWorkerEmail}/case/{caseInfoId}/aid")
public class BiddingRecordsController {

    @Autowired
    private BiddingRecordsBL biddingRecordsBL;

    @Autowired
    private SocialWorkerBL socialWorkerBl;

    @Autowired
    private CaseInfoBL caseInfoBl;

    // 新增標會
    @PostMapping
    public ResponseEntity<BiddingRecordsResponse> insert(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @RequestBody @Valid BiddingRecordsInsertRequest insertRequest
    ) {
        // 檢查 SocialWorker 和 CaseInfo
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        caseInfoBl.checkCaseInfo(caseInfoId);

        BiddingRecordsResponse response = biddingRecordsBL.insert(caseInfoId, insertRequest);
        return ResponseEntity.ok(response);
    }

    // 更新標會
    @PatchMapping("/{aidAssociationId}")
    public ResponseEntity<BiddingRecordsResponse> update(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @PathVariable Long aidAssociationId,
            @RequestBody @Valid BiddingRecordsUpdateRequest updateRequest
    ) {
        // 檢查 SocialWorker 和 CaseInfo
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        caseInfoBl.checkCaseInfo(caseInfoId);

        BiddingRecordsResponse response = biddingRecordsBL.update(aidAssociationId, updateRequest);
        return ResponseEntity.ok(response);
    }

    // 刪除標會
    @DeleteMapping("/{aidAssociationId}")
    public ResponseEntity<Object> delete(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @PathVariable Long aidAssociationId
    ) {
        // 檢查 SocialWorker 和 CaseInfo
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);

        caseInfoBl.checkCaseInfo(caseInfoId);

        Message deleteMessage = biddingRecordsBL.delete(aidAssociationId);
        return ResponseEntity.ok(deleteMessage);
    }

    @GetMapping
    public ResponseEntity<List<BiddingRecordsResponse>> getAll(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId
    ) {
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        caseInfoBl.checkCaseInfo(caseInfoId);

        List<BiddingRecordsResponse> result = biddingRecordsBL.getAll(caseInfoId);
        return ResponseEntity.ok(result);
    }


}
