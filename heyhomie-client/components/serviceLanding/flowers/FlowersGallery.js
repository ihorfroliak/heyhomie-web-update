import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

import tw, { css, styled, theme } from 'twin.macro';

import ScrollMenu from 'react-horizontal-scrolling-menu';

const FlowerCardContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    background: #ffffff;
    box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.05);
    border-radius: 4px;

    padding: 10px;
    width: 250px;
    height: 250px;

    img {
        width: 230px;
        height: 230px;

        user-drag: none;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-drag: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }
`;

export const FlowerCard = ({ pictureURL }) => {
    return (
        <FlowerCardContainer>
            <img src={pictureURL} />
        </FlowerCardContainer>
    );
};

const FlowersGalleryContainer = styled.div`
    width: 100%;

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
`;

const Menu = (pictures, selected) =>
    pictures.map(pictureURL => {
        return <FlowerCard pictureURL={pictureURL} />;
    });

const FlowersGallery = ({ flowers }) => {
    const [selected, setSelected] = useState('');

    const menu = Menu(flowers, selected);

    const onSelect = key => {
        setSelected({ selected: key });
    };

    return (
        <FlowersGalleryContainer>
            <ScrollMenu data={menu} selected={selected} onSelect={onSelect} wheel={false} />
        </FlowersGalleryContainer>
    );
};

export default FlowersGallery;
