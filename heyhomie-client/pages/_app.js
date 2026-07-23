import NextApp from 'next/app';
import { useRouter } from 'next/router';

import { NextIntlProvider } from 'next-intl';

import { Provider, useDispatch } from 'react-redux';
import store from '../store';

import { BASE_URL } from '../api/url';

import Topnav from '../components/utilpages/topnav/Topnav';

import '../styles/globals.css';
import GlobalStyles from '../components/GlobalStyles';

import FacebookPixel from '../components/FacebookPixel';

import 'keen-slider/keen-slider.min.css';

export default function App({ Component, messages, cities, pageProps }) {
    return (
        <FacebookPixel>
            <Provider store={store}>
                <NextIntlProvider messages={messages}>
                    <GlobalStyles />
                    <Component {...pageProps} />
                </NextIntlProvider>
            </Provider>
        </FacebookPixel>
    );
}

App.getInitialProps = async function getInitialProps(context) {
    const { locale } = context.router;

    // eslint-disable-next-line import/no-dynamic-require, global-require
    const messages = locale ? require(`../messages/${locale}.json`) : undefined;

    const resCities = await fetch(`${BASE_URL}api/v1/cities`);

    const { cities } = await resCities.json();

    return { ...(await NextApp.getInitialProps(context)), messages, cities };
};
