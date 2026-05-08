package org.financial.financialaibackend.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "review")
@Data
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;

    @Column(name = "caseInfoId")
    private String caseInfoId;

    @Column(name = "applyTime")
    private java.time.LocalDateTime applyTime;

    @Column(name = "groupId")
    private Integer groupId;

    @Column(name = "reviewStatus")
    private String reviewStatus;

    @Column(name = "fromWorkerId")
    private String fromWorkerId;

}
