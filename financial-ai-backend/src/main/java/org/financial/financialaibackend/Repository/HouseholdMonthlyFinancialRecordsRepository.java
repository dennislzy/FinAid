package org.financial.financialaibackend.Repository;


import org.financial.financialaibackend.Entity.HouseholdMonthlyFinancialRecords;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HouseholdMonthlyFinancialRecordsRepository extends CrudRepository<HouseholdMonthlyFinancialRecords, String>{


        List<HouseholdMonthlyFinancialRecords> findByCaseInfo_CaseInfoIdAndYearAndFinancialType(
        String caseInfoId, Integer year, String financialType);
        @Query("SELECT h FROM HouseholdMonthlyFinancialRecords h " +
                "WHERE h.financialCategory = :category " +
                "AND h.financialType = :type " +
                "AND h.monthly = :month " +
                "AND h.year = :year " +
                "AND h.caseInfo.caseInfoId = :caseId")
        List<HouseholdMonthlyFinancialRecords> findRecordsByAllCriteria(
                @Param("category") String financialCategory,
                @Param("type") String financialType,
                @Param("month") Integer monthly,
                @Param("year") Integer year,
                @Param("caseId") String caseInfoId
        );

        @Query("SELECT h FROM HouseholdMonthlyFinancialRecords h " +
                "WHERE h.financialCategory = :category " +
                "AND h.financialType = :type " +
                "AND h.monthly = :month " +
                "AND h.year = :year " +
                "AND h.caseInfo.caseInfoId = :caseId")
        List<HouseholdMonthlyFinancialRecords> findRecordsNotMoney(
                @Param("category") String financialCategory,
                @Param("type") String financialType,
                @Param("month") Integer monthly,
                @Param("year") Integer year,
                @Param("caseId") String caseInfoId
        );

        @Query("SELECT h FROM HouseholdMonthlyFinancialRecords h" +
                " WHERE h.financialType=:financialType AND h.monthly=:monthly AND h.caseInfo.caseInfoId=:caseInfoId AND h.year=:year")
        List<HouseholdMonthlyFinancialRecords> searchHouseholdMonthlyRecords(
                @Param("financialType") String financialType,
                @Param("monthly") Integer monthly,
                @Param("year") Integer year,
                @Param("caseInfoId") String caseInfoId
        );

        @Query("SELECT h FROM HouseholdMonthlyFinancialRecords h" +
        " WHERE h.financialType=:financialType AND h.monthly=:monthly AND h.caseInfo.caseInfoId=:caseInfoId AND h.year=:year")
        List<HouseholdMonthlyFinancialRecords> searchHouseholdMonthlyRecords(
        @Param("year") Integer year,
        @Param("monthly") Integer monthly,
        @Param("financialType") String financialType,
        @Param("caseInfoId") String caseInfoId
        );


        // ✅ 新增：查詢某年度各月份的收支總額（用於折線圖）
        @Query("SELECT h.monthly, h.financialType, SUM(h.money) " +
        "FROM HouseholdMonthlyFinancialRecords h " +
        "WHERE h.caseInfo.caseInfoId = :caseInfoId " +
        "AND h.year = :year " +
        "GROUP BY h.monthly, h.financialType " +
        "ORDER BY h.monthly ASC")
        List<Object[]> getMonthlySummaryByMonthAndType(
        @Param("caseInfoId") String caseInfoId,
        @Param("year") Integer year
        );

        //把月資料依年度加總
        @Query("SELECT h.year, h.financialType, SUM(h.money) " +
        "FROM HouseholdMonthlyFinancialRecords h " +
        "WHERE h.caseInfo.caseInfoId = :caseInfoId " +
        "GROUP BY h.year, h.financialType " +
        "ORDER BY h.year ASC")
        List<Object[]> getMonthlyYearlySummaryByType(@Param("caseInfoId") String caseInfoId);
        
        
}
