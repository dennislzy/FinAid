"use client"
import type { CaseInfoProps } from "@/type/common/common"
import type React from "react"

import { Avatar, Box, Button, Card, CardContent, CardHeader, TextField, Typography } from "@mui/material"
import { useRouter, useSearchParams } from "next/navigation"
import { channelStyles } from "../../channel2Style"
import ChatHistorySidebar from "../../chatHistorySide"
import { SendIcon } from "lucide-react"
import { useEffect, useState } from "react"
import {
  useGetChannelsBySocialWorkerQuery,
  useGetMessagesByChannelIdQuery,
  useSendMessageMutation,
} from "@/redux/rtk/ChannelApi"
import ChatMessage from "../../chatMessage"
import { useAlert } from "@/layout/context/alertProvider"
import { useCookies } from "react-cookie"
import EmptyCardContent from "../../CardContent"
import { useGetCasesQuery } from "@/redux/rtk/caseApi"
import NewSidebar from "@/component/newSidebar/newSidebar"

interface LocalMessage {
  channelMessageId?: string
  channelMessage: string
  channelRole: "USER" | "AI"
  timestamp: Date
  isPending: boolean
}

// 定義發送消息請求類型
interface ChatRequest {
  socialWorkerEmail: string
  caseInfoId: string
  channelId?: string
  message: string
}

