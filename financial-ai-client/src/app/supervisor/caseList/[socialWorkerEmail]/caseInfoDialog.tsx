import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Typography, IconButton, Box, TextField } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useGetCasesQuery } from "@/redux/rtk/caseApi";
import { DialogTitleStyle, DialogButtonStyleDanger, DialogContentPadding } from "@/component/styles/dialogStyles";
interface CaseInfoDialogProps {
    open: boolean;
    onClose: () => void;
    caseInfoId: string;
    title: string;
    socialWorkerEmail: string;
}


export default function CaseInfoDialog({ open, onClose, title, caseInfoId, socialWorkerEmail }: CaseInfoDialogProps) {

    const { data: cases, isLoading, error } = useGetCasesQuery(
        { socialWorkerEmail, caseInfoId },
        { skip: !caseInfoId || !socialWorkerEmail }
    );

    return <>

        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { padding: 3 } }}>
            <DialogTitle sx={DialogTitleStyle}>

                {title}個案詳細資訊

                <IconButton sx={{ marginLeft: 'auto' }} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={DialogContentPadding}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
                    {/* ✅ 顯示當前負責社工，並提供變更按鈕 */}

                    <br />
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <TextField label="姓名" value={cases?.caseInfoName ?? 'N/A'} variant="outlined" fullWidth InputProps={{ readOnly: true }} />
                        <TextField label="英文姓名" value={cases?.caseInfoEnglishName ?? 'N/A'} variant="outlined" fullWidth InputProps={{ readOnly: true }} />
                    </Box>

                    <Box sx={{ display: "flex", gap: 2 }}>
                        <TextField label="性別" value={cases?.caseInfoGender ?? 'N/A'} variant="outlined" fullWidth InputProps={{ readOnly: true }} />
                        <TextField label="職業" value={cases?.caseInfoCareer ?? 'N/A'} variant="outlined" fullWidth InputProps={{ readOnly: true }} />
                    </Box>

                    <Box sx={{ display: "flex", gap: 2 }}>
                        <TextField label="聯絡電話" value={cases?.caseInfoPhone ?? 'N/A'} variant="outlined" fullWidth InputProps={{ readOnly: true }} />
                        <TextField label="家中電話" value="0912-345-678" variant="outlined" fullWidth InputProps={{ readOnly: true }} />
                    </Box>

                    <Box sx={{ display: "flex", gap: 2 }}>
                        <TextField label="電子郵件" value={cases?.caseInfoEmail ?? 'N/A'} variant="outlined" fullWidth InputProps={{ readOnly: true }} />
                        <TextField label="身分證字號" value={cases?.caseInfoIdentification ?? 'N/A'} variant="outlined" fullWidth InputProps={{ readOnly: true }} />
                    </Box>

                    <Box sx={{ display: "flex", gap: 2 }}>
                        <TextField label="郵遞區號" value={cases?.caseInfoPostCode ?? 'N/A'} variant="outlined" fullWidth InputProps={{ readOnly: true }} />
                        <TextField label="所在縣市" value={cases?.caseInfoCity ?? 'N/A'} variant="outlined" fullWidth InputProps={{ readOnly: true }} />
                    </Box>

                    <TextField label="地址" value={cases?.caseInfoAddress ?? 'N/A'} variant="outlined" fullWidth InputProps={{ readOnly: true }} />
                    <TextField label="居住狀況" value={cases?.caseInfoLiveStatus ?? 'N/A'} variant="outlined" fullWidth InputProps={{ readOnly: true }} />

                    <Box sx={{ display: "flex", gap: 2 }}>
                        <TextField label="緊急聯絡人" value={cases?.caseInfoEmergencyContact ?? 'N/A'} variant="outlined" fullWidth InputProps={{ readOnly: true }} />
                        <TextField label="緊急聯絡人電話" value={cases?.caseInfoEmergencyPhone ?? 'N/A'} variant="outlined" fullWidth InputProps={{ readOnly: true }} />
                        <TextField label="緊急聯絡人與個案關係" value={cases?.caseInfoEmergencyRelate ?? 'N/A'} variant="outlined" fullWidth InputProps={{ readOnly: true }} />
                    </Box>

                    <Box sx={{ display: "flex", gap: 2 }}>
                        <TextField label="設籍時間" value={cases?.caseInfoHouseholdRegisterTime ?? 'N/A'} variant="outlined" fullWidth InputProps={{ readOnly: true }} />
                        <TextField label="是否福利證明" value={cases?.isWelfareIdentityProof ? '是' : '否'} variant="outlined" fullWidth InputProps={{ readOnly: true }} />
                        <TextField label="是否為新/原住民" value={cases?.isIndigenousOrNewResident ? '是' : '否'} variant="outlined" fullWidth InputProps={{ readOnly: true }} />
                        <TextField label="是否身障" value={cases?.isDisability ? '是' : '否'} variant="outlined" fullWidth InputProps={{ readOnly: true }} />
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>

    </>
        ;
}

{/* <CaseInfoDialog
    open={caseInfoOpen}
    onClose={() => setCaseInfoOpen(false)}
    title={selectedCaseName}
    caseInfoId={selectedCaseId}
    socialWorkerEmail={socialWorkerEmail}
/> */}


    // <Button
    //                     // onClick={() => {
    //                     //     setDialogOpen(true);
    //                     //     setSelectedCaseId(c.caseInfoId);
    //                     //     setSelectedCaseName(c.caseInfoName);
    //                     // }}
    //                     sx={{
    //                         backgroundColor: "#fdecea",
    //                         color: "#b71c1c",
    //                         fontWeight: "bold",
    //                         borderRadius: "12px",
    //                         padding: "4px 12px",
    //                         textTransform: "none",
    //                         "&:hover": {
    //                             backgroundColor: "#f9d6d3",
    //                         },
    //                         marginLeft: "auto"
    //                     }}
    //                 >
    //                     批次分配
    //                 </Button>
