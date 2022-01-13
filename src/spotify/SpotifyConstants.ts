interface SpotifyImage {
    height: number;
    width: number;
    url: string;
}

export interface SpotifyPlaylist {
    collaborative: boolean;
    description: string;
    external_urls: any;
    href: string;
    id: string;
    images: SpotifyImage[];
    name: string;
    owner: string;
    primary_color: any;
    privacy_status: string;
    snapshot_id: string;
    tracks: {
        href: string;
        total: number;
    },
    type: string;
    uri: string;
}

export interface SpotifyUser {
    country?: string;
    display_name?: string;
    email?: string;
    explicit_content?: {
        filter_enabled: boolean;
        filter_locked: boolean;
    };
    external_urls?: any;
    href?: string;
    id?: string;
    images?: SpotifyImage[];
    product?: string;
    type?: string;
    uri?: string;
    followers?: {
        href: string,
        total: number
    };
    playlists?: SpotifyPlaylist[];
    nextTracksURL?: string;
    getNextPlaylist?: Function;
    profileImageURL?: string;
}