const ChatLayout = ({ params }: CaseInfoProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const channelId = searchParams.get("channelId")

  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const handleChatSelect = (chatId: string | null) => {
    setActiveChat(chatId)
    setIsMobileSidebarOpen(false)
  }

  const [cookies] = useCookies()

  // 獲取頻道消息
  const { data: channelMessagesList, isSuccess: messagesLoaded } = useGetMessagesByChannelIdQuery(
    {
      socialWorkerEmail: cookies.user,
      caseInfoId: params.caseInfoId,
      channelId: channelId as string,
    },
    {
      skip: channelId == null,
    },
  )

  // 獲取社工的所有頻道
  const { data: channelsData } = useGetChannelsBySocialWorkerQuery({
    socialWorkerEmail: cookies.user,
    caseInfoId: params.caseInfoId,
  })

  const {data:cases} = useGetCasesQuery({
    socialWorkerEmail: cookies.user,
    caseInfoId: params.caseInfoId,
  })

  const [sendMessage] = useSendMessageMutation()
  const { showAlert } = useAlert()

  // 表單狀態
  const [input, setInput] = useState("")
  const [isLoading, setLoading] = useState(false)

  // 本地消息狀態 - 只儲存暫時的訊息
  const [pendingMessages, setPendingMessages] = useState<LocalMessage[]>([])

  // 處理服務器消息變化 - 更新 activeChat
  useEffect(() => {
    if (channelId) {
      setActiveChat(channelId)
    } else {
      setActiveChat(null)
    }
  }, [channelId])

  // 當頻道ID變化時，清空暫存消息
  useEffect(() => {
    // 清空暫存消息
    setPendingMessages([])
  }, [channelId])

  // 處理輸入變化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  // 處理發送消息
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | null, messageOverride?: string) => {
    if (e) e.preventDefault()

    // 使用覆蓋的消息或輸入框中的消息
    const messageToSend = messageOverride || input

    if (!messageToSend.trim() || isLoading) return

    // 保存當前輸入的訊息，並立即清空輸入框
    setInput("")

    setLoading(true)

    // 創建新的本地消息 - 用戶訊息
    const newUserMessage: LocalMessage = {
      channelMessage: messageToSend,
      channelRole: "USER",
      timestamp: new Date(),
      isPending: false,
    }

    // 創建新的本地消息 - AI 正在輸入的訊息
    const pendingAIMessage: LocalMessage = {
      channelMessage: "正在思考中...",
      channelRole: "AI",
      timestamp: new Date(),
      isPending: true,
    }

    // 添加用戶訊息和 AI 等待訊息到本地消息隊列 - 保留之前的暫存消息
    setPendingMessages((prev) => [...prev, newUserMessage, pendingAIMessage])

    // 準備API請求
    const payload: ChatRequest = {
      socialWorkerEmail: cookies.user,
      caseInfoId: params.caseInfoId,
      message: messageToSend,
    }

    // 只有在已有頻道ID的情況下才添加到請求中
    if (channelId) {
      payload.channelId = channelId
    }

    try {
      // 發送消息到服務器
      const res = await sendMessage(payload).unwrap()

      // 如果成功並接收到新的channelId，更新URL
      if (res.channel && res.channel.channelId && !channelId) {
        router.push(`/channel2/${params.caseInfoId}/chat?channelId=${res.channel.channelId}`)
      }

      // 只保留用戶最新發送的訊息，其他暫存消息清空
      // 因為 API 請求成功後會從服務器獲取所有消息，包括 AI 的回覆
      const userMessage = pendingMessages.find(
        (msg) => msg.channelRole === "USER" && !msg.isPending && msg.channelMessage === messageToSend,
      )

      // 如果找到用戶訊息，保留它，否則清空所有暫存消息
      setPendingMessages(userMessage ? [userMessage] : [])

      setLoading(false)
    } catch (error) {
      console.error(error)
      showAlert("發送失敗", "error")

      // 發送失敗時，移除 AI 等待訊息，但保留用戶訊息
      setPendingMessages((prev) => prev.filter((msg) => !msg.isPending))

      setLoading(false)
    }
  }

  // 從卡片發送消息的處理函數
  const handleCardMessageSend = (message: string) => {
    handleSubmit(null, message)
  }

  // 判斷是否顯示空卡片內容 - 只要有暫存消息就不顯示空卡片
  const showEmptyCard =
    pendingMessages.length === 0 &&
    (!channelId ||
      (channelId &&
        messagesLoaded &&
        (!channelMessagesList?.channelMessages || channelMessagesList.channelMessages.length === 0)))

  return (
    <>
      <Box sx={channelStyles.container}>
        <Box component="header" sx={channelStyles.header}>
          <Typography sx={channelStyles.headerTitle}>智能財務分析幫手</Typography>
        </Box>
        <Box sx={channelStyles.mainContainer}>
          {/* 側邊欄 - 聊天歷史 */}
          <Box component="aside" sx={channelStyles.sidebar}>
            <ChatHistorySidebar
              activeChat={activeChat}
              onChatSelect={handleChatSelect}
              caseInfoId={params.caseInfoId}
            />
          </Box>

          {/* 主聊天區域 */}
          <Box component="main" sx={channelStyles.mainContent}>
            <Card sx={channelStyles.card}>
              {/* 卡片標題 */}
              <CardHeader
                sx={channelStyles.cardHeader}
                title={
                  <Box sx={channelStyles.cardTitle}>
                    <Avatar sx={{ height: 24, width: 24, bgcolor: channelId ? "#0ba149" : "#e0e0e0", padding: "2px" }}>
                      {channelId && channelsData
                        ? channelsData
                            .find((c) => c.channelId === channelId)
                            ?.channelTitle.replace(/[「」，。、；：'"『』（）(),.;:"'?!]/g, "")
                            ?.charAt(0) || "A"
                        : "A"}
                    </Avatar>
                    <Typography component="span">
                      {channelId && channelsData
                        ? channelsData
                            .find((c) => c.channelId === channelId)
                            ?.channelTitle.replace(/[「」，。、；：'"『』（）(),.;:"'?!]/g, "") || "新對話"
                        : "新對話"}
                    </Typography>
                  </Box>
                }
              />

              {/* 卡片內容 */}
              <CardContent sx={channelStyles.cardContent}>
                <Box sx={channelStyles.messagesContainer}>
                  {showEmptyCard ? (
                    <EmptyCardContent
                      caseInfoName={cases?.caseInfoName}
                      onSendMessage={handleCardMessageSend}
                    />
                  ) : (
                    <>
                      {/* 顯示從API獲取的消息 */}
                      {channelMessagesList?.channelMessages?.map((channelMessage) => (
                        <ChatMessage
                          key={channelMessage.channelMessageId}
                          channelMessage={channelMessage.channelMessage}
                          channelRole={channelMessage.channelRole}
                          channelId={channelId as string}
                          caseInfoId={params.caseInfoId}
                        />
                      ))}

                      {/* 顯示暫存消息（尚未從API返回的） */}
                      {pendingMessages.map((msg, index) => (
                        <ChatMessage
                          key={`pending-${index}`}
                          channelMessage={msg.channelMessage}
                          channelRole={msg.channelRole}
                          channelId={channelId as string}
                          caseInfoId={params.caseInfoId}
                          isPending={msg.isPending}
                        />
                      ))}
                    </>
                  )}
                </Box>
              </CardContent>

              {/* 輸入區域 */}
              <Box component="form" sx={channelStyles.cardFooter} onSubmit={(e) => handleSubmit(e)}>
                <Box sx={channelStyles.form}>
                  <TextField
                    value={input}
                    onChange={handleInputChange}
                    placeholder="輸入您的訊息..."
                    sx={channelStyles.input}
                    variant="outlined"
                    size="small"
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!input.trim() || isLoading}
                    sx={channelStyles.sendButton}
                  >
                    <SendIcon size={20} />
                  </Button>
                </Box>
              </Box>
            </Card>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default ChatLayout
