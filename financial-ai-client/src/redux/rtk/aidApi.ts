/* eslint-disable @typescript-eslint/no-unused-vars */
import { AidAssociationInsertRequest, AidAssociationUpdateRequest, CaseUrlRequest, DeleteMessage, FilterObject, Result } from "@/type/dto/dto";
import { AidAssociationResponse } from "@/type/entity/entityType";
import { FINANCIAL_BACKEND_URL } from "@/utils/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface AidDeleteRequest extends CaseUrlRequest{
    aidAssociationId:string
}
interface AidUpdateRequest extends CaseUrlRequest{
    aidAssociationId:string
}
export const aidApi=createApi({
    reducerPath:'aidApi',
    tagTypes:['aid'],
    baseQuery:fetchBaseQuery({
        baseUrl:FINANCIAL_BACKEND_URL,
        prepareHeaders:(headers)=>{
            headers.set('Content-Type', 'application/json;charset=UTF-8')
            return headers
        }
    }),
    endpoints:(builder)=>({

        getAid:builder.query<AidAssociationResponse[],CaseUrlRequest>({
            query:({socialWorkerEmail,caseInfoId})=>({
                method:'GET',
                url:`/${socialWorkerEmail}/case/${caseInfoId}/aid`,
            }),
            providesTags:['aid']
        }),

        createAid:builder.mutation<AidAssociationResponse,AidAssociationInsertRequest &CaseUrlRequest>({
            query:({socialWorkerEmail,caseInfoId,...data})=>({
                method:'POST',
                url:`/${socialWorkerEmail}/case/${caseInfoId}/aid`,
                body:data
            }),
            invalidatesTags:['aid']
        }),

        updateAid:builder.mutation<AidAssociationResponse,AidUpdateRequest & AidAssociationUpdateRequest>({
            query:({socialWorkerEmail,caseInfoId,aidAssociationId,...data})=>({
                method:'PATCH',
                url:`/${socialWorkerEmail}/case/${caseInfoId}/aid/${aidAssociationId}`,
                body:data
            }),
            invalidatesTags:['aid']
        }),

        deleteAid:builder.mutation<DeleteMessage,AidDeleteRequest>({
            query:({socialWorkerEmail,caseInfoId,aidAssociationId})=>({
                method:'DELETE',
                url:`/${socialWorkerEmail}/case/${caseInfoId}/aid/${aidAssociationId}`
            }),
            invalidatesTags:['aid']
        })
    })
})

export const {
    useCreateAidMutation,
    useDeleteAidMutation,
    useGetAidQuery,
    useUpdateAidMutation
}=aidApi