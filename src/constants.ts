import { SpotifyUser } from "./spotify/SpotifyConstants";
import { YoutubeUser } from "./youtube/YoutubeConstants";

export interface SpotifyData {
    user?: SpotifyUser,
    accessToken?: string,
    refreshToken?: string,
    loaded?: boolean,
}

export interface YoutubeData {
    user?: YoutubeUser,
    accessToken?: string,
    refreshToken?: string,
    loaded?: boolean,
}

export class Track {
    name?: string;
    duration?: number;
    image?: string;
    artist?: string;
    id: string;

    constructor(id: string) {
        this.id = id;
    }
}