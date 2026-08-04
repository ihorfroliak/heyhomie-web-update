import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { theme } from 'twin.macro';
import { useTranslations } from 'next-intl';

import { cityDistricts, seoCitiesOrder, getCitySeoForms } from './cityDistricts';
import CleaningSeoJsonLd from './CleaningSeoJsonLd';

const Section = styled.section`
    background-color: #ffffff;
    color: ${theme`colors.primary.dark`};

    padding: 56px 24px 72px;

    @media (min-width: 1024px) {
        padding: 96px 128px;
    }
`;

const Inner = styled.div`
    max-width: 1200px;
    margin: 0 auto;
`;

const Heading = styled.h2`
    font-family: 'Manrope';
    font-weight: bold;
    text-transform: uppercase;

    font-size: 28px;
    line-height: 36px;

    margin-bottom: 24px;

    @media (min-width: 1024px) {
        font-size: 40px;
        line-height: 50px;

        margin-bottom: 32px;
    }
`;

const Lead = styled.p`
    font-size: 16px;
    line-height: 27px;

    margin-bottom: 16px;

    &:first-of-type {
        font-weight: 500;
    }

    @media (min-width: 1024px) {
        font-size: 18px;
        line-height: 30px;
    }
`;

const SubHeading = styled.h3`
    font-family: 'Manrope';
    font-weight: bold;
    text-transform: uppercase;

    font-size: 22px;
    line-height: 28px;

    margin-top: 56px;
    margin-bottom: 20px;

    @media (min-width: 1024px) {
        font-size: 28px;
        line-height: 35px;

        margin-top: 72px;
    }
`;

const TrustGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 14px;

    margin-top: 8px;

    @media (min-width: 768px) {
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 20px;
    }
`;

const TrustCard = styled.div`
    background-color: #f6fbff;
    border-radius: 12px;

    padding: 20px 18px;
    text-align: center;

    .trust-icon {
        font-size: 30px;
        line-height: 1;
        margin-bottom: 10px;
    }

    h4 {
        font-family: 'Manrope';
        font-weight: bold;

        font-size: 16px;
        line-height: 21px;

        margin-bottom: 6px;
    }

    p {
        font-size: 13px;
        line-height: 19px;
        opacity: 0.75;
    }
`;

const CardsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 16px;

    @media (min-width: 768px) {
        grid-template-columns: 1fr 1fr;
        grid-gap: 24px;
    }
`;

const ServicesGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 16px;

    @media (min-width: 640px) {
        grid-template-columns: 1fr 1fr;
    }

    @media (min-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 20px;
    }
`;

const PlanCard = styled.div`
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0px 8px 15px 0px rgba(67, 108, 203, 0.2);

    padding: 24px;

    .card-icon {
        font-size: 28px;
        line-height: 1;
        margin-bottom: 12px;
    }

    h4 {
        font-family: 'Manrope';
        font-weight: bold;

        font-size: 20px;
        line-height: 26px;

        margin-bottom: 12px;

        color: #eb4e87;
    }

    p {
        font-size: 15px;
        line-height: 25px;
    }
`;

const DistrictsIntro = styled.p`
    font-size: 16px;
    line-height: 27px;

    margin-bottom: 20px;
`;

const DistrictGrid = styled.ul`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    list-style: none;
    padding: 0;
    margin: 0;
`;

const DistrictChip = styled.li`
    background-color: #f6fbff;
    color: ${theme`colors.primary.dark`};
    border-radius: 20px;

    padding: 8px 16px;

    font-size: 14px;
    line-height: 18px;
    font-weight: 500;
`;

const Footnote = styled.p`
    font-size: 14px;
    line-height: 22px;
    opacity: 0.7;

    margin-top: 20px;
`;

const FaqList = styled.div`
    border-top: 1px solid #e7ebf6;
`;

const FaqItem = styled.div`
    border-bottom: 1px solid #e7ebf6;
`;

const FaqQuestion = styled.button`
    width: 100%;
    background: none;
    border: none;
    cursor: pointer;

    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    text-align: left;

    padding: 20px 4px;

    font-family: 'Manrope';
    font-weight: bold;
    font-size: 17px;
    line-height: 24px;
    color: ${theme`colors.primary.dark`};

    &:focus {
        outline: none;
    }

    .faq-chevron {
        flex-shrink: 0;
        transition: transform 0.2s ease-in-out;
        font-size: 20px;
        color: #eb4e87;
        transform: rotate(${props => (props.isOpen ? '45deg' : '0deg')});
    }

    @media (min-width: 1024px) {
        font-size: 19px;
    }
