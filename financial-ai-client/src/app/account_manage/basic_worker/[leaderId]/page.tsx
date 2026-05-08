"use client";
import BasicWorker from "./basicWorker";
import SupervisorBreadcrumbs from "@/component/breadcrumb/S_Breadcrumb";
import { useParams } from "next/navigation"; // 導入 useParams

export default function AccountApply() {
  const params = useParams(); // 獲取路徑參數
  const leaderId = params.leaderId as string; // 從路徑中提取 leaderId

  const basicWorkerLinks = [
    { href: "/account_manage", label: "管理首頁" },
    { href: `/account_manage/basic_worker`, label: "基層社工" },
  ];

  return (
    <>
      <SupervisorBreadcrumbs title="基層社工" links={basicWorkerLinks} />
      <BasicWorker leaderId={leaderId} />
    </>
  );
}