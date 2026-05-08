/* eslint-disable */
"use client"
import React from "react"
import { useParams } from "next/navigation"
import { useState } from "react"
import { useGetSocialWorkersWithCasesQuery } from "@/redux/rtk/socialWorkerLeaderApi"
import {
  Box,
  Button,
  Checkbox,
  IconButton,
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
import SupervisorBreadcrumbs from "@/component/breadcrumb/S_Breadcrumb"
import CaseInformation from "./caseInformation"
import {
  tableContainerStyle,
  tableCellHeight,
  tableNoneBorder,
  tableHeadNoneSelected,
  tableHeadSelected,
  TablePaginationStyle,
} from "@/component/styles/tableStyle"
import { RemoveRedEye } from "@mui/icons-material"
import { InsideBox, SupervisorBox } from "@/component/styles/outerBoxStyle"
import SearchBar from "@/app/case_overview/search_input"
import SWDialog from "./swDialog"
import { useReassignCaseMutation, useReassignSelectedCasesMutation } from "@/redux/rtk/reassignApi"
import { useAlert } from "@/layout/context/alertProvider"

const CaseListPage = () => {
  const params = useParams()
  const socialWorkerEmail = decodeURIComponent(params.socialWorkerEmail as string)

  const { data: workers } = useGetSocialWorkersWithCasesQuery()
  const worker = workers?.find((w) => w.socialWorkerEmail === socialWorkerEmail)

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [searchKeyword, setSearchKeyword] = useState("")

  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null)
  const [selectedCaseName, setSelectedCaseName] = useState<string>("")
  const [caseInfoOpen, setCaseInfoOpen] = useState(false)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [batchReassignDialogOpen, setBatchReassignDialogOpen] = useState(false)

  // 選取功能
  const [selected, setSelected] = useState<string[]>([])

  const [reassignCase] = useReassignCaseMutation()
  const [reassignSelectedCases] = useReassignSelectedCasesMutation()
  const { showAlert } = useAlert()

  // 單一個案重新分配
  const handleReassign = async (newSocialWorkerEmail: string) => {
    if (!selectedCaseId || !newSocialWorkerEmail) return

    try {
      await reassignCase({ caseInfoId: selectedCaseId, newSocialWorkerEmail }).unwrap()
      showAlert("分配個案成功", "success")
      setDialogOpen(false)
      setSelectedCaseId(null)
      setSelectedCaseName("")
      // 不用手動 refresh，因為會自動 invalidatesTags
    } catch (error) {
      console.error("分配失敗:", error)
      showAlert("分配失敗，請稍後再試！", "error")
    }
  }

  // 批量重新分配
  const handleBatchReassign = async (newSocialWorkerEmail: string) => {
    if (selected.length === 0 || !newSocialWorkerEmail) return

    try {
      // 使用批量 API
      await reassignSelectedCases({
        caseInfoIds: selected,
        newSocialWorkerEmail,
      }).unwrap()

      showAlert(`成功重新分配 ${selected.length} 個個案`, "success")
      setBatchReassignDialogOpen(false)
      setSelected([])
    } catch (error) {
      console.error("批量分配失敗:", error)
      showAlert("批量分配失敗，請稍後再試！", "error")
    }
  }

  if (!worker) {
    return <Typography>查無該社工</Typography>
  }

  const filteredCases = worker.cases.filter((c) => c.caseInfoName.toLowerCase().includes(searchKeyword.toLowerCase()))

  const paginatedCases = filteredCases.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword)
    setPage(0)
  }

  // 選取功能
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = paginatedCases.map((c) => c.caseInfoId)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (event: React.MouseEvent<unknown>, caseInfoId: string) => {
    event.stopPropagation()

    const selectedIndex = selected.indexOf(caseInfoId)
    let newSelected: string[] = []

    if (selectedIndex === -1) {
      newSelected = [...selected, caseInfoId]
    } else {
      newSelected = selected.filter((id) => id !== caseInfoId)
    }

    setSelected(newSelected)
  }

  const isSelected = (caseInfoId: string) => selected.includes(caseInfoId)
  const isAllSelected = paginatedCases.length > 0 && selected.length === paginatedCases.length
  const isIndeterminate = selected.length > 0 && selected.length < paginatedCases.length

  const workerLinks = [
    { href: "/supervisor", label: "首頁" },
    { href: `/supervisor/caseList/${socialWorkerEmail}`, label: "組內個案列表" },
  ]

  return (
    <>
 
      <SupervisorBreadcrumbs title="個案列表" links={workerLinks} />
      <Box sx={InsideBox}>
        <Box sx={{ padding: 3, gap: 2, display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
          <Typography variant="h6" fontWeight="bold">
            {worker.socialWorkerName} 社工負責個案
          </Typography>
          <SearchBar onSearch={handleSearch} />
        </Box>

        <TableContainer sx={tableContainerStyle}>
          <Table sx={tableCellHeight}>
            <TableHead sx={tableNoneBorder}>
              {selected.length > 0 ? (
                <TableRow sx={tableHeadSelected}>
                  <TableCell padding="checkbox" sx={{ width: 48 }}>
                    <Checkbox indeterminate={isIndeterminate} checked={isAllSelected} onChange={handleSelectAllClick} />
                  </TableCell>
                  <TableCell colSpan={4}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography color="primary" fontWeight="bold">
                        {selected.length} selected
                      </Typography>
                      <Box>
                        <Tooltip title="批量重新分配">
                          <Button
                            onClick={() => setBatchReassignDialogOpen(true)}
                            sx={{
                              backgroundColor: "#b71c1c",
                              color: "#ffffff",
                              fontWeight: "bold",
                              textTransform: "none",
                              marginRight: 1,
                              "&:hover": {
                                backgroundColor: "#f9d6d3",
                              },
                            }}
                          >
                            批量重新分配
                          </Button>
                        </Tooltip>
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow sx={tableHeadNoneSelected}>
                  <TableCell padding="checkbox" sx={{ width: 48 }}>
                    <Checkbox indeterminate={isIndeterminate} checked={isAllSelected} onChange={handleSelectAllClick} />
                  </TableCell>
                  <TableCell>個案姓名</TableCell>
                  <TableCell>個案電子郵件</TableCell>
                  <TableCell>基本資料</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              )}
            </TableHead>
            <TableBody>
              {paginatedCases.length > 0 ? (
                paginatedCases.map((c) => {
                  const isItemSelected = isSelected(c.caseInfoId)

                  return (
                    <React.Fragment key={c.caseInfoId}>
                      {/* 個案主列 */}
                      <TableRow
                        selected={isItemSelected}
                        sx={{
                          "& .MuiTableCell-root": {
                            borderBottom: "1px dashed rgba(224, 224, 224, 1)",
                            backgroundColor: isItemSelected ? (theme) => theme.palette.primary.lighter : "#ffffff",
                            cursor: "pointer",
                          },
                        }}
                      >
                        <TableCell padding="checkbox" sx={{ width: 48 }} onClick={(e) => e.stopPropagation()}>
                          <Checkbox checked={isItemSelected} onChange={(e) => handleClick(e, c.caseInfoId)} />
                        </TableCell>
                        <TableCell>{c.caseInfoName}</TableCell>
                        <TableCell>{c.caseInfoEmail}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation()
                              if (selectedCaseId === c.caseInfoId) {
                                // 點同一筆 → 收起來
                                setCaseInfoOpen(false)
                                setSelectedCaseId(null)
                                setSelectedCaseName("")
                              } else {
                                // 開啟新的一筆
                                setSelectedCaseId(c.caseInfoId)
                                setSelectedCaseName(c.caseInfoName)
                                setCaseInfoOpen(true)
                              }
                            }}
                          >
                            <RemoveRedEye />
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              setDialogOpen(true)
                              setSelectedCaseId(c.caseInfoId)
                              setSelectedCaseName(c.caseInfoName)
                            }}
                            sx={{
                              backgroundColor: "#b71c1c",
                              color: "#ffffff",
                              fontWeight: "bold",
                              
                              textTransform: "none",
                              "&:hover": {
                                backgroundColor: "#f9d6d3",
                              },
                            }}
                          >
                            重新分配
                          </Button>
                        </TableCell>
                      </TableRow>

                      {/* 展開詳細資料 */}
                      {caseInfoOpen && selectedCaseId === c.caseInfoId && (
                        <TableRow>
                          <TableCell colSpan={5} sx={{ padding: 0 }}>
                            <CaseInformation
                              open={true}
                              caseInfoId={c.caseInfoId}
                              title={c.caseInfoName}
                              socialWorkerEmail={socialWorkerEmail}
                            />
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="textSecondary">
                      {searchKeyword ? "無符合搜尋條件的個案" : "此社工尚無個案"}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredCases.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => setRowsPerPage(Number.parseInt(e.target.value, 10))}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="每頁行數"
            sx={TablePaginationStyle}
          />
        </TableContainer>

        {/* 單個重新分配對話框 */}
        <SWDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onConfirm={handleReassign}
          caseInfoName={selectedCaseName}
          nowsocialWorkerEmail={socialWorkerEmail}
        />

        {/* 批量重新分配對話框 */}
        <SWDialog
          open={batchReassignDialogOpen}
          onClose={() => setBatchReassignDialogOpen(false)}
          onConfirm={handleBatchReassign}
          caseInfoName={`${selected.length} 個選中的個案`}
          nowsocialWorkerEmail={socialWorkerEmail}
          isBatch={true}
        />
      </Box>
    </>
  )
}

export default CaseListPage

