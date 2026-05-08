package org.financial.financialaibackend.Dao.impl;

import java.util.List;

import org.financial.financialaibackend.Dao.InsuranceListDao;
import org.financial.financialaibackend.Dto.insurance.InsuranceListResponse;
import org.financial.financialaibackend.Enums.InsuranceType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;
@Component
public class InsuranceListDaoimpl implements InsuranceListDao {

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;


    @Override
    public List<InsuranceListResponse> getInsuranceList(String caseInfoId, InsuranceType insuranceType) {
        // 定義 SQL 查詢語句
        String sql = """
        SELECT i.insuranceId,i.amount, i.annualPremium, i.insuranceType, i.familyMember, i.insuranceCompanyName
        FROM Insurance_list i
        WHERE i.caseInfoId = :caseInfoId 
    """;

        //設定參數
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("caseInfoId", caseInfoId);
        if (insuranceType!=null){
            sql+= " AND i.insuranceType = :insuranceType";
            params.addValue("insuranceType", insuranceType.getValue());
        }
        System.out.println(sql);
        // 查詢並映射結果
        return namedParameterJdbcTemplate.query(sql, params, (rs, rowNum) -> {
            InsuranceListResponse response = new InsuranceListResponse();
            response.setInsuranceId(rs.getLong("insuranceId"));
            response.setAmount(rs.getInt("amount"));
            response.setAnnualPremium(rs.getInt("annualPremium"));
            response.setInsuranceType(InsuranceType.fromValue(rs.getString("insuranceType")));
            response.setInsuranceCompanyName(rs.getString("insuranceCompanyName"));
            response.setFamilyMember(rs.getString("familyMember"));
            return response;
        });
    }

    @Override
    public Integer countInsuranceList(InsuranceType insuranceType, String caseInfoId) {
        // 初始化 SQL 查詢語句
        StringBuilder sql = new StringBuilder("""
        SELECT count(*) AS total 
        FROM Insurance_list i 
        WHERE i.caseInfoId = :caseInfoId
    """);

        // 設定參數
        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("caseInfoId", caseInfoId);

        // 動態添加條件
        if (insuranceType != null) {
            sql.append(" AND i.insuranceType = :insuranceType");
            params.addValue("insuranceType", insuranceType.getValue());
        }

        // 查詢計數
        return namedParameterJdbcTemplate.queryForObject(sql.toString(), params, Integer.class);
    }

}
