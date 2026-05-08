import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useState } from "react";
import { Method } from "./use_stream";

type ApiProps<T> = {
    url: string;
    method: Method;
    body?: T;
    config?: AxiosRequestConfig;
}

// 通用 API 請求 hook
export default function useAxiosApi<Payload, ResponseData>() {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<ResponseData | null>(null);

    // 發送 API 請求的函數
    const fetchData = async (apiSetting: ApiProps<Payload>) => {
        setLoading(true);
        try {
            let res: AxiosResponse<ResponseData> | undefined;

            switch (apiSetting.method) {
                case 'GET':
                    res = await axios.get<ResponseData>(apiSetting.url, apiSetting.config);
                    break;
                case 'POST':
                    res = await axios.post<ResponseData>(apiSetting.url, apiSetting.body, apiSetting.config);
                    break;
                case 'PATCH':
                    res = await axios.patch<ResponseData>(apiSetting.url, apiSetting.body, apiSetting.config);
                    break;
                case 'DELETE':
                    res = await axios.delete<ResponseData>(apiSetting.url, apiSetting.config);
                    break;
                default:
                    throw new Error(`Unsupported method: ${apiSetting.method}`);
            }

            setData(res.data);
            return { data: res.data, errorData: undefined,status:res.status };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const responseData:string = error.response?.data;
                if (responseData.includes('403')){
                    return { data: undefined, errorData: '帳號未審核通過' };
                }else{
                    return { data: undefined, errorData: '登入失敗' };
                }
            } else {
                return { data: undefined, errorData: '未知錯誤' };
            }
        }
        
    };

    return { data, loading, fetchData };
}

// 請求頭部訊息
export const basicHeaderConfig: AxiosRequestConfig = {
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
    }
}

// 用於文件上傳的請求頭部配置
export const uploadFileHeaderConfig: AxiosRequestConfig = {
    headers: {
        "Content-Type": 'multipart/form-data; charset="utf-8";',
    }
}

// 錯誤處理
export function handlingError(status: number | undefined) {
    switch (status) {
        case 401:
            return '未經授權的存取';
        case 422:
            return '輸入資料不完整，請再次確認';
        case 403:
            return '您沒有存取權限';
        case 400:
            return '系統異常，請稍後再試';
        case 404:
            return '找不到資料';
        case 500:
            return '伺服器出現問題，技術團隊正在處理中，請稍後再試。';
        default:
            return '發生未知錯誤，請稍後再試';
    }
}
