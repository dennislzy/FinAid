package org.financial.financialaibackend.Dto.fund;


import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.financial.financialaibackend.Entity.CaseInfo;
import org.financial.financialaibackend.Enums.InvestmentMethod;

import java.util.Date;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FundInvestResponse {

    public String fundName;

    public String issuer;

    public InvestmentMethod investmentMethod;

    public Integer investmentAmount;

    public String isForeign;

    @Temporal(TemporalType.DATE)
    public Date fundPurchaseDate;

    public CaseInfo caseInfo;
}
