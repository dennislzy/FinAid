'use client'
import { Container } from "@mui/material";
import Chat from "../../chat";
import History from "../../history";
import Grid from '@mui/material/Grid2';
import { CaseInfoProps } from "@/type/common/common";
import { useSearchParams } from "next/navigation";
const ChatLayout = ({ params }: CaseInfoProps) => { 
  const { caseInfoId } = params;

  const searchParams = useSearchParams()

  const channelId = searchParams.get('channelId')
  return ( 
    <Container  
      maxWidth={false}  
      disableGutters  
      sx={{  
        height: '100vh',  
        width: '100%', 
        padding: 0, 
        display: 'flex', 
        overflow: 'hidden' 
      }} 
    > 
      <Grid  
        container  
        sx={{  
          height: '100%', 
          width: '100%', 
          flexWrap: 'nowrap', 
          m: 0 
        }} 
      > 
        {/* Left side - History component */} 
        <Grid  
          size={2} 
          sx={{  
            height: '100%', 
            minWidth: { xs: '100%', md: '250px' }, 
            backgroundColor: '#D9D9D9', 
            overflow: 'auto', 
          }} 
        > 
          <History caseInfoId={caseInfoId} /> 
        </Grid> 
         
        {/* Right side - Chat component */} 
        <Grid  
          size={10} 
          sx={{  
            height: '100%', 
            // overflow: 'hidden', 
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column'
          }} 
        > 
          <Chat channelId={channelId as string} caseInfoId={caseInfoId} isDirection={true} /> 
        </Grid> 
      </Grid> 
    </Container> 
  ); 
}; 
 
export default ChatLayout;