import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { SpotifyUser } from './SpotifyConstants';

function SpotifyData(props: { spotifyUser: SpotifyUser | undefined, setSpotifyUser: any }) {
    const { spotifyUser, setSpotifyUser } = props;
    const [spotifyToken, setSpotifyToken] = useState("");

    const getSpotifyUserData = async () => {
        try {
            const res = await axios.get('https://api.spotify.com/v1/me', {
                headers: {
                    Authorization: `Bearer ${spotifyToken}`,
                    'Content-Type': 'application/json'
                }
            });
            if (res.data) {
                setSpotifyUser(res.data);
                if (res.data.images?.length > 0) {
                    setSpotifyUser({ ...spotifyUser, profileImageURL: res.data.images[0].url });
                }
            }
        } catch (e) {
            console.log(e);
            window.localStorage.removeItem("token");
        }

    }

    const getSpotifyUserPlaylists = async () => {
        try {
            const res = await axios.get('https://api.spotify.com/v1/me/playlists', {
                headers: {
                    Authorization: `Bearer ${spotifyToken}`,
                    'Content-Type': 'application/json'
                }
            });
            if (res.data) {
                if (res.data?.items) {
                    setSpotifyUser({ ...spotifyUser, playlists: res.data.items, nextPlaylistURL: res.data.next });
                }
            }
        } catch (e) {
            console.log(e);
            window.localStorage.removeItem("spotifyToken");
        }
    }

    const getMoreSpotifyUserPlaylists = async () => {

    }


    useEffect(() => {
        if (window.location.pathname === '/spotify' && window.location.hash?.length > 1) {
            const elements = window.location.hash.substring(1).split("&");
            console.log(window.location);
            if (elements) {
                var tokenSegment = elements.find(elem => elem.startsWith("access_token"));
                if (tokenSegment) {
                    const token = tokenSegment.split("=")[1];
                    window.location.hash = ""
                    window.localStorage.setItem(`spotifyToken`, token);
                    setSpotifyToken(token);
                }
            }
        } else {
            var sToken = window.localStorage.getItem('spotifyToken');
            if (sToken) {
                setSpotifyToken(sToken);
            }
        }
    }, [])

    useEffect(() => {
        if (spotifyToken) {
            getSpotifyUserData();
            getSpotifyUserPlaylists();
        }
    }, [spotifyToken])

    return <div></div>
}

export default SpotifyData;