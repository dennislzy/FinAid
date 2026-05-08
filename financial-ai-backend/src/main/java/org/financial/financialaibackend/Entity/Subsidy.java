package org.financial.financialaibackend.Entity;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name = "subsidy_list")
public class Subsidy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Integer subsidyId;

    @ManyToOne
    @JoinColumn(name = "caseInfoId", nullable = false) 
    private CaseInfo caseInfo;

    @Column(name = "subsidyName", length = 20, nullable = false)
    private String subsidyName;

    @Column(name = "money", nullable = false)
    private Integer money;

    @Column(name = "applyTime", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date applyTime;

    @Column(name = "receiveTime", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date receiveTime;

    public Subsidy() {}

    
    public Integer getSubsidyId() {
        return subsidyId;
    }

    public void setSubsidyId(Integer subsidyId) {
        this.subsidyId = subsidyId;
    }

    public CaseInfo getCaseInfo() {
        return caseInfo;
    }

    public void setCaseInfo(CaseInfo caseInfo) {
        this.caseInfo = caseInfo;
    }

    public String getSubsidyName() {
        return subsidyName;
    }

    public void setSubsidyName(String subsidyName) {
        this.subsidyName = subsidyName;
    }

    public Integer getMoney() {
        return money;
    }

    public void setMoney(Integer money) {
        this.money = money;
    }

    public Date getApplyTime() {
        return applyTime;
    }

    public void setApplyTime(Date applyTime) {
        this.applyTime = applyTime;
    }

    public Date getReceiveTime() {
        return receiveTime;
    }

    public void setReceiveTime(Date receiveTime) {
        this.receiveTime = receiveTime;
    }
}
