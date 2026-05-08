import { DeleteMessage, FilterObject, Result } from "@/type/dto/dto";
import { CaseInfo } from "@/type/entity/entityType";
import { FINANCIAL_BACKEND_URL } from "@/utils/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface AudioFile {
    fileId: number;
    caseInfo: CaseInfo
    fileName: string;
    createTime: string;
    summary: string;
    totalText: string;
    duration: string;
    status: string;
}


interface AudioUploadRequest {
    file: File;
    socialWorkerEmail: string;
    caseInfoId: string;
}

interface AudioUpdateRequest {
    socialWorkerEmail: string;
    caseInfoId: string;
    fileId: number;
    fileName?: string;
    summary?: string;
    totalText?: string;
}

interface PdfRequest {
    socialWorkerEmail: string;
    caseInfoId: string;
    fileId: number;
    summary: string;
    totalText: string;
}

export const audioApi = createApi({
    reducerPath: "audioApi",
    baseQuery: fetchBaseQuery({
        baseUrl: FINANCIAL_BACKEND_URL,
    }),
    endpoints: (builder) => ({
        // ✅ 1. 上傳音檔並轉換文字
        createAudioToText: builder.mutation<AudioFile, AudioUploadRequest>({
            query: ({ socialWorkerEmail, caseInfoId, file }) => {
                const formData = new FormData();
                formData.append("audio_file", file); // ✅ 修正 `audio_file` 鍵名
                return {
                    method: "POST",
                    url: `/${socialWorkerEmail}/case/${caseInfoId}/audio`,
                    body: formData,
                    // headers: { "Content-Type": "multipart/form-data" },  // ✅ 確保正確的 Content-Type
                };
            },
        }),

        // ✅ 2. 刪除語音檔案
        deleteAudioFile: builder.mutation<DeleteMessage, { socialWorkerEmail: string; caseInfoId: string; fileId: number }>({
            query: ({ socialWorkerEmail, caseInfoId, fileId }) => ({
                method: "DELETE",
                url: `/${socialWorkerEmail}/case/${caseInfoId}/audio/${fileId}`,
            }),
        }),

        // ✅ 3. 取得指定的語音檔案
        getAudioFileById: builder.query<AudioFile, { socialWorkerEmail: string; caseInfoId: string; fileId: number }>({
            query: ({ socialWorkerEmail, caseInfoId, fileId }) => ({
                method: "GET",
                url: `/${socialWorkerEmail}/case/${caseInfoId}/audio/${fileId}`,
            }),
        }),

        // ✅ 4. 取得某個案的所有語音檔案
        getAllAudioFilesByCase: builder.query<Result<AudioFile>, { socialWorkerEmail: string; caseInfoId: string; filter: FilterObject }>({
            query: ({ socialWorkerEmail, caseInfoId, filter }) => ({
                method: "POST",
                url: `/${socialWorkerEmail}/case/${caseInfoId}/audio/search`,
                body: filter,
            }),
        }),

        // ✅ 5. 更新語音檔案
        updateAudioFile: builder.mutation<AudioFile, AudioUpdateRequest>({
            query: ({ socialWorkerEmail, caseInfoId, fileId, ...updateData }) => ({
                method: "PATCH",
                url: `/${socialWorkerEmail}/case/${caseInfoId}/audio/${fileId}`,
                body: updateData,
            }),
        }),

        // ✅ 6. 生成 PDF
        generateAudioFilePdf: builder.mutation<string, PdfRequest>({
            query: ({ socialWorkerEmail, caseInfoId, fileId, summary, totalText }) => ({
                method: "POST",
                url: `/${socialWorkerEmail}/case/${caseInfoId}/audio/generate-pdf/${fileId}`,
                body: { summary, totalText },
            }),
        }),

        regenerateSummary: builder.mutation<AudioFile, { socialWorkerEmail: string; caseInfoId: string; fileId: number }>({
            query: ({ socialWorkerEmail, caseInfoId, fileId }) => ({
                method: "POST",
                url: `/${socialWorkerEmail}/case/${caseInfoId}/audio/${fileId}/regenerate-summary`,
            }),
        }),
    }),
});

// 導出 hooks
export const {
    useCreateAudioToTextMutation,
    useDeleteAudioFileMutation,
    useGetAudioFileByIdQuery,
    useGetAllAudioFilesByCaseQuery,
    useUpdateAudioFileMutation,
    useGenerateAudioFilePdfMutation,
    useRegenerateSummaryMutation,
} = audioApi;