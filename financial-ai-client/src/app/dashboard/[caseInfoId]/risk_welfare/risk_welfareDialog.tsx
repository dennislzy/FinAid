"use client";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Tab,
    Tabs,
    Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import SubsidySuggest from "./subsidySuggest";
import RiskComment from "./riskComment";
import {
    DialogTitleStyle,
    DialogContentPadding,
} from "@/component/styles/dialogStyles";
import CaseLight from "./caseLight";
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

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

interface RiskWelfareDialogProps {
    open: boolean;
    onClose: () => void;
    caseInfoId: string;
    year: number;
}

export default function RiskWelfareDialog({
    open,
    onClose,
    caseInfoId,
    year,
}: RiskWelfareDialogProps) {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{ sx: { padding: 3 } }}
        >
            <DialogTitle sx={DialogTitleStyle}>
                風險評估及補助建議
                <IconButton sx={{ marginLeft: "auto" }} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={DialogContentPadding}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="content tabs"
                    sx={{
                        paddingTop: 1,
                        marginBottom: 0,
                        borderBottom: "3px solid #f6f7f8",
                        "& .MuiTab-root": {
                            textTransform: "none",
                            fontWeight: "medium",
                            fontSize: "1rem",
                            minWidth: 100,
                        },
                        "& .Mui-selected": {
                            fontWeight: "bold",
                        },
                        "& .MuiTabs-indicator": {
                            height: 3,
                            backgroundColor: "black",
                        },
                    }}
                >
                    <Tab
                        label="風險評估"
                        {...a11yProps(0)}
                        sx={tabStyle}
                        disableRipple
                        disableFocusRipple
                    />
                    <Tab
                        label="補助建議"
                        {...a11yProps(1)}
                        sx={tabStyle}
                        disableRipple
                        disableFocusRipple
                    />
                </Tabs>
                <TabPanel value={tabValue} index={0}>
               
                    <RiskComment caseInfoId={caseInfoId} />
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <SubsidySuggest caseInfoId={caseInfoId} year={year} />
                </TabPanel>
            </DialogContent>
        </Dialog>
    );
}