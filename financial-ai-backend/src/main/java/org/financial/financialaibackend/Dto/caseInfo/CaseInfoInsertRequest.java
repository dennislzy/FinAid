package org.financial.financialaibackend.Dto.caseInfo;

import java.time.LocalDate;
import java.util.Date;

import org.financial.financialaibackend.Enums.CaseGender;
import org.financial.financialaibackend.Enums.CaseStatus;
import org.financial.financialaibackend.Enums.EmploymentType;
import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class CaseInfoInsertRequest {

    @NotBlank
    private String caseInfoName;

    private String caseInfoEnglishName;

    private CaseGender caseInfoGender;

    private CaseStatus caseInfoLiveStatus;

    private Date caseInfoBirth;

    private String caseInfoAddress;

    private String caseInfoCity;

    private String caseInfoPostCode;

    @Email
    private String caseInfoEmail;

    private String caseInfoPhone;

    private String caseInfoIdentification;

    private String caseInfoEmergencyContact;

    private String caseInfoEmergencyPhone;

    private String caseInfoEmergencyRelate;

    private String caseInfoHomePhone;

    private String caseInfoImage;

    private String caseInfoCareer;

    private String isIndigenousOrNewResident;

    private String isDisability;

    private String isWelfareIdentityProof;

    private EmploymentType employmentType;
    
    private  Integer stableMonths;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate caseInfoHouseholdRegisterTime;

}