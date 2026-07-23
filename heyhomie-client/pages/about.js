import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import Head from 'next/head';

import tw, { css, styled, theme } from 'twin.macro';
import { BASE_URL } from '../api/url';

import Topnav from '../components/utilpages/topnav/Topnav';
import Footer from '../components/utilpages/footer/Footer';

const ContentContainer = styled.div`
    min-height: 100vh;
`;

const HeroSection = styled.div`
    position: relative;

    width: 100%;
    height: 480px;

    padding-top: 100px;

    @media (min-width: 640px) {
        padding-top: 150px;

        height: 630px;
    }

    @media (min-width: 769px) {
        height: initial;
        min-height: 100vh;
    }

    .heroSection__background {
        position: absolute;
        z-index: -1;

        width: 100vw;
        height: 301px;

        background-color: #5465fc;

        @media (min-width: 769px) {
            height: 60%;
        }

        @media (min-width: 1600px) {
            height: 70%;
        }

        &::before {
            content: '';
            position: absolute;
            bottom: 99%;
            left: 0;
            height: 20px;
            width: 100%;
            background: url('/about-page-hero-blob.svg') top center;
            background-size: 100%;
        }
        &::after {
            content: '';
            position: absolute;
            top: 99%;
            left: 0;
            height: 60px;
            width: 100%;
            background: url('/about-page-hero-blob.svg') bottom center;
            background-size: 100%;
        }
    }
    h2 {
        position: relative;

        font-family: 'Quicksand';
        font-weight: 700;
        text-align: center;

        color: white;

        font-size: 48px;
        line-height: 60px;

        padding-top: 34px;

        span > svg {
            display: inline-block;
            position: relative;

            width: 34px;
            height: 34px;
            bottom: 7px;
        }

        @media (min-width: 769px) {
            font-size: 96px;
            line-height: 120px;

            padding-top: 72px;

            span > svg {
                width: 62px;
                height: 62px;
                bottom: 12px;
            }
        }

        .heroSection__headingConfetti {
            position: absolute;

            right: 24px;
            top: 34px;

            width: 60px;
            height: 60px;

            .heroSection__headingConfetti__svg1 {
                position: absolute;

                left: 0;
                top: 6px;
            }
            .heroSection__headingConfetti__svg2 {
                position: absolute;

                top: 16px;
                right: 16px;
            }
            .heroSection__headingConfetti__svg3 {
                position: absolute;

                left: 6px;
                bottom: 0;
            }

            @media (min-width: 769px) {
                transform: scale(1.8);

                top: 102px;
                right: calc(50% - 20rem);
            }
        }
    }
    .heroSection__image-container {
        height: 310px;

        margin-top: 34px;
        margin-left: auto;
        margin-right: auto;

        display: flex;
        justify-content: center;
        align-items: flex-start;

        img {
            display: block;
            width: 90%;

            max-height: 80%;

            object-fit: contain;
        }

        @media (min-width: 769px) {
            height: 60%;

            margin-top: 72px;

            max-height: initial;

            img {
                width: 70%;
                max-height: 80%;
            }
        }
    }

    .heroSection__whoAreWeMobile {
        position: absolute;
        bottom: 0;

        width: 100%;

        display: flex;
        justify-content: center;
        align-items: center;

        @media (min-width: 769px) {
            display: none;
        }

        .heroSection__whoAreWeMobile__confetti {
            position: absolute;
            left: 0;

            width: 60px;
            height: 60px;

            .heroSection__whoAreWeMobile__confetti__svg1 {
                position: absolute;
                bottom: 0;
            }
            .heroSection__whoAreWeMobile__confetti__svg2 {
                position: absolute;
                right: 10px;
                top: 16px;
            }
        }
    }
`;

const WhoAreWeSection = styled.div`
    position: relative;
    display: flex;

    margin-top: 24px;
    margin-bottom: 64px;

    padding-left: 24px;
    padding-right: 24px;

    @media (min-width: 769px) {
        margin-top: 90px;

        padding-left: 12vw;
        padding-right: 12vw;
    }

    .whoAreWeSection__whoAreWeDesktop {
        display: none;

        @media (min-width: 769px) {
            display: block;

            position: relative;

            .whoAreWeSection__whoAreWeDesktop__confettiDiv {
                position: absolute;

                bottom: 36px;
                left: -32px;

                width: 86px;
                height: 86px;

                .whoAreWeSection__whoAreWeDesktop__confettiDiv__svg1 {
                    position: absolute;

                    bottom: 0;
                }
                .whoAreWeSection__whoAreWeDesktop__confettiDiv__svg2 {
                    position: absolute;

                    left: 12px;
                }
            }
        }
    }

    .whoAreWeSection__text {
        color: ${theme`colors.primary.dark`};

        font-size: 14px;
        line-height: 22px;
        text-align: center;

        p {
            margin-bottom: 1rem;
        }

        @media (min-width: 769px) {
            margin-top: 24px;

            font-size: 18px;
            line-height: 26px;
            text-align: left;

            padding-left: 44px;
        }
    }

    .whoAreWeSection__leftConfetti {
        display: none;

        @media (min-width: 769px) {
            display: block;
            position: absolute;

            left: 0;
            top: -90px;

            width: 140px;
            height: 60px;

            .whoAreWeSection__leftConfetti__svg1 {
                position: absolute;

                left: 12px;
                bottom: 0;
            }
            .whoAreWeSection__leftConfetti__svg2 {
                position: absolute;

                top: -40px;
                right: -60px;
            }
        }
    }

    .whoAreWeSection__rightConfetti {
        position: absolute;
        bottom: -60px;
        right: 0;

        width: 60px;
        height: 60px;

        .whoAreWeSection__rightConfetti__svg1 {
            position: absolute;

            top: 6px;

            transform: scale(0.5);
        }
        .whoAreWeSection__rightConfetti__svg2 {
            position: absolute;

            bottom: 12px;
            left: 12px;

            transform: scale(0.5);
        }
        .whoAreWeSection__rightConfetti__svg3 {
            position: absolute;
            right: 0;
        }

        @media (min-width: 769px) {
            bottom: initial;

            width: 80px;
            height: 80px;

            .whoAreWeSection__rightConfetti__svg1 {
                position: absolute;

                top: 6px;

                transform: scale(1);
            }
            .whoAreWeSection__rightConfetti__svg2 {
                position: absolute;

                bottom: 12px;
                left: 40%;

                transform: scale(1);
            }
            .whoAreWeSection__rightConfetti__svg3 {
                position: absolute;
                right: 0;

                transform: scale(1.4);
            }
        }
    }
`;

const PortraitsSection = styled.div`
    padding-left: 24px;
    padding-right: 24px;

    margin-bottom: 120px;

    @media (min-width: 769px) {
        margin-left: 4vw;
        margin-right: 4vw;

        margin-bottom: 200px;
    }

    @media (min-width: 1024px) {
        margin-left: 10vw;
        margin-right: 10vw;
    }

    .portraitsSection__Sylwia {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;

        div {
            text-align: center;
            h2 {
                font-family: 'Quicksand';
                color: #5465fc;
                font-weight: 700;
                font-size: 60px;
                line-height: 70px;

                margin-bottom: 24px;
            }
            p {
                font-size: 18px;
                line-height: 26px;
            }

            @media (min-width: 769px) {
                width: 40%;

                text-align: right;

                margin-right: 80px;

                p {
                    font-size: 18px;
                    line-height: 26px;
                    white-space: pre-line;
                }

                @media (min-width: 1024px) {
                    h2 {
                        font-size: 88px;
                        line-height: 110px;

                        margin-bottom: 45px;
                    }
                }
            }
        }
        img {
            order: -1;

            @media (min-width: 769px) {
                order: initial;

                width: 40%;
                max-width: 460px;
            }
        }
    }
    .portraitsSection__Tibo {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;

        div {
            text-align: center;
            h2 {
                font-family: 'Quicksand';
                color: #5465fc;
                font-weight: 700;
                font-size: 60px;
                line-height: 70px;

                margin-bottom: 24px;
            }
            p {
                font-size: 18px;
                line-height: 26px;
            }

            @media (min-width: 769px) {
                width: 40%;

                text-align: left;

                margin-left: 80px;

                p {
                    font-size: 18px;
                    line-height: 26px;
                    white-space: pre-line;
                }

                @media (min-width: 1024px) {
                    h2 {
                        font-size: 88px;
                        line-height: 110px;

                        margin-bottom: 45px;
                    }
                }
            }
        }
        img {
            @media (min-width: 769px) {
                width: 40%;
                max-width: 460px;
            }
        }
    }
`;

const BottomSection = styled.div`
    position: relative;

    background-color: #fad668;

    margin-bottom: 100px;

    @media (min-width: 769px) {
        margin-bottom: 200px;
    }

    &::before {
        content: '';
        position: absolute;
        bottom: 99%;
        left: 0;
        height: 80px;
        width: 100%;
        background: url('/about-page-bottom-blob.svg') top center;
        background-size: 100%;
    }
    &::after {
        content: '';
        position: absolute;
        top: 99%;
        left: 0;
        height: 30px;
        width: 100%;
        background: url('/about-page-bottom-blob.svg') bottom center;
        background-size: 100%;

        @media (min-width: 769px) {
            height: 60px;
        }
    }

    .bottomSection__topConfetti {
        position: absolute;
        top: -90px;
        left: 24px;

        .bottomSection__topConfetti__svg1 {
        }

        .bottomSection__topConfetti__svg2 {
            position: relative;
            left: 36px;
            bottom: 6px;
        }

        @media (min-width: 769px) {
            top: -160px;
            left: initial;
            right: 10vw;

            svg {
                transform: scale(1.2);
            }
        }
    }
`;

const BulletPoints = styled.div`
    color: ${theme`colors.primary.dark`};
    font-family: 'Quicksand';

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;

    margin: 60px 10% 60px 10%;

    h2 {
        font-size: 28px;
        padding-left: 16px;
        padding-right: 16px;
        margin-bottom: 20px;
        @media (min-width: 1100px) {
            font-size: 36px;
            margin-bottom: 42px;
            margin-top: 60px;
        }
    }

    div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        @media (max-width: 640px) {
            width: 100%;
        }

        div {
            font-weight: bold;
            font-size: 18px;
            white-space: pre-line;

            text-align: center;

            @media (min-width: 1100px) {
                font-size: 18px;
            }
        }
    }
`;

const AboutVideoSubsection = styled.div`
    color: ${theme`colors.primary.dark`};
    font-family: 'Quicksand';

    h2 {
        font-size: 28px;
        padding-left: 16px;
        padding-right: 16px;
        margin-bottom: 16px;
        @media (min-width: 1100px) {
            font-size: 36px;
            margin-bottom: 18;
        }
    }
    h3 {
        text-align: center;
        font-size: 18px;
        padding-left: 16px;
        padding-right: 16px;
        margin-bottom: 20px;
        @media (min-width: 1100px) {
            font-size: 28px;
            margin-bottom: 120px;
        }
    }

    .aboutVideoSubsection__videoDiv {
        display: flex;
        justify-content: center;
        align-items: center;

        padding-top: 20px;
        padding-bottom: 120px;

        width: 100%;

        position: relative;

        .aboutVideoSubsection__videoDiv__confettiDiv {
            position: absolute;
            z-index: 2;

            left: -80px;
            top: 30%;

            transform: scale(0.5);

            @media (min-width: 640px) {
                left: 0;
                top: 30%;

                transform: scale(0.7);
            }

            @media (min-width: 769px) {
                left: 0;
                top: 35%;

                transform: scale(1);
            }

            @media (min-width: 1024px) {
                left: 10%;
                top: 35%;

                transform: scale(1);
            }

            @media (min-width: 1600px) {
                left: 15%;
                top: 38%;

                transform: scale(1);
            }
        }

        &::before {
            content: '';
            position: absolute;
            z-index: 0;
            top: -88px;
            left: calc(50% - 145px);
            height: 320px;
            width: 300px;
            background: url('/about-page-bottom-video-frame-mobile.svg') center center;
            background-repeat: no-repeat;
            background-size: 100%;
        }

        .aboutVideoSubsection__videoDiv__iframeContainer {
            z-index: 1;
            iframe {
            }
        }

        @media (min-width: 769px) {
            padding-top: 200px;
            padding-bottom: 200px;

            &::before {
                content: '';
                position: absolute;
                z-index: 0;
                top: -15%;
                left: 1%;
                width: 98%;
                height: 100%;
                background: url('/about-page-bottom-video-frame-desktop.svg') center center;
                background-repeat: no-repeat;
                background-size: 100%;

                @media (min-width: 1025px) {
                    top: -15%;
                    left: 8%;
                    width: 84%;
                }

                @media (min-width: 1600px) {
                    top: -15%;
                    left: 14%;
                    width: 72%;
                }
                @media (min-width: 1800px) {
                    top: -15%;
                    left: 19%;
                    width: 62%;
                }
            }
            .aboutVideoSubsection__videoDiv__iframeContainer {
                padding-bottom: 10.25%;
                margin-top: 100px;
                iframe {
                    position: absolute;
                    top: 0;
                    left: 15%;
                    width: 70%;
                    height: 70%;
                }
            }
        }
    }
`;

