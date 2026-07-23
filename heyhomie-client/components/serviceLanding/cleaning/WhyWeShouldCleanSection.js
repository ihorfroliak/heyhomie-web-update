import React from 'react';
import styled from 'styled-components';
import { theme } from 'twin.macro';
import { useTranslations } from 'next-intl';
// import { useTranslations } from 'next-intl';

const WhyWeShouldCleanSectionContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

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

    max-width: 1200px;
    min-height: 400px;

    padding: 0 20px;

    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;

    @media (min-width: 1024px) {
        justify-content: space-around;
    }
`;

const BlockDiv = styled.div`
    max-width: 560px;
    min-height: 160px;

    background-color: #fff;
    box-shadow: 0px 8px 15px 0px rgba(67, 108, 203, 0.2);
    border-radius: 8px;

    display: flex;
    justify-content: space-around;
    align-items: center;

    padding: 20px;
    margin-top: 20px;

    div:nth-child(1) > svg {
        width: 60px;
        height: 60px;
        margin: 0 10px 0 0;
    }

    div:nth-child(2) {
        max-width: 450px;

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
            line-height: 25px;
        }
    }

    @media (min-width: 600px) {
        width: 560px;
    }
`;

const blocksDescription = ['block_1', 'block_2', 'block_3', 'block_4'];

const WhyWeShouldCleanSection = () => {
    const t = useTranslations('ServicesLandings.CleaningLanding.WhyWeShouldClean');

    return (
        <WhyWeShouldCleanSectionContainer>
            <h2>{t(`heading`)}</h2>
            <BlocksDiv>
                {blocksDescription.map(block => (
                    <BlockDiv key={block}>
                        <div>
                            {/* <svg className='bi bi-shield' fill='currentColor' height='60' width='60' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'>
                            <path d='M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z' />
                        </svg> */}
                        </div>
                        <div>
                            <h2>{t(`${block}.heading`)}</h2>
                            <p>{t(`${block}.para`)}</p>
                        </div>
                    </BlockDiv>
                ))}
            </BlocksDiv>
        </WhyWeShouldCleanSectionContainer>
    );
};

export default WhyWeShouldCleanSection;
