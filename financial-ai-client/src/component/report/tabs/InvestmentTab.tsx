import { Tabs, Tab, Box } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";

export type investmentValue = 'Stock' | 'Fund' | 'Bidding' | 'Allowance' | 'Bond';

interface TabProps {
    onTabChange?: (newValue: investmentValue) => void;
}

export default function InvestmentTab({ onTabChange }: TabProps) {
    const router = useRouter();
    const pathname = usePathname();

    const pathParts = pathname.split("/");
    const caseInfoId = pathParts[2]; 
    const investmentValue = pathParts[3] as investmentValue; 

    const handleChange = (_event: React.SyntheticEvent, newValue: investmentValue) => {
        router.push(`/caseInvestment/${caseInfoId}/${newValue}`); 
        onTabChange?.(newValue);
    };

    // **原本的樣式，不變**
    const style1 = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        '& .MuiTab-root': {
            borderRadius: '30px',
            textTransform: 'none',
            padding: '5px 20px',
            fontWeight: 'bold',
            fontSize: '16px',
            transition: '0.3s',
            margin: 2,
            '&.Mui-selected': { 
                color: '#ffffff',
                backgroundColor: '#0ba149', 
            }
        },
    };

    const colar1 = { 
        color: '#8a8a8a', 
        backgroundColor: "#e0e0e0", 
        "&:hover": { backgroundColor: "#cccccc" } 
    };

    const list = [
        { value: "Allowance", label: "補助/津貼" },
        { value: "Bond", label: "債券" },
        { value: "Stock", label: "股票" },
        { value: "Fund", label: "基金" },
        { value: "Bidding", label: "標會" },
    ];

    return (
        <Box display="flex" justifyContent="center" width="100%">
            <Tabs
                value={investmentValue}
                onChange={handleChange}
                aria-label="custom tabs example"
                TabIndicatorProps={{ style: { display: 'none' } }}
                sx={{
                    ...style1, 
                    width: "auto", // 讓 Tabs 的大小適應內容
                    '& .MuiTabs-flexContainer': { justifyContent: 'center' } // 確保內部 Tab 也置中
                }}
            >
                {list.map((tab, index) => (
                    <Tab
                        key={index}
                        value={tab.value}
                        label={tab.label}
                        sx={investmentValue === tab.value ? {} : colar1}
                    />
                ))}
            </Tabs>
        </Box>
    );
}
