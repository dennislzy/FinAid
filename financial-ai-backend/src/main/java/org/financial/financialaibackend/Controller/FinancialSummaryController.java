package org.financial.financialaibackend.Controller;

import org.financial.financialaibackend.BL.CaseInfoBL;
import org.financial.financialaibackend.BL.FinancialSummaryBL;
import org.financial.financialaibackend.BL.SocialWorkerBL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/{socialWorkerEmail}/case/{caseInfoId}/financial_summary")
public class FinancialSummaryController {

    @Autowired
    private FinancialSummaryBL financialSummaryBL;

    @Autowired
    private CaseInfoBL caseInfoBl;

    @Autowired
    private SocialWorkerBL socialWorkerBl;

    @GetMapping("/all_dashboard")
    public ResponseEntity<Map<String, Object>> getYearlySummary(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @RequestParam("year") Integer year
    ) {
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        caseInfoBl.checkCaseInfo(caseInfoId);
        return ResponseEntity.ok(financialSummaryBL.getYearlyFinancialSummary(caseInfoId, year));
    }
    
    
    
}
