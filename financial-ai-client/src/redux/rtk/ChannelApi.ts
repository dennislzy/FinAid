import { CaseUrlRequest, DeleteMessage } from "@/type/dto/dto";
import { Channel, ChannelMessage } from "@/type/entity/entityType";
import { FINANCIAL_BACKEND_URL } from "@/utils/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// 定義請求介面
interface ChannelIdRequest extends CaseUrlRequest {
  channelId: string;
}

export interface ChatRequest extends CaseUrlRequest {
  message: string;
  channelId?: string;
}

export interface WelfareRiskmentRequest extends CaseUrlRequest {
  message: string;
}

export interface GetAllRiskRequest extends CaseUrlRequest {
  analysisType: "RISK" | "WELFARE";
}

// 新增：getCaseInfoRisk 請求介面
export interface GetCaseInfoRiskRequest extends CaseUrlRequest {
  analysisType: "RISK" | "WELFARE";
  analysisId: number;
}

// 定義 ChatResponse 結構
interface ChatResponse {
  suggestion: string;
  analysisId: number;
}

// 定義 RiskAllResponse 結構，匹配 CaseAnalysis
export interface RiskAllResponse {
  analysisId: number;
  caseInfoId: string;
  socialWorkerId: string;
  analysisType: "RISK" | "WELFARE";
  resultText: string;
  createTime: string;
  light: string;
}

// 創建 API
export const channelApi = createApi({
  reducerPath: "channelApi",
  tagTypes: ["channel", "message"],
  baseQuery: fetchBaseQuery({
    baseUrl: FINANCIAL_BACKEND_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json;charset=UTF-8");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // 傳送聊天訊息
    sendMessage: builder.mutation<ChannelMessage, ChatRequest>({
      query: ({ socialWorkerEmail, caseInfoId, channelId, message }) => ({
        method: "POST",
        url: `/${socialWorkerEmail}/channel/${caseInfoId}/chat`,
        body: { channelId, message },
      }),
      invalidatesTags: ["message", "channel"],
    }),

    // 刪除頻道
    deleteChannel: builder.mutation<Channel, ChannelIdRequest>({
      query: ({ socialWorkerEmail, caseInfoId, channelId }) => ({
        method: "DELETE",
        url: `/${socialWorkerEmail}/channel/${caseInfoId}/${channelId}`,
      }),
      invalidatesTags: ["channel"],
    }),

    // 根據頻道 ID 獲取所有聊天訊息
    getMessagesByChannelId: builder.query<Channel, ChannelIdRequest>({
      query: ({ socialWorkerEmail, caseInfoId, channelId }) => ({
        method: "GET",
        url: `/${socialWorkerEmail}/channel/${caseInfoId}/chat/${channelId}`,
      }),
      providesTags: ["message"],
    }),

    // 根據社工郵箱獲取所有頻道
    getChannelsBySocialWorker: builder.query<Channel[], CaseUrlRequest>({
      query: ({ socialWorkerEmail, caseInfoId }) => ({
        method: "GET",
        url: `/${socialWorkerEmail}/channel/${caseInfoId}/all`,
      }),
      providesTags: ["channel"],
    }),

    // 生成福利建議
    generateWelfare: builder.mutation<ChatResponse, WelfareRiskmentRequest>({
      query: ({ socialWorkerEmail, caseInfoId, message }) => ({
        method: "POST",
        url: `/${socialWorkerEmail}/channel/${caseInfoId}/generate_welfare`,
        body: { message },
      }),
      invalidatesTags: ["message"],
    }),

    // 生成風險評估
    generateRiskment: builder.mutation<ChatResponse, WelfareRiskmentRequest>({
      query: ({ socialWorkerEmail, caseInfoId, message }) => ({
        method: "POST",
        url: `/${socialWorkerEmail}/channel/${caseInfoId}/generate_riskment`,
        body: { message },
      }),
      invalidatesTags: ["message"],
    }),

    // 獲取所有風險指標和評估
    getAllRiskIndicators: builder.mutation<RiskAllResponse, CaseUrlRequest>({
      query: ({ socialWorkerEmail, caseInfoId }) => ({
        method: "POST",
        url: `/${socialWorkerEmail}/case/${caseInfoId}/riskall`,
        body: {},
      }),
      invalidatesTags: ["message"],
    }),

    // 獲取指定 caseInfoId 和 analysisType 的所有 CaseAnalysis
    getAllRisk: builder.query<RiskAllResponse[], GetAllRiskRequest>({
      query: ({ socialWorkerEmail, caseInfoId, analysisType }) => ({
        method: "GET",
        url: `/${socialWorkerEmail}/case/${caseInfoId}/${analysisType}/getAllRisk`,
      }),
      providesTags: ["message"],
    }),

    // 新增：獲取指定 caseInfoId、analysisType 和 analysisId 的 CaseAnalysis
    getCaseInfoRisk: builder.query<RiskAllResponse, GetCaseInfoRiskRequest>({
      query: ({ socialWorkerEmail, caseInfoId, analysisType, analysisId }) => ({
        method: "GET",
        url: `/${socialWorkerEmail}/case/${caseInfoId}/getRisk/${analysisType}/${analysisId}`,
      }),
      providesTags: ["message"],
    }),
  }),
});

// 導出 hooks
export const {
  useSendMessageMutation,
  useDeleteChannelMutation,
  useGetMessagesByChannelIdQuery,
  useGetChannelsBySocialWorkerQuery,
  useGenerateWelfareMutation,
  useGenerateRiskmentMutation,
  useGetAllRiskIndicatorsMutation,
  useGetAllRiskQuery,
  useGetCaseInfoRiskQuery, // 新增 hook
} = channelApi;
