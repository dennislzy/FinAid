'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Box,
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
import { HouseholdMonthSummaryResponse } from '@/type/entity/entityType';

interface Props {
  year: number;
  socialWorkerEmail: string;
  caseInfoId: string | undefined;
}

// interface MonthlyData {
//   month: number;
//   income: number;
//   expense: number;
// }

export default function MonthlySummaryChart({ year, socialWorkerEmail, caseInfoId }: Props) {
  const [data, setData] = useState<HouseholdMonthSummaryResponse[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const { data: summary } = useGetMonthSummaryChartQuery({
    socialWorkerEmail: socialWorkerEmail,
    caseInfoId: caseInfoId,
    year: year,
  });

  useEffect(() => {
    if (summary) {
      const filteredData = summary.filter(
        (item) => item.income !== 0 || item.expense !== 0
      );
      setData(filteredData);
      setIsDataLoaded(true);
    }
  }, [summary]);

  return (
    <Card elevation={3} sx={SCheight}>
      <CardHeader
        title={`每月財務圖 - ${year} 年`}
        subheader="收入 / 支出"
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
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
