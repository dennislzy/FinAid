import { useAlert } from "@/layout/context/alertProvider";
import { useUpdateHouseYearMutation } from "@/redux/rtk/householdYearApi";
import { ErrorType } from "@/type/dto/dto";
import { HouseholdYearFinancialRecords } from "@/type/entity/entityType";
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
import React from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import GroupedSelect from "./select";
import CustomTextField from "./textfield";
import CloseIcon from '@mui/icons-material/Close';
import { DialogTitleStyle, DialogButtonStyle, DialogContentPadding } from '../styles/dialogStyles';

interface EditDialogProps {
    open: boolean;
    onClose: () => void;
    rowData: HouseholdYearFinancialRecords
}

const EditDialogYear: React.FC<EditDialogProps> = ({
    open,
    onClose,
    rowData,
}) => {

    // 動態選項設置
    const options = React.useMemo(() => {
        const optionsMap: Record<string, { groupLabel: string; items: { value: string; label: string }[] }[]> = {
            收入: [
                {
                    groupLabel: "收入",
                    items: [
                        { value: '年終獎金', label: '年終獎金' },
                        { value: '股息分配', label: '股息分配' },
                        { value: '存款利息', label: '存款利息' },
                        { value: '債券利息', label: '債券利息' },
                        { value: '其他收入', label: '其他收入' },

                    ]
                }
            ],
            支出: [
                {
                    groupLabel: "支出", items: [
                        { value: "所得稅", label: "所得稅" },
                        { value: "房屋稅", label: "房屋稅" },
                        { value: "地價稅", label: "地價稅" },
                        { value: "交通稅", label: "交通稅" },
                        { value: "其他支出", label: "其他支出" },

                    ]
                }
            ],
            資產: [
                {
                    groupLabel: "資產", items: [
                        { value: "活期存款", label: "活期存款" },
                        { value: "定期存款", label: "定期存款" },
                        // { value: "支票存款", label: "支票存款" },
                        // { value: "短期票據", label: "短期票據" },
                        // { value: "保險現金價值", label: "保險現金價值" },
                        // { value: "個人資產", label: "個人資產" },
                        // { value: "房屋價值", label: "房屋價值" },
                        { value: "車輛價值", label: "車輛價值" },
                        { value: "收藏品價值", label: "收藏品價值" },
                        // { value: "股票", label: "股票" },
                        // { value: "公司債", label: "公司債" },
                        // { value: "國內基金", label: "國內基金" },
                        // { value: "外國基金", label: "外國基金" },
                        // { value: "活會", label: "活會" },
                        { value: "個人貸款", label: "個人貸款" },
                        { value: "貴重金屬", label: "貴重金屬" },
                        { value: "不動產", label: "不動產" },
                        { value: "其他資產", label: "其他資產" },

                    ]
                }
            ],
            負債: [
                {
                    groupLabel: "負債", items: [
                        { value: "信用卡債", label: "信用卡債" },
                        { value: "消費型貸款", label: "消費型貸款" },
                        // { value: "壽險借款", label: "壽險借款" },
                        // { value: "死會", label: "死會" },
                        { value: "房屋貸款", label: "房屋貸款" },
                        { value: "汽車貸款", label: "汽車貸款" },
                        { value: "朋友借款", label: "朋友借款" },
                        { value: "其他貸款", label: "其他貸款" },


                    ]
                }
            ]
        };
        return optionsMap[rowData.financialType] || [];
    }, [rowData.financialType]);

    const [updateHouseYear] = useUpdateHouseYearMutation()

    const { control, setValue, handleSubmit } = useForm()
    const [cookies] = useCookies()
    const { showAlert } = useAlert()
    const handle = async (data: unknown) => {
        try {
            await updateHouseYear({
                socialWorkerEmail: cookies.user,
                caseInfoId: rowData.caseInfo.caseInfoId,
                financialYearRecordsId: rowData.financialYearRecordsId,
                financialType: rowData.financialType,
                year: rowData.year,
                ...data
            }).unwrap()
            showAlert('操作成功', 'success')
            onClose()
        } catch (error) {
            showAlert(handleError(error as ErrorType), 'error')
        }
    }

    return (
        <Dialog open={open} onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { padding: 3 } }}
        >
            <form onSubmit={handleSubmit(handle)}>
                <DialogTitle sx={DialogTitleStyle}>
                    編輯{rowData.financialType}資料

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
                            label="類型"
                            id="financialCategory"
                            control={control}
                            setValue={setValue}
                            value={rowData.financialCategory}
                        />
                        <CustomTextField
                            label="金額"
                            id="money"
                            value={rowData.money}
                            control={control}
                            setValue={setValue}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>

                    <Button type="submit" variant="contained"
                        sx={DialogButtonStyle}>
                        儲存
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EditDialogYear;