function AboutPage({ cities }) {
    // UI translations for the component
    const t = useTranslations('UtilsPages.AboutPage');

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
                <HeroSection>
                    <div className='heroSection__background'></div>
                    <h2>
                        HELL
                        <span>
                            <svg width='62' height='62' viewBox='0 0 62 62' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                <path
                                    d='M19.5672 59.3488C15.24 57.4774 11.4315 54.6365 8.24417 50.9005C3.10481 44.8862 1.29613 38.5262 1.08455 37.7465C-0.314613 33.1901 -0.36239 28.498 0.948046 23.806C2.14245 19.5208 4.49714 15.3508 7.74593 11.7504C11.5885 7.49912 16.489 4.17673 21.9287 2.15617C27.696 0.00678262 33.784 -0.54921 39.5308 0.549215C46.4106 1.85783 51.9117 5.26159 55.8908 10.652C59.2829 15.2491 60.8459 20.4022 61.5557 23.9145C62.2109 27.1419 61.9925 30.3084 61.7809 33.3731L61.7468 33.8613C61.467 37.8821 59.8835 44.1946 56.2525 49.8563C51.8025 56.7994 45.4278 60.9083 37.8245 61.7355C36.207 61.9118 34.6303 62 33.081 62C28.1805 62 23.6554 61.1185 19.5672 59.3488ZM23.7237 6.91601C19.0553 8.65179 14.8441 11.4996 11.5544 15.1474C8.83114 18.1647 6.86548 21.6295 5.87583 25.1688C4.82475 28.932 4.8657 32.6747 5.98503 36.309L6.01916 36.4311C6.03281 36.4921 7.59578 42.3707 12.2642 47.7679C14.9397 50.8666 18.1202 53.2126 21.7103 54.7449C25.116 56.1959 28.9245 56.9282 33.081 56.9282C34.4392 56.9282 35.8316 56.8536 37.258 56.6977C40.5 56.3451 43.4485 55.2467 46.0284 53.4363C48.2739 51.8633 50.26 49.741 51.9322 47.1306C55.0445 42.2758 56.4095 36.7633 56.6347 33.5223L56.6689 33.0341C56.8668 30.1863 57.0579 27.4945 56.5324 24.9383C55.9181 21.921 54.594 17.5206 51.7547 13.6761C48.5674 9.35017 44.1242 6.62445 38.5548 5.55993C36.9577 5.25481 35.3197 5.10564 33.6748 5.10564C30.3646 5.0853 26.993 5.70232 23.7237 6.91601Z'
                                    fill='white'
                                />
                                <path
                                    d='M46.3907 24.8095C46.889 24.484 47.7763 23.1619 47.7763 21.9617C47.7763 21.1345 46.2474 17.168 43.101 17.8053C39.1151 18.619 39.4222 22.4635 41.3128 23.7856C43.0123 24.9722 44.6094 25.9757 46.3907 24.8095Z'
                                    fill='white'
                                />
                                <path
                                    d='M23.0419 22.6263C23.0419 22.6263 23.588 19.0327 20.1344 18.4225C16.6809 17.8122 15.7799 20.9041 16.1417 23.8671C16.5102 26.8369 23.0419 26.8912 23.0419 22.6263Z'
                                    fill='white'
                                />
                                <path
                                    d='M34.8493 42.5606C34.8493 42.5606 28.6725 43.971 25.2258 41.0825C21.7791 38.1941 19.5745 32.7291 19.5745 32.7291C19.5745 32.7291 17.9638 31.2306 17.0561 32.7291C16.1483 34.2275 18.8715 41.4622 24.6798 45.0694C24.6798 45.0694 37.2108 51.1785 44.3227 40.7164C50.206 32.0646 46.4658 29.7118 46.4658 29.7118C46.4658 29.7118 45.2645 28.3015 44.3227 30.9933C43.3808 33.6919 41.5653 41.5165 34.8493 42.5606Z'
                                    fill='white'
                                />
                            </svg>
                        </span>
                        !
                        <div className='heroSection__headingConfetti'>
                            <svg
                                className='heroSection__headingConfetti__svg1'
                                width='7'
                                height='7'
                                viewBox='0 0 7 7'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    d='M6.99407 4.16469C6.98402 2.29662 5.68795 0.542332 4.05029 0.125097C2.8346 -0.187829 1.77966 0.087167 0.90557 0.940602C0.0616191 1.75611 -0.199604 2.70437 0.152042 3.79487C0.332889 4.36383 0.523782 4.94226 0.805099 5.48277C1.86004 7.5405 5.39659 7.44567 6.65247 5.55863C6.94383 5.12243 7.02421 4.61986 6.99407 4.16469Z'
                                    fill='#36F0C7'
                                />
                            </svg>
                            <svg
                                className='heroSection__headingConfetti__svg2'
                                width='10'
                                height='9'
                                viewBox='0 0 10 9'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    d='M9.99975 4.28673C10.0284 6.70121 7.53235 8.96075 4.74935 8.99948C2.28195 9.03822 0.0584227 6.90779 0.00104122 4.46749C-0.0563402 2.24668 2.26761 -0.0128566 4.59156 5.50744e-05C7.25979 0.0129667 9.97106 2.16921 9.99975 4.28673Z'
                                    fill='#FF3C87'
                                />
                            </svg>
                            <svg
                                className='heroSection__headingConfetti__svg3'
                                width='21'
                                height='26'
                                viewBox='0 0 21 26'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    d='M20.1919 20.0665C20.4303 17.8226 20.7831 15.3732 19.5569 13.1509C18.1053 10.522 15.9074 8.81284 12.8613 8.36441C11.354 8.14388 9.88591 7.75565 8.51808 7.08131C7.55543 6.61248 6.99563 5.84001 6.84918 4.76634C6.72745 3.77587 6.59279 2.79343 6.20298 1.86177C5.36341 -0.170407 3.47629 -0.468875 2.08351 1.22816C0.613761 3.01773 0.592233 5.09137 1.09346 7.19905C1.71721 9.82195 3.58948 11.4106 5.85839 12.6278C7.27191 13.3902 8.85639 13.7062 10.3326 14.2954C12.8121 15.2745 14.07 17.6921 13.4874 20.3198C13.267 21.3075 12.9369 22.2916 13.1666 23.3406C13.3882 24.3766 13.9627 25.0862 14.9832 25.4027C16.0955 25.7518 17.055 25.4791 17.855 24.6603C19.0663 23.4073 19.6542 21.8423 20.1919 20.0665Z'
                                    fill='#FAD668'
                                />
                            </svg>
                        </div>
                    </h2>
                    <div className='heroSection__image-container'>
                        <img src={`/about-page__hero-image.jpg`} />
                    </div>
                    <div className='heroSection__whoAreWeMobile'>
                        <div className='heroSection__whoAreWeMobile__confetti'>
                            <svg
                                className='heroSection__whoAreWeMobile__confetti__svg1'
                                width='15'
                                height='25'
                                viewBox='0 0 15 25'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    d='M14.9962 21.8038C15.0204 22.3042 14.9356 23.0785 14.5357 23.7933C13.8813 24.9964 12.7543 25.3419 11.5545 24.6391C10.5487 24.0553 9.7852 23.1976 9.1308 22.2684C7.07063 19.3379 5.14377 16.324 2.80488 13.5841C1.12039 11.6185 -0.854941 9.98651 -3.01205 8.557C-4.97527 7.27043 -6.9506 5.99578 -8.33213 4.04211C-8.86534 3.2797 -9.24102 2.49347 -8.81687 1.52855C-8.29577 0.349195 -7.26569 -0.151136 -5.66603 0.0394662C-3.20595 0.337282 -1.0246 1.32603 1.04768 2.58877C6.74343 6.07917 10.9849 10.88 13.9055 16.8005C14.6205 18.2658 15.0083 19.8502 14.9962 21.8038Z'
                                    fill='#FF3C87'
                                />
                            </svg>
                            <svg
                                className='heroSection__whoAreWeMobile__confetti__svg2'
                                width='26'
                                height='28'
                                viewBox='0 0 26 28'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    d='M25.9998 7.24632C26.012 9.90506 25.4376 12.3704 23.6042 14.437C22.003 16.2377 20.023 17.2649 17.6273 17.5912C15.7206 17.845 13.7772 17.7604 11.8827 18.1955C8.80262 18.8964 7.44591 20.3104 6.93256 23.4284C6.78589 24.3348 6.5781 25.217 6.1992 26.0509C5.72252 27.0902 5.08695 27.9362 3.79135 27.9966C2.45909 28.057 1.57906 27.3077 0.992379 26.2805C0.0634616 24.649 -0.18099 22.8725 0.124575 20.9993C0.686814 17.5308 2.3002 14.6666 5.17251 12.6121C6.67589 11.5245 8.46038 11.1982 10.3427 11.3795C12.1394 11.5607 13.8872 11.4278 15.5617 10.6423C16.9184 10.0138 17.6762 8.95033 17.994 7.57262C18.2874 6.31576 18.4462 5.03473 18.7029 3.76579C18.8985 2.76271 19.0574 1.72339 19.7785 0.913681C20.8052 -0.234412 22.5286 -0.306923 23.6653 0.732403C25.2176 2.15846 25.9876 4.29753 25.9998 7.24632Z'
                                    fill='#FAD668'
                                />
                            </svg>
                        </div>
                        <svg width='313' height='70' viewBox='0 0 313 70' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path
                                d='M135.095 69.9193C126.98 70.1428 117.572 69.8572 108.205 69.6089C96.9401 69.3109 85.6335 69.373 74.4312 68.6404C58.3891 67.5974 42.6183 65.7971 28.1408 61.3147C12.1822 56.373 2.29414 48.5632 0.354079 37.8727C-1.21049 29.2433 2.29414 21.2596 13.1835 14.9273C18.5865 11.7859 25.3872 10.2463 32.459 9.05432C49.2938 6.21098 66.5666 4.65894 83.8395 3.13172C92.7471 2.34949 101.822 2.126 110.833 1.76593C121.389 1.3686 131.945 1.12027 142.5 0.747784C149.364 0.499457 156.227 0.449792 163.069 0.213881C171.351 -0.0716949 179.612 -0.0096131 187.873 0.0524687C201.599 0.164216 215.284 0.747784 228.948 1.66659C240.004 2.41158 250.894 3.52905 261.345 5.81366C270.878 7.88719 280.6 9.73722 289.424 12.8413C299.583 16.4048 307.635 21.0361 311.161 27.9644C313.706 32.9558 313.81 37.8727 310.201 42.7523C307.343 46.6262 304.131 50.3387 299.437 53.5794C294.702 56.8449 288.965 59.266 282.456 61.0043C267.582 64.99 251.832 66.8276 235.665 67.7216C224.275 68.3548 212.864 68.4914 201.453 68.7025C191.294 68.8887 181.156 69.1743 171.017 69.4475C159.502 69.7827 147.945 69.9938 135.095 69.9193Z'
                                fill='#00F4C5'
                            />
                            <path
                                d='M69.936 24.9903C69.008 24.6063 67.984 25.0223 67.6 25.9183L61.36 40.7343L57.232 30.9103C56.912 30.2063 56.24 29.8223 55.568 29.8223C54.864 29.8223 54.192 30.2063 53.904 30.9103L49.776 40.7343L43.504 25.9183C43.152 25.0223 42.096 24.6063 41.232 24.9903C40.304 25.3423 39.92 26.3983 40.272 27.2623L48.144 45.9183C48.208 46.0143 48.24 46.1423 48.304 46.2063V46.2383C48.368 46.3023 48.4 46.3663 48.464 46.4303C48.496 46.4943 48.496 46.4943 48.528 46.5263C48.624 46.5583 48.656 46.6223 48.752 46.6863C48.752 46.6863 48.752 46.6863 48.784 46.6863C48.848 46.7503 48.976 46.8463 49.072 46.8783C49.104 46.8783 49.104 46.8783 49.136 46.9103C49.2 46.9103 49.264 46.9423 49.36 46.9743C49.392 46.9743 49.424 46.9743 49.456 46.9743C49.552 47.0063 49.68 47.0063 49.776 47.0063C49.872 47.0063 49.968 47.0063 50.064 46.9743C50.096 46.9743 50.128 46.9743 50.16 46.9743C50.224 46.9423 50.288 46.9103 50.416 46.9103C50.416 46.8783 50.448 46.8783 50.448 46.8783C50.448 46.8783 50.448 46.8783 50.48 46.8783C50.544 46.8463 50.64 46.7503 50.736 46.6863C50.736 46.6863 50.736 46.6863 50.8 46.6863C50.864 46.6223 50.928 46.5583 50.992 46.5263C50.992 46.4943 51.024 46.4943 51.024 46.4303C51.088 46.3663 51.152 46.3023 51.216 46.2383C51.216 46.2383 51.216 46.2063 51.248 46.2063C51.28 46.1423 51.344 46.0143 51.376 45.9183L55.568 35.9983L59.76 45.9183C59.792 46.0143 59.824 46.1423 59.888 46.2063C59.888 46.2063 59.888 46.2383 59.952 46.2383C59.984 46.3023 60.048 46.3663 60.08 46.4303C60.112 46.4943 60.112 46.4943 60.144 46.5263C60.208 46.5583 60.272 46.6223 60.368 46.6863C60.368 46.6863 60.368 46.6863 60.4 46.6863C60.464 46.7503 60.56 46.8463 60.688 46.8783C60.72 46.8783 60.72 46.8783 60.752 46.9103C60.816 46.9103 60.88 46.9423 60.976 46.9743C60.976 46.9743 61.008 46.9743 61.072 46.9743C61.168 47.0063 61.264 47.0063 61.36 47.0063C61.488 47.0063 61.584 47.0063 61.68 46.9743C61.68 46.9743 61.712 46.9743 61.744 46.9743C61.84 46.9423 61.936 46.9103 62 46.9103C62 46.8783 62.032 46.8783 62.032 46.8783H62.064C62.192 46.8463 62.256 46.7503 62.352 46.6863H62.384C62.448 46.6223 62.544 46.5583 62.608 46.5263C62.608 46.4943 62.64 46.4943 62.64 46.4303C62.704 46.3663 62.768 46.3023 62.8 46.2383L62.832 46.2063C62.896 46.1423 62.96 46.0143 62.992 45.9183L70.832 27.2623C71.216 26.3983 70.8 25.3423 69.936 24.9903ZM77.698 47.0063C78.69 47.0063 79.49 46.2383 79.49 45.2463V37.5663H87.778V45.2463C87.778 46.2383 88.546 47.0063 89.538 47.0063C90.53 47.0063 91.33 46.2383 91.33 45.2463V26.3663C91.33 25.3743 90.53 24.6063 89.538 24.6063C88.546 24.6063 87.778 25.3743 87.778 26.3663V34.0463H79.49V26.3663C79.49 25.3743 78.69 24.6063 77.698 24.6063C76.706 24.6063 75.938 25.3743 75.938 26.3663V45.2463C75.938 46.2383 76.706 47.0063 77.698 47.0063ZM107.033 23.9663C103.961 23.9663 101.145 25.2783 99.1928 27.3903C97.2088 29.5023 96.0248 32.3183 96.0248 35.4863C96.0248 38.6543 97.2088 41.5023 99.1928 43.5823C101.145 45.6623 103.961 47.0063 107.033 47.0063C109.977 47.0063 112.793 45.6623 114.681 43.5823C116.665 41.5023 117.913 38.6543 117.913 35.4863C117.913 32.3183 116.665 29.5023 114.681 27.3903C112.793 25.2783 109.977 23.9663 107.033 23.9663ZM112.089 41.0543C110.745 42.4943 108.953 43.3583 107.033 43.3583C104.985 43.3583 103.193 42.4943 101.849 41.0543C100.505 39.6783 99.6728 37.6623 99.6728 35.4863C99.6728 33.3103 100.505 31.2943 101.849 29.8863C103.193 28.4463 104.985 27.6143 107.033 27.6143C108.953 27.6143 110.745 28.4463 112.089 29.8863C113.401 31.2943 114.265 33.3103 114.265 35.4863C114.265 37.6623 113.401 39.6783 112.089 41.0543ZM145.51 45.8863C145.766 46.5903 146.438 47.0063 147.142 47.0063C147.366 47.0063 147.59 46.9743 147.75 46.9103C148.678 46.5583 149.126 45.5343 148.806 44.6063L141.734 25.7583C141.446 25.0543 140.774 24.6063 140.038 24.6383C139.334 24.6063 138.63 25.0543 138.342 25.7583L131.27 44.6063C130.95 45.5343 131.398 46.5583 132.326 46.9103C132.518 46.9743 132.71 47.0063 132.934 47.0063C133.638 47.0063 134.31 46.5903 134.598 45.8863L136.166 41.7263H143.942L145.51 45.8863ZM137.446 38.2063L140.038 31.3263L142.63 38.2063H137.446ZM166.262 43.2623C166.198 42.9423 166.102 42.3343 166.134 41.3743C166.134 40.0303 165.718 38.8463 165.078 37.9183C164.758 37.4383 164.374 37.0543 163.958 36.7343C165.494 35.4543 166.454 33.5983 166.454 31.4863C166.454 27.6783 163.414 24.6063 159.606 24.6063H153.91C153.878 24.6063 153.878 24.6063 153.878 24.6063C152.886 24.6063 152.118 25.3743 152.118 26.3663V45.2463C152.118 46.2063 152.886 47.0063 153.878 47.0063C154.87 47.0063 155.67 46.2063 155.67 45.2463V38.3023H159.446C159.734 38.3663 160.566 38.6223 161.238 39.0703C161.622 39.3263 162.006 39.6463 162.198 39.9983C162.422 40.3503 162.55 40.7663 162.582 41.3743C162.582 43.1343 162.806 44.2863 163.254 45.2143C163.51 45.6623 163.862 46.0783 164.278 46.3343C164.726 46.6223 165.206 46.6863 165.526 46.6863C165.558 46.6863 165.558 46.6863 165.558 46.6863C165.878 46.6863 166.134 46.6223 166.262 46.5903C167.19 46.2703 167.702 45.2783 167.382 44.3503C167.19 43.8063 166.774 43.4223 166.262 43.2623ZM159.606 34.7503H155.67V28.1583H159.606C161.43 28.1583 162.902 29.6303 162.902 31.4863C162.902 33.2783 161.43 34.7503 159.606 34.7503ZM173.686 47.0063L173.718 46.9743C173.718 46.9743 173.718 47.0063 173.782 47.0063H184.15C185.078 47.0063 185.91 46.2063 185.91 45.2463C185.91 44.2543 185.078 43.4543 184.15 43.4543H175.478V37.5663H182.934C183.894 37.5663 184.694 36.7663 184.694 35.7743C184.694 34.8463 183.894 34.0143 182.934 34.0143H175.478V28.1583H184.15C185.078 28.1583 185.91 27.3583 185.91 26.3663C185.91 25.3743 185.078 24.6063 184.15 24.6063H173.782C173.718 24.6063 173.718 24.6063 173.718 24.6063H173.686C172.694 24.6063 171.926 25.3743 171.926 26.3663V45.2463C171.926 46.2063 172.694 47.0063 173.686 47.0063ZM227.816 24.9903C226.888 24.6063 225.864 25.0223 225.48 25.9183L219.24 40.7343L215.112 30.9103C214.792 30.2063 214.12 29.8223 213.448 29.8223C212.744 29.8223 212.072 30.2063 211.784 30.9103L207.656 40.7343L201.384 25.9183C201.032 25.0223 199.976 24.6063 199.112 24.9903C198.184 25.3423 197.8 26.3983 198.152 27.2623L206.024 45.9183C206.088 46.0143 206.12 46.1423 206.184 46.2063V46.2383C206.248 46.3023 206.28 46.3663 206.344 46.4303C206.376 46.4943 206.376 46.4943 206.408 46.5263C206.504 46.5583 206.536 46.6223 206.632 46.6863C206.632 46.6863 206.632 46.6863 206.664 46.6863C206.728 46.7503 206.856 46.8463 206.952 46.8783C206.984 46.8783 206.984 46.8783 207.016 46.9103C207.08 46.9103 207.144 46.9423 207.24 46.9743C207.272 46.9743 207.304 46.9743 207.336 46.9743C207.432 47.0063 207.56 47.0063 207.656 47.0063C207.752 47.0063 207.848 47.0063 207.944 46.9743C207.976 46.9743 208.008 46.9743 208.04 46.9743C208.104 46.9423 208.168 46.9103 208.296 46.9103C208.296 46.8783 208.328 46.8783 208.328 46.8783C208.328 46.8783 208.328 46.8783 208.36 46.8783C208.424 46.8463 208.52 46.7503 208.616 46.6863C208.616 46.6863 208.616 46.6863 208.68 46.6863C208.744 46.6223 208.808 46.5583 208.872 46.5263C208.872 46.4943 208.904 46.4943 208.904 46.4303C208.968 46.3663 209.032 46.3023 209.096 46.2383C209.096 46.2383 209.096 46.2063 209.128 46.2063C209.16 46.1423 209.224 46.0143 209.256 45.9183L213.448 35.9983L217.64 45.9183C217.672 46.0143 217.704 46.1423 217.768 46.2063C217.768 46.2063 217.768 46.2383 217.832 46.2383C217.864 46.3023 217.928 46.3663 217.96 46.4303C217.992 46.4943 217.992 46.4943 218.024 46.5263C218.088 46.5583 218.152 46.6223 218.248 46.6863C218.248 46.6863 218.248 46.6863 218.28 46.6863C218.344 46.7503 218.44 46.8463 218.568 46.8783C218.6 46.8783 218.6 46.8783 218.632 46.9103C218.696 46.9103 218.76 46.9423 218.856 46.9743C218.856 46.9743 218.888 46.9743 218.952 46.9743C219.048 47.0063 219.144 47.0063 219.24 47.0063C219.368 47.0063 219.464 47.0063 219.56 46.9743C219.56 46.9743 219.592 46.9743 219.624 46.9743C219.72 46.9423 219.816 46.9103 219.88 46.9103C219.88 46.8783 219.912 46.8783 219.912 46.8783H219.944C220.072 46.8463 220.136 46.7503 220.232 46.6863H220.264C220.328 46.6223 220.424 46.5583 220.488 46.5263C220.488 46.4943 220.52 46.4943 220.52 46.4303C220.584 46.3663 220.648 46.3023 220.68 46.2383L220.712 46.2063C220.776 46.1423 220.84 46.0143 220.872 45.9183L228.712 27.2623C229.096 26.3983 228.68 25.3423 227.816 24.9903ZM234.953 47.0063L234.985 46.9743C234.985 46.9743 234.985 47.0063 235.049 47.0063H245.417C246.345 47.0063 247.177 46.2063 247.177 45.2463C247.177 44.2543 246.345 43.4543 245.417 43.4543H236.745V37.5663H244.201C245.161 37.5663 245.961 36.7663 245.961 35.7743C245.961 34.8463 245.161 34.0143 244.201 34.0143H236.745V28.1583H245.417C246.345 28.1583 247.177 27.3583 247.177 26.3663C247.177 25.3743 246.345 24.6063 245.417 24.6063H235.049C234.985 24.6063 234.985 24.6063 234.985 24.6063H234.953C233.961 24.6063 233.193 25.3743 233.193 26.3663V45.2463C233.193 46.2063 233.961 47.0063 234.953 47.0063ZM264.572 43.2943C263.74 43.2943 263.004 43.9983 263.004 44.8623V45.4383C263.004 46.3343 263.74 47.0063 264.572 47.0063C265.468 47.0063 266.14 46.3343 266.14 45.4383V44.8623C266.14 43.9983 265.468 43.2943 264.572 43.2943ZM271.324 31.3263C271.324 27.6143 268.284 24.6063 264.572 24.6063C262.108 24.6063 259.932 25.9503 258.78 27.9343C258.332 28.7023 258.588 29.6303 259.324 30.0783C260.092 30.5263 261.052 30.2703 261.5 29.5023C262.108 28.4463 263.26 27.7423 264.572 27.7423C266.588 27.7423 268.22 29.3103 268.22 31.3263C268.22 33.3103 266.588 34.9103 264.572 34.9103C263.74 34.9103 263.004 35.6463 263.004 36.4783C263.004 36.5103 263.004 36.5103 263.036 36.5423C263.036 36.5743 263.004 36.5743 263.004 36.6063V39.9343C263.004 40.8303 263.74 41.5023 264.572 41.5023C265.468 41.5023 266.14 40.8303 266.14 39.9343V37.8543C269.116 37.1503 271.324 34.4943 271.324 31.3263Z'
                                fill='white'
                            />
                        </svg>
                    </div>
                </HeroSection>
                <WhoAreWeSection>
                    <div className='whoAreWeSection__leftConfetti'>
                        <svg
                            className='whoAreWeSection__leftConfetti__svg1'
                            width='54'
                            height='57'
                            viewBox='0 0 54 57'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path
                                d='M53.9915 49.7128C54.046 50.8535 53.8551 52.619 52.9553 54.2486C51.4829 56.9919 48.9471 57.7795 46.2477 56.177C43.9845 54.8462 42.2667 52.8906 40.7943 50.772C36.1589 44.0905 31.8235 37.2188 26.561 30.9718C22.7709 26.4903 18.3264 22.7693 13.4729 19.51C9.05564 16.5766 4.61114 13.6704 1.50272 9.21601C0.302974 7.47772 -0.542299 5.68511 0.412042 3.48508C1.58452 0.796164 3.9022 -0.34459 7.50143 0.089983C13.0366 0.769003 17.9446 3.02335 22.6073 5.90239C35.4227 13.8605 44.9661 24.8063 51.5374 38.3052C53.1462 41.646 54.0187 45.2584 53.9915 49.7128Z'
                                fill='#FF3C87'
                            />
                        </svg>
                        <svg
                            className='whoAreWeSection__leftConfetti__svg2'
                            width='58'
                            height='64'
                            viewBox='0 0 58 64'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path
                                d='M57.978 16.3105C58.0052 22.2949 56.7242 27.8441 52.6359 32.4957C49.0654 36.5488 44.65 38.861 39.3079 39.5954C35.056 40.1667 30.7223 39.9763 26.4977 40.9555C19.6293 42.5333 16.6039 45.7159 15.4592 52.734C15.1321 54.7742 14.6688 56.7599 13.8238 58.6369C12.7609 60.9763 11.3436 62.8804 8.45448 63.0164C5.48362 63.1524 3.52121 61.4659 2.21294 59.1537C0.141515 55.4814 -0.403597 51.4827 0.277794 47.2664C1.53155 39.4594 5.1293 33.0125 11.5344 28.3882C14.8868 25.94 18.8661 25.2055 23.0635 25.6136C27.0701 26.0216 30.9676 25.7224 34.7017 23.9542C37.727 22.5397 39.4169 20.1459 40.1255 17.0449C40.7797 14.2159 41.134 11.3325 41.7064 8.47626C42.1425 6.21848 42.4968 3.87911 44.1049 2.05657C46.3943 -0.527629 50.2374 -0.690842 52.7722 1.64854C56.2336 4.85838 57.9507 9.67315 57.978 16.3105Z'
                                fill='#36F0C7'
                            />
                        </svg>
                    </div>
                    <div className='whoAreWeSection__rightConfetti'>
                        <svg
                            className='whoAreWeSection__rightConfetti__svg1'
                            width='20'
                            height='20'
                            viewBox='0 0 20 20'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path
                                d='M19.9995 9.52606C20.0569 14.8916 15.0647 19.9128 9.49871 19.9988C4.56391 20.0849 0.116845 15.3506 0.00208243 9.92775C-0.11268 4.99263 4.53522 -0.0285702 9.18311 0.000122388C14.5196 0.028815 19.9421 4.82047 19.9995 9.52606Z'
                                fill='#14133A'
                            />
                        </svg>
                        <svg
                            className='whoAreWeSection__rightConfetti__svg2'
                            width='23'
                            height='22'
                            viewBox='0 0 23 22'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path
                                d='M14.6623 2.22126C9.39166 1.37982 3.90465 3.85417 2.04437 7.81576C0.654409 10.7551 0.989058 13.5594 3.02998 16.1733C4.97655 18.6931 7.54079 19.7959 10.762 19.4098C12.4415 19.215 14.152 18.9991 15.7933 18.5361C22.0351 16.8144 23.2449 7.79716 18.4495 3.7349C17.3414 2.7932 15.9581 2.35602 14.6623 2.22126Z'
                                fill='#FAD668'
                            />
                        </svg>
                        <svg
                            className='whoAreWeSection__rightConfetti__svg3'
                            width='28'
                            height='30'
                            viewBox='0 0 28 30'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path
                                d='M9.2654 0.0692029C12.33 0.0459957 15.1737 0.693003 17.5621 2.77812C19.6432 4.59913 20.8341 6.85525 21.2185 9.58807C21.5176 11.7632 21.4268 13.9813 21.9348 16.1419C22.7534 19.6545 24.3879 21.1979 27.9837 21.7729C29.029 21.9371 30.0466 22.1712 31.0091 22.6007C32.2087 23.1411 33.186 23.8635 33.2601 25.3418C33.3344 26.862 32.4737 27.8689 31.2917 28.5421C29.4143 29.6079 27.3674 29.893 25.2072 29.5508C21.2073 28.9213 17.9003 27.09 15.5222 23.8192C14.2633 22.1073 13.881 20.0719 14.0835 17.9232C14.2863 15.8721 14.127 13.8779 13.2158 11.9696C12.4867 10.4235 11.2583 9.56237 9.66911 9.2045C8.21936 8.87411 6.74221 8.69723 5.27866 8.40873C4.12177 8.18904 2.92323 8.01133 1.98742 7.19117C0.660509 6.02347 0.570986 4.05695 1.76506 2.7561C3.40348 0.979642 5.86647 0.0934201 9.2654 0.0692029Z'
                                fill='#FF3C87'
                            />
                        </svg>
                    </div>
                    <div className='whoAreWeSection__whoAreWeDesktop'>
                        <div className='whoAreWeSection__whoAreWeDesktop__confettiDiv'>
                            <svg
                                className='whoAreWeSection__whoAreWeDesktop__confettiDiv__svg1'
                                width='22'
                                height='23'
                                viewBox='0 0 22 23'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    d='M19.778 13.3781C18.7487 18.0964 13.3591 21.4965 8.45923 20.4521C4.11301 19.5346 1.16458 14.4868 2.15508 9.70666C3.04744 5.35439 8.135 1.88493 12.2064 2.84533C16.8819 3.94429 20.6745 9.23872 19.778 13.3781Z'
                                    fill='#FF3C87'
                                />
                            </svg>
                            <svg
                                className='whoAreWeSection__whoAreWeDesktop__confettiDiv__svg2'
                                width='60'
                                height='53'
                                viewBox='0 0 60 53'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    d='M7.49605 8.216C7.80604 6.86457 8.31146 5.63155 9.06463 4.50441C11.6607 0.734189 15.7885 1.06788 17.7016 5.23472C18.529 7.01872 19.2069 8.91558 19.7907 10.7909C21.5455 16.2949 23.2586 21.7648 26.6006 26.6028C29.2187 30.3917 32.6562 32.8726 37.099 33.9898C40.1662 34.7424 43.2762 35.3086 46.1254 36.796C48.1352 37.8457 49.9667 39.0261 51.2351 40.9358C53.6033 44.5203 52.3413 48.0814 48.1448 48.9093C42.9882 49.9338 37.8072 50.0944 32.7707 48.0071C24.0542 44.389 16.6559 39.013 12.0298 30.7166C8.20435 23.7811 6.63795 16.1619 7.49605 8.216Z'
                                    fill='#FAD668'
                                />
                            </svg>
                        </div>
                        <svg width='313' height='393' viewBox='0 0 313 393' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path
                                d='M208.597 250.416C198.793 250.416 190.929 250.249 183.086 250.457C171.675 250.75 160.265 251.355 148.876 252.003C142.242 252.379 135.588 252.755 128.934 253.068C118.087 253.548 107.24 254.405 96.3928 254.091C86.5053 253.799 76.6178 254.238 66.7511 253.716C56.1961 253.152 45.5994 253.423 35.1069 251.731C20.4008 249.35 7.55126 237.55 3.67135 223.139C1.43936 214.869 1.68967 206.64 2.48234 198.286C3.17071 191.122 4.44316 184.063 7.0089 177.359C10.5968 168.002 15.4571 159.439 23.6758 153.278C29.5791 148.85 36.3377 146.406 43.5343 145.132C47.2682 144.464 51.0229 144.214 54.8402 144.193C65.3535 144.13 75.8668 144.088 86.3593 143.733C94.5363 143.462 102.713 142.71 110.89 142.188C114.186 141.979 117.461 141.937 120.757 141.791C136.527 141.081 152.318 140.872 168.067 141.415C179.06 141.791 190.074 142.376 201.067 142.021C218.506 141.457 235.944 140.684 253.404 140.705C259.85 140.705 266.316 139.869 272.699 140.851C285.236 142.793 295.29 148.683 301.965 159.898C308.14 170.278 310.977 181.431 310.768 193.461C310.497 209.376 304.906 222.93 292.87 233.519C287.155 238.553 280.521 241.978 273.179 244.046C261.31 247.366 249.19 249.079 236.946 250.061C226.829 250.854 216.732 250.102 208.597 250.416Z'
                                fill='#00F4C5'
                            />
                            <path
                                d='M135.088 127.604C126.973 127.98 117.566 127.499 108.2 127.082C96.9353 126.58 85.6293 126.685 74.4276 125.453C58.3865 123.698 42.6166 120.67 28.1399 113.13C12.1822 104.818 2.29474 91.6809 0.354791 73.6986C-1.20969 59.1833 2.29474 45.754 13.1835 35.1025C18.5862 29.8185 25.3864 27.2287 32.4579 25.2237C49.2917 20.4409 66.5635 17.8303 83.8354 15.2614C92.7425 13.9456 101.816 13.5696 110.828 12.964C121.383 12.2956 131.938 11.8779 142.493 11.2514C149.356 10.8337 156.219 10.7501 163.061 10.3533C171.342 9.87293 179.602 9.97736 187.863 10.0818C201.588 10.2698 215.272 11.2514 228.936 12.7969C239.991 14.05 250.88 15.9297 261.331 19.7726C270.864 23.2605 280.584 26.3724 289.408 31.5937C299.567 37.5878 307.618 45.3781 311.144 57.0321C313.689 65.428 313.793 73.6986 310.184 81.9066C307.326 88.4228 304.114 94.6675 299.421 100.119C294.685 105.611 288.949 109.684 282.441 112.608C267.568 119.312 251.819 122.403 235.652 123.907C224.263 124.972 212.853 125.202 201.442 125.557C191.284 125.87 181.146 126.351 171.008 126.81C159.494 127.374 147.937 127.729 135.088 127.604Z'
                                fill='#00F4C5'
                            />
                            <path
                                d='M128.84 41.96C126.52 41 123.96 42.04 123 44.28L107.4 81.32L97.08 56.76C96.28 55 94.6 54.04 92.92 54.04C91.16 54.04 89.48 55 88.76 56.76L78.44 81.32L62.76 44.28C61.88 42.04 59.24 41 57.08 41.96C54.76 42.84 53.8 45.48 54.68 47.64L74.36 94.28C74.52 94.52 74.6 94.84 74.76 95V95.08C74.92 95.24 75 95.4 75.16 95.56C75.24 95.72 75.24 95.72 75.32 95.8C75.56 95.88 75.64 96.04 75.88 96.2C75.88 96.2 75.88 96.2 75.96 96.2C76.12 96.36 76.44 96.6 76.68 96.68C76.76 96.68 76.76 96.68 76.84 96.76C77 96.76 77.16 96.84 77.4 96.92C77.48 96.92 77.56 96.92 77.64 96.92C77.88 97 78.2 97 78.44 97C78.68 97 78.92 97 79.16 96.92C79.24 96.92 79.32 96.92 79.4 96.92C79.56 96.84 79.72 96.76 80.04 96.76C80.04 96.68 80.12 96.68 80.12 96.68C80.12 96.68 80.12 96.68 80.2 96.68C80.36 96.6 80.6 96.36 80.84 96.2C80.84 96.2 80.84 96.2 81 96.2C81.16 96.04 81.32 95.88 81.48 95.8C81.48 95.72 81.56 95.72 81.56 95.56C81.72 95.4 81.88 95.24 82.04 95.08C82.04 95.08 82.04 95 82.12 95C82.2 94.84 82.36 94.52 82.44 94.28L92.92 69.48L103.4 94.28C103.48 94.52 103.56 94.84 103.72 95C103.72 95 103.72 95.08 103.88 95.08C103.96 95.24 104.12 95.4 104.2 95.56C104.28 95.72 104.28 95.72 104.36 95.8C104.52 95.88 104.68 96.04 104.92 96.2C104.92 96.2 104.92 96.2 105 96.2C105.16 96.36 105.4 96.6 105.72 96.68C105.8 96.68 105.8 96.68 105.88 96.76C106.04 96.76 106.2 96.84 106.44 96.92C106.44 96.92 106.52 96.92 106.68 96.92C106.92 97 107.16 97 107.4 97C107.72 97 107.96 97 108.2 96.92C108.2 96.92 108.28 96.92 108.36 96.92C108.6 96.84 108.84 96.76 109 96.76C109 96.68 109.08 96.68 109.08 96.68H109.16C109.48 96.6 109.64 96.36 109.88 96.2H109.96C110.12 96.04 110.36 95.88 110.52 95.8C110.52 95.72 110.6 95.72 110.6 95.56C110.76 95.4 110.92 95.24 111 95.08L111.08 95C111.24 94.84 111.4 94.52 111.48 94.28L131.08 47.64C132.04 45.48 131 42.84 128.84 41.96ZM148.245 97C150.725 97 152.725 95.08 152.725 92.6V73.4H173.445V92.6C173.445 95.08 175.365 97 177.845 97C180.325 97 182.325 95.08 182.325 92.6V45.4C182.325 42.92 180.325 41 177.845 41C175.365 41 173.445 42.92 173.445 45.4V64.6H152.725V45.4C152.725 42.92 150.725 41 148.245 41C145.765 41 143.845 42.92 143.845 45.4V92.6C143.845 95.08 145.765 97 148.245 97ZM221.582 39.4C213.902 39.4 206.862 42.68 201.982 47.96C197.022 53.24 194.062 60.28 194.062 68.2C194.062 76.12 197.022 83.24 201.982 88.44C206.862 93.64 213.902 97 221.582 97C228.942 97 235.982 93.64 240.702 88.44C245.662 83.24 248.782 76.12 248.782 68.2C248.782 60.28 245.662 53.24 240.702 47.96C235.982 42.68 228.942 39.4 221.582 39.4ZM234.222 82.12C230.862 85.72 226.382 87.88 221.582 87.88C216.462 87.88 211.982 85.72 208.622 82.12C205.262 78.68 203.182 73.64 203.182 68.2C203.182 62.76 205.262 57.72 208.622 54.2C211.982 50.6 216.462 48.52 221.582 48.52C226.382 48.52 230.862 50.6 234.222 54.2C237.502 57.72 239.662 62.76 239.662 68.2C239.662 73.64 237.502 78.68 234.222 82.12Z'
                                fill='white'
                            />
                            <path
                                d='M120.8 223.2C121.44 224.96 123.12 226 124.88 226C125.44 226 126 225.92 126.4 225.76C128.72 224.88 129.84 222.32 129.04 220L111.36 172.88C110.64 171.12 108.96 170 107.12 170.08C105.36 170 103.6 171.12 102.88 172.88L85.2 220C84.4 222.32 85.52 224.88 87.84 225.76C88.32 225.92 88.8 226 89.36 226C91.12 226 92.8 224.96 93.52 223.2L97.44 212.8H116.88L120.8 223.2ZM100.64 204L107.12 186.8L113.6 204H100.64ZM172.679 216.64C172.519 215.84 172.279 214.32 172.359 211.92C172.359 208.56 171.319 205.6 169.719 203.28C168.919 202.08 167.959 201.12 166.919 200.32C170.759 197.12 173.159 192.48 173.159 187.2C173.159 177.68 165.559 170 156.039 170H141.799C141.719 170 141.719 170 141.719 170C139.239 170 137.319 171.92 137.319 174.4V221.6C137.319 224 139.239 226 141.719 226C144.199 226 146.199 224 146.199 221.6V204.24H155.639C156.359 204.4 158.439 205.04 160.119 206.16C161.079 206.8 162.039 207.6 162.519 208.48C163.079 209.36 163.399 210.4 163.479 211.92C163.479 216.32 164.039 219.2 165.159 221.52C165.799 222.64 166.679 223.68 167.719 224.32C168.839 225.04 170.039 225.2 170.839 225.2C170.919 225.2 170.919 225.2 170.919 225.2C171.719 225.2 172.359 225.04 172.679 224.96C174.999 224.16 176.279 221.68 175.479 219.36C174.999 218 173.959 217.04 172.679 216.64ZM156.039 195.36H146.199V178.88H156.039C160.599 178.88 164.279 182.56 164.279 187.2C164.279 191.68 160.599 195.36 156.039 195.36ZM191.239 226L191.319 225.92C191.319 225.92 191.319 226 191.479 226H217.399C219.719 226 221.799 224 221.799 221.6C221.799 219.12 219.719 217.12 217.399 217.12H195.719V202.4H214.359C216.759 202.4 218.759 200.4 218.759 197.92C218.759 195.6 216.759 193.52 214.359 193.52H195.719V178.88H217.399C219.719 178.88 221.799 176.88 221.799 174.4C221.799 171.92 219.719 170 217.399 170H191.479C191.319 170 191.319 170 191.319 170H191.239C188.759 170 186.839 171.92 186.839 174.4V221.6C186.839 224 188.759 226 191.239 226Z'
                                fill='white'
                            />
                            <path
                                d='M187.612 382.52C178.371 382.812 166.815 381.162 155.175 380.87C147.457 380.682 139.739 380.974 132.021 380.703C123.406 380.41 114.77 380.41 106.155 380.327C96.5805 380.243 87.1728 381.747 77.6816 382.666C71.5906 383.251 65.4995 382.937 59.4085 382.728C54.1518 382.54 48.9786 381.58 43.7637 380.807C36.1291 379.658 29.1202 377.027 23.0083 372.202C19.0241 369.049 16.6669 364.725 14.9773 360.068C11.306 350.064 8.42736 339.851 8.55252 329.095C8.71939 313.097 14.3932 299.333 26.1581 288.348C30.7055 284.108 36.4002 281.706 42.241 279.889C51.2732 277.049 60.4932 274.73 69.7966 273.059C77.9111 271.597 86.1924 270.908 94.3902 269.989C100.648 269.279 106.927 268.694 113.206 268.089C115.855 267.838 118.504 267.587 121.174 267.483C131.458 267.044 141.742 266.188 152.067 266.606C160.39 266.94 168.713 267.337 177.036 267.817C181.751 268.089 186.423 267.462 191.117 267.316C196.436 267.149 201.734 266.606 207.074 266.606C213.666 266.606 220.258 266.627 226.849 266.606C234.025 266.564 241.097 267.546 248.21 268.318C256.303 269.196 264.313 270.449 272.303 271.932C278.435 273.059 283.776 275.67 288.552 279.429C292.891 282.855 297.001 286.593 300.234 291.188C308.181 302.55 311.748 314.955 310.518 328.928C309.725 338.013 308.181 346.806 303.759 354.784C298.169 364.851 290.451 372.578 278.665 374.876C268.84 376.797 259.015 378.865 249.023 379.867C242.765 380.494 236.466 380.953 230.166 381.183C216.774 381.642 203.424 382.478 187.612 382.52Z'
                                fill='#00F4C5'
                            />
                            <path
                                d='M145.84 296.96C143.52 296 140.96 297.04 140 299.28L124.4 336.32L114.08 311.76C113.28 310 111.6 309.04 109.92 309.04C108.16 309.04 106.48 310 105.76 311.76L95.44 336.32L79.76 299.28C78.88 297.04 76.24 296 74.08 296.96C71.76 297.84 70.8 300.48 71.68 302.64L91.36 349.28C91.52 349.52 91.6 349.84 91.76 350V350.08C91.92 350.24 92 350.4 92.16 350.56C92.24 350.72 92.24 350.72 92.32 350.8C92.56 350.88 92.64 351.04 92.88 351.2C92.88 351.2 92.88 351.2 92.96 351.2C93.12 351.36 93.44 351.6 93.68 351.68C93.76 351.68 93.76 351.68 93.84 351.76C94 351.76 94.16 351.84 94.4 351.92C94.48 351.92 94.56 351.92 94.64 351.92C94.88 352 95.2 352 95.44 352C95.68 352 95.92 352 96.16 351.92C96.24 351.92 96.32 351.92 96.4 351.92C96.56 351.84 96.72 351.76 97.04 351.76C97.04 351.68 97.12 351.68 97.12 351.68C97.12 351.68 97.12 351.68 97.2 351.68C97.36 351.6 97.6 351.36 97.84 351.2C97.84 351.2 97.84 351.2 98 351.2C98.16 351.04 98.32 350.88 98.48 350.8C98.48 350.72 98.56 350.72 98.56 350.56C98.72 350.4 98.88 350.24 99.04 350.08C99.04 350.08 99.04 350 99.12 350C99.2 349.84 99.36 349.52 99.44 349.28L109.92 324.48L120.4 349.28C120.48 349.52 120.56 349.84 120.72 350C120.72 350 120.72 350.08 120.88 350.08C120.96 350.24 121.12 350.4 121.2 350.56C121.28 350.72 121.28 350.72 121.36 350.8C121.52 350.88 121.68 351.04 121.92 351.2C121.92 351.2 121.92 351.2 122 351.2C122.16 351.36 122.4 351.6 122.72 351.68C122.8 351.68 122.8 351.68 122.88 351.76C123.04 351.76 123.2 351.84 123.44 351.92C123.44 351.92 123.52 351.92 123.68 351.92C123.92 352 124.16 352 124.4 352C124.72 352 124.96 352 125.2 351.92C125.2 351.92 125.28 351.92 125.36 351.92C125.6 351.84 125.84 351.76 126 351.76C126 351.68 126.08 351.68 126.08 351.68H126.16C126.48 351.6 126.64 351.36 126.88 351.2H126.96C127.12 351.04 127.36 350.88 127.52 350.8C127.52 350.72 127.6 350.72 127.6 350.56C127.76 350.4 127.92 350.24 128 350.08L128.08 350C128.24 349.84 128.4 349.52 128.48 349.28L148.08 302.64C149.04 300.48 148 297.84 145.84 296.96ZM163.683 352L163.763 351.92C163.763 351.92 163.763 352 163.923 352H189.843C192.163 352 194.243 350 194.243 347.6C194.243 345.12 192.163 343.12 189.843 343.12H168.163V328.4H186.803C189.203 328.4 191.203 326.4 191.203 323.92C191.203 321.6 189.203 319.52 186.803 319.52H168.163V304.88H189.843C192.163 304.88 194.243 302.88 194.243 300.4C194.243 297.92 192.163 296 189.843 296H163.923C163.763 296 163.763 296 163.763 296H163.683C161.203 296 159.283 297.92 159.283 300.4V347.6C159.283 350 161.203 352 163.683 352ZM215.344 342.72C213.264 342.72 211.424 344.48 211.424 346.64V348.08C211.424 350.32 213.264 352 215.344 352C217.584 352 219.264 350.32 219.264 348.08V346.64C219.264 344.48 217.584 342.72 215.344 342.72ZM232.224 312.8C232.224 303.52 224.624 296 215.344 296C209.184 296 203.744 299.36 200.864 304.32C199.744 306.24 200.384 308.56 202.224 309.68C204.144 310.8 206.544 310.16 207.664 308.24C209.184 305.6 212.064 303.84 215.344 303.84C220.384 303.84 224.464 307.76 224.464 312.8C224.464 317.76 220.384 321.76 215.344 321.76C213.264 321.76 211.424 323.6 211.424 325.68C211.424 325.76 211.424 325.76 211.504 325.84C211.504 325.92 211.424 325.92 211.424 326V334.32C211.424 336.56 213.264 338.24 215.344 338.24C217.584 338.24 219.264 336.56 219.264 334.32V329.12C226.704 327.36 232.224 320.72 232.224 312.8Z'
                                fill='white'
                            />
                        </svg>
                    </div>
                    <div
                        className='whoAreWeSection__text'
                        dangerouslySetInnerHTML={{
                            __html: t(`whoAreWe__text`),
                        }}
                    />
                </WhoAreWeSection>
                <PortraitsSection>
                    <div className='portraitsSection__Sylwia'>
                        <div>
                            <h2>{t(`portraitsSection.nameSylwia`)}</h2>
                            <p>{t(`portraitsSection.textSylwia`)}</p>
                        </div>
                        <img src='about-page-sylwia.png' />
                    </div>
                    <div className='portraitsSection__Tibo'>
                        <img src='about-page-tibo.png' />
                        <div>
                            <h2>{t(`portraitsSection.nameTibo`)}</h2>
                            <p>{t(`portraitsSection.textTibo`)}</p>
                        </div>
                    </div>
                </PortraitsSection>
                <BottomSection>
                    <div className='bottomSection__topConfetti'>
                        <svg
                            className='bottomSection__topConfetti__svg1'
                            width='36'
                            height='52'
                            viewBox='0 0 36 52'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path
                                d='M35.3832 10.8097C35.5936 12.7838 35.4255 14.8746 35.0266 16.967C33.7719 23.5715 30.3372 27.0244 23.7767 28.364C20.9288 28.9414 18.0104 29.1206 15.3017 30.2856C13.8581 30.8975 12.59 31.769 11.3828 32.7528C8.68531 34.9175 8.93275 37.8047 9.38707 40.7331C9.62518 42.324 10.4659 43.6975 10.9938 45.1903C11.335 46.1814 11.6761 47.1725 11.5072 48.2748C11.0701 50.9917 8.57873 52.2093 6.15636 50.8381C4.77405 50.0468 3.71309 48.9389 2.97156 47.5584C-0.517842 41.1915 0.57131 32.5928 5.41064 27.1537C8.66705 23.5069 12.6784 21.1862 17.2968 19.8015C18.7766 19.3668 20.2582 18.8882 21.7094 18.3536C25.6719 16.8985 25.5805 15.9724 25.6793 12.4512C25.7416 10.2684 25.5512 8.08638 25.6355 5.90442C25.7024 4.36968 26.146 3.0148 27.0767 1.82226C28.4603 0.0659023 31.0641 0.0497533 32.6359 1.78214C34.3537 3.69609 34.9091 6.06849 35.2634 8.52065C35.3758 9.21701 35.3442 9.94053 35.3832 10.8097Z'
                                fill='#14133A'
                            />
                        </svg>
                        <svg
                            className='bottomSection__topConfetti__svg2'
                            width='15'
                            height='14'
                            viewBox='0 0 15 14'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path
                                d='M13.6846 5.52227C12.1332 2.03289 8.50886 -0.292818 5.40719 0.136786C3.1021 0.449706 1.55073 1.74431 0.779144 3.98799C0.0271805 6.1384 0.365975 8.10653 1.85409 9.88787C2.62609 10.8192 3.4228 11.7609 4.34069 12.5647C7.80809 15.6366 13.6882 12.8448 14.254 8.38409C14.3866 7.35219 14.1092 6.35201 13.6846 5.52227Z'
                                fill='#36F0C7'
                            />
                        </svg>
                    </div>
                    <BulletPoints>
                        <h2
                            style={{
                                width: '100%',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                color: theme`colors.primary.dark`,
                            }}
                        >
                            {t(`row.heading`)}
                        </h2>
                        <div>
                            <svg width='120' height='120' viewBox='0 0 140 140' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                <path
                                    d='M67.0119 5C75.4573 6.92796 83.3102 10.0691 90.9468 13.6053C94.182 15.11 97.2761 16.8499 100.436 18.4675C101.612 19.0694 102.91 19.5396 103.972 20.2732C104.64 20.7246 105.157 21.4864 105.43 22.2012C106.333 24.6182 107.113 27.0728 107.903 29.518C108.552 31.5306 107.687 33.4868 107.226 35.4618C105.411 43.23 102.571 50.7538 99.4768 58.2305C98.7809 59.9234 98.1038 61.6256 97.5207 63.3467C97.3326 63.8921 97.3514 64.5693 97.5301 65.1053C99.2135 69.9205 101.085 74.6887 102.627 79.5509C103.521 82.3723 104.17 85.3066 104.424 88.2409C104.649 90.8271 104.292 93.4981 104.01 96.122C103.53 100.57 103.173 105.028 101.593 109.383C98.5364 117.837 95.3858 126.245 90.7587 134.211C90.2226 135.133 89.6772 135.236 88.8966 134.578C87.8997 133.731 88.0595 132.8 88.5204 131.709C91.417 124.853 94.3607 118.007 97.0786 111.104C99.9189 103.9 101.527 96.4888 101.301 88.965C101.217 86.1436 100.351 83.341 99.6273 80.5854C98.9878 78.1778 98.0379 75.8455 97.2479 73.4661C96.7871 72.0742 96.3733 70.6729 95.9219 69.281C95.8748 69.1211 95.6773 69.0083 95.4328 68.7638C93.4014 73.9081 91.417 78.9114 89.3856 84.0558C89.7806 83.8677 90.0345 83.7172 90.3073 83.6232C90.9092 83.4257 91.5299 83.2658 92.1412 83.0965C92.2728 83.8113 92.7431 84.6483 92.4609 85.2314C91.4452 87.3568 90.0721 89.3036 87.1567 89.9337C87.6834 91.4667 88.2006 92.868 88.6426 94.2975C88.9154 95.1815 89.1975 96.0938 89.2445 97.006C89.2633 97.4575 88.8778 98.0782 88.4545 98.3697C88.2194 98.539 87.3354 98.3321 87.1003 98.0594C86.2915 97.0719 85.4262 96.0562 84.9748 94.9088C84.2695 93.1125 83.9215 91.2033 83.3478 89.36C82.2663 85.8991 81.1565 82.457 80.0185 79.0149C79.5107 77.4819 79.1063 75.8925 78.3257 74.4818C76.7739 71.6792 75.0529 68.9424 73.2754 66.2527C72.6829 65.3687 71.7612 64.6163 70.849 63.9674C69.617 63.0833 68.6765 63.2244 68.0464 64.5787C67.4727 65.8013 67.1341 67.212 67.1811 68.5098C67.2752 71.5193 67.5197 74.5288 67.9805 77.5007C68.7423 82.4288 69.617 87.338 70.6421 92.2096C71.7142 97.2976 71.686 102.367 70.6703 107.539C70.3223 109.298 70.4352 111.151 70.6233 112.928C70.9242 115.797 71.385 118.646 72.8898 121.223C73.4353 122.154 73.9055 123.123 74.3663 124.092C74.498 124.355 74.6203 124.712 74.5262 124.957C74.2723 125.587 74.0184 126.537 73.5199 126.697C72.8992 126.894 71.733 126.659 71.3286 126.217C70.059 124.834 68.6671 123.405 67.9994 121.75C67.0965 119.511 66.5887 117.076 66.3723 114.668C66.1842 112.505 66.5981 110.276 66.7956 108.075C66.8614 107.304 67.1153 106.533 67.2376 105.762C67.5761 103.655 67.6044 103.523 65.3755 102.799C63.297 102.122 61.0963 101.699 58.8298 101.135C58.369 104.981 57.9552 108.743 57.4567 112.496C56.8266 117.245 56.1118 121.994 55.4441 126.744C55.3971 127.092 55.4911 127.468 55.3783 127.788C55.2184 128.211 54.9645 128.897 54.6729 128.944C54.1557 129.029 53.4691 128.831 53.0365 128.54C51.7481 127.684 51.9268 126.339 52.1242 125.135C53.3469 117.903 53.3469 110.586 55.2654 103.411C55.5193 102.442 55.5287 101.417 55.5287 100.429C55.5287 100.175 55.1149 99.8462 54.7952 99.724C48.1367 97.1189 41.892 93.9025 36.0422 90.1124C34.1895 88.9086 33.249 87.1875 32.5437 85.3442C31.7255 83.1905 30.5217 81.0651 31.1988 78.6481C31.9042 76.137 32.6754 73.626 33.6346 71.1808C35.0547 67.5506 36.6724 63.9768 38.1959 60.3748C41.0737 53.5282 43.9892 46.7004 46.8106 39.8349C50.2151 31.54 53.4973 23.2075 56.9394 14.9219C57.8705 12.693 59.2154 10.5864 60.3533 8.4139C61.1245 6.94677 62.7327 6.35427 64.0964 5.50785C65.0933 5.34797 66.0526 5.16928 67.0119 5ZM63.9742 67.0333C64.3127 65.6414 64.5478 64.2307 64.9993 62.8576C66.0432 59.6788 69.2126 58.7478 72.2127 60.2149C72.9838 60.5911 73.5199 60.6475 74.3287 60.1585C75.7394 59.3027 77.0467 59.5942 77.4134 60.9673C77.6956 62.0112 77.4323 63.1962 77.4134 64.3153C77.4134 64.6257 77.3006 65.0019 77.4511 65.2464C77.9213 66.0458 78.495 66.7888 79.0593 67.6164C80.3383 64.7856 81.749 62.0394 82.8399 59.218C87.0344 48.2898 91.1255 37.3333 95.2447 26.3768C95.7808 24.9567 95.5739 24.5335 94.088 23.9316C91.7556 22.9818 89.4044 22.0601 87.0438 21.1572C80.6487 18.7214 74.2441 16.2856 67.8395 13.8686C65.8363 13.1068 65.7704 13.1162 65.0087 14.9878C62.3848 21.3924 59.8455 27.8158 57.184 34.2015C54.0522 41.7253 50.8452 49.2208 47.6288 56.707C46.5661 59.171 45.3435 61.588 44.1303 64.1649C50.6947 67.56 57.184 71.0209 64.2281 73.7953C64.1528 71.4065 64.0776 69.1964 64.0118 66.9863L63.9742 67.0333ZM84.8714 83.4633C84.9936 83.4257 85.1159 83.3975 85.2381 83.3598C86.63 80.2751 88.1348 77.2186 89.395 74.0868C91.4923 68.9142 93.5143 63.704 95.4516 58.4844C98.4235 50.4905 101.311 42.4871 104.198 34.4743C104.772 32.8849 105.138 31.2673 104.207 29.424C103.775 30.2704 103.38 30.8817 103.135 31.5306C100.935 37.3897 98.8937 43.2959 96.5332 49.108C92.508 59.0205 88.3041 68.886 84.1472 78.7609C83.3948 80.5572 84.608 81.9021 84.8714 83.4633ZM67.9241 97.2223C56.3375 94.147 45.6538 89.7268 35.5626 84.0558C36.3432 85.1185 37.0579 86.3505 38.2053 87.0559C40.6693 88.57 43.3403 89.8303 45.9454 91.1657C48.9549 92.7175 51.9268 94.3351 55.0115 95.774C58.9709 97.6267 63.3534 98.4638 67.783 99.3008C67.8395 98.5108 67.8865 97.8148 67.9241 97.2223ZM49.3687 82.1184C49.8671 85.3818 53.8171 87.7142 57.974 86.8866C61.9992 86.0778 62.9773 82.2501 61.0775 79.4475C59.7138 77.4349 57.6448 76.7766 55.0209 76.7013C51.654 76.5885 48.6445 79.0525 49.3687 82.1184ZM81.9559 15.1288C82.4544 15.4486 82.9152 15.8436 83.4701 16.0505C83.7992 16.1728 84.4481 16.1351 84.655 15.9376C84.8714 15.7307 84.8525 15.1853 84.7209 14.8655C84.2883 13.8404 83.0469 13.9156 81.9559 15.1288Z'
                                    fill='#14133A'
                                />
                                <path
                                    d='M73.7554 46.8509C73.699 47.6974 73.7366 48.5438 73.5579 49.3714C73.2476 50.8103 71.7804 51.384 70.2098 50.5846C69.2224 50.0862 68.3477 49.3714 67.5859 48.619C66.8148 47.8572 66.8524 46.898 67.727 46.1268C68.3759 45.5531 69.1283 45.0076 69.9465 44.6597C71.6017 43.9543 73.4827 45.0829 73.7554 46.8509Z'
                                    fill='#14133A'
                                />
                                <path
                                    d='M59.8088 57.9016C59.8841 57.6289 59.8371 57.1586 60.0722 56.9799C61.276 56.0489 62.2823 54.7792 64.1444 54.8639C65.5081 54.9297 66.3545 55.6727 66.3639 56.9235C66.3733 57.6477 66.3263 58.3812 66.2605 59.1054C66.11 60.7606 64.624 61.6635 62.997 60.9769C61.5487 60.3656 60.3637 59.4346 59.8088 57.9016Z'
                                    fill='#14133A'
                                />
                                <path
                                    d='M54.5409 61.4754C54.5221 62.1149 54.6255 63.0084 54.4562 63.8736C54.1177 65.5758 53.2336 66.0179 51.569 65.2467C50.5721 64.7859 49.6504 64.0993 48.9075 63.3469C48.3244 62.7639 48.2209 61.9362 49.152 61.3061C49.8856 60.8077 50.5721 60.1964 51.3809 59.8578C53.4688 59.0114 54.2211 59.5757 54.5409 61.4754Z'
                                    fill='#14133A'
                                />
                                <path
                                    d='M86.7247 39.3268C86.3673 40.2296 87.2326 41.424 85.8783 42.4868C85.1353 43.0698 84.4488 43.1263 83.9221 42.8253C82.85 42.2234 81.8907 41.4428 81.0067 40.6246C80.7527 40.3895 80.828 39.7594 80.9502 39.3456C81.1383 38.7249 83.64 37.3706 84.3923 37.3706C86.0382 37.3894 86.4614 37.7092 86.7247 39.3268Z'
                                    fill='#14133A'
                                />
                                <path
                                    d='M56.3196 53.4438C56.2726 54.2996 56.2726 55.146 56.1597 55.9831C55.934 57.7417 54.9465 57.8828 53.3007 57.1963C52.332 56.7919 51.5515 56.0113 50.8273 55.2871C50.5357 54.9956 50.5075 54.3749 50.6016 53.9423C50.7521 53.2933 53.4512 51.8356 54.2318 51.7698C55.6989 51.6287 55.934 52.5974 56.3196 53.4438Z'
                                    fill='#14133A'
                                />
                                <path
                                    d='M58.4719 41.443C59.4406 41.537 60.4563 41.2643 60.5974 42.4963C60.7008 43.371 61.1993 44.1986 61.2463 45.0732C61.3215 46.4839 60.0237 47.2833 58.6506 46.7002C57.776 46.324 56.9483 45.7786 56.2618 45.1672C55.2555 44.2644 55.406 43.3992 56.5816 42.5998C57.2117 42.1672 57.8888 41.8004 58.4719 41.443Z'
                                    fill='#14133A'
                                />
                                <path
                                    d='M64.0117 66.9865C63.6073 67.5226 63.2593 68.0963 62.7891 68.5665C62.5351 68.8205 62.0273 69.0838 61.7075 69.0368C61.0962 68.9521 60.4943 68.6982 59.9677 68.4161C58.952 67.8612 57.7764 67.2969 58.2936 65.9426C58.6604 64.9834 61.2373 63.7984 62.3659 64.0617C62.8173 64.1651 63.3345 64.5319 63.4944 64.9081C63.786 65.5664 63.833 66.3188 63.9741 67.0336L64.0117 66.9865Z'
                                    fill='#14133A'
                                />
                                <path
                                    d='M63.296 31.098C65.1487 30.7783 66.1362 31.3425 66.3055 32.5275C66.4089 33.2517 66.4465 33.9947 66.3619 34.7188C66.2114 35.8756 65.3368 36.4023 64.18 35.9132C63.1267 35.4712 62.1298 34.8317 61.321 34.0981C61.0106 33.816 61.0294 32.8379 61.3398 32.4993C61.9417 31.8316 62.8728 31.3896 63.296 31.098Z'
                                    fill='#14133A'
                                />
                                <path
                                    d='M71.5923 22.9157C71.9215 24.7496 71.4701 25.8123 70.1628 26.0004C68.9308 26.1791 66.8712 25.1258 66.589 23.4423C66.4198 22.436 67.8587 21.0065 69.2882 20.7526C70.6143 20.5269 71.2726 21.1476 71.5923 22.9157Z'
                                    fill='#14133A'
                                />
                                <path
                                    d='M78.9191 23.9692C79.869 24.5147 80.8941 24.7686 81.1198 25.3141C81.5242 26.2922 81.6277 27.4396 81.5148 28.5023C81.4208 29.3863 80.0383 29.7249 78.9191 29.2171C78.2326 28.9067 77.4896 28.5587 77.0288 28.0415C76.6526 27.6277 76.314 26.7812 76.5491 26.4051C77.0664 25.568 77.9693 24.9097 78.9191 23.9692Z'
                                    fill='#14133A'
                                />
                                <path
                                    d='M73.8582 34.1828C75.0338 33.9288 76.0307 34.5025 76.294 35.5935C76.6326 37.0042 76.0589 38.65 75.156 38.8945C73.9899 39.1955 71.4036 37.7754 71.1685 36.6938C70.9616 35.8098 72.3629 34.5025 73.8582 34.1828Z'
                                    fill='#14133A'
                                />
                                <path
                                    d='M90.7401 30.1014C90.7589 30.2518 90.853 30.5622 90.8154 30.8632C90.6273 32.509 89.7526 33.1109 88.0504 32.2644C87.2792 31.8789 86.6209 31.3146 85.9814 30.7691C85.7839 30.5998 85.6992 30.2048 85.7651 29.9415C85.9437 29.2173 87.8435 28.0229 88.6899 28.0512C90.0254 28.0794 90.458 28.4838 90.7401 30.1014Z'
                                    fill='#14133A'
                                />
                                <path
                                    d='M83.2913 50.2739C83.5265 52.0138 82.934 53.4057 81.8712 53.575C81.1189 53.6972 78.6172 52.2489 78.495 51.6188C78.3445 50.857 80.1972 48.9385 81.2317 48.7786C82.2568 48.6281 83.1597 49.277 83.2913 50.2739Z'
                                    fill='#14133A'
                                />
                                <path
                                    d='M54.532 78.2905C57.6826 77.7168 60.2031 78.9112 60.5416 81.2624C60.8144 83.1339 59.6858 85.0995 57.2876 85.4005C54.2687 85.7767 51.4755 84.4788 51.0523 82.2029C50.6573 80.1338 51.8705 78.7702 54.532 78.2905Z'
                                    fill='#14133A'
                                />
                            </svg>
                            <div>{t(`row.point_1`)}</div>
                        </div>
                        <div>
                            <svg width='121' height='120' viewBox='0 0 141 140' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                <path
                                    d='M54.3816 87.1096C52.5505 91.0944 49.5125 93.9139 45.7774 96.078C41.5637 98.5126 36.9651 99.6362 32.1792 100.188C31.0971 100.312 30.7226 99.7819 30.296 99.064C29.8382 98.2733 29.6509 97.6594 30.3376 96.7543C32.1167 94.3925 33.8334 91.9684 35.3316 89.4193C36.372 87.6402 37.0171 85.6218 37.839 83.7179C35.0819 82.8751 32.6161 82.1676 30.1816 81.3665C23.8038 79.2545 17.9671 76.1644 13.3892 71.16C7.40684 64.595 3.318 57.0312 1.67415 48.2397C0.529688 42.1532 0.716963 36.1708 3.21396 30.4173C5.16994 25.9019 8.39523 22.3645 12.0783 19.16C20.412 11.8771 30.2648 9.40093 41.0331 10.1188C47.5045 10.5558 53.851 11.8771 60.0103 14.0412C63.683 15.3313 67.1163 17.0168 70.1856 19.4409C75.7622 23.8315 78.6233 29.8451 80.6209 36.4101C80.7874 36.9616 81.0059 37.4922 81.0995 37.7627C85.0843 37.0552 88.8298 36.0356 92.6169 35.8171C98.1103 35.505 103.635 35.3697 109.076 36.8679C112.655 37.8563 116.068 39.1464 119.293 40.9463C125.921 44.6502 131.144 49.8731 135.586 55.9804C140.757 63.0864 141.839 70.8999 139.831 79.2337C137.573 88.587 132.486 96.3277 125.411 102.685C122.903 104.942 119.865 106.742 116.817 108.261C111.781 110.769 106.246 111.799 100.597 112.662C100.68 113.099 100.743 113.515 100.847 113.921C102.064 118.52 103.895 122.858 106.694 126.729C107.256 127.509 107.131 128.112 106.611 128.82C106.09 129.527 105.674 130.256 104.561 129.912C103.416 129.559 102.22 129.392 101.076 129.049C94.2608 126.999 88.4865 123.462 84.9491 117.084C83.7318 114.889 83.0451 112.402 82.0879 110.061C81.9527 109.728 81.755 109.26 81.4845 109.166C79.4661 108.49 77.3852 108.012 75.4084 107.252C72.7034 106.222 69.8526 105.327 67.4389 103.787C61.6541 100.084 57.919 94.611 55.5157 88.2125C55.3076 87.6714 55.0995 87.1304 54.829 86.4125C54.6001 86.7663 54.4649 86.9327 54.3816 87.1096ZM50.3864 86.3397C51.5309 84.623 51.9991 82.3965 52.5089 80.3365C52.8418 79.0152 52.8002 77.5586 52.717 76.1748C52.4152 70.8375 53.8094 65.8851 56.0255 61.1304C58.5329 55.7515 61.883 50.9239 66.1904 46.8247C69.4573 43.7139 73.1924 41.2377 77.3228 39.4377C78.1239 39.084 78.1447 38.7199 77.9367 38.0748C75.0547 29.3561 69.7382 22.8951 60.9258 19.6282C56.5665 18.0156 52.0719 17.048 47.5045 16.174C42.4273 15.196 37.3812 15.0296 32.2936 15.5914C25.25 16.3613 19.0491 19.16 13.795 23.9147C12.0575 25.4858 10.4345 27.2337 8.95706 29.0544C5.3156 33.549 4.74337 38.8135 5.53409 44.3069C6.54329 51.2881 9.12353 57.593 13.3684 63.3049C17.6341 69.0584 22.9715 73.1888 29.7966 75.3529C32.9803 76.3621 36.1848 77.2777 39.3996 78.1933C41.5533 78.8071 42.677 80.7007 42.0631 82.8023C40.8666 86.9119 39.2228 90.8239 36.7882 94.3717C36.5281 94.7463 36.3304 95.152 36.1015 95.5474C41.9799 94.018 47.0467 91.3545 50.3864 86.3397ZM88.9234 78.7447C90.1615 77.7667 89.8598 76.5182 90.0679 75.457C90.5777 72.8247 90.9419 70.1508 91.5765 67.5498C92.0239 65.7083 93.2412 65.521 94.5937 66.9047C96.0503 68.4133 96.352 70.4109 96.6537 72.3357C96.9347 74.1044 96.9138 75.9147 96.9763 77.7147C96.9867 78.1724 96.7994 78.6302 96.4144 79.0984C95.1868 75.5714 93.9591 72.0444 92.721 68.507C92.5337 68.507 92.336 68.507 92.1487 68.507C91.9303 69.2561 91.5869 69.9948 91.5349 70.7543C91.2852 74.4269 91.7846 77.9332 93.9487 81.0648C95.5509 83.3849 97.2676 83.3121 98.6201 80.7943C98.8178 80.4197 99.0051 80.0348 99.2444 79.5666C99.4941 79.6498 99.7646 79.7435 100.035 79.8059C102.345 80.4093 103.885 78.7551 104.218 76.2269C104.717 72.3669 104.457 68.4029 102.428 64.98C101.304 63.0968 101.044 61.2865 101.128 59.2577C101.232 56.6462 101.304 54.0244 101.429 51.4129C101.45 50.976 101.71 50.5598 101.877 50.0396C103.885 51.2881 104.166 53.2961 104.488 55.1376C105.112 58.7583 105.518 62.4101 105.986 66.0516C106.288 68.3821 106.413 70.7439 106.871 73.0432C107.256 74.9576 107.963 76.8095 108.629 78.651C109.035 79.7643 109.857 79.9203 110.554 78.9424C111.48 77.673 112.27 76.2789 112.915 74.8431C113.883 72.6895 114.965 70.6919 116.983 69.3497C117.306 69.1312 117.618 68.8607 117.982 68.7775C118.409 68.6838 118.919 68.6526 119.293 68.8191C119.449 68.8919 119.46 69.6098 119.314 69.9323C117.733 73.3553 116.245 76.8303 114.466 80.1492C112.354 84.0612 111.136 88.2021 110.658 92.5822C110.585 93.2689 110.647 93.9764 110.647 94.6734C110.793 94.7151 110.949 94.7567 111.095 94.7983C111.376 94.4758 111.75 94.2053 111.927 93.8307C113.103 91.4482 114.258 89.0448 115.392 86.631C117.16 82.8543 118.971 79.0984 120.615 75.2697C121.416 73.3969 122.123 71.4097 122.456 69.4121C122.924 66.5614 120.24 65.0216 118.013 65.7915C114.861 66.8735 112.905 69.3081 111.303 72.086C110.907 72.7727 110.575 73.4906 110.21 74.1981L109.805 74.1668C109.524 72.5542 109.17 70.9415 108.972 69.3185C108.556 65.9267 108.348 62.5142 107.828 59.1432C107.391 56.2821 106.839 53.4105 105.924 50.6742C105.528 49.4986 104.259 48.2917 103.094 47.7611C101.304 46.9496 99.6189 48.6246 99.3484 51.1736C99.0051 54.3157 98.412 57.4578 99.0467 60.631C99.0987 60.9119 99.0571 61.2241 99.0571 61.6298C97.5381 61.4738 96.0607 61.2969 94.9475 62.5454C94.8434 62.6598 94.5417 62.6598 94.3544 62.6286C92.0967 62.3061 90.4112 63.1488 89.3916 65.2921C88.7778 66.5926 88.3616 67.9868 87.8102 69.4642C86.9155 67.1856 86.1143 64.98 85.1884 62.8367C83.8046 59.6426 82.4313 56.4277 79.8302 53.9724C79.362 53.5354 78.8834 53.0672 78.332 52.7759C77.0731 52.1412 75.731 52.7551 75.6477 54.1388C75.5333 56.1572 75.4501 58.2381 75.783 60.2253C77.4685 70.3173 81.214 79.8371 84.1271 89.5858C85.0531 92.6967 86.3224 95.7035 87.5605 98.6999C87.8414 99.3761 88.2264 100.333 89.4541 100.344C89.6413 98.3565 89.6101 96.5046 89.0275 94.611C85.8542 84.2069 82.7122 73.8027 79.6117 63.3777C78.9667 61.2033 78.5297 58.9768 78.0199 56.7607C77.9575 56.4902 78.0407 56.1884 78.0511 55.8971L78.4673 55.7203C83.3052 62.7327 85.875 70.7751 88.9234 78.7447Z'
                                    fill='#14133A'
                                />
                                <path
                                    d='M29.7446 51.5482C29.7342 51.1216 29.7654 50.6847 29.7029 50.2685C29.3596 47.6363 30.8994 46.0132 33.1155 44.567C36.0079 42.6839 38.4424 40.3221 39.254 37.1072C39.6077 35.7235 39.4516 34.09 38.9626 32.7063C38.4945 31.3745 36.7153 31.2185 35.3628 31.1665C32.7722 31.0728 30.4312 31.8219 29.0995 33.882C28.5377 34.7559 28.4857 35.9524 28.4336 37.024C28.392 37.8563 28.8498 38.7199 28.829 39.5626C28.8082 40.1245 28.3296 40.6655 28.0591 41.2169C27.5285 40.9464 26.8626 40.7799 26.4985 40.3846C24.3552 38.0748 23.6893 35.5778 24.8026 32.6751C26.228 28.992 30.2336 27.3065 34.5409 27.1401C37.7766 27.0152 40.6169 27.7955 42.3856 30.4486C43.6237 32.3005 43.8526 34.4022 43.5821 36.4622C42.8642 41.9452 39.7742 46.0964 34.6345 49.072C34.3016 49.2593 34.0831 49.7587 34.0311 50.1437C33.7189 52.0684 34.3224 54.1076 33.2612 55.9284C32.9803 56.4174 32.4288 56.7711 32.0023 57.1873C31.5549 56.8127 30.8786 56.5006 30.7017 56.0428C30.1399 54.607 30.2023 53.4106 29.7654 51.9332C29.7654 51.9228 29.7342 51.6523 29.7446 51.5482Z'
                                    fill='#14133A'
                                />
                                <path
                                    d='M53.5285 32.6751C53.3412 36.3789 53.2788 40.1036 52.9146 43.7867C52.6025 46.9496 52.0095 50.0916 51.3956 53.2129C51.0419 55.0024 50.4384 56.7607 49.8142 58.4982C49.6581 58.9456 48.9298 59.5906 48.5969 59.5178C48.0767 59.4137 47.5357 58.8519 47.2339 58.3733C46.0999 56.563 46.3288 54.5966 46.5889 52.6927C47.286 47.6154 48.0455 42.559 48.8778 37.5026C49.2211 35.4218 49.8038 33.3825 50.3032 31.3329C50.4072 30.9167 50.5113 30.4069 50.8338 30.1676C51.2916 29.8243 51.9574 29.5122 52.5297 29.5226C52.8522 29.533 53.3412 30.1885 53.4452 30.615C53.6221 31.2705 53.5285 31.978 53.5597 32.6646C53.5493 32.6751 53.5389 32.6751 53.5285 32.6751Z'
                                    fill='#14133A'
                                />
                                <path
                                    d='M49.679 65.4482C49.086 66.1453 48.4201 67.321 47.3589 68.0493C46.8179 68.4134 44.3937 65.5835 44.4561 64.6367C44.5186 63.6275 46.2248 62.7951 47.9207 62.9824C49.523 63.1489 49.3877 63.5547 49.679 65.4482Z'
                                    fill='#14133A'
                                />
                                <path
                                    d='M34.031 64.6055C33.7813 66.6031 32.9593 67.6539 31.7628 67.5083C30.6288 67.373 29.2242 65.6563 29.3491 64.5847C29.4843 63.5131 31.2426 62.5247 32.6992 62.7015C33.8021 62.8368 34.187 63.3778 34.031 64.6055Z'
                                    fill='#14133A'
                                />
                                <path
                                    d='M97.8503 65.3961C99.3277 68.9127 99.3798 72.6374 99.6711 76.3413C99.6919 76.6638 100.056 76.9552 100.264 77.2569C100.618 76.8823 101.2 76.539 101.263 76.1228C101.409 75.1136 101.429 74.0524 101.294 73.0328C100.982 70.6606 100.805 68.2261 99.2133 66.2493C98.9012 65.8643 98.4954 65.5522 98.1312 65.2089C98.048 65.2713 97.9544 65.3337 97.8503 65.3961Z'
                                    fill='#14133A'
                                />
                            </svg>
                            <div>{t(`row.point_2`)}</div>
                        </div>
                        <div>
                            <svg width='120' height='120' viewBox='0 0 140 140' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                <path
                                    d='M38.0004 37.6407C38.4711 36.2152 38.9015 34.7762 39.4125 33.3776C41.4432 27.8908 44.7111 23.3856 50.05 20.7094C51.5965 19.9429 53.3851 19.4857 55.1065 19.2974C57.2448 19.0688 58.4013 20.9246 57.6751 23.1974C57.2582 24.5018 56.5858 25.7256 56.0479 26.9897C55.8865 27.3663 55.7789 27.7697 55.8596 28.2942C56.7606 27.3259 57.6751 26.3711 58.5761 25.4029C61.9516 21.7987 65.9592 19.2167 70.7736 18.0736C72.3605 17.6971 74.1088 17.7105 75.7225 17.9122C77.8205 18.1812 79.0173 21.0725 77.8743 23.4663C76.906 25.4835 75.5074 27.299 74.1895 29.128C72.9119 30.9032 71.5133 32.5976 70.1819 34.319C72.1722 33.6197 74.0684 32.7187 76.0588 32.2883C79.5687 31.5352 82.7694 32.4766 85.3514 35.0048C90.2062 39.7521 92.5597 45.5886 92.7076 52.3664C92.721 52.9447 93.1379 53.9399 93.5414 54.034C96.1772 54.6526 97.1858 56.7371 98.1944 58.8484C100.239 63.0981 100.373 67.6436 100.548 72.2697C100.844 80.7959 98.0196 88.6496 95.9082 96.6916C94.8862 100.551 94.3886 104.559 93.8103 108.526C93.1783 112.856 92.4252 117.133 90.529 121.1C90.3273 121.53 89.8297 121.826 89.48 122.189C89.1976 121.772 88.6866 121.369 88.6597 120.939C88.4849 117.671 88.1218 114.389 88.3638 111.148C88.6462 107.369 89.359 103.617 90.139 99.8923C91.04 95.6426 92.1293 91.4334 93.2993 87.251C94.7383 82.1272 95.8679 76.9228 95.6527 71.5973C95.4779 67.2805 95.1955 62.8695 93.111 58.8888C92.9093 58.5122 92.6538 58.1626 92.4252 57.8129C91.2417 58.2971 90.1524 58.7409 89.2514 59.1174C89.4128 61.3364 89.7759 63.6763 89.6683 65.9894C89.5742 68.047 89.2245 70.1853 88.4983 72.1083C86.4945 77.4204 82.2449 77.9448 77.8474 75.3897C72.7505 72.4311 70.7064 67.5898 70.0743 61.8608C69.5229 56.9254 70.5316 52.4471 72.8446 48.1572C73.9608 46.0861 75.6822 44.6606 77.7398 43.5848C78.6005 43.1275 79.2325 43.3427 79.7032 44.1362C80.2949 45.1313 80.8732 46.1399 81.4246 47.162C82.8904 49.8516 85.0556 51.842 87.799 53.6978C88.1352 50.7527 87.53 48.1841 86.5618 45.7768C85.6607 43.5444 84.437 41.3927 83.0249 39.4427C80.9673 36.5917 77.4708 36.269 74.5122 38.2055C70.8947 40.5589 68.5547 43.9613 66.5643 47.6327C64.3051 51.8016 63.1485 56.3202 62.6509 61.0405C62.4761 62.7215 61.8978 64.3622 61.4137 65.9894C61.2927 66.3794 60.7009 66.9577 60.4723 66.9039C60.042 66.7829 59.5847 66.3391 59.3561 65.9222C58.3206 63.9453 58.0113 61.7936 58.4148 59.6284C59.2485 55.1368 60.1496 50.6585 61.1716 46.2072C61.8709 43.1544 62.3013 39.8731 63.7806 37.2103C66.0668 33.0818 69.1464 29.3835 71.8898 25.5104C72.6833 24.3942 73.4633 23.2646 74.4046 21.9198C71.2712 21.8525 69.0388 23.2243 66.8333 24.6632C59.5847 29.3835 56.3034 36.7531 53.802 44.553C51.8655 50.5913 51.1393 56.8312 51.1527 63.1653C51.1527 64.6581 50.709 66.1508 50.4534 67.6436C50.2517 67.7108 50.0365 67.778 49.8348 67.8318C49.3776 67.3074 48.7859 66.8367 48.4766 66.2315C47.199 63.6763 46.9166 60.9329 47.2393 58.1222C47.5352 55.4864 48.0193 52.8775 48.2748 50.2416C48.369 49.2196 47.979 48.1706 47.9655 47.1216C47.8848 39.12 49.9021 31.6294 53.4927 24.5287C53.6944 24.1387 53.8558 23.7353 54.1786 23.0225C51.6772 23.9101 50.1038 25.5104 48.611 27.1646C44.9262 31.2259 43.1242 36.2421 42.008 41.46C40.8246 47.041 39.8025 52.6892 39.0897 58.3509C38.7266 61.2288 39.2646 64.2008 39.3318 67.1325C39.3453 67.9394 39.1704 68.7866 38.9284 69.5532C38.8073 69.9566 38.3232 70.5349 38.0273 70.5215C37.5835 70.4946 36.9111 70.118 36.7632 69.728C36.0908 67.8856 35.2839 66.0298 35.0418 64.1067C34.5039 59.884 34.2081 55.6209 33.966 51.3713C33.8315 48.9371 34.0063 46.4896 34.0198 44.042C34.0332 41.6886 34.0198 39.3352 34.0198 36.9683C33.8315 36.8876 33.6567 36.8069 33.4684 36.7262C32.9305 37.1969 32.3253 37.6138 31.8546 38.1383C29.2457 41.0162 28.264 44.6606 27.9681 48.332C27.6185 52.5682 27.5378 56.885 27.9547 61.1077C28.8826 70.4273 30.725 79.5721 33.4819 88.5555C36.5211 98.4399 41.2011 107.531 46.2307 116.501C47.3604 118.531 47.8983 120.898 48.5707 123.158C48.7321 123.682 48.3017 124.381 48.1538 125C47.5083 124.744 46.7417 124.623 46.2442 124.193C44.3345 122.552 42.909 120.576 41.7928 118.276C38.2022 110.879 34.2215 103.685 31.5319 95.8713C29.0036 88.5286 26.7309 81.1186 25.3995 73.4666C24.5657 68.6118 24.0547 63.7301 23.4226 58.8619C22.683 53.0926 22.8175 47.3772 24.6061 41.7827C25.6012 38.6896 27.2957 36.1076 29.945 34.1576C31.3839 33.0952 32.9439 32.7725 34.6518 32.9338C35.9832 33.0549 37.0725 34.4266 37.4491 36.4035C37.5298 36.8069 37.5835 37.2103 37.6508 37.6138C37.7718 37.6272 37.8794 37.6407 38.0004 37.6407ZM77.7936 48.3454C77.5381 48.7354 77.417 48.8968 77.3229 49.0716C74.8619 53.8726 74.2164 58.9291 75.3057 64.1874C75.857 66.8636 76.8656 69.3515 79.0711 71.1939C82.5677 74.0987 83.5763 72.6059 84.5849 69.8087C85.9432 66.0163 85.1363 62.1164 85.2707 58.2702C85.2842 57.9205 84.7732 57.4498 84.3966 57.1809C82.2987 55.7688 80.4563 54.155 79.4611 51.7344C79.0039 50.6451 78.4256 49.5961 77.7936 48.3454Z'
                                    fill='#14133A'
                                />
                                <path
                                    d='M105.793 31.6159C107.689 29.8811 109.531 28.0253 111.562 26.398C112.853 25.3625 114.467 24.0581 116.148 25.2415C117.869 26.4518 117.398 28.5766 117.076 30.3115C116.336 34.3325 114.265 37.7886 111.844 41.0027C108.576 45.3465 104.408 48.6817 99.741 51.4251C98.5845 52.1109 96.7152 50.914 96.5269 49.4213C95.6528 42.2669 94.6576 35.1393 93.9314 27.9715C93.6356 25.0263 93.6625 22.0139 93.9583 19.0688C94.1601 17.1054 95.3838 15.5588 97.6162 15.0881C99.2031 14.7519 100.548 15.4109 101.22 16.5002C102.646 18.7998 103.991 21.2474 104.757 23.8025C105.497 26.3039 105.47 29.007 105.793 31.6159Z'
                                    fill='#14133A'
                                />
                            </svg>
                            <div>{t(`row.point_3`)}</div>
                        </div>
                        <div>
                            <svg width='120' height='120' viewBox='0 0 140 140' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                <path
                                    d='M105.636 89.742C105.345 89.8251 105.158 90.1159 105.21 90.4172C105.761 93.4709 106.374 96.5869 106.841 99.7341C107.63 105.011 108.326 110.297 109.053 115.584C109.105 115.958 109.105 116.332 109.043 116.696C108.835 118.004 108.347 118.181 107.225 117.35C101.772 113.299 96.3191 109.238 90.7726 105.114C90.4506 104.876 89.9936 105.011 89.8586 105.384C89.2146 107.181 88.6018 109.103 87.7708 110.921C85.735 115.387 83.5746 119.801 81.4245 124.226C81.2687 124.558 80.7598 125.057 80.6143 124.995C80.23 124.839 79.8146 124.465 79.6484 124.081C78.6928 121.796 77.8203 119.469 76.8855 117.173C75.2859 113.237 73.676 109.311 71.983 105.208C71.8064 104.782 71.2351 104.709 70.9547 105.083C69.8641 106.558 68.8565 107.94 67.8179 109.28C64.4422 113.642 61.0561 117.994 57.6492 122.336C56.9429 123.229 56.1951 123.084 55.9354 121.941C55.3537 119.282 54.876 116.592 54.3774 113.912C53.4114 108.75 52.4662 103.588 51.5003 98.4357C51.5003 98.4357 51.5003 98.4357 51.5003 98.4254C51.4275 98.0307 50.9601 97.8437 50.6174 98.0514C48.9867 99.0278 47.3767 99.973 45.7875 100.949C40.9681 103.899 35.9305 106.278 30.2801 107.181C29.3037 107.337 28.5663 107.129 28.0158 106.382C27.4549 105.613 27.0187 104.813 27.5795 103.795C29.3765 100.482 31.111 97.1374 32.9183 93.824C34.788 90.386 36.7095 86.9791 38.683 83.4269C38.8803 83.0633 38.6622 82.6063 38.2467 82.5544C37.4989 82.4505 36.7511 82.357 36.024 82.1701C32.2536 81.2249 28.4624 80.3524 24.744 79.2306C20.797 78.0361 16.9123 76.5924 12.9965 75.2421C12.4772 75.0655 11.9475 74.8266 11.532 74.4839C10.7114 73.8399 10.8672 72.7597 11.8124 72.3338C17.6394 69.7267 23.4664 67.13 29.2934 64.523C31.5888 63.4947 33.9155 62.4975 35.9824 60.7733C36.2317 60.5656 36.2629 60.2021 36.0655 59.9528C35.1723 58.8102 34.2686 57.7092 33.4481 56.5459C30.2593 52.09 27.1018 47.6029 23.9442 43.1262C23.6533 42.7108 23.4352 42.233 23.2379 41.7552C22.4485 39.9063 22.9159 39.0754 24.8998 39.1896C27.7042 39.3662 30.5398 39.5636 33.2923 40.1141C37.0627 40.8723 40.7811 41.9006 44.645 42.8769C45.0501 42.9808 45.424 42.638 45.3721 42.233C45.1747 40.6957 44.9774 39.0442 44.7489 37.4031C43.8556 31.1191 43.2739 24.8144 43.5544 18.4577C43.5752 17.8864 44.001 17.0866 44.4788 16.8269C45.289 16.3803 46.1199 16.7854 46.7535 17.5021C48.3115 19.2678 49.8488 21.0544 51.4587 22.7786C53.3283 24.7832 55.3018 26.684 57.1507 28.699C59.55 31.3165 61.8766 34.0066 64.2344 36.6657C64.3383 36.7903 64.4525 36.9046 64.5668 37.0396C64.8576 37.3616 65.3977 37.2681 65.5535 36.863C66.5922 34.2248 67.5894 31.7008 68.5865 29.1664C70.2795 24.8247 71.9414 20.4727 73.6864 16.1518C73.8422 15.7675 74.1538 15.4455 74.5381 15.1339C74.8705 14.8638 75.3794 15.0196 75.4833 15.4455C77.6645 23.838 81.3207 31.6177 84.4471 39.7921C84.5925 40.166 85.0599 40.2906 85.3715 40.0414C86.5244 39.1169 87.615 38.2133 88.7576 37.3616C92.4864 34.5468 96.2153 31.7423 99.9857 28.9898C100.723 28.4497 101.751 27.4838 102.582 28.3978C103.05 28.9171 103.008 30.2155 102.749 31.0153C101.346 35.1907 99.7571 39.2935 98.303 43.4482C97.1293 46.8239 96.0283 50.2412 94.865 53.7415C94.7092 54.2297 95.1974 54.6763 95.6648 54.4686C97.2124 53.8038 98.7185 53.1287 100.266 52.5886C105.595 50.7397 110.954 48.9532 116.334 47.2394C116.906 47.0628 117.57 47.2082 118.235 47.3121C118.536 47.364 118.755 47.6341 118.734 47.9353C118.682 48.5897 118.661 49.2544 118.401 49.8049C115.618 55.528 112.086 60.7941 108.43 65.9875C108.087 66.4757 107.755 66.9638 107.402 67.504C107.194 67.8156 107.319 68.2414 107.672 68.3868C109.095 68.9685 110.518 69.4878 111.827 70.1941C116.085 72.4896 120.281 74.8889 124.509 77.2467C125.776 77.953 127.116 78.5451 128.3 79.3656C129.775 80.3939 129.567 82.1181 127.853 82.8037C125.132 83.9047 122.38 84.9641 119.565 85.8262C115.005 87.1869 110.435 88.4021 105.636 89.742ZM61.3469 91.3104C62.7387 91.4247 63.7463 90.6353 64.5149 89.3473C70.0822 80.0096 75.6806 70.6927 81.2376 61.3446C81.9127 60.2124 82.5047 59.0076 82.9514 57.7716C83.3149 56.7744 82.9929 55.9331 81.7984 55.6111C80.8013 55.3411 79.8457 54.9567 78.8486 54.6659C77.3321 54.2089 75.9091 54.5517 74.7458 55.5488C73.8733 56.2966 72.9905 57.138 72.4607 58.1351C68.9085 64.7515 65.4081 71.4094 61.9805 78.0985C60.5367 80.9237 59.1761 83.8112 58.0128 86.761C57.0052 89.285 58.4594 91.2066 61.3469 91.3104ZM53.3803 58.6856C53.8165 58.6856 54.0969 59.1322 53.9204 59.5269C52.8817 61.7497 51.7807 63.9205 50.9601 66.1952C50.0565 68.6777 49.4125 71.264 48.862 73.8503C48.5089 75.4914 49.5787 76.9351 51.1263 77.4441C52.3935 77.8596 53.9204 77.226 54.7721 75.9068C55.0006 75.5433 55.2187 75.1694 55.3641 74.7643C57.213 69.519 59.9447 64.6995 62.5414 59.8074C63.3308 58.3117 63.954 56.6706 64.3695 55.0191C65.0446 52.3497 63.3204 50.0854 60.5679 49.9815C57.1403 49.8568 53.7022 49.8153 50.2746 49.9296C46.712 50.0542 45.237 51.7265 45.0812 55.3307C44.9878 57.3976 46.3173 58.7271 48.3842 58.696C49.9942 58.6752 51.6353 58.6856 53.3803 58.6856ZM87.4696 79.0333C87.9059 79.0125 88.2175 79.4695 88.0305 79.8746C86.9295 82.2843 85.8181 84.4759 85.0079 86.7714C84.1043 89.3473 83.4707 92.0271 82.9618 94.7069C82.6709 96.2337 83.7615 97.6048 85.091 97.9995C86.5556 98.4357 88.0097 97.8645 88.8614 96.483C89.1107 96.0779 89.3392 95.6625 89.495 95.2158C91.3231 89.9082 94.0964 85.0472 96.6619 80.0823C97.5759 78.3166 98.1784 76.3327 98.5731 74.38C99.0405 72.0949 97.9914 70.7239 95.6855 70.62C91.884 70.4538 88.0617 70.4123 84.2601 70.5473C80.6871 70.6719 79.2745 72.2299 79.0356 75.7926C78.8901 78.005 80.2404 79.376 82.4528 79.2618C84.0628 79.1683 85.6935 79.106 87.4696 79.0333Z'
                                    fill='#14133A'
                                />
                            </svg>
                            <div>{t(`row.point_4`)}</div>
                        </div>
                    </BulletPoints>
                    <AboutVideoSubsection>
                        <h2
                            style={{
                                width: '100%',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                color: theme`colors.primary.dark`,
                            }}
                        >
                            {t(`aboutVideoSubsection.heading`)}
                        </h2>
                        <h3>{t(`aboutVideoSubsection.subheading`)}</h3>
                        <div className='aboutVideoSubsection__videoDiv'>
                            <div className='aboutVideoSubsection__videoDiv__confettiDiv'>
                                <svg width='256' height='109' viewBox='0 0 256 109' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                    <path
                                        d='M204 7.57535C204 6.18883 204.217 4.87402 204.699 3.60703C206.386 -0.648167 210.484 -1.24581 213.281 2.38784C214.486 3.9417 215.571 5.639 216.559 7.3363C219.5 12.3087 222.393 17.2571 226.732 21.2254C230.131 24.3332 234.036 25.9827 238.616 26.0783C241.774 26.1261 244.932 25.9827 248.041 26.7954C250.235 27.3692 252.284 28.1102 253.947 29.688C257.057 32.6523 256.623 36.4055 252.718 38.1506C247.921 40.3021 242.907 41.6169 237.531 40.7085C228.226 39.1307 219.813 35.5449 213.449 28.4927C208.17 22.5881 204.94 15.512 204 7.57535Z'
                                        fill='#FAD668'
                                    />
                                    <path
                                        d='M51.9918 89.8406C52.0443 90.9614 51.8605 92.6958 50.994 94.2969C49.5761 96.992 47.1342 97.7659 44.5348 96.1915C42.3555 94.8839 40.7013 92.9627 39.2834 90.8813C34.8197 84.317 30.6448 77.5658 25.5772 71.4284C21.9275 67.0255 17.6476 63.3698 12.9739 60.1677C8.72025 57.2858 4.44036 54.4306 1.44706 50.0543C0.291753 48.3465 -0.522214 46.5854 0.396781 44.4239C1.52583 41.7822 3.75768 40.6615 7.2236 41.0884C12.5538 41.7555 17.28 43.9703 21.77 46.7988C34.1108 54.6173 43.3007 65.3711 49.6286 78.6332C51.1778 81.9154 52.018 85.4644 51.9918 89.8406Z'
                                        fill='#FF3C87'
                                    />
                                    <path
                                        d='M160 65.269C160.025 70.8714 158.81 76.0663 154.932 80.4208C151.545 84.2152 147.356 86.3797 142.289 87.0673C138.255 87.602 134.144 87.4238 130.137 88.3405C123.621 89.8175 120.751 92.7969 119.665 99.367C119.355 101.277 118.915 103.136 118.114 104.893C117.105 107.083 115.761 108.865 113.02 108.993C110.202 109.12 108.34 107.541 107.099 105.377C105.134 101.939 104.617 98.1956 105.264 94.2485C106.453 86.9399 109.866 80.9047 115.942 76.5756C119.122 74.2837 122.897 73.5962 126.879 73.9781C130.679 74.3601 134.377 74.08 137.919 72.4248C140.789 71.1006 142.392 68.8596 143.064 65.9566C143.685 63.3082 144.021 60.6089 144.564 57.935C144.978 55.8214 145.314 53.6314 146.839 51.9253C149.011 49.5061 152.657 49.3533 155.061 51.5433C158.345 54.5482 159.974 59.0555 160 65.269Z'
                                        fill='#36F0C7'
                                    />
                                    <path
                                        d='M216 67.5735C216.051 72.4024 211.558 76.9215 206.549 76.999C202.108 77.0764 198.105 72.8156 198.002 67.935C197.899 63.4934 202.082 58.9743 206.265 59.0001C211.068 59.0259 215.948 63.3384 216 67.5735Z'
                                        fill='#FF3C87'
                                    />
                                </svg>
                            </div>
                            <div className='aboutVideoSubsection__videoDiv__iframeContainer'>
                                <iframe
                                    src={
                                        router.locale === 'pl'
                                            ? 'https://player.vimeo.com/video/522358318?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479'
                                            : 'https://player.vimeo.com/video/522356054?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479'
                                    }
                                    frameBorder='0'
                                    allow='autoplay; fullscreen; picture-in-picture'
                                    allowFullScreen
                                    title={t(`aboutVideoSubsection.heading`)}
                                ></iframe>
                            </div>
                        </div>
                    </AboutVideoSubsection>
                </BottomSection>
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

export default AboutPage;
