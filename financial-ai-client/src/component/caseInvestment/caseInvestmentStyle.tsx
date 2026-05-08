/* eslint-disable @typescript-eslint/no-unused-vars */
import { CaseDiv } from "@/styledComponents/casestyled";
import { backButton, backgroundBox, formBackground, head1, head1Underline, headstyle, submitButtonFontSize } from "@/styledComponents/formCss";
import { Box, Button, Link } from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomPagination from "../pagination/CustomPagination";
import InvestmentTab, { investmentValue } from "../report/tabs/InvestmentTab";
import { useRouter } from 'next/navigation';
import BackToOverview from "../case/backToOverview";

interface InvestmentProps{
    children:React.ReactNode,
    caseInfoId:string,
    investmentType:string,
    investmentValue:string,
    totalNum:number,
    onChangePage?:(event: React.ChangeEvent<unknown>, value: number) => void
    page:number
}
export default function CaseInvestmentStyle(investProps:InvestmentProps){
const router=useRouter()

const [value, setValue] = useState(investProps.investmentValue)

const handleChange = (event: React.SyntheticEvent, newValue: investmentValue) => {
    setValue(newValue); // **立即更新選中的 Tab**
    router.push(`/caseInvestment/${investProps.caseInfoId}/${newValue}`);
};
  
  return (
        // 頁面背景
    <div>
      
    {
      <center>
        <CaseDiv>
          {/* 標題文字 */}
          <h1><b style={head1}>{`投資明細`}</b></h1>
          <div className="" style={{display:"flex", alignItems: 'center', justifyContent: 'center'}}>
            <InvestmentTab 
              investmentValue={value}
              onChange={handleChange}
            />
          </div>
          <Box sx={backgroundBox}>
            {/* 盒子裡的內容(正文) */}
                          
              {/* <span style={headstyle}><b>{`${investProps.investmentType}投資明細`}</b></span> */}
              {/* <br></br> */}
              <Box  sx={{width:"80%"}}>
                {/* <br></br> */}
                {investProps.children}
                {/* <br></br> */}
              </Box>
              <Box sx={{display:"flex",justifyContent:"center",marginTop:'20px',fontSize:'30px'}}>
                <CustomPagination  onChange={investProps.onChangePage} page={investProps.page} count={investProps.totalNum} /> 
              </Box>
          </Box>
          <BackToOverview /> 
        </CaseDiv>
        
        {/* <Link href={`/caseInvestment/${investProps.caseInfoId}`}>
          <Button          
            variant="contained" 
            size="large" 
            sx={backButton}
          >
            <b style={submitButtonFontSize}>回上一頁</b>
          </Button>
        </Link> */}
        <br></br>
        {/* <br></br> 
        <br></br> */}
      </center>
    }
  </div>
    )
}