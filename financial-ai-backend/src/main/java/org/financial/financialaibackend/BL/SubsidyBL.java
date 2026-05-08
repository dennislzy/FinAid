package org.financial.financialaibackend.BL;

import java.util.List;

import org.financial.financialaibackend.Dto.SubsidyInsertRequest;
import org.financial.financialaibackend.Dto.SubsidyResponse;
import org.financial.financialaibackend.Dto.SubsidyUpdateRequest;
import org.financial.financialaibackend.Dto.common.FilterObject;
import org.financial.financialaibackend.Dto.common.Result;
import org.financial.financialaibackend.Entity.CaseInfo;
import org.financial.financialaibackend.Entity.Subsidy;
import org.financial.financialaibackend.Repository.CaseInfoRepository;
import org.financial.financialaibackend.Repository.SubsidyRepository;
import org.financial.financialaibackend.Utils.EntityModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SubsidyBL {

    @Autowired
    private SubsidyRepository subsidyRepository;

    @Autowired
    private CaseInfoRepository caseInfoRepository;

    @Autowired
    private EntityModelMapper entityModelMapper;

    // 新增補助
    public SubsidyResponse insertSubsidy(String caseInfoId, SubsidyInsertRequest request) {
        CaseInfo caseInfo = caseInfoRepository.findById(caseInfoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "個案不存在: " + caseInfoId));

        Subsidy subsidy = entityModelMapper.map(request, Subsidy.class);
        subsidy.setCaseInfo(caseInfo);

        Subsidy savedSubsidy = subsidyRepository.save(subsidy);
        return mapToResponse(savedSubsidy);
    }

    // 更新補助
    public SubsidyResponse updateSubsidy(Integer subsidyId, SubsidyUpdateRequest request) {
        Subsidy subsidy = subsidyRepository.findById(subsidyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "補助記錄不存在: " + subsidyId));

        entityModelMapper.map(request, subsidy);

        Subsidy updatedSubsidy = subsidyRepository.save(subsidy);
        return mapToResponse(updatedSubsidy);
    }

    // 刪除補助
    public void deleteSubsidy(Integer subsidyId) {
        if (!subsidyRepository.existsById(subsidyId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "補助記錄不存在: " + subsidyId);
        }
        subsidyRepository.deleteById(subsidyId);
    }

    // 查詢單筆補助
    public SubsidyResponse getSubsidyById(Integer subsidyId) {
        Subsidy subsidy = subsidyRepository.findById(subsidyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "補助記錄不存在: " + subsidyId));

        return mapToResponse(subsidy);
    }

    public List<SubsidyResponse> getAllSubsidies(String caseInfoId) {
        List<Subsidy> subsidies = subsidyRepository.findAllByCaseInfo_CaseInfoId(caseInfoId);
        return subsidies.stream().map(this::mapToResponse).toList();
    }

    // 將 Subsidy Entity 轉換為 SubsidyResponse DTO
    private SubsidyResponse mapToResponse(Subsidy subsidy) {
        SubsidyResponse response = new SubsidyResponse();
        response.setSubsidyId(subsidy.getSubsidyId());
        response.setSubsidyName(subsidy.getSubsidyName());
        response.setMoney(subsidy.getMoney());
        response.setApplyTime(subsidy.getApplyTime());
        response.setReceiveTime(subsidy.getReceiveTime());
    
        // 只保留 caseInfoId，其他屬性設為 null
        if (subsidy.getCaseInfo() != null) {
            CaseInfo caseInfo = new CaseInfo();
            caseInfo.setCaseInfoId(subsidy.getCaseInfo().getCaseInfoId()); // 只保留 caseInfoId
            response.setCaseInfo(caseInfo);
        }
    
        return response;
    }
    
}
