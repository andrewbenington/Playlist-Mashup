import React from 'react';
import { Box, Button } from "@mui/material";
import { SpotifyPlaylist, SpotifyUser } from '../spotify/SpotifyConstants';
import { getSpotifyUserPlaylists } from '../spotify/SpotifyHTTPFunctions';

interface PlaylistSidebarProps {
    user?: SpotifyUser;
    setUser: (user: SpotifyUser | undefined) => void;
    currentPlaylist?: string;
    setCurrentPlaylist: (playlist: string | undefined) => void;
    accessToken?: string;
}

function SpotifyPlaylists(props: PlaylistSidebarProps) {
    const { setUser, user, currentPlaylist, setCurrentPlaylist, accessToken } = props;

    // const getTracks = () => {
    //     https://api.spotify.com/v1/playlists/30P3Mh7HC7lWCoPSjiqFon/tracks?limit=50&fields=next,total,items(is_local,track(id,name,href,album(name),artists(name)))
    // }

    return <div style={{ height: '100%', position: 'relative' }}>
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
                Spotify Playlists
            </Box>
            {user?.playlists?.map((playlist: SpotifyPlaylist) =>
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
                        backgroundColor: currentPlaylist === playlist.id ? 'primary.main' : 'secondary.main',
                        width: '100%',
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
            {user?.nextTracksURL &&
                <Button
                    onClick={async () => {
                        if (accessToken) {
                            const { playlists, nextTracksURL, error } = await getSpotifyUserPlaylists(accessToken);
                            if (error) {
                                return;
                            }
                            if (playlists) {
                                setUser({
                                    ...user,
                                    playlists: [...(user.playlists ?? []), ...playlists]
                                }
                                );
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

export default SpotifyPlaylists;