import { Box } from "@mui/material"
import Image from "next/image"

export default function CaseInvestmentNoData () {

    return(
        <>
            <div>
                <p style={{fontSize:"25px",color:"#3c6cb9"}}>
                    點擊右下角新增一筆新資料
                </p>
                <Box>
                    <Image src="/assets/robot.gif" priority quality={100} alt="" width={300} height={300}/>
                </Box>              
            </div>
        </>
    )
}