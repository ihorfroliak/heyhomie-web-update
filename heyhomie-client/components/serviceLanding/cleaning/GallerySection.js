/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from 'twin.macro';
import { useKeenSlider } from 'keen-slider/react';
import Image from 'next/dist/client/image';
import useWindowSize from '../../../hooks/useWindowResize';

// import { useTranslations } from 'next-intl';

const GallerySectionContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    height: 562px;

    @media (min-width: 1024px) {
        height: 611px;
    }

    & > h2 {
        text-transform: uppercase;
        font-family: Manrope;
        font-style: normal;
        font-weight: bold;
        text-align: center;

        font-size: 32px;
        line-height: 40px;

        margin-top: 64px;
        margin-bottom: 58px;

        @media (min-width: 1024px) {
            font-size: 48px;
            line-height: 60px;

            margin-top: 96px;
            margin-bottom: 58px;
        }
    }
`;

const GallerySection = () => {
    // const t = useTranslations('ServicesLandings.CleaningLanding.WhyWeShouldClean');

    const windowSize = typeof window === 'undefined' ? { height: '', width: '' } : useWindowSize();

    const services = ['before_after_1', 'before_after_2', 'before_after_3', 'before_after_4', 'before_after_5', 'before_after_6'];

    useEffect(() => {}, [windowSize]);

    //! Keen-slider
    const animation = { duration: 20000, easing: t => t };

    // eslint-disable-next-line no-unused-vars
    const [keenSliderReference, instanceReference] = useKeenSlider({
        mode: 'free-snap',
        drag: true,
        renderMode: 'performance',
        loop: true,
        slides: {
            perView: 'auto',
            spacing: 50,
        },
        created(s) {
            s.moveToIdx(5, true, animation);
        },
        updated(s) {
            s.moveToIdx(s.track.details.abs + 5, true, animation);
            // console.log('Update', s);
        },
        animationEnded(s) {
            s.moveToIdx(s.track.details.abs + 5, true, animation);
            // console.log('A-End', s);
        },
    });

    return (
        <GallerySectionContainer>
            <h2>Gallery</h2>
            <div
                ref={keenSliderReference}
                className={`
                        w-full
                        cursor-grab
                        keen-slider
                    `}
            >
                {services.map(service => {
                    return (
                        <div
                            key={service}
                            className={`keen-slider__slide`}
                            style={{
                                userSelect: 'none',
                                minWidth: '400px',
                                maxWidth: '400px',
                                width: '400px',
                                height: '400px',
                                backgroundColor: 'white',
                            }}
                        >
                            <Image src={`/${service}.jpg`} width={400} height={400} draggable='false' />
                        </div>
                    );
                })}
            </div>
        </GallerySectionContainer>
    );
};

export default GallerySection;
