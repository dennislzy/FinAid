"use client";
import {
    Box,
    Grid,
    Typography,
    Avatar,
    CircularProgress,
    Tooltip,
} from "@mui/material";
import {
    Email,
    Phone,
    CalendarMonth,
    Wc,
    Home,
    Flag,
    Person,
    Badge,
} from "@mui/icons-material";
import { useGetCasesQuery } from "@/redux/rtk/caseApi";

interface CaseInformationProps {
    open: boolean;
    caseInfoId: string;
    title: string;
    socialWorkerEmail: string;
}

export default function CaseInformation({
    open,
    caseInfoId,
    title,
    socialWorkerEmail,
}: CaseInformationProps) {
    const { data: cases, isLoading } = useGetCasesQuery(
        { socialWorkerEmail, caseInfoId },
        { skip: !caseInfoId || !socialWorkerEmail }
    );

    if (!cases || isLoading) return <CircularProgress size={20} />;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                padding: 2,
                width: "80%"
            }}
        >
            {/* 頭像與基本資料 */}
            <Box>
                <Typography variant="h6" fontWeight="bold">
                    {cases.caseInfoName ?? "N/A"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {cases.caseInfoCareer ?? "N/A"}
                </Typography>
            </Box>

            <Grid container spacing={2}>
                <InfoItem
                    icon={<CalendarMonth />}
                    label="建立時間"
                    value={cases.caseInfoCreateTime}
                />
                <InfoItem icon={<Wc />} label="性別" value={cases.caseInfoGender} />
                <InfoItem icon={<CalendarMonth />} label="個案生日" value={cases.caseInfoBirth} />
                <InfoItem icon={<Badge />} label="身分證字號" value={cases.caseInfoIdentification} />
                <InfoItem icon={<Email />} label="電子郵件" value={cases.caseInfoEmail} />
                <InfoItem icon={<Phone />} label="聯絡電話" value={cases.caseInfoPhone} />
                <InfoItem icon={<Phone />} label="家中電話" value={cases.caseInfoHomePhone} />
                <InfoItem icon={<Home />} label="地址" value={cases.caseInfoAddress} />
                <InfoItem icon={<Flag />} label="所在縣市" value={cases.caseInfoCity} />
                <InfoItem icon={<Flag />} label="個案職業" value={cases.caseInfoCareer} />
                <InfoItem icon={<Person />} label="緊急聯絡人" value={cases.caseInfoEmergencyContact} />
                <InfoItem icon={<Phone />} label="緊急聯絡電話" value={cases.caseInfoEmergencyPhone} />
                <InfoItem icon={<Person />} label="關係" value={cases.caseInfoEmergencyRelate} />
                <InfoItem
                    icon={<Flag />}
                    label="是否有福利證明"
                    value={cases.isWelfareIdentityProof ? "是" : "否"}
                />
                <InfoItem
                    icon={<Flag />}
                    label="是否為新/原住民"
                    value={cases.isIndigenousOrNewResident ? "是" : "否"}
                />
                <InfoItem
                    icon={<Flag />}
                    label="是否身障"
                    value={cases.isDisability ? "是" : "否"}
                />
                <InfoItem
                    icon={<Flag />}
                    label="居住狀況"
                    value={cases.caseInfoLiveStatus}
                />
            </Grid>
        </Box>
    );
}

// 🧩 通用欄位元件：兩個一排、含 icon + tooltip
const InfoItem = ({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | undefined;
}) => {
    const displayText =
        value && value.trim() !== "" ? (
            <Typography variant="body2">{value}</Typography>
        ) : (
            <Typography variant="body2" fontStyle="italic" color="text.secondary">
                尚無資訊
            </Typography>
        );

    return (
        <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box>{icon}</Box>   
                    <Box fontWeight="bold">{label}：</Box>      
                {displayText}
            </Box>
        </Grid>
    );
};

