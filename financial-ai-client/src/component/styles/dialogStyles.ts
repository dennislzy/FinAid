import { Theme } from '@mui/material/styles';


//路徑在這裡
// import { DialogTitleStyle, inputstyle, DialogButtonStyle, DialogSelectedStyle, DialogContentPadding } from "../../component/styles/dialogStyles";



//⭐⭐所有有用Dialog的地方，麻煩讓Dialog都這樣⭐⭐：
// <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { padding: 3 } }}>


//這個是統一Dialog Title的樣式和布局
export const DialogTitleStyle = {
    display: 'flex',
    padding: '8px',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    fontWeight: 'bold'
};

export const DialogContentPadding = {
    padding: '8px'
};

//如果你的東西是select，可以用這個
export const DialogSelectedStyle = {
    backgroundColor: 'rgba(244, 246, 248, 0.8)',
    border: "none",
    borderRadius: "10px",
    height: "56px",
    color: 'black',
    "& .MuiSelect-select": {
        padding: "12px 16px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
        display: "none",
    },
    "&:hover": {
        backgroundColor: "#eaeaea",
    },
};


//如果你的東西是TextFiled，可以用這個
export const inputstyle = {
    backgroundColor: 'rgba(244, 246, 248, 0.8)',
    borderRadius: "10px",
    height: "56px",
    color: 'black',
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            border: "none",
        },
    },
    "&:hover": {
        backgroundColor: "#eaeaea",
    },
   
};

//這個是Dialog的Button(統一用這個)
export const DialogButtonStyle = (theme: Theme) => ({
    padding: "8px 20px",
    backgroundColor: theme.palette.primary.main,
    borderRadius: "10px",
    boxShadow: "none",
    "&:hover": {
        backgroundColor: "rgba(52, 73, 94, 0.85)",
        boxShadow: "none",
    },
});

//如果Dialog的內容有關刪除，button可以用這個紅色的
export const DialogButtonStyleDanger = (theme: Theme) => ({
    padding: "8px 20px",
    backgroundColor: theme.palette.danger.main,
    borderRadius: "10px",
    boxShadow: "none",
    "&:hover": {
        backgroundColor: theme.palette.danger.dark,
        boxShadow: "none",
    },
});

