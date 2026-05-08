"use client";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";
import Box from "@mui/material/Box";

interface ActionButtonsProps {
  onEdit: () => void;
  onDownload: () => void;
  onRegenerate: () => void;
  tabValue: number;
  showEdit?: boolean;
  isRegenerating?: boolean;
}

export default function ActionButtons({
  onEdit,
  onDownload,
  onRegenerate,
  tabValue,
  showEdit = true,
  isRegenerating = false,
}: ActionButtonsProps) {
  // 如果是錄音檔或操作標籤，不顯示按鈕
  if (tabValue === 2 || tabValue === 3) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      {showEdit && (
        <Button
          onClick={onEdit}
          sx={{
            backgroundColor: (theme) => theme.palette.gray.main,
            color: "#1c2521",
            "&:hover": { backgroundColor: (theme) => theme.palette.gray.dark },
          }}
        >
          <EditIcon />
          編輯
        </Button>
      )}
      <Button
        onClick={onDownload}
        sx={{
          backgroundColor: (theme) => theme.palette.gray.main,
          color: "#1c2521",
          "&:hover": { backgroundColor: (theme) => theme.palette.gray.dark },
        }}
      >
        <DownloadIcon />
        下載成PDF
      </Button>
      {tabValue === 0 && (
        <Button
          onClick={onRegenerate}
          disabled={isRegenerating} // ✅ 禁用
          sx={{
            backgroundColor: (theme) => theme.palette.gray.main,
            color: "#1c2521",
            "&:hover": { backgroundColor: (theme) => theme.palette.gray.dark },
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <RefreshIcon />
          {isRegenerating ? "正在產生摘要..." : "重新產生摘要"} {/* ✅ 動態文字 */}
        </Button>
      )}
    </Box>
  );
}