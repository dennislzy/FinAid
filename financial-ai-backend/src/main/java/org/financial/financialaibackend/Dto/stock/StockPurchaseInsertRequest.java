package org.financial.financialaibackend.Dto.stock;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockPurchaseInsertRequest {

    @Min(0)
    public Integer shares;

    @Min(0)
    public Double averageBuyPrice;

    @NotBlank
    public String stockCode;

    @NotNull
    public Date stockPurchaseDate;

}
