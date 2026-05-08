"use client";
import { useState } from "react";
import { useGetUncompleteSocialWorkersQuery } from "@/redux/rtk/socialWorkerLeaderApi";
import { Box, Typography, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, TablePagination, IconButton, Tooltip } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import AssignGroupDialog from "./assignGroupDialog";
import AssignGroupLeaderDialog from "./assignGroupLeaderDialog";
import { tableContainerStyle, tableCellHeight, tableNoneBorder, tableHeadNoneSelected, TablePaginationStyle } from "@/component/styles/tableStyle";
import SearchBar from "@/app/case_overview/search_input";

export default function ApplyAccounts() {
    const { data: uncompleteWorkers, isLoading, error } = useGetUncompleteSocialWorkersQuery();
    const [page, setPage] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [assignGroupDialogOpen, setAssignGroupDialogOpen] = useState(false); // 用於普通社工
    const [assignGroupLeaderDialogOpen, setAssignGroupLeaderDialogOpen] = useState(false); // 用於督導
    const [selectedWorker, setSelectedWorker] = useState<{ socialWorkerId: string; socialWorkerName: string; socialWorkerPermission: string } | null>(null);

    if (isLoading) {
        return <Box>載入中...</Box>;
    }

    if (error) {
        console.error("Error fetching uncomplete social workers:", error);
        return <Typography>載入未完成社工時發生錯誤: {JSON.stringify(error)}</Typography>;
    }

    if (!uncompleteWorkers || uncompleteWorkers.length === 0) {
        return (
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 4 }}>
                目前沒有未審核的社工
            </Typography>
        );
    }

    const handleSearch = (keyword: string) => {
        setSearchKeyword(keyword);
        setPage(0);
    };

    const filteredWorkers = uncompleteWorkers.filter((worker) =>
        worker.socialWorkerName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        worker.socialWorkerEmail.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        worker.socialWorkerId.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        worker.socialWorkerPermission.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    const paginatedWorkers = filteredWorkers.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleAcceptClick = (worker: { socialWorkerId: string; socialWorkerName: string; socialWorkerPermission: string }) => {
        setSelectedWorker(worker);
        if (worker.socialWorkerPermission === "LEADER") {
            setAssignGroupLeaderDialogOpen(true); // 開啟督導對話框
        } else {
            setAssignGroupDialogOpen(true); // 開啟普通社工對話框
        }
    };

    return (
        <Box sx={{ mt: 3 }}>
            <SearchBar onSearch={handleSearch} />
            <br />

            <TableContainer sx={tableContainerStyle}>
                <Table sx={tableCellHeight}>
                    <TableHead sx={tableNoneBorder}>
                        <TableRow sx={tableHeadNoneSelected}>
                            <TableCell>姓名</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>社工 ID</TableCell>
                            <TableCell>權限層級</TableCell>
                            <TableCell>操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedWorkers.map((worker) => (
                            <TableRow
                                key={worker.socialWorkerId}
                                hover
                                sx={{
                                    "& .MuiTableCell-root": {
                                        borderBottom: "1px dashed rgba(224, 224, 224, 1)",
                                        cursor: "pointer",
                                    },
                                }}
                            >
                                <TableCell sx={{ fontWeight: "bold" }}>{worker.socialWorkerName}</TableCell>
                                <TableCell>{worker.socialWorkerEmail}</TableCell>
                                <TableCell>{worker.socialWorkerId}</TableCell>
                                <TableCell>{worker.socialWorkerPermission}</TableCell>
                                <TableCell>
                                    <Tooltip title="接受申請">
                                        <IconButton
                                            sx={{
                                                backgroundColor: "#d3efdf",
                                                "&:hover": {
                                                    backgroundColor: "#d3efdf",
                                                },
                                            }}
                                            onClick={() => handleAcceptClick({
                                                socialWorkerId: worker.socialWorkerId,
                                                socialWorkerName: worker.socialWorkerName,
                                                socialWorkerPermission: worker.socialWorkerPermission,
                                            })}
                                        >
                                            <CheckIcon sx={{ color: "#118d57" }} />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={filteredWorkers.length}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => setRowsPerPage(Number.parseInt(e.target.value, 10))}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="每頁行數"
                    sx={TablePaginationStyle}
                />
            </TableContainer>

            {/* 普通社工的對話框：選擇現有組別 */}
            <AssignGroupDialog
                open={assignGroupDialogOpen}
                onClose={() => {
                    setAssignGroupDialogOpen(false);
                    setSelectedWorker(null);
                }}
                worker={selectedWorker}
            />

            {/* 督導社工的對話框：建立新組別 */}
            <AssignGroupLeaderDialog
                open={assignGroupLeaderDialogOpen}
                onClose={() => {
                    setAssignGroupLeaderDialogOpen(false);
                    setSelectedWorker(null);
                }}
                worker={selectedWorker}
            />
        </Box>
    );
}