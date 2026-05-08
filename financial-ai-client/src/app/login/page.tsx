/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { LoginList } from "@/component/loginTextField/loginAndRegisterList";
import LoginAndRegisterTextField from "@/component/loginTextField/loginTextField";
import useAxiosApi from "@/hook/use_axios_api";
import { useAlert } from "@/layout/context/alertProvider";
import { SocialWorkerLoginRequest } from "@/type/dto/dto";
import { SocialWorker } from "@/type/entity/entityType";
import { FINANCIAL_BACKEND_URL } from "@/utils/config";
import { Box, Button, Container, Link, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { SubmitHandler, useForm } from "react-hook-form";

const Login = () => {
 
  const { register,handleSubmit } = useForm();
  const {showAlert}=useAlert()
  const router=useRouter()
  const {fetchData}=useAxiosApi<SocialWorkerLoginRequest,SocialWorker>()
  const [cookies, setCookie, removeCookie] = useCookies(['socialWorkerId','user','name','Permission']);
  const [permission, setPermission] = useState<string | undefined>(undefined);
  const handleLogin: SubmitHandler<SocialWorkerLoginRequest> = async (data) => {
    const response = await fetchData({
        url: `${FINANCIAL_BACKEND_URL}/login`,
        method: 'POST',
        body: data,
    });
    if (response.data) {
        setCookie('socialWorkerId', response.data.socialWorkerId, { path: '/', maxAge: 3600 });
        setCookie('user', response.data.socialWorkerEmail, { path: '/', maxAge: 3600 });
        setCookie('name', response.data.socialWorkerName, { path: '/', maxAge: 3600 });
        setCookie('Permission', response.data.socialWorkerPermission, { path: '/', maxAge: 3600 });
        setPermission(response.data.socialWorkerPermission);
        showAlert('登入成功', 'success');

        setTimeout(() => {
            setPermission(response.data.socialWorkerPermission);
        }, 500);
    } else if (response.errorData) {
      const message = response.errorData
      showAlert(message, 'error');
    }
};

  useEffect(() => {
    console.log(cookies);  // 確認 cookies 是否為字串或物件
    if (cookies.user || cookies.name) {
      removeCookie("socialWorkerId", { path: "/" });
      removeCookie("user", { path: "/" });
      removeCookie("name", { path: "/" });
      removeCookie("Permission", { path: "/" });
      showAlert("登出成功",'success')
    }
  }, []); // 空依賴陣列，確保只執行一次
  
  // 跳轉邏輯
  useEffect(() => {
  if (permission) {
    setTimeout(() => {
      if (permission === 'ACCOUNTMANAGER') {
        router.push('/account_manage');
      } else if (permission === 'LEADER') {
        router.push('/supervisor');
      } else if (permission === 'BASIC') {
        router.push('/');
      }
    }, 1000);
    }
  }, [permission]);


  return (
    <Container maxWidth="lg">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        flexDirection={{ xs: 'column', md: 'row' }}
      >
        <Box flex={1} maxWidth={{ xs: '100%', md: '50%' }} p={2}>
          <Image
            src="/assets/login.jpg"
            alt="Login Image"
            width={400}  // 設定圖片的寬度
            height={300} // 設定圖片的高度
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </Box>
        <Box flex={1} maxWidth={{ xs: '100%', md: '50%' }} p={2}>
          <Box mt={{ xs: 4, md: 8 }}>
            <Typography variant="h6" gutterBottom>
              登入
            </Typography>
            <Typography variant="h3" gutterBottom sx={{fontWeight: 700}}>
              FinAId 智財幫
            </Typography>
            <Typography variant="body1" gutterBottom sx={{fontWeight: 700}}>
              請輸入您的帳號和密碼以登入平台，獲取專業的財務指導與支持
            </Typography>
            <form onSubmit={handleSubmit(handleLogin)}>
              <LoginAndRegisterTextField 
                label={LoginList[0].label} 
                id={LoginList[0].id}
                registers={register}
                onChange={LoginList[0].onChange}  
              />
              {/* <Link href="#" underline="hover" sx={{ color:'#377DFF'}}>
                    忘記密碼？
              </Link> */}
              <LoginAndRegisterTextField 
                label={LoginList[1].label} 
                id={LoginList[1].id}
                registers={register}
                onChange={LoginList[1].onChange} 
                type={LoginList[1].type}
              />
              <Box mt={2} mb={2} display="flex" alignItems="center">
                <Typography variant="body2">
                  尚未擁有帳號? 
                  <Link href={`/register`} underline="hover" sx={{ color: '#377DFF', fontWeight: 700 }}>立即建立</Link>
                </Typography>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ ml: 35, mt:5 }} // 設置左邊的間距
                  id = "login-button"
                >
                  登入
                </Button>
              </Box>

            </form>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;