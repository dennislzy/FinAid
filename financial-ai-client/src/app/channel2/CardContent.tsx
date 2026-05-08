"use client"

import { Box, Typography, Paper, Grid } from "@mui/material"
import { FileText, Search, AlertTriangle } from "lucide-react"
import { channelStyles, emptyCardStyle } from "./channel2Style"

interface EmptyCardContentProps {
  onSendMessage?: (message: string) => void
  caseInfoName:string | undefined
}

const boxList = [
  {
    title: "個案基本年收入",
    content: "查詢個案的基本資料，包括個人資訊、基本收入",
    index: "1",
    message: "個案基本年收入分析",
    icon: <FileText size={24} color="#0ba149" />,
  },
  {
    title: "個案查詢能領取的補助",
    content: "協助查詢個案可能符合的各項補助方案，提供申請資格和流程的相關建議。",
    index: "2",
    message: "個案能領取的補助",
    icon: <Search size={24} color="#0ba149" />,
  },
  {
    title: "個案風險評估",
    content: "提供個案風險評估結果分析，協助識別潛在問題並提出相應的處理建議。",
    index: "3",
    message: "個案風險評估",
    icon: <AlertTriangle size={24} color="#0ba149" />,
  },
]

export default function EmptyCardContent({ onSendMessage,caseInfoName }: EmptyCardContentProps) {
  const handleCardClick = (message: string) => {
    if (onSendMessage) {
      onSendMessage(message)
    }
  }

  return (
    <Box sx={channelStyles.emptyStateContainer}>
      <Box>
        <Typography sx={channelStyles.emptyStateTitle}>歡迎使用智財幫智能聊天</Typography>
        <Typography sx={{ ...channelStyles.emptyStateText, mb: 4 }}>
          從左側選擇一個聊天記錄，或開始一個新的對話。您可以隨時查看歷史對話內容。
        </Typography>

        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          我能回答的問題：
        </Typography>

        <Grid container spacing={3}>
          {boxList.map((box) => (
            <Grid item xs={12} md={4} key={box.index}>
              <Paper
                sx={{
                  ...emptyCardStyle.featureCardStyle,
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "rgba(11, 161, 73, 0.05)",
                  },
                  "&:active": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  },
                }}
                elevation={2}
                onClick={() => handleCardClick(`${caseInfoName}${box.message}`)}
              >
                <Box sx={emptyCardStyle.iconContainerStyle}>{box.icon}</Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {box.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {box.content}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 2,
                    color: "#0ba149",
                    fontWeight: "medium",
                  }}
                >
                  點擊發送查詢
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}
