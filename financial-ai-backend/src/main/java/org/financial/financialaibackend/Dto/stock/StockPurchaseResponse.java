package org.financial.financialaibackend.Dto.stock;


import lombok.Data;
import org.financial.financialaibackend.Entity.CaseInfo;

import java.util.Date;
@Data
public class StockPurchaseResponse {

    public Integer shares;

    public Double averageBuyPrice;

    public String stockCode;

    public CaseInfo caseInfo;

    public Date stockPurchaseDate;

}
