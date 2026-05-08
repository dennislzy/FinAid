"use client"
import { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import "react-quill/dist/quill.snow.css"
import "../../forquill.css"
import CaseFileContent from "../../caseFileContent"
import type { CaseInfoProps } from "@/type/common/common"
import FinAidBreadcrumbs from "@/component/breadcrumb/fin-aid-breadcrumbs"
import { useSearchParams, useRouter } from "next/navigation"

export default function CaseFile({ params }: CaseInfoProps) {
  const { caseInfoId, fileId } = params
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialFileName = searchParams.get("fileName") || "檔案名字" // 獲取 fileName，如果沒有則使用預設值

  // 使用 state 來管理檔案名稱，這樣可以即時更新
  const [fileName, setFileName] = useState(initialFileName)

  // 當檔案名稱更新時的回調函數
  const handleFileNameUpdate = (newFileName: string) => {
    setFileName(newFileName)

    // 更新 URL 查詢參數，但不重新加載頁面
    const url = new URL(window.location.href)
    url.searchParams.set("fileName", newFileName)
    window.history.pushState({}, "", url.toString())
  }

  // 當 URL 參數變化時更新檔案名稱
  useEffect(() => {
    const urlFileName = searchParams.get("fileName")
    if (urlFileName && urlFileName !== fileName) {
      setFileName(urlFileName)
    }
  }, [searchParams, fileName])

  const caseFileLinks = [
    { href: "/", label: "個案總覽" },
    { href: `/file/${caseInfoId}`, label: "語音助手" },
    { href: "#", label: fileName }, // 使用 state 中的 fileName
  ]

  return (
    <>
      <FinAidBreadcrumbs title={fileName} links={caseFileLinks} />
      <Box>
        <CaseFileContent
          caseInfoId={caseInfoId}
          fileId={fileId}
          filename={fileName}
          onFileNameUpdate={handleFileNameUpdate}
        />
      </Box>
    </>
  )
}
