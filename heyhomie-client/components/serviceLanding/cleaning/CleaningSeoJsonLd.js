import React from 'react';
import Head from 'next/head';

const DOMAIN = 'https://www.heyhomie.io';

/**
 * Structured data (schema.org) for the cleaning offering on a city page.
 *
 * Intentionally omits aggregateRating/review markup — fabricating star ratings
 * is against Google's guidelines and risks a manual penalty. Add it later only
 * when backed by real, verifiable reviews.
 */
const CleaningSeoJsonLd = ({ cityKey, displayName, locative, locale, faqItems = [], services = [] }) => {
    const pagePath = locale === 'pl' ? `/${cityKey}` : `/${locale}/${cityKey}`;
    const pageUrl = `${DOMAIN}${pagePath}`;
    const businessId = `${DOMAIN}/#organization`;

    const graph = [
        {
            '@type': ['LocalBusiness', 'CleaningService'],
            '@id': businessId,
            name: 'HeyHomie',
            url: DOMAIN,
            image: `${DOMAIN}/homie-meta.jpg`,
            description:
                locale === 'pl'
                    ? `Profesjonalne sprzątanie mieszkań, domów i biur ${locative}. Sprawdzeni homies, ekologiczne środki, przejrzyste ceny.`
                    : `Professional apartment, house and office cleaning ${locative}. Vetted homies, eco-friendly supplies, transparent pricing.`,
            areaServed: { '@type': 'City', name: displayName },
            priceRange: '$$',
        },
        {
            '@type': 'Service',
            serviceType: locale === 'pl' ? 'Sprzątanie mieszkań i domów' : 'Apartment and house cleaning',
            name: locale === 'pl' ? `Sprzątanie ${locative}` : `Cleaning ${locative}`,
            url: pageUrl,
            provider: { '@id': businessId },
            areaServed: { '@type': 'City', name: displayName },
            hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: locale === 'pl' ? 'Usługi sprzątania' : 'Cleaning services',
                itemListElement: services.map(s => ({
                    '@type': 'Offer',
                    itemOffered: { '@type': 'Service', name: s.title, description: s.body },
                })),
            },
        },
        {
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'HeyHomie', item: locale === 'pl' ? DOMAIN : `${DOMAIN}/${locale}` },
                { '@type': 'ListItem', position: 2, name: displayName, item: pageUrl },
            ],
        },
    ];

    if (faqItems.length > 0) {
        graph.push({
            '@type': 'FAQPage',
            mainEntity: faqItems.map(item => ({
                '@type': 'Question',
                name: item.q,
                acceptedAnswer: { '@type': 'Answer', text: item.a },
            })),
        });
    }

    const data = { '@context': 'https://schema.org', '@graph': graph };

    return (
        <Head>
            <link rel='canonical' href={pageUrl} key='canonical' />
            <script type='application/ld+json' key='cleaning-jsonld' dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
        </Head>
    );
};

export default CleaningSeoJsonLd;
