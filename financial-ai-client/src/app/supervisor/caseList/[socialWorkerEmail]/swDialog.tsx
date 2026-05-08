"use client"

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Chip,
  Box,
  IconButton,
  Typography,
  Avatar,
  Checkbox,
  FormControlLabel,
} from "@mui/material"
import { useState } from "react"
import { useCookies } from "react-cookie"
import CloseIcon from "@mui/icons-material/Close"
import { useGetBasicSocialWorkersQuery } from "@/redux/rtk/socialWorkerLeaderApi"
import SearchBar from "@/app/case_overview/search_input"
import { DialogTitleStyle, DialogButtonStyle, DialogContentPadding } from "@/component/styles/dialogStyles"

interface SWDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: (newSocialWorkerEmail: string) => void
  caseInfoName: string
  nowsocialWorkerEmail: string
  isBatch?: boolean 
}

export default function SWDialog({
  open,
  onClose,
  onConfirm,
  caseInfoName,
  nowsocialWorkerEmail,
  isBatch = false,
}: SWDialogProps) {
  const [cookies] = useCookies(['socialWorkerId', 'user']);
  const { data: socialWorkers, isLoading, error } = useGetBasicSocialWorkersQuery(cookies.socialWorkerId);
  const [selectedWorker, setSelectedWorker] = useState<string>("")
  const [searchKeyword, setSearchKeyword] = useState("")

  const handleSelectWorker = (email: string) => {
    setSelectedWorker((prev) => (prev === email ? "" : email))
  }

  const handleClose = () => {
    setSelectedWorker("")
    onClose()
  }

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword)
  }

  const handleConfirm = () => {
    if (selectedWorker) {
      onConfirm(selectedWorker)
      setSelectedWorker("")
    }
  }

  const filteredWorkers =
    socialWorkers?.filter((worker) => worker.socialWorkerEmail.toLowerCase().includes(searchKeyword.toLowerCase())) ??
    []

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { padding: 3 } }}>
      <DialogTitle sx={DialogTitleStyle}>
        {isBatch ? `批次變更 ${caseInfoName} 所負責的社工` : `變更 ${caseInfoName} 所負責的社工`}

        <IconButton sx={{ marginLeft: "auto" }} onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={DialogContentPadding}>
        {isBatch && (
          <Box sx={{ mb: 2, p: 2, bgcolor: "#fff4e5", borderRadius: 1, color: "#663c00" }}>
            <Typography variant="body2" fontWeight="medium">
              注意：此操作將會將所有選中的個案重新分配給同一位社工
            </Typography>
          </Box>
        )}
        <br />
        <SearchBar onSearch={handleSearch} />
        <br />

        {isLoading && <Typography>載入中...</Typography>}
        {error && <Typography>發生錯誤，請稍後再試。</Typography>}

        {filteredWorkers.map((worker) => (
          <Box
            key={worker.socialWorkerEmail}
            sx={{ display: "flex", alignItems: "center", gap: 2, padding: "10px", borderBottom: "1px solid #eee" }}
          >
            <Avatar sx={{ bgcolor: (theme) => theme.palette.gray.main, color: (theme) => theme.palette.gray.dark }}>
              {worker.socialWorkerEmail?.charAt(0)}
            </Avatar>
            <Typography>{worker.socialWorkerEmail}</Typography>

            {worker.socialWorkerEmail === nowsocialWorkerEmail ? (
              <Chip label="當前社工" color="primary" sx={{ marginLeft: "auto", fontWeight: "bold" }} />
            ) : (
              <FormControlLabel
                sx={{ marginLeft: "auto" }}
                control={
                  <Checkbox
                    checked={selectedWorker === worker.socialWorkerEmail}
                    onChange={() => handleSelectWorker(worker.socialWorkerEmail)}
                    color="success"
                  />
                }
                label=""
              />
            )}
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button
          sx={DialogButtonStyle}
          onClick={handleConfirm}
          disabled={!selectedWorker} // 防止未選擇就點擊
        >
          {isBatch ? "批次變更" : "變更"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

