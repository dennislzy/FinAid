import { PaletteCustomStyle } from "@/type/cssStyle";
import { alpha } from '@mui/system';
//配置全局顔色
export function palette(): PaletteCustomStyle {
    return {

        primary: {
            main: '#3763aa',
            light: '#E1EDFB',   // 較淡柔藍
            lighter: '#F2F6F9',  // 幾近白、透藍感
            contrastText: '#fff',
        },
        secondary: {
            main: '#3763aa',
        },
        success: {
            main: '#34495e', //(深藍)
            light: alpha('#34495e', 0.08),
        },
        error: { //(淺藍)
            main: '#89c8ff'
        },
        warning: { // 🟠 警告色（黃色/橘色）
            main: '#FFA500',
            light: '#FFCC80',
            dark: '#FF6F00'
        },
        info: { //(icon顏色，黑)
            main: '#000000',
            light: '#34495e'
        },
        danger: { //紅色(可以用在刪除)
            main: '#ff5630',
            dark: '#ad4328'
        },
        green: { //綠色(用在語音轉換完成)
            main: '#70d374',
            dark: '#388e3c'
        },
        gray: {
            main: '#919eab29',
            dark: '#e3e2e2'
        }



    }
}