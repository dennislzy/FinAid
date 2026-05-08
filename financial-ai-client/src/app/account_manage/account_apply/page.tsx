"use client"
import ApplyAccounts from "./applyAccounts"
import SupervisorBreadcrumbs from "@/component/breadcrumb/S_Breadcrumb"
export default function AccountApply () {

  const applyLinks =[
    { href: "/account_manage", label: "管理首頁" },
    { href: `/account_manage/account_apply`, label: "系統申請社工" },
  ]
    
  
    return<>
      <SupervisorBreadcrumbs title="系統申請社工" links={applyLinks} />
      <ApplyAccounts/>
    </>
}