import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Typography } from "@mui/material";

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string | undefined;
}


export default function DeleteDialog({ open, onClose, onConfirm, title }: DeleteDialogProps) {

    const cancelstyle = (theme) => ({
        padding: "10px 20px",
        backgroundColor: theme.palette.danger.main, // ✅ 直接使用 theme
        color: "white",
        "&:hover": {
            backgroundColor: theme.palette.danger.dark, // ✅ 直接使用 theme
        },
    });
    

  const editstyle = {
    backgroundColor: "#f0f0f2",
    color: "black",
    padding: "10px 20px",
    "&:hover": {
        backgroundColor: "#e0e0e2", 
    },
  }

  return <>
  
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth  PaperProps={{ sx: { padding: 3 } }}>
      <DialogTitle sx={{fontWeight: 'bold'}}>確認刪除<span style={{color: 'red'}}>{title}</span>？</DialogTitle>
      <DialogContent>
        <DialogContentText>檔案刪除後無法回復。</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" sx={editstyle}>取消</Button>
        <Button onClick={onConfirm} sx={cancelstyle}>刪除</Button>
      </DialogActions>
    </Dialog>
  
    </>
  ;
}
