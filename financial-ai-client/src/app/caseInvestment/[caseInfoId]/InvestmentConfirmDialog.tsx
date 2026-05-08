import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Typography, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { DialogButtonStyleDanger, DialogContentPadding, DialogTitleStyle } from "@/component/styles/dialogStyles";
interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}


export default function InvestmentConfirmDialog({ open, onClose, onConfirm }: ConfirmDialogProps) {

  return <>

    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { padding: 3 } }}>
      <DialogTitle sx={DialogTitleStyle}>

        您確認要刪除資訊嗎？

        <IconButton sx={{ marginLeft: 'auto' }} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
  
      <DialogContent sx={DialogContentPadding}>
        <DialogContentText>數據刪除後無法回復</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} sx={DialogButtonStyleDanger}>刪除</Button>
      </DialogActions>
    </Dialog>

  </>
}
