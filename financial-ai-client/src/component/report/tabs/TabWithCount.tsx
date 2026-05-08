import { Box, Typography } from "@mui/material";

interface TabWithCountProps {
  label: string;
  count: number;
}

const getCountStyle = (label: string) => {
  switch (label) {
    case "收入":
      return { bg: "#D1FADF", color: "#067647" };
    case "支出":
      return { bg: "#FEF0C7", color: "#B54708" };
    case "負債":
      return { bg: "#FEE4E2", color: "#B42318" };
    case "資產":
      return { bg: "#EAECF0", color: "#475467" };
    case "全部":
    default:
      return { bg: "#101828", color: "#fff" };
  }
};

export const TabWithCount = ({ label, count }: TabWithCountProps) => {
  const { bg, color } = getCountStyle(label);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography fontSize="0.95rem">{label}</Typography>
      <Box
        sx={{
          backgroundColor: bg,
          color: color,
          fontSize: "0.75rem",
          fontWeight: 600,
          px: 1,
          py: 0.25,
          borderRadius: "8px",
          minWidth: 20,
          textAlign: "center",
          lineHeight: 1,
        }}
      >
        {count}
      </Box>
    </Box>
  );
};
