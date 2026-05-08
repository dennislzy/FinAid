package org.financial.financialaibackend.Dao;

import java.util.List;

import org.financial.financialaibackend.Dto.stock.StockPurchaseResponse;

public interface StockPurchaseRecordsDao {

    public List<StockPurchaseResponse> getAllStockPurchaseRecords(String caseInfoId);
}
