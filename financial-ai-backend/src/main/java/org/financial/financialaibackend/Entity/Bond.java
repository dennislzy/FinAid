package org.financial.financialaibackend.Entity;

import java.util.Date;
import jakarta.persistence.*;

@Entity
@Table(name = "bond_list")
public class Bond {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Integer bondId;

    @ManyToOne
    @JoinColumn(name = "caseInfoId", nullable = false) 
    private CaseInfo caseInfo;

    @Column(name = "bondName", length = 20, nullable = false)
    private String bondName;

    @Column(name = "companyName", length = 50, nullable = false)
    private String companyName;

    @Column(name = "money", nullable = false)
    private Integer money;

    @Column(name = "applyTime", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date applyTime;

    public Bond() {}

    public Integer getBondId() {
        return bondId;
    }

    public void setBondId(Integer bondId) {
        this.bondId = bondId;
    }

    public CaseInfo getCaseInfo() {
        return caseInfo;
    }

    public void setCaseInfo(CaseInfo caseInfo) {
        this.caseInfo = caseInfo;
    }

    public String getBondName() {
        return bondName;
    }

    public void setBondName(String bondName) {
        this.bondName = bondName;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
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
}
