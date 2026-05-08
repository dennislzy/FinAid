package org.financial.financialaibackend.Controller;

import org.financial.financialaibackend.BL.CaseInfoBL;
import org.financial.financialaibackend.BL.HouseholdYearFinancialRecordsBL;
import org.financial.financialaibackend.BL.SocialWorkerBL;
import org.financial.financialaibackend.Dto.common.Message;
import org.financial.financialaibackend.Dto.household.HouseholdYearFinancialRecordsInsertRequest;
import org.financial.financialaibackend.Dto.household.HouseholdYearFinancialRecordsUpdateRequest;
import org.financial.financialaibackend.Entity.CaseInfo;
import org.financial.financialaibackend.Entity.HouseholdYearFinancialRecords;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/{socialWorkerEmail}/case/{caseInfoId}/household_year_financial_records")
public class HouseholdYearFinancialRecordsController {

    @Autowired
    private SocialWorkerBL socialWorkerBl;

    @Autowired
    private CaseInfoBL caseInfoBl;
    
    @Autowired
    private HouseholdYearFinancialRecordsBL householdYearFinancialRecordsBl;


    @PostMapping
    public ResponseEntity<Object> save(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @RequestBody @Valid HouseholdYearFinancialRecordsInsertRequest householdYearFinancialRecordsRequest
            ){
        // 查看社工是否註冊
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);

        // 查看個案是否註冊
        CaseInfo caseInfo = caseInfoBl.checkCaseInfo(caseInfoId);

        HouseholdYearFinancialRecords householdYearFinancialRecords = householdYearFinancialRecordsBl.insert(caseInfo, householdYearFinancialRecordsRequest);
        return ResponseEntity.ok(householdYearFinancialRecords);
    }

    @PatchMapping("/{financialYearRecordId}")
    public ResponseEntity<Object> update(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @PathVariable String financialYearRecordId,
            @RequestBody @Valid HouseholdYearFinancialRecordsUpdateRequest householdYearFinancialRecordsUpdateRequest) {

            //查看社工是否注冊
            socialWorkerBl.checkSocialWorker(socialWorkerEmail);

            //查看個案是否先注冊
            CaseInfo caseInfo = caseInfoBl.checkCaseInfo(caseInfoId);

        HouseholdYearFinancialRecords householdYearFinancialRecords = householdYearFinancialRecordsBl.update(caseInfo, householdYearFinancialRecordsUpdateRequest,financialYearRecordId);
        return ResponseEntity.ok(householdYearFinancialRecords);
    }
     @DeleteMapping
     public ResponseEntity<Object> delete(
             @PathVariable String socialWorkerEmail,
             @PathVariable String caseInfoId,
             @RequestBody List<String> householdYearFinancialRecordIds
             )
     {
         //查看社工是否注冊
         socialWorkerBl.checkSocialWorker(socialWorkerEmail);

         //查看個案是否先注冊
         CaseInfo caseInfo = caseInfoBl.checkCaseInfo(caseInfoId);

         Message deleteMessage = householdYearFinancialRecordsBl.delete(caseInfo, householdYearFinancialRecordIds);
         return ResponseEntity.ok(deleteMessage);
     }

    @GetMapping
    public ResponseEntity<Object> get(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @RequestParam(value = "financialType") String financialType,
            @RequestParam(value = "year") Integer year
    ){
        //查看社工是否注冊
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);

        //查看個案是否先注冊
        CaseInfo caseInfo = caseInfoBl.checkCaseInfo(caseInfoId);

        List<HouseholdYearFinancialRecords> householdYearFinancialRecords = householdYearFinancialRecordsBl.getHouseholdYearFinancialRecords(caseInfo,financialType,year);

        return ResponseEntity.ok(householdYearFinancialRecords);
    }

    // 折線圖（年度總覽）
    @GetMapping("/year_summary_chart")
    public ResponseEntity<Object> getSummaryChart(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId
    ) {
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        CaseInfo caseInfo = caseInfoBl.checkCaseInfo(caseInfoId);
        return ResponseEntity.ok(householdYearFinancialRecordsBl.getYearlySummaryChart(caseInfo));
    }

    @GetMapping("/asset_pie_chart")
    public ResponseEntity<Object> getAssetPieChart(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @RequestParam Integer year
    ) {
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        CaseInfo caseInfo = caseInfoBl.checkCaseInfo(caseInfoId);
        return ResponseEntity.ok(householdYearFinancialRecordsBl.getAssetPieChartByFlowType(caseInfo, year));
    }
    
    //年度資產各細項圓餅圖
    @GetMapping("/asset_pie_chart_by_category")
    public ResponseEntity<Object> getAssetPieChartByCategory(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @RequestParam Integer year
    ) {
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        CaseInfo caseInfo = caseInfoBl.checkCaseInfo(caseInfoId);
        return ResponseEntity.ok(householdYearFinancialRecordsBl.getAssetPieChartByCategory(caseInfo, year));
    }

    // 年度負債各細項圓餅圖
    @GetMapping("/liability_pie_chart_by_category")
    public ResponseEntity<Object> getLiabilityPieChartByCategory(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @RequestParam Integer year
    ) {
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        CaseInfo caseInfo = caseInfoBl.checkCaseInfo(caseInfoId);
        return ResponseEntity.ok(householdYearFinancialRecordsBl.getLiabilityPieChartByCategory(caseInfo, year));
    }

  @GetMapping("/debtratio")
  public ResponseEntity<Map<String, Object>> getDebtStress(
            @PathVariable String caseInfoId,
            @PathVariable String socialWorkerEmail) {
        
        Map<String, Object> result = householdYearFinancialRecordsBl.evaluateDebtStress(caseInfoId);
    return ResponseEntity.ok(result);}

    @GetMapping("/incomebalance")
    public ResponseEntity<Map<String, Object>> getIncomeBalance(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId) {

        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        caseInfoBl.checkCaseInfo(caseInfoId);

        Map<String, Object> result = householdYearFinancialRecordsBl.evaluateIncomeBalance(caseInfoId);

        return ResponseEntity.ok(result);
    }  

    @GetMapping("/networth")
    public ResponseEntity<Map<String, Object>> getNetWorthEvaluation(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId) {

        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        caseInfoBl.checkCaseInfo(caseInfoId);
        Map<String, Object> result = householdYearFinancialRecordsBl.evaluateNetWorth(caseInfoId);

        return ResponseEntity.ok(result);
    }







    
}
