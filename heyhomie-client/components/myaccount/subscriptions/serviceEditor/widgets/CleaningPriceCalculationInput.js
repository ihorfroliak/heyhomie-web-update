import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import tw, { css, styled, theme } from 'twin.macro';

const StyledContainer = styled.div`
    ${props =>
        props.separated
            ? css`
                  border-bottom: solid 1px;
              `
            : css``};
    padding-top: 24px;
    padding-bottom: 24px;

    ${tw`
        flex flex-row flex-wrap items-center justify-around
    `};

    border-color: #e2e2eb;
`;

const StyledInput = styled.input.attrs({ type: 'number' })`
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    width: 4rem;
    height: 37px;

    text-align: center;
    font-weight: bold;

    border-radius: 4px;
    border-style: solid;
    border-width: 1px;
    ${tw`border-primary-dark`}
`;

const CleaningPriceCalculationInput = ({ service, config, value, onChange, nameCaptionKey, separated }) => {
    const t = useTranslations('CityPage.ServiceConfig');

    const { user } = useSelector(state => state);

    const [input, setInput] = useState(value);

    const handleInputChange = e => {
        setInput(e.target.value);
    };

    useEffect(() => {
        setInput(value);
    }, [value]);

    return (
        <StyledContainer separated={separated}>
            <div className={`font-bold w-4/12`}>{t(`${nameCaptionKey}`)}</div>
            <div
                className={`font-bold w-8/12`}
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                }}
            >
                <div style={{ position: 'relative', marginRight: '18px' }}>
                    <StyledInput
                        value={input}
                        onChange={e => handleInputChange(e)}
                        min={25}
                        onBlur={async e => {
                            if (e.target.value < 25) {
                                onChange(25);
                            } else {
                                onChange(e.target.value);
                            }
                        }}
                        onKeyUp={e => {
                            if (e.key === 'Enter' || e.keyCode === 13) {
                                if (e.target.value < 25) {
                                    onChange(25);
                                } else {
                                    onChange(e.target.value);
                                }
                            }
                        }}
                    />
                    <span
                        style={{
                            position: 'absolute',
                            top: '0',
                            left: 'calc(50% + 2.25rem)',
                            fontSize: '12px',
                        }}
                    >
                        m2
                    </span>
                </div>
            </div>
        </StyledContainer>
    );
};

export default CleaningPriceCalculationInput;
