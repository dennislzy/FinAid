import CaseInvestmentArea from "@/component/caseInvestment/caseInvestmentArea";
import { stockInvestmentList1 } from "@/component/column/columnList";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Typography, Box, IconButton, Checkbox, TablePagination,
    Tooltip
} from "@mui/material";
import { tableContainerStyle, tableCellHeight, tableNoneBorder, tableHeadSelected, tableHeadNoneSelected, TablePaginationStyle } from "@/component/styles/tableStyle";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAlert } from "@/layout/context/alertProvider";
import { useCreateStockMutation, useDeleteStockMutation } from "@/redux/rtk/stockApi";
import { CaseInfoProps} from "@/type/common/common";
import { ErrorType } from "@/type/dto/dto";
import { handleError } from "@/utils/config";
import { ChangeEvent, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import StockEditDialog from "./stockEditDialog";
import InvestmentConfirmDialog from "../InvestmentConfirmDialog";

export default function StockArea(caseInfoProps: CaseInfoProps) {
  const caseInfoId=caseInfoProps.params.caseInfoId
  const [cookies]=useCookies()
  
  const {showAlert}=useAlert()
  const [createStock]=useCreateStockMutation()
  const handler=async(data:any)=>{
    try {
      await createStock({
        socialWorkerEmail:cookies.user,
        caseInfoId:caseInfoId,
        ...data
      }).unwrap()
      showAlert("操作成功！", "success")
      
    } catch (error) {
      showAlert(handleError(error as ErrorType), "error");
    }
  }
  


  const [selected, setSelected] = useState<string[]>([]);
  const isAllSelected = selected.length > 0 && selected.length === caseInfoProps.stocks?.length;
  const isIndeterminate = selected.length > 0 && selected.length < (caseInfoProps.stocks?.length || 0);
  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = caseInfoProps.stocks?.map((row) => `${row.stockCode}-${row.stockPurchaseDate}`) || [];
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (stockCode: string, stockPurchaseDate: string) => {
    const stockId = `${stockCode}-${stockPurchaseDate}`; 
    setSelected((prev) => 
      prev.includes(stockId) 
        ? prev.filter(item => item !== stockId) 
        : [...prev, stockId]
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
  

    const [deleteStock] = useDeleteStockMutation();

    const handleDeleteConfirmed = async () => {
        try {
            // 使用 Promise.allSettled 來處理多筆刪除
            const results = await Promise.allSettled(
                selected.map((stockId) => {
                  const [stockCode, ...dateParts] = stockId.split("-");
                  const stockPurchaseDate = dateParts.join("-"); // 正確拼接日期
                    return deleteStock({
                        socialWorkerEmail: cookies.user,
                        caseInfoId,
                        stockCode,
                        stockPurchaseDate,
                    })
                        .then(() => ({ stockId, status: 'success' }))  // 成功時返回 stockId 和狀態
                        .catch(() => ({ stockId, status: 'failure' })); // 失敗時返回 stockId 和狀態
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

  

  return (
    <>
      <CaseInvestmentArea
        handle={handler}
        caseInvestMentList={stockInvestmentList1}
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
                        <TableCell>股票代碼</TableCell>
                        <TableCell>股數</TableCell>
                        <TableCell>平均每股買進金額</TableCell>
                        <TableCell>最新購買日期</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                )}
            </TableHead>
            <TableBody>
              {caseInfoProps.stocks && caseInfoProps.stocks.length > 0 ? (
                caseInfoProps.stocks
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow
                      key={`${row.stockCode}-${row.stockPurchaseDate}`}
                      selected={selected.includes(`${row.stockCode}-${row.stockPurchaseDate}`)}
                      sx={{
                        '& .MuiTableCell-root': {
                          borderBottom: '1px dashed rgba(224, 224, 224, 1)',
                          backgroundColor: selected.includes(`${row.stockCode}-${row.stockPurchaseDate}`)
                            ? (theme) => theme.palette.primary.lighter
                            : '#ffffff',
                        },
                      }}
                    >
                      <TableCell padding="checkbox" sx={{ width: 48 }} onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selected.includes(`${row.stockCode}-${row.stockPurchaseDate}`)}
                          onChange={() => handleClick(row.stockCode, row.stockPurchaseDate)}
                        />
                      </TableCell>
                      <TableCell>{row.stockCode}</TableCell>
                      <TableCell>{row.shares}</TableCell>
                      <TableCell sx={{ color: "#3763aa" }}>$ {row.averageBuyPrice}</TableCell>
                      <TableCell>{row.stockPurchaseDate.toString()}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="編輯">
                          <StockEditDialog setValue={setValue} stockPurchase={row} />
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
            count={caseInfoProps.stocks?.length || 0}
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
