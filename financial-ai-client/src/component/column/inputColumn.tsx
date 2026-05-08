import { halfColor0 } from "@/component/column/columuListColor";
import { InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { InputColumnProps } from "./columnList";
import { textfieldstyle, textfieldsx } from "./columuListCss";

const InputColumn = (inputColumn: InputColumnProps) => {
  return (
    <>
      {inputColumn.isSelectItem ? (
        <div className="">
          <InputLabel id="demo-simple-select-filled-label">
            {inputColumn.selectItem?.inputLabel}
          </InputLabel>
          <Controller
            name={inputColumn.id}
            control={inputColumn.control}
            defaultValue={inputColumn.value || ''}
            render={({ field }) => (
              <Select
                {...field}
                labelId="demo-simple-select-filled-label"
                variant="filled"
                id={inputColumn.id}
                style={{ ...textfieldstyle, backgroundColor: halfColor0.background }}
                sx={textfieldsx}
                required={inputColumn.required || false} // 使用傳入的 required，否則預設為 false
                disableUnderline
              >
                {inputColumn.selectItem?.menuItem.map((item,index) => (
                  <MenuItem key={item} value={item} id={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </div>
      ) : (
        <div className="">
          <Controller
            name={inputColumn.id}
            control={inputColumn.control}
            defaultValue={inputColumn.value || ''}
            render={({ field }) => (
              <TextField
                {...field}
                type={inputColumn.type}
                variant="outlined"
                id={inputColumn.id}
                label={inputColumn.label}
                style={textfieldstyle}
                sx={textfieldsx}
                required={inputColumn.required || false} // 使用傳入的 required，否則預設為 false
                slotProps={{
                    input: {
                        style: {
                            backgroundColor: halfColor0.background,  // 設置背景顏色
                        },
                        readOnly: false,
                        disableUnderline: true
                    },
                }}
              />
            )}
          />
        </div>
      )}
      <br />
      <br />
    </>
  );
};

export default InputColumn;