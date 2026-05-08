package org.financial.financialaibackend.Repository;

import org.financial.financialaibackend.Entity.CaseAnalysis;
import org.financial.financialaibackend.Enums.AnalysisType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CaseAnalysisRepository extends JpaRepository<CaseAnalysis, Long> {
    List<CaseAnalysis> findByCaseInfo_CaseInfoIdAndAnalysisTypeOrderByCreateTimeDesc(String caseInfoId, AnalysisType type);

    Optional<CaseAnalysis> findByCaseInfo_CaseInfoIdAndAnalysisType(String caseInfoId,AnalysisType type);

     // 方案 2: 使用原生 SQL 查詢
    @Query(value = "SELECT * FROM case_analysis ca " +
                "WHERE ca.caseInfoId = :caseInfoId " +
                "AND ca.analysisType = :analysisType " +
                "AND YEAR(ca.createTime) = YEAR(:createTime) " +
                "AND MONTH(ca.createTime) = MONTH(:createTime) " +
                "AND DAY(ca.createTime) = DAY(:createTime) " +
                "AND HOUR(ca.createTime) = HOUR(:createTime) " +
                "AND MINUTE(ca.createTime) = MINUTE(:createTime) " +
                "ORDER BY ca.createTime DESC LIMIT 1", 
        nativeQuery = true)
    Optional<CaseAnalysis> findByCaseInfo_CaseInfoIdAndAnalysisTypeAndCreateTimeOrderByAnalysisIdDesc(
        @Param("caseInfoId") String caseInfoId, 
        @Param("analysisType") String analysisType, 
        @Param("createTime") LocalDateTime createTime
    );
}
