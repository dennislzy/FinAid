import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { DialogTitleStyle, DialogButtonStyleDanger, DialogContentPadding } from "@/component/styles/dialogStyles";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function TransitConfirmDialog({ open, onClose, onConfirm, title, message }: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { padding: 3 } }}>
      <DialogTitle sx={DialogTitleStyle}>
        {title}
        <IconButton sx={{ marginLeft: 'auto' }} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={DialogContentPadding}>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} sx={DialogButtonStyleDanger}>確定</Button>
      </DialogActions>
    </Dialog>
  );
}