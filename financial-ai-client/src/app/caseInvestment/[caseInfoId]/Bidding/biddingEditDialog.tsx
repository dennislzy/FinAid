import { biddingInvestmentList1 } from '@/component/column/columnList';
import InputHalfColumn from '@/component/column/inputHalfColumn';
import EditIcon from "@mui/icons-material/Edit";
import { useAlert } from '@/layout/context/alertProvider';
import { useUpdateAidMutation } from '@/redux/rtk/aidApi';
import { AidAssociationResponse } from '@/type/entity/entityType';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { Control, useForm } from 'react-hook-form';
import { DialogTitleStyle, DialogButtonStyle, DialogContentPadding} from '@/component/styles/dialogStyles';
import CloseIcon from '@mui/icons-material/Close';
interface BiddingEditProps {
  setValue?: (name: string, id: string) => void
  aidResponse: AidAssociationResponse
}

// 之後將會接收主鍵和總覽api的函式
const BiddingEditDialog = (biddingProps: BiddingEditProps) => {
  const { handleSubmit, setValue, control, reset } = useForm();
  const { aidResponse } = biddingProps
  const [open, setOpen] = useState(false); // 控制 Dialog 顯示狀態
  const handleOpen = () => {
    setOpen(true);
    reset()
  }; // 打開 Dialog
  const handleClose = () => setOpen(false); // 關閉 Dialog

  const [updateAid] = useUpdateAidMutation()
  const [cookies] = useCookies()
  const { showAlert } = useAlert()

  const handler = async (data: any) => {

    const { startDate, endDate } = data;
    if (startDate > endDate) {
      alert("結束日期不能早於開始日期");
      return;
    }

    try {
      await updateAid({
        socialWorkerEmail: cookies.user,
        caseInfoId: aidResponse.caseInfo?.caseInfoId,
        aidAssociationId: aidResponse.aidAssociationId as string,
        ...data
      }).unwrap()
      showAlert('編輯成功', 'success')
    } catch (error) {
      showAlert('編輯失敗', 'error')
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
            {
              biddingInvestmentList1.map((column) =>
                <InputHalfColumn
                  key={column.id}
                  label={column.label}
                  id={column.id}
                  isSelectItem={column.isSelectItem}
                  selectItem={column.selectItem}
                  type={column.type}
                  setValue={setValue}
                  value={aidResponse?.[column.id]}
                  control={control as Control<any>}
                />
              )
            }
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

export default BiddingEditDialog;
