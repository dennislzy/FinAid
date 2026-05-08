import { SxProps, Theme } from "@mui/material";

export const OuterBox: SxProps<Theme> = {
    flexGrow: 1,
    padding: "15px 10px 64px", // 手機左右 48px
    "@media (min-width: 768px)": {
        padding: "15px 10px 56px", // 平板左右 64px
    },
    "@media (min-width: 1024px)": {
        padding: "15px 60px 64px", // 桌機左右 80px
    },
    // backgroundColor: "rgba(249  , 250, 251, 0.7)" /* 或 0.8, 0.9 類似的透明白色 */

};


export const SupervisorBox: SxProps<Theme> = {
    flexGrow: 1,
    padding: "15px 10px 64px", // 手機左右 48px
    "@media (min-width: 768px)": {
        padding: "50px 32px 56px", // 平板左右 64px
    },
    "@media (min-width: 1024px)": {
        padding: "50px 200px 50px", // 桌機左右 200px
    },
    // backgroundColor: "rgba(249  , 250, 251, 0.7)" /* 或 0.8, 0.9 類似的透明白色 */

};


export const InsideBox = {
    backgroundColor: "#fff",
    padding: 0,
    border: "2px solid rgba(145, 158, 171, 0.08)",
    borderRadius: "15px",
    boxShadow: " 0px 5px 5px 0px rgba(145,158,171,0.11)"
};


