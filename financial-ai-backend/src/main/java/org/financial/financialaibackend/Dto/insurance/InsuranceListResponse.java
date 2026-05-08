package org.financial.financialaibackend.Dto.insurance;

import lombok.Data;
import org.financial.financialaibackend.Entity.CaseInfo;
import org.financial.financialaibackend.Enums.InsuranceType;

@Data
public class InsuranceListResponse {

    public Long insuranceId;

    public InsuranceType insuranceType;

    public String familyMember;

    public Integer amount;

    public Integer annualPremium;

    public CaseInfo caseInfo;

    public String insuranceCompanyName;

}
