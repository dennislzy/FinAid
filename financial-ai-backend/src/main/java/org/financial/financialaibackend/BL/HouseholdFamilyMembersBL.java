package org.financial.financialaibackend.BL;

import org.financial.financialaibackend.Dto.family.HouseholdFamilyMembersInsertRequest;
import org.financial.financialaibackend.Dto.family.HouseholdFamilyMembersResponse;
import org.financial.financialaibackend.Dto.family.HouseholdFamilyMembersUpdateRequest;
import org.financial.financialaibackend.Entity.CaseInfo;
import org.financial.financialaibackend.Entity.HouseholdFamilyMembers;
import org.financial.financialaibackend.Repository.CaseInfoRepository;
import org.financial.financialaibackend.Repository.HouseholdFamilyMembersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class HouseholdFamilyMembersBL {

    @Autowired
    private HouseholdFamilyMembersRepository householdFamilyMembersRepository;

    @Autowired
    private CaseInfoRepository caseInfoRepository;

    public HouseholdFamilyMembersResponse insert(String caseInfoId, HouseholdFamilyMembersInsertRequest request) {
        CaseInfo caseInfo = caseInfoRepository.findByCaseInfoId(caseInfoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "找不到個案"));

        HouseholdFamilyMembers member = new HouseholdFamilyMembers();
        member.setCaseInfo(caseInfo);
        member.setName(request.getName());
        member.setRelationshipToCase(request.getRelationshipToCase());
        member.setIncome(request.isIncome());
        member.setYearSalary(request.getYearSalary());
        member.setSupported(request.isSupported());

        HouseholdFamilyMembers saved = householdFamilyMembersRepository.save(member);
        return convertToResponse(saved);
    }

    public List<HouseholdFamilyMembersResponse> findAllByCaseInfoId(String caseInfoId) {
        return householdFamilyMembersRepository.findAll().stream()
                .filter(f -> f.getCaseInfo().getCaseInfoId().equals(caseInfoId))
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public HouseholdFamilyMembersResponse update(Integer memberId, HouseholdFamilyMembersUpdateRequest request) {
        HouseholdFamilyMembers member = householdFamilyMembersRepository.findById(memberId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "找不到家庭成員"));

        member.setName(request.getName());
        member.setRelationshipToCase(request.getRelationshipToCase());
        member.setIncome(request.isIncome());
        member.setYearSalary(request.getYearSalary());
        member.setSupported(request.isSupported());

        HouseholdFamilyMembers saved = householdFamilyMembersRepository.save(member);
        return convertToResponse(saved);
    }

    public HouseholdFamilyMembersResponse delete(Integer memberId) {
        HouseholdFamilyMembers member = householdFamilyMembersRepository.findById(memberId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "找不到家庭成員"));

        householdFamilyMembersRepository.deleteById(memberId);
        return convertToResponse(member);
    }

    private HouseholdFamilyMembersResponse convertToResponse(HouseholdFamilyMembers member) {
        return HouseholdFamilyMembersResponse.builder()
                .memberId(member.getMemberId())
                .name(member.getName())
                .relationshipToCase(member.getRelationshipToCase())
                .income(member.isIncome())
                .yearSalary(member.getYearSalary())
                .supported(member.isSupported())
                .build();
    }

    public List<HouseholdFamilyMembersResponse> insertBatch(String caseInfoId, List<HouseholdFamilyMembersInsertRequest> requestList) {
    CaseInfo caseInfo = caseInfoRepository.findByCaseInfoId(caseInfoId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "找不到個案"));

    List<HouseholdFamilyMembers> savedList = requestList.stream().map(request -> {
        HouseholdFamilyMembers member = new HouseholdFamilyMembers();
        member.setCaseInfo(caseInfo);
        member.setName(request.getName());
        member.setRelationshipToCase(request.getRelationshipToCase());
        member.setIncome(request.isIncome());
        member.setYearSalary(request.getYearSalary());
        member.setSupported(request.isSupported());
        return member;
    }).toList();

    List<HouseholdFamilyMembers> result = householdFamilyMembersRepository.saveAll(savedList);

    return result.stream()
            .map(this::convertToResponse)
            .toList();
    }

}
