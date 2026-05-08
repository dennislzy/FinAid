/* eslint-disable */
"use client"
import React, { useState, ChangeEvent } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Typography, Box, IconButton, Checkbox, TablePagination,
    Tooltip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useGetInsuranceQuery, useDeleteInsuranceMutation, useUpdateInsuranceMutation } from "@/redux/rtk/insuranceApi";
import { useCookies } from "react-cookie";
import { useAlert } from "@/layout/context/alertProvider";
import AddButton from "./addButton";
import InsuranceAddDialog from "./insuranceAdd";
import InsuranceConfirmDialog from "./insuranceConfirmDialog";
import Loading from "@/component/text/loading";
import { tableContainerStyle, tableCellHeight, tableNoneBorder, tableHeadSelected, tableHeadNoneSelected, TablePaginationStyle } from "../../component/styles/tableStyle";
import SearchBar from "../case_overview/search_input";

interface InsuranceTableProps {
    caseInfoId: string;
}

const InsuranceTable: React.FC<InsuranceTableProps> = ({ caseInfoId }) => {
    const [cookies] = useCookies();
    const { showAlert } = useAlert();
    const [selected, setSelected] = useState<number[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchKeyword, setSearchKeyword] = useState("");

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editData, setEditData] = useState<any | null>(null);

    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

    const [deleteInsurance] = useDeleteInsuranceMutation();
    const [updateInsurance] = useUpdateInsuranceMutation();

    const { data: insuranceData, isLoading, error, refetch } = useGetInsuranceQuery({
        socialWorkerEmail: cookies.user,
        caseInfoId,
        query: searchKeyword
    });


    if (isLoading) return <Loading isAudioText={false} />;

    // const totalAmount = insuranceData?.reduce((sum, record) => sum + (record.amount || 0), 0) || 0;
    const isAllSelected = selected.length > 0 && selected.length === insuranceData?.length;
    const isIndeterminate = selected.length > 0 && selected.length < (insuranceData?.length || 0);

    const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = insuranceData?.map((row) => row.insuranceId) || [];
            setSelected(newSelected);
        } else {
            setSelected([]);
        }
    };

    const handleClick = (insuranceId: number) => {
        setSelected((prev) => prev.includes(insuranceId) ? prev.filter(item => item !== insuranceId) : [...prev, insuranceId]);
    };

    const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);
    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteConfirmed = async () => {
        try {
            await Promise.all(selected.map(insuranceId =>
                deleteInsurance({ socialWorkerEmail: cookies.user, caseInfoId, insuranceId }).unwrap()
            ));
            showAlert("保險刪除成功", "success");
            refetch();
            setSelected([]);
        } catch (_) {
            showAlert("刪除失敗，請重試", "error");
        } finally {
            setConfirmDialogOpen(false);
        }
    };

    const handleEditClick = (row: any) => {
        setEditData(row);
        setEditDialogOpen(true);
    };

    const handleSearch = (keyword: string) => {
        setSearchKeyword(keyword);
    };

    console.log('insuranceData:', insuranceData);

    return (
        <>
            <Box sx={{ padding: 3, display: "flex", justifyContent: "flex-end" }}>
                 <SearchBar onSearch={handleSearch} />
                <AddButton caseInfoId={caseInfoId} onInsuranceAdded={refetch} />
            </Box>
            <TableContainer sx={tableContainerStyle}>
                <Table sx={tableCellHeight}>
                    <TableHead sx={tableNoneBorder}>
                        {selected.length > 0 ? (
                            <TableRow sx={tableHeadSelected}>
                                <TableCell padding="checkbox" sx={{ width: 48 }}>
                                    <Checkbox indeterminate={isIndeterminate} checked={isAllSelected} onChange={handleSelectAllClick} />
                                </TableCell>
                                <TableCell colSpan={6}>
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
                                <TableCell>成員名稱</TableCell>
                                <TableCell>保險公司</TableCell>
                                <TableCell>保險險種</TableCell>
                                <TableCell>金額</TableCell>
                                <TableCell>年保費</TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        )}
                    </TableHead>

                    <TableBody>
                        {insuranceData && insuranceData.length > 0 ? (
                            insuranceData
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => (
                                    <TableRow
                                        key={`${row.insuranceId}`}
                                        selected={selected.includes(row.insuranceId)}
                                        sx={{
                                            '& .MuiTableCell-root': {
                                                borderBottom: '1px dashed rgba(224, 224, 224, 1)',
                                                backgroundColor: selected.includes(row.insuranceId)
                                                    ? (theme) => theme.palette.primary.lighter
                                                    : '#ffffff',
                                            },
                                        }}
                                    >
                                        <TableCell
                                            padding="checkbox"
                                            sx={{ width: 48 }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Checkbox
                                                checked={selected.includes(row.insuranceId)}
                                                onChange={() => handleClick(row.insuranceId)}
                                            />
                                        </TableCell>
                                        <TableCell>{row.familyMember}</TableCell>
                                        <TableCell>{row.insuranceCompanyName}</TableCell>
                                        <TableCell>{row.insuranceType}</TableCell>
                                        <TableCell sx={{ color: "#3763aa" }}>$ {row.amount}</TableCell>
                                        <TableCell sx={{ color: "#3763aa" }}>$ {row.annualPremium}</TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="編輯">
                                                <IconButton
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditClick(row);
                                                    }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
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
                    count={insuranceData?.length || 0}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="每頁行數"
                    rowsPerPageOptions={[5, 10, 25]}
                    sx={TablePaginationStyle}
                />
            </TableContainer>

            <InsuranceAddDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                onSubmit={(data) => {
                    updateInsurance({ socialWorkerEmail: cookies.user, caseInfoId, ...data }).unwrap().then(() => {
                        showAlert("更新成功", "success");
                        setEditDialogOpen(false);
                        refetch();
                    }).catch(() => showAlert("更新失敗", "error"));
                }}
                editData={editData}
            />

            <InsuranceConfirmDialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                onConfirm={handleDeleteConfirmed}
            />
        </>
    );
};

export default InsuranceTable;
