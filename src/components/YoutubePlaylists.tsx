import React from 'react';
import { Box, Button } from "@mui/material";
import { YoutubePlaylist, YoutubeUser } from '../youtube/YoutubeConstants';

function YoutubePlaylists(props: { user: YoutubeUser, setUser: any }) {
    const { setUser, user } = props;
    const { playlists, nextTracksURL, getNextPlaylist } = user;

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
            {playlists && playlists.map((playlist: YoutubePlaylist) =>
                <Box sx={{
                    height: 45,
                    backgroundColor: 'secondary.main',
                    '&:hover': {
                        backgroundColor: 'primary.dark',
                        cursor: 'pointer',
                    },
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    {playlist.name}
                </Box>)}
            {nextTracksURL && getNextPlaylist &&
                <Button
                    onClick={async () => {
                        const newUserData = await getNextPlaylist(user);
                        if (newUserData) {
                            setUser(newUserData);
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