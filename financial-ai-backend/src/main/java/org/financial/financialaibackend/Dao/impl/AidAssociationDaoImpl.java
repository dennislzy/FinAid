package org.financial.financialaibackend.Dao.impl;

import java.util.List;

import org.financial.financialaibackend.Dao.AidAssociationDao;
import org.financial.financialaibackend.Dto.bidding.BiddingRecordsResponse;
import org.financial.financialaibackend.Enums.AidAssociationStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class AidAssociationDaoImpl implements AidAssociationDao {

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Override
    public List<BiddingRecordsResponse> getAidAssociations(String caseInfoId, AidAssociationStatus isDead) {
        String sql = """
            SELECT a.aidAssociationId, a.isDead, a.monthlyAmount, a.period, 
                   a.startDate, a.endDate, a.baseBidAmount, a.monthlyExtraBid, a.other
            FROM aid_association a
            WHERE a.caseInfoId = :caseInfoId
        """;

        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("caseInfoId", caseInfoId);

        if (isDead != null) {
            sql += " AND a.isDead = :isDead";
            params.addValue("isDead", isDead.getValue());
        }

        return namedParameterJdbcTemplate.query(sql, params, (rs, rowNum) -> {
            BiddingRecordsResponse response = new BiddingRecordsResponse();
            response.setAidAssociationId(rs.getString("aidAssociationId"));
            response.setIsDead(AidAssociationStatus.fromValue(rs.getString("isDead")));
            response.setMonthlyAmount(rs.getInt("monthlyAmount"));
            response.setPeriod(rs.getInt("period"));
            response.setStartDate(rs.getDate("startDate"));
            response.setEndDate(rs.getDate("endDate"));
            response.setBaseBidAmount(rs.getInt("baseBidAmount"));
            response.setMonthlyExtraBid(rs.getInt("monthlyExtraBid"));
            response.setOther(rs.getInt("other"));
            return response;
        });
    }

    @Override
    public Integer countAidAssociations(String caseInfoId, AidAssociationStatus isDead) {
 
        StringBuilder sql = new StringBuilder("""
            SELECT COUNT(*) AS total 
            FROM aid_association a 
            WHERE a.caseInfoId = :caseInfoId
        """);

        // 設定查詢參數
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("caseInfoId", caseInfoId);

        if (isDead != null) {
            sql.append(" AND a.isDead = :isDead");
            params.addValue("isDead", isDead.getValue());
        }

        // 執行查詢並返回結果
        return namedParameterJdbcTemplate.queryForObject(sql.toString(), params, Integer.class);
    }
}
