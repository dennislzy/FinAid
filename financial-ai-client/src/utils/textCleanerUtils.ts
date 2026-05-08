// textCleanerUtils.ts
/**
 * 從HTML字串中移除所有HTML標籤
 */
export const stripHtml = (html: string): string => {
    if (!html) return "";
    // 在瀏覽器環境中使用 DOMParser
    if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc.body.textContent || "";
    } 
    // 在伺服器端或其他環境中使用正則表達式
    return html.replace(/<[^>]*>/g, '');
  };
  
  /**
   * 從Markdown文本中移除Markdown語法
   */
  export const stripMarkdown = (text: string): string => {
    if (!text) return "";
    return text
      .replace(/[#*_-]+/g, "") // 移除標題、粗體/斜體、列表標記
      .replace(/`+/g, "") // 移除程式碼標記
      .replace(/\[.*?\]\(.*?\)/g, (match) => match.replace(/\[|\]\(.*?\)/g, "")) // 移除超連結，保留文本
      .replace(/\n+/g, " ") // 將所有換行符號替換為單一空格
      .replace(/\s+/g, " ") // 合併多餘空格
      .trim(); // 移除首尾空格
  };
  
  /**
   * 清理文本 - 移除HTML標籤和Markdown語法
   */
  export const cleanText = (input: string): string => stripMarkdown(stripHtml(input));
  
  /**
   * 截取文本，超過指定長度則添加省略號
   */
  export const truncateText = (text: string, maxLength: number): string => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };
  
  /**
   * 清理並截取文本的便捷函數
   */
  export const cleanAndTruncate = (text: string, maxLength?: number): string => {
    const cleaned = cleanText(text);
    return maxLength ? truncateText(cleaned, maxLength) : cleaned;
  };