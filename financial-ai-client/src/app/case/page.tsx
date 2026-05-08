'use client'

import FinAidBreadcrumbs from "@/component/breadcrumb/fin-aid-breadcrumbs";
import CaseFormComponent from "@/component/case/caseForm";
import { useAlert } from "@/layout/context/alertProvider";
import { useCreateCaseMutation, useGetAllCasesQuery, useUploadCaseFileMutation } from "@/redux/rtk/caseApi";
import { CaseInfoInsertRequest, ErrorType } from "@/type/dto/dto";
import { handleError } from "@/utils/config";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";

interface FormInputs extends CaseInfoInsertRequest {
  caseImage: string;
}

export default function AddCase() {
  const [cookies] = useCookies();
  const {showAlert}=useAlert()
  const [createCase] = useCreateCaseMutation();

  const formMethods = useForm<FormInputs>({
    defaultValues: {} as FormInputs
  });
  const router=useRouter()

  useGetAllCasesQuery({
    socialWorkerEmail: cookies.user,
    page: 0,
    size: 3,
    query: ''
  });
  const [fileSelected, setFileSelected] = useState<File>();
  const [uploadCaseFile]=useUploadCaseFileMutation()
  const handleFormSubmit = async (formData: FormInputs) => {
    console.log('formData', formData);
    try {
      const res=await createCase({
        socialWorkerEmail: cookies.user,
        ...formData
      }).unwrap();
      if (fileSelected !== undefined) {
        await uploadCaseFile({
          socialWorkerEmail:cookies.user,
          caseInfoId:res.caseInfoId,
          file:fileSelected as File
        }).unwrap()
      }
      showAlert('新增成功','success')
      router.push('/')
    } catch (e) {
      showAlert(handleError(e as ErrorType),'error')
    }
  };

  const CaseLinks = [
    { href: "/", label: "個案總覽" },
    { href: `/case`, label: "新增資料" },
]

  return (
    <>
      <FinAidBreadcrumbs title="新增資料" links={CaseLinks} />

      {/* <SideBar2 /> */}
      <CaseFormComponent
        title="新增基本資料"
        formMethods={formMethods}
        onSubmit={handleFormSubmit}
        setFileSelected={setFileSelected}
        buttonName="提交"
      />
    </>
  );
}