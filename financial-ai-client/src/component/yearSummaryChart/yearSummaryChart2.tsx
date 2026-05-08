'use client';

import { useEffect, useState } from 'react';
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
import { useGetYearSummaryChartQuery } from '@/redux/rtk/householdYearApi';
import { SCheight } from '@/app/statistic/sty';
import { HouseholdYearSummaryResponse } from '@/type/entity/entityType';

// interface YearSummary {
//   year: number;
//   assets: number;
//   liabilities: number;
//   income: number;
//   expenses: number;
// }

interface Props {
  socialWorkerEmail: string;
  caseInfoId: string | undefined;
}

export default function YearSummaryChartAssetsLiabilities({ socialWorkerEmail, caseInfoId }: Props) {
  const { data: summary } = useGetYearSummaryChartQuery({
    socialWorkerEmail: socialWorkerEmail,
    caseInfoId: caseInfoId,
  });

  const [data, setData] = useState<HouseholdYearSummaryResponse[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (summary) {
      const filteredData = summary.filter(
        (item) => item.assets !== 0 || item.liabilities !== 0
      );
      setData(filteredData);
      setIsDataLoaded(true);
    }
  }, [summary]);

  return (
    <Card elevation={3} sx={SCheight}>
      <CardHeader
        title="家庭年度財務圖"
        subheader="資產 / 負債"
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
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="assets" stroke="#3f51b5" name="資產" strokeWidth={2} />
              <Line type="monotone" dataKey="liabilities" stroke="#4caf50" name="負債" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
