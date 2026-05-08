package org.financial.financialaibackend.BL;

import org.financial.financialaibackend.Dto.common.Message;
import org.financial.financialaibackend.Dto.household.HouseholdYearFinancialRecordsInsertRequest;
import org.financial.financialaibackend.Dto.household.HouseholdYearFinancialRecordsUpdateRequest;
import org.financial.financialaibackend.Entity.CaseInfo;
import org.financial.financialaibackend.Entity.HouseholdMonthlyFinancialRecords;
import org.financial.financialaibackend.Entity.HouseholdYearFinancialRecords;
import org.financial.financialaibackend.Repository.HouseholdMonthlyFinancialRecordsRepository;
import org.financial.financialaibackend.Repository.HouseholdYearFinancialRecordsRepository;
import org.financial.financialaibackend.Utils.EntityModelMapper;
import org.financial.financialaibackend.Utils.UUIDGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.time.Year;
import java.util.*;


@Component
public class HouseholdYearFinancialRecordsBL {

    @Autowired
    private EntityModelMapper entityModelMapper;

    @Autowired
    private HouseholdYearFinancialRecordsRepository householdYearFinancialRecordsRepository;

    @Autowired
    private HouseholdMonthlyFinancialRecordsRepository householdMonthlyFinancialRecordsRepository;

