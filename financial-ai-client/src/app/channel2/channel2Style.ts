import { keyframes } from "@mui/material/styles"
export const channelStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100%",
    backgroundColor: "#f5f5f5",
    boxShadow: " 0px 5px 5px 0px rgba(145,158,171,0.11)",
    border: "2px solid rgba(145, 158, 171, 0.08)",
    borderRadius: "15px",
  },
  header: {
    borderBottom: "1px solid #e0e0e0",
    backgroundColor: "#ffffff",
    padding: "12px 16px",
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: "20px",
    textAlign: 'center',
  },
  mainContainer: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
  sidebar: {
    width: "280px",
    borderRight: "1px solid #e0e0e0",
    backgroundColor: "#ffffff",
    display: { xs: "none", md: "block" },
  },
  mobileTabsContainer: {
    display: { xs: "block", md: "none" },
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e0e0e0",
    padding: "8px",
  },
  tabsStyle: {
    display: "flex",
    justifyContent: "center",
    gap: 2,
    "& .MuiTab-root": {
      borderRadius: "30px",
      textTransform: "none",
      padding: "5px 20px",
      fontWeight: "bold",
      fontSize: "16px",
      transition: "0.3s",
      margin: 2,
      "&.Mui-selected": {
        color: "#ffffff",
        backgroundColor: "#0ba149",
      },
    },
  },
  mainContent: {
    flex: 1,
    padding: "16px",
    overflow: "hidden",
    // width: '100%'
  },
  card: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
  },
  cardHeader: {
    padding: "12px 16px",
    borderBottom: "1px solid #e0e0e0",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  cardContent: {
    flex: 1,
    padding: "16px",
    overflow: "auto",
    // width: '100%'
  },
  emptyStateContainer: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "32px",
  },
  emptyStateContent: {
    maxWidth: "400px",
  },
  emptyStateTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  emptyStateText: {
    color: "#666666",
  },
  messagesContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    paddingTop: "16px",
    width: "100%", // 确保容器有正确的宽度
  },
  cardFooter: {
    padding: "16px",
    borderTop: "1px solid #e0e0e0",
  },
  form: {
    display: "flex",
    width: "100%",
    gap: "8px",
  },
  input: {
    flex: 1,
  },
  sendButton: {
    minWidth: "unset",
    padding: "8px",
  },
}


export const historySidebarStyles = {
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "16px",
    borderBottom: "1px solid #e0e0e0",
  },
  headerTitle: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  listContainer: {
    flex: 1,
    overflow: "auto",
  },
  list: {
    padding: 0,
  },
  listItem: {
    padding: 0,
  },
  listItemButton: {
    padding: "12px 16px",
    "&.Mui-selected": {
      backgroundColor: "rgba(11, 161, 73, 0.08)",
      "&:hover": {
        backgroundColor: "rgba(11, 161, 73, 0.12)",
      },
    },
  },
  chatTitle: {
    fontWeight: "bold",
    fontSize: "14px",
    marginBottom: "4px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  chatPreview: {
    fontSize: "12px",
    color: "#666666",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  chatTimestamp: {
    fontSize: "11px",
    color: "#999999",
    marginTop: "4px",
  },
  newChatButton: {
    padding: "16px",
    borderTop: "1px solid #e0e0e0",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#f0f0f0",
    },
  },
  newChatText: {
    fontWeight: "bold",
    color: "#0ba149",
  },
  deleteButton: {
    position: "absolute",
    right: "4px",
    top: "50%",
    transform: "translateY(-50%)",
    padding: "4px",
    color: "#999999",
    "&:hover": {
      color: "#f44336",
      backgroundColor: "rgba(244, 67, 54, 0.08)",
    },
  }
}


export const messageStyles = {
  container: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    // width: '100%'
  },
  avatar: {
    height: 32,
    width: 32,
    bgcolor: "#e0e0e0",
    flexShrink: 0,
    marginTop: "4px", // 添加頂部間距使頭像與文字第一行對齊
  },
  userMessageBubble: {
    maxWidth: "80%",
    minWidth: "120px", // 添加最小宽度
    padding: "12px",
    borderRadius: "12px",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "4px",
    wordBreak: "break-word",
    backgroundColor: "#e3f2fd", // 可选：添加用户消息的背景色
  },
  userAvatar: {
    height: 32,
    width: 32,
    bgcolor: "#0ba149",
    flexShrink: 0,
    marginTop: "4px", // 添加頂部間距使頭像與文字第一行對齊
  },
  userContainer: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    flexDirection: "row-reverse",
    marginBottom: "16px",
    width: "100%",
  },
  avatarContent: {
    display: "flex",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  messageBubble: {
    maxWidth: "80%",
    minWidth: "120px", // 添加最小宽度
    padding: "12px",
    borderRadius: "12px",
    // wordBreak: "break-word", // 确保文字能够正确换行
    backgroundColor: "#f1f1f1", // 可选：添加背景色以便于区分
  },
  messageText: {
    whiteSpace: "pre-wrap",
  },
}

export const channelSelectorStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  channelItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
  },
  contentWrapper: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    gap: "4px",
  },
  channelName: {
    fontWeight: "medium",
    cursor: "pointer",
    fontSize: "14px",
  },
  activeChannelName: {
    fontWeight: "bold",
    cursor: "pointer",
    color: "#0ba149",
    fontSize: "14px",
  },
  channelDescription: {
    fontSize: "12px",
    color: "#666666",
    margin: 0,
  },
  radio: {
    padding: "4px",
    "&.Mui-checked": {
      color: "#0ba149",
    },
  },
}


//cardStyle
export const emptyCardStyle = {
  featureCardStyle: {
    padding: "16px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
    },
    cursor: 'pointer',
  },
  iconContainerStyle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "rgba(11, 161, 73, 0.1)",
    marginBottom: "12px",
  }
}
export const waveAnimation = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-5px);
  }
  50% {
    transform: translateY(0);
  }
  75% {
    transform: translateY(5px);
  }
`

// 波浪文字樣式
export const waveStyles = {
  waveText: {
    display: "flex",
    alignItems: "center",
    minHeight: "24px", // 添加最小高度
  },
  waveChar: (index) => ({
    display: "inline-block",
    // 减小动画的幅度，使其不那么剧烈
    animation: `${waveAnimation} 1.5s ease-in-out infinite`,
    animationDelay: `${index * 0.1}s`,
    transform: "translateY(0)", // 确保初始位置正确
  }),
}
