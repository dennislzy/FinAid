// useMarkdown.ts
import { useState, useEffect, useMemo } from 'react';
import DOMPurify from 'dompurify';

// DOMPurify 配置 - 允許的標籤和屬性
export const purifyConfig = {
  ALLOWED_TAGS: [
    "p", "br", "strong", "em", "u", "del", 
    "h1", "h2", "h3", "h4", "h5", "h6",
    "ol", "ul", "li", "a", "img", "blockquote", 
    "pre", "code", "div", "span", "table", "tr", "td", "th", "thead", "tbody"
  ],
  ALLOWED_ATTR: ["href", "target", "src", "alt", "class", "style", "start"],
  KEEP_CONTENT: true,
  ADD_ATTR: ["target"],
};

/**
 * 檢測文本是否含有 Markdown 格式
 */
const isMarkdown = (content: string): boolean => {
  if (!content) return false;
  
  // 檢查常見的 Markdown 語法模式
  const markdownPatterns = [
    /#{1,6}\s/,           // 標題
    /\*\*.*?\*\*/,        // 粗體
    /\*.*?\*/,            // 斜體 (標準語法)
    /_.*?_/,              // 斜體 (另一種標準語法)
    /--.*?--/,            // 自定義斜體
    /`.*?`/,              // 行內程式碼
    /```[\s\S]*?```/,     // 程式碼區塊
    /^\s*[-*+]\s/m,       // 無序列表
    /^\s*\d+\.\s/m,       // 有序列表
    /\[.*?\]\(.*?\)/,     // 連結
    /!\[.*?\]\(.*?\)/,    // 圖片
    /^\s*>\s/m,           // 引用區塊
    /\|.*\|.*\|/,         // 表格
    /===(=*)/             // 替代標題語法
  ];
  
  // 任何一種模式匹配即認為是 Markdown
  return markdownPatterns.some(pattern => pattern.test(content));
};

/**
 * 將 Markdown 格式文本轉換為 HTML
 */
