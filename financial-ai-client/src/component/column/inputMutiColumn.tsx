import { InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { InputColumnProps } from "./columnList";
import { textfieldstyle, textfieldsx } from "./columuListCss";

const InputMutiColumn = (inputMutiColumn: InputColumnProps) => {
 
  return (
    <>
      {inputMutiColumn.isSelectItem ? (
        <div className="">          
          <InputLabel id="demo-simple-select-filled-label">
              {inputMutiColumn.selectItem?.inputLabel}
          </InputLabel>         
          <Select
            labelId="demo-simple-select-filled-label"
            id={inputMutiColumn.id}
            style={{ ...textfieldstyle, backgroundColor: "#F4F4F5" }}
            variant="filled"
            sx={textfieldsx}
            defaultValue={inputMutiColumn.defaultValue}
            {...(inputMutiColumn.register ? inputMutiColumn.register(inputMutiColumn.id as string) : {})}
          >
            {inputMutiColumn.selectItem?.menuItem.map((item) => (
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
                type={inputMutiColumn.type}
                id={inputMutiColumn.id}
                variant="filled"
                multiline
                rows={6}
                label={inputMutiColumn.label}
                defaultValue={inputMutiColumn.defaultValue?inputMutiColumn.defaultValue:''}
                style={textfieldstyle}
                sx={textfieldsx}
                {...(inputMutiColumn.register ? inputMutiColumn.register(inputMutiColumn.id as string) : {})}
              />
            </div>
          
        </div>     
      )}
      <br />
      <br />
    </>
  );
};

export default InputMutiColumn;
