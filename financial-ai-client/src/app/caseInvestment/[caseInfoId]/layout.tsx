'use client';

import FinAidBreadcrumbs from '@/component/breadcrumb/fin-aid-breadcrumbs';
import CustomTabs from '@/component/report/tabs/CustomTabInvestment';
import { InsideBox } from '@/component/styles/outerBoxStyle';
import { Box } from '@mui/material';
import { useParams } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {

const { caseInfoId } = useParams(); // 取得動態路由參數
const investmentLinks = [
    { href: "/", label: "個案總覽" },
    { href: `/caseInvestment/${caseInfoId}/Allowance`, label: "其他明細" },
]
    return (
    <Box>
        <FinAidBreadcrumbs title="其它明細" links={investmentLinks} caseInfoId={caseInfoId} />
        <Box sx={InsideBox}>
            <CustomTabs />
            {children}
        </Box>
    </Box>
    );
}
