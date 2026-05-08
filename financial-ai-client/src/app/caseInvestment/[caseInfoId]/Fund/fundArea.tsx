/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable unused-imports/no-unused-imports */
'use client'

import CaseInvestmentArea from "@/component/caseInvestment/caseInvestmentArea"
import { fundInvestmentList1 } from "@/component/column/columnList"
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Typography, Box, IconButton, Checkbox, TablePagination,
    Tooltip
} from "@mui/material";
import { tableContainerStyle, tableCellHeight, tableNoneBorder, tableHeadSelected, tableHeadNoneSelected, TablePaginationStyle } from "@/component/styles/tableStyle";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAlert } from "@/layout/context/alertProvider"
import { useCreateFundMutation, useDeleteFundMutation } from "@/redux/rtk/fundApi"
import { CaseInfoProps, refreshPage } from "@/type/common/common"
import { ErrorType } from "@/type/dto/dto"
import { handleError } from "@/utils/config"
import { useState, useEffect, ChangeEvent } from "react"
import { useCookies } from "react-cookie"
import { useForm } from "react-hook-form"
import InvestmentConfirmDialog from "../InvestmentConfirmDialog";
import FundEditDialog from "./fundEditDialog";


export default function FundArea (caseInfoProps:CaseInfoProps) {
  const [cookies]=useCookies()

  const caseInfoId=caseInfoProps.params.caseInfoId

  const {showAlert}=useAlert()

  const [createFund]=useCreateFundMutation()

  const handler=async(data: any)=>{
    try {
      await createFund({
        socialWorkerEmail:cookies.user,
        caseInfoId:caseInfoId,
        ...data
      }).unwrap()
      showAlert('新增成功','success')
      
    } catch (error) {
      showAlert(handleError(error as ErrorType),'error')
    }
  }


  const [selected, setSelected] = useState<string[]>([]);
  const isAllSelected = selected.length > 0 && selected.length === caseInfoProps.fundList?.length;
  const isIndeterminate = selected.length > 0 && selected.length < (caseInfoProps.fundList?.length || 0);
  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = caseInfoProps.fundList?.map((row) => `${row.fundName}-${row.fundPurchaseDate}`) || [];
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };
  const handleClick = (fundName: string, fundPurchaseDate: string) => {
    const fundId = `${fundName}-${fundPurchaseDate}`; 
    setSelected((prev) => 
      prev.includes(fundId) 
        ? prev.filter(item => item !== fundId) 
        : [...prev, fundId]
    );
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

  const [deleteFund] = useDeleteFundMutation()
  const handleDeleteConfirmed = async () => {
        try {
            // 使用 Promise.allSettled 來處理多筆刪除
            const results = await Promise.allSettled(
                selected.map((fundId) => {
                  const [fundName, ...dateParts] = fundId.split("-");
                  const fundPurchaseDate = dateParts.join("-"); // 正確拼接日期
                    return deleteFund({
                        socialWorkerEmail: cookies.user,
                        caseInfoId,
                        fundName,
                        fundPurchaseDate,
                    })
                        .then(() => ({ fundId, status: 'success' }))  // 成功時返回 fundId 和狀態
                        .catch(() => ({ fundId, status: 'failure' })); // 失敗時返回 fundId 和狀態
                })
            );
          
            // 檢查是否有任何刪除失敗
            const failedDeletes = results.filter(result => 
                result.status === 'rejected' || (result.status === 'fulfilled' && result.value.status === 'failure')
            );
          
            if (failedDeletes.length > 0) {
                showAlert("部分刪除失敗，請重試", "error");
            } else {
                showAlert("刪除成功", "success");
            }
          
            setSelected([]); // 清空已選擇的項目
        } catch (error) {
            showAlert("刪除過程中發生錯誤", "error");
        } finally {
            setConfirmDialogOpen(false); // 關閉確認對話框
        }
    };
  
  
    return(
      <>
      <CaseInvestmentArea
      handle={handler}
      caseInvestMentList={fundInvestmentList1}
      />
      
      <TableContainer  sx={tableContainerStyle}>
        <Table sx={tableCellHeight}>
            <TableHead sx={tableNoneBorder}>
                {selected.length > 0 ? (
                    <TableRow sx={tableHeadSelected}>
                        <TableCell padding="checkbox" sx={{ width: 48 }}>
                            <Checkbox indeterminate={isIndeterminate} checked={isAllSelected} onChange={handleSelectAllClick} />
                        </TableCell>
                        <TableCell colSpan={7}>
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
                        <TableCell>基金名稱</TableCell>
                        <TableCell>最新購買日期</TableCell>
                        <TableCell>發行單位</TableCell>
                        <TableCell>投資金額</TableCell>
                        <TableCell>投入方式</TableCell>
                        <TableCell>國內/國外</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                )}
            </TableHead>
            <TableBody>
                {caseInfoProps.fundList && caseInfoProps.fundList.length > 0 ? (
                    caseInfoProps.fundList
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => (
                            <TableRow
                                key={`${row.fundName}-${row.fundPurchaseDate}`}
                                selected={selected.includes(`${row.fundName}-${row.fundPurchaseDate}`)}
                                sx={{
                                    '& .MuiTableCell-root': {
                                        borderBottom: '1px dashed rgba(224, 224, 224, 1)',
                                        backgroundColor: selected.includes(`${row.fundName}-${row.fundPurchaseDate}`)
                                            ? (theme) => theme.palette.primary.lighter
                                            : '#ffffff',
                                    },
                                }}
                            >
                                <TableCell padding="checkbox" sx={{ width: 48 }} onClick={(e) => e.stopPropagation()}>
                                    <Checkbox
                                        checked={selected.includes(`${row.fundName}-${row.fundPurchaseDate}`)}
                                        onChange={() => handleClick(row.fundName, row.fundPurchaseDate)}
                                    />
                                </TableCell>
                                <TableCell>{row.fundName}</TableCell>
                                <TableCell>{row.fundPurchaseDate.toString()}</TableCell>
                                <TableCell>{row.issuer}</TableCell>
                                <TableCell sx={{ color: "#3763aa" }}>$ {row.investmentAmount}</TableCell>
                                <TableCell>{row.investmentMethod}</TableCell>
                                <TableCell>{row.isForeign}</TableCell>                        
                                <TableCell align="right">
                                    <Tooltip title="編輯">
                                        <FundEditDialog setValue={setValue} fundInvestment={row} />
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={8} align="center">
                            <Typography color="textSecondary">無檔案資料</Typography>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>

        </Table>
        <TablePagination
            component="div"
            count={caseInfoProps.fundList?.length || 0}
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
    )
}