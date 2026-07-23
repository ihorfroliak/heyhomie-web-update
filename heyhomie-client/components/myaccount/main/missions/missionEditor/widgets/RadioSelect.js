import { useTranslations } from 'next-intl';

import tw, { css, styled, theme } from 'twin.macro';

import RadioButton from '../../../../../ui/Radiobutton';

const StyledContainer = styled.div`
    ${props =>
        props.separated
            ? css`
                  border-bottom: solid 1px;
                  padding-bottom: 24px;
              `
            : css`
                  padding-bottom: 16px;
              `};
    padding-top: 16px;

    ${tw`
        flex flex-row flex-wrap items-center
    `};

    border-color: #e2e2eb;
`;

const StyledOption = styled.button`
    transition: 0.3s ease-in-out;
    height: 37px;
    ${tw`
        rounded-lg border-solid
        m-1
        px-4
        font-bold
    `};
    border-width: 1px;
    ${props => (props.active ? tw`text-primary-dark bg-secondary-salad border-secondary-salad ` : tw`text-primary-grey border-primary-grey`)};
    &:disabled {
        opacity: 0.2;
        cursor: default;
    }
    &:hover {
        opacity: 0.9;
    }
    &:focus {
        outline: none;
        opacity: 0.9;
    }
`;

const Option = ({ active, captionKey, onClick }) => {
    return (
        <StyledOption active={active} onClick={onClick}>
            {captionKey}
        </StyledOption>
    );
};

const RadioSelect = ({ value, onSelect, service, nameCaptionKey, descriptionCaptionKey, options, separated, config }) => {
    const t = useTranslations('CityPage.ServiceConfig');

    return (
        <>
            <StyledContainer separated={separated}>
                <div
                    className={`
                w-full flex flex-row justify-end items-center
            `}
                >
                    <div
                        className={`
                        w-8/12 h-8
                        flex flex-wrap flex-row justify-end items-end
                    `}
                    >
                        <div
                            className={`
                        text-xs text-primary-grey
                        `}
                            style={{
                                marginRight: '.5rem',
                            }}
                        >
                            {t(`onetimePriceNameCaption`)}
                        </div>
                        <div
                            className={`
                            text-xs text-primary-grey
                        `}
                            style={{
                                marginRight: '1rem',
                                marginLeft: '.5rem',
                                position: 'relative',
                            }}
                        >
                            {t(`recurrentPriceNameCaption`)}
                        </div>
                    </div>
                </div>
                <div className={`w-full`}>
                    {options.map((option, index, array) => (
                        <div
                            key={option.value}
                            className={`flex flex-row justify-end items-center`}
                            style={{
                                paddingBottom: index !== array.length - 1 ? '16px' : '0px',
                            }}
                        >
                            <div className={`w-6/12`}>
                                <RadioButton
                                    label={
                                        <div
                                            style={{
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'row',
                                                flexWrap: 'wrap',
                                                alignItems: 'center',
                                                justifyContent: 'flex-start',
                                            }}
                                        >
                                            <div style={{ fontWeight: 'bold', width: '100%', textAlign: 'left' }}>{t(`${option.titleCaptionKey}`)}</div>
                                            {option.subtitleCaptionKey ? (
                                                <div className={`text-primary-grey`} style={{ fontSize: '14px', width: '100%' }}>
                                                    {t(`${option.subtitleCaptionKey}`)}
                                                </div>
                                            ) : null}
                                        </div>
                                    }
                                    checked={value === option.value}
                                    onChange={() => onSelect(option.value)}
                                />
                            </div>
                            <div className={`w-6/12 flex flex-wrap flex-row justify-end items-center`}>
                                <div
                                    className={`
                                        font-bold text-center
                                        ${config && config.frequency === 'once' ? `text-primary-dark` : `text-primary-grey`}
                                    `}
                                    style={{
                                        fontSize: '18px',
                                        width: '50px',
                                        marginRight: '.5rem',
                                    }}
                                >
                                    {t(`${option.onetimeCaptionKey}`)}
                                </div>
                                <div
                                    className={`
                                    w-7/12
                                    font-bold text-center
                                        ${config && config.frequency !== 'once' ? `text-primary-dark` : `text-primary-grey`}
                                    `}
                                    style={{
                                        fontSize: '18px',
                                        width: '50px',
                                        marginRight: '1rem',
                                        marginLeft: '.5rem',
                                    }}
                                >
                                    {t(`${option.recurrentCaptionKey}`)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </StyledContainer>
        </>
    );
};

export default RadioSelect;
