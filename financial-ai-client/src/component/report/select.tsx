'use client';

import {
  Box,
  FormControl,
  ListSubheader,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { DialogSelectedStyle } from "../styles/dialogStyles";
interface GroupedOption {
  groupLabel: string;
  items: { value: string | number; label: string }[];
}

interface GroupedSelectProps {
  id: string;
  options: GroupedOption[];
  control: any; // react-hook-form 的控制物件
  placeholder?: string;
  label?: string;
  setValue:(name:string,value:any)=>void
  value:any
}

const GroupedSelect = ({
  id,
  options,
  control,
  placeholder = "請選擇",
  label = "類型",
  setValue,
  value
}: GroupedSelectProps) => {
  useEffect(() => {
    setValue(id,value)
     // 手動同步更新到 React Hook Form 的狀態
  }, [value, control, id]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minWidth: "200px",
      }}
    >
      {label && (
        <Typography
          sx={{
            mb: 2,
          }}
          variant="body1"
        >
          {label}
        </Typography>
      )}
      <FormControl>
        <Controller
          name={id}
          control={control}
          defaultValue={value}
          render={({ field }) => (
            <Select
            id={id}
              {...field}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
             sx={DialogSelectedStyle}
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
                    key={item.value}
                    value={item.value}
                    id={item.value.toString()}
                    sx={{
                      padding: "10px 20px",
                      "&:hover": {
                        backgroundColor: "#f0f0f0",
                      },
                    }}
                  >
                    {item.label}
                  </MenuItem>
                )),
              ])}
            </Select>
          )}
        />
      </FormControl>
    </Box>
  );
};

export default GroupedSelect;
