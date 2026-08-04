import { useTranslations } from 'next-intl';
import { useDispatch } from 'react-redux';
import tw, { css, styled } from 'twin.macro';
import { _pushToOverlayActionStack, _toggleMenu } from '../../../../lib/slices/uiSlice';
import StyledModal from '../../../ui/ModalWindow';
import RadioButton from '../../../ui/Radiobutton';

const StyledContainer = styled.div`
    ${properties =>
        properties.separated
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
    ${properties => (properties.active ? tw`text-primary-dark bg-secondary-salad border-secondary-salad ` : tw`text-primary-grey border-primary-grey`)};
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

// eslint-disable-next-line no-unused-vars
const RadioSelect = ({ value, onSelect, service, nameCaptionKey, descriptionCaptionKey, options, separated, config }) => {
    const t = useTranslations('CityPage.ServiceConfig');

    const dispatch = useDispatch();

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
                            <button
                                style={{
                                    position: 'absolute',
                                    right: '-16px',
                                    top: '2px',
                                    width: '12px',
                                    height: '12px',
                                    outline: 'none',
                                }}
                                onClick={() => {
                                    dispatch(_toggleMenu({ menu: `is${service.type}ModalPriceOpen`, isOpen: true }));
                                    dispatch(_pushToOverlayActionStack(`is${service.type}ModalPriceOpen`));
                                }}
                            >
                                <svg
                                    style={{ position: 'absolute', top: 0 }}
                                    width='12'
                                    height='12'
                                    viewBox='0 0 12 12'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <circle cx='6' cy='6' r='5.5' fill='#141338' stroke='#141338' />
                                </svg>
                                <span style={{ position: 'absolute', left: '4px', top: '-2px', color: 'white', fontSize: '8px' }}>
                                    <em>i</em>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className={`w-full`}>
                    {options.map((option, index, array) => (
                        <div
                            key={option.value}
                            className={`flex flex-row justify-end items-center`}
                            style={{
                                paddingBottom: index === array.length - 1 ? '0px' : '16px',
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
                                            {option.subtitleCaptionKey && (
                                                <div className={`text-primary-grey`} style={{ fontSize: '14px', width: '100%' }}>
                                                    {t(`${option.subtitleCaptionKey}`)}
                                                </div>
                                            )}
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
