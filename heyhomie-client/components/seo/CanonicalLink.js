import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const DOMAIN = 'https://www.heyhomie.io';

/**
 * Emits a self-referencing rel=canonical for the current locale so Google
 * indexes one URL per page and stops treating pl/en as duplicates. Polish
 * (default locale) has no URL prefix; English is served under /en. `path` is
 * the route WITHOUT locale or leading slash (e.g. "cleaning", "about", "" for
 * the root). Do NOT use on the city pages — they already emit a canonical via
 * CleaningSeoJsonLd.
 */
const CanonicalLink = ({ path = '' }) => {
    const { locale } = useRouter();
    const prefix = locale === 'en' ? '/en' : '';
    const clean = path ? `/${path}` : '';
    const href = `${DOMAIN}${prefix}${clean}` || `${DOMAIN}/`;

    return (
        <Head>
            <link rel='canonical' href={href} key='canonical' />
        </Head>
    );
};

export default CanonicalLink;
