/* eslint-disable no-unsafe-optional-chaining */
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import tw, { css, styled } from 'twin.macro';
import Checkbox from '../../../ui/Checkbox';

import Dropdown from '../../../ui/Dropdown';
import PopupMessage from '../../../ui/PopupMessage';

const StyledContainer = styled.div`
    width: 180px;
    min-height: 160px;

    ${properties =>
        properties.checked
            ? css`
                  background-color: #141338;
                  color: white;

                  div:nth-child(2) > button {
                      color: black;
                  }
              `
            : css`
                  background-color: #f2f1f1;
              `}

    border-radius: 5px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    -webkit-box-shadow: 0px 0px 22px 2px rgba(0, 0, 0, 0.07);
    -moz-box-shadow: 0px 0px 22px 2px rgba(0, 0, 0, 0.07);
    box-shadow: 0px 0px 22px 2px rgba(0, 0, 0, 0.07);

    @media (max-width: 500px) {
        width: 150px;
        // aspect-ratio: 24 / 20;
        -webkit-box-shadow: 0px 0px 22px 2px rgba(0, 0, 0, 0.05);
        -moz-box-shadow: 0px 0px 22px 2px rgba(0, 0, 0, 0.05);
        box-shadow: 0px 0px 22px 2px rgba(0, 0, 0, 0.05);
    }
`;

const OptionLineSelect = ({ value, onSelect, nameCaptionKey, hintCaptionKey, options, separated, cost, icon }) => {
    const [isHintPopupOpen, setIsHintPopupOpen] = useState(false);

    const t = useTranslations('CityPage.ServiceConfig');

    const [checked, setChecked] = useState(value > 0);
    const [selectedValue, setSelectedValue] = useState(() => {
        if (value > 0 && options && options.length > 0) {
            const index = options.findIndex(option => option.value === value);
            return index >= 0 ? index : 0;
        }
        return 0;
    });

    useEffect(() => {
        const handleStateChange = () => {
            if (!checked && (!options || options.length <= 2)) {
                onSelect(false);
            } else if (!checked) {
                onSelect(0);
            } else if (options && options.length > 2) {
                onSelect(options[selectedValue]?.value);
            } else if (checked && (!options || options.length > 0)) {
                onSelect(true);
            }
        };

        const timer = setTimeout(handleStateChange, 300);
        return () => clearTimeout(timer);
    }, [checked, selectedValue, options]);

    const handleToggle = checked => {
        setChecked(checked);
        setSelectedValue(0);
    };

    const handleValueChange = increment => {
        setSelectedValue(prevValue => {
            if (increment) {
                return prevValue < options.length - 1 ? prevValue + 1 : prevValue;
            } else {
                return prevValue > 0 ? prevValue - 1 : 0;
            }
        });
    };

    return (
        <>
            <div className='flex flex-row justify-center items-center gap-x-2'>
                <label>
                    <Checkbox
                        checked={checked}
                        onChange={e => {
                            handleToggle(e.target.checked);
                        }}
                    />
                </label>
                <div className='flex flex-row justify-center items-center gap-x-2'>
                    {icon && (
                        <>
                            {/* Visible on phone */}
                            <span className='md:hidden flex justify-center items-center'>
                                <Image src={`/icons/cleaning_calculator/${icon}.svg`} alt={icon} width={24} height={24} />
                            </span>
                            {/* Visible on tablets and computers */}
                            <span className='hidden md:flex justify-center items-center'>
                                <Image src={`/icons/cleaning_calculator/${icon}.svg`} alt={icon} width={40} height={40} />
                            </span>
                        </>
                    )}
                    <span className='text-sm md:text-base'>
                        {t(`${nameCaptionKey}`)}&nbsp;
                        {options && options.length > 2 && <span>x{options[selectedValue]?.value}</span>}
                    </span>
                </div>
            </div>
            <div className={`w-28 h-10 border rounded-md flex flex-row justify-around text-base ${checked && 'bg-primary-indigo'}`}>
                {options && options.length !== 2 ? (
                    <>
                        <button
                            className={`flex justify-center items-center ${options.length === 1 && 'hidden'}`}
                            onClick={() => handleValueChange(false)}
                            disabled={!checked}
                        >
                            <Image src={`/icons/minus.svg`} alt={'minus'} width={24} height={24} />
                        </button>
                        <span className={`flex justify-center items-center text-center`}>{options[selectedValue]?.value * cost} zł</span>
                        <button
                            className={`flex justify-center items-center ${options.length === 1 && 'hidden'}`}
                            onClick={() => handleValueChange(true)}
                            disabled={!checked}
                        >
                            <Image src={`/icons/plus.svg`} alt={'plus'} width={24} height={24} />
                        </button>
                    </>
                ) : (
                    <span className={`flex justify-center items-center text-center`}>{t(`${options[+checked]?.showValue}`)}</span>
                )}
            </div>
        </>
    );
};

export default OptionLineSelect;
