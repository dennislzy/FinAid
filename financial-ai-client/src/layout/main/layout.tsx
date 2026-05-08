import { Box, Container } from "@mui/material"
import React from "react"

export type Props={
    children:React.ReactNode
}
 //配置頁面佈局 讓所有子元素都能mainLayout套用樣式
export default function MainLayout({children}:Readonly<Props>){
    return <>
     
    <Container maxWidth='lg'>
    {children}
    </Container>
    
    </>
}