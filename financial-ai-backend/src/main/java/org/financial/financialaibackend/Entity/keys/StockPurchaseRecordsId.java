package org.financial.financialaibackend.Entity.keys;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.financial.financialaibackend.Entity.CaseInfo;

import java.io.Serializable;
import java.time.OffsetDateTime;
import java.util.Date;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StockPurchaseRecordsId implements Serializable {

    public String stockCode;

    @Temporal(TemporalType.DATE)
    public Date stockPurchaseDate;

    @JoinColumn(name = "caseInfoId")
    @ManyToOne(fetch = FetchType.LAZY)
    public CaseInfo caseInfo;

    @PrePersist
    public void onCreate(){
        stockPurchaseDate = new Date();
    }
}
