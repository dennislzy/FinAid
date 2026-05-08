// 頁面背景
 export const formBackground = { 
    backgroundColor: '#F4F4F5', 
    minWidth: '95vw', 
    minHeight: '530px', 
    margin: -0
}

// 背景白色大盒子
export const backgroundBox = { 
    backgroundColor:"white", 
    width:"auto", 
    marginTop:"25px", 
    marginBottom:"25px", 
    paddingTop:"30px", 
    paddingBottom:"30px",
    borderRadius: 5,
    boxShadow: "3px 4px 2px rgba(0, 0, 0, 0.2)",
  }

//   大標題底線
export const head1Underline = {
    color:"rgba( 123, 206, 229, 0.48)",
    textDecoration:"underline",
    textDecorationThickness:"5px"
}
// 大標題文字
export const head1 = {
    color:"#3763AA", 
    borderBottom: '3px solid #7BCEE5',

}

 // 中標題
 export const headstyle = {
    color:"#3763AA",
    fontSize:"35px",
  }

  // 小標題
export  const headstyle2 = {
    color:"#3763AA",
    fontSize:"32px",
  }

  // grid排版box
export const gridboxstyle ={
    width:"80%", 
    backgroundColor:"#f5f1f1",
    borderRadius: 5,
    // boxShadow: "2px 4px 2px rgba(0, 0, 0, 0.2)",
  }
  export const gridboxstyle2 ={
    width:"40%", 
    backgroundColor:"#f5f1f1",
    borderRadius: 5,
    // boxShadow: "2px 4px 2px rgba(0, 0, 0, 0.2)",
  }

//   底部區塊(總合)
export const sumBottomDiv = {
    backgroundColor:"#E6E6E6", 
    borderRadius: 5,
}

// 雙按鈕區塊
export const twoButton = {
    width: "50%"
}

// 更新按鈕
export const submitButton = {
    // width: "125.72px", 
    borderRadius: "10px !important", // 使用 `!important` 確保值不被覆蓋
    backgroundColor: "#3763AA",
      "&:hover": {
        backgroundColor: "#5B8FCC", // Hover 時的背景色
      }
}
// 返回按鈕
// 更新按鈕
export const backButton = {
    
    borderRadius: "10px !important", // 使用 `!important` 確保值不被覆蓋 
    backgroundColor: "#355F96",
      "&:hover": {
        backgroundColor: "#5B8FCC", // Hover 時的背景色
      }
}
// 字大小
export  const submitButtonFontSize = {
    fontSize:"15px"
}

// 比較小的更新按鈕
export const submitButtonSmall = {
    height:"50px", 
    width:"125px", 
    borderRadius: "10px !important", // 使用 `!important` 確保值不被覆蓋  
    backgroundColor: "#3763AA",
      "&:hover": {
        backgroundColor: "#5B8FCC", // Hover 時的背景色
      }
}
// 比較小的字
export  const submitButtonFontSizeSmall = {
    fontSize:"21px"
}

// 比較小的編輯按鈕
export const editButtonSmall = {
    // height:"50px", 
    // width:"125px", 
    borderRadius: "10px !important", // 使用 `!important` 確保值不被覆蓋  
    backgroundColor: "#388E3C",
      "&:hover": {
        backgroundColor: "#66BB6A", // Hover 時的背景色
      }
}

// // 刪除按鈕
// export const deleteButton = {
//     height:"70px", 
//     width:"200px", 
//     borderRadius: 10, 
//     backgroundColor: "#ff0000"
// }


// 警告視窗字色
// 標題
export const deleteWarningHead = {
    color: "red"
}
// 內文
export const deleteWarning = {
    color: "red"
}
// 取消紐
export const cancelButton = {
    backgroundColor: "#3763AA"
}
// 確認紐
export const confirmDeleteButton = {
    backgroundColor:"red"
}


// Dialog編輯送出按鈕
export const dialogSubmitButton = {
    backgroundColor: "#388E3C",
      "&:hover": {
        backgroundColor: "#66BB6A", // Hover 時的背景色
      }
}

// Dialog編輯刪除按鈕
export const dialogDeleteButton = {
    backgroundColor: "red",
      "&:hover": {
        backgroundColor: "#FF7878", // Hover 時的背景色
      }
}

// 投資新增dialog啟動按鈕
export const dialogActionButton = {
  // position: 'fixed',
  // bottom: '15%',
  // right: '17%',
  // width: 70,
  // height: 70,
  position: "fixed", 
  bottom: 200, 
  right: 100, 
  zIndex: 1000,
  backgroundColor: '#34495e',
  '&:hover': {
      backgroundColor: '#4A6B8A',
  },
}
// Dialog新增送出按鈕
export const dialogAddSubmitButton = {
  backgroundColor: "#3763AA",
    "&:hover": {
      backgroundColor: "#5B8FCC", // Hover 時的背景色
    }
}

export const Style = {
  color: '#3763AA',
  borderBottom: '3px solid #7BCEE5',
};
