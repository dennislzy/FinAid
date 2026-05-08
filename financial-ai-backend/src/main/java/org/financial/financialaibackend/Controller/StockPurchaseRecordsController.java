package org.financial.financialaibackend.Controller;

import jakarta.validation.Valid;
import org.financial.financialaibackend.BL.CaseInfoBL;
import org.financial.financialaibackend.BL.SocialWorkerBL;
import org.financial.financialaibackend.BL.StockPurchaseBL;
import org.financial.financialaibackend.Dto.*;
import org.financial.financialaibackend.Dto.common.FilterObject;
import org.financial.financialaibackend.Dto.common.Result;
import org.financial.financialaibackend.Dto.stock.StockPurchaseInsertRequest;
import org.financial.financialaibackend.Dto.stock.StockPurchaseResponse;
import org.financial.financialaibackend.Dto.stock.StockPurchaseUpdateRequest;
import org.financial.financialaibackend.Entity.keys.StockPurchaseRecordsId;
import org.financial.financialaibackend.Utils.DateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/{socialWorkerEmail}/case/{caseInfoId}/stock")
public class StockPurchaseRecordsController {

   @Autowired
   private SocialWorkerBL socialWorkerBl;

   @Autowired
   private CaseInfoBL caseInfoBl;

   @Autowired
   private StockPurchaseBL stockPurchaseBl;


    @PostMapping("/")
    public ResponseEntity<Object> insertStockPurchaseRecords(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @RequestBody @Valid StockPurchaseInsertRequest stockPurchaseRequest
            ){

        socialWorkerBl.checkSocialWorker(socialWorkerEmail);

        caseInfoBl.checkCaseInfo(caseInfoId);

        StockPurchaseResponse stockPurchaseResponse = stockPurchaseBl.insert(caseInfoId, stockPurchaseRequest);

        return ResponseEntity.ok(stockPurchaseResponse);
    }

    @PatchMapping("/{stockCode}/{stockPurchaseDate}")
    public ResponseEntity<Object> updateStockPurchaseRecords(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @PathVariable String stockCode,
            @PathVariable String stockPurchaseDate,
            @RequestBody @Valid StockPurchaseUpdateRequest stockPurchaseUpdateRequest
    ){
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);

        caseInfoBl.checkCaseInfo(caseInfoId);

        Date date=DateUtil.convertToDate(stockPurchaseDate);

        StockPurchaseRecordsId stockPurchaseId=new StockPurchaseRecordsId(stockCode,date,null);

        StockPurchaseResponse stockPurchaseResponse = stockPurchaseBl.update(caseInfoId, stockPurchaseId, stockPurchaseUpdateRequest);
        return ResponseEntity.ok(stockPurchaseResponse);
    }

    @DeleteMapping("/{stockCode}/{stockPurchaseDate}")
    public ResponseEntity<Object> deleteStockPurchaseRecords(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @PathVariable String stockCode,
            @PathVariable String stockPurchaseDate
    )  {
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);

        caseInfoBl.checkCaseInfo(caseInfoId);

        Date date= DateUtil.convertToDate(stockPurchaseDate);
        StockPurchaseRecordsId stockPurchaseId=new StockPurchaseRecordsId(stockCode,date,null);
        StockPurchaseResponse stockPurchaseResponse = stockPurchaseBl.delete(caseInfoId, stockPurchaseId);
        return ResponseEntity.ok(stockPurchaseResponse);
    }

    @GetMapping("/{stockCode}/{stockPurchaseDate}")
    public ResponseEntity<Object> getStockPurchaseRecords(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId,
            @PathVariable String stockCode,
            @PathVariable String stockPurchaseDate
    ){
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);

        caseInfoBl.checkCaseInfo(caseInfoId);

        Date date=DateUtil.convertToDate(stockPurchaseDate);

        StockPurchaseRecordsId stockPurchaseRecordsId=new StockPurchaseRecordsId(stockCode,date,null);

        StockPurchaseResponse stockPurchaseResponse = stockPurchaseBl.get(caseInfoId, stockPurchaseRecordsId);

        return ResponseEntity.ok(stockPurchaseResponse);
    }

    @GetMapping("/")
    public ResponseEntity<Object> getAllStockPurchaseRecords(
            @PathVariable String socialWorkerEmail,
            @PathVariable String caseInfoId
    ) {
        socialWorkerBl.checkSocialWorker(socialWorkerEmail);
        caseInfoBl.checkCaseInfo(caseInfoId);
        List<StockPurchaseResponse> result = stockPurchaseBl.getAll(caseInfoId);
        return ResponseEntity.ok(result);
    }

}
