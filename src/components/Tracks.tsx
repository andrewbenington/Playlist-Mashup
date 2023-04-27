import React from 'react';
import { Box, Button } from "@mui/material";
import { SpotifyPlaylist, SpotifyUser } from '../spotify/SpotifyConstants';
import { getSpotifyUserPlaylists } from '../spotify/SpotifyHTTPFunctions';
import { Track } from '../constants';

interface PlaylistSidebarProps {
    label: string;
    tracks: Track[];
    setCurrentTrack: (track: string) => null;
}

function TrackList(props: PlaylistSidebarProps) {
    const { label, tracks, setCurrentTrack } = props;

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
                {label}
            </Box>
            {tracks?.map((track: Track) =>
                <Button
                    onClick={() => setCurrentTrack(track.id)}
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
                        '&:hover': {
                            backgroundColor: 'primary.dark',
                            cursor: 'pointer',
                        },
                        color: 'text.primary',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        {track.name}
                    </Box>
                </Button>)}
        </div>
    </div >
}

export default TrackList;