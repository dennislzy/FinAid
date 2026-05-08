import BiddingEditDialog from "@/app/caseInvestment/[caseInfoId]/Bidding/biddingEditDialog"
import { gridboxstyle } from "@/styledComponents/formCss"
import { AidAssociationResponse } from "@/type/entity/entityType"
import { Box, Grid2 } from "@mui/material"
import { Control, useForm } from "react-hook-form"
import { biddingInvestmentList1 } from "../column/columnList"
import ReadInputHalfColumn from "../column/readInputHalfColumn"
interface EditAidProps{
    aidResponse:AidAssociationResponse,
}
const EditAid=(editAidProps:EditAidProps)=>{
    const {control,setValue}=useForm()
    const {aidResponse}=editAidProps
    return (
        <>
            <Grid2 size={{ xs: 12, md: 6 }}>
            {/* <br></br>
            <br></br> */}
                <Box sx={gridboxstyle}>                     
                <br></br>
                <br></br>
                {
                    biddingInvestmentList1.map((column)=>
                        <ReadInputHalfColumn
                        key={column.id}
                        label={column.label}
                        id={column.id}
                        isSelectItem={column.isSelectItem}
                        selectItem={column.selectItem}
                        type={column.type}
                        value={aidResponse?.[column.id]}
                        control={control as Control<any>}
                        setValue={setValue}
                        />
                    ) 
                }
                {/* 這裡是編輯 */}
                <BiddingEditDialog aidResponse={aidResponse} setValue={setValue} />
                <br></br>
                </Box> 
             </Grid2>
        </>
    )
}
export default EditAid