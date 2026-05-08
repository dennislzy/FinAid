import InputHalfColumn from '@/component/column/inputHalfColumn';
import EditIcon from "@mui/icons-material/Edit";
import { useAlert } from '@/layout/context/alertProvider';
import { useDeleteAllowanceMutation, useUpdateAllowanceMutation } from '@/redux/rtk/allowanceApi';
import { AllowancePurchaseResponse, StockPurchaseResponse } from '@/type/entity/entityType';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { Control, useForm } from 'react-hook-form';
import { DialogTitleStyle, DialogButtonStyle, DialogContentPadding, DialogButtonStyleDanger } from '@/component/styles/dialogStyles';
import CloseIcon from '@mui/icons-material/Close';
interface EditProps {
  allowancePurchase: AllowancePurchaseResponse,
  setValue?: (name: string, id: string) => void
}

// 之後將會接收主鍵和總覽api的函式
const AllowanceEditDialog = (editProps: EditProps) => {
  const [cookies] = useCookies()
  const { allowancePurchase } = editProps
  const [open, setOpen] = useState(false); // 控制 Dialog 顯示狀態
  const handleOpen = () => {
    setOpen(true);
    reset()
  }; // 打開 Dialog
  const handleClose = () => setOpen(false); // 關閉 Dialog

  const { handleSubmit, setValue, control, reset } = useForm();
  const { showAlert } = useAlert()
  const [updateAllowance] = useUpdateAllowanceMutation()

  const handler = async (data: any) => {
    try {

      const { applyTime, receiveTime } = data;
      if (applyTime > receiveTime) {
        alert("結束日期不能早於開始日期");
        return;
      }

      await updateAllowance({
        socialWorkerEmail: cookies.user,
        caseInfoId: allowancePurchase.caseInfo.caseInfoId,
        subsidyId: allowancePurchase.subsidyId,
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
      <EditIcon onClick={handleOpen} />
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
              label={'津貼/補助名稱'}
              id={'subsidyName'}
              isSelectItem={false}
              selectItem={undefined}
              type={undefined}
              control={control as Control<any>}
              value={editProps.allowancePurchase?.['subsidyName']}
              setValue={setValue}
            />
            <InputHalfColumn
              label={'金額'}
              id={'money'}
              isSelectItem={false}
              selectItem={undefined}
              type={undefined}
              control={control as Control<any>}
              value={editProps.allowancePurchase?.['money']}
              setValue={setValue}
            />
            <InputHalfColumn
              label={'申請時間'}
              id={'applyTime'}
              isSelectItem={false}
              selectItem={undefined}
              type={'date'}
              control={control as Control<any>}
              value={editProps.allowancePurchase?.['applyTime']}
              setValue={setValue}
            />
            <InputHalfColumn
              label={'領取日期'}
              id={'receiveTime'}
              isSelectItem={false}
              selectItem={undefined}
              type={'date'}
              control={control as Control<any>}
              value={editProps.allowancePurchase?.['receiveTime']}
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

export default AllowanceEditDialog;
