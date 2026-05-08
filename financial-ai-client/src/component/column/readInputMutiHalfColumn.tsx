import { InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { InputColumnProps } from "./columnList";
import { textfieldstyleHalf, textfieldsx } from "./columuListCss";

const InputMutiHalfColumn = (inputMutiHalfColumn: InputColumnProps) => {
  

  return (
    <>
      {inputMutiHalfColumn.isSelectItem ? (
        <div className="">          
          <InputLabel id="demo-simple-select-filled-label">
              {inputMutiHalfColumn.selectItem?.inputLabel}
          </InputLabel>         
          <Select
            labelId="demo-simple-select-filled-label"
            id={inputMutiHalfColumn.id}
            style={{ ...textfieldstyleHalf, backgroundColor: "#e6e3e3" }}
            // variant="filled"
            sx={textfieldsx}
            defaultValue={inputMutiHalfColumn.defaultValue}
            slotProps={{
              input: {
                readOnly: true,
              },
            }}  
            {...(inputMutiHalfColumn.register ? inputMutiHalfColumn.register(inputMutiHalfColumn.id as string) : {})}
          >
            {inputMutiHalfColumn.selectItem?.menuItem.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </div>
      ) : (
        <div className="">
            <div className="">
              <TextField
                type={inputMutiHalfColumn.type}
                id={inputMutiHalfColumn.id}
                variant="filled"
                multiline
                rows={6}
                label={inputMutiHalfColumn.label}
                defaultValue={inputMutiHalfColumn.defaultValue?inputMutiHalfColumn.defaultValue:''}
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}  
                style={textfieldstyleHalf}
                sx={textfieldsx}
                {...(inputMutiHalfColumn.register ? inputMutiHalfColumn.register(inputMutiHalfColumn.id as string) : {})}
              />
            </div>
          
        </div>     
      )}
      <br />
    </>
  );
};

export default InputMutiHalfColumn;
