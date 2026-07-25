import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { useSelector, useDispatch } from 'react-redux';
import { useTranslations } from 'next-intl';
import { setSeparateField } from '../lib/slices/userSlice';

import { BASE_URL } from '../api/url';
import Topnav from '../components/utilpages/topnav/Topnav';
import Footer from '../components/utilpages/footer/Footer';
import HomeLanding from '../components/home/HomeLanding';
import HreflangLinks from '../components/seo/HreflangLinks';
import CanonicalLink from '../components/seo/CanonicalLink';

function Home({ cities }) {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state);

    // UI translations for the component
    const t = useTranslations('IndexPage');

    const router = useRouter();
    const changeLocale = lang => {
        router.push(router.pathname, router.asPath, { locale: lang });
    };

    const changeCity = city => {
        router.push(`/${city}`);
    };

    // Returning visitors who already picked a city are sent straight to it.
    // New visitors (and crawlers) stay on this indexable landing page and pick a city.
    // NOTE: this replaces the previous geolocation auto-redirect. To restore that
    // behaviour, re-add the determineLocation() flow from git history.
    useEffect(() => {
        const { referral } = router.query;

        if (referral && !user.cachedReferralCoupon) {
            dispatch(setSeparateField({ key: 'cachedReferralCoupon', value: referral }));
        }

        if (user && user.selectedCity) {
            router.push(`/${user.selectedCity}`, `/${user.selectedCity}`);
        }
    }, [user]);

    return (
        <>
            <Head>
                <title>{t(`meta.title`)}</title>
                <meta name='description' content={t(`meta.description`)} />
                <meta property='og:type' content='website' />
                <meta property='og:url' content='https://www.heyhomie.io' />
                <meta property='og:title' content={t(`meta.og_title`)} />
                <meta property='og:description' content={t(`meta.og_description`)} />
            </Head>
            <HreflangLinks path='' />
            <CanonicalLink path='' />
            <Topnav cities={cities} handleChangeCity={changeCity} handleChangeLanguage={changeLocale} />
            <HomeLanding cities={cities} />
            <Footer cities={cities} />
        </>
    );
}

export async function getServerSideProps(context) {
    const resCities = await fetch(`${BASE_URL}api/v1/cities`);

    const { cities } = await resCities.json();

    return {
        props: {
            cities,
        },
    };
}

export default Home;
