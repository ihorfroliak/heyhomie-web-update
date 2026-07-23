import React from 'react';
import { useTranslations } from 'next-intl';

import tw, { css, styled, theme } from 'twin.macro';
import { PrimaryButtonFull } from '../ui/Buttons';

const HowWeSelectHomiesSectionContainer = styled.div`
    position: relative;

    background-color: #ffffff;
    box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.05);

    padding-bottom: 48px;

    @media (min-width: 1024px) {
        padding-bottom: 80px;
    }

    h2 {
        color: #14133a;

        text-align: center;

        font-family: Quicksand;
        font-style: normal;
        font-weight: bold;

        font-size: 32px;
        line-height: 36px;

        padding-top: 48px;
        margin-bottom: 32px;

        white-space: pre-line;

        @media (min-width: 1024px) {
            font-size: 48px;
            line-height: 60px;

            padding-top: 80px;
            margin-bottom: 48px;

            white-space: normal;
        }
    }

    p {
        color: #14133a;

        text-align: center;

        font-size: 14px;
        line-height: 24px;

        padding-left: 24px;
        padding-right: 24px;

        margin-bottom: 1rem;

        @media (min-width: 1024px) {
            font-size: 18px;
            line-height: 24px;

            padding-left: initial;
            padding-right: initial;

            margin-left: auto;
            margin-right: auto;

            max-width: 800px;
        }
    }

    .howWeSelectHomiesSection__svgDiv {
        position: absolute;

        right: 0;
        bottom: 16px;

        width: 64px;
        height: 64px;

        svg:first-child {
            position: absolute;

            left: 8px;
        }

        svg:last-child {
            position: absolute;

            right: 2px;
            bottom: 0px;
        }

        @media (min-width: 1024px) {
            right: 30vw;
            bottom: 32px;

            transform: scale(1.5);
        }
    }
`;

const HowWeSelectHomiesSection = ({ handleClick }) => {
    // UI translations for the component
    const t = useTranslations('ServicesLandings.common.howWeSelectHomies');

    return (
        <HowWeSelectHomiesSectionContainer>
            <h2>{t(`heading`)}</h2>
            <p>{t(`para_1`)}</p>
            <p>{t(`para_2`)}</p>
            <PrimaryButtonFull
                onClick={() => handleClick()}
                style={{
                    display: 'block',
                    width: '220px',
                    height: '48px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}
            >
                Go
            </PrimaryButtonFull>
            <div className='howWeSelectHomiesSection__svgDiv'>
                <svg width='33' height='48' viewBox='0 0 33 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                        d='M32.1628 9.95266C32.3579 11.7836 32.202 13.7226 31.8321 15.6632C30.6684 21.7885 27.4829 24.9909 21.3984 26.2333C18.7572 26.7688 16.0506 26.935 13.5383 28.0155C12.1995 28.5829 11.0234 29.3912 9.90383 30.3036C7.40207 32.3113 7.63155 34.9889 8.05291 37.7048C8.27373 39.1803 9.05342 40.4542 9.54306 41.8387C9.85947 42.7578 10.1759 43.677 10.0192 44.6994C9.61385 47.2191 7.30322 48.3484 5.05661 47.0767C3.77461 46.3428 2.79063 45.3153 2.10291 44.0349C-1.13331 38.13 -0.123183 30.1552 4.36501 25.1108C7.38513 21.7286 11.1054 19.5763 15.3887 18.292C16.7611 17.8889 18.1352 17.4451 19.4811 16.9492C23.1561 15.5997 23.0714 14.7408 23.1629 11.4751C23.2207 9.45068 23.0442 7.42699 23.1223 5.40335C23.1844 3.97997 23.5958 2.7234 24.459 1.61739C25.7422 -0.011524 28.157 -0.0265035 29.6148 1.58018C31.2079 3.35526 31.7231 5.55551 32.0517 7.82975C32.1559 8.47558 32.1266 9.1466 32.1628 9.95266Z'
                        fill='#14133A'
                    />
                </svg>
                <svg width='14' height='13' viewBox='0 0 14 13' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                        d='M12.9911 5.20359C11.5524 1.9674 8.19099 -0.189558 5.31439 0.208874C3.17655 0.499088 1.73775 1.69976 1.02215 3.78064C0.324746 5.77501 0.638958 7.60033 2.0191 9.25242C2.73508 10.1162 3.47398 10.9895 4.32527 11.735C7.54107 14.584 12.9945 11.9948 13.5193 7.85775C13.6422 6.90073 13.385 5.97312 12.9911 5.20359Z'
                        fill='#36F0C7'
                    />
                </svg>
            </div>
        </HowWeSelectHomiesSectionContainer>
    );
};

export default HowWeSelectHomiesSection;
