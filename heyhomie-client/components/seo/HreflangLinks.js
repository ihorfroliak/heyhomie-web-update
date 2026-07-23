import React from 'react';
import Head from 'next/head';

const DOMAIN = 'https://www.heyhomie.io';

/**
 * Emits hreflang alternates so Google serves the right language version and
 * stops treating pl/en pages as duplicates. Polish (default locale) has no
 * URL prefix; English is served under /en. `path` is the route WITHOUT locale
 * or leading slash (e.g. "krakow", "cleaning", "" for the root).
 */
const HreflangLinks = ({ path = '' }) => {
    const clean = path ? `/${path}` : '';
    const pl = `${DOMAIN}${clean}` || `${DOMAIN}/`;
    const en = `${DOMAIN}/en${clean}`;

    return (
        <Head>
            <link rel='alternate' hrefLang='pl' href={pl} key='hreflang-pl' />
            <link rel='alternate' hrefLang='en' href={en} key='hreflang-en' />
            <link rel='alternate' hrefLang='x-default' href={pl} key='hreflang-x-default' />
        </Head>
    );
};

export default HreflangLinks;
