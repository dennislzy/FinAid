package org.financial.financialaibackend.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.financial.financialaibackend.Entity.keys.StockPurchaseRecordsId;
@Entity
@Table(name = "stock_purchase_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class StockPurchaseRecord {

    @EmbeddedId
    public StockPurchaseRecordsId stockPurchaseRecordsId;

    @Column(name = "shares")
    public Integer shares;

    @Column(name = "averageBuyPrice")
    public Double averageBuyPrice;
}
