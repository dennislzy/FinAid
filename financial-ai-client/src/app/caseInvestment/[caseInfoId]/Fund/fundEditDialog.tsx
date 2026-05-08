/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable */
/* eslint-disable unused-imports/no-unused-vars */
import { fundInvestmentList2, fundInvestmentList3 } from '@/component/column/columnList';
import InputHalfColumn from '@/component/column/inputHalfColumn';
import ReadInputHalfColumn from '@/component/column/readInputHalfColumn';
import { useAlert } from '@/layout/context/alertProvider';
import { useDeleteFundMutation, useUpdateFundMutation } from '@/redux/rtk/fundApi';
import { FundInvestResponse } from '@/type/entity/entityType';
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { Control, useForm } from 'react-hook-form';
import { DialogTitleStyle, DialogButtonStyle, DialogContentPadding, DialogButtonStyleDanger } from '@/component/styles/dialogStyles';
import CloseIcon from '@mui/icons-material/Close';

interface EditProps {
  fundInvestment: FundInvestResponse,
  setValue?: (name: string, id: string) => void
}

const FundEditDialog = (editProps: EditProps) => {
  const { handleSubmit, setValue, control, reset } = useForm();

  const [cookies] = useCookies();
  const { fundInvestment } = editProps;
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
    reset()
  }; // 打開 Dialog
  const handleClose = () => setOpen(false);

  const { showAlert } = useAlert();
  const [updateFund] = useUpdateFundMutation();
  const [deleteFund] = useDeleteFundMutation()

  const handler = async (data: any) => {
    try {
      await updateFund({
        socialWorkerEmail: cookies.user,
        caseInfoId: fundInvestment.caseInfo.caseInfoId,
        ...data
      }).unwrap();
      showAlert("操作成功！", "success");
    } catch (error) {
      showAlert("操作失敗！", "error");
    }
    handleClose();
  };

  return (
    <div>
      <EditIcon onClick={handleOpen} />

      <Dialog
        open={open}
        onClose={handleClose}
        disableEnforceFocus
        disableRestoreFocus
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
          width: "100%",
          margin: 0,
          padding: 0,
        }}>
          <DialogContent sx={DialogContentPadding}>

            {fundInvestmentList2.map((column) => (
              <ReadInputHalfColumn
                key={column.id}
                label={column.label}
                id={column.id}
                isSelectItem={column.isSelectItem}
                selectItem={column.selectItem}
                type={column.type}
                control={control as Control<any>}
                value={editProps.fundInvestment?.[column.id]}
                setValue={setValue}
              />
            ))}
            {fundInvestmentList3.map((column) => (
              <InputHalfColumn
                key={column.id}
                label={column.label}
                id={column.id}
                isSelectItem={column.isSelectItem}
                selectItem={column.selectItem}
                type={column.type}
                control={control as Control<any>}
                value={editProps.fundInvestment?.[column.id]}
                setValue={setValue}
              />
            ))}
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

export default FundEditDialog;