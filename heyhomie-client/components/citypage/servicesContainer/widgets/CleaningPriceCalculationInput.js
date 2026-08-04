import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import tw, { css, styled } from 'twin.macro';
import { _pushToOverlayActionStack, _toggleMenu } from '../../../../lib/slices/uiSlice';

const StyledContainer = styled.div`
    ${properties =>
        properties.separated
            ? css`
                  border-bottom: solid 1px;
              `
            : css``};

    ${tw`flex flex-row flex-wrap items-center justify-around py-6 md:py-8`}

    border-color: #e2e2eb;
`;

const StyledInput = styled.input.attrs({
    type: 'text',
    inputMode: 'numeric',
})`
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    & {
        -moz-appearance: textfield;
    }

    // width: 4rem;
    // height: 28px;
    ${tw`h-7 md:h-14 w-16 md:w-24 text-xs md:text-lg`}

    text-align: center;
    font-weight: bold;

    border-radius: 4px;
    border-style: solid;
    border-width: 1px;
    ${tw`border-primary-dark`}
`;

const CleaningPriceCalculationInput = ({
    service,
    // eslint-disable-next-line no-unused-vars
    config,
    value,
    onChange,
    nameCaptionKey,
    separated,
    minValue,
    maxValue,
    additionalOptionsInfo,
    widget_name: widgetName,
}) => {
    const t = useTranslations('CityPage.ServiceConfig');

    const dispatch = useDispatch();

    const [input, setInput] = useState(value);

    const handleInputChange = event_ => {
        const { value } = event_.target;

        // Allow empty input or whole numbers only
        if (value === '' || /^-?\d+$/.test(value)) {
            setInput(value);
        }
    };

    useEffect(() => {
        setInput(value);
    }, [value]);

    return (
        <StyledContainer separated={separated}>
            <div className={`font-bold w-4/12`}>
                <span className={`relative`}>
                    <span className='text-sm md:text-lg'>{t(`${nameCaptionKey}`)}</span>
                    {additionalOptionsInfo && additionalOptionsInfo.widget === widgetName && (
                        <button
                            style={{ position: 'relative', left: '4px', top: '-.5rem', width: '12px', height: '12px', outline: 'none' }}
                            onClick={() => {
                                dispatch(_toggleMenu({ menu: `is${service.type}AdditionalOptionsInfoModalOpen`, isOpen: true }));
                                dispatch(_pushToOverlayActionStack(`is${service.type}AdditionalOptionsInfoModalOpen`));
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
                            <span style={{ position: 'absolute', left: '4px', top: '0px', color: 'white', fontSize: '8px' }}>
                                <em>i</em>
                            </span>
                        </button>
                    )}
                </span>
            </div>
            <div className={`font-bold w-8/12 flex flex-row justify-end`}>
                <div className='relative'>
                    <StyledInput
                        value={input}
                        onChange={event_ => handleInputChange(event_)}
                        onBlur={async event_ => {
                            const value = parseInt(event_.target.value, 10);

                            if (Number.isNaN(value) || value === '') {
                                // Handle empty input case
                                onChange(minValue);
                                setInput(minValue.toString());
                            } else if (value < minValue) {
                                onChange(minValue);
                                setInput(minValue.toString());
                            } else if (value > maxValue) {
                                onChange(maxValue);
                                setInput(maxValue.toString());
                            } else {
                                onChange(value);
                                setInput(value.toString());
                            }
                        }}
                        onKeyUp={event_ => {
                            if (event_.key === 'Enter' || event_.keyCode === 13) {
                                const value = parseInt(event_.target.value, 10);

                                if (Number.isNaN(value) || value === '') {
                                    // Handle empty input case
                                    onChange(minValue);
                                    setInput(minValue.toString());
                                } else if (value < minValue) {
                                    onChange(minValue);
                                    setInput(minValue.toString());
                                } else if (value > maxValue) {
                                    onChange(maxValue);
                                    setInput(maxValue.toString());
                                } else {
                                    onChange(value);
                                    setInput(value.toString());
                                }
                            }
                        }}
                    />
                </div>
            </div>
        </StyledContainer>
    );
};

export default CleaningPriceCalculationInput;
