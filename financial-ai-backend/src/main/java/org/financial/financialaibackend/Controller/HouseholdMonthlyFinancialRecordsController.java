package org.financial.financialaibackend.Controller;

import java.util.List;
import java.util.Map;

import org.financial.financialaibackend.BL.CaseInfoBL;
import org.financial.financialaibackend.BL.SocialWorkerBL;
import org.financial.financialaibackend.Dto.common.Message;
import org.financial.financialaibackend.Dto.household.HouseholdMonthlyInsertRequest;
import org.financial.financialaibackend.Dto.household.HouseholdMonthlyUpdateRequest;
import org.financial.financialaibackend.Entity.CaseInfo;
import org.financial.financialaibackend.Entity.HouseholdMonthlyFinancialRecords;
import org.financial.financialaibackend.BL.HouseholdMonthlyFinancialRecordsBL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/{socialWorkerEmail}/case/{caseInfoId}/household_monthly_financial_records")
public class HouseholdMonthlyFinancialRecordsController {


    @Autowired
    private SocialWorkerBL socialWorkerBl;

    @Autowired
    private CaseInfoBL caseInfoBl;

    @Autowired
    private HouseholdMonthlyFinancialRecordsBL householdMonthlyFinancialRecordsBl;

    @PostMapping
    public ResponseEntity<Object> save(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @RequestBody @Valid HouseholdMonthlyInsertRequest householdMonthlyInsertRequest) {
        // 查看社工是否註冊
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);

        // 查看個案是否註冊
        CaseInfo caseInfo = caseInfoBl.checkCaseInfo(caseInfoId);

        // 插入記錄
        HouseholdMonthlyFinancialRecords savedRecord = householdMonthlyFinancialRecordsBl.insert(caseInfo, householdMonthlyInsertRequest);
        return ResponseEntity.ok(savedRecord);
    }

    @PatchMapping("/{financialMonthlyRecordsId}")
    public ResponseEntity<Object> update(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @PathVariable String financialMonthlyRecordsId,
            @RequestBody @Valid HouseholdMonthlyUpdateRequest householdMonthlyUpdateRequest) {

        // 查看社工是否註冊
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);

        // 查看個案是否註冊
        CaseInfo caseInfo = caseInfoBl.checkCaseInfo(caseInfoId);

        // 更新記錄
        HouseholdMonthlyFinancialRecords updatedRecord = householdMonthlyFinancialRecordsBl.update(caseInfo, householdMonthlyUpdateRequest, financialMonthlyRecordsId);
        return ResponseEntity.ok(updatedRecord);
    }

    @DeleteMapping
    public ResponseEntity<Object> batchDelete(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @RequestBody List<String> financialMonthlyRecordsIds) {
    
        // 查看社工是否註冊
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
    
        // 查看個案是否註冊
        caseInfoBl.checkCaseInfo(caseInfoId);

        Message deleteMessage = householdMonthlyFinancialRecordsBl.batchDelete(financialMonthlyRecordsIds);
        return ResponseEntity.ok(deleteMessage);
    }


    @GetMapping
    public ResponseEntity<Object> get(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @RequestParam(value = "financialType") String financialType,
            @RequestParam(value = "monthly") Integer monthly,
            @RequestParam(value = "year") Integer year
            ) {

        // 查看社工是否註冊
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);

        // 查看個案是否註冊
        CaseInfo caseInfo = caseInfoBl.checkCaseInfo(caseInfoId);

        // 查詢記錄
        List<HouseholdMonthlyFinancialRecords> records = householdMonthlyFinancialRecordsBl.get(caseInfo, financialType, monthly,year);
        return ResponseEntity.ok(records);
    }

    // 在新增每月收支統計的折線圖
    @GetMapping("/monthly_summary_chart")
    public ResponseEntity<Object> getMonthlySummaryChartByYear(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @RequestParam Integer year) {
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        CaseInfo caseInfo = caseInfoBl.checkCaseInfo(caseInfoId);
        List<Map<String, Object>> summary = householdMonthlyFinancialRecordsBl.getMonthlySummaryChartByYear(caseInfo, year);
        return ResponseEntity.ok(summary);
    }

    //dashboard裡的月結餘折線圖
    @GetMapping("/monthly_balance_chart")
    public ResponseEntity<Object> getMonthlyIncomeExpenseBalanceChart(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @RequestParam Integer year) {
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        CaseInfo caseInfo = caseInfoBl.checkCaseInfo(caseInfoId);
        List<Map<String, Object>> chart = householdMonthlyFinancialRecordsBl.getMonthlyIncomeExpenseBalanceChart(caseInfo, year);
        return ResponseEntity.ok(chart);
    }
    

}
