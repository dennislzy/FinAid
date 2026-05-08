"use client"
import { useRef, useState, useEffect } from "react"
import Typography from "@mui/material/Typography"
import { useGetAudioFileByIdQuery } from "@/redux/rtk/audioApi"

interface AudioContentProps {
  socialWorkerEmail: string
  caseInfoId: string
  fileId?: number
  duration?: string
  fileName:string
}

export default function AudioContent({ socialWorkerEmail, caseInfoId, fileId, duration,fileName }: AudioContentProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [audioSrc, setAudioSrc] = useState("")

  // 使用 Redux Toolkit Query 查詢錄音檔
  const { data: audioFile, error, isLoading } = useGetAudioFileByIdQuery(
    { socialWorkerEmail, caseInfoId, fileId },
    { skip: !fileId }
  )

  useEffect(() => {
    if (audioFile) {
      // 假設後端返回的 audioFile 包含檔案的 URL（需要後端支援）
      // 例如：audioFile.audioUrl 或其他欄位
      // 如果後端未提供直接 URL，需進一步調整後端
      setAudioSrc(`http://localhost:8080/files/${caseInfoId}${fileName}`)
    }
  }, [audioFile, socialWorkerEmail, caseInfoId, fileId])

  if (isLoading) {
    return <Typography color="textSecondary">正在載入錄音檔...</Typography>
  }

  if (error || !fileId) {
    return <Typography color="textSecondary">無錄音檔可播放</Typography>
  }

  return (
    <>
      {audioSrc ? (
        <audio
          ref={audioRef}
          src={audioSrc}
          onEnded={() => setIsPlaying(false)}
          controls
        />
      ) : (
        <Typography color="textSecondary">無法載入錄音檔</Typography>
      )}
    </>
  )
}