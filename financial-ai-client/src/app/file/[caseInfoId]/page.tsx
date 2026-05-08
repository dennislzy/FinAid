/* eslint-disable */
'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box } from "@mui/material";
import FileTable from "../file_table";
import { CaseInfoProps } from "@/type/common/common";
import SideBar2 from "@/component/sideBar/sideBar2";
import { InsideBox } from "@/component/styles/outerBoxStyle";
import FinAidBreadcrumbs from "@/component/breadcrumb/fin-aid-breadcrumbs";

const File = ({ params }: CaseInfoProps) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const { caseInfoId } = params;

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const fileLinks = [
    { href: "/", label: "個案總覽" },
    { href: `/file/${caseInfoId}`, label: "語音助手" },
  ]

  return <>
    <FinAidBreadcrumbs title="語音助手" links={fileLinks} caseInfoId={caseInfoId} />
    {/* <SideBar2 caseInfoId={caseInfoId}/> */}
    <Box sx={InsideBox}>
      {/* <SideBar2 caseInfoId={caseInfoId} /> */}
      <FileTable caseInfoId={caseInfoId}/>
    </Box>
  </>
}

export default File;