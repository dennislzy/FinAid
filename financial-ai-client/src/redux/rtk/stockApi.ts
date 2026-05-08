/* eslint-disable @typescript-eslint/no-unused-vars */
import { CaseUrlRequest, FilterObject, Result, StockPurchaseInsertRequest, StockPurchaseUpdateRequest } from "@/type/dto/dto";
import { StockPurchaseResponse } from "@/type/entity/entityType";
import { FINANCIAL_BACKEND_URL } from "@/utils/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
interface StockRequest extends CaseUrlRequest{
    stockCode:string,
    stockPurchaseDate:string
}
export const stockApi=createApi({
    reducerPath:'stockApi',
    tagTypes:['stocks'],
    baseQuery:fetchBaseQuery({
        baseUrl:FINANCIAL_BACKEND_URL,
        prepareHeaders:(headers)=>{
            headers.set('Content-Type', 'application/json;charset=UTF-8')
            return headers
        }
    }),
    endpoints:(builder)=>({
        getAllStocks:builder.query<StockPurchaseResponse[],CaseUrlRequest>({
            query:({socialWorkerEmail,caseInfoId})=>({
                method:'GET',
                url:`/${socialWorkerEmail}/case/${caseInfoId}/stock/`,
            }),
            providesTags:['stocks']
        }),

        getStock: builder.query<StockPurchaseResponse, StockRequest>({
            query: (urlRequest) => ({
                method: 'GET',
                url: `/${urlRequest.socialWorkerEmail}/case/${urlRequest.caseInfoId}/stock/${urlRequest.stockCode}/${urlRequest.stockPurchaseDate}`
            }),
            providesTags:['stocks']
        }),        

        createStock:builder.mutation<StockPurchaseResponse,StockPurchaseInsertRequest & CaseUrlRequest>({
            query:({socialWorkerEmail,caseInfoId,...stockPurchaseInsertRequest})=>({
                method:'POST',
                url:`/${socialWorkerEmail}/case/${caseInfoId}/stock/`,
                body:stockPurchaseInsertRequest
            }),
            invalidatesTags:['stocks']
        }),

        deleteStock:builder.mutation<StockPurchaseResponse,StockRequest>({
            query:({socialWorkerEmail,caseInfoId,stockCode,stockPurchaseDate})=>({
                method:'DELETE',
                url:`/${socialWorkerEmail}/case/${caseInfoId}/stock/${stockCode}/${stockPurchaseDate}`
            }),
            invalidatesTags:['stocks']
        }),

        updateStock:builder.mutation<StockPurchaseResponse,StockPurchaseUpdateRequest & StockRequest>({
            query:({socialWorkerEmail,caseInfoId,stockCode,stockPurchaseDate,...stockPurchaseUpdateRequest})=>({
                method:'PATCH',
                url:`/${socialWorkerEmail}/case/${caseInfoId}/stock/${stockCode}/${stockPurchaseDate}`,
                body:stockPurchaseUpdateRequest
            }),
            invalidatesTags:(arg)=>[
                'stocks',
                {type:'stocks',id:`${arg?.stockCode}-${arg?.stockPurchaseDate}`}
            ]
        })
    })
})
export const {
    useCreateStockMutation,
    useGetAllStocksQuery,
    useDeleteStockMutation,
    useGetStockQuery,
    useUpdateStockMutation,
    useLazyGetStockQuery
}=stockApi