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
import { useGetAllInsuranceQuery } from '@/redux/rtk/dashboardApi';
import { SCheight } from '@/app/statistic/sty';
import { useCookies } from 'react-cookie';

interface Props {
  year: number;
  caseInfoId: string | undefined;
}

interface dashInsuranceResponse {
  familyMember: string;
  amount: number;
  insuranceType: 'LIFE' | 'ACCIDENT' | 'MEDICAL';
}

interface ChartItem {
  name: string;
  value: number;
  fill: string;
}

const insuranceTypeMap: Record<string, string> = {
  LIFE: '壽險',
  ACCIDENT: '意外險',
  MEDICAL: '醫療險',
};

const colorPalette = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#8dd1e1', '#a714e1'];

export default function AllInsurentBarChart({ year, caseInfoId }: Props) {
  const [cookies] = useCookies();
  const socialWorkerEmail = cookies.user;

  const { data: summary } = useGetAllInsuranceQuery(
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
    if (summary !== undefined) {
      const members = Array.from(new Set(summary.map((item) => item.familyMember)));
      const colorMap: Record<string, string> = {};
      members.forEach((member, idx) => {
        colorMap[member] = colorPalette[idx % colorPalette.length];
      });

      const typeOrder = ['LIFE', 'ACCIDENT', 'MEDICAL'];

      const transformed: ChartItem[] = members.flatMap((member) => {
        return typeOrder.flatMap((type) => {
          const entry = summary.find(
            (item) => item.familyMember === member && item.insuranceType === type
          );
          return entry
            ? [{
                name: `${member}的${insuranceTypeMap[type]}`,
                value: entry.amount,
                fill: colorMap[member],
              }]
            : [];
        });
      });

      setChartData(transformed);
      setIsDataLoaded(true); // ✅ 無論有無資料都設為已載入
    }
  }, [summary]);

  const renderLegend = () => {
    const uniqueMembers = Array.from(
      new Set(chartData.map((item) => item.name.split('的')[0]))
    );
    return (
      <Box display="flex" flexWrap="wrap" mt={2} gap={2} justifyContent="center">
        {uniqueMembers.map((member) => (
          <Box key={member} display="flex" alignItems="center">
            <Box
              sx={{
                width: 14,
                height: 14,
                backgroundColor: chartData.find((i) => i.name.startsWith(member))?.fill,
                borderRadius: '2px',
                mr: 1,
              }}
            />
            <span>{member}</span>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Card elevation={3} sx={SCheight}>
      <CardHeader
        title={`保險類型總覽`}
        // subheader="壽險 / 意外險 / 醫療險"
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
                <Bar dataKey="value" name="保費金額" isAnimationActive>
                  <LabelList dataKey="value" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            {chartData.length === 0 ? (
              <Box mt={2} textAlign="center">
                <Typography variant="body2" color="textSecondary">
                  無保險資料
                </Typography>
              </Box>
            ) : (
              renderLegend()
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
