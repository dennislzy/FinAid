package org.financial.financialaibackend.Entity.keys;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.financial.financialaibackend.Entity.CaseInfo;

import java.io.Serializable;
import java.util.Date;
@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FundInvestId implements Serializable {

    @JoinColumn(name = "caseInfoId")
    @ManyToOne(fetch = FetchType.LAZY)
    public CaseInfo caseInfo;

    public String fundName;

    @Temporal(TemporalType.DATE)
    public Date fundPurchaseDate;
}
