package org.financial.financialaibackend.Controller;

import java.util.Map;

import org.financial.financialaibackend.BL.CaseInfoBL;
import org.financial.financialaibackend.Entity.CaseInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/case")  
public class CaseAssignController {

    @Autowired
    private CaseInfoBL caseInfoBl;

    @PutMapping("/{caseInfoId}/assign")
    public ResponseEntity<CaseInfo> reassignCase(
            @PathVariable String caseInfoId,
            @RequestBody Map<String, String> request
    ) {
        String newSocialWorkerEmail = request.get("newSocialWorkerEmail");
        CaseInfo updatedCase = caseInfoBl.reassignCaseToNewSocialWorker(caseInfoId, newSocialWorkerEmail);
        return ResponseEntity.ok(updatedCase);
    }

    //批次更新
    @PutMapping("/reassign")
    public ResponseEntity<Object> reassignSelectedCases(
            @RequestBody Map<String, Object> request
    ) {
        List<String> caseInfoIds = (List<String>) request.get("caseInfoIds");
        String newSocialWorkerEmail = (String) request.get("newSocialWorkerEmail");

        caseInfoBl.reassignSelectedCases(caseInfoIds, newSocialWorkerEmail);
        Map<String,String> message = new HashMap<>();
        message.put("message", "選擇的個案已重新分配給 " +newSocialWorkerEmail);
        return ResponseEntity.ok(message);
    }
    
}
