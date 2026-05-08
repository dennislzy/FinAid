'use client';

import { Box, Container } from '@mui/material';
import YearSummaryChart from '@/component/yearSummaryChart/yearSummaryChart';
import { useCookies } from 'react-cookie';
import { SCstyle, ybPadding } from '../sty';
import YearSummaryChart2 from '@/component/yearSummaryChart/yearSummaryChart2';


interface StatisticPageNeed {
    caseInfoId: string | undefined;

}
export default function StatisticPage2(Need: StatisticPageNeed) {
    const [cookies] = useCookies();
    const {caseInfoId} = Need
    const socialWorkerEmail = cookies.user

    return (
    <Box
        sx={ybPadding}
    >
        <YearSummaryChart2
        socialWorkerEmail={socialWorkerEmail}
        caseInfoId={caseInfoId}
        />
    </Box>
    );
}
