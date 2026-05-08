import { CaseUrlRequest, InsuranceListInsertRequest, InsuranceListUpdateRequest } from "@/type/dto/dto";
import { InsuranceListResponse } from "@/type/entity/entityType";
import { FINANCIAL_BACKEND_URL } from "@/utils/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface InsuranceRequest extends CaseUrlRequest {
    insuranceType?: string;
    query?: string;
    insuranceId?: number; 
}

export const insuranceApi = createApi({
    reducerPath: 'insuranceApi',
    tagTypes: ['insurance'],
    baseQuery: fetchBaseQuery({
        baseUrl: FINANCIAL_BACKEND_URL,
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json;charset=UTF-8')
            return headers
        }
    }),
    endpoints: (builder) => ({

        getInsurance: builder.query<InsuranceListResponse[], InsuranceRequest>({
            query: ({ socialWorkerEmail, caseInfoId, insuranceType, query }) => {
                const defaultFilter = {};
                const filterObject = { insuranceType, query, ...defaultFilter };

                const params = new URLSearchParams();
                if (filterObject.insuranceType) {
                    params.append('insuranceType', filterObject.insuranceType);
                }

                // 如果有 query，使用 /search 路徑，並將 query 改為 keyword
                if (filterObject.query) {
                    params.append('keyword', filterObject.query); // 後端使用 keyword
                    return {
                        method: 'GET',
                        url: `/${socialWorkerEmail}/case/${caseInfoId}/insurance/search?${params.toString()}`,
                    };
                }

                // 無 query 時，使用原本的路徑
                const url = `/${socialWorkerEmail}/case/${caseInfoId}/insurance${params.toString() ? `?${params.toString()}` : ''}`;
                return {
                    method: 'GET',
                    url,
                };
            },
            providesTags: ['insurance']
        }),
        
        createInsurance: builder.mutation<InsuranceListResponse, InsuranceListInsertRequest & CaseUrlRequest>({
            query: ({ socialWorkerEmail, caseInfoId, ...data }) => ({
                method: 'POST',
                url: `/${socialWorkerEmail}/case/${caseInfoId}/insurance`,
                body: data
            }),
            invalidatesTags: ['insurance']
        }),

        updateInsurance: builder.mutation<InsuranceListResponse, InsuranceListUpdateRequest & InsuranceRequest>({
            query: ({ socialWorkerEmail, caseInfoId, insuranceId, ...data }) => ({
                method: 'PATCH',
                url: `/${socialWorkerEmail}/case/${caseInfoId}/insurance/${insuranceId}`,
                body: data
            }),
            invalidatesTags: ['insurance']
        }),

        deleteInsurance: builder.mutation<InsuranceListResponse, InsuranceRequest>({
            query: ({ socialWorkerEmail, caseInfoId, insuranceId }) => ({
                method: 'DELETE',
                url: `/${socialWorkerEmail}/case/${caseInfoId}/insurance/${insuranceId}`
            }),
            invalidatesTags: ['insurance']
        })
    })
})

export const {
    useCreateInsuranceMutation,
    useDeleteInsuranceMutation,
    useGetInsuranceQuery,
    useUpdateInsuranceMutation
} = insuranceApi