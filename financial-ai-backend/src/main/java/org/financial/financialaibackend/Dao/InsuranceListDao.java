package org.financial.financialaibackend.Dao;

import org.financial.financialaibackend.Dto.insurance.InsuranceListResponse;
import org.financial.financialaibackend.Enums.InsuranceType;

import java.util.List;

public interface InsuranceListDao {

    List<InsuranceListResponse> getInsuranceList(String caseInfoId, InsuranceType insuranceType);

    Integer countInsuranceList(InsuranceType insuranceType,String caseInfoId);
}
