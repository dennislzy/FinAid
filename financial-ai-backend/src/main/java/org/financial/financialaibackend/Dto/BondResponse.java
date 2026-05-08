package org.financial.financialaibackend.Dto;

import java.util.Date;
import org.financial.financialaibackend.Entity.CaseInfo;
import lombok.Data;

@Data
public class BondResponse {

    private Integer bondId;
    private String bondName;
    private String companyName;
    private Integer money;
    private Date applyTime;
    private CaseInfo caseInfo;
}
