import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FINANCIAL_BACKEND_URL } from "@/utils/config";

interface SocialWorkerWithCases {
    socialWorkerEmail: string;
    socialWorkerName: string;
    cases: Array<{ caseInfoId: string; caseInfoName: string }>;
}

interface BasicSocialWorker {
    socialWorkerId: string;
    socialWorkerEmail: string;
    socialWorkerName: string;
}

interface LeaderWithGroup {
    socialWorkerId: string;
    socialWorkerEmail: string;
    socialWorkerName: string;
    groupId: number;
}

// 更新後的介面，根據後端返回的字段
interface UncompleteSocialWorker {
    socialWorkerName: string;
    socialWorkerPermission: string;
    socialWorkerId: string;
    socialWorkerEmail: string;
}

// 定義 AssignGroupRequest 介面
interface AssignGroupRequest {
    socialWorkerId: string;
    groupId?: string; // 可選字段，僅基層社工需要
}

// 定義後端返回的 Map<String, String> 結構（假設性）
interface AssignGroupResponse {
    [key: string]: string;
}

// 定義刪除響應為字符串
interface DeleteResponse {
    data: string; // 直接表示後端返回的純文字
}

export const socialWorkerApi = createApi({
    reducerPath: "socialWorkerApi",
    tagTypes: ["SocialWorker"],
    baseQuery: fetchBaseQuery({
        baseUrl: FINANCIAL_BACKEND_URL,
    }),
    endpoints: (builder) => ({
        // 獲取所有社工與其個案
        getSocialWorkersWithCases: builder.query<SocialWorkerWithCases[], void>({
            query: () => "/socialWorkersWithCases",
        }),

        // 修改後的獲取基層社工端點，使用 leaderId 作為參數
        getBasicSocialWorkers: builder.query<BasicSocialWorker[], string>({
            query: (leaderId) => `/group/basicWorkers/${encodeURIComponent(leaderId)}`,
            providesTags: ["SocialWorker"],
        }),

        // 搜尋社工的端點
        searchBasicSocialWorkers: builder.query<BasicSocialWorker[], string>({
            query: (keyword) => `/searchSocialWorkers?keyword=${encodeURIComponent(keyword)}`,
            providesTags: ["SocialWorker"],
        }),

        // 獲取所有領導者及其對應組別
        getAllLeadersWithGroup: builder.query<LeaderWithGroup[], void>({
            query: () => "/leadersWithGroup",
            providesTags: ["SocialWorker"],
        }),

        // 獲取未完成任務的社工
        getUncompleteSocialWorkers: builder.query<UncompleteSocialWorker[], void>({
            query: () => "/uncompleteSocialWorkers",
            providesTags: ["SocialWorker"],
        }),

        // 新增分配社工到群組的端點
        assignSocialWorkerToGroup: builder.mutation<AssignGroupResponse, AssignGroupRequest>({
            query: (request) => ({
                url: "/assignGroup",
                method: "POST",
                body: request,
            }),
            invalidatesTags: ["SocialWorker"], // 無效化 SocialWorker 標籤，觸發重新獲取數據
        }),

        // 新增刪除社工的端點
        deleteSocialWorker: builder.mutation<DeleteResponse, string>({
            query: (socialWorkerId) => ({
                url: `/delete/${encodeURIComponent(socialWorkerId)}`,
                method: "DELETE",
            }),
            transformResponse: (response, meta) => {
                if (meta?.response?.status === 200) {
                    // 如果狀態碼為 200，返回後端返回的純文字
                    return { data: response as string };
                }
                throw new Error("刪除失敗");
            },
            invalidatesTags: ["SocialWorker"],
        }),
    }),
});

// 導出 hooks
export const {
    useGetSocialWorkersWithCasesQuery,
    useGetBasicSocialWorkersQuery,
    useSearchBasicSocialWorkersQuery,
    useGetAllLeadersWithGroupQuery,
    useGetUncompleteSocialWorkersQuery,
    useAssignSocialWorkerToGroupMutation,
    useDeleteSocialWorkerMutation, // 新增的 mutation hook
} = socialWorkerApi;