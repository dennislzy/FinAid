package org.financial.financialaibackend.Dto;

import java.util.Date;

import org.financial.financialaibackend.Entity.CaseInfo;

import lombok.Data;

@Data
public class SubsidyResponse {

    private Integer subsidyId;
    private String subsidyName;
    private Integer money;
    private Date applyTime;
    private Date receiveTime;
    private CaseInfo caseInfo;
}
