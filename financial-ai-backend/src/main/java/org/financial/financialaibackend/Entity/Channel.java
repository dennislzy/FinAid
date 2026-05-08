package org.financial.financialaibackend.Entity;

import jakarta.persistence.*;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "channel")
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor
@AllArgsConstructor
public class Channel {
    @Id
    @Column(name = "channelId")
    @GeneratedValue(strategy = GenerationType.UUID)
    public String channelId;

    @JoinColumn(name = "socialWorkerId")
    @ManyToOne(fetch = FetchType.EAGER)
    public SocialWorker socialWorker;

    @JoinColumn(name = "caseInfoId")
    @ManyToOne(fetch = FetchType.EAGER)
    public CaseInfo caseInfo;

    @Column(name = "channelTitle")
    public String channelTitle;


    @Transient
    public List<ChannelMessage> channelMessages;
}


