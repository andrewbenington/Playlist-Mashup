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
}