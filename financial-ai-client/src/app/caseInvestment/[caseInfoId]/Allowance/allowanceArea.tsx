import CaseInvestmentArea from "@/component/caseInvestment/caseInvestmentArea";
import { allowanceInvestmentList, stockInvestmentList1 } from "@/component/column/columnList";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAlert } from "@/layout/context/alertProvider";
import { useCreateAllowanceMutation, useDeleteAllowanceMutation } from "@/redux/rtk/allowanceApi";
import { CaseInfoProps, refreshPage } from "@/type/common/common";
import { ErrorType } from "@/type/dto/dto";
import { handleError } from "@/utils/config";
import { ChangeEvent, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Typography, Box, IconButton, Checkbox, TablePagination,
    Tooltip
} from "@mui/material";
import { tableContainerStyle, tableCellHeight, tableNoneBorder, tableHeadSelected, tableHeadNoneSelected, TablePaginationStyle } from "@/component/styles/tableStyle";
import AllowanceEditDialog from "./allowanceEditDialog";
import InvestmentConfirmDialog from "../InvestmentConfirmDialog";

export default function AllowanceArea(caseInfoProps: CaseInfoProps) {
  const caseInfoId=caseInfoProps.params.caseInfoId
  const [cookies]=useCookies()
  const {showAlert}=useAlert()
  const [createAllowance]=useCreateAllowanceMutation()
  const [selected, setSelected] = useState<number[]>([]);
  const isAllSelected = selected.length > 0 && selected.length === caseInfoProps.allowanceList?.length;
  const isIndeterminate = selected.length > 0 && selected.length < (caseInfoProps.allowanceList?.length || 0);
  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
          if (event.target.checked) {
              const newSelected = caseInfoProps.allowanceList?.map((row) => row.subsidyId) || [];
              setSelected(newSelected);
          } else {
              setSelected([]);
          }
      };
  const handleClick = (subsidyId: number) => {
    setSelected((prev) => prev.includes(subsidyId) ? prev.filter(item => item !== subsidyId) : [...prev, subsidyId]);
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

  const [deleteAllowance] = useDeleteAllowanceMutation()
  const handleDeleteConfirmed = async () => {
    try {
        // 使用 Promise.allSettled 來處理多筆刪除
        const results = await Promise.allSettled(
            selected.map(subsidyId =>
                deleteAllowance({
                    socialWorkerEmail: cookies.user,
                    caseInfoId,
                    subsidyId,
                })
                    .then(() => ({ subsidyId, status: 'success' }))  // 成功時返回 subsidyId 和狀態
                    .catch(() => ({ subsidyId, status: 'failure' }))  // 失敗時返回 subsidyId 和狀態
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





  const handler=async(data:any)=>{
    
    const { applyTime, receiveTime } = data;
    if (applyTime > receiveTime) {
      alert("結束日期不能早於開始日期");
      return;
    }

    try {
      await createAllowance({
        socialWorkerEmail:cookies.user,
        caseInfoId:caseInfoId,
        ...data
      }).unwrap()
      showAlert("操作成功！", "success")
      
    } catch (error) {
      showAlert(handleError(error as ErrorType), "error");
    }
  }

  

  return (
    <>
      <CaseInvestmentArea
      handle={handler}
      caseInvestMentList={allowanceInvestmentList}
      // resetForm={reset}
      />
        

      <TableContainer  sx={tableContainerStyle}>
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
                        <TableCell>補助/津貼名稱</TableCell>
                        <TableCell>金額</TableCell>
                        <TableCell>申請時間</TableCell>
                        <TableCell>領取時間</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                )}
            </TableHead>
            <TableBody>
                {caseInfoProps.allowanceList && caseInfoProps.allowanceList.length > 0 ? (
                    caseInfoProps.allowanceList
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => (
                        <TableRow
                          key={`${row.subsidyId}`}
                          selected={selected.includes(row.subsidyId)}
                          sx={{
                            '& .MuiTableCell-root': {
                              borderBottom: '1px dashed rgba(224, 224, 224, 1)',
                              backgroundColor: selected.includes(row.subsidyId)
                                ? (theme) => theme.palette.primary.lighter
                                : '#ffffff',
                            },
                          }}
                        >
                            <TableCell padding="checkbox" sx={{ width: 48 }} onClick={(e) => e.stopPropagation()}>
                                <Checkbox checked={selected.includes(row.subsidyId)} onChange={() => handleClick(row.subsidyId)} />
                            </TableCell>
                            <TableCell>{row.subsidyName}</TableCell>
                            <TableCell sx={{ color: "#3763aa" }}>$ {row.money}</TableCell>
                            <TableCell>{row.applyTime.toString()}</TableCell>
                            <TableCell>{row.receiveTime.toString()}</TableCell>
                            <TableCell align="right">
                                <Tooltip title="編輯">
                                    <AllowanceEditDialog setValue={setValue} allowancePurchase={row} />
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
            count={caseInfoProps.allowanceList?.length || 0}
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
