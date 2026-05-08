import { Box, Typography } from "@mui/material"

const chatMessageStyle = {
    borderRadius: '10px',
    backgroundColor: '#E6E6E6',
    padding: '10px',
}

interface ChatMessageProps {
    chatMessage: string;
}
const ChatMessage = (chatMessage:ChatMessageProps)=>{
    return (
        <>
        <Box sx={chatMessageStyle}>
           <Typography sx={{fontSize: '15px', fontWeight: '400'}}>
                {
                    chatMessage.chatMessage
                }
           </Typography>
        </Box>
        </>
    )
}
export default ChatMessage