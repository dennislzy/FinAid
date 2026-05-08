package org.financial.financialaibackend.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.financial.financialaibackend.Entity.keys.FundInvestId;
import org.financial.financialaibackend.Enums.InvestmentMethod;
@Entity
@Table(name = "fund_invest")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class FundInvest {

    @EmbeddedId
    public FundInvestId fundInvestId;

    @Column(name = "issuer")
    public String issuer;

    @Column(name = "investmentMethod")
    public InvestmentMethod investmentMethod;

    @Column(name = "investmentAmount")
    public Integer investmentAmount;

    @Column(name = "isForeign")
    public String isForeign;

}
