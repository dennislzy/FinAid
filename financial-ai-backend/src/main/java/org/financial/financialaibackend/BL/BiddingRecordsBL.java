package org.financial.financialaibackend.BL;

import java.util.List;
import java.util.Optional;

import org.financial.financialaibackend.Dao.AidAssociationDao;
import org.financial.financialaibackend.Dto.bidding.BiddingRecordsInsertRequest;
import org.financial.financialaibackend.Dto.bidding.BiddingRecordsResponse;
import org.financial.financialaibackend.Dto.bidding.BiddingRecordsUpdateRequest;
import org.financial.financialaibackend.Dto.common.FilterObject;
import org.financial.financialaibackend.Dto.common.Message;
import org.financial.financialaibackend.Dto.common.Result;
import org.financial.financialaibackend.Entity.BiddingRecords;
import org.financial.financialaibackend.Entity.CaseInfo;
import org.financial.financialaibackend.Enums.AidAssociationStatus;
import org.financial.financialaibackend.Repository.AidAssociationRepository;
import org.financial.financialaibackend.Utils.EntityModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class BiddingRecordsBL {

    @Autowired
    private AidAssociationRepository aidAssociationRepository;

    @Autowired
    private AidAssociationDao aidAssociationDao;

    @Autowired
    private EntityModelMapper entityModelMapper;




    // 新增 AidAssociation
    public BiddingRecordsResponse insert(String caseInfoId, BiddingRecordsInsertRequest insertRequest) {

        BiddingRecords aidAssociation = entityModelMapper.map(insertRequest, BiddingRecords.class);
        CaseInfo caseInfo=new CaseInfo();
        caseInfo.setCaseInfoId(caseInfoId);
        aidAssociation.setCaseInfo(caseInfo); // 關聯 CaseInfo

        BiddingRecords savedAssociation = aidAssociationRepository.save(aidAssociation); // 資料庫自增主鍵
        return convertToResponse(caseInfoId, savedAssociation);
    }

    // 更新 AidAssociation
    public BiddingRecordsResponse update(Long aidAssociationId, BiddingRecordsUpdateRequest updateRequest) {
        Optional<BiddingRecords> optionalAidAssociation = aidAssociationRepository.findById(aidAssociationId);
        if (optionalAidAssociation.isPresent()) {
            BiddingRecords aidAssociation = optionalAidAssociation.get();
            entityModelMapper.map(updateRequest, aidAssociation); // 更新對應欄位
            aidAssociationRepository.save(aidAssociation);
            return convertToResponse(aidAssociation.getCaseInfo().getCaseInfoId(), aidAssociation);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "AidAssociation 不存在");
        }
    }

    // 刪除 AidAssociation
    public Message delete(Long aidAssociationId) {
        Optional<BiddingRecords> optionalAidAssociation = aidAssociationRepository.findById(aidAssociationId);
        if (optionalAidAssociation.isPresent()) {
            aidAssociationRepository.delete(optionalAidAssociation.get());
            return new Message("刪除成功");
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "AidAssociation 不存在");
        }
    }

    public List<BiddingRecordsResponse> getAll(String caseInfoId) {
        List<BiddingRecords> all = aidAssociationRepository.findAllByCaseInfo_CaseInfoId(caseInfoId);
        return all.stream().map(r -> convertToResponse(caseInfoId, r)).toList();
    }
    

    // 計算 AidAssociations 總數
    public Integer count(String caseInfoId, AidAssociationStatus isDead) {
        return aidAssociationDao.countAidAssociations(caseInfoId, isDead);
    }

    private BiddingRecordsResponse convertToResponse(String caseInfoId, BiddingRecords aidAssociation) {
        if (aidAssociation == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "AidAssociation 為空");
        }
        BiddingRecordsResponse response = entityModelMapper.map(aidAssociation, BiddingRecordsResponse.class);

        // 設置 CaseInfo 到 Response
        CaseInfo caseInfo = new CaseInfo();
        caseInfo.setCaseInfoId(caseInfoId);
        response.setCaseInfo(caseInfo);

        return response;
    }
}
