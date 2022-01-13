import { Avatar, Button, Menu, MenuItem } from '@mui/material';
import React, { useState, MouseEvent, useEffect } from 'react';
import SpotifyIcon from '../logos/SpotifyIcon';
import { SpotifyUser } from './SpotifyConstants';

interface SpotifyUserButtonProps {
    spotifyUser: SpotifyUser | undefined;
    logOut: () => void;
}

function SpotifyUserButton(props: SpotifyUserButtonProps) {
    const { spotifyUser, logOut } = props;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        console.log('close')
        setAnchorEl(null);
    };

    return spotifyUser ?
        <Button
            sx={{
                color: 'text.primary',
                '&:hover': {
                    backgroundColor: 'primary.dark',
                    cursor: 'pointer',
                },
                width: '100%', 
                marginRight: '20px'
            }}
            variant='contained'
            disabled={Boolean(anchorEl)}
            onClick={handleClick}
        >
            {spotifyUser.profileImageURL && <Avatar src={spotifyUser.profileImageURL} style={{ margin: '5px 10px 5px 0px' }} />}
            {spotifyUser.display_name}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuItem
                    sx={{
                        color: 'primary.main',
                        height: '100%'
                    }}
                    onClick={() => {
                        window.localStorage.removeItem(`spotifyToken`);
                        logOut();
                        handleClose();
                    }}>Logout</MenuItem>
            </Menu>
        </Button>
        : <a href={`${process.env.REACT_APP_SPOTIFY_AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_SPOTIFY_CLIENTID}&redirect_uri=${process.env.REACT_APP_SPOTIFY_REDIRECT_URI}&response_type=${process.env.REACT_APP_SPOTIFY_RESPONSE_TYPE}&state=spotify&scope=${process.env.REACT_APP_SPOTIFY_SCOPE}`} style={{ width: '100%', marginRight: '20px' }}>
            <Button variant="contained" startIcon={<SpotifyIcon />} color={'primary'} style={{ width: '100%' }}>
                Login
            </Button>
        </a>
}

export default SpotifyUserButton