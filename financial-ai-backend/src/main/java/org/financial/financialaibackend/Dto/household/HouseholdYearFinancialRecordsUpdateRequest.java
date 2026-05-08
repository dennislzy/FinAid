package org.financial.financialaibackend.Dto.household;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdYearFinancialRecordsUpdateRequest {

    public String financialCategory;

    public String financialType;

    @Min(value = 1,message = "錢不得小於或等於零")
    public Integer money;

    @Min(0)
    public Integer year;



}
