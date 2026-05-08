package org.financial.financialaibackend.Repository;

import java.util.Optional;
import org.financial.financialaibackend.Entity.File;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileRepository extends JpaRepository<File, Integer> {


    Optional<File> findByFileId(Integer fileId);

    Page<File> findByCaseInfo_CaseInfoId(String caseInfoId, Pageable pageable);

    Page<File> findByCaseInfo_CaseInfoIdAndFileNameContainingIgnoreCase(
            String caseInfoId, 
            String fileName, 
            Pageable pageable
    );
}
