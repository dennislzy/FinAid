'use client'
import * as React from 'react';
import { Box, Typography, Tab } from "@mui/material";
import SocialWorkerList from './socialWorkerList';
import InfoCardList from './infoCardList';
import { OuterBox, InsideBox } from '@/component/styles/outerBoxStyle';
import "./gridcss.css"
export default function Supervisor() {

    const styles = {
        title: {
            fontWeight: 800,
            color: "#1c252e",
            marginBottom: "1.0rem",
        }
    }


    return <>
    <br />
    <br />
        <Typography variant='h5' sx={styles.title}>我的團隊社工</Typography>
        <Box>
            <SocialWorkerList />
        </Box>
{/* 
        <div className="grid-container">
            <div className="grid-item left-column">

            </div>
            <div className="grid-item middle-column">
                <InfoCardList />
            </div>
        </div> */}
        {/* <TransitCase/> */}
    </>;
}
