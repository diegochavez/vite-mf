import { WebAppBucket } from "./types";

export const WebApps: WebAppBucket[] = [
    {
        name: 'header',
        origin: 'header',
        pathPattern: 'header/*',
        bucket: null,
    },
    {
        name: 'movies',
        origin: 'movies',
        bucket: null,
        pathPattern: 'movies/*',
    },
    {
        name: 'dashboard',
        origin: 'dashboard',
        pathPattern: '/*',
        bucket: null,
        isDefaultBehavior: true,
    },
];