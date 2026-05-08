/* eslint-disable @typescript-eslint/no-unused-vars */
import CaseInvestmentArea from "@/component/caseInvestment/caseInvestmentArea";
import {  bondList } from "@/component/column/columnList";
import { useAlert } from "@/layout/context/alertProvider";
import { useCreateBondMutation, useDeleteBondMutation } from "@/redux/rtk/bondApi";
import DeleteIcon from "@mui/icons-material/Delete";
import { CaseInfoProps, refreshPage } from "@/type/common/common";
import { ErrorType } from "@/type/dto/dto";
import { handleError } from "@/utils/config";
import { ChangeEvent, useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Typography, Box, IconButton, Checkbox, TablePagination,
    Tooltip
} from "@mui/material";
import { tableContainerStyle, tableCellHeight, tableNoneBorder, tableHeadSelected, tableHeadNoneSelected, TablePaginationStyle } from "@/component/styles/tableStyle";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import InvestmentConfirmDialog from "../InvestmentConfirmDialog";
import BondEditDialog from "./bondEditDialog";

export default function BondArea(caseInfoProps: CaseInfoProps) {
  const caseInfoId=caseInfoProps.params.caseInfoId
  const [cookies]=useCookies()
  
  const {showAlert}=useAlert()
  const [createBond]=useCreateBondMutation()
  const handler=async(data:any)=>{
    try {
      await createBond({
        socialWorkerEmail:cookies.user,
        caseInfoId:caseInfoId,
        ...data
      }).unwrap()
      showAlert("操作成功！", "success")
      
    } catch (error) {
      showAlert(handleError(error as ErrorType), "error");
    }
  }

  const [selected, setSelected] = useState<number[]>([]);
    const isAllSelected = selected.length > 0 && selected.length === caseInfoProps.bondList?.length;
    const isIndeterminate = selected.length > 0 && selected.length < (caseInfoProps.bondList?.length || 0);
    const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
            if (event.target.checked) {
                const newSelected = caseInfoProps.bondList?.map((row) => row.bondId) || [];
                setSelected(newSelected);
            } else {
                setSelected([]);
            }
        };
    const handleClick = (bondId: number) => {
      setSelected((prev) => prev.includes(bondId) ? prev.filter(item => item !== bondId) : [...prev, bondId]);
    };
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { control,setValue} = useForm();
    const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);
    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
  
    const [deleteBond] = useDeleteBondMutation()
    
    const handleDeleteConfirmed = async () => {
      try {
          // 使用 Promise.allSettled 來處理多筆刪除
          const results = await Promise.allSettled(
              selected.map(bondId =>
                deleteBond({
                      socialWorkerEmail: cookies.user,
                      caseInfoId,
                      bondId,
                  })
                      .then(() => ({ bondId, status: 'success' }))  // 成功時返回 bondId 和狀態
                      .catch(() => ({ bondId, status: 'failure' }))  // 失敗時返回 bondId 和狀態
              )
          );
  
          // 檢查是否有任何刪除失敗
          const failedDeletes = results.filter(result => result.status === 'rejected' || result.value.status === 'failure');
          
          if (failedDeletes.length > 0) {
              showAlert("部分刪除失敗，請重試", "error");
          } else {
              showAlert("刪除成功", "success");
          }
  
          setSelected([]);  // 清空已選擇的項目
      } catch (error) {
          // 捕獲並顯示異常錯誤
          showAlert("刪除過程中發生錯誤", "error");
      } finally {
          setConfirmDialogOpen(false);  // 關閉確認對話框
      }
  };

  return (
    <>
        <CaseInvestmentArea
        handle={handler}
        caseInvestMentList={bondList}
        // resetForm={reset}
        />
        <TableContainer sx={tableContainerStyle}>
                <Table sx={tableCellHeight}>
                    <TableHead sx={tableNoneBorder}>
                        {selected.length > 0 ? (
                            <TableRow sx={tableHeadSelected}>
                                <TableCell padding="checkbox" sx={{ width: 48 }}>
                                    <Checkbox indeterminate={isIndeterminate} checked={isAllSelected} onChange={handleSelectAllClick} />
                                </TableCell>
                                <TableCell colSpan={5}>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <Typography color="primary" fontWeight="bold">{selected.length} selected</Typography>
                                        <Tooltip title="刪除">
                                            <IconButton color="primary" size="small" onClick={() => setConfirmDialogOpen(true)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            <TableRow sx={tableHeadNoneSelected}>
                                <TableCell padding="checkbox" sx={{ width: 48 }}>
                                    <Checkbox indeterminate={isIndeterminate} checked={isAllSelected} onChange={handleSelectAllClick} />
                                </TableCell>
                                <TableCell>債券名稱</TableCell>
                                <TableCell>公司名稱</TableCell>
                                <TableCell>金額</TableCell>
                                <TableCell>購買日期</TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        )}
                    </TableHead>
                    <TableBody>
                        {caseInfoProps.bondList && caseInfoProps.bondList.length > 0 ? (
                            caseInfoProps.bondList
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                    <TableRow
                                        key={`${row.bondId}`}
                                        selected={selected.includes(row.bondId)}
                                        sx={{
                                            '& .MuiTableCell-root': {
                                                borderBottom: '1px dashed rgba(224, 224, 224, 1)',
                                                backgroundColor: selected.includes(row.bondId)
                                                    ? (theme) => theme.palette.primary.lighter
                                                    : '#ffffff',
                                            },
                                        }}
                                    >
                                        <TableCell padding="checkbox" sx={{ width: 48 }} onClick={(e) => e.stopPropagation()}>
                                            <Checkbox
                                                checked={selected.includes(row.bondId)}
                                                onChange={() => handleClick(row.bondId)}
                                            />
                                        </TableCell>
                                        <TableCell>{row.bondName}</TableCell>
                                        <TableCell>{row.companyName}</TableCell>
                                        <TableCell sx={{ color: "#3763aa" }}>$ {row.money}</TableCell>
                                        <TableCell>{row.applyTime.toString()}</TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="編輯">
                                                <BondEditDialog setValue={setValue} bondResponse={row} />
                                            </Tooltip>
                                        </TableCell>
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
                    count={caseInfoProps.bondList?.length || 0}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="每頁行數"
                    rowsPerPageOptions={[5, 10, 25]}
                    sx={TablePaginationStyle}
                />
            </TableContainer>
            <InvestmentConfirmDialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                onConfirm={handleDeleteConfirmed}
            />
    </>
  );
}
