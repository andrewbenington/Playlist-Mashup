import React from 'react';

interface YoutubeImage {
    height: number;
    width: number;
    url: string;
}

export interface YoutubeUser {
    profileImageURL?: string;
    display_name: string;
    id: string;
    nextTracksURL?: string;
    getNextPlaylist?: Function;
    playlists?: YoutubePlaylist[];
}

export interface YoutubePlaylist {
    name?: string,
    description?: string;
    id?: string;
    images?: YoutubeImage[];
    owner: string;
    privacy_status: string;
    date_created: string;
    tracks: {
        total: number;
    }
}