    public HouseholdYearFinancialRecords insert(CaseInfo caseInfo, HouseholdYearFinancialRecordsInsertRequest request) {
        List<HouseholdYearFinancialRecords> optionalRecords = householdYearFinancialRecordsRepository
            .findByFinancialCategoryAndFinancialTypeAndYearAndCaseInfo_CaseInfoId(
                request.getFinancialType(),
                request.getFinancialCategory(),
                request.getYear(),
                caseInfo.getCaseInfoId()
            );

        if (!optionalRecords.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "不能重複新增同一項");
        } else {
            final String financialRecordsId = UUIDGenerator.generateUUID();
            HouseholdYearFinancialRecords entity = entityModelMapper.map(request, HouseholdYearFinancialRecords.class);
            entity.setFinancialYearRecordsId(financialRecordsId);
            CaseInfo caseInfoRef = new CaseInfo();
            caseInfoRef.setCaseInfoId(caseInfo.getCaseInfoId());
            entity.setCaseInfo(caseInfoRef);
            HouseholdYearFinancialRecords saved = householdYearFinancialRecordsRepository.save(entity);
            saved.setCaseInfo(caseInfoRef);
            return saved;
        }
    }

    public HouseholdYearFinancialRecords update(CaseInfo caseInfo, HouseholdYearFinancialRecordsUpdateRequest householdYearFinancialRecordsUpdateRequest,String financialRecordsId){
        final HouseholdYearFinancialRecords oldHouseholdYearFinancialRecords=get(financialRecordsId);
        HouseholdYearFinancialRecords newHouseholdYearFinancialRecords=entityModelMapper.map(householdYearFinancialRecordsUpdateRequest, HouseholdYearFinancialRecords.class);
        boolean flag=false;
        if (!Objects.equals(newHouseholdYearFinancialRecords.getFinancialCategory(), oldHouseholdYearFinancialRecords.getFinancialCategory())){
            if (get(householdYearFinancialRecordsUpdateRequest.getFinancialCategory(),householdYearFinancialRecordsUpdateRequest.getFinancialType(),householdYearFinancialRecordsUpdateRequest.getYear(),caseInfo.getCaseInfoId()).isEmpty()){
                flag=true;
            }
        }else{
            if (!Objects.equals(oldHouseholdYearFinancialRecords.getMoney(), newHouseholdYearFinancialRecords.getMoney())){
                flag=true;
            }
        }
        if (flag){
            entityModelMapper.map(newHouseholdYearFinancialRecords, oldHouseholdYearFinancialRecords);
            HouseholdYearFinancialRecords householdYearFinancialRecords = householdYearFinancialRecordsRepository.save(oldHouseholdYearFinancialRecords);
            CaseInfo caseInfo1=new CaseInfo();
            caseInfo1.setCaseInfoId(caseInfo.getCaseInfoId());
            householdYearFinancialRecords.setCaseInfo(caseInfo1);
            return householdYearFinancialRecords;
        }else{
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "該項目已新增過");
        }
    }

    public Message delete(CaseInfo caseInfo, List<String> financialRecordsIds){
        CaseInfo caseInfo1=new CaseInfo();
        caseInfo1.setCaseInfoId(caseInfo.getCaseInfoId());
        for (String financialRecordsId : financialRecordsIds) {
            if (householdYearFinancialRecordsRepository.findByFinancialYearRecordsId(financialRecordsId).isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This record does not exist");
            }
        }
        householdYearFinancialRecordsRepository.deleteAllById(financialRecordsIds);
        return  new Message("刪除成功");
    }


    public List<HouseholdYearFinancialRecords> getHouseholdYearFinancialRecords(CaseInfo caseInfo,String financialType,Integer year){
        CaseInfo caseInfo1=new CaseInfo();
        caseInfo1.setCaseInfoId(caseInfo.getCaseInfoId());
        List<HouseholdYearFinancialRecords> householdYearFinancialRecords=householdYearFinancialRecordsRepository.searchHouseholdYearRecords(financialType,year,caseInfo.getCaseInfoId());
        householdYearFinancialRecords.forEach(householdYearFinancialRecord -> {
            householdYearFinancialRecord.setCaseInfo(caseInfo1);
        });
        return householdYearFinancialRecords;
    }

    public HouseholdYearFinancialRecords get(String financialYearRecordsId){
        Optional<HouseholdYearFinancialRecords> optionalHouseholdYearFinancialRecords=householdYearFinancialRecordsRepository.findByFinancialYearRecordsId(financialYearRecordsId);
        if (optionalHouseholdYearFinancialRecords.isPresent()) {
            return optionalHouseholdYearFinancialRecords.get();
        }else{
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This record does not exist");
        }
    }

    public List<HouseholdYearFinancialRecords> get(String financialCategory, String financialType, Integer year,String caseInfoId){
        List<HouseholdYearFinancialRecords> householdYearFinancialRecordsList = householdYearFinancialRecordsRepository.findByFinancialCategoryAndFinancialTypeAndYearAndCaseInfo_CaseInfoId(financialCategory, financialType, year, caseInfoId);
        if (householdYearFinancialRecordsList.isEmpty()) {
            return new ArrayList<>();
        }else{
            return householdYearFinancialRecordsList;
        }
    }

    public List<Map<String, Object>> getYearlySummaryChart(CaseInfo caseInfo) {
    // 1. 年度資料
    List<Object[]> yearlyData = householdYearFinancialRecordsRepository.getYearlySummaryByType(caseInfo.getCaseInfoId());

    // 2. 月資料彙整成年度資料
    List<Object[]> monthlyData = householdMonthlyFinancialRecordsRepository.getMonthlyYearlySummaryByType(caseInfo.getCaseInfoId());

    Map<Integer, Map<String, Integer>> combinedMap = new TreeMap<>();

    // 將年度資料加入
    for (Object[] row : yearlyData) {
        Integer year = (Integer) row[0];
        String type = (String) row[1];
        Integer amount = ((Number) row[2]).intValue();
        combinedMap.computeIfAbsent(year, k -> new HashMap<>())
                .merge(type, amount, Integer::sum);
    }

    // 將月資料加總後合併進去
    for (Object[] row : monthlyData) {
        Integer year = (Integer) row[0];
        String type = (String) row[1];
        Integer amount = ((Number) row[2]).intValue();
        combinedMap.computeIfAbsent(year, k -> new HashMap<>())
                .merge(type, amount, Integer::sum);

    }


        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<Integer, Map<String, Integer>> entry : combinedMap.entrySet()) {
            Map<String, Object> item = new HashMap<>();
            item.put("year", entry.getKey());
            Map<String, Integer> typeMap = entry.getValue();

            int income = typeMap.getOrDefault("收入", 0);
            int expenses = typeMap.getOrDefault("支出", 0);
            int balance = income - expenses;
            
            item.put("assets", typeMap.getOrDefault("資產", 0));
            item.put("liabilities", typeMap.getOrDefault("負債", 0));
            item.put("income", typeMap.getOrDefault("收入", 0));
            item.put("expenses", typeMap.getOrDefault("支出", 0));
            item.put("balance", balance); // 年結餘
            result.add(item);
        }
        return result;
    }

    // 流動資產 非流動資產判斷
    public Map<String, Integer> getAssetPieChartByFlowType(CaseInfo caseInfo, int year) {
        List<Object[]> rawAssets = householdYearFinancialRecordsRepository.getAssetDistributionByType(caseInfo.getCaseInfoId(), year);
    
        // financialCategory 表示具體資產名稱 → 判斷流動資產
        Set<String> currentAssetCategories = Set.of(
                "活期存款",
                "定期存款",
                "貴重金屬",
                "收藏品"
        );
    
        int current = 0;
        int nonCurrent = 0;
    
        for (Object[] row : rawAssets) {
            String financialCategory = (String) row[0];  // ← 從 category 判斷
            Integer sum = ((Number) row[1]).intValue();
    
            if (currentAssetCategories.contains(financialCategory)) {
                current += sum;
            } else {
                nonCurrent += sum;
            }
        }
    
        Map<String, Integer> result = new HashMap<>();
        result.put("流動資產", current);
        result.put("非流動資產", nonCurrent);
        return result;
    }

    //年度資產各細項圓餅圖
    public Map<String, Integer> getAssetPieChartByCategory(CaseInfo caseInfo, int year) {
        List<Object[]> rawAssets = householdYearFinancialRecordsRepository.getAssetDistributionByCategory(caseInfo.getCaseInfoId(), year);
    
        Map<String, Integer> result = new LinkedHashMap<>(); // 保持順序一致
        int total = 0;

        for (Object[] row : rawAssets) {
            String category = (String) row[0];
            Integer amount = ((Number) row[1]).intValue();
            result.put(category, amount);
            total += amount;
        }
        result.put("total",total);
        return result;
    }
    
    // 年度負債各細項圓餅圖
    public Map<String, Integer> getLiabilityPieChartByCategory(CaseInfo caseInfo, int year) {
        List<Object[]> rawLiabilities = householdYearFinancialRecordsRepository.getLiabilityDistributionByCategory(caseInfo.getCaseInfoId(), year);

        Map<String, Integer> result = new LinkedHashMap<>();
        int total = 0;

        for (Object[] row : rawLiabilities) {
            String category = (String) row[0];
            Integer amount = ((Number) row[1]).intValue();
            result.put(category, amount);
            total += amount;
        }
        result.put("total", total);
        return result;
    }

    //負債指標
    public Map<String, Object> evaluateDebtStress(String caseInfoId) {
    Map<String, Object> result = new HashMap<>();

    int lastYear = Year.now().getValue() - 1;

    List<HouseholdYearFinancialRecords> assets = householdYearFinancialRecordsRepository
        .findByCaseInfo_CaseInfoIdAndYearAndFinancialType(caseInfoId, lastYear, "資產");

    List<HouseholdYearFinancialRecords> debts = householdYearFinancialRecordsRepository
        .findByCaseInfo_CaseInfoIdAndYearAndFinancialType(caseInfoId, lastYear, "負債");

    int assetLastYear = assets.stream().mapToInt(r -> r.getMoney() != null ? r.getMoney() : 0).sum();
    int debtLastYear = debts.stream().mapToInt(r -> r.getMoney() != null ? r.getMoney() : 0).sum();

    double debtRatio;
    String light;

    if (assetLastYear == 0) {
        if (debtLastYear > 0) {
            debtRatio = 1.0;
            light = "紅色";
        } else {
            debtRatio = 0.0;
            light = "綠色";
        }
    } else {
        debtRatio = (double) debtLastYear / assetLastYear;
        if (debtRatio <= 0.3) {
            light = "綠色";
        } else if (debtRatio <= 0.49) {
            light = "橘色";
        } else {
            light = "紅色";
        }
    }

    result.put("caseInfoId", caseInfoId);
    result.put("debtLastYear", debtLastYear);
    result.put("assetLastYear", assetLastYear);
    result.put("debtRatio", Math.round(debtRatio * 10000.0) / 100.0); // 取小數點兩位百分比
    result.put("debtStressLight", light);

    return result;
    }

