package org.financial.financialaibackend.BL;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import org.financial.financialaibackend.Dao.InsuranceListDao;
import org.financial.financialaibackend.Dto.insurance.InsuranceListInsertRequest;
import org.financial.financialaibackend.Dto.insurance.InsuranceListResponse;
import org.financial.financialaibackend.Dto.insurance.InsuranceListUpdateRequest;
import org.financial.financialaibackend.Entity.CaseInfo;
import org.financial.financialaibackend.Entity.InsuranceList;
import org.financial.financialaibackend.Entity.keys.InsuranceListId;
import org.financial.financialaibackend.Enums.InsuranceType;
import org.financial.financialaibackend.Repository.CaseInfoRepository;
import org.financial.financialaibackend.Repository.InsuranceListRepository;
import org.financial.financialaibackend.Utils.EntityModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class InsuranceListBL {

    @Autowired
    private CaseInfoRepository caseInfoRepository;

    @Autowired
    private InsuranceListRepository insuranceListRepository;

    @Autowired
    private InsuranceListDao insuranceListDao;

    @Autowired
    private EntityModelMapper entityModelMapper;

    public InsuranceListResponse insert(String caseInfoId, InsuranceListInsertRequest insertRequest) {
        CaseInfo caseInfo = caseInfoRepository.findByCaseInfoId(caseInfoId).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "找不到個案")
        );
        // 檢查是否已經存在相同成員+保險公司 + 保險類型的資料
        Optional<InsuranceList> existing = insuranceListRepository.findByCaseInfo_CaseInfoIdAndInsuranceCompanyNameAndInsuranceTypeAndFamilyMember(
            caseInfoId,
            insertRequest.getInsuranceCompanyName(),
            insertRequest.getInsuranceType(),
            insertRequest.getFamilyMember()
        );
        if (existing.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "此保險公司已經有相同類型的保險，不可重複新增");
        }
        
        InsuranceList insuranceList = entityModelMapper.map(insertRequest, InsuranceList.class);
        insuranceList.setCaseInfo(caseInfo);
    
        InsuranceList saved = insuranceListRepository.save(insuranceList);
        return convertToInsuranceListResponse(caseInfoId, saved);
    }

    public InsuranceListResponse deleteInsuranceList(Long insuranceId) {
        InsuranceList insuranceList = insuranceListRepository.findById(insuranceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "找不到保險"));
        insuranceListRepository.deleteById(insuranceId);
        return convertToInsuranceListResponse(insuranceList.getCaseInfo().getCaseInfoId(), insuranceList);
    }

    public InsuranceListResponse updateInsuranceList(Long insuranceId, InsuranceListUpdateRequest updateRequest) {
        InsuranceList insuranceList = insuranceListRepository.findById(insuranceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "找不到保險"));
    
        entityModelMapper.map(updateRequest, insuranceList);
        InsuranceList saved = insuranceListRepository.save(insuranceList);
        return convertToInsuranceListResponse(saved.getCaseInfo().getCaseInfoId(), saved);
    }

    public List<InsuranceListResponse> getInsuranceList(String caseInfoId, InsuranceType insuranceType) {
        List<InsuranceListResponse> insuranceListResponses = insuranceListDao.getInsuranceList(caseInfoId, insuranceType);
        if (insuranceListResponses.isEmpty()){
            return Collections.emptyList();
        }
        insuranceListResponses.forEach(insuranceListResponse -> {
            CaseInfo caseInfo = new CaseInfo();
            caseInfo.setCaseInfoId(caseInfoId);
            insuranceListResponse.setCaseInfo(caseInfo);
        });
        return insuranceListResponses;
    }

    public Integer countInsurance(InsuranceType insuranceType,String caseInfoId){
        Integer countInsuranceList = insuranceListDao.countInsuranceList(insuranceType, caseInfoId);
        return Objects.requireNonNullElse(countInsuranceList, 0);
    }

    public List<InsuranceListResponse> searchInsuranceList(String caseInfoId, String keyword) {
        List<InsuranceList> insuranceLists = insuranceListRepository.searchByKeyword(caseInfoId, keyword);
        
        if (insuranceLists.isEmpty()) {
            return Collections.emptyList();
        }
    
        return insuranceLists.stream()
                .map(insuranceList -> convertToInsuranceListResponse(caseInfoId, insuranceList))
                .toList();
    }
    

    private InsuranceListResponse convertToInsuranceListResponse(String caseInfoId,InsuranceList insuranceList){
        if (insuranceList==null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Insurance List is null");
        }
        InsuranceListResponse insuranceListResponse=entityModelMapper.mapWithLooseStrategy(insuranceList, InsuranceListResponse.class);
        CaseInfo caseInfo1=new CaseInfo();
        caseInfo1.setCaseInfoId(caseInfoId);
        
        insuranceListResponse.setCaseInfo(caseInfo1);
        return insuranceListResponse;
    }

    public List<Map<String, Object>> getInsuranceAmountPerPersonAndType(String caseInfoId) {
        List<Object[]> resultList = insuranceListRepository.getInsuranceAmountPerPersonAndType(caseInfoId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (Object[] row : resultList) {
            Map<String, Object> record = new HashMap<>();
            record.put("familyMember", row[0]);
            record.put("insuranceType", row[1].toString());
            record.put("amount", ((Number) row[2]).intValue());
            result.add(record);
        }

        return result;
    }



}
