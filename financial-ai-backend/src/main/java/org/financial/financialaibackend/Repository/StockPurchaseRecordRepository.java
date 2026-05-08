package org.financial.financialaibackend.Repository;

import org.financial.financialaibackend.Entity.StockPurchaseRecord;
import org.financial.financialaibackend.Entity.keys.StockPurchaseRecordsId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockPurchaseRecordRepository extends JpaRepository<StockPurchaseRecord, StockPurchaseRecordsId> {

    Optional<StockPurchaseRecord> findByStockPurchaseRecordsId(StockPurchaseRecordsId stockPurchaseRecordsId);

    List<StockPurchaseRecord> findByStockPurchaseRecordsId_CaseInfo_CaseInfoId(String caseInfoId);

}
