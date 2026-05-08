export const getCaseRedirectUrl = (pathName: string, caseInfoId: string): string => {
    if (pathName.startsWith("/caseEdit")) {
      return `/caseEdit/${caseInfoId}`;
    } else if (pathName.startsWith("/dashboard")) {
      return `/dashboard/${caseInfoId}`;
    } else if (pathName.startsWith("/year_overview")) {
      return `/year_overview/${caseInfoId}?financialType=收入`;
    } else if (pathName.startsWith("/month_overview")) {
      return `/month_overview/${caseInfoId}?financialType=收入`;
    } else if (pathName.startsWith("/caseInvestment")) {
      return `/caseInvestment/${caseInfoId}/Allowance`;
    } else if (pathName.startsWith("/insurance_overview")) {
      return `/insurance_overview/${caseInfoId}`;
    } else if (pathName.startsWith("/family")) {
      return `/family/${caseInfoId}`;
    } else if (pathName.startsWith("/file")) {
      return `/file/${caseInfoId}`;
    } else if (pathName.startsWith("/channel")) {
      return `/channel2/${caseInfoId}/chat`;
    } else {
      return pathName; // 預設保持當前路徑
    }
  };
  