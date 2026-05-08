import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Box } from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}


export default function ConfirmDialog({ open, onClose, onConfirm, title }: ConfirmDialogProps) {

  const cancelstyle = {
    padding: "10px 20px"
  }

  const editstyle = {
    backgroundColor: "#f0f0f2",
    color: "black",
    padding: "10px 20px"
  }

  return <>
  
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth  PaperProps={{ sx: { padding: 3 } }}>
      <DialogTitle sx={{fontWeight: 'bold'}}>確認取消編輯{title}？</DialogTitle>
      <DialogContent>
        <DialogContentText>您的文字變更將不會被儲存，確定要取消嗎？</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" sx={editstyle}>繼續編輯</Button>
        <Button onClick={onConfirm} sx={cancelstyle}>取消編輯</Button>
      </DialogActions>
    </Dialog>
  
    </>
  ;
}
