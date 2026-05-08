"use client";

import * as React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Card,
  CardContent,
  Menu,
  MenuItem,
  ListSubheader,
  Avatar,
  FormControl,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import {
  ChevronLeft,
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
  MoreVert,
  DonutLarge,
  DonutLargeOutlined,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import Link from "next/link";
import { useState, useEffect } from "react";
import SmallSidebar from "./smallSideBar";
import { OuterBox } from "../styles/outerBoxStyle";
import { useGetAllCasesQuery } from "@/redux/rtk/caseApi";
import { getCaseRedirectUrl } from "@/styledComponents/switchCase";
import { getSidebarItems } from "./sideList";

interface NewSidebarNeed {
  caseInfoId?: string | string[];
  children: React.ReactNode;
}

export default function NewSidebar({ caseInfoId, children }: NewSidebarNeed) {
  const [bigSidebarOpen, setBigSidebarOpen] = useState(true);
  const [smallSidebarOpen, setSmallSidebarOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isTablet = useMediaQuery("(min-width: 601px) and (max-width: 1023px)");
  const router = useRouter();
  const [cookies] = useCookies();
  const pathName = usePathname();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open2 = Boolean(anchorEl);

  const { data: result } = useGetAllCasesQuery({
    socialWorkerEmail: cookies.user,
    sortBy: "caseInfoCreateTime",
    order: "desc",
  });

  const [selectedCaseName, setSelectedCaseName] = useState<string>("");

  useEffect(() => {
    if (caseInfoId && result) {
      const currentCase = result.find((row) => row.caseInfoId === caseInfoId);
      if (currentCase) {
        setSelectedCaseName(currentCase.caseInfoName);
      }
    }
  }, [caseInfoId, result]);

  useEffect(() => {
    if (isMobile) {
      setBigSidebarOpen(false);
      setSmallSidebarOpen(false);
    } else if (isTablet) {
      setBigSidebarOpen(false);
      setSmallSidebarOpen(true);
    } else {
      setBigSidebarOpen(true);
      setSmallSidebarOpen(false);
    }
  }, [isMobile, isTablet]);

  useEffect(() => {
    setIsClient(true);
  }, [cookies]);

  const handleBigSidebarToggle = () => {
    setBigSidebarOpen(!bigSidebarOpen);
    setSmallSidebarOpen(true);
    setHamburgerOpen(false);
  };

  const handleSmallSidebarToggle = () => {
    setSmallSidebarOpen(!smallSidebarOpen);
    setBigSidebarOpen(true);
    setHamburgerOpen(false);
  };

  const handleHamburgerToggle = () => {
    setHamburgerOpen(!hamburgerOpen);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    router.push("/login");
  };

  const handleCaseChange = (event: SelectChangeEvent) => {
    const newCaseName = event.target.value as string;
    setSelectedCaseName(newCaseName);
    const selectedCase = result?.find((row) => row.caseInfoName === newCaseName);
  
    if (selectedCase) {
      const newCaseInfoId = selectedCase.caseInfoId;
      const newUrl = getCaseRedirectUrl(pathName, newCaseInfoId);
      router.push(newUrl);
    }
  };
  

  const sideList = getSidebarItems(caseInfoId);

  const bigDrawerWidth = bigSidebarOpen ? 250 : 0;
  const smallDrawerWidth = smallSidebarOpen ? 80 : 0;

  return (
    <>
      {isClient ? (
        <Box sx={{ display: "flex" }}>
          {/* 大 Sidebar */}
          <Drawer
            variant="permanent"
            sx={{
              width: bigDrawerWidth,
              flexShrink: 0,
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                width: bigDrawerWidth,
                boxSizing: "border-box",
                overflowX: "hidden",
                border: "none",
                borderRight: "1px solid #f6f7f8",
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
            <List sx={{ padding: 0 }}>
              <ListItem sx={{
                padding: 2, height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between",
                position: "sticky",     // ✅ 讓它固定
                top: 0,                 // ✅ 固定在最上方
                backgroundColor: "white", // ✅ 防止滾動時透明
                zIndex: 10,             // ✅ 確保不會被覆蓋
               
              }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box component="img" src="/assets/FinAId.png" sx={{ height: 40, mr: 1 }} />
                  <Typography sx={{ fontWeight: "bold" }}>FinAId 智財幫</Typography>
                </Box>
                <IconButton onClick={handleBigSidebarToggle}>
                  <ChevronLeft />
                </IconButton>
              </ListItem>



              <ListItem>
                <Link href="/" style={{ textDecoration: "none", width: "100%", color: "#637381", fontWeight: "850" }}>
                  <ListItemButton
                    sx={{
                      borderRadius: "10px",
                      ...(pathName === "/"
                        ? {
                          backgroundColor: (theme) => theme.palette.primary.main,
                          color: (theme) => theme.palette.primary.contrastText,
                          fontWeight: "bold",
                          "&:hover": {
                            backgroundColor: (theme) => theme.palette.primary.main,
                            color: (theme) => theme.palette.primary.contrastText,
                            fontWeight: "bold",
                          },
                        }
                        : {
                          "&:hover": { backgroundColor: "#4f596614", fontWeight: "bold" },
                        }),
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 35,
                        ...(pathName === "/" ? { color: (theme) => theme.palette.primary.contrastText } : { color: "#637381" }),
                      }}
                    >
                      {pathName === "/" ? <Person /> : <PersonOutlineOutlined />}
                    </ListItemIcon>
                    <ListItemText
                      primary="個案總覽"
                      sx={{
                        ...(pathName === "/"
                          ? { "& .MuiListItemText-primary": { fontSize: "0.875rem", fontWeight: "bolder" } }
                          : { "& .MuiListItemText-primary": { fontSize: "0.875rem", fontWeight: "bolder" } }),
                      }}
                    />
                  </ListItemButton>
                </Link>
              </ListItem>

              {caseInfoId && (
                <List component="nav" subheader={<ListSubheader sx={{ backgroundColor: "transparent", fontWeight: "bold", fontSize: "0.6875rem", paddingLeft: 4 }}>個案功能列</ListSubheader>}>
                  {sideList.map((item) => (
                    <ListItem key={item.name}>
                      <Link href={item.url} style={{ textDecoration: "none", width: "100%", color: "#637381" }}>
                        <ListItemButton
                          sx={{
                            borderRadius: "10px",
                            ...(pathName.startsWith(item.test) || pathName.startsWith(item.test2)
                              ? {
                                backgroundColor: (theme) => theme.palette.primary.main,
                                color: (theme) => theme.palette.primary.contrastText,
                                fontWeight: "bold",
                                "&:hover": {
                                  backgroundColor: (theme) => theme.palette.primary.main,
                                  color: (theme) => theme.palette.primary.contrastText,
                                  fontWeight: "bold",
                                },
                              }
                              : {
                                "&:hover": { backgroundColor: "#4f596614", fontWeight: "bold" },
                              }),
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 35,
                              ...(pathName.startsWith(item.test) || pathName.startsWith(item.test2)
                                ? { color: (theme) => theme.palette.primary.contrastText }
                                : { color: "#637381" }),
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
                          </ListItemIcon>
                          <ListItemText
                            primary={item.name}
                            sx={{
                              ...(pathName.startsWith(item.test) || pathName.startsWith(item.test2)
                                ? { "& .MuiListItemText-primary": { fontSize: "0.875rem", fontWeight: "bold" } }
                                : { "& .MuiListItemText-primary": { fontSize: "0.875rem", fontWeight: "bold" } }),
                            }}
                          />
                        </ListItemButton>
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
                <CardContent sx={{ padding: 2, "&:last-child": { paddingBottom: 2 }, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{
                    display: "flex", alignItems: "center", gap: 2
                  }}>
                    <Avatar alt={cookies.name}>
                      {cookies.name}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontSize: "0.875rem", fontWeight: 500 }}>{cookies.name}</Typography>
                      <Typography variant="body2" sx={{ fontSize: "0.75rem", color: "text.secondary" }}>一般社工</Typography>
                    </Box>
                  </Box>
                  <IconButton size="small" onClick={handleClick} aria-controls={open2 ? "app-menu" : undefined} aria-haspopup="true" aria-expanded={open2 ? "true" : undefined}>
                    <MoreVert />
                  </IconButton>
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

          {/* 小 Sidebar */}
          <Drawer
            variant="permanent"
            sx={{
              width: smallDrawerWidth,
              flexShrink: 0,
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                width: smallDrawerWidth,
                boxSizing: "border-box",
                overflowX: "hidden",
                border: "none",
                borderRight: "1px solid #f6f7f8",
                height: "100vh",
                transition: "width 0.3s ease",
                "&::-webkit-scrollbar": { display: "none" },
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              },
            }}
          >
            <SmallSidebar open={smallSidebarOpen} onToggle={handleSmallSidebarToggle} caseInfoId={caseInfoId} socialWorkerName={cookies.name} />
          </Drawer>

          {/* 漢堡選單（行動裝置） */}
          {isMobile && (
            <>
              {/* 漢堡圖標，只有在選單關閉時顯示 */}
              {!hamburgerOpen && (
                <IconButton onClick={handleHamburgerToggle} sx={{ position: "fixed", top: 10, left: 10, zIndex: 1300 }}>
                  <MenuIcon />
                </IconButton>
              )}
              <Drawer
                variant="temporary"
                open={hamburgerOpen}
                onClose={handleHamburgerToggle}
                sx={{
                  "& .MuiDrawer-paper": {
                    width: 250,
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    border: "none",
                    borderRight: "1px solid #f6f7f8",
                  },
                }}
              >
                <List>
                  <ListItem sx={{ padding: 2, height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box component="img" src="/assets/FinAId.png" sx={{ height: 40, mr: 1 }} />
                      <Typography sx={{ fontWeight: "bold" }}>FinAId 智財幫</Typography>
                    </Box>
                    {/* <IconButton onClick={handleHamburgerToggle}>
                      <ChevronLeft />
                    </IconButton> */}
                  </ListItem>

                  <ListItem>
                    <Link href="/" style={{ textDecoration: "none", width: "100%", color: "#637381", fontWeight: "850" }}>
                      <ListItemButton
                        sx={{
                          borderRadius: "10px",
                          ...(pathName === "/"
                            ? {
                              backgroundColor: (theme) => theme.palette.primary.main,
                              color: (theme) => theme.palette.primary.contrastText,
                              fontWeight: "bold",
                              "&:hover": {
                                backgroundColor: (theme) => theme.palette.primary.main,
                                color: (theme) => theme.palette.primary.contrastText,
                                fontWeight: "bold",
                              },
                            }
                            : {
                              "&:hover": { backgroundColor: "#4f596614", fontWeight: "bold" },
                            }),
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 35,
                            ...(pathName === "/" ? { color: (theme) => theme.palette.primary.contrastText } : { color: "#637381" }),
                          }}
                        >
                          {pathName === "/" ? <Person /> : <PersonOutlineOutlined />}
                        </ListItemIcon>
                        <ListItemText
                          primary="個案總覽"
                          sx={{
                            ...(pathName === "/"
                              ? { "& .MuiListItemText-primary": { fontSize: "0.875rem", fontWeight: "bolder" } }
                              : { "& .MuiListItemText-primary": { fontSize: "0.875rem", fontWeight: "bolder" } }),
                          }}
                        />
                      </ListItemButton>
                    </Link>
                  </ListItem>

                  {caseInfoId && (
                    <List component="nav" subheader={<ListSubheader sx={{ backgroundColor: "transparent", fontWeight: "bold", fontSize: "0.6875rem", paddingLeft: 4 }}>個案功能列</ListSubheader>}>
                      {sideList.map((item) => (
                        <ListItem key={item.name}>
                          <Link href={item.url} style={{ textDecoration: "none", width: "100%", color: "#637381" }}>
                            <ListItemButton
                              sx={{
                                borderRadius: "10px",
                                ...(pathName.startsWith(item.test) || pathName.startsWith(item.test2)
                                  ? {
                                    backgroundColor: (theme) => theme.palette.primary.main,
                                    color: (theme) => theme.palette.primary.contrastText,
                                    fontWeight: "bold",
                                    "&:hover": {
                                      backgroundColor: (theme) => theme.palette.primary.main,
                                      color: (theme) => theme.palette.primary.contrastText,
                                      fontWeight: "bold",
                                    },
                                  }
                                  : {
                                    "&:hover": { backgroundColor: "#4f596614", fontWeight: "bold" },
                                  }),
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 35,
                                  ...(pathName.startsWith(item.test) || pathName.startsWith(item.test2)
                                    ? { color: (theme) => theme.palette.primary.contrastText }
                                    : { color: "#637381" }),
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
                              </ListItemIcon>
                              <ListItemText
                                primary={item.name}
                                sx={{
                                  ...(pathName.startsWith(item.test) || pathName.startsWith(item.test2)
                                    ? { "& .MuiListItemText-primary": { fontSize: "0.875rem", fontWeight: "bold" } }
                                    : { "& .MuiListItemText-primary": { fontSize: "0.875rem", fontWeight: "bold" } }),
                                }}
                              />
                            </ListItemButton>
                          </Link>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </List>

                <Box sx={{ mt: "auto" }}>
                  <Card sx={{ boxShadow: 0, borderRadius: 0, backgroundColor: "#fafafa" }}>
                    <CardContent sx={{ padding: 2, "&:last-child": { paddingBottom: 2 }, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar alt={cookies.name}>
                          {cookies.name}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontSize: "0.875rem", fontWeight: 500 }}>{cookies.name}</Typography>
                          <Typography variant="body2" sx={{ fontSize: "0.75rem", color: "text.secondary" }}>一般社工</Typography>
                        </Box>
                      </Box>
                      <IconButton size="small" onClick={handleClick} aria-controls={open2 ? "app-menu" : undefined} aria-haspopup="true" aria-expanded={open2 ? "true" : undefined}>
                        <MoreVert />
                      </IconButton>
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
            </>
          )}

          <Box
            component="main"
            sx={{
              ...(pathName.startsWith("/channel2") ? {
                flexGrow: 1,
                padding: 0,  // 移除padding
                width: "100%",
                display: "flex", // 使用flex布局
                height: "100vh", // 确保高度铺满
                overflow: "hidden" // 防止溢出内容导致滚动条
              } : OuterBox),
            }}
          >

            {pathName !== "/" &&
              pathName !== "/case" &&
              pathName !== "/supervisor" &&
              !pathName.startsWith("/case_file") &&
              !pathName.startsWith("/channel2") &&
              (
                <Box
                  sx={{
                    position: "fixed", // 固定定位
                    top: 20,            // 距離畫面上方 20px
                    right: 20,          // 距離畫面右側 20px
                    zIndex: 1300,       // 確保不會被其他元素遮住
                    display: "flex",
                    justifyContent: "flex-end",
                    mb: 2,
                  }}
                >
                  <FormControl size="small" sx={{ minWidth: 200 }}>
                    <Select
                      value={selectedCaseName}
                      onChange={handleCaseChange}
                      displayEmpty
                      sx={{
                        border: "2px solid rgba(145, 158, 171, 0.08)",
                        borderRadius: "15px",
                        backgroundColor: "#fff",
                        boxShadow: "0px 5px 13px 0px rgba(145,158,171,0.11)",
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
                              <Avatar sx={{ width: 40, height: 40 }} />
                              選擇個案
                            </Box>
                          );
                        }
                        const selectedCase = result?.find((row) => row.caseInfoName === selected);
                        return (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar
                              src={selectedCase?.caseInfoImage || "/static/images/avatar/1.jpg"}
                              sx={{ width: 40, height: 40 }}
                            />
                            {selected}
                          </Box>
                        );
                      }}
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value="" disabled>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar sx={{ width: 40, height: 40 }} />
                          選擇個案
                        </Box>
                      </MenuItem>
                      {result?.map((row) => (
                        <MenuItem key={row.caseInfoId} value={row.caseInfoName}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar
                              src={row.caseInfoImage || "/static/images/avatar/1.jpg"}
                              sx={{ width: 40, height: 40 }}
                            />
                            {row.caseInfoName}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

              )}

            {children}
          </Box>
        </Box>
      ) : null}
    </>
  );
}