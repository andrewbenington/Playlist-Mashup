import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { YoutubeData } from '../constants';
import { YoutubeUser } from './YoutubeConstants';
import { useLocation as location } from "react-router-dom";
import qs from 'qs';

function YoutubeDataHandler(props: { youtubeData: YoutubeData, setYoutubeData: (data: YoutubeData) => void }) {
    const { youtubeData, setYoutubeData } = props;
    const setUser = (user: YoutubeUser | undefined) => { setYoutubeData({ ...youtubeData, user }) };
    const removeAccessToken = () => { setYoutubeData({ ...youtubeData, accessToken: undefined }) };
    const setTokens = (tokens: { refreshToken?: any, accessToken?: any }) => { setYoutubeData({ ...youtubeData, ...tokens }) };
    const queries = new URLSearchParams(location().search);

    const getYoutubeUserData = async () => {
        var userData;
        try {
            const res = await axios.get('https://youtube.googleapis.com/youtube/v3/channels?part=snippet&mine=true', {
                headers: {
                    Authorization: `Bearer ${youtubeData.accessToken}`,
                    Accept: 'application/json'
                }
            });
            if (res.data.items?.length > 0) {
                userData = res.data.items[0].snippet;
                if (userData.thumbnails?.default) {
                    userData = { id: res.data.items[0].id, display_name: userData.title, profileImageURL: userData.thumbnails.default.url };
                }
                return userData;
            }
        } catch (e: any) {
            console.log(e);
            if (e?.response?.status === 401) {
                window.localStorage.removeItem("youtubeAccessToken");
                removeAccessToken();
            }
        }
    }

    const getYoutubeUserPlaylists = async () => {
        try {
            const res = await axios.get('https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails%2Cstatus&maxResults=25&mine=true', {
                headers: {
                    Authorization: `Bearer ${youtubeData.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            if (res.data?.items?.length) {
                const playlists = res.data.items.map((playlist: any) => {
                    return {
                        name: playlist.snippet?.title,
                        description: playlist.snippet?.description,
                        id: playlist.id,
                        images: [
                            playlist.snippet?.thumbnails?.default,
                            playlist.snippet?.thumbnails?.medium,
                            playlist.snippet?.thumbnails?.high,
                        ],
                        owner: playlist.snippet?.channelTitle,
                        privacy_status: playlist.status?.privacyStatus,
                        tracks: { total: playlist.contentDetails?.itemCount },
                    }
                });
                const nextTracksURL = res.data.nextPageToken ? `https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails%2Cstatus&maxResults=25&mine=true&pageToken=${res.data.nextPageToken}` : undefined;
                return { playlists, nextTracksURL };
            }
        } catch (e: any) {
            console.log(e);
            if (e.response.status === 401) {
                window.localStorage.removeItem("youtubeAccessToken");
                removeAccessToken();
            }
        }
    }

    const getMoreYoutubeUserPlaylists = async (currentYoutubeUser: YoutubeUser) => {
        if (currentYoutubeUser?.nextTracksURL && currentYoutubeUser?.playlists) {
            try {
                const res = await axios.get(currentYoutubeUser?.nextTracksURL, {
                    headers: {
                        Authorization: `Bearer ${youtubeData.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                const morePlaylists = res.data.items.map((playlist: any) => {
                    return {
                        name: playlist.snippet?.title,
                        description: playlist.snippet?.description,
                        id: playlist.id,
                        images: [
                            playlist.snippet?.thumbnails?.default,
                            playlist.snippet?.thumbnails?.medium,
                            playlist.snippet?.thumbnails?.high,
                        ],
                        owner: playlist.snippet?.channelTitle,
                        privacy_status: playlist.status?.privacyStatus,
                        tracks: { total: playlist.contentDetails?.itemCount },
                    }
                });
                const nextTracksURL = res.data.nextPageToken ? `https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails%2Cstatus&maxResults=25&mine=true&pageToken=${res.data.nextPageToken}` : undefined;
                return {
                    ...currentYoutubeUser,
                    playlists: [...currentYoutubeUser.playlists, ...morePlaylists],
                    nextTracksURL,
                }
            } catch (e: any) {
                console.log(e);
                if (e?.response?.status === 401) {
                    window.localStorage.removeItem("youtubeAccessToken");
                    removeAccessToken();
                }
            }
        }
    }

    const updateYoutubeData = async () => {
        var userData;
        if (youtubeData.accessToken) {
            try {
                userData = await getYoutubeUserData();
            } catch (e: any) {
                console.log(e);
                if (e?.response?.status === 401) {
                    window.localStorage.removeItem("youtubeAccessToken");
                    removeAccessToken();
                }
            }
        }
        if (userData) {
            try {
                const playlistData = await getYoutubeUserPlaylists();
                if (!playlistData) {
                    return;
                }
                const { playlists, nextTracksURL } = playlistData;
                userData = {
                    ...userData,
                    playlists,
                    nextTracksURL,
                    getNextPlaylist: getMoreYoutubeUserPlaylists
                };
                setUser(userData);
            } catch (e) {
                console.log(e);
            }
        }
        setUser(userData);

    }

    const getTokens = async (code: string) => {
        try {
            const data = {
                grant_type: 'authorization_code',
                code,
                redirect_uri: process.env.REACT_APP_YOUTUBE_REDIRECT_URI,
                client_id: process.env.REACT_APP_YOUTUBE_CLIENTID,
                client_secret: process.env.REACT_APP_YOUTUBE_SECRET,
            }
            const res = await axios.post(`${process.env.REACT_APP_YOUTUBE_TOKEN_ENDPOINT}`, qs.stringify(data), {
                headers: {
                    //Authorization: 'Basic ' + btoa(`${process.env.REACT_APP_YOUTUBE_CLIENTID}:${process.env.REACT_APP_YOUTUBE_SECRET} `),
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });
            const { access_token: accessToken, refresh_token: refreshToken } = res.data;
            window.localStorage.setItem(`youtubeAccessToken`, accessToken);
            window.localStorage.setItem(`youtubeRefreshToken`, refreshToken);
            setTokens({ accessToken, refreshToken })
        } catch (e: any) {
            if (e?.response?.status === 401) {
                window.localStorage.removeItem("youtubeAccessToken");
                removeAccessToken();
            }
        }
    }

    const refreshAccessToken = async () => {
        try {
            const data = {
                grant_type: 'refresh_token',
                refresh_token: youtubeData.refreshToken,
                client_id: process.env.REACT_APP_YOUTUBE_CLIENTID,
                client_secret: process.env.REACT_APP_YOUTUBE_SECRET,
            }
            const res = await axios.post(`${process.env.REACT_APP_YOUTUBE_TOKEN_ENDPOINT} `, qs.stringify(data), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });
            const { access_token } = res.data;
            window.localStorage.setItem(`youtubeAccessToken`, access_token);
            setTokens({ accessToken: access_token });
            return access_token;
        } catch (e: any) {
            console.log(e);
            if (e?.response?.status === 401) {
                window.localStorage.removeItem("youtubeAccessToken");
                removeAccessToken();
                window.localStorage.removeItem("youtubeRefreshToken");
            }
        }
    }


    useEffect(() => {
        if (queries.get('state') === 'youtube') {
            var code = queries.get('code');
            if (code) {
                window.history.replaceState({}, "", `${window.location.origin}${window.location.pathname} `)
                getTokens(code);
            }
            queries.delete('state');
        } else {
            var accessToken = window.localStorage.getItem('youtubeAccessToken');
            var refreshToken = window.localStorage.getItem('youtubeRefreshToken');
            setTokens({ accessToken, refreshToken });
        }
    }, [])

    useEffect(() => {
        if (youtubeData.accessToken) {
            updateYoutubeData();
        } else if (youtubeData.refreshToken) {
            refreshAccessToken();
        }
    }, [youtubeData.accessToken, youtubeData.refreshToken])

    return <div></div>
}

export default YoutubeDataHandler;