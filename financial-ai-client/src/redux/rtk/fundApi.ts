/* eslint-disable @typescript-eslint/no-unused-vars */
import { CaseUrlRequest, FilterObject, FundInvestInsertRequest, FundUpdateRequest, Result } from "@/type/dto/dto";
import { FundInvestResponse } from "@/type/entity/entityType";
import { FINANCIAL_BACKEND_URL } from "@/utils/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
interface FundRequest extends CaseUrlRequest{
    fundName:string,
    fundPurchaseDate:string
}
export const fundApi=createApi({
    reducerPath:'fundApi',
    tagTypes:['funds'],
    baseQuery:fetchBaseQuery({
        baseUrl:FINANCIAL_BACKEND_URL,
        prepareHeaders:(headers)=>{
            headers.set('Content-Type', 'application/json;charset=UTF-8')
            return headers
        }
    }),
    endpoints:(builder)=>({
        getAllFunds:builder.query<FundInvestResponse[],CaseUrlRequest>({
            query:({socialWorkerEmail,caseInfoId})=>({
                method:'GET',
                url:`/${socialWorkerEmail}/case/${caseInfoId}/fund`,
            }),
            providesTags:['funds']
        }),
        
        getFund:builder.query<FundInvestResponse,FundRequest>({
            query:({socialWorkerEmail,caseInfoId,fundName,fundPurchaseDate})=>({
                method:'GET',
                url:`/${socialWorkerEmail}/case/${caseInfoId}/fund/${fundName}/${fundPurchaseDate}`
            }),
            providesTags:(result,error,arg)=>[
                {
                    type:'funds',
                    id:`${arg?.fundName}-${arg?.fundPurchaseDate}`
                }
            ]
        }),

        createFund:builder.mutation<FundInvestResponse,CaseUrlRequest & FundInvestInsertRequest>({
            query:({socialWorkerEmail,caseInfoId,...fundInvestInsertRequest})=>({
                method:'POST',
                url:`/${socialWorkerEmail}/case/${caseInfoId}/fund`,
                body:fundInvestInsertRequest
            }),
            invalidatesTags:['funds']
        }),

        updateFund:builder.mutation<FundInvestResponse,FundRequest & FundUpdateRequest>({
            query:({socialWorkerEmail,caseInfoId,fundName,fundPurchaseDate,...fundUpdateRequest})=>({
                method:'PATCH',
                url:`/${socialWorkerEmail}/case/${caseInfoId}/fund/${fundName}/${fundPurchaseDate}`,
                body:fundUpdateRequest
            }),
            invalidatesTags:(arg)=>[
                'funds',
                {
                    type:'funds',
                    id:`${arg?.fundName}-${arg?.fundPurchaseDate}`
                }
            ]
        }),

        deleteFund:builder.mutation<FundInvestResponse,FundRequest>({
            query:({socialWorkerEmail,caseInfoId,fundName,fundPurchaseDate})=>({
                method:'DELETE',
                url:`/${socialWorkerEmail}/case/${caseInfoId}/fund/${fundName}/${fundPurchaseDate}`
            }),
            invalidatesTags:['funds']
        })
    })
})

export const {
   useCreateFundMutation,
   useDeleteFundMutation,
   useUpdateFundMutation,
   useGetAllFundsQuery,
   useGetFundQuery
}=fundApi