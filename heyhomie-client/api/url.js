// @see https://stackoverflow.com/questions/74401768/neterr-failed-api-call-to-backend-from-nextjs-with-nginx-docker
const isServer = typeof window === 'undefined';

export const BASE_URL =
    process.env.NEXT_PUBLIC_NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_BASE_URL
        : isServer
        ? process.env.NEXT_PUBLIC_BASE_URL_SERVER
        : process.env.NEXT_PUBLIC_BASE_URL_CLIENT;
