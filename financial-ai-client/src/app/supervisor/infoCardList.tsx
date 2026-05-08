"use client"
import { Box, Typography, Paper, Button, Stack, Card, CardContent } from "@mui/material"
import { useRouter } from 'next/navigation';
interface GroupInfo  {
    socialWorkerAmount: number;
    caseAmount: number;
}

export default function InfoCardList() {
    const router = useRouter()
    return (
        <Box sx={{ maxWidth: 400, bgcolor: "background.paper" }}>
            {/* <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                團隊概況
            </Typography> */}

            {/* Stats Cards */}
            {/* <Stack spacing={2} sx={{ mb: 3 }}>
                <Paper
                    elevation={0}
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 2,
                        bgcolor: "#f9f9f9",
                        borderRadius: 1,
                    }}
                >
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            社工數
                        </Typography>
                        <Typography variant="subtitle1" fontWeight="bold">
                            2位
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <img
                            src="/assets/socialworker.png"
                            alt="Photo"
                            style={{
                                width: 40, 
                                height: 40,
                                objectFit: "cover", 
                            }}
                        />
                    </Box>
                </Paper>


                <Paper
                    elevation={0}
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 2,
                        bgcolor: "#f9f9f9",
                        borderRadius: 1,
                    }}
                >
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            個案數
                        </Typography>
                        <Typography variant="subtitle1" fontWeight="bold">
                            10件
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <img
                            src="/assets/caseImage.png"
                            alt="Photo"
                            style={{
                                width: 40, 
                                height: 40,
                                objectFit: "cover",
                            }}
                        />
                    </Box>
                </Paper>
            </Stack> */}

   
            <Typography variant="h6" fontWeight="bold" sx={{ my: 2 }}>
                個案跨團隊轉接
            </Typography>

            <Card elevation={0} sx={{ bgcolor: "#f9f9f9", mb: 2, borderRadius: 1 }}>
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1.5,
                        }}
                    >
                        <Typography variant="body2">跨團隊轉移個案</Typography>
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <img
                                src="/assets/ressignImage.png"
                                alt="Photo"
                                style={{
                                    width: 40, 
                                    height: 40,
                                    objectFit: "cover", 
                                }}
                            />
                        </Box>
                    </Box>
                    <Button
                        onClick={() => router.push('/supervisor/transit')}
                        variant="contained"
                        size="small"
                        sx={{
                            bgcolor: "#e53935",
                            "&:hover": { bgcolor: "#c62828" },
                            textTransform: "none",
                            minWidth: "auto",
                            px: 2,
                        }}
                    >
                        前往
                    </Button>
                </CardContent>
            </Card>


            {/* <Card elevation={0} sx={{ bgcolor: "#f9f9f9", mb: 2, borderRadius: 1 }}>
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1.5,
                        }}
                    >
                        <Typography variant="body2">審核其他團隊申請轉入個案</Typography>
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <img
                                src="/assets/ressignImage.png"
                                alt="Photo"
                                style={{
                                    width: 40, 
                                    height: 40,
                                    objectFit: "cover", 
                                }}
                            />
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        size="small"
                        sx={{
                            bgcolor: "#1976d2",
                            "&:hover": { bgcolor: "#1565c0" },
                            textTransform: "none",
                            minWidth: "auto",
                            px: 2,
                        }}
                    >
                        前往
                    </Button>
                </CardContent>
            </Card> */}
        </Box>
    )
}
