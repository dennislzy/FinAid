/* eslint-disable */
"use client";
import { useState, useEffect } from "react";
import type React from "react";
import Box from "@mui/material/Box";
import { Button, Tabs, Tab, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useGetAudioFileByIdQuery, useDeleteAudioFileMutation } from "@/redux/rtk/audioApi";
import { useCookies } from "react-cookie";
import { useAlert } from "@/layout/context/alertProvider";
import { useAudioFile } from "./useAudioFile";
import SummaryContent from "./summaryContent";
import TotalTextContent from "./totalTextContent";
import AudioContent from "./audioContent";
import DeleteDialog from "./deleteDialog";
import ActionButtons from "./action-buttons";
import { InsideBox } from "@/component/styles/outerBoxStyle";
import { inputstyle } from "@/component/styles/dialogStyles";

interface FileIdProps {
  caseInfoId: string;
  fileId: number;
  filename: string | undefined;
  onFileNameUpdate?: (newFileName: string) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function CaseFileContent({ caseInfoId, fileId, filename, onFileNameUpdate }: FileIdProps) {
  const [cookies] = useCookies();
  const { showAlert } = useAlert();
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [isEditingFileName, setIsEditingFileName] = useState(false);
  const [editedFileName, setEditedFileName] = useState("");
  const [displayFileName, setDisplayFileName] = useState("");

  const { data: caseFile, refetch } = useGetAudioFileByIdQuery({
    socialWorkerEmail: cookies.user,
    caseInfoId,
    fileId,
  });

  useEffect(() => {
    if (caseFile?.fileName) {
      setDisplayFileName(caseFile.fileName);
    } else if (filename) {
      setDisplayFileName(filename);
    }
  }, [caseFile, filename]);

  const { updateFile, updateFileName, downloadSummaryPdf, downloadFullTextPdf, regenerateSummary, isRegenerating } = useAudioFile(
    caseInfoId,
    fileId,
    filename
  );

  const [showDeleteOpen, setShowDeleteOpen] = useState(false);
  const [deleteAudioFile] = useDeleteAudioFileMutation();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setIsEditing(false);
    if (newValue === 3) {
      refetch();
    }
  };

  const handleEdit = () => {
    if (tabValue === 0 || tabValue === 1) {
      setIsEditing(true);
    }
  };

  const handleDownload = () => {
    if (tabValue === 0) {
      downloadSummaryPdf(caseFile?.summary as string);
    } else if (tabValue === 1) {
      downloadFullTextPdf(caseFile?.totalText as string);
    }
  };

  const handleRegenerate = async () => {
    if (tabValue === 0) {
      await regenerateSummary();
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteAudioFile({
        socialWorkerEmail: cookies.user,
        caseInfoId,
        fileId,
      });
      const responseData = response?.data?.message || response;
      showAlert("刪除成功", "success");
      setTimeout(() => {
        window.location.href = `/file/${caseInfoId}`;
      }, 500);
    } catch (error) {
      if (error?.originalStatus === 200) {
        showAlert("檔案已成功刪除", "success");
        setTimeout(() => {
          window.location.href = `/case/${caseInfoId}`;
        }, 500);
        return;
      }
      showAlert("⚠️ 刪除失敗，請稍後再試", "error");
    }
  };

  const handleEditFileName = () => {
    setEditedFileName(displayFileName);
    setIsEditingFileName(true);
  };

  const handleSaveFileName = async () => {
    try {
      if (!editedFileName.trim()) {
        showAlert("檔案名稱不能為空", "error");
        return;
      }
      await updateFileName(editedFileName);
      setDisplayFileName(editedFileName);
      if (onFileNameUpdate) {
        onFileNameUpdate(editedFileName);
      }
      showAlert("檔案名稱已更新", "success");
      refetch();
      setIsEditingFileName(false);
    } catch (error) {
      console.error("更新檔案名稱失敗:", error);
    }
  };

  const handleCancelEditFileName = () => {
    setIsEditingFileName(false);
  };

