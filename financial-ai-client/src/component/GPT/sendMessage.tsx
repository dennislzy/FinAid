import { Box, IconButton, InputBase, CircularProgress } from "@mui/material";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import { useState } from "react";
import { useAlert } from "@/layout/context/alertProvider";

interface SendMessageProps {
    sendMessageFunction: (message:string) => void;
    isMessage: boolean;
    caseInfoId: string;
    isLoading?: boolean; // 添加loading状态属性
}

const SendMessage = ({ sendMessageFunction, isMessage, caseInfoId, isLoading = false }: SendMessageProps) => {
    const [messageText, setMessageText] = useState("");
    const {showAlert} = useAlert();

    const handleSend = async () => {
        if (messageText.trim() !== "" && !isLoading) {
            const messagePayload = messageText;
            sendMessageFunction(messagePayload);
            setMessageText(""); // 清空输入框
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            <Box 
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1, 
                    width: '100%',
                    bgcolor: '#f4f4f4',
                    borderRadius: '30px',
                    padding: '8px',
                }}>
                <IconButton disabled={isLoading}>
                    <AttachFileIcon 
                    sx={{
                        fontWeight: 'bold',
                    }}/>
                </IconButton>
                <InputBase
                    placeholder={isLoading ? "发送中..." : "傳訊息給 經濟扶助智庫GPT"}
                    fullWidth
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    sx={{
                        color: 'inherit',
                        '&::placeholder': { color: 'inherit' },
                    }}
                />
                {isLoading ? (
                    <CircularProgress size={24} sx={{ margin: '0 12px' ,backgroundColor:'black' }} />
                ) : (
                    <IconButton onClick={handleSend} disabled={messageText.trim() === ""}>
                        <SendIcon
                        sx={{
                            fontWeight: 'bolder',
                            color: messageText.trim() === "" ? 'grey.400' : 'inherit' // 消息为空时按钮变灰
                        }}
                        />
                    </IconButton>
                )}
            </Box>
        </>
    );
};

export default SendMessage;