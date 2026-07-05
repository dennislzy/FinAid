package org.financial.financialaibackend.Entity;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Date;

import org.financial.financialaibackend.Enums.CaseGender;
import org.financial.financialaibackend.Enums.CaseStatus;
import org.financial.financialaibackend.Enums.EmploymentType;

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
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Table(name = "case_info")
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor
@AllArgsConstructor
public class CaseInfo {
    @Id
    @Column(name = "caseInfoId")
    public String caseInfoId;

    @JoinColumn(name = "socialWorkerId")
    @ManyToOne(fetch = FetchType.EAGER)
    public SocialWorker socialWorker;

    @Column(name = "caseInfoName")
    public String caseInfoName;

    @Column(name = "caseInfoEnglishName")
    public String caseInfoEnglishName;

    @Column(name = "caseInfoGender")
    public CaseGender caseInfoGender;

    @Column(name = "caseInfoBirth")
    @Temporal(TemporalType.DATE)
    public Date caseInfoBirth;

    @Column(name = "caseInfoAddress")
    public String caseInfoAddress;

    @Column(name = "caseInfoCity")
    public String caseInfoCity;

    @Column(name = "caseInfoPostCode")
    public String caseInfoPostCode;

    @Column(name = "caseInfoEmail")
    public String caseInfoEmail;

    @Column(name = "caseInfoPhone")
    public String caseInfoPhone;

    @Column(name = "caseInfoIdentification")
    public String caseInfoIdentification;

    @Column(name = "caseInfoLiveStatus")
    public CaseStatus caseInfoLiveStatus;

    @Column(name = "caseInfoEmergencyContact")
    public String caseInfoEmergencyContact;

    @Column(name = "caseInfoEmergencyPhone")
    public String caseInfoEmergencyPhone;

    @Column(name = "caseInfoEmergencyRelate")
    public String caseInfoEmergencyRelate;

    @Column(name = "caseInfoHomePhone")
    public String caseInfoHomePhone;

    @Column(name = "caseInfoImage")
    public String caseInfoImage;

    @Column(name = "caseInfoCareer")
    public String caseInfoCareer;

    @Column(name = "caseInfoCreateTime", updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX")
    public OffsetDateTime caseInfoCreateTime;

    @Column(name = "isIndigenousOrNewResident")
    public String isIndigenousOrNewResident;

    @Column(name = "isDisability")
    public String isDisability;

    @Column(name = "isWelfareIdentityProof")
    public String isWelfareIdentityProof;

    @Column(name = "caseInfoHouseholdRegisterTime")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate caseInfoHouseholdRegisterTime;


    @Column(name = "employmentType")
    private EmploymentType employmentType;

    @Column(name = "stableMonths")
    private Integer stableMonths; 



    @PrePersist
    public void onCreate(){
        caseInfoCreateTime = OffsetDateTime.now();
    }

}
