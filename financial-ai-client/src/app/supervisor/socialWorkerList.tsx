/* eslint-disable */
"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  TablePagination,
  Chip,
} from "@mui/material";
import { useCookies } from "react-cookie";
import SearchBar from "../case_overview/search_input";
import {
  tableContainerStyle,
  tableCellHeight,
  tableNoneBorder,
  tableHeadNoneSelected,
  TablePaginationStyle,
} from "@/component/styles/tableStyle";
import { useGetBasicSocialWorkersQuery } from "@/redux/rtk/socialWorkerLeaderApi";

const SocialWorkerList = () => {
  const [cookies] = useCookies(['socialWorkerId', 'user']);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [socialWorkerEmail, setSocialWorkerEmail] = useState<string | undefined>(undefined);
  const [searchKeyword, setSearchKeyword] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (cookies && cookies.user) {
      setSocialWorkerEmail(cookies.user);
    }
  }, [cookies]);

  const { data: socialWorkers, isLoading, error } = useGetBasicSocialWorkersQuery(cookies.socialWorkerId);

  const filteredWorkers = socialWorkers?.filter((worker) =>
    worker.socialWorkerName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    worker.socialWorkerEmail.toLowerCase().includes(searchKeyword.toLowerCase())
  ) || [];

  const paginatedWorkers = filteredWorkers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setPage(0);
  };

  if (isLoading) {
    return <Typography>載入中...</Typography>;
  }

  if (error) {
    return <Typography>載入社工資料時發生錯誤</Typography>;
  }

  console.log("現在督導的Id:",cookies.socialWorkerId)

  return (
    <>
      <Box sx={{mt: 4, mb: 4}}>
        <SearchBar onSearch={handleSearch} />
      </Box>

      <TableContainer sx={tableContainerStyle}>
        <Table sx={tableCellHeight}>
          <TableHead sx={tableNoneBorder}>
            <TableRow sx={tableHeadNoneSelected}>
              <TableCell>社工姓名</TableCell>
              <TableCell>社工電子郵件</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedWorkers.length > 0 ? (
              paginatedWorkers.map((worker) => (
                <TableRow
                  key={worker.socialWorkerEmail}
                  onClick={() => router.push(`/supervisor/caseList/${worker.socialWorkerEmail}`)}
                  hover
                  sx={{
                    "& .MuiTableCell-root": {
                      borderBottom: "1px dashed rgba(224, 224, 224, 1)",
                      cursor: "pointer",
                    },
                  }}
                >
                  <TableCell>{worker.socialWorkerName}</TableCell>
                  <TableCell>{worker.socialWorkerEmail}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography color="textSecondary">
                    {searchKeyword ? "無符合搜尋條件的社工" : "無社工資料"}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredWorkers.length}
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

export default SocialWorkerList;