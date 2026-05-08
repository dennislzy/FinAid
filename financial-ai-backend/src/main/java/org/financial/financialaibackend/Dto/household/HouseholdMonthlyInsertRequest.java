package org.financial.financialaibackend.Dto.household;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HouseholdMonthlyInsertRequest {

    @NotBlank
    public String financialCategory;

    @Min(value = 1,message = "錢不得小於或等於零")
    public Integer money;

    @NotBlank
    public String financialType;

    @NotNull(message = "年數不可為空")
    public Integer year;

    @Min(1)
    @Max(12)
    public Integer monthly;
}
