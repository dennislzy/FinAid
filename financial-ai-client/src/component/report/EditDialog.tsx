import { useAlert } from "@/layout/context/alertProvider";
import { useUpdateHouseholdMonthlyMutation } from "@/redux/rtk/householdMonthyApi";
import { ErrorType } from "@/type/dto/dto";
import { HouseholdMonthlyFinancialRecords } from "@/type/entity/entityType";
import { handleError } from "@/utils/config";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import GroupedSelect from "./select";
import CustomTextField from "./textfield";
import CloseIcon from '@mui/icons-material/Close';
import { DialogTitleStyle, DialogButtonStyle, DialogContentPadding } from '../styles/dialogStyles';


interface EditDialogProps {
    open: boolean;
    onClose: () => void;
    rowData: HouseholdMonthlyFinancialRecords
}

const EditDialog: React.FC<EditDialogProps> = ({
    open,
    onClose,
    rowData,
}) => {
    // 初始化時檢查 rowData

    const [formData, setFormData] = useState<HouseholdMonthlyFinancialRecords>(rowData);

    useEffect(() => {
        setFormData(rowData);
    }, [rowData]);

    // 動態選項設置
    const options = React.useMemo(() => {
        const optionsMap: Record<string, { groupLabel: string; items: { value: string; label: string }[] }[]> = {
            收入: [
                {
                    groupLabel: "收入",
                    items: [
                        { value: '薪資', label: '薪資' },
                        // { value: '津貼', label: '津貼' },
                        // { value: '補助', label: '補助' },
                        // { value: "投資收入", label: "投資收入" },
                        { value: "其他收入", label: "其他收入" },
                    ]
                }
            ],
            支出: [
                {
                    groupLabel: "支出", items: [
                        { value: "食物", label: "食物" },
                        { value: "衣服", label: "衣服" },
                        { value: "房租(貸)", label: "房租(貸)" },
                        { value: "交通", label: "交通" },
                        { value: "教育費用", label: "教育費用" },
                        { value: "娛樂", label: "娛樂" },
                        { value: "醫療", label: "醫療" },
                        { value: "電信費用", label: "電信費用" },
                        { value: "孩童費用", label: "孩童費用" },
                        { value: "孝親費", label: "孝親費" },
                        // { value: "社會保險", label: "社會保險" },
                        // { value: "商業保險", label: "商業保險" },
                        { value: "自提勞退", label: "自提勞退" },
                        // { value: "儲蓄", label: "儲蓄" },
                        // { value: "投資支出", label: "投資支出" },
                        // { value: "信用卡", label: "信用卡" },
                        // { value: "信貸", label: "信貸" },
                        // { value: "車貸", label: "車貸" },
                        // { value: "朋友", label: "朋友" },
                        { value: "其他費用", label: "其他費用" },
                    ]
                }
            ],
            資產: [
                {
                    groupLabel: "資產", items: [
                        { value: "現金", label: "現金" },
                        { value: "活存", label: "活存" },
                        { value: "定存", label: "定存" },
                        { value: "壽險", label: "壽險" },
                        { value: "投資現額", label: "投資現額" },
                        { value: "汽(機)車", label: "汽(機)車" },
                        { value: "其他資產", label: "其他資產" },
                    ]
                }
            ],
            負債: [
                {
                    groupLabel: "負債", items: [
                        { value: "信用卡未還餘額", label: "信用卡未還餘額" },
                        { value: "信貸未還餘額", label: "信貸未還餘額" },
                        { value: "車貸未還餘額", label: "車貸未還餘額" },
                        { value: "朋友借款", label: "朋友借款" },
                        { value: "其他負債", label: "其他負債" },
                    ]
                }
            ]
        };
        return optionsMap[formData.financialType] || [];
    }, [formData.financialType]);

    const { control, setValue, handleSubmit } = useForm()

    const [updateHousehold] = useUpdateHouseholdMonthlyMutation()

    const [cookies] = useCookies()
    const { showAlert } = useAlert()

    const handle = async (data: any) => {
        try {
            await updateHousehold({
                socialWorkerEmail: cookies.user,
                caseInfoId: rowData.caseInfo?.caseInfoId,
                financialMonthlyRecordsId: rowData.financialMonthlyRecordsId,
                year: rowData.year,
                monthly: rowData.monthly,
                financialType: rowData.financialType,
                ...data
            }).unwrap()
            showAlert('編輯成功', 'success')
        } catch (error) {
            showAlert(handleError(error as ErrorType), 'error')
        }
        onClose()
    };


    return (
        <Dialog open={open} onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { padding: 3 } }}
        >
            <form onSubmit={handleSubmit(handle)}>
                <DialogTitle sx={DialogTitleStyle}>
                    編輯{formData.financialType}資料

                    <IconButton sx={{ marginLeft: 'auto' }} onClick={onClose} id='cancel-btn'>
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
                            value={formData.financialCategory}
                            label="類型"
                            control={control}
                            setValue={setValue}
                            id="financialCategory"
                        />
                        <CustomTextField
                            label="金額"
                            value={formData.money}
                            control={control}
                            setValue={setValue}
                            id="money"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>

                    <Button type="submit" variant="contained"
                        id="save-button"
                        sx={DialogButtonStyle}>
                        儲存
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EditDialog;
