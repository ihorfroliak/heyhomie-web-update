/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import { useTranslations } from 'next-intl';

import tw, { css, styled, theme } from 'twin.macro';

import { servicesConfigSwitch, servicesDetailsSwitch } from '../../../../api/servicesConfig';

const MissionDetailsContainer = styled.div``;

const SectionHeading = styled.div`
    font-size: 10px;
    line-height: 10px;
    color: #14133a;

    text-transform: uppercase;

    margin-bottom: 4px;
`;
const SectionBody = styled.div`
    font-weight: bold;
    font-size: 12px;
    line-height: 14px;
    color: #14133a;

    margin-bottom: 8px;
`;

const MissionDataDetailsSwitch = ({ service, service_type }) => {
    const t = useTranslations('AccountPage.IndexPage.MissionsComponent.missions.serviceConfigDetails');

    const namesAndSections = servicesDetailsSwitch(service_type);

    const switchSection = serviceAndSection => {
        switch (serviceAndSection.name) {
            case 'cleaning': {
                return (
                    <>
                        {serviceAndSection.sections.map((section, i) => (
                            <div key={i}>
                                <SectionHeading>{t(`cleaning.${section.name}`)}</SectionHeading>
                                <SectionBody>
                                    {section.name === 'options' ? (
                                        section.options.map((o, i) => {
                                            if (service[o] && service[o] !== 0) {
                                                return <span key={i}>{t(`cleaning.${o}`, { value: service[o] })}</span>;
                                            }
                                        })
                                    ) : section.name === 'plan' ? (
                                        <span>{t(`cleaning.plans.${service[section.name]}`)}</span>
                                    ) : (
                                        <span>{service[section.name]}m2</span>
                                    )}
                                </SectionBody>
                            </div>
                        ))}
                    </>
                );
            }
            case 'flowers': {
                return (
                    <>
                        {serviceAndSection.sections.map((section, i) => (
                            <div key={i}>
                                <SectionHeading>{t(`flowers.${section.name}`)}</SectionHeading>
                                <SectionBody>
                                    {section.name === 'plan' ? <span>{t(`flowers.${service[section.name]}`)}</span> : <span>{service[section.name]}</span>}
                                </SectionBody>
                            </div>
                        ))}
                    </>
                );
            }
            case 'nails': {
                return (
                    <>
                        {serviceAndSection.sections.map((section, i) => (
                            <div key={i}>
                                <SectionHeading>{t(`nails.${section.name}`)}</SectionHeading>
                                <SectionBody>
                                    {section.name === 'options' ? (
                                        section.options.map((o, i) => {
                                            if (service[o]) {
                                                return <span key={i}>{t(`nails.${o}`)}</span>;
                                            }
                                        })
                                    ) : (
                                        <span>{service[section.name]}</span>
                                    )}
                                </SectionBody>
                            </div>
                        ))}
                    </>
                );
            }
            case 'massage': {
                return (
                    <>
                        {serviceAndSection.sections.map((section, i) => (
                            <div key={i}>
                                <SectionHeading>{t(`massage.${section.name}`)}</SectionHeading>
                                <SectionBody>
                                    {section.name === 'quantity' ? (
                                        <span>{service[section.name]}</span>
                                    ) : section.name === 'massage_duration' ? (
                                        <span>{service[section.name]}min</span>
                                    ) : (
                                        <span>{t(`massage.${service[section.name]}`)}</span>
                                    )}
                                </SectionBody>
                            </div>
                        ))}
                    </>
                );
            }
            case 'laundry': {
                return (
                    <>
                        {serviceAndSection.sections.map((section, i) => {
                            if (section.options.filter(o => service[o] !== 0).length > 0) {
                                return (
                                    <div key={i}>
                                        <SectionHeading>{t(`laundry.${section.name}`)}</SectionHeading>
                                        <SectionBody>
                                            {section.name === 'home' || section.name === 'clothes' ? (
                                                section.options.map((o, i) => {
                                                    if (service[o] && service[o] !== 0) {
                                                        return <span key={i}>{t(`laundry.${o}`, { value: service[o] })}</span>;
                                                    }
                                                })
                                            ) : (
                                                <span>{service[section.name]}</span>
                                            )}
                                        </SectionBody>
                                    </div>
                                );
                            }
                        })}
                    </>
                );
            }
            case 'carpet': {
                return (
                    <>
                        {serviceAndSection.sections.map((section, i) => (
                            <div key={i}>
                                <SectionHeading>{t(`carpet.${section.name}`)}</SectionHeading>
                                <SectionBody>
                                    {section.name === 'carpets_total_size' ? (
                                        <span
                                            style={{
                                                position: 'relative',
                                            }}
                                        >
                                            {service[section.name]}
                                            <span
                                                style={{
                                                    position: 'relative',
                                                    bottom: '4px',
                                                    fontSize: '8px',
                                                }}
                                            >
                                                m2
                                            </span>
                                        </span>
                                    ) : (
                                        <span>{service[section.name]}</span>
                                    )}
                                </SectionBody>
                            </div>
                        ))}
                    </>
                );
            }
            default: {
                return <div>Staging...</div>;
            }
        }
    };

    return <MissionDetailsContainer>{switchSection(namesAndSections)}</MissionDetailsContainer>;
};

export default MissionDataDetailsSwitch;
