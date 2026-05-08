import { ComponentsOverrides, ComponentsVariants, Palette, PaletteOptions, Theme } from "@mui/material";
import { TypographyOptions } from "@mui/material/styles/createTypography";

export type StyleOverride<ComponentNameToClassKey extends keyof ComponentsOverrides<Theme>> = 
  ComponentsOverrides<Theme>[ComponentNameToClassKey];

export type StyleVarient<ComponentNameToClassKey extends keyof ComponentsVariants<Theme>>=
ComponentsVariants<Theme>[ComponentNameToClassKey];

export type PaletteCustomStyle = PaletteOptions

export type TypographyCustomStyle =  TypographyOptions | ((palette: Palette) => TypographyOptions);







