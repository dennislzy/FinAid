/* eslint-disable @typescript-eslint/no-unused-vars */
import { dialogActionButton, dialogAddSubmitButton, dialogDeleteButton, dialogSubmitButton, gridboxstyle2, headstyle2, submitButtonFontSizeSmall, submitButtonSmall } from "@/styledComponents/formCss"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Fab, Grid2, IconButton } from "@mui/material"
import { Control, useForm } from "react-hook-form"
import { InputColumnProps } from "../column/columnList"
import InputHalfColumn from "../column/inputHalfColumn"
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import ReadInputHalfColumn from "../column/readInputHalfColumn";
import { refreshPage } from "@/type/common/common";
import { DialogTitleStyle, DialogContentPadding, DialogButtonStyle } from "../styles/dialogStyles";
import CloseIcon from '@mui/icons-material/Close';
interface AreaProps{
    handle:(data:any)=>void
    children?:React.ReactNode
    caseInvestMentList:InputColumnProps[]
    // resetForm: () => void  // 新增 resetForm 屬性
}
const CaseInvestmentArea=(areaProps:AreaProps)=>{
    const {handleSubmit,control,reset}=useForm()
    const {handle,caseInvestMentList,children,}=areaProps

    const [open, setOpen] = useState(false); // 控制 Dialog 顯示狀態

    const handleOpen = () => {
      reset()
      setOpen(true)
    }; // 打開 Dialog

    const handleClose = () => setOpen(false);  // 關閉 Dialog

   
    return (
        <>
        {/* <Box>
          <span style={headstyle2}><b>新增</b></span>
          <br></br>
          <br></br>
          <Box sx={gridboxstyle2} >
            <form onSubmit={handleSubmit(handle)} >
              <br></br>
              <br></br>
              {caseInvestMentList.map((column) => (
                <InputHalfColumn
                  key={column.id}
                  label={column.label}
                  id={column.id}
                  isSelectItem={column.isSelectItem}
                  selectItem={column.selectItem}
                  type={column.type}
                  control={control as Control<any>}
                  value={column.value}
                />
            ))}
              <Button type="submit" sx={submitButtonSmall}><b style={submitButtonFontSizeSmall}>新增</b></Button>
              <br></br>
              <br></br>
            </form>
          </Box>
        </Box>
        <br></br> */}

        {/* <Grid2 container rowSpacing={1} columnSpacing={{ xs: 0, sm: 0, md: 0 }} > */}

          {/* 這塊Grid2是閱讀，每筆資料一塊Grid2 */}
          {/* {children} */}
        {/* </Grid2> */}
        
        {/* 下面是新增dialog */}
        <Box sx={{ padding: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
              onClick={handleOpen}
              id='add-button'
          >
              <AddIcon/> 新增
          </Button>
        </Box>
        {/* <Fab
          color="primary"
          aria-label="add"
          sx={dialogActionButton}
          onClick={handleOpen}
          id="add-button"
        >
          <AddIcon />
        </Fab> */}
        <Dialog
          open={open}
          onClose={handleClose}
          disableEnforceFocus // 禁用焦點強制
          disableRestoreFocus // 禁用關閉時焦點恢復
          maxWidth="sm" 
          fullWidth 
          PaperProps={{ sx: { padding: 3 } }}
        >   
          <DialogTitle sx={DialogTitleStyle}>
            新增
              <IconButton sx={{ marginLeft: 'auto' }} onClick={handleClose} id="cancel">
                      <CloseIcon />
                    </IconButton>
            </DialogTitle>
          <form onSubmit={handleSubmit(handle)}>
            <DialogContent sx={DialogContentPadding}>
              {/* 在這裡放置 Dialog 的內容 */}
              <Box>
                  {caseInvestMentList.map((column) => (
                  <InputHalfColumn
                    key={column.id}
                    label={column.label}
                    id={column.id}
                    isSelectItem={column.isSelectItem}
                    selectItem={column.selectItem}
                    type={column.type}
                    required={column.required}
                    control={control as Control<any>}
                    value={column.value}
                  />
                  ))} 
              </Box>
            </DialogContent>
            <DialogActions>
              <Button type="submit" sx={DialogButtonStyle} onClick={handleClose} id="submit">
                送出
              </Button>
            </DialogActions>
          </form>
          <br></br>
        </Dialog>

        </>
    )
}
export default CaseInvestmentArea