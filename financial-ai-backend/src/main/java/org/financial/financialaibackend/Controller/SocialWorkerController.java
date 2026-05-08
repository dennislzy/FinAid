package org.financial.financialaibackend.Controller;

import java.util.List;
import java.util.Map;

import org.financial.financialaibackend.BL.SocialWorkerBL;
import org.financial.financialaibackend.Dto.socialWoker.AssignGroupRequest;
import org.financial.financialaibackend.Dto.socialWoker.PromoteRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class SocialWorkerController {

    @Autowired
    private SocialWorkerBL socialWorkerBL;

    //取得所有的complete社工
    @GetMapping("/completeSocialWorkers")
    public ResponseEntity<List<Map<String, Object>>> getCompleteSocialWorkersByPermission(
        @RequestParam(value = "permission", required = false) String permission
    ) {
        return ResponseEntity.ok(socialWorkerBL.getCompleteSocialWorkersWithGroup(permission));
    }


    // 取得所有基層社工與其負責的個案
    @GetMapping("/socialWorkersWithCases")
    public ResponseEntity<List<Map<String, Object>>> getAllBasicSocialWorkersWithCases() {
        List<Map<String, Object>> result = socialWorkerBL.getAllBasicSocialWorkersWithCases();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/basicSocialWorkers")
    public ResponseEntity<List<Map<String, String>>> getAllBasicSocialWorkers() {
        List<Map<String, String>> result = socialWorkerBL.getAllBasicSocialWorkers();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/searchSocialWorkers")
    public ResponseEntity<List<Map<String, String>>> searchBasicSocialWorkers(
            @RequestParam("keyword") String keyword
    ) {
        List<Map<String, String>> results = socialWorkerBL.searchBasicSocialWorkers(keyword);
        return ResponseEntity.ok(results);
    }

    //加入群組(需要帶 socialWorkerId，但是 groupId 只有基層需要帶，督導不需要)
    @PostMapping("/assignGroup")
    public ResponseEntity<Map<String, String>> assignSocialWorkerToGroup(@RequestBody AssignGroupRequest request) {
        Map<String, String> response = socialWorkerBL.assignSocialWorkerToGroup(request);
        return ResponseEntity.ok(response);
    }



    @GetMapping("/uncompleteSocialWorkers")
    public ResponseEntity<List<Map<String, String>>> getUncompleteSocialWorkers() {
        return ResponseEntity.ok(socialWorkerBL.getUncompleteSocialWorkers());
    }

    @PostMapping("/promote")
    public ResponseEntity<String> promoteToLeader(@RequestBody PromoteRequest request) {
        socialWorkerBL.promoteToLeader(request.getSocialWorkerId());
        return ResponseEntity.ok("升級為督導成功，並已自動分配新群組");
    }

    @GetMapping("/leadersWithGroup")
    public ResponseEntity<List<Map<String, Object>>> getAllLeadersWithGroupId() {
        return ResponseEntity.ok(socialWorkerBL.getAllLeadersWithGroupId());
    }

    @DeleteMapping("delete/{socialWorkerId}")
    public ResponseEntity<String> deleteSocialWorker(@PathVariable("socialWorkerId") String id) {
        socialWorkerBL.deleteSocialWorker(id);
        return ResponseEntity.ok("社工已成功刪除");
    }

    @GetMapping("/group/basicWorkers/{leaderId}")
    public ResponseEntity<List<Map<String, String>>> getBasicWorkersByLeader(
            @PathVariable("leaderId") String leaderId) {
        return ResponseEntity.ok(socialWorkerBL.getBasicWorkersByLeaderId(leaderId));
    }



}
