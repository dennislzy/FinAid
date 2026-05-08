package org.financial.financialaibackend.Dto.household;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdYearFinancialRecordsInsertRequest {

    @NotBlank(message = "列別不得是空值")
    public String financialCategory;

    @NotBlank(message = "類型不得是空值")
    public String financialType;

    @NotNull
    @Min(value = 1,message = "錢不得小於或等於零")
    public Integer money;

    @NotNull
    @Min(value = 1,message = "年數不得小於零")
    public Integer year;


    

}