  const tabStyle = {
    textTransform: "none",
    fontWeight: 500,
    px: 2,
    py: 1,
    color: "#666",
    "&.Mui-selected": {
      color: "#000",
      fontWeight: 600,
      backgroundColor: "transparent",
    },
    "&:hover": {
      color: "#000",
      backgroundColor: "transparent",
    },
  };

  return (
    <>
      <Box sx={InsideBox}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="content tabs"
          sx={{
            paddingTop: 1,
            marginBottom: 0,
            borderBottom: "3px solid #f6f7f8",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: "medium",
              fontSize: "1rem",
              minWidth: 100,
            },
            "& .Mui-selected": {
              fontWeight: "bold",
            },
            "& .MuiTabs-indicator": {
              height: 3,
              backgroundColor: "black",
            },
          }}
        >
          <Tab label="摘要" {...a11yProps(0)} sx={tabStyle} disableRipple disableFocusRipple />
          <Tab label="全文" {...a11yProps(1)} sx={tabStyle} disableRipple disableFocusRipple />
          <Tab label="錄音檔" {...a11yProps(2)} sx={tabStyle} disableRipple disableFocusRipple />
          <Tab label="操作" {...a11yProps(3)} sx={tabStyle} disableRipple disableFocusRipple />
        </Tabs>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: 2 }}>
          <ActionButtons
            onEdit={handleEdit}
            onDownload={handleDownload}
            onRegenerate={handleRegenerate}
            tabValue={tabValue}
            showEdit={!isEditing}
            isRegenerating={isRegenerating}
          />
        </Box>

        <TabPanel value={tabValue} index={0}>
          <SummaryContent
            summary={caseFile?.summary || ""}
            updateFile={updateFile}
            downloadSummaryPdf={() => downloadSummaryPdf(caseFile?.summary as string)}
            isEditingFromParent={isEditing}
            onEditComplete={() => setIsEditing(false)}
            isRegenerating={isRegenerating} // ✅ 傳遞
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TotalTextContent
            totalText={caseFile?.totalText || ""}
            updateFile={updateFile}
            downloadFullTextPdf={() => downloadFullTextPdf(caseFile?.totalText as string)}
            isEditingFromParent={isEditing}
            onEditComplete={() => setIsEditing(false)}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ padding: 2 }}>
            <AudioContent
              fileName={caseFile?.fileName as string}
              caseInfoId={caseInfoId}
              fileId={caseFile?.fileId}
              socialWorkerEmail={cookies.user}
              duration={caseFile?.duration}
            />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Box sx={{ padding: 2 }}>
            {isEditingFileName ? (
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <TextField
                  variant="outlined"
                  value={editedFileName}
                  onChange={(e) => setEditedFileName(e.target.value)}
                  sx={inputstyle}
                  autoFocus
                  placeholder="請輸入檔案名稱"
                />
                <Button onClick={handleSaveFileName}>儲存</Button>
                <Button
                  onClick={handleCancelEditFileName}
                  sx={{
                    backgroundColor: (theme) => theme.palette.gray,
                    color: "black",
                    "&:hover": { backgroundColor: (theme) => theme.palette.gray },
                  }}
                >
                  取消
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <TextField variant="outlined" value={displayFileName} sx={inputstyle} disabled />
                <IconButton onClick={handleEditFileName}>
                  <EditIcon />
                </IconButton>
              </Box>
            )}
            <br />
            <br />
            <Button
              onClick={() => setShowDeleteOpen(true)}
              sx={{
                backgroundColor: (theme) => theme.palette.danger.main,
                color: "white",
                "&:hover": { backgroundColor: (theme) => theme.palette.danger.dark },
              }}
            >
              <DeleteIcon />
              刪除此檔案
            </Button>
          </Box>
        </TabPanel>
      </Box>

      <DeleteDialog
        open={showDeleteOpen}
        onClose={() => setShowDeleteOpen(false)}
        onConfirm={handleDelete}
        title={caseFile?.fileName}
      />
    </>
  );
}