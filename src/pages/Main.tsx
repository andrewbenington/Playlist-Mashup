import React, { useState } from 'react';
import { Grid, Button, Typography, ToggleButton, ToggleButtonGroup, styled, useTheme } from '@mui/material';
import { SpotifyUser } from '../spotify/SpotifyConstants';
import SpotifyDataHandler from '../spotify/SpotifyDataHandler';
import SpotifyIcon from '../logos/SpotifyIcon';
import SpotifyPlaylists from '../components/SpotifyPlaylists';
import SpotifyUserButton from '../spotify/SpotifyUserButton';
import YoutubeUserButton from '../youtube/YoutubeUserButton';
import { YoutubeUser } from '../youtube/YoutubeConstants';
import YoutubeDataHandler from '../youtube/YoutubeDataHandler';
import YoutubeIcon from '../logos/YoutubeIcon';
import { SpotifyData, YoutubeData } from '../constants';
import YoutubePlaylists from '../components/YoutubePlaylists';

function Main() {
    const [spotifyData, setSpotifyData] = useState<SpotifyData>({});
    const [youtubeData, setYoutubeData] = useState<YoutubeData>({});
    const [playlistsDisplayed, setPlaylistsDisplayed] = useState<string | null>("spotify");
    const theme = useTheme();

    const handlePlaylistToggle = (
        event: React.MouseEvent<HTMLElement>,
        newSelection: string | null,
    ) => {
        if (newSelection) {
            setPlaylistsDisplayed(newSelection);
        }
    };

    const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
        '& .MuiToggleButtonGroup-grouped': {
            '&.Mui-selected': {
                border: 1,
                backgroundColor: '#f50057',
                '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                },
            },
        },
    }));

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <SpotifyDataHandler
                spotifyData={spotifyData} setSpotifyData={setSpotifyData} />
            <YoutubeDataHandler
                youtubeData={youtubeData} setYoutubeData={setYoutubeData} />
            <Grid container style={{ minWidth: '100%', backgroundColor: '#133C55', position: 'relative', top: 0, bottom: 0 }}>
                <Grid item xs={2} style={{ alignItems: 'center', display: 'flex', padding: '10px 25px' }}>
                    <StyledToggleButtonGroup
                        value={playlistsDisplayed}
                        exclusive
                        onChange={handlePlaylistToggle}
                        aria-label="selected playlists"
                        fullWidth>
                        <ToggleButton value="spotify" aria-label="spotify playlists">
                            <SpotifyIcon />
                        </ToggleButton>
                        <ToggleButton value="youtube" aria-label="youtube playlists">
                            <YoutubeIcon />
                        </ToggleButton>
                    </StyledToggleButtonGroup>
                </Grid>
                <Grid item xs={6} style={{ alignItems: 'center', display: 'flex', padding: '10px 25px' }}>
                    <Typography variant={'h3'} style={{ textAlign: 'left' }}>Playlist Mashup</Typography>
                </Grid>
                <Grid item xs={4} style={{ justifyContent: 'space-evenly', alignItems: 'center', display: 'flex' }}>
                    <SpotifyUserButton spotifyUser={spotifyData.user} logOut={() => {
                        setSpotifyData({});
                        window.localStorage.removeItem("spotifyAccessToken");
                        window.localStorage.removeItem("spotifyRefreshToken");
                    }} />
                    <YoutubeUserButton youtubeUser={youtubeData.user} logOut={() => {
                        setYoutubeData({});
                        window.localStorage.removeItem("youtubeAccessToken");
                        window.localStorage.removeItem("youtubeRefreshToken");
                    }} />

                </Grid>
            </Grid>
            {playlistsDisplayed === 'spotify' && spotifyData?.user?.playlists && <SpotifyPlaylists
                user={spotifyData.user}
                setUser={(user: SpotifyUser | undefined) => setSpotifyData({ ...spotifyData, user })} />}
            {playlistsDisplayed === 'youtube' && youtubeData?.user?.playlists && <YoutubePlaylists
                user={youtubeData.user}
                setUser={(user: YoutubeUser | undefined) => setYoutubeData({ ...youtubeData, user })} />}
        </div >
    );

}

export default Main;