import { AssetsBox, ExpenseBox, IncomeBox, LiabilityBox } from "../../component/report/month_box";

// 定義類別配置
export const categoryConfig = {
    收入: {
      options: [
        {
          groupLabel: "收入",
          items: [
            { value: "薪資", label: "薪資" },
            { value: "其他收入", label: "其他收入" },
          ],
        },
      ],
      Component: IncomeBox,
    },
    支出: {
      options: [
        {
          groupLabel: "支出",
          items: [
            { value: "食物", label: "食物" },
            { value: "衣服", label: "衣服" },
            { value: "房租(貸)", label: "房租(貸)" },
            { value: "交通", label: "交通" },
            { value: "教育費用", label: "教育費用" },
            { value: "娛樂", label: "娛樂" },
            { value: "醫療", label: "醫療" },
            { value: "電信費用", label: "電信費用" },
            { value: "孩童費用", label: "孩童費用" },
            { value: "孝親費", label: "孝親費" },
            { value: "自提勞退", label: "自提勞退" },
            { value: "其他費用", label: "其他費用" },
          ],
        },
      ],
      Component: ExpenseBox,
    },
    資產: {
      options: [
        {
          groupLabel: "資產",
          items: [
            { value: "現金", label: "現金" },
            { value: "活存", label: "活存" },
            { value: "定存", label: "定存" },
            { value: "壽險", label: "壽險" },
            { value: "投資現額", label: "投資現額" },
            { value: "汽(機)車", label: "汽(機)車" },
            { value: "其他資產", label: "其他資產" },
          ],
        },
      ],
      Component: AssetsBox,
    },
    負債: {
      options: [
        {
          groupLabel: "負債",
          items: [
            { value: "信用卡未還餘額", label: "信用卡未還餘額" },
            { value: "信貸未還餘額", label: "信貸未還餘額" },
            { value: "車貸未還餘額", label: "車貸未還餘額" },
            { value: "朋友借款", label: "朋友借款" },
            { value: "其他負債", label: "其他負債" },
          ],
        },
      ],
      Component: LiabilityBox,
    },
};


export const yearOptions = [
    {
        groupLabel: "年份",
        items: [
          { value: 2025, label: "2025" },
          { value: 2024, label: "2024" },
          { value: 2023, label: "2023" },
          { value: 2022, label: "2022" },
          { value: 2021, label: "2021" },
        ],
    },
];

export const monthOptions = [
    {
        groupLabel: "月份",
        items: [
            { value: 1, label: "1" },
            { value: 2, label: "2" },
            { value: 3, label: "3" },
            { value: 4, label: "4" },
            { value: 5, label: "5" },
            { value: 6, label: "6" },
            { value: 7, label: "7" },
            { value: 8, label: "8" },
            { value: 9, label: "9" },
            { value: 10, label: "10" },
            { value: 11, label: "11" },
            { value: 12, label: "12" },
        ],
    },
];
  