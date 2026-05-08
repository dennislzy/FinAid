/* eslint-disable @typescript-eslint/no-unused-vars */
import { InputLabel, MenuItem, Select, TextField, FormControl, Typography, Box } from "@mui/material";
import { Controller } from "react-hook-form";
import { InputColumnProps } from "./columnList";
import { DialogSelectedStyle, inputstyle } from "../styles/dialogStyles";

const InputHalfColumn = (inputHalfColumn: InputColumnProps) => {
  const labelStyle = { mt: 1, mb: 0.2, textAlign: "left"  };

  return (
    <Box mb={2}>
      {inputHalfColumn.isSelectItem ? (
        <FormControl fullWidth >
          <Typography variant="body1" sx={labelStyle}>
            {inputHalfColumn.selectItem?.inputLabel}
          </Typography>
          <Controller
            name={inputHalfColumn.id}
            control={inputHalfColumn.control}
            defaultValue={inputHalfColumn.value || ""}
            render={({ field }) => (
              <Select
                {...field}
                variant="outlined"
                displayEmpty
                required={inputHalfColumn.required || false} // 使用傳入的 required，否則預設為 false
                inputProps={{ "aria-label": "Without label" }}
                sx={DialogSelectedStyle}
              >
                {inputHalfColumn.selectItem?.menuItem.map((item) => (
                  <MenuItem key={item} value={item} id={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
      ) : (
        <FormControl fullWidth >
          <Typography variant="body1" sx={labelStyle}>
            {inputHalfColumn.label}
          </Typography>
          <Controller
            name={inputHalfColumn.id}
            control={inputHalfColumn.control}
            defaultValue={inputHalfColumn.value || ""}
            render={({ field }) => (
              <TextField
                {...field}
                type={inputHalfColumn.type}
                variant="outlined"
                required={inputHalfColumn.required || false} // 使用傳入的 required，否則預設為 false
                placeholder={inputHalfColumn.placeholder}
                sx={inputstyle}
              />
            )}
          />
        </FormControl>
      )}
    </Box>
  );
};

export default InputHalfColumn;
