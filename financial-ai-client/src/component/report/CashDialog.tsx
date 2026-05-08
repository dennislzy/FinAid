'use client';
import { useAlert } from '@/layout/context/alertProvider';
import { useCreateHouseholdMonthlyMutation } from '@/redux/rtk/householdMonthyApi';
import { ErrorType } from '@/type/dto/dto';
import { handleError } from '@/utils/config';
import AddIcon from '@mui/icons-material/Add';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
} from '@mui/material';
import * as React from 'react';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';
import GroupedSelect from './select';
import CustomTextField from './textfield';
import CloseIcon from '@mui/icons-material/Close';
import { DialogTitleStyle, DialogButtonStyle,  DialogContentPadding } from '../styles/dialogStyles';
interface CashDialogProps {
    financialCategory: string;
    options: Array<{
        groupLabel: string;
        items: Array<{ value: string | number; label: string }>;
    }>;
    selectedYear: number | null;
    selectedMonth: number | null;
    caseInfoId: string,
    financialType: string
}

const CashDialog: React.FC<CashDialogProps> = ({
    financialCategory,
    options,
    selectedYear,
    selectedMonth,
    caseInfoId,
    financialType
}) => {
    const [open, setOpen] = useState(false);
    const { handleSubmit, setValue, control, reset } = useForm()
    const { showAlert } = useAlert()
    const [cookies] = useCookies()

    const handleClickOpen = () => {
        reset()
        setOpen(true)
    };
    const handleClose = () => setOpen(false);

    const [createHouseholdMonthly] = useCreateHouseholdMonthlyMutation()

    const handle = async (data: any) => {
        try {
            await createHouseholdMonthly({
                socialWorkerEmail: cookies.user,
                caseInfoId: caseInfoId,
                financialType: financialType,
                monthly: selectedMonth,
                financialCategory: financialCategory,
                year: selectedYear,
                ...data
            }).unwrap()
            showAlert('新增成功', 'success')
            // reset()
        } catch (error) {
            showAlert(handleError(error as ErrorType), 'error')
        }
        handleClose()
    };

    return (
        <>
            <Button
                onClick={handleClickOpen}
                id='add-button'
            >
                <AddIcon /> 新增
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { padding: 3 } }}
            >
                <form onSubmit={handleSubmit(handle)} >
                    <DialogTitle sx={DialogTitleStyle}>
                        {`新增${financialCategory}資料`}

                        <IconButton sx={{ marginLeft: 'auto' }} onClick={handleClose} id='cancel-btn'>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent sx={DialogContentPadding}>
                        <Box
                            sx={{
                                mb: 6,
                                gap: '30px',
                                display: 'flex',
                                alignItems: 'flex-end',
                            }}
                        >
                            <GroupedSelect
                                options={options}
                                value={undefined}
                                setValue={setValue}
                                placeholder="請選擇類型"
                                label="項目名稱"
                                id='financialCategory'
                                control={control}
                            />
                            <CustomTextField
                                label="項目金額"
                                value={0}
                                placeholder="請輸入金額"
                                setValue={setValue}
                                id='money'
                                control={control}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                       
                        <Button
                            type='submit'
                            sx={DialogButtonStyle}
                            id='submit-btn'
                        >
                            新增
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export default CashDialog;
