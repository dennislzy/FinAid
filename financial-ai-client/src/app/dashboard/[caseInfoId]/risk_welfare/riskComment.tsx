"use client";
import {
  useGetAllRiskIndicatorsMutation,
  useGetAllRiskQuery,
  useGetCaseInfoRiskQuery,
} from "@/redux/rtk/ChannelApi";
import { Box, Button, FormControl, MenuItem, Select, Typography } from "@mui/material";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react"; // 新增 useEffect
import ReactMarkdown from "react-markdown";
import { DialogSelectedStyle } from "@/component/styles/dialogStyles";
import CaseLight from "./caseLight";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
interface RiskCommentProps {
  caseInfoId: string;
}

interface RiskAllResponse {
  analysisId: number;
  caseInfoId: string;
  socialWorkerId: string;
  analysisType: "RISK" | "WELFARE";
  resultText: string;
  createTime: string;
}

export default function RiskComment({ caseInfoId }: RiskCommentProps) {
  const [cookies] = useCookies(["user"]);
  const [data, setData] = useState<RiskAllResponse | null>(null);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [getAllRiskIndicators, { isLoading: isGenerating }] = useGetAllRiskIndicatorsMutation();
  const socialWorkerEmail = cookies.user;

  // 獲取所有風險評估記錄
  const {
    data: riskData,
    isLoading: isRiskLoading,
    error: riskError,
    refetch,
  } = useGetAllRiskQuery(
    {
      socialWorkerEmail,
      caseInfoId,
      analysisType: "RISK",
    },
    { skip: !socialWorkerEmail || !caseInfoId }
  );

  // 獲取選中的特定風險評估記錄
  const {
    data: selectedAnalysis,
    isLoading: isAnalysisLoading,
    error: analysisError,
  } = useGetCaseInfoRiskQuery(
    {
      socialWorkerEmail,
      caseInfoId,
      analysisType: "RISK",
      analysisId: Number(selectedAnalysisId),
    },
    { skip: !selectedAnalysisId || !socialWorkerEmail || !caseInfoId }
  );

  // 自動選擇最新報告
  useEffect(() => {
    if (riskData && riskData.length > 0 && !selectedAnalysisId) {
      // 假設 riskData 按 createTime 降序排列，riskData[0] 是最新報告
      setSelectedAnalysisId(riskData[0].analysisId.toString());
    }
  }, [riskData, selectedAnalysisId]); // 依賴 riskData 和 selectedAnalysisId

  // 生成新的風險評估
  const handleGenerateRiskment = async () => {
    if (!socialWorkerEmail) {
      setErrorMessage("無法找到社工電子郵件");
      console.error("Social worker email not found in cookies");
      return;
    }

    try {
      const result = await getAllRiskIndicators({
        socialWorkerEmail,
        caseInfoId,
      }).unwrap();
      setData(result);
      setErrorMessage(null);
      console.log("Riskment data:", result);
      refetch(); // 刷新歷史記錄
      setSelectedAnalysisId(result.analysisId.toString()); // 自動選擇新記錄
    } catch (err: any) {
      setErrorMessage(err?.data?.message || "生成風險評估時發生錯誤");
      console.error("Error generating riskment:", err);
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };


  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          onClick={handleGenerateRiskment}
          disabled={isGenerating || !socialWorkerEmail}
          variant="contained"
          color="primary"
        >
          {isGenerating ? "生成中..." : "生成風險評估"}
        </Button>

        <FormControl margin="normal" sx={{ marginLeft: "auto" }}>
          <Select
            value={selectedAnalysisId}
            onChange={(e) => setSelectedAnalysisId(e.target.value)}
            displayEmpty
            inputProps={{ "aria-label": "選擇風險評估記錄" }}
            sx={DialogSelectedStyle}
          >
            <MenuItem value="" disabled>
              請選擇風險評估記錄(依照生成時間排序)
            </MenuItem>
            {isRiskLoading ? (
              <MenuItem value="" disabled>
                載入中...
              </MenuItem>
            ) : riskError ? (
              <MenuItem value="" disabled>
                載入失敗
              </MenuItem>
            ) : riskData && riskData.length > 0 ? (
              riskData.map((item) => (
                <MenuItem key={item.analysisId} value={item.analysisId.toString()}>
                  {`${formatDate(item.createTime)}`}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="" disabled>
                無風險評估記錄
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </Box>

      <CaseLight caseInfoId={caseInfoId} light={selectedAnalysis?.light} />
      {errorMessage && (
        <Typography color="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Typography>
      )}

      {isAnalysisLoading ? (
        <Typography>載入中...</Typography>
      ) : analysisError ? (
        <Typography color="error">
          {(analysisError as any)?.data?.message || "無法載入選中的評估記錄"}
        </Typography>
      ) : selectedAnalysis ? (
        <Box className="markdown-content">
          <ReactMarkdown>{selectedAnalysis.resultText}</ReactMarkdown>
        </Box>
      ) : (
        !isRiskLoading && (
          <Typography></Typography>
        )
      )}
    </Box>
  );
}