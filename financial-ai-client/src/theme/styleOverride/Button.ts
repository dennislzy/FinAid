import { StyleOverride } from "@/type/cssStyle";

export default function ButtonStyle(): StyleOverride<'MuiButton'> {
    return {
        root: {
            padding: "8px 20px",
            backgroundColor: '#3B82F6',
            borderRadius: "10px",
            boxShadow: "none",
            color: 'white',
            fontWeight: 'bold',
            transition: "background-color 0.3s ease", // 平滑過渡
            "&:hover": {
                backgroundColor: "#2B6CB0",
                boxShadow: "none",
            },
        },
    }
}
