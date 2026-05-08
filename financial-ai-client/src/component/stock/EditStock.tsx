import StockEditDialog from "@/app/caseInvestment/[caseInfoId]/Stock/stockEditDialog"
import { gridboxstyle } from "@/styledComponents/formCss"
import { StockPurchaseResponse } from "@/type/entity/entityType"
import { Box, Grid2 } from "@mui/material"
import { Control, useForm } from "react-hook-form"
import { stockInvestmentList1 } from "../column/columnList"
import ReadInputHalfColumn from "../column/readInputHalfColumn"
interface EditProps{
    stockPurchaseResponse:StockPurchaseResponse,
}
const EditStock=(editProps:EditProps)=>{
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
                stockInvestmentList1.map((column)=>
                    <ReadInputHalfColumn
                      key={column.id}
                      label={column.label}
                      id={column.id}
                      isSelectItem={column.isSelectItem}
                      selectItem={column.selectItem}
                      type={column.type}
                      control={control as Control<any>}
                      value={editProps.stockPurchaseResponse?.[column.id]}
                      setValue={setValue}
                    />
                ) 
              }
              {/* 這裡是編輯 */}
              <StockEditDialog setValue={setValue}  stockPurchase={editProps.stockPurchaseResponse} />
              <br></br>
            </Box>
          </Grid2>
        </>
    )
}
export default EditStock