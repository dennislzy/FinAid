/* eslint-disable */
import { Theme } from '@mui/material/styles';


//路徑在這裡
// import { tableContainerStyle, tableCellHeight, tableNoneBorder, tableHeadSelected, tableHeadNoneSelected } from "../../component/styles/tableStyle";


//這個是Table的BoxShadow
export const tableContainerStyle = {
    '& .MuiTableContainer-root': {
        boxShadow: 'rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px'
    }
};

//這個是因為要讓所有TableCell統一高度
export const tableCellHeight = {
    // tableLayout: 'fixed',
    width: '100%',
    '& .MuiTableCell-root': {
        height: 56,
        paddingY: '8px',

    }
};

//只有tableHead沒border。
export const tableNoneBorder = {
    '& .MuiTableCell-root': {
        borderBottom: 'none',
        fontWeight: 'bold',
    }
};


//有selected的tableHead
export const tableHeadSelected = (theme: Theme) => ({
    '& .MuiTableCell-root': {
        backgroundColor: theme.palette.primary.light,
    },
});

//沒有selected的tableHead
export const tableHeadNoneSelected = (theme: Theme) => ({
    '& .MuiTableCell-root': {
        color: '#637381',
        backgroundColor: 'rgba(244, 246, 248, 0.8)',
        // backgroundColor: theme.palette.primary.lighter,
    },
});

//這個是最下方換頁會用到的CSS
export const TablePaginationStyle = {
    '& .MuiTablePagination-toolbar': {
        minHeight: '65px',
        height: '65px',
    },
    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
        lineHeight: '65px',
    }
};

