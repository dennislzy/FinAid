import { CaseUrlRequest, DeleteMessage, HouseholdMonthlyInsertRequest, YearNeed } from "@/type/dto/dto";
import { HouseholdMonthlyFinancialRecords, HouseholdMonthSummaryResponse, HouseholdYearSummaryResponse } from "@/type/entity/entityType";
import { FINANCIAL_BACKEND_URL } from "@/utils/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
interface HouseholdRequest extends CaseUrlRequest{
    financialType:string,
    monthly:number,
    year:number
}
interface HouseholdUpdateRequest extends CaseUrlRequest{
    financialMonthlyRecordsId:string
}
interface HouseholdDeleteRequest extends CaseUrlRequest{
    idList:string[]
}
export const householdMonthlyApi=createApi({
    reducerPath:'householdMonthlyApi',
    tagTypes:['householdMonthly'],
    baseQuery:fetchBaseQuery({
        baseUrl:FINANCIAL_BACKEND_URL,
        prepareHeaders:(headers)=>{
            headers.set('Content-Type', 'application/json;charset=UTF-8')
            return headers
        }
    }),
    endpoints:(builder)=>({

        getHouseholdMonthly:builder.query<HouseholdMonthlyFinancialRecords[],HouseholdRequest>({
            query:({socialWorkerEmail,caseInfoId,financialType,year,monthly})=>({
                method:'GET',
                url:`/${socialWorkerEmail}/case/${caseInfoId}/household_monthly_financial_records?financialType=${financialType}&year=${year}&monthly=${monthly}`
            }),
            providesTags:['householdMonthly']
        }),

        createHouseholdMonthly:builder.mutation<HouseholdMonthlyFinancialRecords,HouseholdMonthlyInsertRequest & CaseUrlRequest>({
            query:({socialWorkerEmail,caseInfoId,...data})=>({
                method:'POST',
                url:`/${socialWorkerEmail}/case/${caseInfoId}/household_monthly_financial_records`,
                body:data
            }),
            invalidatesTags:['householdMonthly']
        }),

        updateHouseholdMonthly:builder.mutation<HouseholdMonthlyFinancialRecords,HouseholdMonthlyInsertRequest& HouseholdUpdateRequest>({
            query:({socialWorkerEmail,caseInfoId,financialMonthlyRecordsId,...data})=>({
                method:'PATCH',
                url:`/${socialWorkerEmail}/case/${caseInfoId}/household_monthly_financial_records/${financialMonthlyRecordsId}`,
                body:data
            }),
            invalidatesTags:['householdMonthly']
        }),

        deleteHouseholdMonthly:builder.mutation<DeleteMessage,HouseholdDeleteRequest>({
            query:({socialWorkerEmail,caseInfoId,idList})=>({
                method:'DELETE',
                url:`/${socialWorkerEmail}/case/${caseInfoId}/household_monthly_financial_records`,
                body:idList
            }),
            invalidatesTags:['householdMonthly']
        }),

        getMonthSummaryChart: builder.query<HouseholdMonthSummaryResponse[], CaseUrlRequest & YearNeed>({
            query: ({ socialWorkerEmail, caseInfoId, year }) => ({
                method: 'GET',
                url: `/${socialWorkerEmail}/case/${caseInfoId}/household_monthly_financial_records/monthly_summary_chart?year=${year}`,
            }),
            providesTags: ['householdMonthly']
        }),
    })
})

export const {
    useCreateHouseholdMonthlyMutation,
    useDeleteHouseholdMonthlyMutation,
    useGetHouseholdMonthlyQuery,
    useUpdateHouseholdMonthlyMutation,
    useGetMonthSummaryChartQuery
}=householdMonthlyApi