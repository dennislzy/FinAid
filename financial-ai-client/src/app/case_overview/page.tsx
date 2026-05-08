"use client"
import Box from "@mui/material/Box";

import CaseTable from "./case_table";
import SearchBar from "./search_input";
import { useState } from "react";
import { InsideBox } from "@/component/styles/outerBoxStyle";
import { Button } from "@mui/material";
import { useRouter } from 'next/navigation';
import AddIcon from '@mui/icons-material/Add';
import FinAidBreadcrumbs from "@/component/breadcrumb/fin-aid-breadcrumbs";

const CaseOverview = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const router = useRouter()
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const caseAllLinks = [
    { href: "/", label: "個案總覽" },
  ]

  return <>
    <FinAidBreadcrumbs title="個案總覽" links={caseAllLinks} />
    {/* 將 handleSearch 傳遞給 SearchBar */}

    <Box sx={InsideBox}>
      <Box sx={{ padding: 3, display: "flex", justifyContent: "flex-end" }}>
          <SearchBar onSearch={handleSearch} />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/case')}
            id='add-case-button'
          >
            新增
          </Button>
      </Box>
      <CaseTable searchKeyword={searchKeyword} />
    </Box>
  </>;
};

export default CaseOverview;
