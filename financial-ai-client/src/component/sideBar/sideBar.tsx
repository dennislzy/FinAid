// /* eslint-disable @typescript-eslint/no-unused-vars */
// import React from 'react';
// import { Box, MenuItem, Divider, MenuList, Link } from '@mui/material';
// import styled from 'styled-components';
// import { css } from './sideBarCss';

// interface Need {
//     caseInfoId: string | undefined;
//     location:number;
// }

// export default function SideBar (need:Need)  {
    
//     const spec = {
//       backgroundColor:"#3763AA",
//       borderRadius:"5px",
//       "&:hover": {
//       backgroundColor:"#3763AA", // Hover 時的背景色
//       }
//     }
//     const unspec = {
//       borderRadius:"5px",
//     }

//     const fontSize = {
//       fontSize:"18px",
//     }

//     const caseInfoId = need.caseInfoId

//     const sideList = [
//       {
//         url:`/caseEdit/${caseInfoId}`,
//         name:"個案基本資料"
//       },
//       {
//         url:`/year_overview/${caseInfoId}/收入`,
//         name:"個案資產負債"
//       },{
//         url:`/month_overview/${caseInfoId}/收入`,
//         name:"個案每月收支"
//       },{
//         url:`/caseInvestment/${caseInfoId}`,
//         name:"個案投資明細"
//       },{
//         url:`#`,
//         name:"個案保險明細"
//       },
//     ]
  
//     return (
//     <Box
//       sx={css}
//     >
//     <MenuList>
//         {sideList.map((sideList,index) =>(
//           <>
//           {index !== 0?(
//             <Divider />
//           ) : (
//             null
//           )}

//           {index == need.location?(
//             <MenuItem key={index} sx={spec}><Link href={sideList.url} style={{ textDecoration: 'none', color: 'inherit', }}><span style={{...fontSize,color:"white"}}>{sideList.name}</span></Link></MenuItem>
//           ):(
//             <MenuItem key={index} sx={unspec}><Link href={sideList.url} style={{ textDecoration: 'none', color: 'inherit', }}><span style={fontSize}>{sideList.name}</span></Link></MenuItem>
//           )}
//           </>
//         ))}
//     </MenuList>
//     </Box>
//   );
// };

/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Box, MenuItem, Divider, MenuList, Link } from '@mui/material';
import styled from 'styled-components';
import { css } from './sideBarCss';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import HomeIcon from '@mui/icons-material/Home';

interface Need {
    caseInfoId: string | undefined;
    location: number;
}

export default function SideBar(need: Need) {
    const spec = {
        backgroundColor: "#3763AA",
        color:"white",
        borderRadius: "5px",
        "&:hover": {
            backgroundColor: "#3763AA",
        }
    };
    const unspec = {
        borderRadius: "5px",
        color: "#919EAB"
    };
    const fontSize = {
        fontSize: "18px",
    };
    //修改這裡
    const secondListStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        width: '100%',
        paddingRight: "10%"
    };
    const rightAlignStyle = {
        textAlign: 'right',
        fontSize: '17px',
    };

    const caseInfoId = need.caseInfoId;

    const secondList = [
        { url: `/`, name: "首頁",icon: <><HomeIcon /></> },
        { url: `/chatgpt`, name: "智能機器人",icon: <><SmartToyIcon /></> },
    ];

    const sideList = [
        { url: `/caseEdit/${caseInfoId}`, name: "個案基本資料" },
        { url: `/year_overview/${caseInfoId}/收入`, name: "個案資產負債" },
        { url: `/month_overview/${caseInfoId}/收入`, name: "個案每月收支" },
        { url: `/caseInvestment/${caseInfoId}/Stock`, name: "個案投資明細" },
        { url: `#`, name: "個案保險明細" },
    ];

    return (
        <Box sx={css}>            
          <MenuList sx={{padding:"0%"}}>                
              {secondList.map((item, index) => (
                  <MenuItem key={index} sx={{ ...unspec }}>
                      <Link href={item.url} style={{ textDecoration: 'none', color: 'inherit', fontSize: '18px',display:"flex" }} >
                        {item.icon}
                        <b style={{fontSize: '20px'}}>&nbsp;{item.name}</b>
                      </Link>
                  </MenuItem>
              ))}
          </MenuList>
          <MenuList sx={{...secondListStyle,paddingTop:"0%",paddingBottom:"0%"}}>
              {sideList.map((item, index) => (
                  <React.Fragment key={index}>
                      {/* {index !== 0 && <Divider />} */}
                      <MenuItem sx={index === need.location ? spec : unspec}>
                          <Link href={item.url} sx={{ ...rightAlignStyle,textDecoration: 'none', color: 'inherit' }}>
                             <b>{item.name}</b>
                          </Link>
                      </MenuItem>
                  </React.Fragment>
              ))}
          </MenuList>
        </Box>
    );
}
