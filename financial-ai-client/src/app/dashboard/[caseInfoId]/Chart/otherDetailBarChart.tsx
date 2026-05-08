'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Box,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { useEffect, useState } from 'react';
import { useGetAllInsuranceQuery, useGetOtherDetailQuery } from '@/redux/rtk/dashboardApi';
import { SCheight } from '@/app/statistic/sty';
import { useCookies } from 'react-cookie';

interface Props {
  year: number;
  caseInfoId: string | undefined;
}

interface ChartItem {
  name: string;
  value: number;
  fill: string;
}

export default function OtherDetailBarChart({ year, caseInfoId }: Props) {
  const [cookies] = useCookies();
  const socialWorkerEmail = cookies.user;

  const { data: summary } = useGetOtherDetailQuery(
    {
      socialWorkerEmail,
      caseInfoId,
      year,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );
  

  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (summary) {
      const transformed: ChartItem[] = [
        { name: '補助申請', value: summary.subsidyApply, fill: '#82ca9d' },
        { name: '總標金額', value: summary.biddingTotal, fill: '#8884d8' },
        { name: '債券投資', value: summary.bondInvestment, fill: '#ffc658' },
        { name: '股票買進', value: summary.stockInvestment, fill: '#ff7f50' },
        { name: '基金投資', value: summary.fundInvestment, fill: '#8dd1e1' },
      ];
      setChartData(transformed);
      setIsDataLoaded(true);
    } else {
      setIsDataLoaded(false);
    }
  }, [summary]);

  const renderLegend = () => (
    <Box display="flex" flexWrap="wrap" mt={2} gap={2} justifyContent="center">
      {chartData.map((item) => (
        <Box key={item.name} display="flex" alignItems="center">
          <Box
            sx={{
              width: 14,
              height: 14,
              backgroundColor: item.fill,
              borderRadius: '2px',
              mr: 1,
            }}
          />
          <span>{item.name}</span>
        </Box>
      ))}
    </Box>
  );

  return (
    <Card elevation={3} sx={SCheight}>
      <CardHeader
        title={`其它財務明細 - ${year} 年`}
        subheader="補助 / 標會 / 債券 / 股票 / 基金"
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
          <>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.1)]} />
                <Tooltip />
                <Bar dataKey="value" name="金額" isAnimationActive>
                  <LabelList dataKey="value" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            {renderLegend()}
          </>
        )}
      </CardContent>
    </Card>
  );
}
