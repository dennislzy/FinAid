package org.financial.financialaibackend.Dto.fund;

import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.financial.financialaibackend.Enums.InvestmentMethod;

import java.util.Date;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FundInvestInsertRequest {

    @NotBlank
    public String fundName;

    @NotBlank
    public String issuer;

    @NotNull
    public InvestmentMethod investmentMethod;

    @Min(0)
    public Integer investmentAmount;

    @NotBlank
    public String isForeign;

    @Temporal(TemporalType.DATE)
    @NotNull
    public Date fundPurchaseDate;
}
