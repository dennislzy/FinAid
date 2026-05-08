import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FINANCIAL_BACKEND_URL } from "@/utils/config";
import { CaseInfo } from "@/type/entity/entityType";

// **個案重新分配請求**
interface CaseReassignRequest {
    caseInfoId: string;
    newSocialWorkerEmail: string;
}

// **批次個案重新分配請求**
interface BulkCaseReassignRequest {
    caseInfoIds: string[];
    newSocialWorkerEmail: string;
}

// **API 定義**
export const reassignApi = createApi({
    reducerPath: "reassignApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${FINANCIAL_BACKEND_URL}/case`, // 後端 API 基本路徑
    }),
    endpoints: (builder) => ({
        // ✅ 1. 重新分配單一個案
        reassignCase: builder.mutation<CaseInfo, CaseReassignRequest>({
            query: ({ caseInfoId, newSocialWorkerEmail }) => ({
                method: "PUT",
                url: `/${caseInfoId}/assign`,
                body: { newSocialWorkerEmail },
            }),
            
        }),

        // ✅ 2. 批次重新分配
        reassignSelectedCases: builder.mutation<string, BulkCaseReassignRequest>({
            query: ({ caseInfoIds, newSocialWorkerEmail }) => ({
                method: "PUT",
                url: `/reassign`,
                body: { caseInfoIds, newSocialWorkerEmail },
            }),
        }),
    }),
});

// **導出 hooks**
export const {
    useReassignCaseMutation,
    useReassignSelectedCasesMutation,
} = reassignApi;
