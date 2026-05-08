import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Select, FormControl, Box, Typography, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { DialogTitleStyle, inputstyle, DialogButtonStyle, DialogSelectedStyle, DialogContentPadding } from "../../component/styles/dialogStyles";
interface InsuranceAddProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { familyMember: string; insuranceType: string; amount: number; annualPremium: number; insuranceId: number; insuranceCompanyName: string }) => void;
  editData?: { familyMember: string; insuranceType: string; amount: number; annualPremium: number; insuranceId: number; insuranceCompanyName: string } | null;
}


export default function InsuranceAddDialog({ open, onClose, onSubmit, editData }: InsuranceAddProps) {
  const [familyMember, setFamilyMember] = useState("");
  const [insuranceCompanyName, setInsuranceCompanyName] = useState("");
  const [insuranceType, setInsuranceType] = useState("壽險");
  const [amount, setAmount] = useState<number | "">("");
  const [annualPremium, setAnnualPremium] = useState<number | "">("");
  const [insuranceId, setInsuranceId] = useState<number | "">("");


  // 監聽 open & editData，填充編輯數據
  useEffect(() => {
    if (open) {
      if (editData) {
        setFamilyMember(editData.familyMember);
        setInsuranceType(editData.insuranceType);
        setAmount(editData.amount);
        setAnnualPremium(editData.annualPremium);
        setInsuranceId(editData.insuranceId);
        setInsuranceCompanyName(editData.insuranceCompanyName)

      } else {
        setFamilyMember("");
        setInsuranceType("壽險");
        setAmount("");
        setAnnualPremium("");
        setInsuranceId("");
        setInsuranceCompanyName("")


      }
    }
  }, [open, editData]);

  const handleSubmit = () => {
    if (!familyMember.trim()) {
      alert("請輸入成員名稱");
      return;
    }
    if (amount === "" || amount <= 0) {
      alert("請輸入正確的金額");
      return;
    }
    if (annualPremium === "" || annualPremium < 0) {
      alert("請輸入正確的年保費");
      return;
    }

    onSubmit({
      familyMember,
      insuranceType,
      amount: Number(amount),
      annualPremium: Number(annualPremium),
      insuranceId: Number(insuranceId),
      insuranceCompanyName
    });

    onClose(); // ✅ 關閉 Dialog
  };


  const label = {
    mt: 1,
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { padding: 3 } }}>
      <DialogTitle sx={DialogTitleStyle}>

        {editData ? "編輯保險資料" : "新增保險資料"}

        <IconButton sx={{ marginLeft: 'auto' }} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={DialogContentPadding}>
        <Typography variant="body1" sx={label}>成員名稱</Typography>
        <Typography variant="caption" color="warning">
          * 成員名稱無法修改，如需更改請刪除並重新新增。
        </Typography>

        <FormControl fullWidth margin="normal">
          <TextField
            variant="outlined"
            placeholder="ex.爸爸"
            value={familyMember}
            onChange={(e) => setFamilyMember(e.target.value)}
            sx={inputstyle}
            disabled={!!editData}
          />
        </FormControl>

        <Typography variant="body1" sx={label}>公司名稱</Typography>
        <FormControl fullWidth margin="normal">
          <TextField
            variant="outlined"
            placeholder="ex.國泰壽險"
            value={insuranceCompanyName}
            onChange={(e) => setInsuranceCompanyName(e.target.value)}
            sx={inputstyle}
            // disabled={!!editData}
          />
        </FormControl>

        <Typography variant="body1" sx={label}>保險險種</Typography>
        <FormControl fullWidth margin="normal">
          <Select
            value={insuranceType}
            aria-placeholder="險種選擇"
            onChange={(e) => setInsuranceType(e.target.value)}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            sx={DialogSelectedStyle}
          >
            <MenuItem value="壽險">壽險</MenuItem>
            <MenuItem value="意外險">意外險</MenuItem>
            <MenuItem value="醫療險">醫療險</MenuItem>
          </Select>
        </FormControl>

        <Typography variant="body1" sx={label}>項目金額</Typography>
        <FormControl fullWidth margin="normal">
          <TextField
            variant="outlined"
            type="number"
            placeholder="ex.1500"
            value={amount ?? ""}
            onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
            sx={inputstyle}
          />
        </FormControl>
        <Typography variant="body1" sx={label}>年保費</Typography>
        <FormControl fullWidth margin="normal">
          <TextField
            variant="outlined"
            type="number"
            placeholder="ex.1500"
            value={annualPremium ?? ""}
            onChange={(e) => setAnnualPremium(e.target.value === "" ? "" : Number(e.target.value))}
            sx={inputstyle}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} variant="contained" sx={DialogButtonStyle}>
          {editData ? "編輯" : "新增"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