`;

const FaqAnswer = styled.div`
    overflow: hidden;
    max-height: ${props => (props.isOpen ? '1400px' : '0')};
    transition: max-height 0.35s ease-in-out;

    p {
        font-size: 15px;
        line-height: 25px;
        padding: 0 4px 16px;

        &:last-child {
            padding-bottom: 20px;
        }

        strong {
            font-weight: 700;
        }

        a {
            color: #eb4e87;
            font-weight: 700;
            border-bottom: 2px solid #77ecc8;
        }
    }

    p.faq-note {
        background-color: #f6fbff;
        border-left: 3px solid #77ecc8;
        border-radius: 8px;

        margin: 0 4px 16px;
        padding: 12px 16px;

        font-size: 14px;
        line-height: 22px;
    }
`;

const CitiesLinks = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 12px;

    margin-top: 20px;
`;

const CityLink = styled.a`
    display: inline-block;

    border: 2px solid #77ecc8;
    border-radius: 8px;

    padding: 10px 20px;

    font-weight: bold;
    font-size: 16px;
    color: ${theme`colors.primary.dark`};

    transition: background-color 0.2s ease-in-out;

    &:hover {
        background-color: #77ecc8;
    }
`;

const PlansCta = styled.a`
    display: inline-block;
    margin-top: 24px;

    background-color: #77ecc8;
    border-radius: 8px;

    padding: 12px 24px;

    font-weight: bold;
    font-size: 16px;
    color: ${theme`colors.primary.dark`};

    transition: opacity 0.2s ease-in-out;

    &:hover {
        opacity: 0.85;
    }
`;

const PrimaryCta = styled.a`
    display: inline-block;
    margin-top: 8px;

    background-color: #77ecc8;
    border-radius: 8px;

    padding: 15px 32px;

    font-family: 'Manrope';
    font-weight: bold;
    font-size: 17px;
    color: ${theme`colors.primary.dark`};

    box-shadow: 0px 8px 15px 0px rgba(119, 236, 200, 0.35);
    transition: transform 0.1s ease-in-out, opacity 0.2s ease-in-out;

    &:hover {
        transform: translateY(-2px);
        opacity: 0.92;
    }
`;

// FAQ answers use a tiny markdown-lite so the copy stays HTML-free in the message
// catalogue (intl-messageformat would choke on real tags): **bold**, [label](#order)
// links, and lines beginning with "» " become highlighted support-contact notes.
const inlineToNodes = (text, keyPrefix) =>
    text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((tok, i) => {
        if (/^\*\*[^*]+\*\*$/.test(tok)) {
            return <strong key={`${keyPrefix}-b${i}`}>{tok.slice(2, -2)}</strong>;
        }
        const link = tok.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
            return (
                <a key={`${keyPrefix}-a${i}`} href={link[2]}>
                    {link[1]}
                </a>
            );
        }
        return tok;
    });

const renderAnswer = answer =>
    answer.split('\n').map((line, i) => {
        const isNote = line.indexOf('» ') === 0;
        const content = isNote ? line.slice(2) : line;
        return (
            <p key={i} className={isNote ? 'faq-note' : undefined}>
                {inlineToNodes(content, i)}
            </p>
        );
    });

// Plain text for schema.org — strip the markdown-lite so JSON-LD stays clean.
const stripMarkup = answer =>
    answer
        .replace(/\n» /g, ' ')
        .replace(/\n/g, ' ')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .trim();

const TRUST_KEYS = [
    { key: 'eco', icon: '🌿' },
    { key: 'vetted', icon: '✅' },
    { key: 'pricing', icon: '🏷️' },
    { key: 'guarantee', icon: '💖' },
];

const SERVICE_KEYS = [
    { key: 'cleaning', icon: '🧹' },
    { key: 'postRenovation', icon: '🔨' },
    { key: 'windows', icon: '🪟' },
    { key: 'kitchen', icon: '🍽️' },
    { key: 'bathroom', icon: '🛁' },
    { key: 'upholstery', icon: '🛋️' },
];

const FAQ_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21'];

