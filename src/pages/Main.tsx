import React, { useEffect, useState } from 'react';
import { Avatar, Button, Grid, Typography } from '@mui/material';
import YoutubeIcon from '../logos/YoutubeIcon';
import SpotifyIcon from '../logos/SpotifyIcon';
import { SpotifyPlaylist, SpotifyUser } from '../spotify/SpotifyConstants';
import { Box } from '@mui/system';
import SpotifyData from '../spotify/SpotifyData';
import YoutubeData from '../youtube/YoutubeData';

function Main() {
    const [spotifyUser, setSpotifyUser] = useState<SpotifyUser>();
    const [spotifyPlaylistOffset, setSpotifyPlaylistOffset] = useState(0);
    const [youtubeToken, setYoutubeToken] = useState("");

    useEffect(() => {
        if (window.location.pathname === 'youtube' && window.location.hash?.length > 1) {
            const service = window.location.pathname.substring(1);
            const elements = window.location.hash.substring(1).split("&");
            console.log(window.location);
            if (elements) {
                var tokenSegment = elements.find(elem => elem.startsWith("access_token"));
                if (tokenSegment) {
                    const token = tokenSegment.split("=")[1];
                    window.location.hash = ""
                    window.localStorage.setItem(`youtubeToken`, token);
                    setYoutubeToken(token);
                }
            }
        } else {
            var yToken = window.localStorage.getItem('youtubeToken')
            if (yToken) {
                setYoutubeToken(yToken);
            }
        }
    }, [])


    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <SpotifyData setSpotifyUser={setSpotifyUser} spotifyUser={spotifyUser} />
            <YoutubeData setYoutubeUser={() => { }} />
            <Grid container style={{ minWidth: '100%', backgroundColor: '#133C55', position: 'relative', top: 0, bottom: 0 }}>
                <Grid item xs={2} style={{ alignItems: 'center', display: 'flex', padding: '10px 25px' }}>
                    <Typography variant={'h3'} style={{ textAlign: 'center' }}>hooo</Typography>
                </Grid>
                <Grid item xs={6} style={{ alignItems: 'center', display: 'flex', padding: '10px 25px' }}>
                    <Typography variant={'h3'} style={{ textAlign: 'left' }}>Web Music Player</Typography>
                </Grid>
                <Grid item xs={2} style={{ alignItems: 'center', display: 'flex' }}>
                    {spotifyUser ? <Button variant="outlined">
                        {spotifyUser.profileImageURL && <Avatar src={spotifyUser.profileImageURL} style={{ margin: '5px 10px 5px 0px' }} />}
                        {spotifyUser.display_name}
                    </Button>
                        : <a href={`${process.env.REACT_APP_SPOTIFY_AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_SPOTIFY_CLIENTID}&redirect_uri=${process.env.REACT_APP_SPOTIFY_REDIRECT_URI}&response_type=${process.env.REACT_APP_RESPONSE_TYPE}`} style={{ width: '100%', padding: '0px 25px 0px 0px' }}>
                            <Button variant="contained" startIcon={<SpotifyIcon />} color={'secondary'} style={{ width: '100%' }}>
                                Login
                            </Button>
                        </a>}

                </Grid>
                <Grid item xs={2} style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                    {youtubeToken ? <Button variant="outlined">
                        {/* {spotifyUserImage && <Avatar src={spotifyUserImage} style={{ margin: '5px 10px 5px 0px' }} />}
                        {spotifyUser.display_name} */}
                        Youtube Logged In
                    </Button>
                        : <a href={`${process.env.REACT_APP_YOUTUBE_AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_YOUTUBE_CLIENTID}&redirect_uri=${process.env.REACT_APP_YOUTUBE_REDIRECT_URI}&response_type=${process.env.REACT_APP_RESPONSE_TYPE}&scope=${process.env.REACT_APP_YOUTUBE_SCOPE}`} style={{ width: '100%', padding: '0px 25px 0px 0px' }}>
                            <Button variant="contained" startIcon={<YoutubeIcon />} color={'secondary'} style={{ width: '100%' }}>
                                Login
                            </Button>
                        </a>}
                </Grid>
            </Grid>
            <div style={{ flex: 1, position: 'relative' }}>
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
                    {spotifyUser?.playlists && spotifyUser.playlists.map((playlist: SpotifyPlaylist) =>
                        <Box sx={{
                            height: 45,
                            backgroundColor: 'secondary.main',
                            '&:hover': {
                                backgroundColor: 'secondary.light',
                                opacity: [0.9, 0.8, 0.7],
                            },
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            {playlist.name}
                        </Box>)}
                </div>
            </div>
        </div>
    );

}

export default Main;