import { useUpdateAudioFileMutation, useGenerateAudioFilePdfMutation, useRegenerateSummaryMutation } from "@/redux/rtk/audioApi";
import { useCookies } from "react-cookie";
import { useAlert } from "@/layout/context/alertProvider";

export function useAudioFile(caseInfoId: string, fileId: number, filename: string | undefined) {
  const [cookies] = useCookies();
  const { showAlert } = useAlert();

  const [updateAudioFile] = useUpdateAudioFileMutation();
  const [generatePdf] = useGenerateAudioFilePdfMutation();
  const [regenerateSummaryMutation, { isLoading: isRegenerating }] = useRegenerateSummaryMutation(); // ✅ 取得 isLoading

  // 更新檔案：摘要或全文
  const updateFile = async (updateData: { summary?: string; totalText?: string; fileName?: string }) => {
    try {
      await updateAudioFile({
        socialWorkerEmail: cookies.user,
        caseInfoId,
        fileId,
        ...updateData,
      }).unwrap();
      showAlert("更新成功！", "success");
      setTimeout(() => window.location.reload(), 100);
      return true;
    } catch (error) {
      console.error("更新失敗:", error);
      showAlert("⚠️ 更新失敗，請稍後再試", "error");
      return false;
    }
  };

  // 更新檔案名稱
  const updateFileName = async (fileName: string) => {
    try {
      await updateAudioFile({
        socialWorkerEmail: cookies.user,
        caseInfoId,
        fileId,
        fileName,
      }).unwrap();
      return true;
    } catch (error) {
      console.error("檔案名稱更新失敗:", error);
      showAlert("⚠️ 檔案名稱更新失敗，請稍後再試", "error");
      throw error;
    }
  };

  // 下載摘要 PDF
  const downloadSummaryPdf = async (summary: string) => {
    try {
      const response = await generatePdf({
        socialWorkerEmail: cookies.user,
        caseInfoId,
        fileId,
        summary,
        totalText: "",
      }).unwrap();
      console.log("API 回傳的 response:", response);
      const pdfUrl = `http://localhost:8080/files/${caseInfoId}${fileId}.pdf`;
      triggerFileDownload(pdfUrl, `${filename || caseInfoId}${fileId}.pdf`);
    } catch (error) {
      console.error("摘要 PDF 生成失敗:", error);
      showAlert("⚠️ 摘要 PDF 生成失敗，請稍後再試", "error");
    }
  };

  // 下載全文 PDF
  const downloadFullTextPdf = async (totalText: string) => {
    try {
      const response = await generatePdf({
        socialWorkerEmail: cookies.user,
        caseInfoId,
        fileId,
        summary: "",
        totalText,
      }).unwrap();
      console.log("API 回傳的 response:", response);
      const pdfUrl = `http://localhost:8080/files/${caseInfoId}${fileId}.pdf`;
      triggerFileDownload(pdfUrl, `${filename || caseInfoId}${fileId}.pdf`);
    } catch (error) {
      console.error("全文 PDF 生成失敗:", error);
      showAlert("⚠️ 全文 PDF 生成失敗，請稍後再試", "error");
    }
  };

  // 重新生成摘要
  const regenerateSummary = async () => {
    try {
      await regenerateSummaryMutation({
        socialWorkerEmail: cookies.user,
        caseInfoId,
        fileId,
      }).unwrap();
      showAlert("摘要重新生成成功！", "success");
      setTimeout(() => window.location.reload(), 100);
      return true;
    } catch (error) {
      console.error("重新生成摘要失敗:", error);
      showAlert("⚠️ 重新生成摘要失敗，請稍後再試", "error");
      return false;
    }
  };

  const triggerFileDownload = (pdfUrl: string, fileName: string) => {
    if (!pdfUrl.startsWith("http")) {
      pdfUrl = `http://${pdfUrl}`;
    }
    console.log("下載 URL:", pdfUrl);
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showAlert("📄 PDF 下載已開始", "success");
  };

  return { updateFile, updateFileName, downloadSummaryPdf, downloadFullTextPdf, regenerateSummary, isRegenerating }; // ✅ 導出 isRegenerating
}