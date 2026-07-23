import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import Head from 'next/head';

import tw, { css, styled, theme } from 'twin.macro';

import { BASE_URL } from '../api/url';
import Topnav from '../components/utilpages/topnav/Topnav';
import Footer from '../components/utilpages/footer/Footer';
import PrivacyBodyPl from '../components/utilpages/privacy/PrivacyBodyPl';
import PrivacyBodyEn from '../components/utilpages/privacy/PrivacyBodyEn';

const ContentContainer = styled.div`
    min-height: 100vh;
    margin-bottom: 24px;

    padding: 8px;
    padding-top: 100px;

    @media (min-width: 640px) {
        padding-left: 24vw;
        padding-right: 24vw;
        padding-top: 150px;
    }
`;
const ContentHeading = styled.h1`
    position: relative;

    font-weight: bold;
    font-size: 40px;
    line-height: 48px;
    color: #14133a;

    margin-bottom: 32px;

    text-align: center;

    @media (min-width: 640px) {
        text-align: left;
    }

    a {
        font-size: 10px;
        position: relative;

        right: -1em;
        top: -32px;
    }
`;
const ContentBody = styled.div`
    width: 100%;
    color: #14133a;

    a {
        text-decoration: underline;

        word-break: break-all;
    }

    p.pseudoLI {
        display: grid;
        grid-template-columns: 2.5rem 1fr;
    }

    h2,
    h3 {
        margin-top: 8px;
        margin-bottom: 8px;
    }

    h3 {
        font-size: 14px;
    }

    p,
    li {
        font-size: 14px;
        line-height: 17px;

        margin-bottom: 0.5rem;

        text-align: justify;
    }

    ol {
        margin-left: 0.75rem;
        list-style-position: outside;
    }

    ol[type='a'] {
        counter-reset: list;

        list-style-position: outside;

        padding-left: 2em;
    }
    ol[type='a'] > li {
        list-style: none;
        position: relative;
    }
    ol[type='a'] > li:before {
        content: counter(list, lower-alpha) ') ';
        counter-increment: list;

        position: absolute;
        left: -1.4em;
    }
`;

function PrivacyPage({ cities }) {
    // UI translations for the component
    const t = useTranslations('UtilsPages.PrivacyPage');

    // Topnav & redirect handlers
    const router = useRouter();
    const changeLocale = lang => {
        // set preffered language here
        router.push(router.pathname, router.asPath, { locale: lang });
    };

    return (
        <>
            <Head>
                <title>{t(`meta.title`)}</title>
                <meta name='description' content={t(`meta.description`)} />
                <meta property='og:type' content='website' />
                <meta property='og:url' content='https://www.heyhomie.io/' />
                <meta property='og:title' content={t(`meta.og_title`)} />
                <meta property='og:description' content={t(`meta.og_description`)} />
            </Head>
            <Topnav handleChangeLanguage={changeLocale} />
            <ContentContainer>
                <ContentHeading>
                    {t(`heading`)}
                    <a download href='/POLITYKA-PRYWATNOSCI.pdf'>
                        PDF
                    </a>
                </ContentHeading>
                <ContentBody>{router.locale === 'pl' ? <PrivacyBodyPl /> : <PrivacyBodyEn />}</ContentBody>
            </ContentContainer>
            <Footer cities={cities} />
        </>
    );
}

export async function getServerSideProps(context) {
    try {
        const resCities = await fetch(`${BASE_URL}api/v1/cities`);

        const { cities } = await resCities.json();

        return {
            props: {
                cities,
            },
        };
    } catch (err) {
        console.log(err);
    }

    return { props: {} };
}

export default PrivacyPage;
