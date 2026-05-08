"use client";
import { useGetAllLeadersWithGroupQuery } from "@/redux/rtk/socialWorkerLeaderApi";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { tableContainerStyle, tableCellHeight, tableNoneBorder, tableHeadNoneSelected, TablePaginationStyle } from "@/component/styles/tableStyle";
import { useState } from "react";
import EmailIcon from "@mui/icons-material/Email";
import SearchBar from "@/app/case_overview/search_input";
import { useRouter } from "next/navigation"; // 使用 Next.js 的 useRouter

export default function GroupList() {
  const { data: leadersWithGroup, isLoading: leadersLoading } = useGetAllLeadersWithGroupQuery();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchKeyword, setSearchKeyword] = useState("");
  const router = useRouter(); // 初始化 useRouter

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setPage(0);
  };

  if (leadersLoading) {
    return <Box>載入中...</Box>;
  }

  const handleRowClick = (leaderId: string) => {
    // 跳轉到 basic_worker 頁面並傳遞 leaderId 作為查詢參數
    router.push(`/account_manage/basic_worker/${leaderId}`);
  };

  return (
    <>
      <Box>
        <SearchBar onSearch={handleSearch} />
        <br />

        <TableContainer sx={tableContainerStyle}>
          <Table sx={tableCellHeight}>
            <TableHead sx={tableNoneBorder}>
              <TableRow sx={tableHeadNoneSelected}>
                <TableCell>姓名</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>社工 ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leadersWithGroup?.map((leader) => (
                <TableRow
                  key={leader.socialWorkerId}
                  hover
                  onClick={() => handleRowClick(leader.socialWorkerId)} // 點擊行時觸發跳轉
                  sx={{
                    "& .MuiTableCell-root": {
                      borderBottom: "1px dashed rgba(224, 224, 224, 1)",
                      cursor: "pointer",
                    },
                  }}
                >
                  <TableCell sx={{ fontWeight: "bold" }}>{leader.socialWorkerName}</TableCell>
                  <TableCell>
                    <EmailIcon sx={{ fontSize: "20px", color: "#34C759", mr: 1 }} />
                    {leader.socialWorkerEmail}
                  </TableCell>
                  <TableCell>{leader.socialWorkerId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={leadersWithGroup.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => setRowsPerPage(Number.parseInt(e.target.value, 10))}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="每頁行數"
            sx={TablePaginationStyle}
          />
        </TableContainer>
      </Box>
    </>
  );
}