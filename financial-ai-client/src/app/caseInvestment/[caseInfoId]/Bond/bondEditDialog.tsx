import InputHalfColumn from '@/component/column/inputHalfColumn';
import { useAlert } from '@/layout/context/alertProvider';
import {  useUpdateBondMutation } from '@/redux/rtk/bondApi';
import { AllowancePurchaseResponse, BondResponse, StockPurchaseResponse } from '@/type/entity/entityType';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { useState } from 'react';
import EditIcon from "@mui/icons-material/Edit";
import { useCookies } from 'react-cookie';
import { Control, useForm } from 'react-hook-form';
import { DialogTitleStyle, DialogButtonStyle, DialogContentPadding, DialogButtonStyleDanger } from '@/component/styles/dialogStyles';
import CloseIcon from '@mui/icons-material/Close';
interface EditProps {
  bondResponse: BondResponse,
  setValue?: (name: string, id: string) => void
}

// 之後將會接收主鍵和總覽api的函式
const BondEditDialog = (editProps: EditProps) => {
  const { handleSubmit, setValue, control, reset } = useForm();

  const [cookies] = useCookies()
  const { bondResponse } = editProps
  const [open, setOpen] = useState(false); // 控制 Dialog 顯示狀態
  const handleOpen = () => {
    setOpen(true);
    reset()
  }; // 打開 Dialog
  const handleClose = () => setOpen(false); // 關閉 Dialog

  const { showAlert } = useAlert()
  const [updateBond] = useUpdateBondMutation()

  const handler = async (data: any) => {
    try {
      await updateBond({
        socialWorkerEmail: cookies.user,
        caseInfoId: bondResponse.caseInfo.caseInfoId,
        bondId: bondResponse.bondId,
        ...data
      }).unwrap()
      showAlert("操作成功！", "success")
    } catch (error) {
      showAlert("操作失敗！", "error");
    }
    handleClose()
  };

  return (
    <div>
      {/* 開啟 Dialog 的按鈕 */}
      <EditIcon onClick={handleOpen} />


      {/* Dialog 組件 */}
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
          編輯
          <IconButton sx={{ marginLeft: 'auto' }} onClick={handleClose} id='cancel-btn'>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit(handler)} style={{
          width: "100%", // 確保與外層寬度一致
          margin: 0,
          padding: 0,
        }}>
          <DialogContent sx={DialogContentPadding}>
            {/* 在這裡放置 Dialog 的內容 */}

            {/* 下面預設值與id,label部分記得要改 */}
            <InputHalfColumn
              label={'債券名稱'}
              id={'bondName'}
              isSelectItem={false}
              selectItem={undefined}
              type={undefined}
              control={control as Control<any>}
              value={editProps.bondResponse?.['bondName']}
              setValue={setValue}
            />
            <InputHalfColumn
              label={'公司名稱'}
              id={'companyName'}
              isSelectItem={false}
              selectItem={undefined}
              type={undefined}
              control={control as Control<any>}
              value={editProps.bondResponse?.['companyName']}
              setValue={setValue}
            />
            <InputHalfColumn
              label={'金額'}
              id={'money'}
              isSelectItem={false}
              selectItem={undefined}
              type={undefined}
              control={control as Control<any>}
              value={editProps.bondResponse?.['money']}
              setValue={setValue}
            />
            <InputHalfColumn
              label={'購買日期'}
              id={'applyTime'}
              isSelectItem={false}
              selectItem={undefined}
              type={'date'}
              control={control as Control<any>}
              value={editProps.bondResponse?.['applyTime']}
              setValue={setValue}
            />
          </DialogContent>
          <DialogActions>
            <Button type="submit" sx={DialogButtonStyle} id='submit-btn'>
              送出
            </Button>
          </DialogActions>
        </form>
        <br></br>
      </Dialog>
    </div>
  );
};

export default BondEditDialog;
