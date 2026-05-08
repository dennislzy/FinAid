'use client';

import {
    FormControl,
    Select,
    MenuItem,
    ListSubheader,
    Box,
    Typography,
    SelectChangeEvent,
} from "@mui/material";

interface GroupedOption {
    groupLabel: string;
    items: { value: string | number; label: string }[];
}

interface GroupedSelectProps {
    options: GroupedOption[];
    value: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
    label?: string;
    id:string
}


//沒有label版本
const GroupedSelect2 = ({
    options,
    value,
    onChange,
    id,
    placeholder = "請選擇",
    label = "類型",
}: GroupedSelectProps) => {
    const handleChange = (event: SelectChangeEvent<string | number>) => {
        onChange(event.target.value);
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minWidth: "200px",
            }}
        >
            <FormControl>
                <Select
                    id={id}
                    value={value}
                    onChange={handleChange}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    sx={{
                        backgroundColor: "#f5f5f5",
                        border: "none",
                        borderRadius: "10px",
                        height: "56px", // 統一高度
                        "& .MuiSelect-select": {
                            padding: "12px 16px", // 調整內邊距與高度匹配
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                            display: "none", // 隱藏外框
                        },
                        "&:hover": {
                            backgroundColor: "#eaeaea", // 滑鼠懸停時的背景色
                        },
                        "&.Mui-focused": {
                            backgroundColor: "#eaeaea", // 焦點時的背景色
                        },
                    }}
                >
                    <MenuItem value="" disabled sx={{ color: "#999" }}>
                        {placeholder}
                    </MenuItem>
                    {options.map((group) => [
                        <ListSubheader
                            key={`header-${group.groupLabel}`}
                            sx={{
                                fontWeight: "bolder",
                                color: "black",
                            }}
                        >
                            {group.groupLabel}
                        </ListSubheader>,
                        ...group.items.map((item) => (
                            <MenuItem
                            id={item.label}
                                key={item.value}
                                value={item.value}
                                sx={{
                                    padding: "10px 20px",
                                    "&:hover": {
                                        backgroundColor: "#f0f0f0", // 項目懸停時的背景色
                                    },
                                }}
                            >
                                {item.label}
                            </MenuItem>
                        )),
                    ])}
                </Select>
            </FormControl>
        </Box>
    );
};

export default GroupedSelect2;
