"use client";

import { useState } from "react";
import { useCookies } from "react-cookie";
import { useAlert } from "@/layout/context/alertProvider";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  FormControl,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { DialogTitleStyle, DialogButtonStyle, DialogSelectedStyle, DialogContentPadding } from "@/component/styles/dialogStyles";
import { useSubmitReviewMutation, useGetAllCasesByLeaderIdQuery } from "@/redux/rtk/reviewApi";
import { useGetAllLeadersWithGroupQuery } from "@/redux/rtk/socialWorkerLeaderApi";

interface TransferDialogProps {
  open: boolean;
  onClose: () => void;
}

const label = {
  mt: 1,
  fontWeight: 500,
  color: "#1c252e",
  marginBottom: "0.5rem",
};

export default function ApplyDialog({ open, onClose }: TransferDialogProps) {
  const [cookies] = useCookies(['socialWorkerId', 'user']);
  const [selectedCaseInfoId, setSelectedCaseInfoId] = useState<string>("");
  const [selectedGroupId, setSelectedGroupId] = useState<number | "">("");

  // 使用新的端點獲取個案數據
  const { data: cases, isLoading: casesLoading, error: casesError } = useGetAllCasesByLeaderIdQuery(cookies.socialWorkerId);
  const { data: leaders, isLoading: groupsLoading, error: groupsError } = useGetAllLeadersWithGroupQuery();
  const [submitReview, { isLoading: submitLoading }] = useSubmitReviewMutation();
  const { showAlert } = useAlert();

  // 過濾掉當前使用者的組別
  const filteredLeaders = leaders?.filter(
    (leader) => leader.socialWorkerEmail !== cookies.user
  ) || [];

  const handleClose = () => {
    setSelectedCaseInfoId("");
    setSelectedGroupId("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedCaseInfoId || !selectedGroupId) {
      showAlert("請選擇個案和組別", "error");
      return;
    }
    try {
      const review = {
        caseInfoId: selectedCaseInfoId,
        groupId: selectedGroupId,
        fromWorkerId: cookies.socialWorkerId,
      };
      await submitReview(review).unwrap();
      showAlert("申請提交成功", "success");
      handleClose();
      setSelectedCaseInfoId("");
      setSelectedGroupId("");
    } catch (error) {
      console.error("提交失敗:", error);
      showAlert("申請提交失敗", "error");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { padding: 3 } }}>
      <DialogTitle sx={DialogTitleStyle}>
        申請轉移個案
        <IconButton sx={{ marginLeft: 'auto' }} onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={DialogContentPadding}>
        <Typography variant="body1" sx={label}>選擇轉出個案</Typography>
        <FormControl fullWidth margin="normal">
          <Select
            value={selectedCaseInfoId}
            onChange={(e) => setSelectedCaseInfoId(e.target.value as string)}
            displayEmpty
            inputProps={{ "aria-label": "選擇轉出個案" }}
            sx={DialogSelectedStyle}
          >
            <MenuItem value="" disabled>
              請選擇個案
            </MenuItem>
            {casesLoading ? (
              <MenuItem value="" disabled>載入中...</MenuItem>
            ) : casesError ? (
              <MenuItem value="" disabled>載入失敗</MenuItem>
            ) : (
              cases?.map((caseItem) => (
                <MenuItem key={caseItem.caseInfoId} value={caseItem.caseInfoId}>
                  {caseItem.caseInfoName || caseItem.caseInfoId} (負責社工：{caseItem.socialWorkerName})
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        <Typography variant="body1" sx={label}>選擇欲轉出組別</Typography>
        <FormControl fullWidth margin="normal">
          <Select
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value as number)}
            displayEmpty
            inputProps={{ "aria-label": "選擇欲轉出組別" }}
            sx={DialogSelectedStyle}
          >
            <MenuItem value="" disabled>
              請選擇組別
            </MenuItem>
            {groupsLoading ? (
              <MenuItem value="" disabled>載入中...</MenuItem>
            ) : groupsError ? (
              <MenuItem value="" disabled>載入失敗</MenuItem>
            ) : filteredLeaders.length > 0 ? (
              filteredLeaders.map((leader) => (
                <MenuItem key={leader.groupId} value={leader.groupId}>
                  {`${leader.socialWorkerName} (${leader.socialWorkerEmail}) 的組別`}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="" disabled>無其他組別可選擇</MenuItem>
            )}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={DialogButtonStyle}
          disabled={submitLoading || casesLoading || groupsLoading}
        >
          申請
        </Button>
      </DialogActions>
    </Dialog>
  );
}