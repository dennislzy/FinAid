package org.financial.financialaibackend.Repository;

import java.util.List;

import org.financial.financialaibackend.Entity.BiddingRecords;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AidAssociationRepository extends JpaRepository<BiddingRecords, Long> { // 主鍵類型改為 Long

    // 根據 CaseInfoId 查詢所有 AidAssociation
    List<BiddingRecords> findByCaseInfo_CaseInfoId(String caseInfoId);

    // 根據 CaseInfoId 和 IsDead 狀態查詢 AidAssociation
    List<BiddingRecords> findAllByCaseInfo_CaseInfoId(String caseInfoId);
}
