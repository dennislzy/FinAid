import { CaseUrlRequest, FamilyMemberInsertRequest, FamilyMemberUpdateRequest, InsuranceListUpdateRequest } from "@/type/dto/dto";
import { FamilyMemberResponse } from "@/type/entity/entityType";
import { FINANCIAL_BACKEND_URL } from "@/utils/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface FamilyRequest extends CaseUrlRequest {
    memberId?: number; 
}

export const familyApi = createApi({
    reducerPath: 'familyApi',
    tagTypes: ['family'],
    baseQuery: fetchBaseQuery({
        baseUrl: FINANCIAL_BACKEND_URL,
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json;charset=UTF-8')
            return headers
        }
    }),
    endpoints: (builder) => ({

        getFamily: builder.query<FamilyMemberResponse[], FamilyRequest>({
            query:({socialWorkerEmail,caseInfoId})=>({
                method:'GET',
                url:`/${socialWorkerEmail}/case/${caseInfoId}/familymember`,
            }),
            providesTags: ['family']
        }),
        
        createFamily: builder.mutation<FamilyMemberResponse, FamilyMemberInsertRequest & CaseUrlRequest>({
            query: ({ socialWorkerEmail, caseInfoId, ...data }) => ({
                method: 'POST',
                url: `/${socialWorkerEmail}/case/${caseInfoId}/familymember`,
                body: data
            }),
            invalidatesTags: ['family']
        }),

        updateFamily: builder.mutation<FamilyMemberResponse, FamilyMemberInsertRequest & FamilyRequest>({
            query: ({ socialWorkerEmail, caseInfoId, memberId, ...data }) => ({
                method: 'PATCH',
                url: `/${socialWorkerEmail}/case/${caseInfoId}/familymember/${memberId}`,
                body: data
            }),
            invalidatesTags: ['family']
        }),

        deleteFamily: builder.mutation<FamilyMemberResponse, FamilyRequest>({
            query: ({ socialWorkerEmail, caseInfoId, memberId }) => ({
                method: 'DELETE',
                url: `/${socialWorkerEmail}/case/${caseInfoId}/familymember/${memberId}`
            }),
            invalidatesTags: ['family']
        })
    })
})

export const {
    useGetFamilyQuery,
    useCreateFamilyMutation,
    useUpdateFamilyMutation,
    useDeleteFamilyMutation
} = familyApi