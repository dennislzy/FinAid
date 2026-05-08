/* eslint-disable @typescript-eslint/no-unused-vars */
import StockEditDialog from "@/app/caseInvestment/[caseInfoId]/Stock/stockEditDialog"
import { gridboxstyle } from "@/styledComponents/formCss"
import { AllowancePurchaseResponse, BondResponse, StockPurchaseResponse } from "@/type/entity/entityType"
import { Box, Grid2 } from "@mui/material"
import { Control, useForm } from "react-hook-form"
import { allowanceInvestmentList, bondList, stockInvestmentList1 } from "../column/columnList"
import ReadInputHalfColumn from "../column/readInputHalfColumn"
import AllowanceEditDialog from "@/app/caseInvestment/[caseInfoId]/Allowance/allowanceEditDialog"
import BondEditDialog from "@/app/caseInvestment/[caseInfoId]/Bond/bondEditDialog"
interface EditProps{
    bondResponse:BondResponse,
}
const EditBond=(editProps:EditProps)=>{
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
                bondList.map((column)=>
                    <ReadInputHalfColumn
                      key={column.id}
                      label={column.label}
                      id={column.id}
                      isSelectItem={column.isSelectItem}
                      selectItem={column.selectItem}
                      type={column.type}
                      control={control as Control<any>}
                      value={editProps.bondResponse?.[column.id]}
                      // 預設值，之後要改
                      setValue={setValue}
                    />
                ) 
              }
              {/* 這裡是編輯 */}
              <BondEditDialog setValue={setValue}  bondResponse={editProps.bondResponse} />
              <br></br>
            </Box>
          </Grid2>
        </>
    )
}
export default EditBond