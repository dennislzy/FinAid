import FundEditDialog from "@/app/caseInvestment/[caseInfoId]/Fund/fundEditDialog"
import { gridboxstyle } from "@/styledComponents/formCss"
import { FundInvestResponse } from "@/type/entity/entityType"
import { Box, Grid2 } from "@mui/material"
import { Control, useForm } from "react-hook-form"
import { fundInvestmentList1 } from "../column/columnList"
import ReadInputHalfColumn from "../column/readInputHalfColumn"
interface EditProps{
    fundResponse:FundInvestResponse,
}
const EditFund=(editProps:EditProps)=>{
    const { control,setValue} = useForm();
    return (
        <>
            <Grid2 size={{ xs: 12, md: 6 }}>
            {/* <br></br>
            <br></br> */}

              
              <Box sx={gridboxstyle}>                     
                <br></br>
                <br></br>
                {
                  fundInvestmentList1.map((column)=>
                      <ReadInputHalfColumn
                        key={column.id}
                        label={column.label}
                        id={column.id}
                        isSelectItem={column.isSelectItem}
                        selectItem={column.selectItem}
                        type={column.type}
                        value={editProps.fundResponse?.[column.id]}
                        control={control as Control<any>}
                        setValue={setValue}
                      />
                  ) 
                }
                {/* 這裡是編輯 */}
                <FundEditDialog setValue={setValue} fundInvestment={editProps.fundResponse} />
                <br></br>
              </Box>
            </Grid2>
        </>
    )
}
export default EditFund