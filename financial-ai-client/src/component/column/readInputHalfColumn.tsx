/* eslint-disable @typescript-eslint/no-unused-vars */
import { MenuItem, Select, TextField, FormControl, Typography, Box } from "@mui/material";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { InputColumnProps } from "./columnList";
import { DialogSelectedStyle, inputstyle } from "../styles/dialogStyles";

const ReadInputHalfColumn = (inputHalfColumn: InputColumnProps) => {
  const { id, label, type = "text", isSelectItem, selectItem, value, setValue, control } = inputHalfColumn;

  useEffect(() => {
    setValue(id, value);
  }, [value, control, id]);

  const labelStyle = { mt: 1, mb: 0.5, color: '#6c757d' };
  const c = {color: "#FFA500"}

  return (
    <Box mb={2}>
      {isSelectItem ? (
        <FormControl fullWidth margin="normal">
          <Typography variant="body1" sx={labelStyle}>
            {selectItem?.inputLabel} <span style={c}>*此欄位不可更改*</span>
          </Typography>
          <Controller
            name={id}
            control={control}
            defaultValue={value}
            render={({ field }) => (
              <Select
                {...field}
                variant="outlined"
                displayEmpty
                inputProps={{ readOnly: true, "aria-label": "Without label" }}
                sx={{ ...DialogSelectedStyle, backgroundColor: '#f5f5f5', color: '#6c757d' }}
              >
                {selectItem?.menuItem?.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
      ) : (
        <FormControl fullWidth margin="normal">
          <Typography variant="body1" sx={labelStyle}>
            {label} <span style={c}>*此欄位不可更改*</span>
          </Typography>
          <Controller
            name={id}
            control={control}
            defaultValue={value}
            render={({ field }) => (
              <TextField
                {...field}
                type={type}
                variant="outlined"
                placeholder={inputHalfColumn.placeholder}
                sx={{
                  ...inputstyle,
                  backgroundColor: '#f5f5f5',
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: '#6c757d',
                  },
                }}
                InputProps={{ readOnly: true }}
              />
            )}
          />
        </FormControl>
      )}
    </Box>
  );
};

export default ReadInputHalfColumn;
