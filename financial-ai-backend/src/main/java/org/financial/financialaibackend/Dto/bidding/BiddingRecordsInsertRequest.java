package org.financial.financialaibackend.Dto.bidding;

import java.util.Date;

import org.financial.financialaibackend.Enums.AidAssociationStatus;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BiddingRecordsInsertRequest {

    @NotNull
    private AidAssociationStatus isDead; // 活會或死會狀態

    @NotNull
    @Min(0)
    private Integer monthlyAmount; // 每會金額

    @NotNull
    @Min(1)
    private Integer period; // 當前期數

    private Date startDate; // 開始日期（可選）

    private Date endDate; // 結束日期（可選）

    @Min(0)
    private Integer baseBidAmount; // 底標金額（可選）

    @Min(0)
    private Integer monthlyExtraBid; // 月外標（可選）

    private Integer other; // 其他（可選）
}
