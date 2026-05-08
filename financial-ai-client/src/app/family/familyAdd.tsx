import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem,
  Select, FormControl, Box, Typography, IconButton, Checkbox, FormControlLabel
} from "@mui/material";
import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import {
  DialogTitleStyle, inputstyle, DialogButtonStyle,
  DialogSelectedStyle, DialogContentPadding
} from "../../component/styles/dialogStyles";
import { FamilyMemberResponse } from "@/type/entity/entityType";



interface FamilyDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editData?: FamilyMemberResponse | null;
}

export default function FamilyMemberDialog({ open, onClose, onSubmit, editData }: FamilyDialogProps) {
  const [memberId, setMemberId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [relationshipToCase, setRelationshipToCase] = useState("");
  const [income, setIncome] = useState(false);
  const [yearSalary, setYearSalary] = useState<number | "">("");
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (open) {
      if (editData) {
        setMemberId(editData.memberId);
        setName(editData.name);
        setRelationshipToCase(editData.relationshipToCase);
        setIncome(editData.income);
        setYearSalary(editData.yearSalary ?? "");
        setSupported(editData.supported);
      } else {
        setMemberId(null);
        setName("");
        setRelationshipToCase("");
        setIncome(false);
        setYearSalary("");
        setSupported(false);
      }
    }
  }, [open, editData]);

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("請輸入姓名");
      return;
    }

    if (!relationshipToCase) {
      alert("請選擇與個案的關係");
      return;
    }

    if (income && (yearSalary === "" || yearSalary < 0)) {
      alert("請輸入正確的平均年收入");
      return;
    }

    onSubmit({
      name,
      relationshipToCase,
      income,
      yearSalary: income ? Number(yearSalary) : undefined,
      supported,
      ...(memberId !== null && { memberId })
    });

    onClose();
  };

  const label = {
    mt: 1,
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { padding: 3 } }}>
      <DialogTitle sx={DialogTitleStyle}>
        {editData ? "編輯家庭成員" : "新增家庭成員"}
        <IconButton sx={{ marginLeft: 'auto' }} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={DialogContentPadding}>
        <Typography variant="body1" sx={label}>姓名</Typography>
        <FormControl fullWidth margin="normal">
          <TextField
            variant="outlined"
            placeholder="ex.王小明"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={inputstyle}
          />
        </FormControl>

        <Typography variant="body1" sx={label}>與個案關係</Typography>
        <FormControl fullWidth margin="normal">
          <Select
            value={relationshipToCase}
            onChange={(e) => setRelationshipToCase(e.target.value)}
            displayEmpty
            sx={DialogSelectedStyle}
          >
            <MenuItem value="">請選擇</MenuItem>
            <MenuItem value="父親">父親</MenuItem>
            <MenuItem value="母親">母親</MenuItem>
            <MenuItem value="配偶">配偶</MenuItem>
            <MenuItem value="祖父母">祖父母</MenuItem>
            <MenuItem value="小孩">小孩</MenuItem>
            <MenuItem value="親戚">親戚</MenuItem>
            <MenuItem value="其他">其他</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              checked={income}
              onChange={(e) => setIncome(e.target.checked)}
            />
          }
          label="是否有穩定收入"
        />

        {income && (
          <>
            <Typography variant="body1" sx={label}>平均年收入</Typography>
            <FormControl fullWidth margin="normal">
              <TextField
                type="number"
                placeholder="ex.300000"
                variant="outlined"
                value={yearSalary ?? ""}
                onChange={(e) => setYearSalary(e.target.value === "" ? "" : Number(e.target.value))}
                sx={inputstyle}
              />
            </FormControl>
          </>
        )}

        <FormControlLabel
          control={
            <Checkbox
              checked={supported}
              onChange={(e) => setSupported(e.target.checked)}
            />
          }
          label="是否實際由個案扶養"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleSubmit} variant="contained" sx={DialogButtonStyle}>
          {editData ? "儲存變更" : "新增"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
