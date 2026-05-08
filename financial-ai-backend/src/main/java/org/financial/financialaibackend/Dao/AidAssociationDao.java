package org.financial.financialaibackend.Dao;

import java.util.List;

import org.financial.financialaibackend.Dto.bidding.BiddingRecordsResponse;
import org.financial.financialaibackend.Enums.AidAssociationStatus;

public interface AidAssociationDao {

    // 根據 caseInfoId 和狀態查詢 AidAssociation
    List<BiddingRecordsResponse> getAidAssociations(String caseInfoId, AidAssociationStatus isDead);

    // 計算某個案件的 AidAssociation 總數
    Integer countAidAssociations(String caseInfoId, AidAssociationStatus isDead);
}
