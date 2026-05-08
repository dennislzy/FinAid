import { Value } from "@/component/report/financialTabContent"
import { Box, Tab, Tabs } from "@mui/material"
interface TabProps {
    value: string,
    onChange: (event: React.SyntheticEvent, newValue: Value) => void
}

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
}

const CustomTabs = (tabProps: TabProps) => {
    const { value, onChange } = tabProps
    return (
        <>
            <Box>
                <Tabs
                    value={value}
                    onChange={onChange}
                    aria-label="custom tabs example"
                    sx={{
                        paddingTop: 1,
                        borderBottom: "3px solid #f6f7f8",
                        "& .MuiTabs-indicator": {
                            backgroundColor: "black",
                            height: 2.5,

                        },
                    }}
                >
                    <Tab
                        value="收入"
                        label="收入"
                        id="收入"
                        sx={tabStyle}
                        disableRipple
                        disableFocusRipple
                    />
                    <Tab
                        value="支出"
                        label="支出"
                        id="支出"
                        sx={tabStyle}
                        disableRipple
                        disableFocusRipple
                    />
                    <Tab
                        value="統計"
                        label="統計"
                        id="統計"
                        sx={tabStyle}
                        disableRipple
                        disableFocusRipple
                    />
                    {/* <Tab value="資產" label="資產" />
                <Tab value="負債" label="負債" /> */}
                </Tabs>
            </Box>
        </>
    )
}
export default CustomTabs