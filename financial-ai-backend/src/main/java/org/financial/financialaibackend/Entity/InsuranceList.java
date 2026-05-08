package org.financial.financialaibackend.Entity;

import org.financial.financialaibackend.Enums.InsuranceType;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "insurance_list")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class InsuranceList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "insuranceId")
    private Long insuranceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "caseInfoId")
    private CaseInfo caseInfo;

    @Column(name = "familyMember")
    private String familyMember;


    @Column(name = "insuranceType")
    public InsuranceType insuranceType;

    @Column(name = "insuranceCompanyName")
    public String insuranceCompanyName;

    @Column(name = "amount")
    public Integer amount;

    @Column(name = "annualPremium")
    public Integer annualPremium;

    // @Column(name = "purchaseTime")
    // public java.util.Date purchaseTime;

}