const CleaningSeoSection = ({ city }) => {
    const t = useTranslations('CleaningSeoSection');
    const router = useRouter();
    const isPl = router.locale === 'pl';

    const cityName = city && city.name;
    const { data, displayName, locative: cityLocative, streets } = getCitySeoForms(cityName, isPl);

    const otherCities = seoCitiesOrder.filter(c => c !== cityName);

    const [openFaq, setOpenFaq] = useState(0);

    const services = SERVICE_KEYS.map(s => ({
        icon: s.icon,
        title: t(`services.${s.key}.title`),
        body: t(`services.${s.key}.body`),
    }));

    const faqItems = FAQ_KEYS.map(n => ({
        q: t(`faq.q${n}`, { cityLocative, cityName: displayName, streets }),
        a: t(`faq.a${n}`, { cityLocative, cityName: displayName, streets }),
    }));

    // schema.org wants plain text — feed it the stripped answers, not the markdown-lite.
    const faqSchema = faqItems.map(item => ({ q: item.q, a: stripMarkup(item.a) }));

    return (
        <Section aria-label={t('intro.heading', { cityLocative })}>
            <CleaningSeoJsonLd
                cityKey={cityName}
                displayName={displayName}
                locative={cityLocative}
                locale={router.locale}
                faqItems={faqSchema}
                services={services}
            />
            <Inner>
                {/* Intro */}
                <Heading>{t('intro.heading', { cityLocative })}</Heading>
                <Lead>{t('intro.para_1', { cityLocative, cityName: displayName })}</Lead>
                <Lead>{t('intro.para_2', { cityLocative, cityName: displayName })}</Lead>
                <Lead>{t('intro.para_3', { cityLocative, cityName: displayName })}</Lead>
                <PrimaryCta href='#order'>{t('intro.cta', { cityLocative })}</PrimaryCta>

                {/* Trust signals */}
                <SubHeading>{t('trust.heading')}</SubHeading>
                <TrustGrid>
                    {TRUST_KEYS.map(item => (
                        <TrustCard key={item.key}>
                            <div className='trust-icon'>{item.icon}</div>
                            <h4>{t(`trust.${item.key}.title`)}</h4>
                            <p>{t(`trust.${item.key}.body`)}</p>
                        </TrustCard>
                    ))}
                </TrustGrid>

                {/* Standard vs general */}
                <SubHeading>{t('plans.heading')}</SubHeading>
                <CardsGrid>
                    <PlanCard>
                        <div className='card-icon'>🧽</div>
                        <h4>{t('plans.standard.title')}</h4>
                        <p>{t('plans.standard.body')}</p>
                    </PlanCard>
                    <PlanCard>
                        <div className='card-icon'>✨</div>
                        <h4>{t('plans.general.title')}</h4>
                        <p>{t('plans.general.body')}</p>
                    </PlanCard>
                </CardsGrid>
                <Link href='/cleaning' passHref>
                    <PlansCta>{t('plans.linkText')}</PlansCta>
                </Link>

                {/* Related cleaning services */}
                <SubHeading>{t('services.heading')}</SubHeading>
                <ServicesGrid>
                    {services.map((s, i) => (
                        <PlanCard key={i}>
                            <div className='card-icon'>{s.icon}</div>
                            <h4>{s.title}</h4>
                            <p>{s.body}</p>
                        </PlanCard>
                    ))}
                </ServicesGrid>

                {/* Districts */}
                {data && data.districts && data.districts.length > 0 ? (
                    <>
                        <SubHeading>{t('districts.heading')}</SubHeading>
                        <DistrictsIntro>{t('districts.subheading', { cityLocative })}</DistrictsIntro>
                        <DistrictGrid>
                            {data.districts.map((district, i) => (
                                <DistrictChip key={i}>{district}</DistrictChip>
                            ))}
                        </DistrictGrid>
                        <Footnote>{t('districts.footnote')}</Footnote>
                    </>
                ) : null}

                {/* FAQ */}
                <SubHeading>{t('faq.heading')}</SubHeading>
                <FaqList>
                    {faqItems.map((item, i) => (
                        <FaqItem key={i}>
                            <FaqQuestion isOpen={openFaq === i} aria-expanded={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                <span>{item.q}</span>
                                <span className='faq-chevron' aria-hidden='true'>
                                    +
                                </span>
                            </FaqQuestion>
                            <FaqAnswer isOpen={openFaq === i}>{renderAnswer(item.a)}</FaqAnswer>
                        </FaqItem>
                    ))}
                </FaqList>

                {/* Other cities */}
                {otherCities.length > 0 ? (
                    <>
                        <SubHeading>{t('otherCities.heading')}</SubHeading>
                        <DistrictsIntro>{t('otherCities.subheading', { cityLocative })}</DistrictsIntro>
                        <CitiesLinks>
                            {otherCities.map(c => (
                                <Link key={c} href={`/${c}`} passHref>
                                    <CityLink>{cityDistricts[c].nameNominative}</CityLink>
                                </Link>
                            ))}
                        </CitiesLinks>
                    </>
                ) : null}
            </Inner>
        </Section>
    );
};

export default CleaningSeoSection;
