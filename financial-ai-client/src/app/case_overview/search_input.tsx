'use client';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';

// 個案總覽上方的搜尋 bar
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: "15px",
    border: '1px solid #e4e7e9',
    '&:hover': {
        border: '1px solid black',
    },
    '&:focus-within': {
        border: '1px solid black',
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    maxWidth: '30%',
    width: '30%',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'auto',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
    },
    '& .MuiInputBase-input:focus': {
        outline: 'none',
    },
}));

// Props: 傳遞搜尋關鍵字給父元件
interface SearchBarProps {
    onSearch: (keyword: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [searchText, setSearchText] = useState('');
  

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            onSearch(searchText.trim());
        }
    };



    return (
        <>       
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                </Box>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="輸入關鍵字"
                            fullWidth
                            inputProps={{ 'aria-label': 'search' }}
                            value={searchText}
                            onChange={handleChange}
                            onKeyDown={handleKeyPress}
                            id='search-bar'
                        />
                    </Search>     
            </>
            );
}
