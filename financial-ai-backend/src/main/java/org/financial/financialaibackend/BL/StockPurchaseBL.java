package org.financial.financialaibackend.BL;

import org.financial.financialaibackend.Dto.common.FilterObject;
import org.financial.financialaibackend.Dto.common.Result;
import org.financial.financialaibackend.Dto.stock.StockPurchaseInsertRequest;
import org.financial.financialaibackend.Dto.stock.StockPurchaseResponse;
import org.financial.financialaibackend.Dto.stock.StockPurchaseUpdateRequest;
import org.financial.financialaibackend.Entity.CaseInfo;
import org.financial.financialaibackend.Entity.StockPurchaseRecord;
import org.financial.financialaibackend.Entity.keys.StockPurchaseRecordsId;
import org.financial.financialaibackend.Repository.CaseInfoRepository;
import org.financial.financialaibackend.Repository.StockPurchaseRecordRepository;
import org.financial.financialaibackend.Utils.EntityModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Component
public class StockPurchaseBL {

    @Autowired
    private StockPurchaseRecordRepository stockPurchaseRecordRepository;

    @Autowired
    private EntityModelMapper entityModelMapper;

    @Autowired
    private CaseInfoRepository caseInfoRepository;

    public StockPurchaseResponse insert(String caseInfoId,StockPurchaseInsertRequest stockPurchaseInsertRequest){
        CaseInfo caseInfo=caseInfoRepository.findByCaseInfoId(caseInfoId).orElse(null);
        StockPurchaseRecord stockPurchaseRecord=entityModelMapper.map(stockPurchaseInsertRequest, StockPurchaseRecord.class);
        StockPurchaseRecordsId s=new StockPurchaseRecordsId(stockPurchaseInsertRequest.getStockCode(),stockPurchaseInsertRequest.getStockPurchaseDate(),caseInfo);
        if (stockPurchaseRecordRepository.findByStockPurchaseRecordsId(s).isPresent()){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Stock Purchase Record already exists");
        }
        stockPurchaseRecord.setStockPurchaseRecordsId(s);
        StockPurchaseRecord stockPurchaseRecord1 = stockPurchaseRecordRepository.save(stockPurchaseRecord);
        return convertStockPurchaseRecordToStockPurchaseResponse(caseInfoId,stockPurchaseRecord1);
    }

    public StockPurchaseResponse update(String caseInfoId, StockPurchaseRecordsId stockPurchaseRecordsId, StockPurchaseUpdateRequest stockPurchaseUpdateRequest){
        CaseInfo caseInfo=caseInfoRepository.findByCaseInfoId(caseInfoId).orElse(null);
        stockPurchaseRecordsId.setCaseInfo(caseInfo);
        Optional<StockPurchaseRecord> byStockPurchaseRecordsId = stockPurchaseRecordRepository.findByStockPurchaseRecordsId(stockPurchaseRecordsId);
        if (byStockPurchaseRecordsId.isPresent()){
            StockPurchaseRecord stockPurchaseRecord=byStockPurchaseRecordsId.get();
            entityModelMapper.map(stockPurchaseUpdateRequest, stockPurchaseRecord);
            StockPurchaseRecord stockPurchaseRecord1 = stockPurchaseRecordRepository.save(stockPurchaseRecord);
            return convertStockPurchaseRecordToStockPurchaseResponse(caseInfoId,stockPurchaseRecord1);
        }else{
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Stock Purchase Record does not exist");
        }
    }

    public StockPurchaseResponse delete(String caseInfoId, StockPurchaseRecordsId stockPurchaseRecordsId){
        CaseInfo caseInfo=new CaseInfo();
        caseInfo.setCaseInfoId(caseInfoId);
        stockPurchaseRecordsId.setCaseInfo(caseInfo);
        Optional<StockPurchaseRecord> stockPurchaseRecords = stockPurchaseRecordRepository.findByStockPurchaseRecordsId(stockPurchaseRecordsId);
        if (stockPurchaseRecords.isPresent()){
            StockPurchaseRecord stockPurchaseRecord=stockPurchaseRecords.get();
            stockPurchaseRecordRepository.delete(stockPurchaseRecord);
            return convertStockPurchaseRecordToStockPurchaseResponse(caseInfoId,stockPurchaseRecord);
        }else{
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Stock Purchase Record does not exist");
        }
    }
    public StockPurchaseResponse get(String caseInfoId, StockPurchaseRecordsId stockPurchaseRecordsId){
        CaseInfo caseInfo=new CaseInfo();
        caseInfo.setCaseInfoId(caseInfoId);
        stockPurchaseRecordsId.setCaseInfo(caseInfo);
        Optional<StockPurchaseRecord> stockPurchaseRecords = stockPurchaseRecordRepository.findByStockPurchaseRecordsId(stockPurchaseRecordsId);
        if (stockPurchaseRecords.isPresent()){
            StockPurchaseRecord stockPurchaseRecord=stockPurchaseRecords.get();
            return convertStockPurchaseRecordToStockPurchaseResponse(caseInfoId,stockPurchaseRecord);
        }else{
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Stock Purchase Record does not exist");
        }
    }
    
    public List<StockPurchaseResponse> getAll(String caseInfoId) {
        List<StockPurchaseRecord> records = stockPurchaseRecordRepository.findByStockPurchaseRecordsId_CaseInfo_CaseInfoId(caseInfoId);
        return records.stream()
                .map(record -> convertStockPurchaseRecordToStockPurchaseResponse(caseInfoId, record))
                .toList();
    }
    
    private StockPurchaseResponse convertStockPurchaseRecordToStockPurchaseResponse(String caseInfoId,StockPurchaseRecord stockPurchaseRecord){
        StockPurchaseResponse stockPurchaseResponse=entityModelMapper.mapWithLooseStrategy(stockPurchaseRecord, StockPurchaseResponse.class);
        CaseInfo caseInfo=new CaseInfo();
        caseInfo.setCaseInfoId(caseInfoId);
        stockPurchaseResponse.setCaseInfo(caseInfo);
        return stockPurchaseResponse;
    }

}
