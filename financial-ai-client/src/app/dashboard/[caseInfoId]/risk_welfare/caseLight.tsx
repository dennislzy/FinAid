'use client';

import { Box, IconButton, Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { useState } from "react";

interface CaseLightProps {
  caseInfoId: string;
  light?: string;
}

export default function CaseLight({ caseInfoId, light }: CaseLightProps) {
  const [open, setOpen] = useState(false);

  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);

  // 根據 light 屬性決定顏色
  const getColor = (lightValue?: string) => {
    if (lightValue === "Green") return "#4caf50";
    if (lightValue === "Red") return "#ff5630";
    if (lightValue === "Orange") return "#FFA500";
    return "#000000"; // 預設顏色，若 light 無效
  };

  const color = getColor(light);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0, mt: 2 }}>
      <Typography variant="h6" sx={{ fontSize: "1.2rem", fontWeight: "bold" }}>
        個案風險狀況：
      </Typography>
      <IconButton>
        <LightbulbIcon sx={{ color: color }} />
      </IconButton>

      {/* <Dialog open={open} onClose={handleClose}>
        <DialogTitle>風險狀況詳情</DialogTitle>
        <DialogContent>
          <Typography>這是 年度 {caseInfoId} 的風險狀況詳細資訊。</Typography>
        </DialogContent>
      </Dialog> */}
    </Box>
  );
}