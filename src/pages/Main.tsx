import React, { useEffect, useState } from 'react';
import { Grid, Button, Typography, ToggleButton, ToggleButtonGroup, styled, useTheme, Box } from '@mui/material';
import { SpotifyTrackState, SpotifyUser } from '../spotify/SpotifyConstants';
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
    const [spotifyData, setSpotifyData] = useState<SpotifyData>({ loaded: false });
    const [youtubeData, setYoutubeData] = useState<YoutubeData>({ loaded: false });
    const [playlistsDisplayed, setPlaylistsDisplayed] = useState<string | null>("spotify");
    const [currentYoutubePlaylist, setCurrentYoutubePlaylist] = useState<string>();
    const [currentSpotifyPlaylist, setCurrentSpotifyPlaylist] = useState<string>();
    const [spotifyPlayer, setSpotifyPlayer] = useState(undefined);
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [current_track, setTrack] = useState<SpotifyTrackState>({ position: 0, paused: true });
    const [interval, setTimeInterval] = useState<any>();
    const [shouldIncrementTimestamp, setShouldIncrementTimestamp] = useState(false);
    const [spotifyPlayerReady, setSpotifyPlayerReady] = useState(false);
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

    const createTimestampString = (milliseconds: number) => {
        const hours = Math.floor(milliseconds / 3600000);
        const minutes = Math.floor(milliseconds / 60000) % 60;
        const seconds = Math.floor(milliseconds / 1000) % 60;
        return `${hours > 0 ? `${hours}:` : ''}${hours > 0 ? String(minutes).padStart(2, '0') : minutes}:${String(seconds).padStart(2, '0')}`;
    }

    const intervalCall = () => { setShouldIncrementTimestamp(true) }
    const intervalSet = () => {
        if (!interval && !current_track.paused) {
            const i = setInterval(() => {
                intervalCall();
            }, 1000)
            console.log(`${i} interval called`);
            setTimeInterval(i);
        }
    }

    const intervalClear = () => {
        clearInterval(interval);
        console.log(`clearing ${interval}`);
        setTimeInterval(undefined);
    }

    const setupPlayer = async () => {
        const player = new window.Spotify.Player({
            name: 'Web Playback SDK',
            getOAuthToken: (cb: any) => { cb(spotifyData.accessToken); },
            volume: 0.5
        });

        setSpotifyPlayer(player)

        player.addListener('ready', (props: { device_id: string }) => {
            console.log('Ready with Device ID', props.device_id);
        });

        player.addListener('not_ready', (props: { device_id: string }) => {
            console.log('Device ID has gone offline', props.device_id);
        });

        player.addListener('player_state_changed', ((state: SpotifyTrackState) => {

            if (!state) {
                return;
            }

            setTrack({
                ...state.track_window.current_track,
                position: state.position,
                artist: state.track_window?.current_track?.artists ? state.track_window?.current_track?.artists[0].name : undefined,
                image: state.track_window?.current_track?.album?.images ? state.track_window?.current_track?.album?.images[0].url : undefined,
                timeString: createTimestampString(state.position),
                paused: state.paused,
            });
            setPaused(state.paused ?? false);
            if (state.paused) {
                intervalClear();
            }


            player.getCurrentState().then((state: any) => {
                (!state) ? setActive(false) : setActive(true)
            });

        }));

        player.setName("Playlist Mixer").then(() => {
            console.log('Player name updated!');
        });

        player.connect();
    }

    useEffect(() => {
        if (spotifyPlayerReady && spotifyData.accessToken && !spotifyPlayer) {
            setupPlayer();
        }
    }, [spotifyPlayerReady, spotifyData.accessToken, spotifyPlayer])

    useEffect(() => {
        console.log(`paused: ${current_track.paused}; interval: ${interval}`)
        if (current_track.paused) {
            clearInterval(interval);
        } else if (!current_track.paused) {
            intervalSet();
        }
    }, [current_track.paused])

    useEffect(() => {
        console.log(document.getElementsByClassName('spotify-script'));
        if (document.getElementsByClassName('spotify-script').length == 0) {
            const script = document.createElement("script");
            script.src = "https://sdk.scdn.co/spotify-player.js";
            script.async = true;
            script.className = 'spotify-script';

            document.body.appendChild(script);
        }
        window.onSpotifyWebPlaybackSDKReady = () => {
            setSpotifyPlayerReady(true);
        };
    }, [spotifyData.accessToken]);

    useEffect(() => {
        if (shouldIncrementTimestamp) {
            setTrack(() => {
                return {
                    ...current_track,
                    position: current_track.position + 1000,
                    timeString: createTimestampString(current_track.position + 1000),
                }
            });
        }
        setShouldIncrementTimestamp(false);
    }, [shouldIncrementTimestamp])

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
            <div style={{ flex: 1 }}>
                {playlistsDisplayed === 'spotify' && spotifyData?.user?.playlists && <SpotifyPlaylists
                    user={spotifyData.user}
                    setUser={(user: SpotifyUser | undefined) => setSpotifyData({ ...spotifyData, user })}
                    currentPlaylist={currentSpotifyPlaylist}
                    setCurrentPlaylist={setCurrentSpotifyPlaylist}
                    accessToken={spotifyData.accessToken} />}
                {playlistsDisplayed === 'youtube' && youtubeData?.user?.playlists && <YoutubePlaylists
                    user={youtubeData.user}
                    setUser={(user: YoutubeUser | undefined) => setYoutubeData({ ...youtubeData, user })}
                    currentPlaylist={currentYoutubePlaylist}
                    setCurrentPlaylist={setCurrentYoutubePlaylist} />}
            </div>
            <Box sx={{ display: 'flex', position: 'relative', backgroundColor: 'primary.main', padding: '10px', }}>
                <div className="track-information" style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
                    <img src={current_track.image ?? ""} height='60px'
                        className="now-playing__cover" alt="" />
                    <div className="now-playing__side" style={{ marginLeft: '10px', textAlign: 'left' }}>
                        <div className="now-playing__name" style={{ fontWeight: 'bold' }}>{
                            current_track?.name ?? ""
                        }</div>
                        <div className="now-playing__artist">{
                            current_track?.artist ?? ""
                        }</div>
                    </div>
                </div>
                <div style={{ display: 'flex', maxWidth: '50%', justifyContent: 'end' }}>
                    <Box sx={{ backgroundColor: 'secondary.main', width: '500px' }}>
                        {`${current_track?.timeString}`}
                    </Box>
                    <Button onClick={setupPlayer} sx={{ color: 'white' }}>Connect</Button>
                </div>
            </Box>
        </div >
    );

}

export default Main;