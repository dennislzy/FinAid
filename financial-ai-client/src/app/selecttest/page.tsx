"use client";
import { Avatar, Box, FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React from "react";
import { useGetAllCasesQuery } from "@/redux/rtk/caseApi";
import { useCookies } from "react-cookie";

export default function CaseSelect() {
  const [age, setAge] = React.useState("");
  const [cookies] = useCookies();
  const { data: result } = useGetAllCasesQuery({
    socialWorkerEmail: cookies.user,
    sortBy: "caseInfoCreateTime",
    order: "desc",
  });

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

  return (
    <FormControl size="small" sx={{ m: 1, minWidth: 120 }}>
      <Select
        value={age}
        onChange={handleChange}
        displayEmpty
        sx={{
          border: "2px solid rgba(145, 158, 171, 0.08)",
          borderRadius: "15px",
          backgroundColor: "#fff",
          "& .MuiSelect-select": {
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: 1,
          },
          "& .MuiSelect-icon": {
            color: "#888",
          },
          "& fieldset": {
            border: "none",
          },
        }}
        renderValue={(selected) => {
          if (!selected) {
            return (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {/* 改動 1：移除彩色邊框，僅顯示簡單的 Avatar */}
                <Avatar sx={{ width: 40, height: 40 }} />
                個案名稱
              </Box>
            );
          }

          // 改動 2：當有選中值時，顯示選中的個案名稱和對應的 Avatar
          const selectedCase = result?.rows.find((row) => row.caseInfoName === selected);
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar
                src={selectedCase?.caseInfoImage || "/static/images/avatar/1.jpg"}
                sx={{ width: 40, height: 40 }}
                // onError={(e) => {
                //   e.currentTarget.src = "/static/images/avatar/1.jpg";
                // }}
              />
              {selected}
            </Box>
          );
        }}
        inputProps={{ "aria-label": "Without label" }}
      >
        <MenuItem value="">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ width: 40, height: 40 }} />
            當前個案
          </Box>
        </MenuItem>
        {result?.rows?.map((row) => (
          <MenuItem key={row.caseInfoId} value={row.caseInfoName}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar
                src={row.caseInfoImage || "/static/images/avatar/1.jpg"}
                sx={{ width: 40, height: 40 }}
                // onError={(e) => {
                //   e.currentTarget.src = "/static/images/avatar/1.jpg";
                // }}
              />
              {row.caseInfoName}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}