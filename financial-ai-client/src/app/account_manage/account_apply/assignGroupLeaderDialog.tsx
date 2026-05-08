"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { DialogTitleStyle, DialogButtonStyle, DialogContentPadding } from "@/component/styles/dialogStyles";
import { useAssignSocialWorkerToGroupMutation } from "@/redux/rtk/socialWorkerLeaderApi";

interface AssignGroupLeaderDialogProps {
  open: boolean;
  onClose: () => void;
  worker: { socialWorkerId: string; socialWorkerName: string } | null;
}

export default function AssignGroupLeaderDialog({ open, onClose, worker }: AssignGroupLeaderDialogProps) {
  const [assignSocialWorkerToGroup, { isLoading: submitLoading }] = useAssignSocialWorkerToGroupMutation();

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    if (!worker) {
      alert("無效的社工資料");
      return;
    }

    try {
      const request = {
        socialWorkerId: worker.socialWorkerId,
        // 不傳 groupId，因為後端會為新的督導社工建立一個新組別
      };
      const response = await assignSocialWorkerToGroup(request).unwrap();
      alert(`新組別建立成功: ${response.message || JSON.stringify(response)}`);
      handleClose();
    } catch (error) {
      console.error("建立新組別失敗:", error);
      alert("建立新組別失敗，請稍後再試");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { padding: 3 } }}>
      <DialogTitle sx={DialogTitleStyle}>
        為新督導社工建立組別
        <IconButton sx={{ marginLeft: 'auto' }} onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={DialogContentPadding}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          即將為督導社工 <strong>{worker?.socialWorkerName}</strong> 建立一個新的組別。
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          確認後，系統將自動為該社工分配一個新組別。
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={DialogButtonStyle}
          disabled={submitLoading}
        >
          確認申請
        </Button>
      </DialogActions>
    </Dialog>
  );
}