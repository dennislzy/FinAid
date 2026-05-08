package org.financial.financialaibackend.Repository;

import org.financial.financialaibackend.Entity.FundInvest;
import org.financial.financialaibackend.Entity.keys.FundInvestId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FundInvestRepository extends JpaRepository<FundInvest, FundInvestId> {

    Optional<FundInvest> findByFundInvestId(FundInvestId fundInvestId);

    List<FundInvest> findAllByFundInvestId_CaseInfo_CaseInfoId(String caseInfoId);
}
