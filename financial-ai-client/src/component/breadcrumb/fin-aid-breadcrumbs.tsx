"use client";

import { Box, Breadcrumbs, Typography, FormControl, Select, MenuItem, Avatar, type SelectChangeEvent } from "@mui/material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import { useGetAllCasesQuery } from "@/redux/rtk/caseApi";
import { getCaseRedirectUrl } from "@/styledComponents/switchCase";

// Define style variables
const styles = {
  title: {
    fontSize: "1.5rem",
    fontWeight: 800,
    color: "#1c252e",
    marginBottom: "1.0rem",
  },
  breadcrumb: {
    fontSize: "0.875rem",
    fontWeight: 400,
    color: "#1c252e",
    // textDecoration: "none",
    // "&:hover": {
    //   textDecoration: "underline",
    // },
  },
  separator: {
    color: "#1c252e",
    fontSize: "0.875rem",
    margin: "0 8px",
  },
  select: {
    fontSize: "0.875rem",
    fontWeight: 400,
    color: "#1c252e",
    "& .MuiSelect-select": {
      display: "flex",
      alignItems: "center",
      gap: 1,
      padding: "0 8px", // 與麵包屑一致的間距
    },
    "& .MuiSelect-icon": {
      color: "#888",
    },
    "& fieldset": {
      border: "none",
    },
  },
};

// Define the link type
type BreadcrumbLink = {
  href: string;
  label: string;
};

interface FinAidBreadcrumbsProps {
  title: string;
  links: BreadcrumbLink[];
  caseInfoId?: string | string[];
}

export default function FinAidBreadcrumbs({ title, links, caseInfoId }: FinAidBreadcrumbsProps) {
  const router = useRouter();
  const [cookies] = useCookies();
  const pathName = usePathname();

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
  

  return (
    <Box
      sx={{
        marginTop: 3,
        marginBottom: 5,
      }}
    >
      {/* 大標題 */}
      <Typography sx={styles.title}>{title}</Typography>

      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<Typography sx={styles.separator}>•</Typography>}
        aria-label="breadcrumb"
      >
        {links.map((link, index) => (
          <Link key={index} href={link.href} style={styles.breadcrumb}>
            {link.label}
          </Link>
        ))}
        {/* 個案切換 Select */}
        {pathName !== "/" && pathName !== "/case" && pathName !== "/supervisor" && !pathName.startsWith("/case_file") && (
          <FormControl size="small">
            <Select
              value={selectedCaseName}
              onChange={handleCaseChange}
              displayEmpty
              sx={styles.select}
              renderValue={(selected) => {
                if (!selected) {
                  return <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>選擇個案</Box>;
                }
                const selectedCase = result?.find((row) => row.caseInfoName === selected);
                return (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {/* <Avatar src={selectedCase?.caseInfoImage || "/static/images/avatar/1.jpg"} sx={{ width: 24, height: 24 }} /> */}
                    {selected}
                  </Box>
                );
              }}
            >
              <MenuItem value="" disabled>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>選擇個案</Box>
              </MenuItem>
              {result?.map((row) => (
                <MenuItem key={row.caseInfoId} value={row.caseInfoName}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {/* <Avatar src={row.caseInfoImage || "/static/images/avatar/1.jpg"} sx={{ width: 24, height: 24 }} /> */}
                    {row.caseInfoName}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Breadcrumbs>
    </Box>
  );
}