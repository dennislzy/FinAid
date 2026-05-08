package org.financial.financialaibackend.Entity;

import java.util.Date;

import org.financial.financialaibackend.Enums.AidAssociationStatus;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;

@Entity
@Table(name = "bidding_records")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BiddingRecords {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 自增主鍵
    @Column(name = "aidAssociationId", nullable = false)
    private Long aidAssociationId; // 主鍵

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "caseInfoId", nullable = false) 
    private CaseInfo caseInfo; // 外鍵，連接到 CaseInfo

    @Column(name = "isDead", nullable = false)
    @Convert(converter = AidAssociationStatus.AidAssociationStatusConverter.class)
    private AidAssociationStatus isDead;


    @Column(name = "monthlyAmount", nullable = false)
    private Integer monthlyAmount; // 每會金額

    @Column(name = "period", nullable = false)
    private Integer period; // 當前期數

    @Column(name = "startDate", nullable = true)
    @Temporal(TemporalType.DATE)
    private Date startDate; // 開始日期

    @Column(name = "endDate", nullable = true)
    @Temporal(TemporalType.DATE)
    private Date endDate; // 結束日期

    @Column(name = "baseBidAmount", nullable = true)
    private Integer baseBidAmount; // 底標金額

    @Column(name = "monthlyExtraBid", nullable = true)
    private Integer monthlyExtraBid; // 月外標

    @Column(name = "other", nullable = true)
    private Integer other; // 其他

}
