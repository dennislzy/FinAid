package org.financial.financialaibackend.Repository;

import org.financial.financialaibackend.Entity.ChannelMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChannelMessageRepository extends JpaRepository<ChannelMessage, Integer> {
    Optional<ChannelMessage> findByChannelMessageId(Integer channelMessageId);

    List<ChannelMessage> findByChannel_ChannelId(String channelId);
    
}