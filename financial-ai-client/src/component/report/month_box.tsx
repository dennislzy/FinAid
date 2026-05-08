/* eslint-disable */
"use client"

import { useAlert } from "@/layout/context/alertProvider"
import { useDeleteHouseholdMonthlyMutation, useGetHouseholdMonthlyQuery } from "@/redux/rtk/householdMonthyApi"
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
import EditDialog from "./EditDialog"
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
  monthly: number
  financialType: string
  caseInfoId: string
}

// 通用的表格組件
const TableComponent: React.FC<TableComponentProps> = ({ title, caseInfoId, financialType, year, monthly }) => {
  const [selected, setSelected] = useState<readonly string[]>([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [cookies] = useCookies()
  const [open, setOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<any>()

  const { data: visibleRows } = useGetHouseholdMonthlyQuery({
    socialWorkerEmail: cookies.user,
    caseInfoId: caseInfoId,
    financialType: financialType,
    year: year,
    monthly: monthly,
  })

  const [deleteHousehold] = useDeleteHouseholdMonthlyMutation()
  const { showAlert } = useAlert()

  const visibleRowsLength = visibleRows?.length || 0
  const isAllSelected = visibleRowsLength > 0 && selected.length === visibleRows?.length
  const isIndeterminate = selected.length > 0 && selected.length < visibleRowsLength

  // 計算總金額
  const totalAmount = visibleRows?.reduce((sum, record) => sum + (record.money || 0), 0) || 0

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked && visibleRows) {
      const newSelecteds = visibleRows.map((row) => row.financialMonthlyRecordsId)
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
      await deleteHousehold({
        socialWorkerEmail: cookies.user,
        caseInfoId: caseInfoId,
        idList: selected as string[],
      })
      showAlert("刪除成功", "success")
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
                <TableCell colSpan={3}>
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
                  <Checkbox
                    indeterminate={isIndeterminate}
                    checked={isAllSelected}
                    onChange={handleSelectAllClick}
                    id="select-all"
                  />
                </TableCell>
                <TableCell>類別</TableCell>
                <TableCell>金額</TableCell>
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
                    const isItemSelected = isSelected(row.financialMonthlyRecordsId)
                    return (
                      <TableRow
                        id={`table-row-${row.financialMonthlyRecordsId}`}
                        key={row.financialMonthlyRecordsId}
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
                        <TableCell
                          padding="checkbox"
                          sx={{ width: 48 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            checked={isItemSelected}
                            onChange={() => handleClick(row.financialMonthlyRecordsId)}
                            id={`checkbox-${row.financialMonthlyRecordsId}`}
                          />
                        </TableCell>
                        <TableCell>{row.financialCategory}</TableCell>
                        <TableCell sx={{ color: (theme) => theme.palette.primary.main }}>
                          $ {row.money}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="編輯">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation()
                                handleClickOpen(row)
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    )
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
                </TableRow>
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography color="textSecondary">無檔案資料</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={visibleRowsLength}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="每頁行數"
          rowsPerPageOptions={[5, 10, 25]}
          sx={TablePaginationStyle}
        />
      </TableContainer>

      {selectedRow && <EditDialog rowData={selectedRow} onClose={handleClose} open={open} />}
    </>
  )
}

interface CategoryBoxProps {
  title: string
  year: number
  financialType: string
  caseInfoId: string
  monthly: number
  category: string
}

const CategoryBox: React.FC<CategoryBoxProps> = ({ title, year, financialType, caseInfoId, monthly }) => {
  return (
    <TableComponent title={title} year={year} financialType={financialType} caseInfoId={caseInfoId} monthly={monthly} />
  )
}

// 動態生成組件
const createCategoryBox = (category: string, title: string) => {
  return ({
    year,
    financialType,
    caseInfoId,
    monthly,
  }: {
    year: number
    financialType: string
    caseInfoId: string
    monthly: number
  }) => (
    <CategoryBox
      caseInfoId={caseInfoId}
      financialType={financialType}
      year={year}
      title={title}
      monthly={monthly}
      category={category}
    />
  )
}

// 具體類別組件
export const IncomeBox = createCategoryBox("收入", "收入")
export const ExpenseBox = createCategoryBox("支出", "支出")
export const AssetsBox = createCategoryBox("資產", "資產")
export const LiabilityBox = createCategoryBox("負債", "負債")