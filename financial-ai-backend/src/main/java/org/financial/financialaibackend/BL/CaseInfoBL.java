package org.financial.financialaibackend.BL;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.financial.financialaibackend.Dto.caseInfo.CaseInfoUpdateRequest;
import org.financial.financialaibackend.Dto.common.FilterObject;
import org.financial.financialaibackend.Dto.common.Message;
import org.financial.financialaibackend.Entity.CaseInfo;
import org.financial.financialaibackend.Entity.HouseholdFamilyMembers;
import org.financial.financialaibackend.Entity.SocialWorker;
import org.financial.financialaibackend.Enums.EmploymentType;
import org.financial.financialaibackend.Repository.CaseInfoRepository;
import org.financial.financialaibackend.Repository.HouseholdFamilyMembersRepository;
import org.financial.financialaibackend.Repository.SocialWorkerRepository;
import org.financial.financialaibackend.Utils.AttributeCheck;
import org.financial.financialaibackend.Utils.EntityModelMapper;
import org.financial.financialaibackend.Utils.UUIDGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import jakarta.transaction.Transactional;
@Component
public class CaseInfoBL {

    @Autowired
    private CaseInfoRepository caseInfoRepository;

    @Autowired
    private EntityModelMapper entityModelMapper;

    @Autowired
    private SocialWorkerRepository socialWorkerRepository;

    @Autowired
    private HouseholdFamilyMembersRepository householdFamilyMembersRepository;

    @Autowired
    private HouseholdYearFinancialRecordsBL householdYearFinancialRecordsBL;

    
    
    
    
