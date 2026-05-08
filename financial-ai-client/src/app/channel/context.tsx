'use client'
'use client'

import AttachFileIcon from '@mui/icons-material/AttachFile';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SendIcon from '@mui/icons-material/Send';
import { Box, Button, IconButton, InputBase, Paper, Typography } from '@mui/material';
export default function CustomCard() {
    return (
        <Box sx={{
            backgroundColor: '#f8ecd9',
            minWidth: '95vw', 
            // minHeight: '100vh',
            padding: 3,
            margin: 0,
        }}>
            <Typography variant="h4" align="center" fontWeight="bold" mb={2}>
                智財幫 - 問題一籮筐
            </Typography>

            <Paper
                sx={{
                    maxWidth: 900,
                    mx: 'auto',
                    pt: 8,
                    pr: 4,
                    pl: 4,
                    pb: 0,
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <AttachMoneyIcon fontSize="large" sx={{
                    mb: 1,
                    border: '3px solid #f6f6f6',
                    borderRadius: '100%',
                    p: 0.5,
                    color: '#b6b6b6',
                }} />

                <Typography variant="h5" fontWeight="bold">
                    經濟扶助智庫GPT
                </Typography>

                <Typography variant="subtitle1" color="textSecondary" mb={3} mt={1}
                    sx={{
                        fontSize: '14px',
                        color: '#919eab',
                    }}>
                    作者：馴錢師財商顧問股份有限公司
                </Typography>

                <Box sx={{
                    display: 'flex',
                    gap: 1.5,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    mb: 2
                }}>
                    {['請提供個案的基本資訊(如年齡、家庭結構、收入來源...', '您想了解哪些補助資源?我會幫您找尋可能的社會資源...', '您是否有關於財務、社會福利或其他領域的法規問題?...', '若不確定需要提供甚麼資訊，來進行分析，我可以先為您...'].map((text, index) => (
                        <Button key={index} variant="outlined"
                            sx={{
                                bgcolor: '#fff',
                                border: '1px solid #f2f2f2',
                                borderRadius: '15px',
                                color: '#919eab',
                                width: '180px',
                                height: 'auto',
                                padding: '10px',
                                textAlign: 'center',
                                mt: 2,
                            }}
                        >
                            {text}
                        </Button>
                    ))}
                </Box>

                <Box mb={2} mt={15} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1, width: '100%',
                    bgcolor: '#f4f4f4',
                    borderRadius: '30px',
                    padding: '8px'
                }}>
                    <IconButton>
                        <AttachFileIcon 
                        sx={{
                            color: (theme) =>theme.palette.info.main,
                            fontWeight: 'bold',
                        }}/>
                    </IconButton>
                    <InputBase
                        placeholder="傳訊息給 經濟扶助智庫GPT"
                        fullWidth
                        sx={{
                            color: 'inherit',
                            '&::placeholder': { color: 'inherit' },
                        }}
                    />
                     <IconButton>
                        <SendIcon
                        sx={{
                            color: (theme) =>theme.palette.info.main,
                            fontWeight: 'bolder',
                        }}/>
                    </IconButton>
                </Box>
            </Paper>
        </Box>
    );
}
