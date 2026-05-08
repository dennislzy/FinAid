"use client";

import { useState } from "react";
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
import { useGetAllLeadersWithGroupQuery, useAssignSocialWorkerToGroupMutation } from "@/redux/rtk/socialWorkerLeaderApi";

interface AssignGroupDialogProps {
  open: boolean;
  onClose: () => void;
  worker: { socialWorkerId: string; socialWorkerName: string } | null;
}

const label = {
  mt: 1,
  fontWeight: 500,
  color: "#1c252e",
  marginBottom: "0.5rem",
};

export default function AssignGroupDialog({ open, onClose, worker }: AssignGroupDialogProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<number | "">("");
  const { data: leaders, isLoading: groupsLoading, error: groupsError } = useGetAllLeadersWithGroupQuery();
  const [assignSocialWorkerToGroup, { isLoading: submitLoading }] = useAssignSocialWorkerToGroupMutation();

  const handleClose = () => {
    setSelectedGroupId("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedGroupId || !worker) {
      alert("請選擇組別");
      return;
    }

    try {
      const request = {
        socialWorkerId: worker.socialWorkerId,
        groupId: selectedGroupId.toString(), // 轉為字符串，因為後端期望字符串
      };
      const response = await assignSocialWorkerToGroup(request).unwrap();
      alert(`分配成功: ${response.message || JSON.stringify(response)}`);
      handleClose();
    } catch (error) {
      console.error("分配失敗:", error);
      alert("分配失敗，請稍後再試");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { padding: 3 } }}>
      <DialogTitle sx={DialogTitleStyle}>
        分配社工組別
        <IconButton sx={{ marginLeft: 'auto' }} onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={DialogContentPadding}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          將社工 <strong>{worker?.socialWorkerName}</strong> 分配到以下組別：
        </Typography>

        <Typography variant="body1" sx={label}>選擇欲分配的組別</Typography>
        <FormControl fullWidth margin="normal">
          <Select
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value as number)}
            displayEmpty
            inputProps={{ "aria-label": "選擇欲分配的組別" }}
            sx={DialogSelectedStyle}
          >
            <MenuItem value="" disabled>
              請選擇組別
            </MenuItem>
            {groupsLoading ? (
              <MenuItem value="" disabled>載入中...</MenuItem>
            ) : groupsError ? (
              <MenuItem value="" disabled>載入失敗</MenuItem>
            ) : leaders && leaders.length > 0 ? (
              leaders.map((leader) => (
                <MenuItem key={leader.groupId} value={leader.groupId}>
                  {`${leader.socialWorkerName} (${leader.socialWorkerEmail}) 的組別`}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="" disabled>無可用組別</MenuItem>
            )}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={DialogButtonStyle}
          disabled={submitLoading || groupsLoading}
        >
          確認分配
        </Button>
      </DialogActions>
    </Dialog>
  );
}