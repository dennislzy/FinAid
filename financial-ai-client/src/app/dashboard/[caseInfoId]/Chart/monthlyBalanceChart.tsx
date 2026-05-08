'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useEffect, useState } from 'react';
import { useGetMonthSummaryChartQuery } from '@/redux/rtk/householdMonthyApi';
import { SCheight } from '@/app/statistic/sty';
import { useGetMonthlyBalanceQuery } from '@/redux/rtk/dashboardApi';
import { useCookies } from 'react-cookie';
import { dashMonthlyBalanceResponse, HouseholdYearSummaryResponse } from '@/type/entity/entityType';
import { useGetYearSummaryChartQuery } from '@/redux/rtk/householdYearApi';

interface Props {
  year: number;
  caseInfoId: string | undefined;
}

export default function MonthlyBalanceChart({ year, caseInfoId }: Props) {
  const [data, setData] = useState<dashMonthlyBalanceResponse[]>([]);
  const [yearSummary, setYearSummary] = useState<HouseholdYearSummaryResponse | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [cookies] = useCookies();
  const socialWorkerEmail = cookies.user;

  const { data: summary } = useGetMonthlyBalanceQuery(
    {
      socialWorkerEmail: socialWorkerEmail,
      caseInfoId: caseInfoId,
      year: year,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: summary2 } = useGetYearSummaryChartQuery(
    {
      socialWorkerEmail: socialWorkerEmail,
      caseInfoId: caseInfoId,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (summary) {
      const filteredData = summary.filter(
        (item) => item.income !== 0 || item.expense !== 0
      );
      setData(filteredData);
      setIsDataLoaded(true);
    }
  }, [summary]);

  useEffect(() => {
    if (summary2) {
      const currentYearData = summary2.find((item) => item.year === year);
      setYearSummary(currentYearData ?? null);
    }
  }, [summary2, year]);

  return (
    <Card elevation={3} sx={SCheight}>
      <CardHeader
        title={`每月財務結餘圖 - ${year} 年`}
        subheader="收入 / 支出 / 結餘"
        sx={{
          '& .MuiCardHeader-title': {
            fontFamily: '"Noto Serif TC", serif',
            fontWeight: 'bold',
          },
          '& .MuiCardHeader-subheader': {
            fontFamily: '"Noto Serif TC", serif',
          },
        }}
      />

      <CardContent>
        {/* 年度總收支與結餘顯示區域 */}
        {yearSummary ? (
          <Box 
            sx={{ 
              mb: 1, 
              mr: 1,
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: 3 
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              年總收入：{yearSummary.income}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              年總支出：{yearSummary.expenses}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              年結餘：{yearSummary.balance}
            </Typography>
          </Box>
        
        ) : (
          <Typography variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
            無此年度數據
          </Typography>
        )}

        {!isDataLoaded ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="300px">
            <CircularProgress />
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#3f51b5" name="收入" strokeWidth={3} />
              <Line type="monotone" dataKey="expense" stroke="#f44336" name="支出" strokeWidth={3} />
              <Line type="monotone" dataKey="balance" stroke="#a714e1" name="結餘" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
