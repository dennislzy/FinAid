"use client";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, IconButton } from "@mui/material";
import { useState } from "react";
import Image from "next/image";
import CloseIcon from '@mui/icons-material/Close';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';

interface AddFileDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (file: File) => void;
}

export default function AddFileDialog({ open, onClose, onSubmit }: AddFileDialogProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const allowedAudioTypes = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4", "audio/x-m4a", "audio/flac"];

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            event.target.value = "";

            if (!allowedAudioTypes.includes(file.type)) {
                setErrorMessage("請選擇正確的音檔格式！");
                setSelectedFile(null);
                return;
            }
            setSelectedFile(file);
            setErrorMessage(null);
        }
    };

    const handleUpload = () => {
        if (!selectedFile) {
            alert("請先選擇音檔！");
            return;
        }
        onSubmit(selectedFile);
        setSelectedFile(null);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { padding: 2 } }}>
            <DialogTitle sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 2
            }}>
                <div>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>上傳音檔</Typography>
                    <Typography variant="body2">請選擇您的音檔</Typography>
                    {/* <Typography variant="caption" color="warning">*檔案上傳完成後需時間轉換為文字，可於狀態欄查看轉換進度。<br />
                        提示：綠色為完成，橘色為轉換中。
                    </Typography> */}
                </div>

                <IconButton sx={{ marginLeft: 'auto' }} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <input type="file" accept="audio/*" onChange={handleFileChange} style={{ display: "none" }} id="upload-audio" />

                <label htmlFor="upload-audio">
                    <div style={{ border: '3px dashed #f2f2f2', borderRadius: '5px', display: 'flex', alignItems: 'center', flexDirection: 'column', cursor: "pointer" }}>
                        <Image src="/assets/upload.png" alt="上傳檔案" width={180} height={180} />
                        <span style={{ fontWeight: 'bold', color: '#919eab', margin: 4 }}>拖曳您的檔案至此或瀏覽</span>
                    </div>
                </label>

                {errorMessage && (
                    <Typography color="error" sx={{ marginTop: 1, fontWeight: "bold" }}>
                        {errorMessage}
                    </Typography>
                )}

                {selectedFile && (
                    <p style={{
                        backgroundColor: '#f2f2f2',
                        borderRadius: '8px',
                        padding: 15,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10
                    }}>
                        <AudiotrackIcon />
                        <span style={{ fontWeight: '750' }}>{selectedFile.name}</span>
                        <IconButton sx={{ marginLeft: 'auto' }} onClick={() => setSelectedFile(null)}>
                            <CloseIcon />
                        </IconButton>
                    </p>
                )}
            </DialogContent>

            <DialogActions>
                <Button variant="contained" color="secondary" onClick={handleUpload} disabled={!selectedFile}>
                    上傳
                </Button>
            </DialogActions>
        </Dialog>
    );
}
