package org.financial.financialaibackend.Dto.bidding;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.financial.financialaibackend.Entity.CaseInfo;
import org.financial.financialaibackend.Enums.AidAssociationStatus;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BiddingRecordsResponse {

    private String aidAssociationId; // 主鍵

    private AidAssociationStatus isDead; // 活會或死會狀態

    private Integer monthlyAmount; // 每會金額

    private Integer period; // 當前期數

    private Date startDate; // 開始日期

    private Date endDate; // 結束日期

    private Integer baseBidAmount; // 底標金額

    private Integer monthlyExtraBid; // 月外標

    private Integer other; // 其他

    private CaseInfo caseInfo; // 外鍵對應的 CaseInfo
}
