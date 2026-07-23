import React from 'react';
import styled from 'styled-components';
import { theme } from 'twin.macro';
import { useTranslations } from 'next-intl';
import Image from 'next/dist/client/image';

const OurAdvantagesSectionContainer = styled.div`
    & > h2 {
        text-transform: uppercase;
        font-family: Quicksand;
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

const BlocksDiv = styled.div`
    color: ${theme`colors.primary.dark`};

    min-height: 400px;

    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;

    @media (min-width: 1024px) {
        justify-content: space-around;
    }
`;

const Block_1 = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;

    width: 360px;
    height: 400px;

    @media (min-width: 1024px) {
        width: 360px;
    }

    svg {
        height: 200px;
    }

    div {
        height: 200px;

        text-align: center;

        position: relative;
        top: 36px;

        h2,
        h3 {
            font-family: 'Quicksand';
            font-weight: bold;
            text-transform: uppercase;
        }
        h2 {
            font-size: 35px;
            line-height: 55px;
        }
        h3 {
            font-size: 30px;
            line-height: 37px;
        }
        p {
            font-weight: bold;
            font-size: 16px;
            line-height: 22px;
        }
    }
`;

const Block_2 = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;

    width: 450px;

    @media (min-width: 1024px) {
        width: 450px;
    }

    svg {
        height: 200px;

        position: relative;
    }

    div {
        height: 200px;

        text-align: center;

        position: relative;

        h2,
        h3 {
            font-family: 'Quicksand';
            font-weight: bold;
            text-transform: uppercase;
        }
        h2 {
            font-size: 45px;
            line-height: 55px;
        }
        h3 {
            font-size: 27px;
            line-height: 34px;
        }
        p {
            font-weight: bold;
            font-size: 16px;
            line-height: 22px;
        }
    }
`;

const Block_3 = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;

    width: 360px;

    @media (min-width: 1024px) {
        width: 360px;
    }

    svg {
        height: 200px;
    }

    div {
        height: 200px;
        text-align: center;

        position: relative;
        top: 36px;

        h2,
        h3 {
            font-family: 'Quicksand';
            font-weight: bold;
            text-transform: uppercase;
        }
        h2 {
            font-size: 35px;
            line-height: 55px;
        }
        h3 {
            font-size: 30px;
            line-height: 37px;
        }
        p {
            font-weight: bold;
            font-size: 16px;
            line-height: 22px;
        }
    }
`;

const OurAdvantagesSection = () => {
    const t = useTranslations('ServicesLandings.CleaningLanding.OurAdvantages');

    return (
        <OurAdvantagesSectionContainer>
            <h2>{t(`heading`)}</h2>
            <BlocksDiv>
                <Block_1>
                    <Image src='/v1/icon1_1.svg' width={200} height={160} />
                    <div>
                        <h3>{t(`blocks.block_1.heading_1`)}</h3>
                        <h2>{t(`blocks.block_1.heading_2`)}</h2>
                        <p>{t(`blocks.block_1.para`)}</p>
                    </div>
                </Block_1>
                <Block_2>
                    <Image src='/v2/icon2_2.svg' width={200} height={160} />
                    <div>
                        <h2>{t(`blocks.block_2.heading_1`)}</h2>
                        <h3>{t(`blocks.block_2.heading_2`)}</h3>
                        <h2>{t(`blocks.block_2.heading_3`)}</h2>
                        <p>{t(`blocks.block_2.para`)}</p>
                    </div>
                </Block_2>
                <Block_3>
                    <Image src='/v1/icon3_1.svg' width={200} height={160} />
                    <div>
                        <h3>{t(`blocks.block_3.heading_1`)}</h3>
                        <h2>{t(`blocks.block_3.heading_2`)}</h2>
                        <p>{t(`blocks.block_3.para`)}</p>
                    </div>
                </Block_3>
            </BlocksDiv>
        </OurAdvantagesSectionContainer>
    );
};

export default OurAdvantagesSection;
