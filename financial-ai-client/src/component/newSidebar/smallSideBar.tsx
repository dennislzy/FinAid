"use client";

import type * as React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  IconButton,
  Card,
  CardContent,
  Menu,
  MenuItem,
  Tooltip,
  ListItemText,
  Avatar,
} from "@mui/material";
import BarChartIcon from '@mui/icons-material/BarChart';
import AudioFileIcon from "@mui/icons-material/AudioFile";
import {
  ChevronRight,
  AssignmentInd,
  AssignmentIndOutlined,
  Paid,
  PaidOutlined,
  CalendarMonth,
  CalendarMonthOutlined,
  BarChart,
  InsertChartOutlined,
  AdminPanelSettings,
  AdminPanelSettingsOutlined,
  SmartToy,
  SmartToyOutlined,
  Person,
  PersonOutlineOutlined,
  Logout,
  DonutLarge,
  DonutLargeOutlined,
} from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { getSidebarItems } from "./sideList";

interface SmallSidebarProps {
  open: boolean;
  onToggle: () => void;
  caseInfoId?: string | string[];
  socialWorkerName: string
}

export default function SmallSidebar({ open, onToggle, caseInfoId, socialWorkerName }: SmallSidebarProps) {
  const router = useRouter();
  const pathName = usePathname();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open2 = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    router.push("/login");
  };

  const sideList = getSidebarItems(caseInfoId);
  

  const drawerWidth = open ? 80 : 0;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          overflowX: "hidden",
          border: "none",
          borderRight: "1px solid #f6f7f8",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transition: "width 0.1s ease",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        },
      }}
    >
      <List sx={{padding: 0}}>
        <Box
          sx={{
            padding: 0,
            position: "sticky",     // ✅ 讓它固定
            top: 0,                 // ✅ 固定在最上方
            backgroundColor: "white", // ✅ 防止滾動時透明
            zIndex: 10,             // ✅ 確保不會被覆蓋
          }}>
          <ListItem sx={{
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Box component="img" src="/assets/FinAId.png" sx={{ height: 40 }} />
          </ListItem>

          <ListItem sx={{ padding: 2, height: "64px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <IconButton size="large" onClick={onToggle}>
              <ChevronRight />
            </IconButton>
          </ListItem>
        </Box>
     
        <ListItem>
          <Link href="/" style={{ textDecoration: "none", width: "100%", color: "#262626" }}>
            <Tooltip title="個案總覽" arrow placement="right">
              <IconButton
                size="large"
                sx={{
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  ...(pathName === "/"
                    ? {
                      backgroundColor: (theme) => theme.palette.primary.light,
                      color: (theme) => theme.palette.primary.main,
                      "&:hover": {
                        backgroundColor: (theme) => theme.palette.primary.light,
                        color: (theme) => theme.palette.primary.main,
                      },
                    }
                    : {
                      "&:hover": { color: "#262626", backgroundColor: "#4f596614" },
                    }),
                }}
              >
                {pathName === "/" ? <Person /> : <PersonOutlineOutlined />}
              </IconButton>
            </Tooltip>
          </Link>
        </ListItem>

        {caseInfoId && (
          <List>
            {sideList.map((item) => (
              <ListItem key={item.name} sx={{ justifyContent: "center" }}>
                <Link href={item.url} style={{ textDecoration: "none", width: "100%", color: "#262626" }}>
                  <Tooltip title={item.name} arrow placement="right">
                    <IconButton
                      size="large"
                      sx={{
                        borderRadius: "10px",
                        ...(pathName.startsWith(item.test) || pathName.startsWith(item.test2)
                          ? {
                            backgroundColor: (theme) => theme.palette.primary.light,
                            color: (theme) => theme.palette.primary.main,
                            fontWeight: "bold",
                            "&:hover": {
                              backgroundColor: (theme) => theme.palette.primary.light,
                              color: (theme) => theme.palette.primary.main,
                              fontWeight: "bold",
                            },
                          }
                          : {
                            "&:hover": { color: "#262626", backgroundColor: "#4f596614", fontWeight: "bold" },
                          }),
                      }}
                    >
                      {
                        (() => {
                          const Icon = pathName.startsWith(item.test) || pathName.startsWith(item.test2)
                            ? item.icon
                            : item.outlinedIcon;
                          return <Icon />; // ✅ 把元件呼叫出來
                        })()
                      }
                    </IconButton>
                  </Tooltip>
                </Link>
              </ListItem>
            ))}
          </List>
        )}
      </List>

      <Box sx={{
        position: "sticky",
        bottom: 0,
        zIndex: 9,
        backgroundColor: "#fafafa",
        borderTop: "1px solid #f0f0f0",
      }}>
        <Card sx={{ boxShadow: 0, borderRadius: 0, backgroundColor: "#fafafa" }}>
          <CardContent sx={{ padding: 2, "&:last-child": { paddingBottom: 2 }, display: "flex", justifyContent: "center" }}>
            <Box
              sx={{
                flexShrink: 0,
                cursor: "pointer",
              }}
              onClick={handleClick}
            >
              <Avatar alt={socialWorkerName}>
                {socialWorkerName}
              </Avatar>
            </Box>
            <Menu id="app-menu" anchorEl={anchorEl} open={open2} onClose={handleClose} MenuListProps={{ "aria-labelledby": "app-button" }}>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                <ListItemText>登出</ListItemText>
              </MenuItem>
            </Menu>
          </CardContent>
        </Card>
      </Box>
    </Drawer>
  );
}