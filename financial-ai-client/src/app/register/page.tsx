'use client'

import { RegisterList } from '@/component/loginTextField/loginAndRegisterList';
import LoginAndRegisterTextField from '@/component/loginTextField/loginTextField';
import useAxiosApi from '@/hook/use_axios_api';
import { useAlert } from '@/layout/context/alertProvider';
import { SocialWorkerLoginRequest, SocialWorkerRegisterRequest } from '@/type/dto/dto';
import { SocialWorker } from '@/type/entity/entityType';
import { FINANCIAL_BACKEND_URL } from '@/utils/config';
import {
  Box,
  Button,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';

const Register = () => {
  const { register, handleSubmit, watch, control } = useForm<SocialWorkerRegisterRequest>({
    defaultValues: {
      socialWorkerPermission: 'BASIC' // ✅ 預設選「基層社工」
    }
  });
  const socialWorkerPermission = watch('socialWorkerPermission'); // 監聽選擇的值

  const router = useRouter();
  const { fetchData } = useAxiosApi<SocialWorkerRegisterRequest, SocialWorker>();
  const { showAlert } = useAlert();

  const onSubmit: SubmitHandler<SocialWorkerRegisterRequest> = async (formData) => {
    const response = await fetchData({
      url: `${FINANCIAL_BACKEND_URL}/register`,
      method: 'POST',
      body: formData
    });

    if (response.data) {
      showAlert('註冊成功', 'success');
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } else if (response.errorData) {
      showAlert('註冊失敗', 'error');
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#f0f0f0',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexDirection={{ xs: 'column', md: 'row' }}
        width="100%"
        maxWidth="lg"
      >
        {/* 左側圖片 */}
        <Box flex={1} maxWidth={{ xs: '100%', md: '50%' }} p={2}>
          <Image
            src="/assets/register.png"
            alt="Login Image"
            width={400}
            height={300}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </Box>

        {/* 右側表單 */}
        <Box flex={1} maxWidth={{ xs: '100%', md: '50%' }} p={2}>
          <Box mt={{ xs: 4, md: 0 }}>
            <Typography variant="h6" gutterBottom>
              註冊
            </Typography>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
              FinAId 智財幫
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ fontWeight: 700 }}>
              請輸入您的帳號和密碼以登入平台，獲取專業的財務指導與支持
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              {RegisterList.map((reg) => (
                <LoginAndRegisterTextField
                  label={reg.label}
                  id={reg.id}
                  type={reg.type}
                  registers={register}
                  key={reg.id}
                  onChange={reg.onChange}
                />
              ))}

              {/* 單選身份選擇 */}
              <Controller
                name="socialWorkerPermission"
                control={control}
                defaultValue="BASIC"
                render={({ field }) => (
                  <FormControl component="fieldset" sx={{ mt: 2 }}>
                    <FormLabel component="legend">社工身份</FormLabel>
                    <RadioGroup row {...field}>
                      <FormControlLabel
                        value="LEADER"
                        control={<Radio />}
                        label="督導社工"
                      />
                      <FormControlLabel
                        value="BASIC"
                        control={<Radio />}
                        label="基層社工"
                      />
                    </RadioGroup>
                  </FormControl>
                )}
              />


              <Box mt={3} maxWidth="75%">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ width: '50px', alignSelf: 'flex-end', ml: 48, mt: 3 }}
                  id="register-button"
                >
                  註冊
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
