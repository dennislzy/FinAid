"use client";
import { SIDE_BAR_WIDTH } from "@/component/sideBar/sideBarCss";
import { useState, useEffect } from "react";
import styled from "styled-components";

export const sideMove = `calc(${SIDE_BAR_WIDTH} + 4%)`;

export const CaseDiv = styled.div`
padding-top: 10px;
padding-bottom: 10px;
/* padding-left: ${sideMove}; 動態控制左側偏移 */
/* padding-left: 15%;
padding-right: 15%; */
`

const useWindowWidth = () => {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    
    // 清除事件監聽器，避免記憶體洩漏
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
};

  
  export default useWindowWidth;
// export const MainContent = styled.div`
//    /* margin-left: calc(${SIDE_BAR_WIDTH} + 2%);  */
//    /* 側邊欄寬度 + 2% */
//   /* padding: 1.5%; */
//   transition: margin-left 0.3s ease; /* 平滑過渡效果 */
// `;