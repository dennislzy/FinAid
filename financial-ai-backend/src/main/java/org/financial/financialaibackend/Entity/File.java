package org.financial.financialaibackend.Entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import org.financial.financialaibackend.Enums.Status;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "file")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class File {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fileId")
    private Integer fileId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "caseInfoId", nullable = false)
    private CaseInfo caseInfo; // 外鍵對應的 CaseInfo

    @Column(name = "createTime", nullable = false, updatable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate createTime;

    @Column(name = "fileName", nullable = false)
    private String fileName;

    @Column(name = "summary", columnDefinition = "LONGTEXT")
    private String summary;

    @Column(name = "totalText", columnDefinition = "LONGTEXT")
    private String totalText;

    @Column(name = "duration", nullable = false)
    private String duration;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;
}
