"use client";
import { AuthGuardProvider } from "@/auth/authProvider";
import Navbar from "@/component/navbar/navbar";
import NewSideBar from "@/component/newSidebar/newSidebar";
import { AlertProvider } from "@/layout/context/alertProvider";
import { store } from "@/redux/store";
import { CustomTheme } from "@/theme/CustomTheme";
import { Box } from "@mui/material";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { useEffect, useState } from "react";
import { CookiesProvider, useCookies } from "react-cookie";
import { Provider } from "react-redux";
import { usePathname, useParams, useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathName = usePathname();
  const { caseInfoId } = useParams();
  const [cookies, setCookie, removeCookie] = useCookies(["user", "name", "Permission"]);
  const [isClient, setIsClient] = useState(false);
  const [clientPathName, setClientPathName] = useState<string | null>(null);
  const [clientCaseInfoId, setClientCaseInfoId] = useState<string | string[] | undefined>(undefined);

  // 初始化客戶端狀態
  useEffect(() => {
    setIsClient(true);
    setClientPathName(pathName);
    setClientCaseInfoId(caseInfoId);
  }, [pathName, caseInfoId]);

  // 偵測用戶活動並刷新 Cookie，實現 1 小時自動登出
  useEffect(() => {
    const refreshUserCookie = () => {
      if (!cookies.user || clientPathName === "/login" || clientPathName === "/register") {
        return;
      }
      if (cookies.user) {
        setCookie("user", cookies.user, { path: "/", maxAge: 3600 });
      }
      if (cookies.name) {
        setCookie("name", cookies.name, { path: "/", maxAge: 3600 });
      }
      if (cookies.Permission) {
        setCookie("Permission", cookies.Permission, { path: "/", maxAge: 3600 });
      }
    };

    let timeout: NodeJS.Timeout;

    const handleActivity = () => {
      clearTimeout(timeout);
      refreshUserCookie();
      timeout = setTimeout(() => {
        // 1 小時無活動時登出
        removeCookie("user", { path: "/" });
        removeCookie("name", { path: "/" });
        removeCookie("Permission", { path: "/" });
        router.push("/login");
      }, 3600 * 1000);
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("scroll", handleActivity);

    handleActivity();

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      clearTimeout(timeout);
    };
  }, [cookies.user, clientPathName, removeCookie, router, setCookie]);

  // 更新 shouldUseSidebar 條件，排除 /account_manage 路徑
  const shouldUseSidebar =
    clientPathName &&
    !["/register", "/login"].includes(clientPathName) &&
    !clientPathName.startsWith("/supervisor") &&
    !clientPathName.startsWith("/account_manage");

  // 渲染邏輯
  const renderContent = () => {
    if (!clientPathName) {
      return <Box>Loading...</Box>;
    }
    if (["/register", "/login"].includes(clientPathName)) {
      return children;
    }
    if (clientPathName.startsWith("/supervisor") || clientPathName.startsWith("/account_manage")) {
      return (
        <>
          <Navbar />
          {children}
        </>
      );
    }
    return <NewSideBar caseInfoId={clientCaseInfoId}>{children}</NewSideBar>;
  };

  if (!isClient) {
    return null;
  }

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, height: "100vh", overflow: "auto" }}>
        <ThemeProvider theme={CustomTheme}>
          <Provider store={store}>
            <CookiesProvider>
              <AuthGuardProvider>
                <AlertProvider>
                  <Box
                  component="main"
                  sx={{ height: "100%", overflowY: "auto", display: "flex", flexDirection: "column" }}
                >
                    {renderContent()}
                  </Box>
                </AlertProvider>
              </AuthGuardProvider>
            </CookiesProvider>
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}