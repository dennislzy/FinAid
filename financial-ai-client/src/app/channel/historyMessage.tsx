import { Box, Typography } from "@mui/material"
import { useRouter } from "next/navigation"
interface HistoryMessageProps {
    historyTitle: string
    channelId: string
    caseInfoId: string
}
const HistoryMessage = (historyMessage:HistoryMessageProps) => {
  const router = useRouter()

  const {caseInfoId,channelId,historyTitle} = historyMessage
    return (
        <>
        <Box
          onClick={() => router.push(`/channel/${caseInfoId}/chat?channelId=${channelId}`)}
          sx={{
            textAlign: 'left',
            padding: '10px',
            cursor: 'pointer',
            borderRadius: '0px',
            '&:hover': { backgroundColor: '#f0f0f0' }
          }}
        >
          <Typography sx={{  color: 'black' }}>
            {
              historyTitle
            }
          </Typography>
        </Box>
        </>
    )
}

export default HistoryMessage