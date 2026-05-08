package org.financial.financialaibackend.BL;

import java.util.List;

import org.financial.financialaibackend.Dto.BondInsertRequest;
import org.financial.financialaibackend.Dto.BondResponse;
import org.financial.financialaibackend.Dto.BondUpdateRequest;
import org.financial.financialaibackend.Dto.common.FilterObject;
import org.financial.financialaibackend.Dto.common.Result;
import org.financial.financialaibackend.Entity.Bond;
import org.financial.financialaibackend.Entity.CaseInfo;
import org.financial.financialaibackend.Repository.BondRepository;
import org.financial.financialaibackend.Repository.CaseInfoRepository;
import org.financial.financialaibackend.Utils.EntityModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class BondBL {

    @Autowired
    private BondRepository bondRepository;

    @Autowired
    private CaseInfoRepository caseInfoRepository;

    @Autowired
    private EntityModelMapper entityModelMapper;

    // 新增債券
    public BondResponse insertBond(String caseInfoId, BondInsertRequest request) {
        CaseInfo caseInfo = caseInfoRepository.findById(caseInfoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "個案不存在: " + caseInfoId));

        Bond bond = entityModelMapper.map(request, Bond.class);
        bond.setCaseInfo(caseInfo);

        Bond savedBond = bondRepository.save(bond);
        return mapToResponse(savedBond);
    }

    // 更新債券
    public BondResponse updateBond(Integer bondId, BondUpdateRequest request) {
        Bond bond = bondRepository.findById(bondId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "債券記錄不存在: " + bondId));

        entityModelMapper.map(request, bond);

        Bond updatedBond = bondRepository.save(bond);
        return mapToResponse(updatedBond);
    }

    // 刪除債券
    public void deleteBond(Integer bondId) {
        if (!bondRepository.existsById(bondId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "債券記錄不存在: " + bondId);
        }
        bondRepository.deleteById(bondId);
    }

    // 查詢單筆債券
    public BondResponse getBondById(Integer bondId) {
        Bond bond = bondRepository.findById(bondId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "債券記錄不存在: " + bondId));

        return mapToResponse(bond);
    }

    // 查詢個案的所有債券 (篩選 & 分頁)
    public List<BondResponse> getAllBonds(String caseInfoId) {
        List<Bond> bonds = bondRepository.findAllByCaseInfo_CaseInfoId(caseInfoId);
        return bonds.stream().map(this::mapToResponse).toList();
    }
    

    // 將 Bond Entity 轉換為 BondResponse DTO
    private BondResponse mapToResponse(Bond bond) {
        BondResponse response = new BondResponse();
        response.setBondId(bond.getBondId());
        response.setBondName(bond.getBondName());
        response.setCompanyName(bond.getCompanyName());
        response.setMoney(bond.getMoney());
        response.setApplyTime(bond.getApplyTime());
    
        // 只保留 caseInfoId
        if (bond.getCaseInfo() != null) {
            CaseInfo caseInfo = new CaseInfo();
            caseInfo.setCaseInfoId(bond.getCaseInfo().getCaseInfoId()); // 只填入 caseInfoId
            response.setCaseInfo(caseInfo);
        }
    
        return response;
    }
    
}
