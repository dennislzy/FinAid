import { createTheme } from "@mui/material";
import { palette } from "./palette";
import AppBarStyle from "./styleOverride/Appbar";
import ButtonStyle from "./styleOverride/Button";
import '@fontsource/public-sans/index.css';
//配置自定義樣式，可以更改Mui 主要用來更改mui預設樣式
export const CustomTheme = createTheme({
  typography: {
    fontFamily: `"Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  },
  //example
  components: {
    MuiButton: {
      styleOverrides: ButtonStyle(),
    },
    MuiAppBar: {
      styleOverrides: AppBarStyle(),
    }
  },
  palette: palette(),
})

