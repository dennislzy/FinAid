package org.financial.financialaibackend.Repository;

import java.util.List;
import java.util.Optional;

import org.financial.financialaibackend.Entity.SocialWorker;
import org.financial.financialaibackend.Enums.SocialWorkerPermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SocialWorkerRepository extends JpaRepository<SocialWorker, String> {

    Optional<SocialWorker> findBySocialWorkerEmail(String email);
    
    // 查找所有基層社工並載入他負責的個案
    List<SocialWorker> findAllBySocialWorkerPermission(SocialWorkerPermission permission);

    List<SocialWorker> findBySocialWorkerPermission(SocialWorkerPermission permission);

    List<SocialWorker> findByStatus(String status);

    List<SocialWorker> findByStatusAndSocialWorkerPermission(String status, SocialWorkerPermission permission);



    @Query("""
    SELECT s FROM SocialWorker s 
    WHERE 
        (LOWER(s.socialWorkerName) LIKE LOWER(CONCAT('%', :keyword, '%')) 
        OR LOWER(s.socialWorkerEmail) LIKE LOWER(CONCAT('%', :keyword, '%')))
        AND s.socialWorkerPermission = 'BASIC'
    """)
    List<SocialWorker> findBasicSocialWorkersByKeyword(@Param("keyword") String keyword);


}
