package org.financial.financialaibackend.Entity.keys;

import jakarta.persistence.Embeddable;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.financial.financialaibackend.Entity.CaseInfo;
@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class InsuranceListId implements java.io.Serializable {

    public String familyMember;

    @JoinColumn(name = "caseInfoId")
    @ManyToOne(fetch = FetchType.LAZY)
    public CaseInfo caseInfo;
}
