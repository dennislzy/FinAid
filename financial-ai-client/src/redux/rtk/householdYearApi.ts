import { CaseUrlRequest, HouseholdYearFinancialRecordsInsertRequest, HouseholdYearFinancialRecordsUpdateRequest } from "@/type/dto/dto";
import { HouseholdYearFinancialRecords, HouseholdYearSummaryResponse } from "@/type/entity/entityType";
import { FINANCIAL_BACKEND_URL } from "@/utils/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
interface householdYearRequest extends CaseUrlRequest{
    financialType:string,
    year:number
}
interface FinancialRecord{
    financialYearRecordsId: string;
}
interface DeleteHouseholdYearRequest extends CaseUrlRequest {
    ids: string[];  // 或是 number[] 取決於你的 ID 類型
  }
export const householdYearApi=createApi({
    reducerPath:'householdYearApi',
    tagTypes:['householdYear'],
    baseQuery:fetchBaseQuery({
        baseUrl:FINANCIAL_BACKEND_URL,
        prepareHeaders:(headers)=>{
            headers.set('Content-Type', 'application/json;charset=UTF-8')
            return headers
        }
    }),
    endpoints:(builder)=>({
        
        getHouseholdYear:builder.query<HouseholdYearFinancialRecords[],householdYearRequest>({
            query:({socialWorkerEmail,caseInfoId,financialType,year})=>({
                method:'GET',
                url:`/${socialWorkerEmail}/case/${caseInfoId}/household_year_financial_records?financialType=${financialType}&year=${year}`    
            }),
            providesTags:['householdYear']
        }),

        createHouseholdYear:builder.mutation<HouseholdYearFinancialRecords,HouseholdYearFinancialRecordsInsertRequest & CaseUrlRequest>({
            query:({socialWorkerEmail,caseInfoId,...householdYearFinancialRecordsInsertRequest})=>({
                method:'POST',
                url:`/${socialWorkerEmail}/case/${caseInfoId}/household_year_financial_records`,
                body:householdYearFinancialRecordsInsertRequest
            }),
            invalidatesTags:['householdYear']
        }),

        updateHouseYear:builder.mutation<HouseholdYearFinancialRecords,HouseholdYearFinancialRecordsUpdateRequest & CaseUrlRequest & FinancialRecord>({
            query:({socialWorkerEmail,caseInfoId,financialYearRecordsId,...householdYearFinancialRecordsUpdateRequest})=>({
                method:'PATCH',
                url:`/${socialWorkerEmail}/case/${caseInfoId}/household_year_financial_records/${financialYearRecordsId}`,
                body:householdYearFinancialRecordsUpdateRequest
            }),
            invalidatesTags:['householdYear']
        }),

        deleteHouseYear: builder.mutation<string, DeleteHouseholdYearRequest>({
            query: ({ socialWorkerEmail, caseInfoId, ids }) => ({
              method: 'DELETE',
              url: `/${socialWorkerEmail}/case/${caseInfoId}/household_year_financial_records`,
              body: ids
            }),
            invalidatesTags: ['householdYear']
        }),

        getYearSummaryChart: builder.query<HouseholdYearSummaryResponse[], CaseUrlRequest>({
            query: ({ socialWorkerEmail, caseInfoId }) => ({
              method: 'GET',
              url: `/${socialWorkerEmail}/case/${caseInfoId}/household_year_financial_records/year_summary_chart`,
            }),
            providesTags: ['householdYear']
        }),
    })
})

export const {
    useCreateHouseholdYearMutation,
    useDeleteHouseYearMutation,
    useGetHouseholdYearQuery,
    useUpdateHouseYearMutation,
    useGetYearSummaryChartQuery
}=householdYearApi