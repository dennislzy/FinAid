'use client';
import { useAlert } from '@/layout/context/alertProvider';
import { useCreateHouseholdYearMutation } from '@/redux/rtk/householdYearApi';
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
import { DialogTitleStyle, DialogButtonStyle, DialogContentPadding } from '../styles/dialogStyles';
interface CashDialogYearProps {
    financialCategory: string;
    options: Array<{
        groupLabel: string;
        items: Array<{ value: string | number; label: string }>;
    }>;
    selectedYear: number | null; // 從父層傳入的年份
    financialType: string
    caseInfoId: string
}

const CashDialogYear: React.FC<CashDialogYearProps> = ({
    financialCategory,
    options,
    selectedYear, // 從父層傳入的年份
    financialType,
    caseInfoId
}) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        reset()
        setOpen(true)
    };

    const handleClose = () => {
        // reset()
        setOpen(false);
    };

    const [createHouseholdYear] = useCreateHouseholdYearMutation()
    const { control, handleSubmit, setValue, reset } = useForm()
    const [cookies] = useCookies()
    const { showAlert } = useAlert()

    const handle = async (data: unknown) => {
        try {
            await createHouseholdYear({
                socialWorkerEmail: cookies.user,
                caseInfoId: caseInfoId,
                ...data,
                year: selectedYear,
                financialType: financialType
            }).unwrap()
            showAlert('操作成功', 'success')
            // reset()
        } catch (error) {
            showAlert(handleError(error as ErrorType), 'error')
        }
        handleClose()
    }

    return (
        <>
            <Button
                onClick={handleClickOpen}
                id='add-button'
            >
                <AddIcon/> 新增
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
                                id='financialCategory'
                                control={control}
                                placeholder="請選擇類型"
                                label="項目名稱"
                                setValue={setValue}
                                value={undefined}
                            />
                            <CustomTextField
                                label="項目金額"
                                setValue={setValue}
                                value={0}
                                placeholder="請輸入金額"
                                id='money'
                                control={control}
                            />

                        </Box>

                    </DialogContent>
                    <DialogActions>
                        <Button
                            type='submit'
                            sx={DialogButtonStyle}
                        >
                            新增
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export default CashDialogYear;
