package org.financial.financialaibackend.Repository;

import java.util.List;
import java.util.Optional;

import org.financial.financialaibackend.Entity.Subsidy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubsidyRepository extends JpaRepository<Subsidy, Integer> {


    // 查詢單筆補助資料
    Optional<Subsidy> findBySubsidyId(Integer subsidyId);

    List<Subsidy> findAllByCaseInfo_CaseInfoId(String caseInfoId);
}
