import { Box, Paper, Typography } from "@mui/material";

interface DirectionProps {
    title: string;
    content: string;
}
const directionStyle ={
    width:'300px',
    height:'100px',
    backgroundColor:'#E6E6E6',
    paddingLeft: '10px',
    paddingTop: '10px',
    borderRadius: '10px',
}

const titleStyle = {
    fontSize: '20px',
    fontWeight: '600',
}

const contentStyle = {
    fontSize: '15px',
    fontWeight: '400',
}

//gpt 説明
const Direction=(directionProps:DirectionProps)=>{
    return (
        <>
        <Paper elevation={2} sx={directionStyle}>
           <Box display='flex' flexDirection='column' gap='15px'>
                <Typography sx={titleStyle} >{directionProps.title}</Typography>
                <Typography sx={contentStyle}>{directionProps.content}</Typography>
           </Box>
        </Paper>
        </>
    )
}
export default Direction;