package org.financial.financialaibackend.Dto.household;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HouseholdMonthlyUpdateRequest {

    public String financialCategory;

    @Min(value = 1,message = "錢不得小於或等於零")
    public Integer money;

    public String financialType;

    public Integer year;

    @Min(1)
    @Max(12)
    public Integer monthly;
}
