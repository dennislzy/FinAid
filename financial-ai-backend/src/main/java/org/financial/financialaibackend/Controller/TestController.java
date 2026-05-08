// package org.financial.financialaibackend.Controller;

// import org.financial.financialaibackend.Dto.AudioTextRequest;
// import org.financial.financialaibackend.Dto.FileInsertRequest;
// import org.financial.financialaibackend.Dto.MappingRequest;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RestController;

// import java.util.HashMap;
// import java.util.Map;
// import java.util.concurrent.CompletableFuture;

// @RestController
// public class TestController {

//      @PostMapping("/mapping")
//     public ResponseEntity<String> getAIBLMapping(
//             @PathVariable String socialWorkerEmail,
//             @RequestBody MappingRequest mappingRequest
//     ){
//         socialWorkerBL.checkSocialWorker(socialWorkerEmail);
//         return ResponseEntity.ok(aibl.mapping(mappingRequest,socialWorkerEmail));
//     }

//     @PostMapping("/mappingToDatabase")
//     public ResponseEntity<Object> getAIBLMappingToDatabase(
//             @PathVariable String socialWorkerEmail,
//             @RequestBody AudioTextRequest audioTextRequest
//     ){
//         socialWorkerBL.checkSocialWorker(socialWorkerEmail);

//         String mapToDatabase = aibl.mapToDatabase(audioTextRequest, socialWorkerEmail);
//         Map<String, Object> map = new HashMap<>();
//         map.put("messages", mapToDatabase);
//         return ResponseEntity.ok(map);
//     }
// }
