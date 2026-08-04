import { useTranslations } from 'next-intl';
import { useState } from 'react';
import tw, { css, styled, theme } from 'twin.macro';

import Checkbox from '../../../../ui/Checkbox';
import Dropdown from '../../../../ui/Dropdown';

import PopupMessage from '../../../../ui/PopupMessage';

const StyledContainer = styled.div`
    position: relative;

    ${props =>
        props.separated
            ? css`
                  border-bottom: solid 1px;
                  padding-bottom: 24px;
              `
            : css`
                  padding-bottom: 8px;
              `};
    padding-top: 8px;

    ${tw`
        flex flex-row flex-wrap items-center
    `};

    border-color: #e2e2eb;
`;

const OptionWithDropdownSelect = ({ value, onSelect, nameCaptionKey, descriptionCaptionKey, hintCaptionKey, options, separated }) => {
    const [isHintPopupOpen, setIsHintPopupOpen] = useState(false);

    const t = useTranslations('CityPage.ServiceConfig');

    const [checked, setChecked] = useState(value > 0);
    const [selectedValue, setSelectedValue] = useState(value > 0 ? value : options[0].value);

    return (
        <StyledContainer separated={separated}>
            {hintCaptionKey ? (
                <PopupMessage
                    message={t(`${hintCaptionKey}`)}
                    position={{ top: '-3rem', left: '20px' }}
                    isOpen={isHintPopupOpen}
                    setIsOpen={setIsHintPopupOpen}
                />
            ) : null}
            <div className={`w-6/12`}>
                <label
                    className={`
                        flex items-center
                    `}
                >
                    <Checkbox
                        checked={checked}
                        onChange={e => {
                            if (!e.target.checked) {
                                onSelect(0);
                                setChecked(false);
                            } else {
                                setChecked(true);
                                onSelect(Number.parseInt(selectedValue, 10));
                            }
                        }}
                    />
                    <div>
                        <div style={{ marginLeft: '1rem' }}>
                            {t(`${nameCaptionKey}`)}
                            {hintCaptionKey ? (
                                <button
                                    style={{
                                        position: 'relative',
                                        left: '8px',
                                        top: '-.35rem',
                                        width: '12px',
                                        height: '12px',
                                        outline: 'none',
                                    }}
                                    onMouseEnter={() => setIsHintPopupOpen(true)}
                                    onMouseLeave={() => setIsHintPopupOpen(false)}
                                    onClick={() => setIsHintPopupOpen(!isHintPopupOpen)}
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
                                    <span style={{ position: 'absolute', left: '4px', top: '0', color: 'white', fontSize: '8px' }}>
                                        <em>i</em>
                                    </span>
                                </button>
                            ) : null}
                        </div>
                        <div className={`text-primary-grey`} style={{ fontSize: '14px', width: '100%', marginLeft: '1rem' }}>
                            {t(`${descriptionCaptionKey}`)}
                        </div>
                    </div>
                </label>
            </div>
            <div className={`w-6/12 flex flex-wrap flex-row justify-end items-center`}>
                <Dropdown
                    onChange={e => {
                        setSelectedValue(Number.parseInt(e.target.value, 10));
                        onSelect(Number.parseInt(e.target.value, 10));
                    }}
                    disabled={!checked}
                    value={value}
                >
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {t(`${option.titleCaptionKey}`)}
                        </option>
                    ))}
                </Dropdown>
            </div>
        </StyledContainer>
    );
};

export default OptionWithDropdownSelect;
