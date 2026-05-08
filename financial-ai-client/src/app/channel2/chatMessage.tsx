"use client"
import { keyframes } from "@mui/material/styles";  
import { useState, useEffect } from "react"
import { Box, Avatar, Paper, Typography } from "@mui/material"
import { User, Bot } from "lucide-react"
import { messageStyles } from "./channel2Style"
import { useRouter } from "next/navigation"
import useMarkdown from "@/hook/use_markDown";

interface ChatMessageProps {
  channelMessage: string
  channelId: string
  caseInfoId: string
  channelRole: "USER" | "AI"
  isPending?: boolean
}

// 定義圖片數組
const imageArray = [
  'http://localhost:8080/files/067a02e5bfe944d79a79d8af8de70cf6貓.gif',
  'http://localhost:8080/files/5325f304149841279986e134f86aa61f希特勒貓.gif',
  'http://localhost:8080/files/5325f304149841279986e134f86aa61f小明劍魔.gif'
];

export default function ChatMessage({
  channelMessage,
  channelId,
  caseInfoId,
  channelRole,
  isPending = false,
}: ChatMessageProps) {
  const router = useRouter()
  const isUser = channelRole === "USER"
  
  // 新增一個狀態來控制AI思考的顯示
  const [isAIThinking, setIsAIThinking] = useState(channelRole === "AI");
  
  // 新增一個狀態來保存隨機選擇的圖片
  const [randomImage, setRandomImage] = useState('');
  
  // 使用自定義 Hook 處理 Markdown
  const htmlContent = useMarkdown(channelMessage, false);

  // 當組件渲染且角色為AI時，啟動計時器和選擇隨機圖片
  useEffect(() => {
    if (channelRole === "AI") {
      // 選擇一張隨機圖片
      const randomIndex = Math.floor(Math.random() * imageArray.length);
      setRandomImage(imageArray[randomIndex]);
      
      // 設置5秒後停止顯示"思考中"
      const timer = setTimeout(() => {
        setIsAIThinking(false);
      }, 5000);
      
      // 組件卸載時清除計時器
      return () => clearTimeout(timer);
    }
  }, [channelRole]);

  const waveAnimation = keyframes`
    0%, 100% {
      transform: translateY(0);
    }
    25% {
      transform: translateY(-2px);
    }
    50% {
      transform: translateY(0);
    }
    75% {
      transform: translateY(2px);
    }
  `;

  return (
    <Box
      sx={isUser ? messageStyles.userContainer : messageStyles.container}
      onClick={() => router.push(`/channel2/${caseInfoId}/chat?channelId=${channelId}`)}
    >
      <Avatar sx={isUser ? messageStyles.userAvatar : messageStyles.avatar}>
        <Box sx={messageStyles.avatarContent}>
          {isUser ? <User size={16} color="#ffffff" /> : <Bot size={16} color="#666666" />}
        </Box>
      </Avatar>
  
      <Paper sx={isUser ? messageStyles.userMessageBubble : messageStyles.messageBubble} elevation={0}>
        {isUser ? (
          // 用戶消息直接顯示內容
          <div 
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
            style={{ margin: "10px" }}
          />
        ) : isAIThinking ? (
          // AI正在思考中顯示波浪動畫
          <Typography sx={messageStyles.messageText}>
            {"正在思考中...".split("").map((char, index) => (
              <Box 
                component="span" 
                key={index}
                sx={{
                  display: "inline-block",
                  width: "1em",
                  textAlign: "center",
                  animation: `${waveAnimation} 1.5s ease-in-out infinite`,
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {char}
              </Box>
            ))}
          </Typography>
        ) : (
          // AI回應完成後顯示內容和隨機圖片
          <>
            <div 
              dangerouslySetInnerHTML={{ __html: htmlContent }} 
              style={{ margin: "10px" }}
            />
            {randomImage && (
              <img 
                src={randomImage} 
                alt="隨機顯示的圖片" 
                style={{ 
                  maxWidth: '500px', 
                  maxHeight: '500px', 
                  objectFit: 'contain', 
                  margin: "10px" 
                }} 
              />
            )}
          </>
        )}
      </Paper>
    </Box>
  )
}