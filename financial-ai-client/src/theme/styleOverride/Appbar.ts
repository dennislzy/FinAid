import { ComponentsOverrides, Theme } from "@mui/material";

export default function AppBarStyle():ComponentsOverrides<Theme>['MuiAppBar']{
    return {
        root:{
            boxShadow:'none'
        }
    }
}