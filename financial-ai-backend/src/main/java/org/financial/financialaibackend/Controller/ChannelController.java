package org.financial.financialaibackend.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

import org.financial.financialaibackend.BL.CaseAnalysisBL;
import org.financial.financialaibackend.BL.CaseInfoBL;
import org.financial.financialaibackend.BL.ChannelBL;
import org.financial.financialaibackend.BL.ChatBL;
import org.financial.financialaibackend.BL.SocialWorkerBL;
import org.financial.financialaibackend.Dto.chat.ChatRequest;
import org.financial.financialaibackend.Dto.chat.ChatResponse;
import org.financial.financialaibackend.Dto.chat.Riskment;
import org.financial.financialaibackend.Dto.common.Message;
import org.financial.financialaibackend.Entity.CaseInfo;
import org.financial.financialaibackend.Entity.Channel;
import org.financial.financialaibackend.Entity.ChannelMessage;
import org.financial.financialaibackend.Entity.SocialWorker;
import org.financial.financialaibackend.Enums.AnalysisType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/{socialWorkerEmail}/channel/{caseInfoId}")
public class ChannelController {

    private final SocialWorkerBL socialWorkerBL;

    private final ChannelBL channelBL;

    private final CaseInfoBL caseInfoBL;

    private final ChatBL chatBL;

    private final CaseAnalysisBL caseAnalysisBL;


    public ChannelController(SocialWorkerBL socialWorkerBL,ChannelBL channelBL,CaseInfoBL caseInfoBL,ChatBL chatBL,CaseAnalysisBL caseAnalysisBL){
        this.socialWorkerBL = socialWorkerBL;
        this.channelBL = channelBL;
        this.caseInfoBL = caseInfoBL;
        this.chatBL = chatBL;
        this.caseAnalysisBL = caseAnalysisBL;
    }
    

    // @PostMapping
    // public ResponseEntity<Object> createChannel(
    //     @PathVariable String socialWorkerEmail,
    //     @PathVariable String caseInfoId
    // ) {
       
    //     socialWorkerBL.checkSocialWorker(socialWorkerEmail);

    //     CaseInfo checkCaseInfo = caseInfoBL.checkCaseInfo(caseInfoId);

    //     Channel channel = channelBL.createChannel(socialWorkerEmail,checkCaseInfo.getCaseInfoId());

    //     return ResponseEntity.ok(channel);
    // }

    @PostMapping("/chat")
    public ResponseEntity<Object> chat(
        @PathVariable String socialWorkerEmail,
        @PathVariable String caseInfoId,
        @RequestBody  ChatRequest chatRequest
    ){
        socialWorkerBL.checkSocialWorker(socialWorkerEmail);

        CaseInfo checkCaseInfo = caseInfoBL.checkCaseInfo(caseInfoId);

        Channel channel = channelBL.checkChannel2(chatRequest.getChannelId());
        if (channel == null) {
            channel = channelBL.createChannel(socialWorkerEmail, caseInfoId);
        }
        ChannelMessage insertMessage = channelBL.insertMessage(chatRequest.message,channel,checkCaseInfo.getCaseInfoId());

        return ResponseEntity.ok(insertMessage);
    }

    @PostMapping("/generate_welfare")
    public ResponseEntity<Object> generate_welfare(
        @RequestBody Message message,
        @PathVariable String caseInfoId,
        @PathVariable String socialWorkerEmail
    ){
        socialWorkerBL.checkSocialWorker(socialWorkerEmail);

        CaseInfo checkCaseInfo = caseInfoBL.checkCaseInfo(caseInfoId);

        SocialWorker socialWorker = socialWorkerBL.findByEmail(socialWorkerEmail);

        ChatResponse welfare = chatBL.welfare(message, caseInfoId);

        caseAnalysisBL.saveAnalysis(
        welfare.getSuggestion(),
        checkCaseInfo,           
        socialWorker,            
        AnalysisType.WELFARE ,
        null
        );

        return ResponseEntity.ok(welfare);
    }

    @PostMapping("/generate_riskment")
    public ResponseEntity<Object> generate_riskment(
        @RequestBody Message message,
        @PathVariable String caseInfoId,
        @PathVariable String socialWorkerEmail
    ){
        socialWorkerBL.checkSocialWorker(socialWorkerEmail);

        CaseInfo checkCaseInfo = caseInfoBL.checkCaseInfo(caseInfoId);

        SocialWorker socialWorker = socialWorkerBL.findByEmail(socialWorkerEmail);

        Riskment riskment2 = chatBL.riskment(message, caseInfoId);

        caseAnalysisBL.saveAnalysis(
            riskment2.getRisk(),
            checkCaseInfo,
            socialWorker,
            AnalysisType.RISK,
            riskment2.getLight()
        );

        return ResponseEntity.ok(riskment2);
    }
    


    @DeleteMapping("/{channelId}")
    public ResponseEntity<Object> deleteChannel(
        @PathVariable String socialWorkerEmail,
        @PathVariable String channelId,
        @PathVariable String caseInfoId
    ) {
       
        socialWorkerBL.checkSocialWorker(socialWorkerEmail);

        CaseInfo checkCaseInfo = caseInfoBL.checkCaseInfo(caseInfoId);

        Channel deleteChannel = channelBL.deleteChannel(channelId,checkCaseInfo.getCaseInfoId());

        return ResponseEntity.ok(deleteChannel);
    }

    //根據ChannelId取得所有聊天訊息
    @GetMapping("/chat/{channelId}")
    public ResponseEntity<Object> getChat(
        @PathVariable String socialWorkerEmail,
        @PathVariable String channelId,
        @PathVariable String caseInfoId
    ) {
       
        socialWorkerBL.checkSocialWorker(socialWorkerEmail);

        CaseInfo checkCaseInfo = caseInfoBL.checkCaseInfo(caseInfoId);

        channelBL.checkChannel(channelId);

        Channel channel = channelBL.findChannelMessageByChannelId(channelId,checkCaseInfo.getCaseInfoId());

        return ResponseEntity.ok(channel);
    }

    //根據socalWorkerEmail取得所有Channel
    @GetMapping("/all")
    public ResponseEntity<Object> getChannel(
        @PathVariable String socialWorkerEmail,
        @PathVariable String caseInfoId
    ) {
       
        socialWorkerBL.checkSocialWorker(socialWorkerEmail);

        CaseInfo checkCaseInfo = caseInfoBL.checkCaseInfo(caseInfoId);

        List<Channel> channels = channelBL.findChannelBySocialWorkerEmail(socialWorkerEmail,checkCaseInfo.getCaseInfoId(),checkCaseInfo.getCaseInfoName());

        return ResponseEntity.ok(channels);
    }
    
}
