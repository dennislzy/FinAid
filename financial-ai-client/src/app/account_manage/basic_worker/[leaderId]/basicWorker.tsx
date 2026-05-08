"use client";
import { useGetBasicSocialWorkersQuery } from "@/redux/rtk/socialWorkerLeaderApi";
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import SearchBar from "@/app/case_overview/search_input";
import {
    tableContainerStyle,
    tableCellHeight,
    tableNoneBorder,
    tableHeadNoneSelected,
    TablePaginationStyle,
} from "@/component/styles/tableStyle";
import { useState } from "react";
import AssignGroupDialog from "../../account_apply/assignGroupDialog";
import { useDeleteSocialWorkerMutation } from "@/redux/rtk/socialWorkerLeaderApi"; // 導入刪除 Hook

interface BasicWorkerProps {
    leaderId: string;
}

export default function BasicWorker({ leaderId }: BasicWorkerProps) {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { data: basicWorkers, isLoading: workersLoading } = useGetBasicSocialWorkersQuery(leaderId);

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState<{ socialWorkerId: string; socialWorkerName: string } | null>(null);
    const [deleteSocialWorker] = useDeleteSocialWorkerMutation(); // 使用刪除 Hook

    if (workersLoading) {
        return <Box>Loading social workers...</Box>;
    }

    const handleSearch = (keyword: string) => {
        setSearchKeyword(keyword);
        setPage(0);
    };

    const isNoWorkers = !basicWorkers || basicWorkers.length === 0;

    const handleOpenDialog = (worker: { socialWorkerId: string; socialWorkerName: string }) => {
        setSelectedWorker(worker);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setSelectedWorker(null);
        setOpenDialog(false);
    };

    const handleDeleteWorker = async (socialWorkerId: string, socialWorkerName: string) => {
        if (window.confirm(`確定要刪除社工 ${socialWorkerName} ${socialWorkerId} 嗎？`)) {
            try {
                const response = await deleteSocialWorker(socialWorkerId).unwrap();
                alert(response.data || "社工刪除成功"); // 使用 response.data 獲取純文字
            } catch (error) {
                console.error("刪除社工失敗:", error);
                alert("刪除社工失敗，請稍後再試");
            }
        }
    };

    return (
        <Box>
            <SearchBar onSearch={handleSearch} />
            <br />

            <TableContainer sx={tableContainerStyle}>
                <Table sx={tableCellHeight}>
                    <TableHead sx={tableNoneBorder}>
                        <TableRow sx={tableHeadNoneSelected}>
                            <TableCell>姓名</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>社工 ID</TableCell>
                            <TableCell>操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isNoWorkers ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Typography color="textSecondary">無基層社工</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            basicWorkers.map((worker) => (
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
                                    <TableCell>
                                        <EmailIcon sx={{ fontSize: "20px", color: "#34C759", mr: 1 }} />
                                        {worker.socialWorkerEmail}
                                    </TableCell>
                                    <TableCell>{worker.socialWorkerId}</TableCell>
                                    <TableCell>
                                        <Button
                                            size="small"
                                            onClick={() => handleOpenDialog({ socialWorkerId: worker.socialWorkerId, socialWorkerName: worker.socialWorkerName })}
                                            sx={{ mr: 1 }}
                                        >
                                            換組別
                                        </Button>
                                        <Button
                                            size="small"
                                            sx={{ backgroundColor: (theme) => theme.palette.danger.main }}
                                            onClick={() => handleDeleteWorker(worker.socialWorkerId, worker.socialWorkerName)}
                                        >
                                            刪除
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={basicWorkers?.length || 0}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => setRowsPerPage(Number.parseInt(e.target.value, 10))}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="每頁行數"
                    sx={TablePaginationStyle}
                />
            </TableContainer>

            <AssignGroupDialog
                open={openDialog}
                onClose={handleCloseDialog}
                worker={selectedWorker}
            />
        </Box>
    );
}