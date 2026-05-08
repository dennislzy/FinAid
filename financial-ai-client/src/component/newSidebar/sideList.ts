import {
    DonutLarge,
    DonutLargeOutlined,
    AssignmentInd,
    AssignmentIndOutlined,
    CalendarMonth,
    CalendarMonthOutlined,
    Paid,
    PaidOutlined,
    BarChart,
    InsertChartOutlined,
    AdminPanelSettings,
    AdminPanelSettingsOutlined,
    SmartToy,
    SmartToyOutlined,
    FamilyRestroom,
    FamilyRestroomOutlined,
} from "@mui/icons-material";
import AudioFileIcon from "@mui/icons-material/AudioFile";

import type { SvgIconComponent } from "@mui/icons-material"; // 👈 型別修飾

export interface SidebarItem {
    url: string;
    name: string;
    test: string;
    test2: string;
    icon: SvgIconComponent;
    outlinedIcon: SvgIconComponent;
}

export const getSidebarItems = (
    caseInfoId: string | string[] | undefined
): SidebarItem[] => [
    {
        url: `/dashboard/${caseInfoId}`,
        name: "儀表板",
        test: `/dashboard/${caseInfoId}`,
        test2: `/notExist`,
        icon: DonutLarge,
        outlinedIcon: DonutLargeOutlined,
    },
    {
        url: `/caseEdit/${caseInfoId}`,
        name: "基本資料",
        test: `/caseEdit/${caseInfoId}`,
        test2: `/notExist`,
        icon: AssignmentInd,
        outlinedIcon: AssignmentIndOutlined,
    },
    {
        url: `/month_overview/${caseInfoId}?financialType=收入`,
        name: "每月收支",
        test: `/month_overview/${caseInfoId}`,
        test2: `/notExist`,
        icon: CalendarMonth,
        outlinedIcon: CalendarMonthOutlined,
    },
    {
        url: `/year_overview/${caseInfoId}?financialType=收入`,
        name: "每年收支",
        test: `/year_overview/${caseInfoId}`,
        test2: `/notExist`,
        icon: Paid,
        outlinedIcon: PaidOutlined,
    },
    {
        url: `/caseInvestment/${caseInfoId}/Allowance`,
        name: "其他明細",
        test: `/caseInvestment/${caseInfoId}`,
        test2: `/notExist`,
        icon: BarChart,
        outlinedIcon: InsertChartOutlined,
    },
    {
        url: `/insurance_overview/${caseInfoId}`,
        name: "保險明細",
        test: `/insurance_overview/${caseInfoId}`,
        test2: `/notExist`,
        icon: AdminPanelSettings,
        outlinedIcon: AdminPanelSettingsOutlined,
    },
    {
        url: `/family/${caseInfoId}`,
        name: "家庭狀況",
        test: `/family/${caseInfoId}`,
        test2: `/notExist`,
        icon: FamilyRestroom,
        outlinedIcon: FamilyRestroomOutlined,
    },
    {
        url: `/file/${caseInfoId}`,
        name: "語音助手",
        test: `/file/${caseInfoId}`,
        test2: `/case_file/${caseInfoId}`,
        icon: AudioFileIcon,
        outlinedIcon: AudioFileIcon,
    },
    // {
    //     url: `/channel2/${caseInfoId}/chat`,
    //     name: "智慧查詢",
    //     test: `/channel2/${caseInfoId}/chat`,
    //     test2: `/notExist`,
    //     icon: SmartToy,
    //     outlinedIcon: SmartToyOutlined,
    // },
];
