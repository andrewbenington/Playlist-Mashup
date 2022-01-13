import { SpotifyUser } from "./spotify/SpotifyConstants";
import { YoutubeUser } from "./youtube/YoutubeConstants";

export interface SpotifyData {
    user?: SpotifyUser,
    accessToken?: string,
    refreshToken?: string,
}

export interface YoutubeData {
    user?: YoutubeUser,
    accessToken?: string,
    refreshToken?: string,
}