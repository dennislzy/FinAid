/* eslint-disable @typescript-eslint/no-unused-vars */
import { AllowancePurchaseInsertRequest,  CaseUrlRequest, FilterObject, Result, StockPurchaseInsertRequest, StockPurchaseUpdateRequest } from "@/type/dto/dto";
import { AllowancePurchaseResponse,  dashAllAssetResponse,  dashAllLiabilityResponse,  dashAssetResponse,  dashInsuranceResponse,  dashMonthlyBalanceResponse,  dashOtherDetailResponse,  StockPurchaseResponse } from "@/type/entity/entityType";
import { FINANCIAL_BACKEND_URL } from "@/utils/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
interface dashRequest extends CaseUrlRequest{
    year: number,
}
export const dashApi=createApi({
    reducerPath:'dashApi',
    tagTypes:['dash'],
    baseQuery:fetchBaseQuery({
        baseUrl:FINANCIAL_BACKEND_URL,
        prepareHeaders:(headers)=>{
            headers.set('Content-Type', 'application/json;charset=UTF-8')
            return headers
        }
    }),
    endpoints:(builder)=>({
        //獲取個案的流動與非流動資產
        getAsset: builder.query<dashAssetResponse, dashRequest>({
            query: (urlRequest) => ({
                method: 'GET',
                url: `/${urlRequest.socialWorkerEmail}/case/${urlRequest.caseInfoId}/household_year_financial_records/asset_pie_chart?year=${urlRequest.year}`,
            }),
            providesTags:['dash']
        }),
        
        // 獲取個案的所有資產
        getAllAsset: builder.query<dashAllAssetResponse, dashRequest>({
            query: (urlRequest) => ({
                method: 'GET',
                url: `/${urlRequest.socialWorkerEmail}/case/${urlRequest.caseInfoId}/household_year_financial_records/asset_pie_chart_by_category?year=${urlRequest.year}`,
            }),
            providesTags:['dash']
        }),

        // 獲取個案的所有負債
        getAllLiability: builder.query<dashAllLiabilityResponse, dashRequest>({
            query: (urlRequest) => ({
                method: 'GET',
                url: `/${urlRequest.socialWorkerEmail}/case/${urlRequest.caseInfoId}/household_year_financial_records/liability_pie_chart_by_category?year=${urlRequest.year}`,
            }),
            providesTags:['dash']
        }),

        // 獲取個案該年度每月收支狀況
        getMonthlyBalance: builder.query<dashMonthlyBalanceResponse[], dashRequest>({
            query: (urlRequest) => ({
                method: 'GET',
                url: `/${urlRequest.socialWorkerEmail}/case/${urlRequest.caseInfoId}/household_monthly_financial_records/monthly_balance_chart?year=${urlRequest.year}`,
            }),
            providesTags:['dash']
        }),

        // 獲取個案其他明細
        getOtherDetail: builder.query<dashOtherDetailResponse, dashRequest>({
            query: (urlRequest) => ({
                method: 'GET',
                url: `/${urlRequest.socialWorkerEmail}/case/${urlRequest.caseInfoId}/financial_summary/all_dashboard?year=${urlRequest.year}`,
            }),
            providesTags:['dash']
        }),

        // 獲取個案所有保險
        getAllInsurance: builder.query<dashInsuranceResponse[], dashRequest>({
            query: (urlRequest) => ({
                method: 'GET',
                url: `/${urlRequest.socialWorkerEmail}/case/${urlRequest.caseInfoId}/insurance/insurance_chart?year=${urlRequest.year}`,
            }),
            providesTags:['dash']
        }),
    })
})
export const {
    useGetAssetQuery,
    useGetAllAssetQuery,
    useGetAllLiabilityQuery,
    useGetMonthlyBalanceQuery,
    useGetOtherDetailQuery,
    useGetAllInsuranceQuery,
}=dashApi