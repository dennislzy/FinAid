import InputHalfColumn from '@/component/column/inputHalfColumn';
import ReadInputHalfColumn from '@/component/column/readInputHalfColumn';
import { useAlert } from '@/layout/context/alertProvider';
import { useUpdateStockMutation } from '@/redux/rtk/stockApi';
import { StockPurchaseResponse } from '@/type/entity/entityType';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { Control, useForm } from 'react-hook-form';
import { DialogTitleStyle, DialogButtonStyle, DialogContentPadding } from '@/component/styles/dialogStyles';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from "@mui/icons-material/Edit";

interface EditProps {
  stockPurchase: StockPurchaseResponse,
  setValue?: (name: string, id: string) => void
}

// 之後將會接收主鍵和總覽api的函式
const StockEditDialog = (editProps: EditProps) => {
  const { handleSubmit, setValue, control, reset } = useForm();

  const [cookies] = useCookies()
  const { stockPurchase } = editProps
  const [open, setOpen] = useState(false); // 控制 Dialog 顯示狀態
  const handleOpen = () => {
    setOpen(true);
    reset()
  }; // 打開 Dialog
  const handleClose = () => setOpen(false); // 關閉 Dialog

  const { showAlert } = useAlert()
  const [updateStock] = useUpdateStockMutation()

  const handler = async (data: any) => {
    try {
      await updateStock({
        socialWorkerEmail: cookies.user,
        caseInfoId: stockPurchase.caseInfo.caseInfoId,
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

            <ReadInputHalfColumn
              label={'股票代碼'}
              id={'stockCode'}
              isSelectItem={false}
              selectItem={undefined}
              type={undefined}
              control={control as Control<any>}
              value={editProps.stockPurchase?.['stockCode']}
              setValue={setValue}
            />
            <ReadInputHalfColumn
              label={'最新購買日期'}
              id={'stockPurchaseDate'}
              isSelectItem={false}
              selectItem={undefined}
              type={'date'}
              control={control as Control<any>}
              value={editProps.stockPurchase?.['stockPurchaseDate']}
              setValue={setValue}
            />
            <InputHalfColumn
              label={'股數'}
              id={'shares'}
              isSelectItem={false}
              selectItem={undefined}
              type={undefined}
              control={control as Control<any>}
              value={editProps.stockPurchase?.['shares']}
              setValue={setValue}
            />
            <InputHalfColumn
              label={'平均每股買進金額'}
              id={'averageBuyPrice'}
              isSelectItem={false}
              selectItem={undefined}
              type={undefined}
              control={control as Control<any>}
              value={editProps.stockPurchase?.['averageBuyPrice']}
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

export default StockEditDialog;
