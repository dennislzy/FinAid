import { LoginAndRegisterProps } from "./loginTextField";

export const LoginList:LoginAndRegisterProps[]=[
    {
        id:'socialWorkerEmail',
        label:'電子郵件'
    },
    {
        id:'socialWorkerPassword',
        label:'密碼',
        type: 'password',
    }
]

export const RegisterList:LoginAndRegisterProps[]=[
    {
        id:'socialWorkerName',
        label:'姓名'
    },
    {
        id:'socialWorkerEmail',
        label:'電子郵件/Email'
    },
    {
        id:'socialWorkerPassword',
        label:'密碼/Password',
        type: 'password',
    },
]