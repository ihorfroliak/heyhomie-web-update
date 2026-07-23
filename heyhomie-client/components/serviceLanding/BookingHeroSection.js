// React & Next methods
import React, { useEffect, useState } from 'react';

import tw, { css, styled, theme } from 'twin.macro';
import { SecondaryButtonFull } from '../ui/Buttons';

const BookingHeroSectionContainer = styled.div`
    height: 40vh;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    @media (min-width: 769px) {
        flex-direction: row;
        height: 497px;
    }
`;

const BookNowSubsection = styled.div`
    position: relative;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    padding-left: 76px;
    padding-right: 22px;

    .bookNowSubsection__svgDiv {
        position: absolute;

        transform: scale(0.5);

        left: 14px;

        .bookNowSubsection__svgDiv__svg2 {
            position: relative;
            left: 8px;
            top: 26px;
        }
    }
    .bookNowSubsection__heading {
        text-transform: uppercase;

        font-family: Quicksand;
        font-style: normal;
        font-weight: bold;
        font-size: 32px;
        line-height: 40px;

        margin-top: 36px;
        margin-bottom: 8px;
    }
    .bookNowSubsection__description {
        font-size: 16px;
        line-height: 19px;

        color: #14133a;

        margin-bottom: 24px;
    }

    @media (min-width: 769px) {
        width: 50%;

        margin-left: 8vw;

        padding-left: 100px;

        .bookNowSubsection__svgDiv {
            transform: scale(0.9);

            left: 2px;
            bottom: 10%;

            .bookNowSubsection__svgDiv__svg2 {
                position: relative;
                left: 16px;
                top: 36px;
            }
        }
        .bookNowSubsection__heading {
            font-weight: bold;
            font-size: 48px;
            line-height: 60px;

            margin-top: 120px;
            margin-bottom: 16px;
        }
        .bookNowSubsection__description {
            font-size: 26px;
            line-height: 31px;

            color: #14133a;

            white-space: pre-line;

            margin-bottom: 32px;

            max-width: 450px;
        }
    }
`;

const ImageSubsection = styled.div`
    order: -1;

    height: 260px;
    width: 100%;

    margin-top: 60px;

    display: none;
    justify-content: flex-end;

    img {
        height: 100%;
    }

    @media (min-width: 769px) {
        order: initial;
        width: 50%;

        display: flex;

        position: relative;

        img {
            width: 100%;
            height: auto;
            max-height: 467px;

            position: absolute;

            object-fit: contain;

            bottom: -120px;
        }
    }
`;

const BookingHeroSection = ({ servicePictureURL, serviceName, serviceDescription, bookNowText, handleClick }) => {
    return (
        <BookingHeroSectionContainer>
            <BookNowSubsection>
                <div className='bookNowSubsection__svgDiv'>
                    <svg className='bookNowSubsection__svgDiv__svg1' width='19' height='20' viewBox='0 0 19 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                            d='M18.9839 11.8991C18.9566 6.56176 15.4387 1.54952 10.9936 0.357421C7.69391 -0.536654 4.83051 0.249048 2.45797 2.68743C0.167252 5.01745 -0.541781 7.72677 0.412686 10.8425C0.903556 12.4681 1.4217 14.1208 2.18527 15.6651C5.04867 21.5443 14.6479 21.2734 18.0567 15.8818C18.8475 14.6355 19.0657 13.1996 18.9839 11.8991Z'
                            fill='#36F0C7'
                        />
                    </svg>
                    <svg className='bookNowSubsection__svgDiv__svg2' width='64' height='63' viewBox='0 0 64 63' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                            d='M62.9771 44.7702C62.2718 38.5174 61.7541 31.6363 57.0746 26.3264C51.5363 20.0455 44.5214 16.7189 35.958 17.3364C31.7213 17.6457 27.4904 17.4747 23.3597 16.4644C20.456 15.769 18.4659 14.0038 17.4192 11.1693C16.4901 8.5463 15.5306 5.95296 13.9071 3.65185C10.395 -1.37386 5.07742 -1.04753 2.30988 4.41301C-0.611368 10.1719 0.581461 15.8302 3.21798 21.2656C6.49897 28.0298 12.5548 31.2248 19.4662 33.1692C23.7745 34.3918 28.2788 34.2959 32.6533 35.009C39.9944 36.178 44.8778 42.0007 44.8776 49.506C44.8737 52.3279 44.5689 55.2062 45.8271 57.9232C47.0557 60.6099 49.048 62.1949 52.0171 62.4408C55.256 62.7199 57.7036 61.3984 59.3874 58.6867C61.9289 54.5444 62.5848 49.9291 62.9771 44.7702Z'
                            fill='#FAD668'
                        />
                    </svg>
                </div>
                <h1 className='bookNowSubsection__heading'>{serviceName}</h1>
                <div
                    className='bookNowSubsection__description'
                    dangerouslySetInnerHTML={{
                        __html: serviceDescription,
                    }}
                />
                <SecondaryButtonFull
                    style={{
                        height: '48px',
                        width: '220px',
                        fontWeight: 'bold',
                        marginTop: 0,
                        marginLeft: 0,
                        marginRight: 0,
                    }}
                    onClick={() => handleClick()}
                >
                    {bookNowText}
                </SecondaryButtonFull>
            </BookNowSubsection>
            <ImageSubsection>
                <img src={servicePictureURL} />
            </ImageSubsection>
        </BookingHeroSectionContainer>
    );
};

export default BookingHeroSection;
