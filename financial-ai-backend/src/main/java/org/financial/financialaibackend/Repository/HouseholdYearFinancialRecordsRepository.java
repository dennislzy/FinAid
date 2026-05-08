package org.financial.financialaibackend.Repository;


import org.financial.financialaibackend.Entity.HouseholdYearFinancialRecords;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HouseholdYearFinancialRecordsRepository extends CrudRepository<HouseholdYearFinancialRecords, String>{

    Optional<HouseholdYearFinancialRecords> findByFinancialYearRecordsId(String financialYearRecordsId);

    List<HouseholdYearFinancialRecords> findByFinancialCategoryAndFinancialTypeAndYearAndCaseInfo_CaseInfoId(String financialCategory, String financialType, Integer year,String caseInfoId);

    List<HouseholdYearFinancialRecords> findByCaseInfo_CaseInfoIdAndYearAndFinancialType(
    String caseInfoId, Integer year, String financialType);



        @Query("SELECT  h FROM HouseholdYearFinancialRecords h" +
                " WHERE h.financialType=:financialType AND h.year=:year AND h.caseInfo.caseInfoId=:caseInfoId" +
                " ORDER BY h.yearCreate")
        List<HouseholdYearFinancialRecords> searchHouseholdYearRecords(
                @Param("financialType") String financialType,
                @Param("year") Integer year,
                @Param("caseInfoId") String caseInfoId
        );

        // ✅ 更新 summary_chart 統計依據從 financialCategory → financialType
        @Query("SELECT h.year, h.financialType, SUM(h.money) " +
        "FROM HouseholdYearFinancialRecords h " +
        "WHERE h.caseInfo.caseInfoId = :caseInfoId " +
        "GROUP BY h.year, h.financialType " +
        "ORDER BY h.year ASC")
        List<Object[]> getYearlySummaryByType(@Param("caseInfoId") String caseInfoId);

        // ✅ 更新查找邏輯順序（Type 優先）
        List<HouseholdYearFinancialRecords> findByFinancialTypeAndFinancialCategoryAndYearAndCaseInfo_CaseInfoId(
        String financialCategory,
        String financialType,
        Integer year,
        String caseInfoId
        );

        //年度流動資產和非流動資產圓餅圖
        @Query("SELECT h.financialCategory, SUM(h.money) " +
        "FROM HouseholdYearFinancialRecords h " +
        "WHERE h.caseInfo.caseInfoId = :caseInfoId AND h.year = :year AND h.financialType = '資產' " +
        "GROUP BY h.financialCategory")
        List<Object[]> getAssetDistributionByType(
        @Param("caseInfoId") String caseInfoId,
        @Param("year") Integer year
        );
        
        //年度資產各細項圓餅圖
        @Query("SELECT h.financialCategory, SUM(h.money) " +
        "FROM HouseholdYearFinancialRecords h " +
        "WHERE h.caseInfo.caseInfoId = :caseInfoId AND h.year = :year AND h.financialType = '資產' " +
        "GROUP BY h.financialCategory")
        List<Object[]> getAssetDistributionByCategory(
                @Param("caseInfoId") String caseInfoId, 
                @Param("year") Integer year
                );

        // 年度負債各細項圓餅圖
        @Query("SELECT h.financialCategory, SUM(h.money) " +
        "FROM HouseholdYearFinancialRecords h " +
        "WHERE h.caseInfo.caseInfoId = :caseInfoId AND h.year = :year AND h.financialType = '負債' " +
        "GROUP BY h.financialCategory")
        List<Object[]> getLiabilityDistributionByCategory(
                @Param("caseInfoId") String caseInfoId,
                @Param("year") Integer year
        );


}
