import { Box, Paper, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import HistoryMessage from "./historyMessage";
import { useGetChannelsBySocialWorkerQuery } from "@/redux/rtk/ChannelApi";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";

// const historyStyle = {
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
//   gap: '25px',
//   width: '20%',
//   backgroundColor: '#f4f4f4',
//   height: '530px',
//   paddingTop: '20px'
// };

const buttonStyle = {
  borderRadius: '10px',
  padding: '10px',
  display: 'flex',
  margin: '20px',
  color: '#3F3D56',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '1.5',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  '&:hover': {
    cursor: 'pointer',
  }
};

const textStyle = {
  fontSize: '25px',
  color: '#919eab',
};
interface HistoryProps {
  caseInfoId: string;
}
const History = (historyProps:HistoryProps) => {

   const [cookies] = useCookies();

  const {data:historyMessage} = useGetChannelsBySocialWorkerQuery(
    {
      socialWorkerEmail:cookies.user,
      caseInfoId:historyProps.caseInfoId
    }
  )
  const router = useRouter()
  const changeUrl = () => {
    const newUrl = `/channel/${historyProps.caseInfoId}/chat`;
    router.replace(newUrl);
    setTimeout(() => {
      window.location.href = newUrl; // 強制載入新頁面
    }, 100); // 稍微延遲，確保 replace 先執行
  };

  return (
    <>
      <Paper elevation={2} sx={buttonStyle} onClick={changeUrl}>
        <AddIcon sx={{ color: 'black', fontSize: 25 }} />
        <Typography sx={textStyle}>開始新的對話</Typography>
      </Paper>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Box>
            <Typography
            sx={{ marginBottom: '20px', textAlign: 'left',paddingLeft: '10px',fontBold: '800' ,fontSize: '30px'}}
            >
            歷史對話
            </Typography>
        </Box>
        {
          historyMessage?.map((message,index)=>(
            <HistoryMessage
              key={message.channelId} 
              caseInfoId={message.caseInfo.caseInfoId} 
              channelId={message.channelId} 
              historyTitle={message.channelTitle}/>
          ))
        }
      </Box>
        </>
  );
};

export default History;
