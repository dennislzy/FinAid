package org.financial.financialaibackend.Entity;

import java.time.OffsetDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "household_year_financial_records")
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdYearFinancialRecords {

    @Column(name = "financialYearRecordsId")
    @Id
    public String financialYearRecordsId;

    @Column(name = "year")
    public Integer year;

    @JoinColumn(name = "caseInfoId")
    @ManyToOne(fetch = FetchType.LAZY)
    public CaseInfo caseInfo;

    @Column(name = "yearCreate")
    @JsonFormat(pattern = "yyyy-MM-dd")
    public OffsetDateTime yearCreate;

    @Column(name = "yearEditLast")
    @JsonFormat(pattern = "yyyy-MM-dd")
    public OffsetDateTime yearEditLast;

    @Column(name = "financialCategory")
    public String financialCategory;

    @Column(name = "financialType")
    public String financialType;

    @Column(name = "money")
    public Integer money;

    @PrePersist
    public void onCreate(){
        yearCreate= OffsetDateTime.now();
    }

    @PreUpdate
    public void onUpdate(){
        yearEditLast=OffsetDateTime.now();
    }
}
