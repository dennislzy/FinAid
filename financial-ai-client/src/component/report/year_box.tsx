/* eslint-disable */
"use client"

import { useAlert } from "@/layout/context/alertProvider"
import { useDeleteHouseYearMutation, useGetHouseholdYearQuery } from "@/redux/rtk/householdYearApi"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import {
  Box,
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Tooltip,
} from "@mui/material"
import type React from "react"
import { useState } from "react"
import { useCookies } from "react-cookie"
import EditDialogYear from "./EditDialogYear"
import {
  tableContainerStyle,
  tableCellHeight,
  tableNoneBorder,
  tableHeadSelected,
  tableHeadNoneSelected,
  TablePaginationStyle,
} from "../styles/tableStyle"

interface TableComponentProps {
  title: string
  year: number
  financialType: string
  caseInfoId: string
}

// 通用的表格組件
const TableComponent: React.FC<TableComponentProps> = ({ title, year, financialType, caseInfoId }) => {
  const [selected, setSelected] = useState<readonly string[]>([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [cookies] = useCookies()
  const [open, setOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<any>()

  const { data: visibleRows } = useGetHouseholdYearQuery({
    socialWorkerEmail: cookies.user,
    caseInfoId: caseInfoId,
    financialType: financialType,
    year: year,
  })

  const [deleteHouseYear] = useDeleteHouseYearMutation()
  const { showAlert } = useAlert()

  const visibleLength = visibleRows?.length || 0
  const isAllSelected = visibleLength > 0 && selected.length === visibleRows?.length
  const isIndeterminate = selected.length > 0 && selected.length < visibleLength

  // 計算總金額
  const totalAmount = visibleRows?.reduce((sum, record) => sum + (record.money || 0), 0) || 0

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked && visibleRows) {
      const newSelecteds = visibleRows.map((row) => row.financialYearRecordsId)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleClick = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleDelete = async () => {
    try {
      await deleteHouseYear({
        socialWorkerEmail: cookies.user,
        caseInfoId: caseInfoId,
        ids: selected as string[],
      }).unwrap()
      showAlert("刪除成功", "success")
      setSelectedRow(null)
      setSelected([])
    } catch (error) {
      showAlert("刪除失敗", "error")
    }
  }

  const isSelected = (id: string) => selected.includes(id)

  const handleClickOpen = (row: any) => {
    setSelectedRow(row)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedRow(null)
  }

  return (
    <>
      <TableContainer sx={tableContainerStyle}>
        <Table sx={tableCellHeight} aria-label={`${title} 表格`}>
          <TableHead sx={tableNoneBorder}>
            {selected.length > 0 ? (
              <TableRow sx={tableHeadSelected}>
                <TableCell padding="checkbox" sx={{ width: 48 }}>
                  <Checkbox indeterminate={isIndeterminate} checked={isAllSelected} onChange={handleSelectAllClick} />
                </TableCell>
                <TableCell colSpan={5}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography color="primary" fontWeight="bold">
                      {selected.length} selected
                    </Typography>
                    <Tooltip title="刪除">
                      <IconButton color="primary" size="small" onClick={handleDelete}>
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
                <TableCell>類別</TableCell>
                <TableCell>金額</TableCell>
                <TableCell>建立時間</TableCell>
                <TableCell>最後編輯時間</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            )}
          </TableHead>

          <TableBody>
            {visibleRows && visibleRows.length > 0 ? (
              <>
                {visibleRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const isItemSelected = isSelected(row.financialYearRecordsId);
                    return (
                      <TableRow
                        key={row.financialYearRecordsId}
                        selected={isItemSelected}
                        sx={{
                          "& .MuiTableCell-root": {
                            borderBottom: "1px dashed rgba(224, 224, 224, 1)",
                            backgroundColor: isItemSelected
                              ? (theme) => theme.palette.primary.lighter
                              : "#ffffff",
                          },
                        }}
                      >
                        <TableCell padding="checkbox" sx={{ width: 48 }} onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={isItemSelected}
                            onChange={() => handleClick(row.financialYearRecordsId)}
                          />
                        </TableCell>
                        <TableCell>{row.financialCategory}</TableCell>
                        <TableCell sx={{ color: (theme) => theme.palette.primary.main }}>
                          $ {row.money}
                        </TableCell>
                        <TableCell>{row.yearCreate}</TableCell>
                        <TableCell>{row.yearEditLast}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="編輯">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClickOpen(row);
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {/* 總計行 */}
                <TableRow
                  sx={{
                    "& .MuiTableCell-root": {
                      borderBottom: "1px dashed rgba(224, 224, 224, 1)",
                    },
                  }}
                >
                  <TableCell></TableCell>
                  <TableCell colSpan={1} sx={{ fontWeight: "bold" }}>
                    總計
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: (theme) => theme.palette.primary.main }}>
                    $ {totalAmount}
                  </TableCell>
                  <TableCell colSpan={3} />
                </TableRow>
              </>
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
          count={visibleLength}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="每頁行數"
          rowsPerPageOptions={[5, 10, 25]}
          sx={TablePaginationStyle}
        />
      </TableContainer>

      {selectedRow && <EditDialogYear rowData={selectedRow} onClose={handleClose} open={open} />}
    </>
  )
}

const CategoryBox = ({
  title,
  year,
  financialType,
  caseInfoId,
}: {
  category: string
  title: string
  year: number
  financialType: string
  caseInfoId: string
}) => {
  return <TableComponent caseInfoId={caseInfoId} financialType={financialType} year={year} title={title} />
}

const createCategoryBox = (category: string, title: string) => {
  return ({
    year,
    financialType,
    caseInfoId,
  }: {
    year: number
    financialType: string
    caseInfoId: string
  }) => (
    <CategoryBox caseInfoId={caseInfoId} financialType={financialType} year={year} category={category} title={title} />
  )
}

export const IncomeBox = createCategoryBox("收入", "收入")
export const ExpenseBox = createCategoryBox("支出", "支出")
export const AssetsBox = createCategoryBox("資產", "資產")
export const LiabilityBox = createCategoryBox("負債", "負債")