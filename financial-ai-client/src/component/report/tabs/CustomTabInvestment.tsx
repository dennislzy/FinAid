import { usePathname, useRouter } from "next/navigation";
import { Tab, Tabs, Box } from "@mui/material";
import { tabsClasses } from "@mui/material/Tabs";

export type InvestmentValue = "Stock" | "Fund" | "Bidding" | "Allowance" | "Bond";

const tabStyle = {
    textTransform: "none",
    fontWeight: 500,
    px: 2,
    py: 1,
    color: "#666",
    "&.Mui-selected": {
        color: "#000",
        fontWeight: 600,
        backgroundColor: "transparent",
    },
    "&:hover": {
        color: "#000",
        backgroundColor: "transparent",
    },
};

const tabList = [
    { value: "Allowance", label: "補助/津貼" },
    { value: "Bond", label: "債券" },
    { value: "Stock", label: "股票" },
    { value: "Fund", label: "基金" },
    { value: "Bidding", label: "標會" },
];

const CustomTabs = () => {
    const router = useRouter();
    const pathname = usePathname();

    const pathParts = pathname.split("/");
    const caseInfoId = pathParts[2];
    const investmentValue = pathParts[3] as InvestmentValue;

    const handleChange = (_event: React.SyntheticEvent, newValue: InvestmentValue) => {
        router.push(`/caseInvestment/${caseInfoId}/${newValue}`);
    };

    return (
        <Box>
            <Tabs
                value={investmentValue}
                onChange={handleChange}
                aria-label="custom tabs example"
                sx={{
                    paddingTop: 2,
                    borderBottom: "3px solid #f6f7f8",
                    "& .MuiTabs-indicator": {
                        backgroundColor: "black",
                        height: 2.5,
                    },
                }}
            >
                {tabList.map((tab) => (
                    <Tab
                        key={tab.value}
                        value={tab.value}
                        label={tab.label}
                        sx={tabStyle}
                        disableRipple
                        disableFocusRipple
                    />
                ))}
            </Tabs>
        </Box>
    );
};

export default CustomTabs;
