import { Avatar, Button, Menu, MenuItem } from '@mui/material';
import React, { useState, MouseEvent, useEffect } from 'react';
import YoutubeIcon from '../logos/YoutubeIcon';
import { YoutubeUser } from './YoutubeConstants';

interface YoutubeUserButtonProps {
    youtubeUser: YoutubeUser | undefined;
    logOut: () => void;
}

function YoutubeUserButton(props: YoutubeUserButtonProps) {
    const { youtubeUser, logOut } = props;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        console.log('close')
        setAnchorEl(null);
    };

    return youtubeUser ?
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
            {youtubeUser.profileImageURL && <Avatar src={youtubeUser.profileImageURL} style={{ margin: '5px 10px 5px 0px' }} />}
            {youtubeUser.display_name}
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
                        handleClose();
                        logOut();
                    }}>Logout</MenuItem>
            </Menu>
        </Button>
        :
        <Button
            variant="contained"
            startIcon={<YoutubeIcon />}
            color={'primary'}
            style={{ width: '100%', marginRight: '20px' }}
            href={`${process.env.REACT_APP_YOUTUBE_AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_YOUTUBE_CLIENTID}&redirect_uri=${process.env.REACT_APP_YOUTUBE_REDIRECT_URI}&response_type=${process.env.REACT_APP_YOUTUBE_RESPONSE_TYPE}&scope=${process.env.REACT_APP_YOUTUBE_SCOPE}&state=youtube&access_type=${process.env.REACT_APP_YOUTUBE_ACCESS_TYPE}`}>
            Login
        </Button>
}

export default YoutubeUserButton;