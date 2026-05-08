'use client';

import { Box } from '@mui/material';
import { useState } from 'react';
import MonthlySummaryChart from '@/component/monthlySummaryChart/monthlySummaryChart';
import { useCookies } from 'react-cookie';
import GroupedSelect2 from '@/component/report/select2';
import { yearOptions } from '@/app/month_overview/optionList';

interface StatisticPageNeed {
  caseInfoId: string | undefined;
  year: number;
  setYear: React.Dispatch<React.SetStateAction<number>>
}

export default function MonthlySummaryPage(Need: StatisticPageNeed) {
  // const [year, setYear] = useState(Need.year);
  const [cookies] = useCookies();
  const { caseInfoId, year, setYear } = Need;
  const socialWorkerEmail = cookies.user;

  return (
    <>
      {/* 年份選擇器 */}
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 2,
          mt: 1,
          mb: 1,
        }}
      >
        <GroupedSelect2
          options={yearOptions}
          value={year}
          onChange={(newValue) => setYear(Number(newValue))}
          placeholder="年份"
          label="年份"
          id="summary-year-select"
        />
      </Box>

      {/* 加上左右+下方 padding 的區塊 */}
      <Box
        sx={{
          px: 2,  // 左右 padding
          pb: 2,  // 下方 padding
        }}
      >
        <MonthlySummaryChart
          year={year}
          socialWorkerEmail={socialWorkerEmail}
          caseInfoId={caseInfoId}
        />
      </Box>
    </>
  );
}
