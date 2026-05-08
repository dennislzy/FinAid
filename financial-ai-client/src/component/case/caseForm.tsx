/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { columnList } from "@/component/column/columnList";
import InputColumn from "@/component/column/inputColumn";
import { CaseDiv } from "@/styledComponents/casestyled";
import { backgroundBox, formBackground, head1, head1Underline, submitButton, submitButtonFontSize, twoButton } from "@/styledComponents/formCss";
import { Box, Button, Grid2 } from "@mui/material";
import Image from 'next/image';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { Control, UseFormReturn } from "react-hook-form";
import BackToOverview from "./backToOverview";
import InputHalfColumn from "../column/inputHalfColumn";
import { InsideBox } from "../styles/outerBoxStyle";

interface CaseFormProps {
  title: string;
  formMethods: UseFormReturn<any>;
  onSubmit: (data: any) => Promise<void>;
  initialImage?: string;
  setFileSelected:Dispatch<SetStateAction<File | undefined>>
  buttonName:string
}

export default function CaseFormComponent({
  title,
  formMethods,
  onSubmit,
  setFileSelected,
  initialImage,
  buttonName,
}: CaseFormProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(initialImage || null);
  // const [fileSelected, setFileSelected] = useState<File>(); 
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { control, handleSubmit, setValue } = formMethods;

  const handleClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("只能上傳圖片！");
        event.target.value = ""; // 清空輸入框
        return;
      }
      setFileSelected(file)
      const filePath = await uploadImage(file);
      setUploadedImage(filePath); // 更新圖片預覽
      setValue('imagePath', filePath); // 使用 formMethods 動態更新圖片路徑
    }
  };
  const uploadImage = async (file: File): Promise<string> => {
    const filePath = URL.createObjectURL(file); // 模擬伺服器返回的圖片路徑
    return filePath;
  };
  

  return (
    <div>
      <center>

        <CaseDiv>
          {/* <h1><b style={head1}>{title}</b></h1> */}
          <Box sx={InsideBox}>
          {/* <Box sx={backgroundBox}> */}
            <Button 
              onClick={handleClick} 
              style={{ border: "0px", backgroundColor: "white" }}
            >
              <Box sx={{
                backgroundColor: "rgba(238, 239, 240, 0.8)",
                minWidth: "239px",
                minHeight: "247px",
                borderRadius: 5,
                boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.2)",
                justifyContent: "center",
                alignContent: "center",
                mt: 2
              }}>
                {uploadedImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={uploadedImage} 
                    alt="上傳的圖片" 
                    style={{ 
                      maxWidth: '500px', 
                      maxHeight: '500px', 
                      objectFit: 'contain', 
                      margin: "10px" 
                    }} 
                  />
                ) : (
                  <Image 
                    src="/assets/image 18.png" 
                    alt="上傳圖片" 
                    width={138} 
                    height={133} 
                  />
                )}
              </Box>
            </Button>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <br />
              <br />
              <br />
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", width: "80%" }}>
                {columnList.map((column, index) => (
                  <div 
                    key={column.id} 
                    style={{
                      flex: "0 0 calc(50% - 8px)",  // 50% 寬度減去間距
                      // minWidth: "300px"  // 避免過小導致擠成一行
                    }}
                  >
                    <div style={{ width: "90%" }}>
                      <InputHalfColumn
                        label={column.label}
                        id={column.id}
                        isSelectItem={column.isSelectItem}
                        selectItem={column.selectItem}
                        type={column.type}
                        value={column.value}
                        required={column.required}
                        control={control as Control<any>}
                      />
                      </div>
                  </div>
                ))}
              </div>






              {/* <div style={twoButton}> */}
              {/* <Grid2 container spacing={2}>
                <Grid2 size={6}>
                  <BackToOverview />
                </Grid2>
                <Grid2 size={6}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    size="large" 
                    sx={submitButton}
                    id="submit-button"
                  >
                    <b style={submitButtonFontSize}>{buttonName}</b>
                  </Button>
                </Grid2>
              </Grid2> */}
              {/* 使用 Box 包裹 Button 並使其右對齊 */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, mr: "5%" }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="small" 
                  sx={submitButton}
                  id="submit-button"
                >
                  <b style={submitButtonFontSize}>{buttonName}</b>
                </Button>
              </Box>
              <br />
              <br />
            {/* </div> */}
            </form>
          {/* </Box>   */}
          </Box>
        </CaseDiv>
      </center>
    </div>
  );
}