import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import { Alert } from "@mui/material";
interface MessageProps {
    messages: string,
    backgroundColor: 'rgb(44, 197, 44)'|'rgb(255, 0, 0)',
    sucessOrFail: 'success'|'error'
}

const AlertMessage = (messages: MessageProps) => {
    return (
        <Alert 
            icon={messages.sucessOrFail === 'success' ? 
                <CheckIcon sx={{ color: 'white' }} /> : 
                <ErrorIcon sx={{ color: 'white' }} />
            }
            id={messages.sucessOrFail ==='success'? 'alert-success' : 'alert-error'}
            sx={{
                borderRadius:'10px',
                width: '400px',
                margin: 0,
                fontSize: '20px',
                backgroundColor: messages.backgroundColor,
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'fixed',
                left: '50%',
                top:'50px',
                transform: 'translateX(-50%)',
                zIndex: 9999,
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                '& .MuiAlert-icon': {
                    color: 'white'  // 這會覆蓋默認的圖標顏色
                }
            }} 
            severity={messages.sucessOrFail}
        >
            {messages.messages}
        </Alert>
    );
}

export default AlertMessage;