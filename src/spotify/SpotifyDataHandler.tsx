import axios from 'axios';
import React, { useEffect } from 'react'
import { SpotifyUser } from './SpotifyConstants';
import { useLocation as location } from "react-router-dom";
import qs from 'qs';
import { SpotifyData } from '../constants';
import { getSpotifyUserData, getSpotifyUserPlaylists } from './SpotifyHTTPFunctions';


function SpotifyDataHandler(props: { spotifyData: SpotifyData, setSpotifyData: (data: SpotifyData) => void }) {
    const { spotifyData, setSpotifyData } = props;
    const setUser = (user: SpotifyUser | undefined) => { setSpotifyData({ ...spotifyData, user }) };
    const removeAccessToken = () => { setSpotifyData({ ...spotifyData, accessToken: undefined, loaded: false }) };
    const removeTokens = () => { setSpotifyData({ ...spotifyData, accessToken: undefined, refreshToken: undefined, loaded: false }) };
    const setTokens = (tokens: { refreshToken?: any, accessToken?: any }) => { setSpotifyData({ ...spotifyData, ...tokens }) };
    const queries = new URLSearchParams(location().search);

    const updateSpotifyData = async () => {
        var user;
        if (spotifyData.accessToken) {
            try {
                const userData = await getSpotifyUserData(spotifyData.accessToken);
                if (!userData) {
                    return;
                }
                const { user: fetchedUser, error } = userData;
                if (error) {
                    if (error.response?.status === 401) {
                        window.localStorage.removeItem("spotifyAccessToken");
                        removeAccessToken();
                    }
                    return;
                }
                user = fetchedUser
            } catch (e: any) {
                console.log(e);
                window.localStorage.removeItem("spotifyAccessToken");
                removeAccessToken();
            }
            if (user) {
                try {
                    const playlistData = await getSpotifyUserPlaylists(spotifyData.accessToken);
                    if (!playlistData) {
                        return;
                    }
                    const { playlists, nextTracksURL, error } = playlistData;
                    if (error) {
                        if (error.response?.status === 401) {
                            window.localStorage.removeItem("spotifyAccessToken");
                            removeAccessToken();
                        }
                        return;
                    }
                    user = {
                        ...user,
                        playlists,
                        nextTracksURL,
                    };
                } catch (e: any) {
                    console.log(e);
                }
            }
            setUser(user);
        }
    }

    const getTokens = async (code: string) => {
        try {
            const data = {
                grant_type: 'authorization_code',
                code,
                redirect_uri: process.env.REACT_APP_SPOTIFY_REDIRECT_URI
            }
            const res = await axios.post(`${process.env.REACT_APP_SPOTIFY_TOKEN_ENDPOINT}`, qs.stringify(data), {
                headers: {
                    Authorization: 'Basic ' + btoa(`${process.env.REACT_APP_SPOTIFY_CLIENTID}:${process.env.REACT_APP_SPOTIFY_SECRET}`),
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });
            const { access_token: accessToken, refresh_token: refreshToken } = res.data;
            window.localStorage.setItem(`spotifyAccessToken`, accessToken);
            window.localStorage.setItem(`spotifyRefreshToken`, refreshToken);
            setTokens({ accessToken, refreshToken })
        } catch (e: any) {
            console.log(e);
            if (e?.response?.status === 401) {
                window.localStorage.removeItem("spotifyAccessToken");
                removeAccessToken();
            }
        }
    }

    const refreshAccessToken = async () => {
        try {
            const data = {
                grant_type: 'refresh_token',
                refresh_token: spotifyData.refreshToken,
            }
            const res = await axios.post('https://accounts.spotify.com/api/token', qs.stringify(data), {
                headers: {
                    Authorization: 'Basic ' + btoa(`${process.env.REACT_APP_SPOTIFY_CLIENTID}:${process.env.REACT_APP_SPOTIFY_SECRET}`),
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });
            const { access_token } = res.data;
            window.localStorage.setItem(`spotifyAccessToken`, access_token);
            setTokens({ accessToken: access_token });
            return access_token;
        } catch (e: any) {
            console.log(e);
            if (e?.response?.status === 401) {
                window.localStorage.removeItem("spotifyAccessToken");
                window.localStorage.removeItem("spotifyRefreshToken");
                removeTokens();
            }
        }
    }

    useEffect(() => {
        if (queries.get('state') === 'spotify') {
            var code = queries.get('code');
            if (code) {
                window.history.replaceState({}, "", `${window.location.origin}${window.location.pathname}`)
                getTokens(code);
            }
            queries.delete('state');
        } else {
            var accessToken = window.localStorage.getItem('spotifyAccessToken');
            var refreshToken = window.localStorage.getItem('spotifyRefreshToken');
            setTokens({ accessToken, refreshToken });
        }
    }, [])

    useEffect(() => {
        if (!spotifyData.loaded && spotifyData.accessToken) {
            updateSpotifyData();
        } else if (!spotifyData.loaded && spotifyData.refreshToken) {
            refreshAccessToken();
        }
    }, [spotifyData.accessToken, spotifyData.refreshToken, spotifyData.loaded])

    return <div></div>
}

export default SpotifyDataHandler;