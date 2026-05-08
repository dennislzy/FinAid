'use client';
import AddIcon from '@mui/icons-material/Add';
import React, { useState } from 'react';
import AddFileDialog from './addFileDialog';
import { useCreateAudioToTextMutation } from "@/redux/rtk/audioApi";
import { useCookies } from "react-cookie";
import { useAlert } from "@/layout/context/alertProvider";
import { Button, IconButton } from '@mui/material';

interface AddButtonProps {
    caseInfoId: string;
    onFileAdded: () => void;
}

export default function AddFileButton({ caseInfoId, onFileAdded }: AddButtonProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [createAudioToText] = useCreateAudioToTextMutation();
    const [cookies] = useCookies();
    const { showAlert } = useAlert();

    const handleSubmit = async (selectedFile: File) => {
        try {
            console.log("🔼 開始上傳音檔:", selectedFile.name);

            const formData = new FormData();
            formData.append("audio_file", selectedFile);

            const response = await createAudioToText({
                socialWorkerEmail: cookies.user,
                caseInfoId,
                file: selectedFile, // 這裡應該改為 `formData`
            }).unwrap();

            console.log("✅ 上傳成功:", response);
            showAlert("音檔上傳成功！", "success");
            setIsDialogOpen(false);
            onFileAdded(); // 通知 table 更新

        } catch (e) {
            console.error("❌ API 失敗:", e);
            showAlert("音檔上傳失敗，請稍後再試！", "error");
        }
    };

    return (
        <>
            <Button
                onClick={() => setIsDialogOpen(true)}>
                <AddIcon /> 新增
            </Button>

            <AddFileDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handleSubmit}
            />
        </>
    );
}
