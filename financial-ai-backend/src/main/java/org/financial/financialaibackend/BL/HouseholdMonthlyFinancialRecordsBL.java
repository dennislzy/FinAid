package org.financial.financialaibackend.BL;

import lombok.extern.slf4j.Slf4j;

import org.financial.financialaibackend.Dto.common.Message;
import org.financial.financialaibackend.Dto.household.HouseholdMonthlyInsertRequest;
import org.financial.financialaibackend.Dto.household.HouseholdMonthlyUpdateRequest;
import org.financial.financialaibackend.Entity.CaseInfo;
import org.financial.financialaibackend.Entity.HouseholdMonthlyFinancialRecords;
import org.financial.financialaibackend.Repository.HouseholdMonthlyFinancialRecordsRepository;
import org.financial.financialaibackend.Utils.EntityModelMapper;
import org.financial.financialaibackend.Utils.UUIDGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.TreeMap;

@Component
@Slf4j
public class HouseholdMonthlyFinancialRecordsBL {

    @Autowired
    private HouseholdMonthlyFinancialRecordsRepository householdMonthlyFinancialRecordsRepository;

    @Autowired
    private EntityModelMapper entityModelMapper;
    

    public HouseholdMonthlyFinancialRecords insert(CaseInfo caseInfo, HouseholdMonthlyInsertRequest request) {
        List<HouseholdMonthlyFinancialRecords> existingRecords = householdMonthlyFinancialRecordsRepository.findRecordsNotMoney(
                request.getFinancialCategory(),
                request.getFinancialType(),
                request.getMonthly(),
                request.getYear(), // 加上年份 ✅
                caseInfo.getCaseInfoId()
        );
        if (!existingRecords.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This record already exists");
        } else {
            String financialMonthlyRecordsId = UUIDGenerator.generateUUID();
            HouseholdMonthlyFinancialRecords record = entityModelMapper.map(request, HouseholdMonthlyFinancialRecords.class);
            record.setFinancialMonthlyRecordsId(financialMonthlyRecordsId);
            record.setCaseInfo(caseInfo);
            HouseholdMonthlyFinancialRecords householdMonthlyFinancialRecords = householdMonthlyFinancialRecordsRepository.save(record);
            CaseInfo caseInfo1=new CaseInfo();
            caseInfo1.setCaseInfoId(caseInfo.getCaseInfoId());
            householdMonthlyFinancialRecords.setCaseInfo(caseInfo1);
            return householdMonthlyFinancialRecords;
        }
    }

