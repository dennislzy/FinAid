package org.financial.financialaibackend.Dto.mapping;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import org.financial.financialaibackend.Dto.bidding.BiddingRecordsInsertRequest;
import org.financial.financialaibackend.Dto.caseInfo.CaseInfoInsertRequest;
import org.financial.financialaibackend.Dto.fund.FundInvestInsertRequest;
import org.financial.financialaibackend.Dto.household.HouseholdMonthlyInsertRequest;
import org.financial.financialaibackend.Dto.household.HouseholdYearFinancialRecordsInsertRequest;
import org.financial.financialaibackend.Dto.insurance.InsuranceListInsertRequest;
import org.financial.financialaibackend.Dto.stock.StockPurchaseInsertRequest;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MappingRequest {

    private CaseInfoInsertRequest case_info;

    private List<StockPurchaseInsertRequest>  stock_purchase_records;

    private List<HouseholdMonthlyInsertRequest> household_monthly_financial_records;

    private List<HouseholdYearFinancialRecordsInsertRequest> household_year_financial_records;

    private List<InsuranceListInsertRequest> insurance_list;

    private List<FundInvestInsertRequest> fund_invest;

    private List<BiddingRecordsInsertRequest> aid_association;
}
