import { Box, Button, IconButton, List, ListItem, ListItemButton, Typography } from "@mui/material"
import { historySidebarStyles } from "./channel2Style"
import { useDeleteChannelMutation, useGetChannelsBySocialWorkerQuery } from "@/redux/rtk/ChannelApi"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import { useAlert } from "@/layout/context/alertProvider"
import InvestmentConfirmDialog from "../caseInvestment/[caseInfoId]/InvestmentConfirmDialog"
import { useCookies } from "react-cookie"
interface Channel {
  channelId: string
  channelTitle: string
  channelMessage?: string
  timestamp?: string
  caseInfo: {
    caseInfoId: string
  }
}
interface ChatHistorySidebarProps {
  activeChat: string | null
  onChatSelect: (chatId:string|null) => void
  caseInfoId: string // 添加caseInfoId作為必要參數
}
export default function ChatHistorySidebar({ activeChat, onChatSelect, caseInfoId }: ChatHistorySidebarProps) {
  const router = useRouter()

  const [cookies] = useCookies();
  // 使用API獲取聊天歷史
  const { data: historyChannels, isLoading, error } = useGetChannelsBySocialWorkerQuery({
    socialWorkerEmail: cookies.user,
    caseInfoId: caseInfoId
  })

  // 當歷史頻道加載後，如果沒有活動的聊天，設置第一個為活動
  useEffect(() => {
    if (historyChannels && historyChannels.length > 0 && !activeChat) {
      onChatSelect(historyChannels[0].channelId)
    }
  }, [historyChannels, activeChat, onChatSelect])


  // 創建新對話
  const handleNewChat = () => {
    // 清除當前活動聊天
    onChatSelect(null)


    // 重定向到沒有channelId的URL
    const newUrl = `/channel2/${caseInfoId}/chat`;
    router.replace(newUrl);
    setTimeout(() => {
      window.location.href = newUrl; // 強制載入新頁面
    }, 100); // 稍微延遲，確保 replace 先執行
  }

  // 格式化日期函數
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-TW')
    } catch (error) {
      console.error("Date formatting error:", error)
      return dateString
    }
  }


  const {showAlert} = useAlert()
  const [deleteChannel] = useDeleteChannelMutation()
  const handleDeleteChat = async (chatId:string) => {
      try {
          await deleteChannel({
            caseInfoId:caseInfoId,
            socialWorkerEmail:cookies.user,
            channelId:chatId
          }).unwrap()
          showAlert('刪除成功','success')
          router.push(`/channel2/${caseInfoId}/chat`)
      } catch (error) {
          showAlert('操作失敗','error')
      }
  }
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  // 新增 state 來儲存要刪除的 channelId
  const [channelToDelete, setChannelToDelete] = useState<string | null>(null);
  
  return (
    <Box sx={historySidebarStyles.container}>
      <Box sx={historySidebarStyles.header}>
        <Typography sx={historySidebarStyles.headerTitle}>聊天歷史</Typography>
      </Box>

      <Box sx={historySidebarStyles.listContainer}>
        {isLoading ? (
          <Typography sx={{ padding: 2, textAlign: 'center' }}>載入中...</Typography>
        ) : error ? (
          <Typography sx={{ padding: 2, textAlign: 'center', color: 'error.main' }}>
            載入失敗，請稍後再試
          </Typography>
        ) : historyChannels && historyChannels.length > 0 ? (
          <List sx={historySidebarStyles.list}>
            {historyChannels.map((channel: Channel) => (
              <ListItem key={channel.channelId} disablePadding sx={historySidebarStyles.listItem}>
                <ListItemButton
                  selected={activeChat === channel.channelId}
                  onClick={() => {
                    onChatSelect(channel.channelId)
                    // 更新URL以包含channelId
                    router.push(`/channel2/${caseInfoId}/chat?channelId=${channel.channelId}`)
                  }}
                  sx={historySidebarStyles.listItemButton}
                >
                  <Box sx={{ width: "100%" }}>
                    <Typography sx={historySidebarStyles.chatTitle}>
                      {channel.channelTitle.replace(/[「」，。、；：'"『』（）(),.;:"'?!]/g, '') || "未命名對話"}
                    </Typography>
                    <Typography component="span" display="block" sx={historySidebarStyles.chatTimestamp}>
                      {formatDate(channel.timestamp)}
                    </Typography>
                  </Box>
                </ListItemButton>
                <IconButton
                  size="small"
                  sx={historySidebarStyles.deleteButton}
                  aria-label="刪除對話"
                >
                  <DeleteOutlineIcon 
                    fontSize="small" 
                    onClick={() => {
                      setChannelToDelete(channel.channelId);
                      setConfirmDialogOpen(true);
                    }} 
                  />
                </IconButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography sx={{ padding: 2, textAlign: 'center' }}>
            沒有聊天記錄，開始一個新對話吧
          </Typography>
        )}
      </Box>

      <Button
        fullWidth
        variant="text"
        onClick={handleNewChat}
        sx={historySidebarStyles.newChatButton}
      >
        <Typography sx={historySidebarStyles.newChatText}>+ 新對話</Typography>
      </Button>
      <InvestmentConfirmDialog
        open={confirmDialogOpen}
        onClose={() => {
          setConfirmDialogOpen(false);
          setChannelToDelete(null); // 關閉對話框時重置 channelToDelete
        }}
        onConfirm={() => {
          if (channelToDelete) {
            handleDeleteChat(channelToDelete);
          }
          setConfirmDialogOpen(false);
        }}
      />
    </Box>
  )
}