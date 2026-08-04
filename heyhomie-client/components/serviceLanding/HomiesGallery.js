import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

import tw, { css, styled, theme } from 'twin.macro';

import ScrollMenu from 'react-horizontal-scrolling-menu';

const HomieCardContainer = styled.div`
    position: relative;

    height: 470px;
    width: 294px;

    display: flex;
    align-items: flex-end;

    margin-left: 64px;
    margin-right: 64px;
    margin-bottom: 40px;

    img {
        width: 160px;

        position: absolute;
        top: 0;
        left: calc(50% - 80px);
    }
`;
const HomieCardDescription = styled.div`
    background-color: #ffffff;

    height: 377px;
    width: 100%;

    color: #141338;
    text-align: center;
    padding-top: 125px;

    padding-left: 40px;
    padding-right: 40px;
    padding-bottom: 40px;

    box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.05);
    border-radius: 8px;

    h3 {
        font-weight: bold;
        font-size: 28px;
        line-height: 28px;

        margin-bottom: 24px;
    }
    div {
        white-space: normal !important;
        font-size: 16px;
        line-height: 22px;
    }
`;

const HomieCard = ({ homie, translationNamespace, selected }) => {
    // UI translations for the component
    const t = useTranslations(`ServicesLandings.${translationNamespace}.homies`);

    return (
        <HomieCardContainer>
            <img src={homie.pictureURL} />
            <HomieCardDescription>
                <h3>{t(homie.nameToken)}</h3>
                <div
                    dangerouslySetInnerHTML={{
                        __html: t(homie.description),
                    }}
                />
            </HomieCardDescription>
        </HomieCardContainer>
    );
};

const HomiesGalleryContainer = styled.div`
    width: 100%;

    & > h2 {
        text-transform: uppercase;
        text-align: center;

        font-family: Manrope;
        font-style: normal;
        font-weight: bold;
        font-size: 32px;
        line-height: 40px;

        margin-top: 128px;
        margin-bottom: 56px;

        @media (min-width: 1024px) {
            font-size: 48px;
            line-height: 60px;
        }
    }

    .horizontal-menu {
        position: relative;
        width: 100%;

        @media (min-width: 1024px) {
            width: 80%;
            margin-left: auto;
            margin-right: auto;
        }

        .menu-wrapper {
            width: 100%;
        }
    }

    .scroll-menu-arrow {
        position: absolute;

        button {
            height: 32px;
            width: 32px;

            img {
                width: 100%;
                height: auto;
            }
        }
    }

    .scroll-menu-arrow:first-child {
        left: 2vw;

        z-index: 10;
    }
    .scroll-menu-arrow:last-child {
        right: 2vw;
    }
`;

const Menu = (homies, translationNamespace, selected) =>
    homies.map(homie => {
        return <HomieCard homie={homie} translationNamespace={translationNamespace} key={homie.nameToken} selected={selected} />;
    });

const HomiesGallery = ({ homiesArray, translationNamespace }) => {
    // UI translations for the component
    const t = useTranslations('ServicesLandings.common.homiesGallery');

    const [selected, setSelected] = useState('');

    const menu = Menu(homiesArray, translationNamespace, selected);

    const onSelect = key => {
        setSelected({ selected: key });
    };

    return (
        <HomiesGalleryContainer>
            <h2>{t(`heading`)}</h2>
            <ScrollMenu
                data={menu}
                selected={selected}
                onSelect={onSelect}
                wheel={false}
                arrowLeft={
                    <button>
                        <img src='/homie-gallery-arrow-left.png' />
                    </button>
                }
                arrowRight={
                    <button>
                        <img src='/homie-gallery-arrow-right.png' />
                    </button>
                }
            />
        </HomiesGalleryContainer>
    );
};

export default HomiesGallery;