    public HouseholdMonthlyFinancialRecords update(CaseInfo caseInfo, HouseholdMonthlyUpdateRequest request, String financialMonthlyRecordsId) {
        final HouseholdMonthlyFinancialRecords oldHouseholdMonthlyFinancialRecords = get(financialMonthlyRecordsId);
        HouseholdMonthlyFinancialRecords newHouseholdMonthlyFinancialRecords = entityModelMapper.map(request, HouseholdMonthlyFinancialRecords.class);
        boolean flag=false;
        if (!Objects.equals(newHouseholdMonthlyFinancialRecords.getFinancialCategory(), oldHouseholdMonthlyFinancialRecords.getFinancialCategory())) {
            if(householdMonthlyFinancialRecordsRepository.findRecordsByAllCriteria(
                    newHouseholdMonthlyFinancialRecords.getFinancialCategory(),
                    newHouseholdMonthlyFinancialRecords.getFinancialType(),
                    newHouseholdMonthlyFinancialRecords.getMonthly(),
                    newHouseholdMonthlyFinancialRecords.getYear(),
                    caseInfo.getCaseInfoId()
            ).isEmpty()){
                flag=true;
            }
        }else{
            if (!Objects.equals(newHouseholdMonthlyFinancialRecords.getMoney(), oldHouseholdMonthlyFinancialRecords.getMoney())) {
                flag=true;
            }
        }
        if (flag) {
            entityModelMapper.map(newHouseholdMonthlyFinancialRecords, oldHouseholdMonthlyFinancialRecords);
            CaseInfo caseInfo1 = new CaseInfo();
            caseInfo1.setCaseInfoId(caseInfo.getCaseInfoId());
            oldHouseholdMonthlyFinancialRecords.setCaseInfo(caseInfo1);
            return householdMonthlyFinancialRecordsRepository.save(oldHouseholdMonthlyFinancialRecords);
        }else{
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "該項目類別已重複");
        }
    }
    
    public Message batchDelete(List<String> financialMonthlyRecordsIds) {
        financialMonthlyRecordsIds.forEach(financialMonthlyRecordsId->{
            Optional<HouseholdMonthlyFinancialRecords> householdMonthlyFinancialRecords=householdMonthlyFinancialRecordsRepository.findById(financialMonthlyRecordsId);
            if (householdMonthlyFinancialRecords.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This record does not exist");
            }
        });
        householdMonthlyFinancialRecordsRepository.deleteAllById(financialMonthlyRecordsIds);
        return new Message("刪除成功");
    }


    public List<HouseholdMonthlyFinancialRecords> get(CaseInfo caseInfo, String financialType, Integer monthly,Integer year) {
        List<HouseholdMonthlyFinancialRecords> records = householdMonthlyFinancialRecordsRepository.searchHouseholdMonthlyRecords(
                financialType,
                monthly,
                year,
                caseInfo.getCaseInfoId()
        );
        CaseInfo caseInfo1=new CaseInfo();
        caseInfo1.setCaseInfoId(caseInfo.getCaseInfoId());
        records.forEach(record -> record.setCaseInfo(caseInfo1));
        return records;
    }



    public HouseholdMonthlyFinancialRecords get(String householdMonthlyRecordsId) {
        Optional<HouseholdMonthlyFinancialRecords> financialRecords = householdMonthlyFinancialRecordsRepository.findById(householdMonthlyRecordsId);
        if (!financialRecords.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Record not found");
        }else {
            return financialRecords.get();
        }
    }

    //新增月裡的折線圖
    public List<Map<String, Object>> getMonthlySummaryChartByYear(CaseInfo caseInfo, Integer year) {
        List<Object[]> rawData = householdMonthlyFinancialRecordsRepository.getMonthlySummaryByMonthAndType(caseInfo.getCaseInfoId(), year);
        Map<Integer, Map<String, Integer>> monthlyData = new TreeMap<>();
        for (Object[] row : rawData) {
            Integer month = (Integer) row[0];
            String type = (String) row[1];
            Integer amount = ((Number) row[2]).intValue();
            monthlyData.computeIfAbsent(month, k -> new HashMap<>()).put(type, amount);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (int month = 1; month <= 12; month++) {
            Map<String, Object> item = new HashMap<>();
            item.put("month", String.format("%02d月", month));
            Map<String, Integer> typeMap = monthlyData.getOrDefault(month, new HashMap<>());
            item.put("income", typeMap.getOrDefault("收入", 0));
            item.put("expense", typeMap.getOrDefault("支出", 0));
            result.add(item);
        }
        return result;
    }

    //dashboard月結餘折線圖
    public List<Map<String, Object>> getMonthlyIncomeExpenseBalanceChart(CaseInfo caseInfo, Integer year) {
        List<Object[]> rawData = householdMonthlyFinancialRecordsRepository.getMonthlySummaryByMonthAndType(caseInfo.getCaseInfoId(), year);
        Map<Integer, Map<String, Integer>> monthlyData = new TreeMap<>();
    
        for (Object[] row : rawData) {
            Integer month = (Integer) row[0];
            String type = (String) row[1];
            Integer amount = ((Number) row[2]).intValue();
            monthlyData.computeIfAbsent(month, k -> new HashMap<>()).put(type, amount);
        }
    
        List<Map<String, Object>> result = new ArrayList<>();
        for (int month = 1; month <= 12; month++) {
            Map<String, Object> item = new HashMap<>();
            item.put("month", String.format("%02d月", month));
    
            Map<String, Integer> typeMap = monthlyData.getOrDefault(month, new HashMap<>());
            int income = typeMap.getOrDefault("收入", 0);
            int expense = typeMap.getOrDefault("支出", 0);
            int balance = income - expense;
    
            item.put("income", income);
            item.put("expense", expense);
            item.put("balance", balance);
    
            result.add(item);
        }
        return result;
    }
    



}
