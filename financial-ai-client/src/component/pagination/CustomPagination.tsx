import { Pagination } from "@mui/material"

interface PageProps{
    count:number,
    onChange?:(event: React.ChangeEvent<unknown>, value: number) => void
    page:number
}
const CustomPagination=(pageProps:PageProps)=>{
    return (
        <>
        <Pagination 
            count={pageProps.count}
            onChange={pageProps.onChange}
            page={pageProps.page}
            size="large" 
            id={`pagination-${pageProps.page}`}
            sx={{
                '& .MuiPaginationItem-root': {
                  '&.Mui-selected': {
                    bgcolor: '#2196f3', // 選中時的背景色
                    color: 'white',     // 選中時的文字顏色
                    '&:hover': {
                      bgcolor: '#1976d2', // hover 時的背景色
                    },
                  },
                  '&:hover': {
                    bgcolor: 'rgba(33, 150, 243, 0.1)', // 未選中時 hover 的背景色
                  },
                }
              }}
        />
        </>
    )
}
export default CustomPagination