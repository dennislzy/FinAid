'use client';

import { Box, TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import { inputstyle } from "../styles/dialogStyles";
interface CustomTextFieldProps {
  id: string;
  label?: string;
  value?: any;
  placeholder?: string;
  control: any; // react-hook-form 的控制物件
  setValue:(name:string,value:any)=>void
}

const CustomTextField = ({ id, label, placeholder, control,value }: CustomTextFieldProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%"  }}>
      {label && (
        <Typography
          sx={{
            mb: 2,
          }}
          variant="body1"
        >
          {label}
        </Typography>
      )}
      <Controller
        name={id}
        control={control}
        defaultValue={value}
        render={({ field }) => (
          <TextField
            {...field}
            variant="outlined"
            placeholder={placeholder}
            id={id}
           sx={inputstyle}
            slotProps={{
              input: {
                style: {
                  borderRadius: 6,
                },
              },
            }}
          />
        )}
      />
    </Box>
  );
};

export default CustomTextField;
