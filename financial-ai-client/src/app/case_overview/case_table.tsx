/* eslint-disable */
"use client";
import React, { useState, ChangeEvent } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, Box, IconButton, Checkbox, TablePagination, Tooltip,
  Avatar
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useGetAllCasesQuery, useDeleteCaseMutation } from "@/redux/rtk/caseApi";
import { useCookies } from "react-cookie";
import { useAlert } from "@/layout/context/alertProvider";
import { useRouter } from "next/navigation";
import Loading from "@/component/text/loading";
import { tableContainerStyle, tableCellHeight, tableNoneBorder, tableHeadSelected, tableHeadNoneSelected, TablePaginationStyle } from "../../component/styles/tableStyle";

interface CaseTableProps {
  searchKeyword: string;
}

const CaseTable: React.FC<CaseTableProps> = ({ searchKeyword }) => {
  const router = useRouter();
  const [cookies] = useCookies();
  const { showAlert } = useAlert();
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [deleteCase] = useDeleteCaseMutation();

  const { data: result, isLoading, error, refetch } = useGetAllCasesQuery({
    socialWorkerEmail: cookies.user,
    
    query: searchKeyword,
  });

  // if (error) showAlert("無法載入個案資料", "error");
  if (isLoading) return <Loading isAudioText={false} />;

  const isAllSelected = selected.length > 0 && selected.length === result?.length;
  const isIndeterminate = selected.length > 0 && selected.length < (result?.length || 0);

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = result?.map((row) => row.caseInfoId) || [];
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (caseInfoId: string) => {
    setSelected((prev) =>
      prev.includes(caseInfoId) ? prev.filter((item) => item !== caseInfoId) : [...prev, caseInfoId]
    );
  };

  const handleRowClick = (caseInfoId: string) => {
    router.push(`/dashboard/${caseInfoId}`);
  };

  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await deleteCase({
        socialWorkerEmail: cookies.user,
        idList: selected,
      }).unwrap();
      showAlert("個案刪除成功", "success");
      refetch();
      setSelected([]);
    } catch (_) {
      showAlert("刪除失敗，請重試", "error");
    }
  };


  return (
    <TableContainer sx={tableContainerStyle}>
      <Table sx={tableCellHeight}>
        <TableHead sx={tableNoneBorder}>
          {selected.length > 0 ? (
            <TableRow sx={tableHeadSelected}>
              <TableCell padding="checkbox" sx={{ width: 48 }}>
                <Checkbox
                  indeterminate={isIndeterminate}
                  checked={isAllSelected}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell colSpan={5}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography color="primary" fontWeight="bold">
                    {selected.length} selected
                  </Typography>
                  <Tooltip title="刪除">
                    <IconButton color="primary" size="small" onClick={handleDeleteConfirmed}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            <TableRow sx={tableHeadNoneSelected}>
              <TableCell padding="checkbox" sx={{ width: 48 }}>
                <Checkbox
                  indeterminate={isIndeterminate}
                  checked={isAllSelected}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell>姓名</TableCell>
              <TableCell>性別</TableCell>
              <TableCell>生日</TableCell>
              <TableCell>地址</TableCell>
              <TableCell>建立時間</TableCell>
            </TableRow>
          )}
        </TableHead>
        <TableBody>
          {result && result.length > 0 ? (
            result
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow
                  key={row.caseInfoId}
                  selected={selected.includes(row.caseInfoId)}
                  onClick={() => handleRowClick(row.caseInfoId)}
                  sx={{
                    "& .MuiTableCell-root": {
                      borderBottom: "1px dashed rgba(224, 224, 224, 1)",
                      backgroundColor: selected.includes(row.caseInfoId)
                        ? (theme) => theme.palette.primary.lighter
                        : "#ffffff",
                    },
                    cursor: "pointer",
                  }}
                >
                  <TableCell padding="checkbox" sx={{ width: 48 }} onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selected.includes(row.caseInfoId)}
                      onChange={() => handleClick(row.caseInfoId)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                      <Avatar
                        alt="Case Photo"
                        src={row.caseInfoImage}           
                      />
                      <Box >
                        <Typography sx={{fontWeight: "bold"}}>{row.caseInfoName}</Typography>     
                        <Typography sx={{color: "#919eab"}}>{row.caseInfoEmail}</Typography>
                      </Box>

                    </Box>
                  </TableCell>
                  <TableCell >{row.caseInfoGender}</TableCell>
                  <TableCell>{row.caseInfoBirth.toString()}</TableCell>
                  <TableCell>{row.caseInfoAddress}</TableCell>
                  <TableCell>{row.caseInfoCreateTime}</TableCell>
                </TableRow>
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography color="textSecondary">無個案資料</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>

      </Table>
      <TablePagination
        component="div"
        count={result?.length || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="每頁行數"
        rowsPerPageOptions={[5, 10, 25]}
        sx={TablePaginationStyle}
      />
    </TableContainer>
  );
};

export default CaseTable;