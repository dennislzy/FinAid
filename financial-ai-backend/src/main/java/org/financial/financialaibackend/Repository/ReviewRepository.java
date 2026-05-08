package org.financial.financialaibackend.Repository;

import java.util.List;

import org.financial.financialaibackend.Entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
@Query("SELECT r FROM Review r WHERE r.groupId = :groupId")
List<Review> findByGroupId(@Param("groupId") Integer groupId);

List<Review> findByFromWorkerId(String fromWorkerId);


}
