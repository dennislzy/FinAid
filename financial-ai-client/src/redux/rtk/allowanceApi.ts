/* eslint-disable @typescript-eslint/no-unused-vars */
import { AllowancePurchaseInsertRequest, CaseUrlRequest, FilterObject, Result, StockPurchaseInsertRequest, StockPurchaseUpdateRequest } from "@/type/dto/dto";
import { AllowancePurchaseResponse, StockPurchaseResponse } from "@/type/entity/entityType";
import { FINANCIAL_BACKEND_URL } from "@/utils/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
interface AllowanceRequest extends CaseUrlRequest{
    subsidyId:number,
}
export const allowanceApi=createApi({
    reducerPath:'allowanceApi',
    tagTypes:['allowance'],
    baseQuery:fetchBaseQuery({
        baseUrl:FINANCIAL_BACKEND_URL,
        prepareHeaders:(headers)=>{
            headers.set('Content-Type', 'application/json;charset=UTF-8')
            return headers
        }
    }),
    endpoints:(builder)=>({
        getAllAllowance:builder.query<AllowancePurchaseResponse[],CaseUrlRequest>({
            query:({socialWorkerEmail,caseInfoId})=>({
                method:'GET',
                url:`/${socialWorkerEmail}/case/${caseInfoId}/subsidy`,
            }),
            providesTags:['allowance']
        }),

        getAllowance: builder.query<AllowancePurchaseResponse, AllowanceRequest>({
            query: (urlRequest) => ({
                method: 'GET',
                url: `/${urlRequest.socialWorkerEmail}/case/${urlRequest.caseInfoId}/subsidy/${urlRequest.subsidyId}`
            }),
            providesTags:['allowance']
        }),        

        createAllowance:builder.mutation<AllowancePurchaseResponse,AllowancePurchaseInsertRequest & CaseUrlRequest>({
            query:({socialWorkerEmail,caseInfoId,...allowancePurchaseInsertRequest})=>({
                method:'POST',
                url:`/${socialWorkerEmail}/case/${caseInfoId}/subsidy`,
                body:allowancePurchaseInsertRequest
            }),
            invalidatesTags:['allowance']
        }),

        deleteAllowance:builder.mutation<AllowancePurchaseResponse,AllowanceRequest>({
            query:({socialWorkerEmail,caseInfoId,subsidyId})=>({
                method:'DELETE',
                url:`/${socialWorkerEmail}/case/${caseInfoId}/subsidy/${subsidyId}`
            }),
            invalidatesTags:['allowance']
        }),

        updateAllowance:builder.mutation<AllowancePurchaseResponse,AllowancePurchaseInsertRequest & AllowanceRequest>({
            query:({socialWorkerEmail,caseInfoId,subsidyId,...allowancePurchaseInsertRequest})=>({
                method:'PATCH',
                url:`/${socialWorkerEmail}/case/${caseInfoId}/subsidy/${subsidyId}`,
                body:allowancePurchaseInsertRequest
            }),
            invalidatesTags:['allowance']
        })
    })
})
export const {
    useCreateAllowanceMutation,
    useGetAllAllowanceQuery,
    useDeleteAllowanceMutation,
    useGetAllowanceQuery,
    useUpdateAllowanceMutation,
    useLazyGetAllowanceQuery
}=allowanceApi