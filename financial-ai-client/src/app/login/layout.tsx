'use client'
import MainLayout, { Props } from "@/layout/main/layout";
// 這裏直接調用佈局
export default function Layout({children}:Props){
    return <MainLayout>{children}</MainLayout>
}