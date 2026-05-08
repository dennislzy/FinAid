package org.financial.financialaibackend.Dto.insurance;

import org.financial.financialaibackend.Enums.InsuranceType;

import jakarta.validation.constraints.Min;
import lombok.Data;
@Data
public class InsuranceListUpdateRequest {

    public InsuranceType insuranceType;
    
    public String familyMember;

    public String insuranceCompanyName;

    @Min(0)
    public Integer amount;

    @Min(0)
    public Integer annualPremium;
}