const markdownToHtml = (markdown: string): string => {
  if (!markdown) return "";
  
  // 預處理：將 \n 字符轉換為實際換行
  let html = markdown.replace(/\\n/g, "\n");
  
  // 保存程式碼區塊，避免處理其中的內容
  const codeBlocks: string[] = [];
  html = html.replace(/```([\s\S]*?)```/g, (match) => {
    codeBlocks.push(match);
    return `___CODE_BLOCK_${codeBlocks.length - 1}___`;
  });
  
  // 將文本分割為行以處理基於行的 Markdown 元素
  const lines = html.split("\n");
  let processedLines: string[] = [];
  
  // 跟踪列表狀態
  let inOrderedList = false;
  let inUnorderedList = false;
  let nestedLevel = 0;
  
  // 表格處理變量
  let inTable = false;
  let tableLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 檢測表格開始 (至少有一個 | 字符)
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      // 如果不在表格中，標記為在表格中並開始收集表格行
      if (!inTable) {
        inTable = true;
        tableLines = [];
      }
      tableLines.push(line);
      continue;
    }
    // 如果我們在表格中，但當前行不是表格格式，說明表格結束了
    else if (inTable) {
      // 處理收集到的表格行
      if (tableLines.length >= 2) { // 至少需要表頭和分隔行
        const tableHtml = processMarkdownTable(tableLines);
        processedLines.push(tableHtml);
      } else {
        // 如果表格不完整，按原樣添加行
        processedLines = processedLines.concat(tableLines);
      }
      // 重置表格狀態
      inTable = false;
      tableLines = [];
    }
    
    // 處理標題
    if (/^#{1,6}\s/.test(line)) {
      const level = line.match(/^(#{1,6})\s/)?.[1].length || 1;
      const content = line.replace(/^#{1,6}\s+/, "");
      processedLines.push(`<h${level}>${content}</h${level}>`);
      continue;
    }
    
    // 處理有序列表
    const orderedListMatch = line.match(/^(\s*)(\d+)\.\s+(.*)/);
    if (orderedListMatch) {
      const [_, indent, num, content] = orderedListMatch;
      const indentLevel = Math.floor(indent.length / 2);
      
      // 如果不在列表中或者縮進層級變化，開始新列表
      if (!inOrderedList || nestedLevel !== indentLevel) {
        if (inOrderedList) {
          // 關閉之前的列表
          processedLines.push("</ol>");
        }
        processedLines.push(`<ol start="${num}">`);
        inOrderedList = true;
        nestedLevel = indentLevel;
      }
      
      processedLines.push(`<li>${content}</li>`);
      continue;
    }
    
    // 處理無序列表 (使用 -, *, + 符號)
    const unorderedListMatch = line.match(/^(\s*)([-*+])\s+(.*)/);
    if (unorderedListMatch) {
      const [_, indent, marker, content] = unorderedListMatch;
      const indentLevel = Math.floor(indent.length / 2);
      
      // 如果已在有序列表中，先關閉它
      if (inOrderedList) {
        processedLines.push("</ol>");
        inOrderedList = false;
      }
      
      // 如果不在無序列表中或者縮進層級變化，開始新列表
      if (!inUnorderedList || nestedLevel !== indentLevel) {
        if (inUnorderedList) {
          // 關閉之前的列表
          processedLines.push("</ul>");
        }
        processedLines.push("<ul>");
        inUnorderedList = true;
        nestedLevel = indentLevel;
      }
      
      processedLines.push(`<li>${content}</li>`);
      continue;
    }
    
    // 如果到了一個非列表行，關閉所有列表
    if (inOrderedList || inUnorderedList) {
      if (inOrderedList) {
        processedLines.push("</ol>");
        inOrderedList = false;
      }
      if (inUnorderedList) {
        processedLines.push("</ul>");
        inUnorderedList = false;
      }
    }
    
    // 處理其他行
    processedLines.push(line);
  }
  
  // 確保所有列表都被關閉
  if (inOrderedList) {
    processedLines.push("</ol>");
  }
  if (inUnorderedList) {
    processedLines.push("</ul>");
  }
  
  // 如果表格還沒處理，在最後處理
  if (inTable && tableLines.length >= 2) {
    const tableHtml = processMarkdownTable(tableLines);
    processedLines.push(tableHtml);
  }
  
  // 重新組合處理過的行
  html = processedLines.join("\n");
  
  // 處理粗體
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  
  // 處理標準斜體
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  html = html.replace(/_(.*?)_/g, "<em>$1</em>");
  
  // 處理自定義斜體
  html = html.replace(/--([^-]+)--/g, "<em>$1</em>");
  
  // 處理連結
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
  
  // 處理圖片
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />');
  
  // 處理引用區塊
  html = html.replace(/^\s*>\s*(.*?)$/gm, "<blockquote>$1</blockquote>");
  
  // 還原程式碼區塊
  html = html.replace(/___CODE_BLOCK_(\d+)___/g, (_, index) => {
    const code = codeBlocks[parseInt(index)]
      .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, content) => {
        return `<pre><code${lang ? ` class="language-${lang}"` : ''}>${
          content
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
        }</code></pre>`;
      });
    return code;
  });
  
  // 處理行內程式碼
  html = html.replace(/`([^`]+)`/g, (_, code) => {
    return `<code>${
      code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
    }</code>`;
  });
  
  // 只處理非 HTML 標籤間的換行
  html = html.replace(/\n(?![<>])/g, "<br />");
  
  // 防止 HTML 標籤間的連續換行
  html = html.replace(/(\<\/[a-z0-9]+\>)<br \/>(\<[a-z0-9]+)/gi, "$1$2");
  
  return html;
};

/**
 * 處理 Markdown 表格
 * @param tableLines 表格的所有行
 * @returns 處理後的 HTML 表格
 */
const processMarkdownTable = (tableLines: string[]): string => {
  if (tableLines.length < 2) return tableLines.join('\n'); // 至少需要表頭和分隔行
  
  // 初始化表格 HTML
  let tableHtml = '<table class="markdown-table">\n';
  
  // 處理表頭
  const headerLine = tableLines[0];
  const headers = headerLine.split('|')
    .filter(cell => cell.trim() !== '') // 過濾掉空單元格
    .map(cell => cell.trim());
  
  tableHtml += '<thead>\n<tr>\n';
  headers.forEach(header => {
    tableHtml += `<th>${header}</th>\n`;
  });
  tableHtml += '</tr>\n</thead>\n';
  
  // 檢查是否有分隔行 (第二行)，確認這是一個表格
  const separatorLine = tableLines[1];
  if (!separatorLine.includes('---') && !separatorLine.includes(':-:')) {
    return tableLines.join('\n'); // 不是有效的表格
  }
  
  // 處理表格內容 (從第三行開始)
  if (tableLines.length > 2) {
    tableHtml += '<tbody>\n';
    for (let i = 2; i < tableLines.length; i++) {
      const dataLine = tableLines[i];
      const cells = dataLine.split('|')
        .filter(cell => cell.trim() !== '')
        .map(cell => cell.trim());
      
      tableHtml += '<tr>\n';
      cells.forEach(cell => {
        tableHtml += `<td>${cell}</td>\n`;
      });
      tableHtml += '</tr>\n';
    }
    tableHtml += '</tbody>\n';
  }
  
  tableHtml += '</table>';
  return tableHtml;
};

/**
 * 將文本轉換為HTML，自動偵測是否為Markdown格式
 */
const processTextToHtml = (text: string): string => {
  if (!text) return "";
  
  try {
    // 檢查是否為 Markdown 格式
    if (isMarkdown(text)) {
      // 將 Markdown 轉換為 HTML
      return markdownToHtml(text);
    } else {
      // 如果不是 Markdown 格式，則只進行基本轉換
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br />");
    }
  } catch (error) {
    console.error("文本轉換錯誤:", error);
    // 發生錯誤時回退到基本文本處理
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br />");
  }
};

/**
 * 自定義 Hook: 將文本轉換為安全的 HTML
 * @param text 需要轉換的文本
 * @param skipProcessing 是否跳過處理（例如對於"正在思考中..."）
 * @returns 處理後的 HTML 內容
 */
export function useMarkdown(text: string, skipProcessing: boolean = false) {
  // if (text && text.startsWith('<!-- HTML_CONTENT -->')) {
  //   // 直接使用 HTML 部分
  //   return text.replace('<!-- HTML_CONTENT -->\n', '');
  // }
  const [htmlContent, setHtmlContent] = useState('');
  
  // 使用 useMemo 緩存計算結果，避免不必要的重新計算
  const sanitizedHtml = useMemo(() => {
    if (!text || skipProcessing) return "";
    
    // 處理文本並淨化 HTML
    const html = processTextToHtml(text);
    return DOMPurify.sanitize(html, purifyConfig);
  }, [text, skipProcessing]);
  
  // 當計算結果改變時更新狀態
  useEffect(() => {
    setHtmlContent(sanitizedHtml);
  }, [sanitizedHtml]);
  
  return htmlContent;
}

// 導出 Hook 和額外的工具函數以便需要時單獨使用
export default useMarkdown;