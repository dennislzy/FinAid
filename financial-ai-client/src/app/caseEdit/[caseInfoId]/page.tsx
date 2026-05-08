'use client'
import FinAidBreadcrumbs from "@/component/breadcrumb/fin-aid-breadcrumbs";
import CaseFormComponent from "@/component/case/caseForm";
import SideBar from "@/component/sideBar/sideBar";
import Loading from "@/component/text/loading";
import { useAlert } from "@/layout/context/alertProvider";
import { useGetCasesQuery, useUpdateCaseMutation, useUploadCaseFileMutation } from "@/redux/rtk/caseApi";
import { MainContent } from "@/styledComponents/casestyled";
import { CaseInfoProps } from "@/type/common/common";
import { CaseInfoUpdateRequest, ErrorType } from "@/type/dto/dto";
import { CaseInfo } from "@/type/entity/entityType";
import { handleError } from "@/utils/config";
import { Grid, Grid2 } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";

interface FormInputs extends CaseInfoUpdateRequest {
  caseImage?: string;
}

export default function EditCase({ params }: CaseInfoProps) {
  const { caseInfoId } = params;
  const [cookies] = useCookies();
  const {showAlert}=useAlert()

  const { data: cases, isLoading } = useGetCasesQuery<{
    data: CaseInfo;
    isLoading: boolean;
  }>({
    socialWorkerEmail: cookies.user,
    caseInfoId
  });

  const [updateCase] = useUpdateCaseMutation();
  const [uploadCaseFile]=useUploadCaseFileMutation()
  const formMethods = useForm<FormInputs>({
    defaultValues: cases as FormInputs
  });

  useEffect(() => {
    if (cases) {
      Object.entries(cases).forEach(([key, value]) => {
        formMethods.setValue(key as keyof FormInputs, value);
      });
    }
  }, [cases, formMethods.setValue]);

  const router=useRouter()

  const handleUpdate = async (formData: FormInputs) => {
    console.log('formData', formData);
    try {
      const res=await updateCase({
        socialWorkerEmail: cookies.user,
        caseInfoId,
        ...formData
      }).unwrap();
      if (fileSelected!==undefined){
        await uploadCaseFile({
          socialWorkerEmail:cookies.user,
          caseInfoId:res.caseInfoId,
          file:fileSelected as File
        }).unwrap()
      }
      showAlert('更新成功','success')
      // router.push('/')
    } catch (error) {
      showAlert(handleError(error as ErrorType),'error')
    }
  };
  const [fileSelected, setFileSelected] = useState<File>();
  
  if (isLoading) {
    return <Loading isAudioText={false} />;
  }

  const EditCaseLinks = [
    { href: "/", label: "個案總覽" },
    { href: `/caseEdit/${caseInfoId}`, label: "基本資料" },
]

  return (
    <>

      {/* <SideBar caseInfoId={caseInfoId} location={0} />  */}
      <FinAidBreadcrumbs title="基本資料" links={EditCaseLinks} caseInfoId={caseInfoId}/>
      
      <CaseFormComponent
        title="基本資料"
        formMethods={formMethods}
        onSubmit={handleUpdate}
        initialImage={cases?.caseInfoImage}
        setFileSelected={setFileSelected}
        buttonName="更新" 
        /> 
 
    </>
  );
}