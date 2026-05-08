package org.financial.financialaibackend.Repository;

import java.util.List;
import java.util.Optional;

import org.financial.financialaibackend.Entity.CaseInfo;
import org.modelmapper.internal.bytebuddy.asm.Advice.OffsetMapping.Sort;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CaseInfoRepository extends JpaRepository<CaseInfo, String> {

    Optional<CaseInfo> findByCaseInfoId(String caseInfoId);

    Optional<CaseInfo> findByCaseInfoIdentificationOrCaseInfoPhone(String caseInfoIdentification,String caseInfoPhone);

    //查詢那個社工還有沒有個案
    boolean existsBySocialWorker_SocialWorkerId(String socialWorkerId);

    List<CaseInfo> findAllBySocialWorker_SocialWorkerEmail(String socialWorkerEmail);

    List<CaseInfo> findBySocialWorker_SocialWorkerEmailAndCaseInfoNameContainingIgnoreCase(String socialWorkerEmail, String caseInfoName);


    @Modifying
    @Query("UPDATE CaseInfo c SET c.socialWorker = (SELECT s FROM SocialWorker s WHERE s.socialWorkerEmail = :newSocialWorkerEmail) WHERE c.caseInfoId IN :caseInfoIds")
    void reassignSelectedCases(@Param("caseInfoIds") List<String> caseInfoIds, @Param("newSocialWorkerEmail") String newSocialWorkerEmail);

    @Query("SELECT c FROM CaseInfo c WHERE c.socialWorker.socialWorkerEmail = :socialWorkerEmail")
    List<CaseInfo> findBySocialWorker_SocialWorkerEmail(@Param("socialWorkerEmail") String socialWorkerEmail);

    @Query("""
    SELECT c FROM CaseInfo c 
    WHERE 
        (LOWER(c.caseInfoName) LIKE LOWER(CONCAT('%', :keyword, '%')) 
        OR LOWER(c.caseInfoEnglishName) LIKE LOWER(CONCAT('%', :keyword, '%')) 
        OR LOWER(c.caseInfoEmail) LIKE LOWER(CONCAT('%', :keyword, '%')) 
        OR LOWER(c.caseInfoIdentification) LIKE LOWER(CONCAT('%', :keyword, '%')))
        AND c.socialWorker.socialWorkerPermission = 'BASIC'
    """)
    List<CaseInfo> findCasesByKeyword(@Param("keyword") String keyword);

    @Query("SELECT c FROM CaseInfo c WHERE c.socialWorker.socialWorkerId IN :socialWorkerIds")
    List<CaseInfo> findBySocialWorkerIds(@Param("socialWorkerIds") List<String> socialWorkerIds);






 
}
