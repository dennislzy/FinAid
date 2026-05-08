import { Box, TextField } from "@mui/material"
import { ChangeEvent } from "react"
import { FieldValues, UseFormRegister } from "react-hook-form"
export type LoginAndRegisterProps={
    label:string,
    id:string,
    type?: string,
    registers?:UseFormRegister<FieldValues>,
    onChange?:(e:ChangeEvent<HTMLInputElement>)=>unknown
}
const LoginAndRegisterTextField=(loginandregister:LoginAndRegisterProps)=>{
    return (
        <Box mb={2} maxWidth="75%">
            <TextField
                fullWidth
                label={loginandregister.label}
                variant="outlined"
                id={loginandregister.id}
                type={loginandregister.type}
                required
                {...(loginandregister.registers ? loginandregister.registers(loginandregister.id as string,{
                    onChange:loginandregister.onChange ? loginandregister.onChange:undefined
                }
                ) : {})}
                sx={{
                '& label': {
                    color: '#34495E',
                },
                '& label.Mui-focused': {
                    color: '#34495E',
                },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                    borderColor: '#34495E',
                    },
                    '&:hover fieldset': {
                    borderColor: '#34495E',
                    },
                    '&.Mui-focused fieldset': {
                    borderColor: '#34495E',
                    },
                },
                }}
            />
        </Box>
    )
}
export default LoginAndRegisterTextField