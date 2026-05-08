package org.financial.financialaibackend.Repository;

import org.financial.financialaibackend.Entity.CaseInfo;
import org.financial.financialaibackend.Entity.HouseholdFamilyMembers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HouseholdFamilyMembersRepository extends JpaRepository<HouseholdFamilyMembers, Integer> {

    List<HouseholdFamilyMembers> findByCaseInfo(CaseInfo caseInfo);
}
