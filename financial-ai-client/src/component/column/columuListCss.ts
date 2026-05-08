import { halfColor, halfColor0 } from "./columuListColor";

export const textfieldsx = {
  backgroundColor: halfColor0.background,  // 設置背景顏色
  borderRadius: 6,
  boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.2)",
  width: "45%",
  '& label': {
      color: '#34495E',
    },
    '& label.Mui-focused': {
      color: '#34495E',
    },
    '& .MuiOutlinedInput-root': {
      backgroundColor: "#f5f1f1",  // 確保背景色在這裡設置
      '& fieldset': {
        borderColor: '#34495E',
      },
      '&:hover fieldset': {
        borderColor: '#34495E',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#34495E',
      },
    },
    '& .MuiSelect-root': {
      border: 'none', // 隱藏框線
    },
    '& .MuiSelect-focused': {
      border: 'none', // 禁用焦點狀態下的框線
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none', // 去掉"Outlined"類型的選擇框線
    }
};






  export const textfieldHalfsx = {
    // borderRadius: 6,
    boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.2)",
    width: "85%",
    '& label': {
      color: '#34495E',
    },
    '& label.Mui-focused': {
      color: '#34495E',
    },
    '& .MuiOutlinedInput-root': {
      backgroundColor: "#f5f1f1",  // 確保背景色在這裡設置
      '& fieldset': {
        borderColor: '#34495E',
      },
      '&:hover fieldset': {
        borderColor: '#34495E',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#34495E',
      },
    },
    '& .MuiSelect-root': {
      border: 'none', // 隱藏框線
    },
    '& .MuiSelect-focused': {
      border: 'none', // 禁用焦點狀態下的框線
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none', // 去掉"Outlined"類型的選擇框線
    }
    }

//   正常的
export const textfieldstyle = {
    borderRadius: 6,
    // boxShadow: "0px 3px 2px rgba(0, 0, 0, 0.2)",
    // width: "45%",
  };

//   一半的
export const textfieldstyleHalf = {
    borderRadius: 6,
    // boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.2)",
    // width: "85%",
  };


  