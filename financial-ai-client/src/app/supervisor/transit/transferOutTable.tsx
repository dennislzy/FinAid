"use client"

import { useState } from "react";
import { useCookies } from "react-cookie";
import { useAlert } from "@/layout/context/alertProvider";
import SearchBar from "@/app/case_overview/search_input";
import { tableContainerStyle, tableCellHeight, tableNoneBorder, tableHeadNoneSelected, TablePaginationStyle } from "@/component/styles/tableStyle";
import { Box, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Typography, Button, TablePagination } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useGetReviewsSubmittedByWorkerQuery, useDeleteReviewMutation } from "@/redux/rtk/reviewApi";
import ApplyDialog from "./applyDialog";
import TransitConfirmDialog from "./transitConfirmDialog";

export default function TransferOutTable() {
    const [cookies] = useCookies(['socialWorkerId']);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [cancelApplyDialog, setCancelApplyDialog] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);

    const { data: reviews, isLoading, error } = useGetReviewsSubmittedByWorkerQuery(cookies.socialWorkerId);
    const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();
    const { showAlert } = useAlert();

    const filteredReviews = reviews?.filter((review) =>
        review.caseInfoId.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        review.reviewStatus.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        review.fromWorkerId.toLowerCase().includes(searchKeyword.toLowerCase())
    ) || [];

    const paginatedReviews = filteredReviews.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleCancel = async (reviewId: number) => {
        try {
            await deleteReview(reviewId).unwrap();
            showAlert("申請已取消", "success");
            setCancelApplyDialog(false);
        } catch (error) {
            console.error("取消失敗:", error);
            showAlert("取消申請失敗", "error");
        }
    };

    if (isLoading) {
        return <Typography>載入中...</Typography>;
    }

    if (error) {
        console.error("Error fetching reviews:", error);
        return <Typography>載入交接紀錄時發生錯誤: {JSON.stringify(error)}</Typography>;
    }

    console.log("現在督導的Id:", cookies.socialWorkerId)

    return (
        <>
            <Box sx={{ padding: 3, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                {/* <SearchBar onSearch={(keyword) => {
                    setSearchKeyword(keyword);
                    setPage(0);
                }} /> */}
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setDialogOpen(true)}
                >
                    申請
                </Button>
            </Box>

            <TableContainer sx={tableContainerStyle}>
                <Table sx={tableCellHeight}>
                    <TableHead sx={tableNoneBorder}>
                        <TableRow sx={tableHeadNoneSelected}>
                            <TableCell>個案名稱</TableCell>
                            <TableCell>原負責社工</TableCell>
                            <TableCell>申請轉出組別</TableCell>
                            <TableCell>申請日期</TableCell>
                            <TableCell>審核狀態</TableCell>
                            <TableCell align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedReviews.length > 0 ? (
                            paginatedReviews.map((review) => (
                                <TableRow
                                    key={review.reviewId}
                                    hover
                                    sx={{
                                        "& .MuiTableCell-root": {
                                            borderBottom: "1px dashed rgba(224, 224, 224, 1)",
                                            cursor: "pointer",
                                        },
                                    }}
                                >
                                    <TableCell sx={{fontWeight: "bold"}}>{review.caseInfoName}</TableCell>
                                    <TableCell>{review.socialWorkerName}</TableCell>
                                    <TableCell>{review.groupId}</TableCell>
                                    <TableCell>{new Date(review.applyTime).toLocaleDateString()}</TableCell>
                                    <TableCell>{review.reviewStatus}</TableCell>
                                    <TableCell align="center">
                                        {review.reviewStatus === "審核成功" ? (
                                            <Button
                                                sx={{
                                                    backgroundColor: "#808080",
                                                    color: "#fff",
                                                    fontWeight: "bold",
                                                    padding: "4px 12px",
                                                    textTransform: "none",
                                                    "&:hover": {
                                                        backgroundColor: "#808080",
                                                    },
                                                }}
                                                disabled
                                            >
                                                已完成審核
                                            </Button>
                                        ) : review.reviewStatus === "駁回" ? (

                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: "#b71c1c",
                                                    fontWeight: "bold",
                                                }}
                                            >遭駁回</Typography>

                                        ) : (
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
                                                    setCancelApplyDialog(true);
                                                }}
                                                disabled={isDeleting || review.reviewStatus !== "尚未審核"}
                                            >
                                                取消申請
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Typography color="textSecondary">
                                        {searchKeyword ? "無符合搜尋條件的交接紀錄" : "無交接紀錄"}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={filteredReviews.length}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => setRowsPerPage(Number.parseInt(e.target.value, 10))}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="每頁行數"
                    sx={TablePaginationStyle}
                />
            </TableContainer>

            <ApplyDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />

            <TransitConfirmDialog
                open={cancelApplyDialog}
                onClose={() => {
                    setCancelApplyDialog(false);
                    setSelectedReviewId(null);
                }}
                onConfirm={() => selectedReviewId && handleCancel(selectedReviewId)}
                title="您確認要取消申請嗎？"
                message="取消申請後可以再度提出申請。"
            />
        </>
    );
}