import { palette } from "@/theme/palette";
import { colors } from "@mui/material";

export const modules = {
  toolbar: [
    [{ font: [] }], // 字體
    [{ header: [1, 2, 3, 4, 5, 6, false] }], // 標題大小
    [{ color: [] }, { background: [] }], // 文字顏色 & 背景色（取自 module2）
    [{ align: [] }], // 對齊方式
    [{ list: "ordered" }, { list: "bullet" }], // 有序 / 無序清單
    ["bold", "italic", "underline", "strike"], // 粗體、斜體、底線、刪除線
    ["link", "image"], // 插入超連結 / 圖片（來自 module1）
    ["clean"], // 清除格式
  ],
}


export const gridStyle = {
  padding: 8,
};

export const boxStyle = {
  border: "1px solid lightgray",
  borderRadius: "5px",
  height: "auto",
  padding: 3,
  mb: 2,
  mt: 2
};

export const titleStyle = {
  fontWeight: 'bold',
  fontSize: '1.5rem',
  mt: 2,
  mb: 2
}

export const title = {
  fontSize: '2.0rem',
  fontWeight: 'bold'
}
