"use client";
import { Box, Button, FormControl, MenuItem, Select, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useGenerateWelfareMutation, useGetAllRiskQuery, useGetCaseInfoRiskQuery } from "@/redux/rtk/ChannelApi";
import useMarkdown from "@/hook/use_markDown";
import { DialogSelectedStyle } from "@/component/styles/dialogStyles";

// Inline styles for Markdown
const markdownStyles = `
  .markdown-content table {
    border-collapse: collapse;
    width: 100%;
    margin: 16px 0;
    border: 1px solid #ddd;
  }
  .markdown-content th, 
  .markdown-content td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  .markdown-content th {
    background-color: #f2f2f2;
    font-weight: bold;
  }
  .markdown-content tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  .markdown-content pre {
    background-color: #f5f5f5;
    padding: 16px;
    border-radius: 4px;
    overflow: auto;
  }
  .markdown-content code {
    font-family: monospace;
    padding: 2px 4px;
    background-color: #f5f5f5;
    border-radius: 3px;
  }
  .markdown-content pre code {
    padding: 0;
    background-color: transparent;
  }
  .markdown-content blockquote {
    border-left: 4px solid #ddd;
    padding-left: 16px;
    color: #666;
    margin: 16px 0;
  }
`;

interface SubsidySuggestProps {
  caseInfoId: string;
  year: number;
}

export default function SubsidySuggest({ caseInfoId, year }: SubsidySuggestProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<number>();
  const [generateWelfare, { data, error, isLoading }] = useGenerateWelfareMutation();
  const [cookies] = useCookies(["user"]);
  const socialWorkerEmail = cookies.user;

  // 獲取所有補助建議記錄
  const {
    data: welfareData,
    isLoading: isWelfareLoading,
    error: welfareError,
    refetch,
  } = useGetAllRiskQuery(
    {
      socialWorkerEmail,
      caseInfoId,
      analysisType: "WELFARE",
    },
    { skip: !socialWorkerEmail || !caseInfoId }
  );

  // 獲取選中的特定補助建議記錄
  const {
    data: selectedAnalysis,
    isLoading: isAnalysisLoading,
    error: analysisError,
  } = useGetCaseInfoRiskQuery(
    {
      socialWorkerEmail,
      caseInfoId,
      analysisType: "WELFARE",
      analysisId: Number(selectedAnalysisId),
    },
    { skip: !selectedAnalysisId || !socialWorkerEmail || !caseInfoId }
  );

  // 使用 useMarkdown 鉤子處理 Markdown 內容
  const htmlContent = useMarkdown(data?.suggestion || "", false);
  const selectedHtmlContent = useMarkdown(selectedAnalysis?.resultText || "", false);



  // 自動選擇最新建議
  useEffect(() => {
    if (welfareData && welfareData.length > 0 && !selectedAnalysisId) {
      setSelectedAnalysisId(welfareData[0].analysisId);
    }
  }, [welfareData, selectedAnalysisId]);

  // 動態添加 Markdown 樣式
  useEffect(() => {
    const styleId = "markdown-content-styles";
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement("style");
      styleEl.id = styleId;
      styleEl.innerHTML = markdownStyles;
      document.head.appendChild(styleEl);
    }
  }, []);

  // 生成新的補助建議
  const handleGenerateWelfare = async () => {
    try {
      if (!socialWorkerEmail) {
        throw new Error("Social worker email not found in cookies");
      }
      if (!caseInfoId) {
        throw new Error("Case info ID is missing");
      }

      console.log("Generating welfare with params:", { socialWorkerEmail, caseInfoId, message: "補助資訊" });

      const result = await generateWelfare({
        socialWorkerEmail,
        caseInfoId,
        message: "補助資訊",
      }).unwrap();

      console.log("Welfare suggestion generated successfully:", result.suggestion);
      refetch(); // 刷新歷史記錄
      setSelectedAnalysisId(result.analysisId); // 自動選擇新建議
      setErrorMessage(null);
    } catch (err: any) {
      const detailedError = err?.data?.message || err?.message || "生成補助建議時發生錯誤";
      console.error("Error generating welfare:", err);
      setErrorMessage(detailedError);
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
          variant="contained"
          color="primary"
          onClick={handleGenerateWelfare}
          disabled={isLoading}
          sx={{ mb: 2, px: 3, py: 1 }}
        >
          {isLoading ? "生成中..." : "生成補助建議"}
        </Button>

        <FormControl margin="normal" sx={{ marginLeft: "auto" }}>
          <Select
            value={selectedAnalysisId}
            onChange={(e) => setSelectedAnalysisId(e.target.value)}
            displayEmpty
            inputProps={{ "aria-label": "選擇補助建議記錄" }}
            sx={DialogSelectedStyle}
          >
            <MenuItem value="" disabled>
              請選擇補助建議記錄（依照生成時間排序）
            </MenuItem>
            {isWelfareLoading ? (
              <MenuItem value="" disabled>
                載入中...
              </MenuItem>
            ) : welfareError ? (
              <MenuItem value="" disabled>
                載入失敗
              </MenuItem>
            ) : welfareData && welfareData.length > 0 ? (
              welfareData.map((item) => (
                <MenuItem key={item.analysisId} value={item.analysisId}>
                  {`${formatDate(item.createTime)}`}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="" disabled>
                無補助建議記錄
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </Box>

      {errorMessage && (
        <Typography color="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Typography>
      )}

      {isAnalysisLoading ? (
        <Typography>載入中...</Typography>
      ) : analysisError ? (
        <Typography color="error">
          {(analysisError as any)?.data?.message || "無法載入選中的建議記錄"}
        </Typography>
      ) : selectedAnalysis && selectedHtmlContent ? (
        <div
          className="markdown-content"
          style={{ padding: 0 }}
          dangerouslySetInnerHTML={{ __html: selectedHtmlContent }}
        />
      ) : htmlContent ? (
        <div
          className="markdown-content"
          style={{ padding: 0 }}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      ) : (
        !isLoading &&
        !errorMessage && (
          <Typography>請點擊「生成補助建議」以查看建議內容</Typography>
        )
      )}
    </Box>
  );
}