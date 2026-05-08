/* eslint-disable @typescript-eslint/no-unused-vars */
import { AllowancePurchaseInsertRequest, BondInsertRequest, CaseUrlRequest, FilterObject, Result, StockPurchaseInsertRequest, StockPurchaseUpdateRequest } from "@/type/dto/dto";
import { AllowancePurchaseResponse, BondResponse, StockPurchaseResponse } from "@/type/entity/entityType";
import { FINANCIAL_BACKEND_URL } from "@/utils/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
interface BondRequest extends CaseUrlRequest{
    bondId:number,
}
export const bondApi=createApi({
    reducerPath:'bondApi',
    tagTypes:['bond'],
    baseQuery:fetchBaseQuery({
        baseUrl:FINANCIAL_BACKEND_URL,
        prepareHeaders:(headers)=>{
            headers.set('Content-Type', 'application/json;charset=UTF-8')
            return headers
        }
    }),
    endpoints:(builder)=>({
        getAllBond:builder.query<BondResponse[],CaseUrlRequest>({
            query:({socialWorkerEmail,caseInfoId})=>({
                method:'GET',
                url:`/${socialWorkerEmail}/case/${caseInfoId}/bond`,
            }),
            providesTags:['bond']
        }),

        getBond: builder.query<BondResponse, BondRequest>({
            query: (urlRequest) => ({
                method: 'GET',
                url: `/${urlRequest.socialWorkerEmail}/case/${urlRequest.caseInfoId}/bond/${urlRequest.bondId}`
            }),
            providesTags:['bond']
        }),        

        createBond:builder.mutation<BondResponse,BondInsertRequest & CaseUrlRequest>({
            query:({socialWorkerEmail,caseInfoId,...bondInsertRequest})=>({
                method:'POST',
                url:`/${socialWorkerEmail}/case/${caseInfoId}/bond`,
                body:bondInsertRequest
            }),
            invalidatesTags:['bond']
        }),

        deleteBond:builder.mutation<BondResponse,BondRequest>({
            query:({socialWorkerEmail,caseInfoId,bondId})=>({
                method:'DELETE',
                url:`/${socialWorkerEmail}/case/${caseInfoId}/bond/${bondId}`
            }),
            invalidatesTags:['bond']
        }),

        updateBond:builder.mutation<BondResponse,BondInsertRequest & BondRequest>({
            query:({socialWorkerEmail,caseInfoId,bondId,...bondInsertRequest})=>({
                method:'PATCH',
                url:`/${socialWorkerEmail}/case/${caseInfoId}/bond/${bondId}`,
                body:bondInsertRequest
            }),
            invalidatesTags:['bond']
        })
    })
})
export const {
    useCreateBondMutation,
    useGetAllBondQuery,
    useDeleteBondMutation,
    useGetBondQuery,
    useUpdateBondMutation,
    useLazyGetBondQuery
}=bondApi