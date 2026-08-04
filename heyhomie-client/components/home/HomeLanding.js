import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { theme } from 'twin.macro';
import { useTranslations } from 'next-intl';

import { cityDistricts, seoCitiesOrder } from '../serviceLanding/cleaning/cityDistricts';

const Wrapper = styled.main`
    min-height: 100vh;
    background-color: #ffffff;
    color: ${theme`colors.primary.dark`};
`;

const Hero = styled.section`
    text-align: center;
    padding: 64px 24px 32px;

    h1 {
        font-family: 'Manrope';
        font-weight: bold;
        text-transform: uppercase;

        font-size: 32px;
        line-height: 40px;

        max-width: 820px;
        margin: 0 auto 16px;
    }

    p {
        font-size: 16px;
        line-height: 26px;
        max-width: 620px;
        margin: 0 auto;
    }

    @media (min-width: 1024px) {
        padding: 96px 24px 40px;

        h1 {
            font-size: 52px;
            line-height: 62px;
        }

        p {
            font-size: 18px;
            line-height: 30px;
        }
    }
`;

const Section = styled.section`
    max-width: 1100px;
    margin: 0 auto;
    padding: 32px 24px 48px;
`;

const SubHeading = styled.h2`
    font-family: 'Manrope';
    font-weight: bold;
    text-transform: uppercase;
    text-align: center;

    font-size: 26px;
    line-height: 33px;

    margin-bottom: 8px;

    @media (min-width: 1024px) {
        font-size: 34px;
        line-height: 42px;
    }
`;

const Intro = styled.p`
    text-align: center;
    font-size: 15px;
    line-height: 24px;
    margin-bottom: 28px;
`;

const CityGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;

    @media (min-width: 768px) {
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
    }
`;

const CityCard = styled.a`
    display: flex;
    align-items: center;
    justify-content: center;

    background-color: #f6fbff;
    border: 2px solid transparent;
    border-radius: 12px;

    padding: 22px 16px;

    font-family: 'Manrope';
    font-weight: bold;
    font-size: 18px;
    color: ${theme`colors.primary.dark`};

    transition: border-color 0.2s ease-in-out, transform 0.1s ease-in-out;

    &:hover {
        border-color: #77ecc8;
        transform: translateY(-2px);
    }
`;

const ValueRow = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;

    margin-top: 8px;

    @media (min-width: 768px) {
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
    }
`;

const ValueCard = styled.div`
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0px 8px 15px 0px rgba(67, 108, 203, 0.12);

    padding: 20px 16px;
    text-align: center;

    .value-icon {
        font-size: 28px;
        margin-bottom: 8px;
    }

    h3 {
        font-family: 'Manrope';
        font-weight: bold;
        font-size: 16px;
        line-height: 21px;
        margin-bottom: 4px;
    }

    p {
        font-size: 13px;
        line-height: 19px;
        opacity: 0.75;
    }
`;

const CtaLink = styled.a`
    display: inline-block;
    margin-top: 24px;

    background-color: #77ecc8;
    border-radius: 8px;

    padding: 14px 28px;

    font-weight: bold;
    font-size: 16px;
    color: ${theme`colors.primary.dark`};

    transition: opacity 0.2s ease-in-out;

    &:hover {
        opacity: 0.85;
    }
`;

const CtaWrap = styled.div`
    text-align: center;
`;

const VALUE_KEYS = [
    { key: 'eco', icon: '🌿' },
    { key: 'vetted', icon: '✅' },
    { key: 'pricing', icon: '🏷️' },
    { key: 'guarantee', icon: '💖' },
];

const capitalize = str => (str ? str.charAt(0).toUpperCase() + str.slice(1) : '');

const cityDisplayName = name => (cityDistricts[name] ? cityDistricts[name].nameNominative : capitalize(name));

const HomeLanding = ({ cities = [] }) => {
    const t = useTranslations('IndexPage.landing');
    const router = useRouter();

    // Order known SEO cities first (Krakow priority), then any extra cities from the API.
    const ordered = [
        ...seoCitiesOrder.filter(c => cities.some(city => city.name === c)),
        ...cities.map(city => city.name).filter(name => !seoCitiesOrder.includes(name)),
    ];

    const firstCity = ordered[0] || (cities[0] && cities[0].name);

    return (
        <Wrapper>
            <Hero>
                <h1>{t('hero.h1')}</h1>
                <p>{t('hero.subtitle')}</p>
                {firstCity ? (
                    <CtaWrap>
                        <Link href={`/${firstCity}`} passHref>
                            <CtaLink>{t('hero.cta')}</CtaLink>
                        </Link>
                    </CtaWrap>
                ) : null}
            </Hero>

            <Section>
                <SubHeading>{t('cityPicker.heading')}</SubHeading>
                <Intro>{t('cityPicker.subheading')}</Intro>
                <CityGrid>
                    {ordered.map(name => (
                        <Link key={name} href={`/${name}`} passHref>
                            <CityCard>{cityDisplayName(name)}</CityCard>
                        </Link>
                    ))}
                </CityGrid>
            </Section>

            <Section style={{ paddingTop: 0 }}>
                <SubHeading>{t('value.heading')}</SubHeading>
                <Intro>{t('value.subheading')}</Intro>
                <ValueRow>
                    {VALUE_KEYS.map(item => (
                        <ValueCard key={item.key}>
                            <div className='value-icon'>{item.icon}</div>
                            <h3>{t(`value.${item.key}.title`)}</h3>
                            <p>{t(`value.${item.key}.body`)}</p>
                        </ValueCard>
                    ))}
                </ValueRow>
                <CtaWrap>
                    <Link href='/cleaning' passHref>
                        <CtaLink>{t('value.cta')}</CtaLink>
                    </Link>
                </CtaWrap>
            </Section>
        </Wrapper>
    );
};

export default HomeLanding;
