package org.financial.financialaibackend.Repository;

import java.util.List;

import org.financial.financialaibackend.Entity.GroupList;
import org.financial.financialaibackend.Entity.SocialWorker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupListRepository extends JpaRepository<GroupList, String> {

    //找到最大的id加一(為了確保不可能重複)
    @Query("SELECT COALESCE(MAX(g.groupId), 0) FROM GroupList g")
    Integer findMaxGroupId();

    //用社工id來比對，取得他在group表裡的組別id
    @Query("SELECT g.groupId FROM GroupList g WHERE g.socialWorkerId = :socialWorkerId")
    Integer findGroupIdBySocialWorkerId(@Param("socialWorkerId") String socialWorkerId);

    //查詢那個群組還有沒有其他基層社工
    @Query("""
    SELECT COUNT(g) > 0 FROM GroupList g
    JOIN SocialWorker s ON g.socialWorkerId = s.socialWorkerId
    WHERE g.groupId = :groupId AND s.socialWorkerPermission = 'BASIC'
    """)
    boolean existsBasicInGroup(@Param("groupId") Integer groupId);

    @Query("""
    SELECT s FROM SocialWorker s 
    JOIN GroupList g ON s.socialWorkerId = g.socialWorkerId 
    WHERE g.groupId = :groupId AND s.socialWorkerPermission = 'BASIC'
    """)
    List<SocialWorker> findBasicWorkersByGroupId(@Param("groupId") Integer groupId);

    @Query("SELECT g.socialWorkerId FROM GroupList g WHERE g.groupId = :groupId")
    List<String> findSocialWorkerIdsByGroupId(@Param("groupId") Integer groupId);







}
