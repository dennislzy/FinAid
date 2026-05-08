package org.financial.financialaibackend.Entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import org.financial.financialaibackend.Enums.ChannelRole;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "channel_message")
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor
@AllArgsConstructor
public class ChannelMessage {
    
    @Id
    @Column(name = "channelMessageId")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer channelMessageId;

    @JoinColumn(name = "channelId")
    @ManyToOne(fetch = FetchType.EAGER)
    public Channel channel;

    @Column(name = "channelRole")
    @Enumerated(EnumType.STRING)
    public ChannelRole channelRole;

    @Column(name = "channelMessage", columnDefinition = "LONGTEXT")
    public String channelMessage;
}