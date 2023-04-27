import axios from "axios";

export const getSpotifyUserData = async (token: string) => {
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
            return { user: userData };
        } else {
            return { error: 'unknown' };
        }
    } catch (e: any) {
        console.log(e);
        return { error: e };
    }
}

export const getSpotifyUserPlaylists = async (token: string, url?: string) => {
    const playlistsUrl = url ? url : 'https://api.spotify.com/v1/me/playlists?limit=50';
    try {
        const res = await axios.get(playlistsUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
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
        return { error: e };
    }
}

export const getSpotifyPlaylistTracks = async(token: string, url: string) => {
    try {
        const res = await axios.get(`${url}/tracks?limit=50&fields=next,total,items(is_local,track(id,name,uri,album(name),artists(name)))`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const tracks = res.data.items.map((track: any) => {
            return {
                disabled: track.is_local,
                album: track.track?.album?.name,
                artist: track.track?.artists[0]?.name,
                url: track.track?.uri,
                id: track.track?.id,
                name: track.track?.name,
            }
        });
        const nextTracksURL = res.data.next ? res.data.next : undefined;
        return { tracks, nextTracksURL };
    } catch (e: any) {
        console.log(e);
        return { error: e };
    }
}