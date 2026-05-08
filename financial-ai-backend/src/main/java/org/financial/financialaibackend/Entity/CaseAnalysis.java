package org.financial.financialaibackend.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.financial.financialaibackend.Enums.AnalysisType;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "case_analysis")  
public class CaseAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long analysisId;

    @ManyToOne
    @JoinColumn(name = "caseInfoId", referencedColumnName = "caseInfoId")
    private CaseInfo caseInfo;

    @ManyToOne
    @JoinColumn(name = "socialWorkerId", referencedColumnName = "socialWorkerId")
    private SocialWorker socialWorker;

    @Enumerated(EnumType.STRING)
    private AnalysisType analysisType;

    @Lob
    private String resultText;

    @CreationTimestamp
    @Column(name = "createTime", columnDefinition = "DATETIME")
    private LocalDateTime createTime = LocalDateTime.now();

    @Column(name = "light")
    private String light;
}
