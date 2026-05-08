package org.financial.financialaibackend.Dto.insurance;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.financial.financialaibackend.Enums.InsuranceType;

@Data
public class InsuranceListInsertRequest {

    @NotNull
    public InsuranceType insuranceType;

    @NotNull
    public String familyMember;

    @NotNull
    public String insuranceCompanyName;


    @Min(0)
    public Integer amount;

    @Min(0)
    public Integer annualPremium;
}
