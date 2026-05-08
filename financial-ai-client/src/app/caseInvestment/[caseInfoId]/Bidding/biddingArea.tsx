'use client'
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, Box, IconButton, Checkbox, TablePagination,
  Tooltip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { tableContainerStyle, tableCellHeight, tableNoneBorder, tableHeadSelected, tableHeadNoneSelected, TablePaginationStyle } from "@/component/styles/tableStyle";
import CaseInvestmentArea from "@/component/caseInvestment/caseInvestmentArea"
import { biddingInvestmentList1 } from "@/component/column/columnList"
import { useAlert } from "@/layout/context/alertProvider"
import { useCreateAidMutation, useDeleteAidMutation } from "@/redux/rtk/aidApi"
import { CaseInfoProps, refreshPage } from "@/type/common/common"
import { ErrorType } from "@/type/dto/dto"
import { handleError } from "@/utils/config"
import { useState, useEffect, ChangeEvent } from "react"
import { useCookies } from "react-cookie"
import { useForm } from "react-hook-form"
import InvestmentConfirmDialog from "../InvestmentConfirmDialog";
import BiddingEditDialog from "./biddingEditDialog";


export default function BiddingArea (caseInfoProps: CaseInfoProps) {

  const caseInfoId=caseInfoProps.params.caseInfoId

  const [createAid]=useCreateAidMutation()
  const [cookies]=useCookies()
  const {showAlert}=useAlert()

  const handler=async(data: any)=>{

    const { startDate, endDate } = data;
    if (startDate > endDate) {
      alert("結束日期不能早於開始日期");
      return;
    }

    try {
      await createAid({
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
    const isAllSelected = selected.length > 0 && selected.length === caseInfoProps.aidList?.length;
    const isIndeterminate = selected.length > 0 && selected.length < (caseInfoProps.aidList?.length || 0);
    const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
            if (event.target.checked) {
                const newSelected = caseInfoProps.aidList?.map((row) => row.aidAssociationId) || [];
                setSelected(newSelected);
            } else {
                setSelected([]);
            }
        };
    const handleClick = (aidAssociationId: string) => {
      setSelected((prev) => prev.includes(aidAssociationId) ? prev.filter(item => item !== aidAssociationId) : [...prev, aidAssociationId]);
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
  
    const [deleteAid] = useDeleteAidMutation()
    const handleDeleteConfirmed = async () => {
      try {
          // 使用 Promise.allSettled 來處理多筆刪除
          const results = await Promise.allSettled(
              selected.map(aidAssociationId =>
                  deleteAid({
                      socialWorkerEmail: cookies.user,
                      caseInfoId,
                      aidAssociationId,
                  })
                      .then(() => ({ aidAssociationId, status: 'success' }))  // 成功時返回 aidAssociationId 和狀態
                      .catch(() => ({ aidAssociationId, status: 'failure' }))  // 失敗時返回 aidAssociationId 和狀態
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
  
  
    return(
      <>
      <CaseInvestmentArea
        handle={handler}
        caseInvestMentList={biddingInvestmentList1}
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
                        <TableCell colSpan={9}>
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
                        <TableCell>活會/死會</TableCell>
                        <TableCell>每會金額</TableCell>
                        <TableCell>標會期間</TableCell>
                        <TableCell>標會開始時間</TableCell>
                        <TableCell>標會結束時間</TableCell>
                        <TableCell>底標標金</TableCell>
                        <TableCell>月外標</TableCell>
                        <TableCell>月標或其他金額</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                )}
            </TableHead>
            <TableBody>
                {caseInfoProps.aidList && caseInfoProps.aidList.length > 0 ? (
                    caseInfoProps.aidList
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => (
                            <TableRow
                                key={`${row.aidAssociationId}`}
                                selected={selected.includes(row.aidAssociationId)}
                                sx={{
                                    '& .MuiTableCell-root': {
                                        borderBottom: '1px dashed rgba(224, 224, 224, 1)',
                                        backgroundColor: selected.includes(row.aidAssociationId)
                                            ? (theme) => theme.palette.primary.lighter
                                            : '#ffffff',
                                    },
                                }}
                            >
                                <TableCell padding="checkbox" sx={{ width: 48 }} onClick={(e) => e.stopPropagation()}>
                                    <Checkbox
                                        checked={selected.includes(row.aidAssociationId)}
                                        onChange={() => handleClick(row.aidAssociationId)}
                                    />
                                </TableCell>
                                <TableCell>{row.isDead}</TableCell>
                                <TableCell sx={{ color: "#3763aa" }}>$ {row.monthlyAmount}</TableCell>
                                <TableCell>{row.period}</TableCell>
                                <TableCell>{row.startDate?.toString()}</TableCell>
                                <TableCell>{row.endDate?.toString()}</TableCell>
                                <TableCell sx={{ color: "#3763aa" }}>$ {row.baseBidAmount}</TableCell>
                                <TableCell sx={{ color: "#3763aa" }}>$ {row.monthlyExtraBid}</TableCell>
                                <TableCell sx={{ color: "#3763aa" }}>$ {row.other}</TableCell>
                                <TableCell align="right">
                                    <Tooltip title="編輯">
                                        <BiddingEditDialog setValue={setValue} aidResponse={row} />
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={10} align="center">
                            <Typography color="textSecondary">無檔案資料</Typography>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>

        </Table>
        <TablePagination
            component="div"
            count={caseInfoProps.aidList?.length || 0}
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