    //查詢單一個案資料
    public CaseInfo findCaseInfoById(String caseInfoId) {
    
        // 查詢資料庫是否存在該個案
        return caseInfoRepository.findById(caseInfoId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "個案不存在，ID: " + caseInfoId));

    }


    public List<CaseInfo> findAllCases(String socialWorkerEmail, String keyword) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            return caseInfoRepository.findBySocialWorker_SocialWorkerEmailAndCaseInfoNameContainingIgnoreCase(
                socialWorkerEmail, keyword
            );
        } else {
            return caseInfoRepository.findAllBySocialWorker_SocialWorkerEmail(socialWorkerEmail);
        }
    }
    
    
    

    //新增caseInfo
    public CaseInfo insert(CaseInfo caseInfo, String socialWorkerEmail){
        //設置主鍵
        final String caseInfoId= UUIDGenerator.generateUUID();
        caseInfo.setCaseInfoId(caseInfoId);

        SocialWorker socialWorker=socialWorkerRepository.findBySocialWorkerEmail(socialWorkerEmail).orElse(null);
        caseInfo.setSocialWorker(socialWorker);
        boolean flag=true;
        if (!caseInfo.getCaseInfoPhone().isEmpty()){
            boolean validTaiwanMobile = AttributeCheck.isValidTaiwanMobile(caseInfo.getCaseInfoPhone());
            boolean validTaiwanLandline = AttributeCheck.isValidTaiwanLandline(caseInfo.getCaseInfoPhone());
            if (!validTaiwanMobile || !validTaiwanLandline){
                flag=false;
            }
        }
        if(flag){
            return caseInfoRepository.save(caseInfo);
        }else{
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"格式不符合規範");
        }
    }

    //查看身份證和電話號碼是否重複
    public boolean checkCaseInfoIdentificationExists(String caseInfoIdentification, String caseInfoPhone){
        Optional<CaseInfo> caseInfo = caseInfoRepository.findByCaseInfoIdentificationOrCaseInfoPhone(caseInfoIdentification,caseInfoPhone);
        return caseInfo.isPresent();
    }

    //刪除caseInfo
    public Message deleteCaseInfoIdList(List<String> idList) throws IOException {
        List<String> fileUrlList=new ArrayList<>();
        idList.forEach(id->{
            Optional<CaseInfo> caseInfo = caseInfoRepository.findByCaseInfoId(id);
            if(!caseInfo.isPresent()){
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"caseInfo not exists");
            }
            if (caseInfo.get().getCaseInfoImage()!=null){
                fileUrlList.add(caseInfo.get().getCaseInfoImage());
            }
        });
        if (!fileUrlList.isEmpty()){
            List<String> fileNameList = fileUrlList
                    .stream()
                    .map(fileUrl -> fileUrl.split("/")[fileUrl.split("/").length - 1])
                    .toList();
        }
        caseInfoRepository.deleteAllById(idList);
        return new Message("刪除成功");
    }

    //更新caseInfo
    public CaseInfo updateCaseInfoById(String caseInfoId, CaseInfoUpdateRequest caseInfoUpdateRequest){
        if (AttributeCheck.notNull(caseInfoUpdateRequest)){
            Optional<CaseInfo> caseInfoOptional = caseInfoRepository.findByCaseInfoId(caseInfoId);
            if (caseInfoOptional.isPresent()){
                CaseInfo caseInfo = caseInfoOptional.get();
                entityModelMapper.map(caseInfoUpdateRequest,caseInfo);
                return caseInfoRepository.save(caseInfo);
            }else{
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Case info not found");
            }
        }else{
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Case info 沒有做更新");
        }
    }

    public CaseInfo checkCaseInfo(String caseInfoId){
        Optional<CaseInfo> caseInfo = caseInfoRepository.findByCaseInfoId(caseInfoId);
        CaseInfo caseInfoEntity = new CaseInfo();
        if (caseInfo.isPresent()){
            caseInfoEntity.setCaseInfoId(caseInfo.get().getCaseInfoId());
            caseInfoEntity.setCaseInfoName(caseInfo.get().getCaseInfoName());
            return caseInfoEntity;
        }else{
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Case info not found");
        }
    }

    public List<Map<String, String>> searchCasesWithBasicSocialWorker(String keyword) {
        List<CaseInfo> caseList = caseInfoRepository.findCasesByKeyword(keyword);
    
        return caseList.stream()
            .map(caseInfo -> Map.of(
                "caseInfoName", caseInfo.getCaseInfoName(),
                "caseInfoEnglishName", caseInfo.getCaseInfoEnglishName(),
                "caseInfoEmail", caseInfo.getCaseInfoEmail(),
                "caseInfoIdentification", caseInfo.getCaseInfoIdentification(),
                "socialWorkerName", caseInfo.getSocialWorker().getSocialWorkerName(),
                "socialWorkerEmail", caseInfo.getSocialWorker().getSocialWorkerEmail()
            ))
            .collect(Collectors.toList());
    }
    
    public CaseInfo reassignCaseToNewSocialWorker(String caseInfoId, String newSocialWorkerEmail) {
        Optional<CaseInfo> caseInfoOptional = caseInfoRepository.findByCaseInfoId(caseInfoId);
        Optional<SocialWorker> newSocialWorkerOptional = socialWorkerRepository.findBySocialWorkerEmail(newSocialWorkerEmail);
    
        if (!caseInfoOptional.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "個案不存在，ID: " + caseInfoId);
        }
    
        if (!newSocialWorkerOptional.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "您要指派的社工不存在，Email: " + newSocialWorkerEmail);
        }
    
        CaseInfo caseInfo = caseInfoOptional.get();
        caseInfo.setSocialWorker(newSocialWorkerOptional.get()); 
        return caseInfoRepository.save(caseInfo);
    }

    @Transactional
    public void reassignSelectedCases(List<String> caseInfoIds, String newSocialWorkerEmail) {
        Optional<SocialWorker> newWorker = socialWorkerRepository.findBySocialWorkerEmail(newSocialWorkerEmail);

        if (!newWorker.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "新社工不存在: " + newSocialWorkerEmail);
        }

        if (caseInfoIds == null || caseInfoIds.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "請提供要轉移的個案 ID");
        }

        caseInfoRepository.reassignSelectedCases(caseInfoIds, newSocialWorkerEmail);
    }

    // 收入穩定度指標的邏輯
    public Map<String, Object> evaluateIncomeStability(CaseInfo caseInfo) {
        Map<String, Object> result = new HashMap<>();

        String lightColor;
        EmploymentType type = caseInfo.getEmploymentType();
        Integer months = caseInfo.getStableMonths();

        if (type == EmploymentType.FULL_TIME && months != null && months >= 6) {
            lightColor = "綠色";
        } else if ((type == EmploymentType.PART_TIME || type == EmploymentType.SELF_EMPLOYED || type == EmploymentType.TEMPORARY)
                || (months != null && months > 0)) {
            lightColor = "橘色";
        } else {
            lightColor = "紅色";
        }

        result.put("caseInfoId", caseInfo.getCaseInfoId());
        result.put("employmentType", type != null ? type.getValue() : null);
        result.put("stableMonths", months);
        result.put("caseInfoCareer", caseInfo.getCaseInfoCareer());
        result.put("incomeStabilityLight", lightColor);

        return result;
    }

    //扶養比
    public Map<String, Object> evaluateDependencyRatio(CaseInfo caseInfo) {
    Map<String, Object> result = new HashMap<>();

    List<HouseholdFamilyMembers> members = householdFamilyMembersRepository.findByCaseInfo(caseInfo);

    Map<String, Object> incomeResult = this.evaluateIncomeStability(
    caseInfoRepository.findByCaseInfoId(caseInfo.getCaseInfoId()).orElseThrow());

    String light = ((String) incomeResult.get("incomeStabilityLight")).trim();

    long incomeCount = 0;
    long supportedCount = 0;
    if ("紅色".equals(light)) {
        supportedCount += 1;
    } else {
        incomeCount += 1;
    }
    incomeCount += members.stream()
        .filter(m -> m.isIncome())
        .count();

    supportedCount += members.stream()
        .filter(m -> m.isSupported())
        .count();

    double ratio = incomeCount > 0 ? (double) supportedCount / incomeCount : 0.0;

    String lightColor;
    
    if (incomeCount == 0) {
        ratio =0; 
        lightColor = "紅色";
    } else {
        ratio = (double) supportedCount / incomeCount;
        if (ratio <= 1.0) {
            lightColor = "綠色";
        } else if (ratio < 2.0) {
            lightColor = "橘色";
        } else {
            lightColor = "紅色";
        }
    }
    result.put("caseInfoId", caseInfo.getCaseInfoId());
    result.put("incomeCount", incomeCount);
    result.put("supportedCount", supportedCount);
    result.put("dependencyRatio", Math.round(ratio * 100.0) / 100.0);
    result.put("dependencyLight", lightColor);

    List<Map<String, Object>> memberList = members.stream().map(m -> {
        Map<String, Object> memberData = new HashMap<>();
        memberData.put("memberId", m.getMemberId());
        memberData.put("name", m.getName());
        memberData.put("relationshipToCase", m.getRelationshipToCase());
        memberData.put("yearSalary", m.getYearSalary());
        return memberData;
    }).toList();
    result.put("familyMembers", memberList);

    return result;
}


    public Map<String, Object> getAllRiskIndicators(CaseInfo caseInfo) {
    Map<String, Object> result = new HashMap<>();
    result.put("caseInfoId", caseInfo.getCaseInfoId());

    // 收入穩定度
    Map<String, Object> income = evaluateIncomeStability(
        caseInfoRepository.findByCaseInfoId(caseInfo.getCaseInfoId()).orElseThrow());


    // 負債壓力
    Map<String, Object> debt = householdYearFinancialRecordsBL.evaluateDebtStress(caseInfo.getCaseInfoId());


    // 收支平衡
    Map<String, Object> balance = householdYearFinancialRecordsBL.evaluateIncomeBalance(caseInfo.getCaseInfoId());


    // 資產淨值
    Map<String, Object> netWorth = householdYearFinancialRecordsBL.evaluateNetWorth(caseInfo.getCaseInfoId());


    // 扶養比
    Map<String, Object> dependency = evaluateDependencyRatio(caseInfo);


    // 先處理家庭成員列表字串
    List<Map<String, Object>> members = (List<Map<String, Object>>) dependency.get("familyMembers");

    StringBuilder memberDetails = new StringBuilder();
    if (members != null && !members.isEmpty()) {
        memberDetails.append("其中家庭成員如下：");
        for (Map<String, Object> m : members) {
            String relation = (String) m.get("relationshipToCase");
            String name = (String) m.get("name");
            Integer salary = (Integer) m.get("yearSalary");
            memberDetails.append(String.format("- %s：%s，平均年收入 %d 元", relation, name, salary));
        }
    }

    // 組出完整 summary
    String summary = String.format(
        "%s個案風險評估如下：一、收入穩定度為%s（就業型態為%s，持續%d個月）；" +
        "二、負債壓力為%s（去年總負債%d元、去年總資產%d元，負債比為%.1f）；" +
        "三、收支平衡為%s（去年總收入%d元、去年總支出%d元，儲蓄率為%.1f%%）；" +
        "四、資產淨值為%s（淨資產%d元）；" +
        "五、扶養比為%s（%d人有收入，%d人由個案扶養，扶養比為%.2f）。%s",

        caseInfo.getCaseInfoId(),

        income.get("incomeStabilityLight"),
        income.get("employmentType"),
        income.get("stableMonths") != null ? income.get("stableMonths") : 0,

        debt.get("debtStressLight"),
        debt.get("debtLastYear"),
        debt.get("assetLastYear"),
        debt.get("debtRatio"),

        balance.get("incomeBalanceLight"),
        balance.get("totalIncome"),
        balance.get("totalExpense"),
        balance.get("savingRate"),

        netWorth.get("netWorthLight"),
        netWorth.get("netWorth"),

        dependency.get("dependencyLight"),
        dependency.get("incomeCount"),
        dependency.get("supportedCount"),
        dependency.get("dependencyRatio"),
        
        memberDetails.toString().trim() // 加在最後
    );

    result.put("summary", summary);

    return result;
}



}
