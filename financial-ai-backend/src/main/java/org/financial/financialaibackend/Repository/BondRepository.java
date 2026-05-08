package org.financial.financialaibackend.Repository;

import java.util.List;

import org.financial.financialaibackend.Entity.Bond;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BondRepository extends JpaRepository<Bond, Integer> {

    List<Bond> findAllByCaseInfo_CaseInfoId(String caseInfoId);

}
