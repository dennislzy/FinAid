"use client";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Card, CardContent, CircularProgress, Typography } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import "./forquill.css";
import ConfirmDialog from "./ConfirmDialog";
import { modules } from "./quillmodules";
import useMarkdown, { purifyConfig } from "@/hook/use_markDown";

interface SummaryContentProps {
  summary: string;
  updateFile: (data: { summary?: string; totalText?: string }) => void;
  downloadSummaryPdf: () => void;
  isEditingFromParent?: boolean;
  onEditComplete?: () => void;
  isRegenerating?: boolean;
}

export default function SummaryContent({
  summary,
  updateFile,
  downloadSummaryPdf,
  isEditingFromParent = false,
  onEditComplete,
  isRegenerating = false,
}: SummaryContentProps) {
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [editingSummary, setEditingSummary] = useState("");
  const [showConfirmSummary, setShowConfirmSummary] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [originalFormat, setOriginalFormat] = useState<"html" | "markdown">("markdown");
  
  // 判斷是否為 HTML 內容
  const isHtmlContent = (content: string): boolean => {
    if (!content) return false;
    // 檢查是否包含 HTML 標籤
    return /<\/?[a-z][\s\S]*>/i.test(content);
  };
  
  // Markdown 轉換為 HTML 的函數 (用於進入編輯模式時)
  const markdownToHtmlForEditing = (markdown: string): string => {
    if (!markdown) return "";
    
    try {
      // 這是一個簡化版的 Markdown 轉 HTML
      // 處理標題
      let html = markdown
        .replace(/\\n/g, "\n")
        .replace(/#{6}\s+(.*?)(?=\n|$)/g, "<h6>$1</h6>")
        .replace(/#{5}\s+(.*?)(?=\n|$)/g, "<h5>$1</h5>")
        .replace(/#{4}\s+(.*?)(?=\n|$)/g, "<h4>$1</h4>")
        .replace(/#{3}\s+(.*?)(?=\n|$)/g, "<h3>$1</h3>")
        .replace(/#{2}\s+(.*?)(?=\n|$)/g, "<h2>$1</h2>")
        .replace(/#{1}\s+(.*?)(?=\n|$)/g, "<h1>$1</h1>");
      
      // 處理列表項
      html = html.replace(/^-\s+(.*?)$/gm, "<li>$1</li>");
      html = html.replace(/(<li>.*?<\/li>)(?:\n|$)/g, "<ul>$1</ul>");
      
      // 處理段落和換行
      html = html.replace(/\n{2,}/g, "</p><p>");
      html = html.replace(/\n/g, "<br />");
      
      // 確保開始和結束有適當的段落標籤
      if (!html.startsWith("<h") && !html.startsWith("<ul") && !html.startsWith("<p>")) {
        html = "<p>" + html;
      }
      if (!html.endsWith("</h1>") && !html.endsWith("</h2>") && !html.endsWith("</h3>") && 
          !html.endsWith("</h4>") && !html.endsWith("</h5>") && !html.endsWith("</h6>") && 
          !html.endsWith("</ul>") && !html.endsWith("</p>")) {
        html = html + "</p>";
      }
      
      return html;
    } catch (error) {
      console.error("Markdown 轉 HTML 出錯:", error);
      return markdown; // 如果出錯，返回原始文本
    }
  };
  
  // 使用 useMarkdown hook 處理 Markdown 轉 HTML
  const htmlFromMarkdown = useMarkdown(summary);
  
  // 最終顯示的 HTML 內容
  const htmlContent = isHtmlContent(summary) ? summary : htmlFromMarkdown;

  // 監聽父元件的編輯狀態
  useEffect(() => {
    if (isEditingFromParent) {
      setIsEditingSummary(true);
    }
  }, [isEditingFromParent]);

  // 當 summary 變更時處理內容
  useEffect(() => {
    if (!summary) {
      setEditingSummary("");
      return;
    }
    
    // 判斷原始格式並儲存
    const isHtml = isHtmlContent(summary);
    setOriginalFormat(isHtml ? "html" : "markdown");
    
    if (isFirstLoad || !isEditingSummary) {
      // 設置編輯內容，根據格式進行處理
      if (isHtml) {
        // 如果原始內容是 HTML，直接用於編輯
        setEditingSummary(summary);
      } else {
        // 如果原始內容是 Markdown，轉換為 HTML 再編輯
        // 這裡使用自定義的轉換函數，確保 ReactQuill 能正確處理
        const htmlForEditor = markdownToHtmlForEditing(summary);
        setEditingSummary(htmlForEditor);
      }
    }
    
    if (isFirstLoad) {
      setIsFirstLoad(false);
    }
  }, [summary, isFirstLoad, isEditingSummary]);

  // HTML 轉回 Markdown (當需要保持原始 Markdown 格式時)
  const htmlToMarkdown = (html: string): string => {
    if (!html) return "";
    
    try {
      // 這只是一個基本的轉換，可能需要根據實際情況調整
      let markdown = html
        // 處理標題
        .replace(/<h1>(.*?)<\/h1>/gi, "# $1\n")
        .replace(/<h2>(.*?)<\/h2>/gi, "## $1\n")
        .replace(/<h3>(.*?)<\/h3>/gi, "### $1\n")
        .replace(/<h4>(.*?)<\/h4>/gi, "#### $1\n")
        .replace(/<h5>(.*?)<\/h5>/gi, "##### $1\n")
        .replace(/<h6>(.*?)<\/h6>/gi, "###### $1\n")
        // 處理列表
        .replace(/<ul>(.*?)<\/ul>/gis, function(match, content) {
          return content.replace(/<li>(.*?)<\/li>/gi, "- $1\n");
        })
        .replace(/<ol>(.*?)<\/ol>/gis, function(match, content) {
          let index = 1;
          return content.replace(/<li>(.*?)<\/li>/gi, function(match, item) {
            return (index++) + ". " + item + "\n";
          });
        })
        // 處理段落和換行
        .replace(/<p>(.*?)<\/p>/gi, "$1\n\n")
        .replace(/<br\s*\/?>/gi, "\n");
      
      // 清理 HTML 標籤
      markdown = markdown.replace(/<[^>]*>/g, "");
      
      // 修復可能的多餘換行
      markdown = markdown.replace(/\n{3,}/g, "\n\n");
      
      return markdown.trim();
    } catch (error) {
      console.error("HTML 轉 Markdown 出錯:", error);
      // 清除所有 HTML 標籤，至少返回純文本
      return html.replace(/<[^>]*>/g, "");
    }
  };

  const handleEditSummary = () => {
    setIsEditingSummary(true);
  };

  const handleCancelEditSummary = () => {
    // 重置為原始內容
    if (originalFormat === "html") {
      setEditingSummary(summary);
    } else {
      const htmlForEditor = markdownToHtmlForEditing(summary);
      setEditingSummary(htmlForEditor);
    }
    setIsEditingSummary(false);
    setShowConfirmSummary(false);
    if (onEditComplete) onEditComplete();
  };

  const handleSaveSummary = () => {
    // 根據原始格式決定如何保存
    let contentToSave = editingSummary;
    
    // 總是使用 HTML 格式保存
    // 這是最簡單的方案，所有後續的編輯都會使用 HTML
    const sanitizedHtml = DOMPurify.sanitize(contentToSave, purifyConfig);
    updateFile({ summary: sanitizedHtml });
    
    setIsEditingSummary(false);
    if (onEditComplete) onEditComplete();
  };

  const customCardShadow = "0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)";

  return (
    <Box sx={{ position: "relative" }}>
      {isRegenerating && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center", 
            justifyContent: "flex-start",
            paddingTop: "20%",
            flexDirection: "column",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 10, 
          }}
        >
          <CircularProgress size={60} />
          <br />
          <Typography>可能需要一點時間...</Typography>
        </Box>
      )}
      {isEditingSummary ? (
        <>
          <Box sx={{ display: "flex", justifyContent: "flex-end", padding: 3 }}>
            <IconButton sx={{ mr: 2, color: "white", backgroundColor: "#34495e" }} onClick={handleSaveSummary}>
              <CheckIcon />
            </IconButton>
            <IconButton sx={{ color: "black", backgroundColor: "#f0f0f2" }} onClick={() => setShowConfirmSummary(true)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <ReactQuill theme="snow" value={editingSummary} onChange={setEditingSummary} modules={modules} />
        </>
      ) : (
        <Card
          sx={{
            boxShadow: customCardShadow,
            borderRadius: 2,
            padding: 3,
            border: "1px solid rgba(145, 158, 171, 0.08)",
          }}
        >
          <CardContent>
            <div
              className="ql-editor"
              style={{ padding: 0 }}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent, purifyConfig) }}
            />
          </CardContent>
        </Card>
      )}
      <ConfirmDialog
        open={showConfirmSummary}
        onClose={() => setShowConfirmSummary(false)}
        onConfirm={handleCancelEditSummary}
        title="訪談摘要"
      />
    </Box>
  );
}