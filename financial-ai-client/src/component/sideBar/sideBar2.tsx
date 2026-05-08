import React from 'react';
import { Box} from '@mui/material';
import {  css2 } from './sideBarCss';
import Image from "next/image"
import { useRouter } from "next/navigation";

interface cid{
  caseInfoId: string;
}
export default function SideBar2 ({caseInfoId}: cid)  {
    
    const router = useRouter();
  
    return (
    <Box
      sx={css2}
    >
    <Image src="/assets/robot.gif" width={165} height={0} style={{ height: "auto" }}  priority quality={100} alt="" onClick={() => {router.push(`/channel2/${caseInfoId}/chat`)}} />
    
    </Box>
  );
};

