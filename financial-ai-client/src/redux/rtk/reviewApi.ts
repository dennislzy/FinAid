import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FINANCIAL_BACKEND_URL } from "@/utils/config";

// A 情況: 自己申請，列出自己申請過的名單
// B 情況: 從別人那裏接收
interface Review {
    reviewId: number; // A、B
    caseInfoId: string; // A、B
    caseInfoName: string; // A、B
    socialWorkerName: string; // 原負責社工，A
    applyTime: string; // A、B
    groupId: number; // 要轉到的團隊，A
    reviewStatus: string; // A、B
    fromWorkerId: string; // 從哪個社工來，A、B，A 用來獲取自己曾經的紀錄，B 用來知道是從哪個團隊發送過來的申請
}

// 後端 /leader/{leaderId}/cases 返回的個案數據結構
interface Case {
    caseInfoId: string;
    caseInfoName: string;
    socialWorkerName: string;
}

interface ReviewApply {
    caseInfoId: string; // A、B
    groupId: number; // 要轉到的團隊，A
    fromWorkerId: string; // 從哪個社工來，A、B，A 用來獲取自己曾經的紀錄，B 用來知道是從哪個團隊發送過來的申請
}

interface ApproveBatchRequest {
    reviewIds: number[];
}

export const reviewApi = createApi({
    reducerPath: "reviewApi",
    tagTypes: ['Review'],
    baseQuery: fetchBaseQuery({
        baseUrl: `${FINANCIAL_BACKEND_URL}/review`,
    }),
    endpoints: (builder) => ({
        // 提交評論
        submitReview: builder.mutation<ReviewApply, ReviewApply>({
            query: (review) => ({
                url: "/submit",
                method: "POST",
                body: review,
            }),
            invalidatesTags: ['Review'],
        }),

        // 批准單個評論
        approveReview: builder.mutation<Review, number>({
            query: (id) => ({
                url: `/approve/${id}`,
                method: "POST",
            }),
            invalidatesTags: ['Review'],
        }),

        // 拒絕單個評論
        rejectReview: builder.mutation<Review, number>({
            query: (id) => ({
                url: `/reject/${id}`,
                method: "POST",
            }),
            invalidatesTags: ['Review'],
        }),

        // 獲取群組的評論（根據 leaderId）
        getReviewsByGroup: builder.query<Review[], string>({
            query: (leaderId) => `/group/${encodeURIComponent(leaderId)}`,
            providesTags: ['Review'],
        }),

        // 刪除評論
        deleteReview: builder.mutation<string, number>({
            query: (reviewId) => ({
                url: `/${reviewId}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Review'],
        }),

        // 批量批准評論
        approveReviewBatch: builder.mutation<Review[], ApproveBatchRequest>({
            query: (request) => ({
                url: "/approve/batch",
                method: "POST",
                body: request,
            }),
            invalidatesTags: ['Review'],
        }),

        // 獲取某個社工提交的評論（根據 fromWorkerId）
        getReviewsSubmittedByWorker: builder.query<Review[], string>({
            query: (fromWorkerId) => `/submitted/${encodeURIComponent(fromWorkerId)}`,
            providesTags: ['Review'],
        }),

        // 新增：獲取某個 leader 負責的所有個案（根據 leaderId）
        getAllCasesByLeaderId: builder.query<Case[], string>({
            query: (leaderId) => `/leader/${encodeURIComponent(leaderId)}/cases`,
            providesTags: ['Review'],
        }),
    }),
});

// 導出 hooks
export const {
    useSubmitReviewMutation,
    useApproveReviewMutation,
    useRejectReviewMutation,
    useGetReviewsByGroupQuery,
    useDeleteReviewMutation,
    useApproveReviewBatchMutation,
    useGetReviewsSubmittedByWorkerQuery,
    useGetAllCasesByLeaderIdQuery,
} = reviewApi;