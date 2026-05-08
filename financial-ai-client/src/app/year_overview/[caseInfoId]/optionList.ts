import { AssetsBox, ExpenseBox, IncomeBox, LiabilityBox } from "@/component/report/year_box";

export const categoryConfig = {
    收入: {
      financialCategory: "收入",
      options: [
        {
          groupLabel: "收入",
          items: [
            { value: "年終獎金", label: "年終獎金" },
            { value: "股息分配", label: "股息分配" },
            { value: "存款利息", label: "存款利息" },
            { value: "債券利息", label: "債券利息" },
            { value: "其他收入", label: "其他收入" },
          ],
        },
      ],
      Component: IncomeBox,
    },
    支出: {
      financialCategory: "支出",
      options: [
        {
          groupLabel: "支出",
          items: [
            { value: "所得稅", label: "所得稅" },
            { value: "房屋稅", label: "房屋稅" },
            { value: "地價稅", label: "地價稅" },
            { value: "交通稅", label: "交通稅" },
            { value: "其他支出", label: "其他支出" },
          ],
        },
      ],
      Component: ExpenseBox,
    },
    資產: {
      financialCategory: "資產",
      options: [
        {
          groupLabel: "資產",
          items: [
            { value: "活期存款", label: "活期存款" },
            { value: "定期存款", label: "定期存款" },
            { value: "車輛價值", label: "車輛價值" },
            { value: "收藏品", label: "收藏品" },
            { value: "個人貸款", label: "個人貸款" },
            { value: "貴重金屬", label: "貴重金屬" },
            { value: "不動產", label: "不動產" },
            { value: "其他資產", label: "其他資產" },
          ],
        },
      ],
      Component: AssetsBox,
    },
    負債: {
      financialCategory: "負債",
      options: [
        {
          groupLabel: "負債",
          items: [
            { value: "信用卡債", label: "信用卡債" },
            { value: "消費型貸款", label: "消費型貸款" },
            { value: "房屋貸款", label: "房屋貸款" },
            { value: "汽車貸款", label: "汽車貸款" },
            { value: "朋友借款", label: "朋友借款" },
            { value: "其他貸款", label: "其他貸款" },
          ],
        },
      ],
      Component: LiabilityBox,
    },
  };
  