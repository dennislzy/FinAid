'use client'
import ChatMessage from "@/component/GPT/chatMessage"
import Direction from "@/component/GPT/direction"
import SendMessage from "@/component/GPT/sendMessage"
import { useAlert } from "@/layout/context/alertProvider"
import { ChatRequest, useGetMessagesByChannelIdQuery, useSendMessageMutation } from "@/redux/rtk/ChannelApi"
import { Box, Typography } from "@mui/material"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"

interface ChatProps {
  isDirection?: boolean,
  caseInfoId: string,
  channelId: string
}

// 定义本地消息类型，用于乐观更新
interface LocalMessage {
  channelMessageId?: string;
  channelMessage: string;
  channelRole: 'USER' | 'AI';
  timestamp: Date;
  isPending?: boolean; // 标记消息是否等待API响应
}

const Chat = (chatProps: ChatProps) => {
  const router = useRouter()
  const pathName = usePathname()

  const [loading, setLoading] = useState(false)
  const [cookies] = useCookies();
  
  // 查询API获取消息
  const {data:channelMessagesList} = useGetMessagesByChannelIdQuery(
    {
      socialWorkerEmail:cookies.user,
      caseInfoId:chatProps.caseInfoId,
      channelId:chatProps.channelId
    },
    {
      skip: chatProps.channelId==null
    }
  )

  const [sendMessage] = useSendMessageMutation()
  const {showAlert} = useAlert()

  // 本地消息状态
  const [localMessages, setLocalMessages] = useState<LocalMessage[]>([]);
  
  // 处理服务器消息变化 - 完全重写这部分以避免循环
  const initializedRef = useRef(false);
  useEffect(() => {
    // 只有当服务器有消息并且channelId存在时才处理
    if (channelMessagesList?.channelMessages && chatProps.channelId) {
      // 转换服务器消息为本地格式
      const serverMessages = channelMessagesList.channelMessages.map(msg => ({
        channelMessageId: msg.channelMessageId || `server-${Date.now()}`,
        channelMessage: msg.channelMessage || '',
        channelRole: msg.channelRole || 'AI',
        timestamp: new Date(msg.timestamp || Date.now()),
        isPending: false
      }));
      
      // 仅在初始化或有新消息时更新
      if (!initializedRef.current || serverMessages.length !== localMessages.length) {
        initializedRef.current = true;
        
        // 不依赖localMessages，而是直接设置为服务器消息
        setLocalMessages(serverMessages);
      }
    }
  }, [channelMessagesList, chatProps.channelId]);

  // 检查是否有消息可显示
  const isMessage = localMessages.length > 0 || (channelMessagesList?.channelMessages && channelMessagesList.channelMessages.length > 0);

  // 发送消息处理函数
  const handleSendMessage = async (messageData: string) => {
    if (!messageData.trim()) return;

    setLoading(true);
    
    // 创建新的本地消息
    const newUserMessage: LocalMessage = {
      channelMessage: messageData,
      channelRole: 'USER',
      timestamp: new Date(),
      isPending: true
    };
    
    // 添加到本地消息队列
    setLocalMessages(prev => [...prev, newUserMessage]);
    
    // 准备API请求
    const payload: ChatRequest = {
      socialWorkerEmail: cookies.user,
      caseInfoId: chatProps.caseInfoId,
      channelId: chatProps.channelId,
      message: messageData
    };
    
    try {
      // 发送消息到服务器
      const res = await sendMessage(payload).unwrap();
      
      // 如果成功并接收到新的channelId，更新URL
      if (res.channel && res.channel.channelId) {
        router.push(`${pathName}?channelId=${res.channel.channelId}`);
      }
      
      // 标记消息为已发送（不再处于pending状态）
      setLocalMessages(prev => 
        prev.map(msg => 
          (msg.isPending && msg.channelMessage === messageData) 
            ? {...msg, isPending: false} 
            : msg
        )
      );
      setLoading(false);
    } catch (error) {
      console.error(error);
      showAlert('發送失敗', 'error');
      
      // 发送失败时移除pending消息
      setLocalMessages(prev => 
        prev.filter(msg => !(msg.isPending && msg.channelMessage === messageData))
      );
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        // width: '100%'
      }}
    >
      {isMessage && (chatProps.channelId != null || localMessages.length > 0) ? (
        // 有消息时的布局 - 聊天内容区域
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            paddingBottom: '80px',
          }}
        >
          <Box
            sx={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            {
              // 显示本地消息列表
              localMessages.map((message, index) => (
                <Box 
                  key={message.channelMessageId || `local-${index}`}
                  sx={{ 
                    display: 'flex', 
                    justifyContent: message.channelRole === 'AI' ? 'flex-start' : 'flex-end',
                    opacity: message.isPending ? 0.7 : 1
                  }}
                >
                  <ChatMessage 
                    key={message.channelMessageId || `local-${index}-message`} 
                    chatMessage={message.channelMessage} 
                  />
                </Box>
              ))
            }
          </Box>
        </Box>
      ) : (
        // 无消息时的欢迎页面区域
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            paddingBottom: '80px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Box
            sx={{
              maxWidth: 'lg',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '25px',
              pt: 2,
              px: 3
            }}
          >
            <Box marginTop="10px">
              <Image alt="測試" src={'/assets/robot.gif'} width={200} height={200} />
            </Box>
            <Box>
              <Typography variant="h4">需要智財邦為你做什麼呢?</Typography>
            </Box>
            {
              // 显示方向块
              <>
                <Box />
                <Box />
                <Box />
                {chatProps.isDirection && (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="row"
                    gap="30px"
                  >
                    <Direction title="詢問個案資料" content="快速幫你查找好想知道的資料" />
                    <Direction title="詢問個案資料" content="快速幫你查找好想知道的資料" />
                  </Box>
                )}
              </>
            }
          </Box>
        </Box>
      )}

      {/* 固定在底部的输入框 - 统一使用isMessage为false时的样式 */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px',
          backgroundColor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          zIndex: 10
        }}
      >
        <Box
          sx={{
            maxWidth: 'lg',
            mx: 'auto',
            width: '100%'
          }}
        >
          <SendMessage isLoading={loading} caseInfoId={chatProps.caseInfoId} isMessage={isMessage} sendMessageFunction={handleSendMessage} />
        </Box>
      </Box>
    </Box>
  )
}

export default Chat;