package org.financial.financialaibackend.Dto.family;

import lombok.Data;

@Data
public class HouseholdFamilyMembersUpdateRequest {

    private String name;

    private String relationshipToCase;

    private boolean income;

    private Integer yearSalary;

    private boolean supported;
}
