'use client';
import AddIcon from '@mui/icons-material/Add';
import React, { useState } from 'react';
import InsuranceAddDialog from './insuranceAdd';
import { useCreateInsuranceMutation } from "@/redux/rtk/insuranceApi";
import { useCookies } from "react-cookie";
import { useAlert } from "@/layout/context/alertProvider";
import { Button, IconButton } from '@mui/material';

interface addButtonProps {
    caseInfoId: string;
    onInsuranceAdded: () => void; // ✅ 新增成功後要通知 `InsuranceTable.tsx` 重新加載
}

export default function AddButton({ caseInfoId, onInsuranceAdded }: addButtonProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [createInsurance] = useCreateInsuranceMutation();
    const [cookies] = useCookies();
    const { showAlert } = useAlert();


    const handleSubmit = async (formData: { familyMember: string; insuranceType: string; amount: number; annualPremium: number; insuranceCompanyName: string }) => {
        try {
            console.log("送出新增請求:", formData);
            const res = await createInsurance({
                socialWorkerEmail: cookies.user,
                caseInfoId: caseInfoId,
                ...formData,
            }).unwrap();
        
            console.log("API 回應:", res);
        
            if (res) {
                showAlert("新增保險成功", "success");
                setIsDialogOpen(false);
        
                if (onInsuranceAdded) { // ✅ 確保 `onInsuranceAdded` 存在才呼叫
                    onInsuranceAdded();
                } else {
                    console.warn("⚠️ onInsuranceAdded 未定義，無法自動刷新表格");
                }
            }
        } catch (e) {
            console.error("API 失敗:", e);
            
            // 尝试从错误对象中获取响应内容
            let errorResponse = null;
            
            if (e.response) {
                // Axios 类型的错误对象
                errorResponse = e.response.data;
            } else if (e.data) {
                // RTK Query 类型的错误对象
                errorResponse = e.data;
            } else if (e.message) {
                // 普通错误信息
                errorResponse = e.message;
            }
            
            console.log("错误响应内容:", errorResponse);
            showAlert(errorResponse?.message || errorResponse || "操作失败", "error");
        }
    };

    return <>
        <Button
            onClick={() => setIsDialogOpen(true)}>
            <AddIcon /> 新增
        </Button>

        <InsuranceAddDialog
            open={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onSubmit={handleSubmit} />
    </>
};