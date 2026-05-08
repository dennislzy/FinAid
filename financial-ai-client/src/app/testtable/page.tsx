"use client"
import React, { useState, ChangeEvent } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Avatar, IconButton, Chip, Checkbox, Typography, Box, TablePagination
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { tableContainerStyle, tableCellHeight, tableNoneBorder, tableHeadSelected, tableHeadNoneSelected } from "../../component/styles/tableStyle";
interface User {
    avatar: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    role: string;
    status: "Active" | "Pending" | "Banned";
}

const users: User[] = [
    { avatar: "https://i.pravatar.cc/50?img=1", name: "Angelique Morse", email: "benny89@yahoo.com", phone: "+46 8 123 456", company: "Wuckert Inc", role: "Content Creator", status: "Banned" },
    { avatar: "https://i.pravatar.cc/50?img=1", name: "Angelique Morse", email: "benny89@yahoo.com", phone: "+46 8 123 456", company: "Wuckert Inc", role: "Content Creator", status: "Banned" },
    { avatar: "https://i.pravatar.cc/50?img=2", name: "Ariana Lang", email: "avery43@hotmail.com", phone: "+54 11 1234-5678", company: "Feest Group", role: "IT Administrator", status: "Pending" },
    { avatar: "https://i.pravatar.cc/50?img=3", name: "Aspen Schmitt", email: "mireya13@hotmail.com", phone: "+34 91 123 4567", company: "Kihn, Marquardt and Crist", role: "Financial Planner", status: "Banned" },
    { avatar: "https://i.pravatar.cc/50?img=4", name: "Brycen Jimenez", email: "tyrel.greenholt@gmail.com", phone: "+52 55 1234 5678", company: "Rempel, Hand and Herzog", role: "HR Recruiter", status: "Active" },
    { avatar: "https://i.pravatar.cc/50?img=5", name: "Chase Day", email: "joana.simonis84@gmail.com", phone: "+86 10 1234 5678", company: "Mraz, Donnelly and Collins", role: "Graphic Designer", status: "Banned" },
];

const getStatusChipColor = (status: User["status"]): "success" | "warning" | "error" | "default" => {
    switch (status) {
        case "Active": return "success";
        case "Pending": return "warning";
        case "Banned": return "error";
        default: return "default";
    }
};

export default function UserTable() {
    const [selected, setSelected] = useState<number[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = users.map((_, index) => index);
            setSelected(newSelected);
        } else {
            setSelected([]);
        }
    };

    const handleCheckboxClick = (index: number) => {
        const selectedIndex = selected.indexOf(index);
        let newSelected: number[] = [];

        if (selectedIndex === -1) {
            newSelected = selected.concat(index);
        } else {
            newSelected = selected.filter((item) => item !== index);
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <TableContainer component={Paper}
        sx={tableContainerStyle}
          >
            <Table sx={tableCellHeight}>
                <TableHead
                  sx={tableNoneBorder}
                >
                    {selected.length > 0 ? (
                        <TableRow
                            sx={tableHeadSelected}
                        >
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={selected.length > 0 && selected.length < users.length}
                                    checked={users.length > 0 && selected.length === users.length}
                                    onChange={handleSelectAllClick}
                                />
                            </TableCell>
                            {/* 改colSpan在這裡，請改你的欄位數減1 */}
                            <TableCell colSpan={6}>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Typography color="primary" fontWeight="bold">{selected.length} selected</Typography>
                                    <IconButton color="primary" size="small">
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ) : (
                        <TableRow
                            sx={tableHeadNoneSelected}>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={selected.length > 0 && selected.length < users.length}
                                    checked={users.length > 0 && selected.length === users.length}
                                    onChange={handleSelectAllClick}
                                />
                            </TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Phone number</TableCell>
                            <TableCell>Company</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    )}
                </TableHead>

                <TableBody>
                    {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                        <TableRow
                            key={index}
                            selected={selected.includes(index)}
                            sx={{
                                '& .MuiTableCell-root': {
                                    borderBottom: '1px dashed rgba(224, 224, 224, 1)',
                                    backgroundColor: selected.includes(index) ? (theme) => theme.palette.primary.lighter : '#ffffff'
                                },
                            }}
                        >
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selected.includes(index)}
                                    onChange={() => handleCheckboxClick(index)}
                                />
                            </TableCell>
                            <TableCell>
                                {/* Avatar區 */}
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <Avatar src={user.avatar} alt={user.name} />
                                    <Box>
                                        <div>{user.name}</div>
                                        <div style={{ color: "gray", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
                                    </Box>
                                </Box>
                            </TableCell>
                            <TableCell>{user.phone}</TableCell>
                            <TableCell>{user.company}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                                <Chip label={user.status} color={getStatusChipColor(user.status)} size="small" />
                            </TableCell>
                            <TableCell align="right">
                                <IconButton>
                                    <EditIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <TablePagination
                component="div"
                count={users.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 20]}
                labelRowsPerPage="每頁行數"
            />
        </TableContainer>
    );
}