//收支平衡的指標
public Map<String, Object> evaluateIncomeBalance(String caseInfoId) {
    Map<String, Object> result = new HashMap<>();

    int lastYear = Year.now().getValue() - 1;

    List<HouseholdYearFinancialRecords> yearIncomeRecords =
        householdYearFinancialRecordsRepository.findByCaseInfo_CaseInfoIdAndYearAndFinancialType(
            caseInfoId, lastYear, "收入");

    List<HouseholdYearFinancialRecords> yearExpenseRecords =
        householdYearFinancialRecordsRepository.findByCaseInfo_CaseInfoIdAndYearAndFinancialType(
            caseInfoId, lastYear, "支出");

    int totalYearIncome = yearIncomeRecords.stream().mapToInt(r -> r.getMoney() != null ? r.getMoney() : 0).sum();
    int totalYearExpense = yearExpenseRecords.stream().mapToInt(r -> r.getMoney() != null ? r.getMoney() : 0).sum();

    List<HouseholdMonthlyFinancialRecords> monthIncomeRecords =
        householdMonthlyFinancialRecordsRepository.findByCaseInfo_CaseInfoIdAndYearAndFinancialType(
            caseInfoId, lastYear, "收入");

    List<HouseholdMonthlyFinancialRecords> monthExpenseRecords =
        householdMonthlyFinancialRecordsRepository.findByCaseInfo_CaseInfoIdAndYearAndFinancialType(
            caseInfoId, lastYear, "支出");

    int totalMonthIncome = monthIncomeRecords.stream().mapToInt(r -> r.getMoney() != null ? r.getMoney() : 0).sum();
    int totalMonthExpense = monthExpenseRecords.stream().mapToInt(r -> r.getMoney() != null ? r.getMoney() : 0).sum();

    int totalIncome = totalYearIncome + totalMonthIncome;
    int totalExpense = totalYearExpense + totalMonthExpense;

    double savingRate = totalIncome > 0 ? (double)(totalIncome - totalExpense) / totalIncome : -1;

    String light;
    if (savingRate >= 0.10) {
        light = "綠色";
    } else if (savingRate >= 0.0) {
        light = "橘色";
    } else {
        light = "紅色";
    }

    result.put("caseInfoId", caseInfoId);
    result.put("totalIncome", totalIncome);
    result.put("totalExpense", totalExpense);
    result.put("savingRate", Math.round(savingRate * 10000.0) / 100.0); 
    result.put("incomeBalanceLight", light);

        return result;
    }

    //資產淨值
    public Map<String, Object> evaluateNetWorth(String caseInfoId) {
    Map<String, Object> result = new HashMap<>();
    int lastYear = Year.now().getValue() - 1;

    List<HouseholdYearFinancialRecords> yearAssetRecords =
        householdYearFinancialRecordsRepository.findByCaseInfo_CaseInfoIdAndYearAndFinancialType(
            caseInfoId, lastYear, "資產");

    List<HouseholdYearFinancialRecords> yearDebtRecords =
        householdYearFinancialRecordsRepository.findByCaseInfo_CaseInfoIdAndYearAndFinancialType(
            caseInfoId, lastYear, "負債");

    int totalYearAsset = yearAssetRecords.stream().mapToInt(r -> r.getMoney() != null ? r.getMoney() : 0).sum();
    int totalYearDebt = yearDebtRecords.stream().mapToInt(r -> r.getMoney() != null ? r.getMoney() : 0).sum();

    // 計算總資產、總負債與淨值
    int totalAsset = totalYearAsset ;
    int totalDebt = totalYearDebt ;
    int netWorth = totalAsset - totalDebt;

    // 燈號分類
    String light;
    if (netWorth >= 5_000_000) {
        light = "綠色";
    } else if (netWorth >= 1_000_000) {
        light = "橘色";
    } else {
        light = "紅色";
    }

    result.put("caseInfoId", caseInfoId);
    result.put("totalAsset", totalAsset);
    result.put("totalDebt", totalDebt);
    result.put("netWorth", netWorth);
    result.put("netWorthLight", light);

    return result;
}





    

}    
