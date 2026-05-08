package org.financial.financialaibackend.Entity;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "household_monthly_financial_records")
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdMonthlyFinancialRecords {

    
    @Column(name = "financialMonthlyRecordsId")
    @Id
    public String financialMonthlyRecordsId;

    @JoinColumn(name = "caseInfoId")
    @ManyToOne(fetch = FetchType.LAZY)
    public CaseInfo caseInfo;

    @Column(name = "financialCategory")
    public String financialCategory;

    @Column(name = "financialType")
    public String financialType;

    @Column(name = "monthly")
    public Integer monthly;

    @Column(name = "money")
    public Integer money;

    @Column(name = "year")
    public Integer year;
}
