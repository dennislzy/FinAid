package org.financial.financialaibackend.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.financial.financialaibackend.BL.ReviewBL;
import org.financial.financialaibackend.Entity.Review;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/review")
public class ReviewController {

    @Autowired
    private ReviewBL reviewBL;

    @PostMapping("/submit")
    public ResponseEntity<Review> submitReview(@RequestBody Review review) {
        return ResponseEntity.ok(reviewBL.submitReview(review));
    }

    @PostMapping("/approve/{id}")
    public ResponseEntity<Review> approveReview(@PathVariable("id") Long id) {
        return ResponseEntity.ok(reviewBL.approveReview(id));
    }

    @PostMapping("/reject/{id}")
    public ResponseEntity<Review> rejectReview(@PathVariable("id") Long id) {
        return ResponseEntity.ok(reviewBL.rejectReview(id));
    }

    @GetMapping("/group/{leaderId}")
    public ResponseEntity<List<Map<String, Object>>> getReviewsByGroup(@PathVariable("leaderId") String leaderId) {
        return ResponseEntity.ok(reviewBL.getReviewsByLeaderId(leaderId));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Map<String, String>> deleteReview(@PathVariable Long reviewId) {
        reviewBL.deleteReview(reviewId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "交接紀錄已刪除");
        return ResponseEntity.ok(response);
    }


    @PostMapping("/approve/batch")
    public ResponseEntity<List<Review>> approveReviewBatch(@RequestBody Map<String, List<Long>> request) {
        List<Long> reviewIds = request.get("reviewIds");
        return ResponseEntity.ok(reviewBL.approveReviewBatch(reviewIds));
    }

    @GetMapping("/submitted/{fromWorkerId}")
    public ResponseEntity<List<Map<String, Object>>> getReviewsSubmittedByWorker(@PathVariable String fromWorkerId) {
        return ResponseEntity.ok(reviewBL.getReviewsSubmittedByWorker(fromWorkerId));
    }


    @GetMapping("/leader/{leaderId}/cases")
    public ResponseEntity<List<Map<String, Object>>> getAllCasesByLeaderId(@PathVariable String leaderId) {
        return ResponseEntity.ok(reviewBL.getAllCasesByLeaderId(leaderId));
    }




}