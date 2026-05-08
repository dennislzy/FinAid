'use client'
import * as React from 'react';
import { Avatar, AvatarGroup, Box, Divider, Typography, Tab, Tabs, Chip } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';
import TransferOutTable from './transferOutTable';
import TransferInTable from './transferInTable';
import { useCookies } from 'react-cookie';
import { InsideBox, SupervisorBox, OuterBox } from '@/component/styles/outerBoxStyle';
import SupervisorBreadcrumbs from '@/component/breadcrumb/S_Breadcrumb';
export default function TransitCase() {
    const [value, setValue] = React.useState('out');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };


    const CustomTab = styled(Tab)(({ theme }) => ({
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
    }));



    const [cookies] = useCookies();
    const [socialWorkerName, setSocialWorkerName] = React.useState<string | null>(null);
    React.useEffect(() => {
        setSocialWorkerName(cookies.name || "未登入");
    }, [cookies]);

    const transitLinks = [
        { href: "/supervisor", label: "首頁" },
        { href: `/supervisor/transit`, label: "跨團隊轉移個案" },
    ]


    return <>
        <Box>
            <SupervisorBreadcrumbs title="跨團隊轉移個案" links={transitLinks} />
            <Box>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="custom tabs"
                    sx={{
                        paddingTop: 2,
                        borderBottom: "3px solid #f6f7f8",
                        "& .MuiTabs-indicator": {
                            backgroundColor: "black",
                            height: 2.5,
                        },
                    }}
                >
                    <CustomTab value="out" label="轉出" />
                    <CustomTab value="in" label="轉入" />
                </Tabs>



                {/* 根據選中的 tab 顯示內容 */}
                <Box>
                    {value === "out" && <>
                        <TransferOutTable />
                    </>}
                    {value === "in" && (
                        <TransferInTable />
                    )}
                </Box>
            </Box>
        </Box>
    </>
};
