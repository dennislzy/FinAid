package org.financial.financialaibackend.Repository;

import java.util.List;
import java.util.Optional;

import org.financial.financialaibackend.Entity.InsuranceList;
import org.financial.financialaibackend.Enums.InsuranceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface InsuranceListRepository extends JpaRepository<InsuranceList, Long> {

  @Query("SELECT i FROM InsuranceList i WHERE i.caseInfo.caseInfoId = :caseInfoId AND (i.insuranceType LIKE :keyword OR i.familyMember LIKE :keyword)")
  List<InsuranceList> searchByKeyword(@Param("caseInfoId") String caseInfoId, @Param("keyword") String keyword);

  // insert 前的保險重複檢查
  Optional<InsuranceList> findByCaseInfo_CaseInfoIdAndInsuranceCompanyNameAndInsuranceTypeAndFamilyMember(
      String caseInfoId,
      String insuranceCompanyName,
      InsuranceType insuranceType,
      String familyMember
  );

  //保險長條圖
  @Query("SELECT i.familyMember, i.insuranceType, i.amount FROM InsuranceList i WHERE i.caseInfo.caseInfoId = :caseInfoId")
  List<Object[]> getInsuranceAmountPerPersonAndType(@Param("caseInfoId") String caseInfoId);
  
  


}
