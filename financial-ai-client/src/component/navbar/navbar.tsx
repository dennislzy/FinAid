/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { useAlert } from "@/layout/context/alertProvider";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCookies } from "react-cookie";

interface CaseInfoId {
  caseInfoId?: string | string[];
}

const Navbar = ({ caseInfoId }: CaseInfoId) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const router = useRouter();
  const [cookies] = useCookies();
  const [isClient, setIsClient] = useState(false);
  const { showAlert } = useAlert();
  const pathName = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, [cookies]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // 登出
  function logOut() {
    router.push("/login");
  }

  const sideList = [
    { url: `/account_manage`, name: "首頁", test: `/account_manage`, test2: `/notExist` },
    { url: `/account_manage/account_apply`, name: "審核申請", test: `/account_manage/account_apply`, test2: `/notExist` },
  ];

  const sideListForSupervisor = [
    { url: `/supervisor`, name: "首頁", test: `/supervisor`, test2: `/notExist` },
    { url: `/supervisor/transit`, name: "轉移個案", test: `/supervisor/transit`, test2: `/notExist` },
  ];

  const [nowPage, setNowPage] = useState("其他頁面"); // 預設標題

  useEffect(() => {
    const currentPage = 
      sideList.find((item) => pathName === item.test || pathName === item.test2) ||
      sideListForSupervisor.find((item) => pathName === item.test || pathName === item.test2);
    if (currentPage) {
      setNowPage(currentPage.name); // 更新標題為對應名稱
    } else {
      setNowPage("其他頁面");
    }
  }, [pathName]);

  // 按鈕的基本樣式
  const buttonStyle = {
    textTransform: "none",
    color: "#fff",
    backgroundColor: (theme) => theme.palette.primary.light,
    "&:hover": {
      backgroundColor: "#dbdbdb",
    },
    borderRadius: 1,
    p: 1,
    mr: 1,
  };

  return (
    <>
      {isClient ? (
        <AppBar
          component="header"
          sx={{
            backgroundColor: (theme) => theme.palette.primary.main,
            position: "static",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            zIndex: "10",
          }}
        >
          <Toolbar>
            <Box component="img" src="/assets/finAidWhite.png" sx={{ height: 40, mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: "#fff" }}>
              <Link href="/" style={{ color: "#fff", textDecoration: "none", fontWeight: "bold" }} id="main">
                FinAId 智財幫
              </Link>
            </Typography>

            {/* 當路徑以 /account_manage 開頭時顯示首頁和審核帳號按鈕 */}
            {pathName.startsWith("/account_manage") && cookies.name && (
              <>
                {sideList.map((item) => (
                  <Button
                    key={item.name}
                    component={Link}
                    href={item.url}
                    sx={{
                      mr: 2,
                      color: "#fff",
                      textTransform: "none",
                      border: pathName === item.test ? "1px solid white" : "none",
                    }}
                  >
                    {item.name}
                  </Button>
                ))}
              </>
            )}

            {/* 當路徑以 /supervisor 開頭時顯示首頁和轉移個案按鈕 */}
            {pathName.startsWith("/supervisor") && cookies.name && (
              <>
                {sideListForSupervisor.map((item) => (
                  <Button
                    key={item.name}
                    component={Link}
                    href={item.url}
                    sx={{
                      mr: 2,
                      color: "#fff",
                      textTransform: "none",
                      border: pathName === item.test ? "1px solid white" : "none",
                    }}
                  >
                    {item.name}
                  </Button>
                ))}
              </>
            )}

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {cookies.name && (
                <Typography sx={{ textTransform: "none", color: "#fff", fontWeight: "bold" }}>
                  {cookies.name}
                </Typography>
              )}
              {cookies.user && typeof cookies.user === "string" && (
                <Button onClick={logOut} id="logout" sx={{ color: "#fff", textTransform: "none" }}>
                  登出
                </Button>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      ) : null}
    </>
  );
};

export default Navbar;