package org.financial.financialaibackend.Dao.impl;

import org.financial.financialaibackend.Dao.StockPurchaseRecordsDao;
import org.financial.financialaibackend.Dto.stock.StockPurchaseResponse;
import org.financial.financialaibackend.Entity.CaseInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class StockPurchaseDaoimpl implements StockPurchaseRecordsDao {

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Override
    public List<StockPurchaseResponse> getAllStockPurchaseRecords(String caseInfoId) {
        String sql= """
                SELECT s.stockCode , s.stockPurchaseDate , s.shares , s.averageBuyPrice , s.caseInfoId 
                FROM stock_purchase_records s
                JOIN case_info c ON s.caseInfoId = c.caseInfoId
                WHERE c.caseInfoId = :caseInfoId
                ORDER BY s.stockPurchaseDate DESC
                """;
        MapSqlParameterSource parameterSource = new MapSqlParameterSource();
        parameterSource.addValue("caseInfoId", caseInfoId);
        return namedParameterJdbcTemplate.query(sql, parameterSource,(rs,num)->{
            StockPurchaseResponse stockPurchaseResponse = new StockPurchaseResponse();
            stockPurchaseResponse.setStockCode(rs.getString("stockCode"));
            stockPurchaseResponse.setStockPurchaseDate(rs.getDate("stockPurchaseDate"));
            stockPurchaseResponse.setAverageBuyPrice(rs.getDouble("averageBuyPrice"));
            CaseInfo caseInfo=new CaseInfo();
            caseInfo.setCaseInfoId(rs.getString("caseInfoId"));
            stockPurchaseResponse.setCaseInfo(caseInfo);
            stockPurchaseResponse.setShares(rs.getInt("shares"));
            return stockPurchaseResponse;
        });
    }
}
