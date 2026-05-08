/* eslint-disable */
"use client";
import type React from "react";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
  TablePagination,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { useGetAllAudioFilesByCaseQuery } from "@/redux/rtk/audioApi";
import AddFileButton from "./addFileButton";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import CachedRoundedIcon from "@mui/icons-material/CachedRounded";
import ErrorIcon from "@mui/icons-material/Error";
import Loading from "@/component/text/loading";
import SearchBar from "../case_overview/search_input";
import {
  tableContainerStyle,
  tableCellHeight,
  tableNoneBorder,
  tableHeadNoneSelected,
  TablePaginationStyle,
} from "@/component/styles/tableStyle";
import { cleanAndTruncate } from "@/utils/textCleanerUtils";

interface FileTableProps {
  caseInfoId: string;
}

type Status = 'COMPLETE'|'UNCOMPLETE'|'ERROR'

const FileTable: React.FC<FileTableProps> = ({ caseInfoId }) => {
  const [cookies] = useCookies();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const router = useRouter();
  const [socialWorkerEmail, setSocialWorkerEmail] = useState<string | undefined>(undefined);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    if (cookies && cookies.user) {
      setSocialWorkerEmail(cookies.user);
    }
  }, [cookies]);

  if (!caseInfoId) return <p>無法讀取 caseInfoId，請檢查網址</p>;

  const {
    data: audioFiles,
    isLoading,
    refetch,
  } = useGetAllAudioFilesByCaseQuery(
    {
      socialWorkerEmail: socialWorkerEmail || "",
      caseInfoId,
      filter: { page: page, size: rowsPerPage, query: searchKeyword },
    },
    { skip: !socialWorkerEmail },
  );

  // 當 caseInfoId 變更時，自動刷新 API
  useEffect(() => {
    if (caseInfoId && socialWorkerEmail) {
      refetch();
    }
  }, [caseInfoId, refetch, socialWorkerEmail]);

  // 確保資料有拿到
  const fileList = audioFiles?.rows ?? [];
  if (isLoading) return <Loading isAudioText={false} />;

  const getStatusChip = (status: Status) => {
    switch (status) {
      case 'COMPLETE':
        return (
          <Chip
            icon={<DoneRoundedIcon />}
            label="完成"
            sx={{ bgcolor: (theme) => theme.palette.green.main, color: "#fff", fontWeight: "bold" }}
          />
        );
      case 'UNCOMPLETE':
        return (
          <Chip
            icon={<CachedRoundedIcon />}
            label="處理中"
            sx={{ bgcolor: (theme) => theme.palette.warning.main, color: "#fff", fontWeight: "bold" }}
          />
        );
      case 'ERROR':
        return (
          <Chip
            icon={<ErrorIcon />}
            label="錯誤"
            sx={{ bgcolor: (theme) => theme.palette.danger.main, color: "#fff", fontWeight: "bold" }}
          />
        );
      default:
        return <Chip label="未知" sx={{ bgcolor: "#ccc", color: "#000" }} />;
    }
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  // 導向 case_file
  const handleRowClick = (fileId: number, fileName: string) => {
    router.push(`/case_file/${caseInfoId}/${fileId}?fileName=${encodeURIComponent(fileName)}`);
  };

  return (
    <>
      <Box sx={{ padding: 2, display: "flex", justifyContent: "flex-end" }}>
        <SearchBar onSearch={handleSearch} />
        <AddFileButton caseInfoId={caseInfoId} onFileAdded={refetch} />
      </Box>

      <TableContainer sx={tableContainerStyle}>
        <Table sx={tableCellHeight}>
          <TableHead sx={tableNoneBorder}>
            <TableRow sx={tableHeadNoneSelected}>
              <TableCell>日期</TableCell>
              <TableCell>檔案名稱</TableCell>
              <TableCell>摘要</TableCell>
              <TableCell>全文</TableCell>
              <TableCell>時長</TableCell>
              <TableCell>狀態</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fileList.length > 0 ? (
              fileList.map((row) => (
                <TableRow
                  key={row.fileId}
                  hover
                  onClick={() => handleRowClick(row.fileId, row.fileName)}
                  sx={{
                    "& .MuiTableCell-root": {
                      borderBottom: "1px dashed rgba(224, 224, 224, 1)",
                      cursor: "pointer",
                    },
                  }}
                >
                  <TableCell>{row.createTime}</TableCell>
                  <TableCell>{row.fileName}</TableCell>
                  <TableCell>{cleanAndTruncate(row.summary, 20)}</TableCell>
                  <TableCell>{cleanAndTruncate(row.totalText, 20)}</TableCell>
                  <TableCell>{row.duration}</TableCell>
                  <TableCell>{getStatusChip(row.status)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="textSecondary">無檔案資料</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={audioFiles?.total || 0}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => setRowsPerPage(Number.parseInt(e.target.value, 10))}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="每頁行數"
          sx={TablePaginationStyle}
        />
      </TableContainer>
    </>
  );
};

export default FileTable;