import { CaseInfoInsertRequest, CaseInfoUpdateRequest, CaseUrlRequest, FileResponse, FilterObject, Result } from '@/type/dto/dto'
import { CaseInfo } from '@/type/entity/entityType'
import { FINANCIAL_BACKEND_URL } from '@/utils/config'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


const defaultFilter:FilterObject={
    page:0,
    size:5,
    order:'asc',
    sortBy:'caseInfoCreateTime'
}
interface DeleteCase {
    idList:string[],
    socialWorkerEmail:string
}
interface UploadFileRequest extends CaseUrlRequest{
    file:File
}
export const caseApi = createApi({
    reducerPath: 'caseApi',
    tagTypes: ['caseList'],
    baseQuery: fetchBaseQuery({
        baseUrl: FINANCIAL_BACKEND_URL,
        // prepareHeaders: (headers) => {
        //     headers.set('Content-Type', 'application/json;charset=UTF-8')
        //     return headers
        // }
    }),
    endpoints: (builder) => ({
        getCases: builder.query<CaseInfo, CaseUrlRequest>({
            query: (caseRequest) => `/${caseRequest.socialWorkerEmail}/case/${caseRequest.caseInfoId}`,
            providesTags: (result, error, arg) => [{ type: 'caseList', id: arg.caseInfoId }]
        }),

        getAllCases: builder.query<CaseInfo[], FilterObject & CaseUrlRequest>({
            query: ({ socialWorkerEmail, ...filterObject }) => ({
                method: 'GET',
                url: `/${socialWorkerEmail}/case/search?keyword=${filterObject.query || ''}`,
            }),
            providesTags: ['caseList']
        }),

        uploadCaseFile:builder.mutation<FileResponse,UploadFileRequest>({
            query: ({ socialWorkerEmail, caseInfoId, file }) => {
                const formData = new FormData();
                formData.append('files', file);
                return {
                    method: 'POST',
                    url: `/${socialWorkerEmail}/case/${caseInfoId}/uploadFile`,
                    body: formData,
                    formData: true,
                }
            },
            invalidatesTags:['caseList']
        }),
        
        createCase: builder.mutation<CaseInfo, CaseInfoInsertRequest & CaseUrlRequest>({
            query: ({ socialWorkerEmail, ...caseInfoRequest }) => ({
                method: 'POST',
                url: `/${socialWorkerEmail}/case`,
                body: caseInfoRequest
            }),
            invalidatesTags: ['caseList']
        }),

        updateCase: builder.mutation<CaseInfo, CaseInfoUpdateRequest & CaseUrlRequest>({
            query: ({ socialWorkerEmail, caseInfoId, ...caseUpdateRequest }) => ({
                method: 'PATCH',
                url: `/${socialWorkerEmail}/case/${caseInfoId}`,
                body: caseUpdateRequest
            }),
            invalidatesTags: (arg) => [
                { type: 'caseList', id: arg?.caseInfoId },
                'caseList'
            ]
        }),

        deleteCase: builder.mutation<string, DeleteCase>({
            query: ({socialWorkerEmail,idList}) => ({
                method: 'DELETE',
                url: `/${socialWorkerEmail}/case`,
                body:idList
            }),
            invalidatesTags: ['caseList']
        })
    })
})

export const {
    useCreateCaseMutation,
    useDeleteCaseMutation,
    useGetAllCasesQuery,
    useGetCasesQuery,
    useUploadCaseFileMutation,
    useUpdateCaseMutation
} = caseApi