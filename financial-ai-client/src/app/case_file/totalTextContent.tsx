"use client";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Card, CardContent } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import "./forquill.css";
import ConfirmDialog from "./ConfirmDialog";
import { modules } from "./quillmodules";
import useMarkdown, { purifyConfig } from "@/hook/use_markDown";

interface TotalTextContentProps {
  totalText: string;
  updateFile: (data: { summary?: string; totalText?: string }) => void;
  downloadFullTextPdf: () => void;
  isEditingFromParent?: boolean;
  onEditComplete?: () => void;
}

export default function TotalTextContent({
  totalText,
  updateFile,
  downloadFullTextPdf,
  isEditingFromParent = false,
  onEditComplete,
}: TotalTextContentProps) {
  const [isEditingFullText, setIsEditingFullText] = useState(false);
  const [editingFullText, setEditingFullText] = useState("");
  const [showConfirmFullText, setShowConfirmFullText] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [originalFormat, setOriginalFormat] = useState<"html" | "markdown" | "plain">("plain");

  // 判斷是否為 HTML 內容
  const isHtmlContent = (content: string): boolean => {
    if (!content) return false;
    // 檢查是否包含 HTML 標籤
    return /<\/?[a-z][\s\S]*>/i.test(content);
  };

  // 使用 useMarkdown hook 處理 Markdown 轉 HTML
  const htmlFromMarkdown = useMarkdown(totalText);
  
  // 處理純文本的轉換
  const plainTextToHtml = (text: string): string => {
    if (!text) return "";
    
    // 將連續換行（\n\n）轉為段落 <p>，單個換行（\n）轉為 <br>
    const paragraphs = text
      .split(/\n\s*\n/) // 以兩個換行分隔段落
      .filter((para) => para.trim())
      .map((para) => {
        // 將段落內的單個換行轉為 <br>
        const lines = para
          .split(/\n/)
          .filter((line) => line.trim())
          .join("<br />");
        return `<p>${lines}</p>`;
      })
      .join("");
    
    return paragraphs || "<p></p>";
  };

  // 檢測內容是否為 Markdown 格式
  const isMarkdown = (content: string): boolean => {
    if (!content) return false;
    
    // 檢查常見的 Markdown 語法模式
    const markdownPatterns = [
      /#{1,6}\s/,           // 標題
      /\*\*(.*?)\*\*/,      // 粗體
      /\*(.*?)\*/,          // 斜體 (標準語法)
      /_(.*?)_/,            // 斜體 (另一種標準語法)
      /--.*?--/,            // 自定義斜體
      /`.*?`/,              // 行內程式碼
      /```[\s\S]*?```/,     // 程式碼區塊
      /^\s*[-*+]\s/m,       // 無序列表
      /^\s*\d+\.\s/m,       // 有序列表
      /\[.*?\]\(.*?\)/,     // 連結
      /!\[.*?\]\(.*?\)/,    // 圖片
      /^\s*>\s/m,           // 引用區塊
      /===(=*)/             // 替代標題語法
    ];
    
    // 任何一種模式匹配即認為是 Markdown
    return markdownPatterns.some(pattern => pattern.test(content));
  };

  // 確定內容格式並獲取 HTML
  const getHtmlContent = (content: string): string => {
    if (!content) return "";
    
    if (isHtmlContent(content)) {
      return content;
    } else if (isMarkdown(content)) {
      return htmlFromMarkdown;
    } else {
      return plainTextToHtml(content);
    }
  };

  // 最終顯示的 HTML 內容
  const htmlContent = getHtmlContent(totalText);

  // 監聽父元件的編輯狀態
  useEffect(() => {
    if (isEditingFromParent) {
      setIsEditingFullText(true);
    }
  }, [isEditingFromParent]);

  // 當 totalText 變更時處理內容
  useEffect(() => {
    if (!totalText) {
      setEditingFullText("");
      return;
    }
    
    // 判斷原始格式並儲存
    if (isHtmlContent(totalText)) {
      setOriginalFormat("html");
    } else if (isMarkdown(totalText)) {
      setOriginalFormat("markdown");
    } else {
      setOriginalFormat("plain");
    }
    
    if (isFirstLoad || !isEditingFullText) {
      // 設置編輯內容
      if (isHtmlContent(totalText)) {
        // 如果原始內容是 HTML，直接用於編輯
        setEditingFullText(totalText);
      } else if (isMarkdown(totalText)) {
        // 如果原始內容是 Markdown，使用 useMarkdown 轉換的 HTML
        setEditingFullText(htmlFromMarkdown);
      } else {
        // 如果是純文本，轉換為 HTML 格式
        setEditingFullText(plainTextToHtml(totalText));
      }
    }
    
    if (isFirstLoad) {
      setIsFirstLoad(false);
    }
  }, [totalText, isFirstLoad, isEditingFullText, htmlFromMarkdown]);

  // 初始化 Quill 編輯器
  useEffect(() => {
    if (isEditingFullText) {
      // 確保 Quill 已經載入
      if (typeof window !== "undefined") {
        // 添加自定義顏色選擇器
        const Quill = (ReactQuill as any).Quill;
        if (Quill) {
          // 確保只註冊一次
          if (!Quill.imports["formats/color"]) {
            const ColorAttributor = Quill.import("attributors/class/color");
            const BackgroundAttributor = Quill.import("attributors/class/background");
            Quill.register(ColorAttributor, true);
            Quill.register(BackgroundAttributor, true);
          }
        }
      }
    }
  }, [isEditingFullText]);

  const handleEditFullText = () => {
    setIsEditingFullText(true);
  };

  const handleCancelEditFullText = () => {
    // 重置為原始內容
    if (originalFormat === "html") {
      setEditingFullText(totalText);
    } else if (originalFormat === "markdown") {
      setEditingFullText(htmlFromMarkdown);
    } else {
      setEditingFullText(plainTextToHtml(totalText));
    }
    
    setIsEditingFullText(false);
    setShowConfirmFullText(false);
    if (onEditComplete) onEditComplete();
  };

  const handleSaveFullText = () => {
    // 保存 HTML 內容
    const sanitizedHtml = DOMPurify.sanitize(editingFullText, purifyConfig);
    updateFile({ totalText: sanitizedHtml });
    setIsEditingFullText(false);
    if (onEditComplete) onEditComplete();
  };

  const customCardShadow = "0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)";

  // 自定義 ReactQuill 模組，添加顏色選擇器和背景色選擇器
  const customModules = {
    ...modules,
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [
        {
          color: [
            "#000000", // 黑色
            "#e60000", // 紅色
            "#ff9900", // 橙色
            "#ffff00", // 黃色
            "#008a00", // 綠色
            "#0066cc", // 藍色
            "#9933ff", // 紫色
            "#ffffff", // 白色
            false,
          ],
        },
        {
          background: [
            "#000000", // 黑色
            "#e60000", // 紅色
            "#ff9900", // 橙色
            "#ffff00", // 黃色
            "#008a00", // 綠色
            "#0066cc", // 藍色
            "#9933ff", // 紫色
            "#ffffff", // 白色
            false,
          ],
        },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <div>
      {isEditingFullText ? (
        <>
          <Box sx={{ display: "flex", justifyContent: "flex-end", padding: 3 }}>
            <IconButton sx={{ mr: 2, color: "white", backgroundColor: "#34495e" }} onClick={handleSaveFullText}>
              <CheckIcon />
            </IconButton>
            <IconButton
              sx={{ color: "black", backgroundColor: "#f0f0f2" }}
              onClick={() => setShowConfirmFullText(true)}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <ReactQuill theme="snow" value={editingFullText} onChange={setEditingFullText} modules={customModules} />
        </>
      ) : (
        <>
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
        </>
      )}
      <ConfirmDialog
        open={showConfirmFullText}
        onClose={() => setShowConfirmFullText(false)}
        onConfirm={handleCancelEditFullText}
        title="訪談全文"
      />
    </div>
  );
}