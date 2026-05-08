package org.financial.financialaibackend.BL;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.financial.financialaibackend.Entity.Review;
import org.financial.financialaibackend.Repository.CaseInfoRepository;
import org.financial.financialaibackend.Repository.GroupListRepository;
import org.financial.financialaibackend.Repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class ReviewBL {

  

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private GroupListRepository groupListRepository;

    @Autowired
    private CaseInfoRepository caseInfoRepository;

    public List<Map<String, Object>> getAllCasesByLeaderId(String leaderId) {
        // 1. 先找出該督導對應的 groupId
        Integer groupId = groupListRepository.findGroupIdBySocialWorkerId(leaderId);
        if (groupId == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "找不到該督導所屬群組");
        }
    
        // 2. 查該組所有社工 ID
        List<String> workerIds = groupListRepository.findSocialWorkerIdsByGroupId(groupId);
        if (workerIds.isEmpty()) {
            return List.of(); // 無人時回傳空陣列
        }
    
        // 3. 查社工底下的所有個案
        return caseInfoRepository.findBySocialWorkerIds(workerIds).stream().map(caseItem -> {
            Map<String, Object> map = new HashMap<>();
            map.put("caseInfoId", caseItem.getCaseInfoId());
            map.put("caseInfoName", caseItem.getCaseInfoName());
            map.put("caseInfoEmail", caseItem.getCaseInfoEmail());
            if (caseItem.getSocialWorker() != null) {
                map.put("socialWorkerId", caseItem.getSocialWorker().getSocialWorkerId());
                map.put("socialWorkerName", caseItem.getSocialWorker().getSocialWorkerName());
            }
            return map;
        }).collect(Collectors.toList());
    }
    
    

    public Review submitReview(Review review) {
        review.setApplyTime(LocalDateTime.now());
        review.setReviewStatus("尚未審核");
        return reviewRepository.save(review);
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public Review approveReview(Long reviewId) {
        Optional<Review> optional = reviewRepository.findById(reviewId);
        if (optional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "找不到交接紀錄");
        }
        Review review = optional.get();
        review.setReviewStatus("審核成功");
        return reviewRepository.save(review);
    }

    public Review rejectReview(Long reviewId) {
        Optional<Review> optional = reviewRepository.findById(reviewId);
        if (optional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "找不到交接紀錄");
        }
        Review review = optional.get();
        review.setReviewStatus("駁回");
        return reviewRepository.save(review);
    }


    public List<Map<String, Object>> getReviewsByLeaderId(String leaderId) {
        Integer groupId = groupListRepository.findGroupIdBySocialWorkerId(leaderId);
        if (groupId == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "找不到該督導對應的群組");
        }
    
        List<Review> reviews = reviewRepository.findByGroupId(groupId);
    
        return reviews.stream().map(review -> {
            Map<String, Object> map = new HashMap<>();
            map.put("reviewId", review.getReviewId());
            map.put("caseInfoId", review.getCaseInfoId());
            map.put("applyTime", review.getApplyTime());
            map.put("reviewStatus", review.getReviewStatus());
            map.put("groupId", review.getGroupId());
    
            // 補上個案名字與社工名字
            caseInfoRepository.findById(review.getCaseInfoId()).ifPresent(caseInfo -> {
                map.put("caseInfoName", caseInfo.getCaseInfoName());
                if (caseInfo.getSocialWorker() != null) {
                    map.put("socialWorkerName", caseInfo.getSocialWorker().getSocialWorkerName());
                }
            });
    
            return map;
        }).collect(Collectors.toList());
    }
    

    public void deleteReview(Long reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "找不到該交接紀錄");
        }
        reviewRepository.deleteById(reviewId);
    }

    public List<Review> approveReviewBatch(List<Long> reviewIds) {
    List<Review> updated = new ArrayList<>();
    for (Long reviewId : reviewIds) {
        Optional<Review> optional = reviewRepository.findById(reviewId);
        if (optional.isPresent()) {
            Review review = optional.get();
            review.setReviewStatus("審核成功");
            updated.add(review);
        }
    }
    return reviewRepository.saveAll(updated); 
    }


    public List<Map<String, Object>> getReviewsSubmittedByWorker(String fromWorkerId) {
        List<Review> reviews = reviewRepository.findByFromWorkerId(fromWorkerId);
    
        return reviews.stream().map(review -> {
            Map<String, Object> map = new HashMap<>();
            map.put("reviewId", review.getReviewId());
            map.put("caseInfoId", review.getCaseInfoId());
            map.put("applyTime", review.getApplyTime());
            map.put("reviewStatus", review.getReviewStatus());
            map.put("groupId", review.getGroupId());
            map.put("fromWorkerId", review.getFromWorkerId());
    
            // 補上個案名字與社工名字
            caseInfoRepository.findById(review.getCaseInfoId()).ifPresent(caseInfo -> {
                map.put("caseInfoName", caseInfo.getCaseInfoName());
                if (caseInfo.getSocialWorker() != null) {
                    map.put("socialWorkerName", caseInfo.getSocialWorker().getSocialWorkerName());
                }
            });
    
            return map;
        }).collect(Collectors.toList());
    }
    

    
    

}
