package org.financial.financialaibackend.Dto.family;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdFamilyMembersResponse {

    private Integer memberId;

    private String name;

    private String relationshipToCase;

    private boolean income;

    private Integer yearSalary;

    private boolean supported;
}
