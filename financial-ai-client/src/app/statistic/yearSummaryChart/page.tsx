'use client';

import { Box, Container } from '@mui/material';
import YearSummaryChart from '@/component/yearSummaryChart/yearSummaryChart';
import { useCookies } from 'react-cookie';
import { SCstyle, ybPadding } from '../sty';


interface StatisticPageNeed {
    caseInfoId: string | undefined;

}
export default function StatisticPage(Need: StatisticPageNeed) {
    const [cookies] = useCookies();
    const {caseInfoId} = Need
    const socialWorkerEmail = cookies.user

    return (
    <Box
        sx={ybPadding}
    >
        <YearSummaryChart
        socialWorkerEmail={socialWorkerEmail}
        caseInfoId={caseInfoId}
        />
    </Box>
    );
}
