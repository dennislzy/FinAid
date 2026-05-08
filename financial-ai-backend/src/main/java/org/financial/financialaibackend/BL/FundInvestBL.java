package org.financial.financialaibackend.BL;

import org.financial.financialaibackend.Dto.common.FilterObject;
import org.financial.financialaibackend.Dto.common.Result;
import org.financial.financialaibackend.Dto.fund.FundInvestInsertRequest;
import org.financial.financialaibackend.Dto.fund.FundInvestResponse;
import org.financial.financialaibackend.Dto.fund.FundUpdateRequest;
import org.financial.financialaibackend.Entity.CaseInfo;
import org.financial.financialaibackend.Entity.FundInvest;
import org.financial.financialaibackend.Entity.keys.FundInvestId;
import org.financial.financialaibackend.Repository.FundInvestRepository;
import org.financial.financialaibackend.Utils.DateUtil;
import org.financial.financialaibackend.Utils.EntityModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Component
public class FundInvestBL {

    @Autowired
    private EntityModelMapper entityModelMapper;

    @Autowired
    private FundInvestRepository fundInvestRepository;

    public FundInvestResponse insert(CaseInfo caseInfo, FundInvestInsertRequest fundInvestInsertRequest){
        FundInvestId fundInvestId=new FundInvestId(caseInfo,fundInvestInsertRequest.getFundName(),fundInvestInsertRequest.getFundPurchaseDate());
        Optional<FundInvest> optionalFundInvest = fundInvestRepository.findById(fundInvestId);
        if(optionalFundInvest.isPresent()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"該基金已新增過");
        }
        FundInvest fundInvest = entityModelMapper.map(fundInvestInsertRequest, FundInvest.class);
        fundInvest.setFundInvestId(fundInvestId);
        FundInvest fundInvest1 = fundInvestRepository.save(fundInvest);
        return convertToFundInvestResponse(caseInfo,fundInvest1);
    }

    public FundInvestResponse update(CaseInfo caseInfo,String fundName, String stringDate, FundUpdateRequest fundUpdateRequest){
        Date date = DateUtil.convertToDate(stringDate);
        FundInvestId fundInvestId=new FundInvestId(caseInfo,fundName,date);
        Optional<FundInvest> optionalFundInvest = fundInvestRepository.findByFundInvestId(fundInvestId);
        if(optionalFundInvest.isPresent()){
            FundInvest fundInvest = optionalFundInvest.get();
            entityModelMapper.map(fundUpdateRequest, fundInvest);
            FundInvest saveFundInvest = fundInvestRepository.save(fundInvest);
            return convertToFundInvestResponse(caseInfo,saveFundInvest);
        }else{
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"基金為找到");
        }
    }

    public FundInvestResponse delete(CaseInfo caseInfo,String fundName,String stringDate){
        Date date = DateUtil.convertToDate(stringDate);
        FundInvestId fundInvestId=new FundInvestId(caseInfo,fundName,date);
        Optional<FundInvest> optionalFundInvest = fundInvestRepository.findByFundInvestId(fundInvestId);
        if(optionalFundInvest.isPresent()){
            FundInvest fundInvest = optionalFundInvest.get();
            fundInvestRepository.delete(fundInvest);
            return convertToFundInvestResponse(caseInfo,fundInvest);
        }else{
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"基金找不到");
        }
    }
    
    public List<FundInvestResponse> getAllFundInvest(CaseInfo caseInfo) {
        List<FundInvest> all = fundInvestRepository.findAllByFundInvestId_CaseInfo_CaseInfoId(caseInfo.getCaseInfoId());
        return all.stream().map(f -> convertToFundInvestResponse(caseInfo, f)).toList();
    }

    public FundInvestResponse getFundInvest(CaseInfo caseInfo,String fundName,String stringDate){
        Date date = DateUtil.convertToDate(stringDate);
        FundInvestId fundInvestId=new FundInvestId(caseInfo,fundName,date);
        Optional<FundInvest> optionalFundInvest = fundInvestRepository.findByFundInvestId(fundInvestId);
        if(optionalFundInvest.isPresent()){
            FundInvest fundInvest = optionalFundInvest.get();
            return convertToFundInvestResponse(caseInfo,fundInvest);
        }else{
            return null;
        }
    }
    private FundInvestResponse convertToFundInvestResponse(CaseInfo caseInfo,FundInvest fundInvest){
        if (fundInvest==null){
            return null;
        }
        FundInvestResponse fundInvestResponse = entityModelMapper.mapWithLooseStrategy(fundInvest, FundInvestResponse.class);
        CaseInfo caseInfo1=new CaseInfo();
        caseInfo1.setCaseInfoId(caseInfo.getCaseInfoId());
        fundInvestResponse.setCaseInfo(caseInfo1);
        return fundInvestResponse;
    }
}
