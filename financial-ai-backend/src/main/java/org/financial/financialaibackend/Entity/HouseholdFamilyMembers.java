package org.financial.financialaibackend.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "household_family_members")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class HouseholdFamilyMembers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer memberId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "caseInfoId", nullable = false)
    private CaseInfo caseInfo;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "relationshipToCase")
    private String relationshipToCase;

    @Column(name = "hasIncome", nullable = false)
    private boolean income;

    @Column(name = "yearSalary", nullable = false)
    private Integer yearSalary = 0;

    @Column(name = "isSupportedByCase", nullable = false)
    private boolean supported;
    
}
