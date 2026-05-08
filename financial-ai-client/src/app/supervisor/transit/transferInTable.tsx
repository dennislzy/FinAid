"use client";

import type React from "react";
import { useState } from "react";
import { useCookies } from "react-cookie";
import SearchBar from "@/app/case_overview/search_input";
import {
    tableContainerStyle,
    tableCellHeight,
    tableNoneBorder,
    tableHeadNoneSelected,
    tableHeadSelected,
    TablePaginationStyle,
} from "@/component/styles/tableStyle";
import {
    Box,
    Typography,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TablePagination,
    Checkbox,
    Button,
    Tooltip,
    Chip,
} from "@mui/material";
import AcceptDialog from "./acceptDialog";
import TransitConfirmDialog from "./transitConfirmDialog";
import { useGetReviewsByGroupQuery, useApproveReviewMutation, useRejectReviewMutation } from "@/redux/rtk/reviewApi";
import { useReassignCaseMutation, useReassignSelectedCasesMutation } from "@/redux/rtk/reassignApi";
import { useAlert } from "@/layout/context/alertProvider";

export default function TransferInTable() {
    const [cookies] = useCookies(['socialWorkerId', 'user']);
    const { data: reviews, isLoading, error } = useGetReviewsByGroupQuery(cookies.socialWorkerId);
    const [approveReview, { isLoading: isApproving } ] = useApproveReviewMutation();
    const [rejectReview, { isLoading: isRejecting } ] = useRejectReviewMutation();
    const [reassignCase] = useReassignCaseMutation();
    const [reassignSelectedCases] = useReassignSelectedCasesMutation();
    const { showAlert } = useAlert();

    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selected, setSelected] = useState<number[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isBatchMode, setIsBatchMode] = useState(false); // 新增批量模式狀態
    const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
    const [selectedCaseName, setSelectedCaseName] = useState<string>("");
    const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);

    const filteredData = reviews?.filter((review) =>
        review.caseInfoId.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        review.reviewStatus.toLowerCase().includes(searchKeyword.toLowerCase())
    ) || [];

    const    paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // 單一接受並重新分配
    const handleApproveAndReassign = async (newSocialWorkerEmail: string, reviewId: number | null) => {
        if (!selectedCaseId || !newSocialWorkerEmail || !reviewId) {
            showAlert("缺少必要的資料，請稍後再試！", "error");
            return;
        }

        try {            // 先批准交接紀錄
            await approveReview(reviewId).unwrap();
            // 批准成功後，重新分配個案
            await reassignCase({ caseInfoId: selectedCaseId, newSocialWorkerEmail }).unwrap();
            showAlert("交接紀錄已接受並分配成功", "success");
            setDialogOpen(false);
            setSelectedCaseId(null);
            setSelectedCaseName("");
            setSelectedReviewId(null);
            // 表格會自動刷新，因為兩個 mutation 都會 invalidatesTags
        } catch (error) {
            console.error("操作失敗:", error);
            showAlert("操作失敗，請稍後再試！", "error");
        }
    };

    // 批量接受並重新分配
    const handleBatchApproveAndReassign = async (newSocialWorkerEmail: string) => {
        if (!selected.length || !newSocialWorkerEmail) {
            showAlert("請選擇至少一個個案並指定社工！", "error");
            return;
        }

        try {
            // 獲取選中的 reviewId 和 caseInfoId
            const selectedReviews = filteredData.filter((review) => selected.includes(review.reviewId));
            const reviewIds = selectedReviews.map((review) => review.reviewId);
            const caseInfoIds = selectedReviews.map((review) => review.caseInfoId);

            // 批量批准交接紀錄
            await Promise.all(reviewIds.map((reviewId) => approveReview(reviewId).unwrap()));

            // 批量重新分配個案
            await reassignSelectedCases({ caseInfoIds, newSocialWorkerEmail }).unwrap();

            showAlert(`成功接受並分配 ${selected.length} 個個案`, "success");
            setDialogOpen(false);
            setSelected([]); // 清空選擇
            setIsBatchMode(false); // 退出批量模式
        } catch (error) {
            console.error("批量操作失敗:", error);
            showAlert("批量操作失敗，請稍後再試！", "error");
        }
    };

    // 駂回申請
    const handleReject = async (reviewId: number) => {
        try {
            await rejectReview(reviewId).unwrap();
            showAlert("已駂回個案轉入申請", "success");
            setRejectDialogOpen(false);
        } catch (error) {
            console.error("駂回失敗:", error);
            showAlert("駂回失敗，請稍後再試！", "error");
        }
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = paginatedData.map((review) => review.reviewId);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        event.stopPropagation();

        const selectedIndex = selected.indexOf(id);
        let newSelected: number[] = [];

        if (selectedIndex === -1) {
            newSelected = [...selected, id];
        } else {
            newSelected = selected.filter((itemId) => itemId !== id);
        }

        setSelected(newSelected);
    };

    const isSelected = (id: number) => selected.includes(id);
    const isAllSelected = paginatedData.length > 0 && selected.length === paginatedData.length;
    const isIndeterminate = selected.length > 0 && selected.length < paginatedData.length;

    if (!cookies.socialWorkerId) {
        return <Typography>錯誤：請先登入以獲取社工ID</Typography>;
    }

    if (isLoading) {
        return <Typography>載入中...</Typography>;
    }

    if (error) {
        return <Typography>載入交接紀錄時發生錯誤: {JSON.stringify(error)}</Typography>;
    }

    console.log("現在督導的Id:", cookies.socialWorkerId);

    return (
        <>
            <Box sx={{ padding: 3 }}>
                <SearchBar onSearch={(keyword) => {
                    setSearchKeyword(keyword);
                    setPage(0);
                }} />
            </Box>

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
                                        <Typography color="primary" fontWeight="bold">
                                            {selected.length} 已選取
                                        </Typography>
                                        <Box>
                                            <Tooltip title="批量處理">
                                                <Button
                                                    sx={{
                                                        backgroundColor: "#00A76F",
                                                        color: "#fff",
                                                        fontWeight: "bold",
                                                        padding: "4px 12px",
                                                        textTransform: "none",
                                                        "&:hover": {
                                                            backgroundColor: "#00A76F",
                                                        },
                                                    }}
                                                    onClick={() => {
                                                        setIsBatchMode(true);
                                                        setDialogOpen(true);
                                                    }}
                                                    disabled={isApproving || isRejecting}
                                                >
                                                    批量接受
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
                                <TableCell>個案名稱</TableCell>
                                <TableCell>原負責社工</TableCell>
                                <TableCell>申請日期</TableCell>
                                <TableCell>審核狀態</TableCell>
                                <TableCell align="center">操作</TableCell>
                            </TableRow>
                        )}
                    </TableHead>
                    <TableBody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((review) => {
                                const isItemSelected = isSelected(review.reviewId);

                                return (
                                    <TableRow
                                        key={review.reviewId}
                                        selected={isItemSelected}
                                        hover
                                        sx={{
                                            "& .MuiTableCell-root": {
                                                borderBottom: "1px dashed rgba(224, 224, 224, 1)",
                                                backgroundColor: isItemSelected
                                                    ? (theme) => theme.palette.primary?.lighter || "#e3f2fd"
                                                    : "#ffffff",
                                                cursor: "pointer",
                                            },
                                        }}
                                    >
                                        <TableCell padding="checkbox" sx={{ width: 48 }} onClick={(e) => handleClick(e, review.reviewId)}>
                                            <Checkbox checked={isItemSelected} />
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>{review.caseInfoName}</TableCell>
                                        <TableCell>{review.socialWorkerName}</TableCell>
                                        <TableCell>{new Date(review.applyTime).toLocaleDateString()}</TableCell>
                                        <TableCell>{review.reviewStatus}</TableCell>
                                        <TableCell align="center">
                                            {review.reviewStatus === "審核成功" ? (
                                                <Chip
                                                    label={"已審核"}
                                                    sx={{
                                                        backgroundColor: "#e8f5e9",
                                                        color: "#2e7d32",
                                                        fontWeight: "bold",
                                                        borderRadius: "12px",
                                                        px: 1.5,
                                                        py: 0.5,
                                                        fontSize: "0.875rem",
                                                    }}
                                                />
                                            ) : review.reviewStatus === "駂回" ? (
                                                <Chip
                                                    label={"已駂回"}
                                                    sx={{
                                                        backgroundColor: "#fdecea",
                                                        color: "#b71c1c",
                                                        fontWeight: "bold",
                                                        borderRadius: "12px",
                                                        px: 1.5,
                                                        py: 0.5,
                                                        fontSize: "0.875rem",
                                                    }}
                                                />
                                            ) : (
                                                <>
                                                    <Button
                                                        sx={{
                                                            backgroundColor: "#b71c1c",
                                                            color: "#fff",
                                                            fontWeight: "bold",
                                                            padding: "4px 12px",
                                                            textTransform: "none",
                                                            "&:hover": {
                                                                backgroundColor: "#b71c1c",
                                                            },
                                                        }}
                                                        onClick={() => {
                                                            setSelectedReviewId(review.reviewId);
                                                            setRejectDialogOpen(true);
                                                        }}
                                                        disabled={isRejecting || review.reviewStatus !== "尚未審核"}
                                                    >
                                                        駁回
                                                    </Button>
                                                    <Button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setIsBatchMode(false); // 單一模式
                                                            setDialogOpen(true);
                                                            setSelectedCaseId(review.caseInfoId);
                                                            setSelectedCaseName(review.caseInfoName || review.caseInfoId);
                                                            setSelectedReviewId(review.reviewId);
                                                        }}
                                                        sx={{
                                                            backgroundColor: "#00A76F",
                                                            color: "#fff",
                                                            fontWeight: "bold",
                                                            padding: "4px 12px",
                                                            textTransform: "none",
                                                            ml: 2,
                                                            "&:hover": {
                                                                backgroundColor: "#00A76F",
                                                            },
                                                        }}
                                                        disabled={isApproving || review.reviewStatus !== "尚未審核"}
                                                    >
                                                        接受
                                                    </Button>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Typography color="textSecondary">{searchKeyword ? "無符合搜尋條件的交接紀錄" : "無交接紀錄"}</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={filteredData.length}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => setRowsPerPage(Number.parseInt(e.target.value, 10))}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="每頁行數"
                    sx={TablePaginationStyle}
                />
            </TableContainer>

            <AcceptDialog
                open={dialogOpen}
                onClose={() => {
                    setDialogOpen(false);
                    setSelectedCaseId(null);
                    setSelectedCaseName("");
                    setSelectedReviewId(null);
                    setIsBatchMode(false);
                }}
                onConfirm={(newSocialWorkerEmail: string) => {
                    if (isBatchMode) {
                        handleBatchApproveAndReassign(newSocialWorkerEmail);
                    } else {
                        handleApproveAndReassign(newSocialWorkerEmail, selectedReviewId);
                    }
                }}
                caseInfoName={isBatchMode ? `${selected.length} 個選中的個案` : selectedCaseName}
                isBatch={isBatchMode}
            />

            <TransitConfirmDialog
                open={rejectDialogOpen}
                onClose={() => {
                    setRejectDialogOpen(false);
                    setSelectedReviewId(null);
                }}
                onConfirm={() => selectedReviewId && handleReject(selectedReviewId)}
                title="您確定要駁回申請？"
                message="駁回申請無法回復。"
            />
        </>
    );
}