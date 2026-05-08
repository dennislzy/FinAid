package org.financial.financialaibackend.Entity;

import org.financial.financialaibackend.Enums.SocialWorkerPermission;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "social_worker")
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@NoArgsConstructor
@AllArgsConstructor
public class SocialWorker {

    @Id
    @Column(name = "socialWorkerId")
    public String socialWorkerId;

    @Column(name = "socialWorkerEmail")
    @Email
    public String socialWorkerEmail;

    @Column(name = "socialWorkerPassword")
    public String socialWorkerPassword;

    @Column(name = "socialWorkerName")
    public String socialWorkerName;

    @Column(name = "socialWorkerPermission")
    @Enumerated(EnumType.STRING)
    public SocialWorkerPermission socialWorkerPermission;
    
    @Column(name = "status")
    public String status;

    @Transient
    public String loginToken;

    @Transient
    public String leaderVerificationCode;


    // // 新增社工與個案的一對多關係
    // @OneToMany(mappedBy = "socialWorker", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    // private List<CaseInfo> caseInfos = new ArrayList<>();
}
