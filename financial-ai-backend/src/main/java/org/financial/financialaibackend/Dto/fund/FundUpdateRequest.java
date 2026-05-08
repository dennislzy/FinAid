package org.financial.financialaibackend.Dto.fund;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.financial.financialaibackend.Enums.InvestmentMethod;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FundUpdateRequest {

    public String issuer;

    public InvestmentMethod investmentMethod;

    public Integer investmentAmount;

    public String isForeign;

}
