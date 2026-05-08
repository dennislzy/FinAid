"use client";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  IconButton,
  Typography,
  Avatar,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useState } from "react";
import { useCookies } from "react-cookie";
import CloseIcon from "@mui/icons-material/Close";
import { useGetBasicSocialWorkersQuery } from "@/redux/rtk/socialWorkerLeaderApi";
import SearchBar from "@/app/case_overview/search_input";
import { DialogTitleStyle, DialogButtonStyle, DialogContentPadding } from "@/component/styles/dialogStyles";

interface SWDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (newSocialWorkerEmail: string) => void;
  caseInfoName: string;
  isBatch?: boolean;
}

export default function AcceptDialog({
  open,
  onClose,
  onConfirm,
  caseInfoName,
  isBatch = false,
}: SWDialogProps) {
  const [cookies] = useCookies(['socialWorkerId', 'user']);
  const { data: socialWorkers, isLoading, error } = useGetBasicSocialWorkersQuery(cookies.socialWorkerId);
  const [selectedWorker, setSelectedWorker] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSelectWorker = (email: string) => {
    setSelectedWorker((prev) => (prev === email ? "" : email));
  };

  const handleClose = () => {
    setSelectedWorker("");
    setSearchKeyword("");
    onClose();
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handleConfirm = () => {
    if (selectedWorker) {
      onConfirm(selectedWorker);
      setSelectedWorker("");
      setSearchKeyword("");
    }
  };

  const filteredWorkers =
    socialWorkers?.filter((worker) =>
      worker.socialWorkerEmail.toLowerCase().includes(searchKeyword.toLowerCase())
    ) ?? [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { padding: 3 } }}>
      <DialogTitle sx={DialogTitleStyle}>
        {isBatch ? `批次變更 ${caseInfoName}` : `變更 ${caseInfoName} 所負責的社工`}
        <IconButton sx={{ marginLeft: "auto" }} onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={DialogContentPadding}>
        <Box sx={{ mb: 2 }}>
          <SearchBar onSearch={handleSearch} />
        </Box>
        {isBatch && (
          <Box sx={{ mb: 2, p: 2, bgcolor: "#fff4e5", borderRadius: 1, color: "#663c00" }}>
            <Typography variant="body2" fontWeight="medium">
              注意：此操作將會將所有選中的個案重新分配給同一位社工
            </Typography>
          </Box>
        )}

        {isLoading && <Typography>載入中...</Typography>}
        {error && <Typography>發生錯誤，請稍後再試。</Typography>}
        {!isLoading && !error && filteredWorkers.length === 0 && (
          <Typography>無符合條件的社工</Typography>
        )}

        {filteredWorkers.map((worker) => (
          <Box
            key={worker.socialWorkerEmail}
            sx={{ display: "flex", alignItems: "center", gap: 2, padding: "10px", borderBottom: "1px solid #eee" }}
          >
            <Avatar sx={{ bgcolor: (theme) => theme.palette.gray.main, color: (theme) => theme.palette.gray.dark }}>
              {worker.socialWorkerEmail?.charAt(0)}
            </Avatar>
            <Typography>{worker.socialWorkerEmail} ({worker.socialWorkerName})</Typography>
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
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button
          sx={DialogButtonStyle}
          onClick={handleConfirm}
          disabled={!selectedWorker}
        >
          {isBatch ? "批次變更" : "變更"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}