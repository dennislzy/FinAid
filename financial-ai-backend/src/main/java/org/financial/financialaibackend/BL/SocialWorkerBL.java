package org.financial.financialaibackend.BL;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.financial.financialaibackend.Dto.socialWoker.AssignGroupRequest;
import org.financial.financialaibackend.Dto.socialWoker.SocialWorkerLoginRequest;
import org.financial.financialaibackend.Entity.CaseInfo;
import org.financial.financialaibackend.Entity.GroupList;
import org.financial.financialaibackend.Entity.SocialWorker;
import org.financial.financialaibackend.Enums.SocialWorkerPermission;
import org.financial.financialaibackend.Repository.CaseInfoRepository;
import org.financial.financialaibackend.Repository.GroupListRepository;
import org.financial.financialaibackend.Repository.SocialWorkerRepository;
import org.financial.financialaibackend.Utils.AttributeCheck;
import org.financial.financialaibackend.Utils.UUIDGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class SocialWorkerBL {

    @Autowired
    private SocialWorkerRepository socialWorkerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CaseInfoRepository caseInfoRepository;

    @Autowired
    private GroupListRepository groupListRepository;

    //取得所有社工(complete的)
    public List<Map<String, Object>> getCompleteSocialWorkersWithGroup(String permissionStr) {
        List<SocialWorker> workers;
    
        if (permissionStr == null || permissionStr.isBlank()) {
            workers = socialWorkerRepository.findByStatus("COMPLETE");
        } else {
            SocialWorkerPermission permission;
            try {
                permission = SocialWorkerPermission.valueOf(permissionStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "權限參數錯誤（只能是 BASIC 或 LEADER）");
            }
            workers = socialWorkerRepository.findByStatusAndSocialWorkerPermission("COMPLETE", permission);
        }
    
        List<Map<String, Object>> result = new ArrayList<>();
        for (SocialWorker worker : workers) {
            Map<String, Object> map = new HashMap<>();
            map.put("socialWorkerEmail", worker.getSocialWorkerEmail());
            map.put("socialWorkerName", worker.getSocialWorkerName());
            map.put("socialWorkerPermission", worker.getSocialWorkerPermission());
    
            Integer groupId = groupListRepository.findGroupIdBySocialWorkerId(worker.getSocialWorkerId());
            map.put("groupId", groupId);
    
            result.add(map);
        }
        return result;
    }
    
    

    //審核社工帳號並把他加進群組
    public Map<String, String> assignSocialWorkerToGroup(AssignGroupRequest request) {
        Optional<SocialWorker> optionalWorker = socialWorkerRepository.findById(request.getSocialWorkerId());
        if (optionalWorker.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "找不到該社工");
        }

        SocialWorker worker = optionalWorker.get();
        worker.setStatus("COMPLETE"); // 無論如何都變成 COMPLETE

        Map<String, String> response = new HashMap<>();

        if (worker.getSocialWorkerPermission() == SocialWorkerPermission.LEADER) {
            // LEADER: 自己建立新的 groupId
            Integer maxGroupId = groupListRepository.findMaxGroupId();
            int newGroupId = (maxGroupId == null ? 1 : maxGroupId + 1);

            GroupList newGroup = new GroupList();
            newGroup.setSocialWorkerId(worker.getSocialWorkerId());
            newGroup.setGroupId(newGroupId);

            groupListRepository.save(newGroup);
            response.put("message", "督導社工審核成功，已創建新群組");
            response.put("newGroupId", String.valueOf(newGroupId));
        } else if (worker.getSocialWorkerPermission() == SocialWorkerPermission.BASIC)  {
            // BASIC: 必須指定 groupId
            if (request.getGroupId() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "基層社工必須指定 groupId");
            }

            GroupList newGroupEntry = new GroupList();
            newGroupEntry.setSocialWorkerId(worker.getSocialWorkerId());
            newGroupEntry.setGroupId(request.getGroupId());

            groupListRepository.save(newGroupEntry);
            response.put("message", "基層社工已加入指定群組");
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "社工權限設定錯誤，無法審核");
        }

        socialWorkerRepository.save(worker); 
        return response;
    }



    //升級成LEADER
    public void promoteToLeader(String socialWorkerId) {
        Optional<SocialWorker> optional = socialWorkerRepository.findById(socialWorkerId);
        if (optional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "找不到該社工");
        }
    
        SocialWorker worker = optional.get();
    
        if (worker.getSocialWorkerPermission() == SocialWorkerPermission.LEADER) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "此社工已是督導");
        }
    
        // 自動產生新的groupId
        Integer newGroupId = groupListRepository.findMaxGroupId() + 1;
    
        // 升級權限
        worker.setSocialWorkerPermission(SocialWorkerPermission.LEADER);
        socialWorkerRepository.save(worker);
    
        // 幫他建立自己的群組
        GroupList group = new GroupList();
        group.setSocialWorkerId(socialWorkerId);
        group.setGroupId(newGroupId);
        groupListRepository.save(group);
    }

    //取得所有群組
    public List<Map<String, Object>> getAllLeadersWithGroupId() {
        List<SocialWorker> leaders = socialWorkerRepository.findBySocialWorkerPermission(SocialWorkerPermission.LEADER);
    
        List<Map<String, Object>> result = new ArrayList<>();
    
        for (SocialWorker leader : leaders) {
            Map<String, Object> data = new HashMap<>();
            data.put("socialWorkerId", leader.getSocialWorkerId());
            data.put("socialWorkerEmail", leader.getSocialWorkerEmail());
            data.put("socialWorkerName", leader.getSocialWorkerName());
    
            Integer groupId = groupListRepository.findGroupIdBySocialWorkerId(leader.getSocialWorkerId());
            data.put("groupId", groupId);  
    
            result.add(data);
        }
    
        return result;
    }

    //刪除社工
    public void deleteSocialWorker(String socialWorkerId) {
        Optional<SocialWorker> optional = socialWorkerRepository.findById(socialWorkerId);
        if (optional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "找不到該社工");
        }
    
        SocialWorker worker = optional.get();
    
        // 若是 BASIC，要先確認他是否底下還有負責個案
        if (worker.getSocialWorkerPermission() == SocialWorkerPermission.BASIC) {
            if (caseInfoRepository.existsBySocialWorker_SocialWorkerId(socialWorkerId)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "此社工尚有個案尚未分配");
            }
        }
    
        // 若是 LEADER，要先確認他的群組中是否還有其他基層社工
        if (worker.getSocialWorkerPermission() == SocialWorkerPermission.LEADER) {
            Integer groupId = groupListRepository.findGroupIdBySocialWorkerId(socialWorkerId);
            if (groupId != null && groupListRepository.existsBasicInGroup(groupId)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "此督導群組尚有基層社工尚未分配");
            }
        }
    
        // 通過條件的話先刪除 group_list 的資料
        groupListRepository.deleteById(socialWorkerId);
    
        // 再刪除社工
        socialWorkerRepository.deleteById(socialWorkerId);
    }

    //列出督導底下基層的邏輯
    public List<Map<String, String>> getBasicWorkersByLeaderId(String leaderId) {
        Integer groupId = groupListRepository.findGroupIdBySocialWorkerId(leaderId);
        if (groupId == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "找不到該督導的群組");
        }
    
        List<SocialWorker> basicWorkers = groupListRepository.findBasicWorkersByGroupId(groupId);
    
        return basicWorkers.stream().map(worker -> Map.of(
            "socialWorkerEmail", worker.getSocialWorkerEmail(),
            "socialWorkerName", worker.getSocialWorkerName(),
            "socialWorkerId", worker.getSocialWorkerId()
        )).collect(Collectors.toList());
    }
    
    
    
    public SocialWorker registerSocialWorker(SocialWorker socialWorker) {
        if (socialWorkerRepository.findBySocialWorkerEmail(socialWorker.getSocialWorkerEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Social worker already exists");
        }

        if (!AttributeCheck.isValidEmail(socialWorker.getSocialWorkerEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Social worker email is invalid");
        }
        final String socialWorkerId = UUIDGenerator.generateUUID();
        String hashPassword = passwordEncoder.encode(socialWorker.getSocialWorkerPassword());
        socialWorker.setSocialWorkerPassword(hashPassword);
        socialWorker.setSocialWorkerId(socialWorkerId);
        socialWorker.setStatus("UNCOMPLETE");

        return socialWorkerRepository.save(socialWorker);
    }    

    public SocialWorker loginSocialWorker(SocialWorkerLoginRequest socialWorkerLoginRequest) {
        Optional<SocialWorker> optionalWorker = socialWorkerRepository.findBySocialWorkerEmail(socialWorkerLoginRequest.getSocialWorkerEmail());
        if (optionalWorker.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Social worker does not exist");
        }
    
        SocialWorker socialWorker = optionalWorker.get();

         // 再檢查密碼
        if (!passwordEncoder.matches(socialWorkerLoginRequest.getSocialWorkerPassword(), socialWorker.getSocialWorkerPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "登入失敗");
        }
    
        // 先檢查帳號是否為 COMPLETE
        if (socialWorker.getStatus() == null || !"COMPLETE".equalsIgnoreCase(socialWorker.getStatus().trim())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "帳號尚未審核通過，無法登入");
        }
    
        return socialWorker;
    }
    
    
    
    

    public boolean checkSocialWorker(String socialWorkerEmail) {
        Optional<SocialWorker> socialWorker = socialWorkerRepository.findBySocialWorkerEmail(socialWorkerEmail);
        if (socialWorker.isPresent()) {
            return true;
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Social worker does not exist");
        }
    }
    public List<Map<String, Object>> getAllBasicSocialWorkersWithCases() {
    List<SocialWorker> socialWorkers = socialWorkerRepository.findAllBySocialWorkerPermission(SocialWorkerPermission.BASIC);

    List<Map<String, Object>> result = new ArrayList<>();

    for (SocialWorker worker : socialWorkers) {
        Map<String, Object> workerData = new HashMap<>();
        workerData.put("socialWorkerEmail", worker.getSocialWorkerEmail());
        workerData.put("socialWorkerName", worker.getSocialWorkerName());

        // 改用 CaseInfoRepository 直接查詢該社工負責的個案
        List<CaseInfo> caseInfos = caseInfoRepository.findBySocialWorker_SocialWorkerEmail(worker.getSocialWorkerEmail());

        List<Map<String, Object>> caseList = caseInfos.stream().map(caseInfo -> {
            Map<String, Object> caseData = new HashMap<>();
            caseData.put("caseInfoId", caseInfo.getCaseInfoId());
            caseData.put("caseInfoName", caseInfo.getCaseInfoName());
            caseData.put("caseInfoEmail", caseInfo.getCaseInfoEmail());
            return caseData;
        }).collect(Collectors.toList());

                workerData.put("cases", caseList);
                result.add(workerData);
            }
            
            return result;
        }

    public SocialWorker findByEmail(String email) {
    return socialWorkerRepository.findBySocialWorkerEmail(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "找不到該社工"));
}



    public List<Map<String, String>> getAllBasicSocialWorkers() {
        List<SocialWorker> socialWorkers = socialWorkerRepository.findBySocialWorkerPermission(SocialWorkerPermission.BASIC);
    
        List<Map<String, String>> result = new ArrayList<>();
        for (SocialWorker worker : socialWorkers) {
            Map<String, String> workerData = new HashMap<>();
            workerData.put("socialWorkerEmail", worker.getSocialWorkerEmail());
            workerData.put("socialWorkerName", worker.getSocialWorkerName());
            result.add(workerData);
    }
    
        return result;
    }

    public List<Map<String, String>> searchBasicSocialWorkers(String keyword) {
        // 呼叫 Repository，根據關鍵字查找基層社工
        List<SocialWorker> socialWorkers = socialWorkerRepository.findBasicSocialWorkersByKeyword(keyword);
    
        // 將結果轉換為 JSON 格式 (社工姓名 + Gmail)
        return socialWorkers.stream()
            .map(socialWorker -> Map.of(
                "socialWorkerName", socialWorker.getSocialWorkerName(),
                "socialWorkerEmail", socialWorker.getSocialWorkerEmail()
            ))
            .collect(Collectors.toList());
    }

    public List<Map<String, String>> getUncompleteSocialWorkers() {
        List<SocialWorker> workers = socialWorkerRepository.findByStatus("UNCOMPLETE");
    
        List<Map<String, String>> result = new ArrayList<>();
        for (SocialWorker worker : workers) {
            Map<String, String> map = new HashMap<>();
            map.put("socialWorkerId", worker.getSocialWorkerId());
            map.put("socialWorkerName", worker.getSocialWorkerName());
            map.put("socialWorkerEmail", worker.getSocialWorkerEmail());
            map.put("socialWorkerPermission", worker.getSocialWorkerPermission().toString());
            result.add(map);
        }
        return result;
    }  

}
