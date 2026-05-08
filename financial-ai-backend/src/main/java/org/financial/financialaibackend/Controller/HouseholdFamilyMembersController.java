package org.financial.financialaibackend.Controller;

import org.financial.financialaibackend.BL.CaseInfoBL;
import org.financial.financialaibackend.BL.HouseholdFamilyMembersBL;
import org.financial.financialaibackend.BL.SocialWorkerBL;
import org.financial.financialaibackend.Dto.family.HouseholdFamilyMembersInsertRequest;
import org.financial.financialaibackend.Dto.family.HouseholdFamilyMembersResponse;
import org.financial.financialaibackend.Dto.family.HouseholdFamilyMembersUpdateRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/{socialWorkerEmail}/case/{caseInfoId}/familymember")
public class HouseholdFamilyMembersController {

    @Autowired
    private SocialWorkerBL socialWorkerBl;

    @Autowired
    private CaseInfoBL caseInfoBl;

    @Autowired
    private HouseholdFamilyMembersBL householdFamilyMembersBL;

    @PostMapping
    public ResponseEntity<Object> save(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @RequestBody HouseholdFamilyMembersInsertRequest request) {

        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        caseInfoBl.checkCaseInfo(caseInfoId);

        HouseholdFamilyMembersResponse response = householdFamilyMembersBL.insert(caseInfoId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Object> get(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId) {

        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        caseInfoBl.checkCaseInfo(caseInfoId);

        List<HouseholdFamilyMembersResponse> responseList = householdFamilyMembersBL.findAllByCaseInfoId(caseInfoId);
        return ResponseEntity.ok(responseList);
    }

    @PatchMapping("/{memberId}")
    public ResponseEntity<Object> update(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @PathVariable Integer memberId,
            @RequestBody HouseholdFamilyMembersUpdateRequest request) {

        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        caseInfoBl.checkCaseInfo(caseInfoId);

        HouseholdFamilyMembersResponse response = householdFamilyMembersBL.update(memberId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{memberId}")
    public ResponseEntity<Object> delete(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @PathVariable Integer memberId) {

        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        caseInfoBl.checkCaseInfo(caseInfoId);

        HouseholdFamilyMembersResponse response = householdFamilyMembersBL.delete(memberId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/batch")
    public ResponseEntity<Object> saveBatch(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @RequestBody List<HouseholdFamilyMembersInsertRequest> requestList) {

        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        caseInfoBl.checkCaseInfo(caseInfoId);

        List<HouseholdFamilyMembersResponse> responseList = householdFamilyMembersBL.insertBatch(caseInfoId, requestList);
        return ResponseEntity.ok(responseList);
    }

}
