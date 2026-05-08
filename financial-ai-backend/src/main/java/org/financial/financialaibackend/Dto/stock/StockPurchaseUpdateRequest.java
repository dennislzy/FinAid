package org.financial.financialaibackend.Dto.stock;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockPurchaseUpdateRequest {

    @Min(0)
    public Integer shares;

    @Min(0)
    public Double averageBuyPrice;

}
