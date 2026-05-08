package org.financial.financialaibackend.BL;

import org.financial.financialaibackend.Dto.QuestionRequest;
import org.financial.financialaibackend.Dto.chat.ChatResponse;
import org.financial.financialaibackend.Dto.chat.Riskment;
import org.financial.financialaibackend.Dto.common.Message;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class ChatBL {

    private final String baseUrl = "http://localhost:7000/api/ai";

    private final WebClient webClient=WebClient.create();
    

    public ChatResponse chat(Message message,String caseInfoId){

         ChatResponse chatResponse = webClient
                             .post()
                             .uri(baseUrl+"/chat/"+ caseInfoId)
                             .bodyValue(message)
                             .retrieve()
                             .bodyToMono(ChatResponse.class)
                             .block();
        return chatResponse;
    }

    public ChatResponse welfare(Message message,String caseInfoId){
            ChatResponse chatResponse = webClient
            .post()
            .uri(baseUrl+"/welfare/"+ caseInfoId)
            .bodyValue(message)
            .retrieve()
            .bodyToMono(ChatResponse.class)
            .block();
    return chatResponse;
    }

    
    public Riskment riskment(Message message,String caseInfoId){
        Riskment chatResponse = webClient
        .post()
        .uri(baseUrl+"/riskment/"+ caseInfoId)
        .bodyValue(message)
        .retrieve()
        .bodyToMono(Riskment.class)
        .block();
        return chatResponse;
    }


    public String renameTitle(String question){

        QuestionRequest questionRequest = new QuestionRequest();
        questionRequest.setQuestion(question);

        String title = webClient
                    .post()
                    .uri(baseUrl+"/rename")
                    .bodyValue(questionRequest)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        return title;
    }
}
