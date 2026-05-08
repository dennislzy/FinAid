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
import InsuranceAddDialog from "./familyAdd";
import InsuranceConfirmDialog from "./familyConfirmDialog";
import Loading from "@/component/text/loading";
import { tableContainerStyle, tableCellHeight, tableNoneBorder, tableHeadSelected, tableHeadNoneSelected, TablePaginationStyle } from "../../component/styles/tableStyle";
import SearchBar from "../case_overview/search_input";
import FamilyMemberDialog from "./familyAdd";
import FamilyConfirmDialog from "./familyConfirmDialog";
import { useDeleteFamilyMutation, useGetFamilyQuery, useUpdateFamilyMutation } from "@/redux/rtk/familyApi";

interface InsuranceTableProps {
    caseInfoId: string;
}

const FamilyTable: React.FC<InsuranceTableProps> = ({ caseInfoId }) => {
    const [cookies] = useCookies();
    const { showAlert } = useAlert();
    const [selected, setSelected] = useState<number[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchKeyword, setSearchKeyword] = useState("");

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editData, setEditData] = useState<any | null>(null);

    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

    const [deleteFamily] = useDeleteFamilyMutation();
    const [updateFamily] = useUpdateFamilyMutation();

    const { data: familyData, isLoading, error, refetch } = useGetFamilyQuery({
        socialWorkerEmail: cookies.user,
        caseInfoId,
    });


    if (isLoading) return <Loading isAudioText={false} />;

    // const totalAmount = familyData?.reduce((sum, record) => sum + (record.amount || 0), 0) || 0;
    const isAllSelected = selected.length > 0 && selected.length === familyData?.length;
    const isIndeterminate = selected.length > 0 && selected.length < (familyData?.length || 0);

    const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = familyData?.map((row) => row.memberId) || [];
            setSelected(newSelected);
        } else {
            setSelected([]);
        }
    };

    const handleClick = (memberId: number) => {
        setSelected((prev) => prev.includes(memberId) ? prev.filter(item => item !== memberId) : [...prev, memberId]);
    };

    const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);
    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteConfirmed = async () => {
        try {
            await Promise.all(selected.map(memberId =>
                deleteFamily({ socialWorkerEmail: cookies.user, caseInfoId, memberId }).unwrap()
            ));
            showAlert("刪除成功", "success");
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

    console.log('familyData:', familyData);

    return (
        <>
            <Box sx={{ padding: 3, display: "flex", justifyContent: "flex-end" }}>
                 {/* <SearchBar onSearch={handleSearch} /> */}
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
                                <TableCell>姓名</TableCell>
                                <TableCell>與個案關係</TableCell>
                                <TableCell>是否有穩定收入</TableCell>
                                <TableCell>平均年收入</TableCell>
                                <TableCell>是否實際由個案扶養</TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        )}
                    </TableHead>

                    <TableBody>
                        {familyData && familyData.length > 0 ? (
                            familyData
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => (
                                    <TableRow
                                        key={`${row.memberId}`}
                                        selected={selected.includes(row.memberId)}
                                        sx={{
                                            '& .MuiTableCell-root': {
                                                borderBottom: '1px dashed rgba(224, 224, 224, 1)',
                                                backgroundColor: selected.includes(row.memberId)
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
                                                checked={selected.includes(row.memberId)}
                                                onChange={() => handleClick(row.memberId)}
                                            />
                                        </TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.relationshipToCase}</TableCell>
                                        <TableCell>{row.income ? "是" : "否"}</TableCell>
                                        <TableCell sx={{ color: "#3763aa" }}>$ {row.yearSalary ? row.yearSalary : 0}</TableCell>
                                        <TableCell>{row.supported ? "是" : "否"}</TableCell>
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
                    count={familyData?.length || 0}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="每頁行數"
                    rowsPerPageOptions={[5, 10, 25]}
                    sx={TablePaginationStyle}
                />
            </TableContainer>

            <FamilyMemberDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                onSubmit={(data) => {
                    updateFamily({ socialWorkerEmail: cookies.user, caseInfoId, ...data }).unwrap().then(() => {
                        showAlert("更新成功", "success");
                        setEditDialogOpen(false);
                        refetch();
                    }).catch(() => showAlert("更新失敗", "error"));
                }}
                editData={editData}
            />

            <FamilyConfirmDialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                onConfirm={handleDeleteConfirmed}
            />
        </>
    );
};

export default FamilyTable;
