package org.financial.financialaibackend.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "group_list")
@Data
public class GroupList {

    @Id
    @Column(name = "socialWorkerId")
    private String socialWorkerId;

    @Column(name = "groupId")
    private Integer groupId;
}
