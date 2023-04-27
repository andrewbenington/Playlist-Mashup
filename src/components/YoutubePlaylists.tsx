import React, { useState } from 'react';
import { Box, Button, styled, useTheme } from "@mui/material";
import { YoutubePlaylist, YoutubeUser } from '../youtube/YoutubeConstants';

interface PlaylistSidebarProps {
    user: YoutubeUser | undefined;
    setUser: (user: YoutubeUser | undefined) => void;
    currentPlaylist: string | undefined;
    setCurrentPlaylist: (playlist: string | undefined) => void;
}

function YoutubePlaylists(props: PlaylistSidebarProps) {
    const { setUser, user, currentPlaylist, setCurrentPlaylist } = props;

    return <div style={{ flex: 1, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, overflowY: 'scroll', scrollbarColor: 'green', width: '16.666%' }}>
            <Box sx={{
                color: 'secondary.main',
                fontWeight: 'bold',
                height: 45,
                backgroundColor: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                Youtube Playlists
            </Box>
            {user?.playlists?.map((playlist: YoutubePlaylist) =>
                <Button
                    onClick={() => setCurrentPlaylist(playlist.id)}
                    sx={{
                        width: '100%',
                        padding: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textTransform: 'none',
                    }}>
                    <Box sx={{
                        height: 45,
                        width: '100%',
                        backgroundColor: currentPlaylist === playlist.id ? 'primary.main' : 'secondary.main',
                        '&:hover': {
                            backgroundColor: 'primary.dark',
                            cursor: 'pointer',
                        },
                        color: 'text.primary',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        {playlist.name}
                    </Box>
                </Button>)}
            {user?.nextTracksURL && user?.getNextPlaylist &&
                < Button
                    onClick={async () => {
                        if (user.getNextPlaylist) {
                            const newUserData = await user.getNextPlaylist(user);
                            if (newUserData) {
                                setUser(newUserData);
                            }
                        }
                    }}
                    sx={{
                        width: '100%',
                        padding: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Box
                        sx={{
                            height: 35,
                            width: '100%',
                            color: 'secondary.main',
                            fontWeight: 'bold',
                            backgroundColor: 'white',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        More...
                    </Box>
                </Button>}
        </div>
    </div >
}

export default YoutubePlaylists;