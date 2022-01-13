import axios from 'axios';
import React, { useEffect } from 'react'
import { SpotifyUser } from './SpotifyConstants';
import { useLocation as location } from "react-router-dom";
import qs from 'qs';
import { SpotifyData } from '../constants';


function SpotifyDataHandler(props: { spotifyData: SpotifyData, setSpotifyData: (data: SpotifyData) => void }) {
    const { spotifyData, setSpotifyData } = props;
    const setUser = (user: SpotifyUser | undefined) => { setSpotifyData({ ...spotifyData, user }) };
    const removeAccessToken = () => { setSpotifyData({ ...spotifyData, accessToken: undefined }) };
    const setTokens = (tokens: { refreshToken?: any, accessToken?: any }) => { setSpotifyData({ ...spotifyData, ...tokens }) };
    const queries = new URLSearchParams(location().search);

    const getSpotifyUserData = async (token: string) => {
        var userData = {};
        try {
            const res = await axios.get('https://api.spotify.com/v1/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (res.data) {
                userData = res.data;
                if (res.data.images?.length > 0) {
                    userData = { ...userData, profileImageURL: res.data.images[0].url };
                }
                return userData;
            } else {
                return;
            }
        } catch (e: any) {
            console.log(e);
            window.localStorage.removeItem("spotifyAccessToken");
            removeAccessToken();
        }
    }

    const getSpotifyUserPlaylists = async () => {
        try {
            const res = await axios.get('https://api.spotify.com/v1/me/playlists?limit=25', {
                headers: {
                    Authorization: `Bearer ${spotifyData.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            const playlists = res.data.items.map((playlist: any) => {
                return {
                    ...playlist,
                    privacy_status: playlist.public ? 'public' : 'private',
                    owner: playlist.owner?.display_name,
                }
            });
            const nextTracksURL = res.data.next ? res.data.next : undefined;
            return { playlists, nextTracksURL };
        } catch (e: any) {
            console.log(e);
            if (e?.response?.status === 401) {
                window.localStorage.removeItem("spotifyAccessToken");
                removeAccessToken();
            }
        }
    }

    const getMoreSpotifyUserPlaylists = async (currentSpotifyUser: SpotifyUser) => {
        if (currentSpotifyUser?.nextTracksURL && currentSpotifyUser?.playlists) {
            try {
                const res = await axios.get(currentSpotifyUser?.nextTracksURL, {
                    headers: {
                        Authorization: `Bearer ${spotifyData.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                return {
                    ...currentSpotifyUser, playlists: [
                        ...currentSpotifyUser.playlists,
                        ...res.data.items.map((playlist: any) => {
                            return {
                                ...playlist,
                                privacy_status: playlist.public ? 'public' : 'private',
                                owner: playlist.owner?.display_name,
                            }
                        })], nextTracksURL: res.data.next,
                }
            } catch (e: any) {
                console.log(e);
                if (e?.response?.status === 401) {
                    window.localStorage.removeItem("spotifyAccessToken");
                    removeAccessToken();
                }
            }
        }
    }

    const updateSpotifyData = async () => {
        var userData;
        if (spotifyData.accessToken) {
            try {
                userData = await getSpotifyUserData(spotifyData.accessToken);
            } catch (e: any) {
                console.log(e);
                window.localStorage.removeItem("spotifyAccessToken");
                removeAccessToken();
            }
        }
        if (userData) {
            try {
                const playlistData = await getSpotifyUserPlaylists();
                if (!playlistData) {
                    return;
                }
                const { playlists, nextTracksURL } = playlistData;
                userData = {
                    ...userData,
                    playlists,
                    nextTracksURL,
                    getNextPlaylist: getMoreSpotifyUserPlaylists
                };
                setUser(userData);
            } catch (e: any) {
                console.log(e);
                if (e?.response?.status === 401) {
                    window.localStorage.removeItem("spotifyAccessToken");
                    removeAccessToken();
                }
            }
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
                removeAccessToken();
                window.localStorage.removeItem("spotifyRefreshToken");
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
        if (spotifyData.accessToken) {
            updateSpotifyData();
        } else if (spotifyData.refreshToken) {
            refreshAccessToken();
        }
    }, [spotifyData.accessToken, spotifyData.refreshToken])

    return <div></div>
}

export default SpotifyDataHandler;