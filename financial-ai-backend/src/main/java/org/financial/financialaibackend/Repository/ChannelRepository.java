package org.financial.financialaibackend.Repository;

import org.financial.financialaibackend.Entity.Channel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChannelRepository extends JpaRepository<Channel, String> {
    Optional<Channel> findByChannelId(String channelId);
    
    // List<Channel> findBySocialWorker_SocialWorkerId(String socialWorkerId);

    List<Channel> findBySocialWorker_SocialWorkerIdAndCaseInfo_CaseInfoId(String socialWorkerId, String caseInfoId);
}