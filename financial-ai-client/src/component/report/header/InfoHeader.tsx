import { Box, Typography } from "@mui/material"
interface InfoProps{
    title:string,
    description:string,
    bgColor?: string // 讓顏色可以選擇性傳入
}
const InfoHeader=(infoProps:InfoProps)=>{
    const { title, description, bgColor = "#FFB6B6" } = infoProps;
    return (
        <>
        <Box sx={{
                backgroundColor: bgColor,
                display: "flex",
                flexDirection: "column",

                padding: 5,
                gap: 3,
            }}>
                <Typography variant='h4'
                    sx={{
                        color: "#fff",
                        fontWeight: "bold",
                    }}>
                   {title}
                </Typography>
                <Typography
                    sx={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "15px",
                    }}>
                    {description}
                </Typography>

            </Box>
        </>
    )
}
export default InfoHeader