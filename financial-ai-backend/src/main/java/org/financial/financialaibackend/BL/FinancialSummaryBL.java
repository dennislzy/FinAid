package org.financial.financialaibackend.BL;

import org.financial.financialaibackend.Dto.SubsidyResponse;
import org.financial.financialaibackend.Dto.bidding.BiddingRecordsResponse;
import org.financial.financialaibackend.Dto.fund.FundInvestResponse;
import org.financial.financialaibackend.Dto.stock.StockPurchaseResponse;
import org.financial.financialaibackend.Entity.Bond;
import org.financial.financialaibackend.Entity.CaseInfo;
import org.financial.financialaibackend.Repository.BondRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.ZoneId;
import java.util.*;

@Component
public class FinancialSummaryBL {

    @Autowired
    private SubsidyBL subsidyBL;

    @Autowired
    private StockPurchaseBL stockPurchaseBL;

    @Autowired
    private FundInvestBL fundInvestBL;

    @Autowired
    private BondRepository bondRepository;

    @Autowired
    private BiddingRecordsBL biddingRecordsBL;

    public Map<String, Object> getYearlyFinancialSummary(String caseInfoId, Integer year) {
        Map<Integer, Integer> subsidyApplyMap = new HashMap<>();
        Map<Integer, Integer> stockMap = new HashMap<>();
        Map<Integer, Integer> fundMap = new HashMap<>();
        Map<Integer, Integer> bondMap = new HashMap<>();
        Map<Integer, Integer> biddingMap = new HashMap<>();

        // 補助
        for (SubsidyResponse subsidy : subsidyBL.getAllSubsidies(caseInfoId)) {
            if (subsidy.getApplyTime() == null) continue;
            int applyYear = extractYear(subsidy.getApplyTime());
            subsidyApplyMap.merge(applyYear, subsidy.getMoney(), Integer::sum);
        }

        // 股票
        for (StockPurchaseResponse stock : stockPurchaseBL.getAll(caseInfoId)) {
            if (stock.getStockPurchaseDate() == null || stock.getShares() == null || stock.getAverageBuyPrice() == null)
                continue;
            int recordYear = extractYear(stock.getStockPurchaseDate());
            int total = (int) Math.round(stock.getShares() * stock.getAverageBuyPrice());
            stockMap.merge(recordYear, total, Integer::sum);
        }

        // 基金
        CaseInfo caseInfo = new CaseInfo();
        caseInfo.setCaseInfoId(caseInfoId);
        for (FundInvestResponse fund : fundInvestBL.getAllFundInvest(caseInfo)) {
            if (fund.getFundPurchaseDate() == null || fund.getInvestmentAmount() == null) continue;
            int recordYear = extractYear(fund.getFundPurchaseDate());
            fundMap.merge(recordYear, fund.getInvestmentAmount(), Integer::sum);
        }

        // 債券
        for (Bond bond : bondRepository.findAllByCaseInfo_CaseInfoId(caseInfoId)) {
            if (bond.getApplyTime() == null || bond.getMoney() == null) continue;
            int recordYear = extractYear(bond.getApplyTime());
            bondMap.merge(recordYear, bond.getMoney(), Integer::sum);
        }

        // 標會
        for (BiddingRecordsResponse bidding : biddingRecordsBL.getAll(caseInfoId)) {
            if (bidding.getStartDate() == null || bidding.getMonthlyAmount() == null || bidding.getPeriod() == null)
                continue;
            int recordYear = extractYear(bidding.getStartDate());
            int total = bidding.getMonthlyAmount() * bidding.getPeriod();
            if (bidding.getMonthlyExtraBid() != null) total += bidding.getMonthlyExtraBid();
            if (bidding.getOther() != null) total += bidding.getOther();
            biddingMap.merge(recordYear, total, Integer::sum);
        }

        // 整合單一年份的資料
        if (year != null) {
            Map<String, Object> item = new HashMap<>();
            item.put("year", year);
            item.put("subsidyApply", subsidyApplyMap.getOrDefault(year, 0));
            item.put("stockInvestment", stockMap.getOrDefault(year, 0));
            item.put("fundInvestment", fundMap.getOrDefault(year, 0));
            item.put("bondInvestment", bondMap.getOrDefault(year, 0));
            item.put("biddingTotal", biddingMap.getOrDefault(year, 0));
            return item;
        }

        return Collections.emptyMap(); // 若沒有指定年份或找不到資料
    }

    private int extractYear(Date date) {
        return new java.util.Date(date.getTime())
                .toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate()
                .getYear();
    }
}
