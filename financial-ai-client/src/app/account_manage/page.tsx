"use client"
import { OuterBox } from "@/component/styles/outerBoxStyle"
import { Box, styled, Tab, Tabs, Typography } from "@mui/material"
import React from "react";
import GroupList from "./group_list";
import SupervisorBreadcrumbs from "@/component/breadcrumb/S_Breadcrumb";

export default function AccountManage() {
  const [value, setValue] = React.useState('all');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const CustomTab = styled(Tab)(({ theme }) => ({
    textTransform: "none",
    fontWeight: 500,
    px: 2,
    py: 1,
    color: "#666",
    "&.Mui-selected": {
      color: "#000",
      fontWeight: 600,
      backgroundColor: "transparent",
    },
    "&:hover": {
      color: "#000",
      backgroundColor: "transparent",
    },
  }));

    const allGroupLinks = [
    { href: "/account_manage", label: "" },

  ];

  return <>
    <Box>
      {/* <Typography variant="h5" fontWeight="bold" sx={{ mt: 4 }}>歡迎回來 👋</Typography> */}
      <SupervisorBreadcrumbs title="所有督導組別" links={allGroupLinks} />
      <GroupList />


      {/* <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="custom tabs"
        sx={{
          paddingTop: 2,
          borderBottom: "3px solid #f6f7f8",
          "& .MuiTabs-indicator": {
            backgroundColor: "black",
            height: 2.5,
          },
        }}
      >
        <CustomTab value="all" label="所有團隊" />
        <CustomTab value="basic" label="基層社工" />
        <CustomTab value="supervisor" label="督導社工" />
      </Tabs>
      <Box>
        {value === "all" && <>
          <GroupList />
        </>}
        {value === "basic" && <>
          basic
        </>}
        {value === "supervisor" && <>
          basic
        </>}
      </Box> */}
    </Box>
  </>
}