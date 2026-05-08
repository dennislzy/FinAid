package org.financial.financialaibackend.BL;

import java.util.List;
import java.util.Optional;

import org.financial.financialaibackend.Dto.chat.ChatResponse;
import org.financial.financialaibackend.Dto.common.Message;
import org.financial.financialaibackend.Entity.CaseInfo;
import org.financial.financialaibackend.Entity.Channel;
import org.financial.financialaibackend.Entity.ChannelMessage;
import org.financial.financialaibackend.Entity.SocialWorker;
import org.financial.financialaibackend.Enums.ChannelRole;
import org.financial.financialaibackend.Repository.ChannelMessageRepository;
import org.financial.financialaibackend.Repository.ChannelRepository;
import org.financial.financialaibackend.Repository.SocialWorkerRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Component
public class ChannelBL {

    private final ChannelRepository channelRepository;

    private final SocialWorkerRepository socialWorkerRepository;

    private final ChatBL chatBL;

    private final ChannelMessageRepository channelMessageRepository;

    public ChannelBL(ChannelRepository channelRepository,
        SocialWorkerRepository socialWorkerRepository,
        ChatBL chatBL,
        ChannelMessageRepository channelMessageRepository
    ){
        this.channelRepository = channelRepository;
        this.socialWorkerRepository = socialWorkerRepository;
        this.chatBL = chatBL;
        this.channelMessageRepository = channelMessageRepository;
    }
    

    public Channel createChannel(String socialWorkerEmail,String caseInfoId){

        SocialWorker socialWorker = socialWorkerRepository.findBySocialWorkerEmail(socialWorkerEmail).orElse(null);

        CaseInfo caseInfo = new CaseInfo();

        caseInfo.setCaseInfoId(caseInfoId);

        Channel channel = new Channel();

        channel.setChannelTitle("未命名對話");

        channel.setSocialWorker(socialWorker);

        channel.setCaseInfo(caseInfo);

        channel=channelRepository.save(channel);
        return channel;
        
    }

    public Channel updateChannelTitle(String channelId,String question){

        Optional<Channel> optionalchannel = channelRepository.findByChannelId(channelId);

        if (optionalchannel.isPresent()){
            Channel channel = optionalchannel.get();
            String channelTitle= "測試標題";
            channel.setChannelTitle(channelTitle);
            return channelRepository.save(channel);
        }else{
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"找不到該頻道");
        }
    }


    public Channel deleteChannel(String channelId,String caseInfoId){
        Optional<Channel> optionalChannel = channelRepository.findByChannelId(channelId);

        if (optionalChannel.isPresent()){
            channelRepository.deleteById(channelId);
            Channel channel = optionalChannel.get();
            CaseInfo caseInfo = new CaseInfo();
            caseInfo.setCaseInfoId(caseInfoId);
            channel.setCaseInfo(caseInfo);
            return channel;
        }else{
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"找不到此頻道");
        }
    }

    public Channel checkChannel(String channelId){
        if (channelRepository.findByChannelId(channelId).isPresent()){
            return channelRepository.findByChannelId(channelId).get();
        }else{
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"找不到頻道");
        }
    }

    public Channel checkChannel2(String channelId){
        if (channelRepository.findByChannelId(channelId).isPresent()){
            return channelRepository.findByChannelId(channelId).get();
        }else{
            return null;
        }
    }


    @Transactional
    public ChannelMessage insertMessage(String query, Channel channel, String caseInfoId) {
        CaseInfo caseInfo = new CaseInfo();
        caseInfo.setCaseInfoId(caseInfoId);
        if (channel != null) {
            channel = channelRepository.findByChannelId(channel.getChannelId()).orElse(null);
        }
        channel.setCaseInfo(caseInfo);
        
        // Check if channel has existing messages
        List<ChannelMessage> existingMessages = channelMessageRepository.findByChannel_ChannelId(channel.getChannelId());
        boolean isFirstMessage = existingMessages == null || existingMessages.isEmpty();
        
        ChannelMessage channelMessage = new ChannelMessage();
        channelMessage.setChannel(channel);
        channelMessage.setChannelMessage(query);
        channelMessage.setChannelRole(ChannelRole.USER);
        channelMessageRepository.save(channelMessage);

        ChannelMessage channelMessage2 = new ChannelMessage();
        channelMessage2.setChannel(channel);
        ChatResponse chatResponse = new ChatResponse("", "");
        channelMessage2.setChannelMessage(chatResponse.suggestion);
        channelMessage2.setChannelRole(ChannelRole.AI);
        ChannelMessage saveChannelMessage = channelMessageRepository.save(channelMessage2);

        // Only update channel title if this is the first message in the channel
        if (isFirstMessage) {
            updateChannelTitle(saveChannelMessage.getChannel().getChannelId(), query);
        }

        return saveChannelMessage;
    }

    // 根據ChannelId查詢ChannelMessage
    public Channel findChannelMessageByChannelId(String channelId,String caseInfoId){
        CaseInfo caseInfo = new CaseInfo();
        caseInfo.setCaseInfoId(caseInfoId);
        List<ChannelMessage> channelMessages = channelMessageRepository.findByChannel_ChannelId(channelId);
        channelMessages.forEach(channelMessage -> {
            channelMessage.setChannel(null);
        });
        Channel channel = channelRepository.findByChannelId(channelId).orElse(null);
        channel.setCaseInfo(caseInfo);

        channel.setChannelMessages(channelMessages);

        return channel;
    }

    //根據socalWorkerEmail查詢Channel
    public List<Channel> findChannelBySocialWorkerEmail(String socialWorkerEmail,String caseInfoId,String caseInfoName){
        CaseInfo caseInfo = new CaseInfo();
        caseInfo.setCaseInfoId(caseInfoId);
        caseInfo.setCaseInfoName(caseInfoName);
        SocialWorker socialWorker = socialWorkerRepository.findBySocialWorkerEmail(socialWorkerEmail).orElse(null);
        List<Channel> channels = channelRepository.findBySocialWorker_SocialWorkerIdAndCaseInfo_CaseInfoId(socialWorker.getSocialWorkerId(), caseInfoId);
        channels.forEach(channel -> {
            channel.setCaseInfo(caseInfo);
        });
        return channels;
    }

    private String createChannelTitle(String question){

        return chatBL.renameTitle(question);
    }
}
