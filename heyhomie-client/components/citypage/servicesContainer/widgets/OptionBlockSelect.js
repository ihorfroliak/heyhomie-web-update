import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import tw, { css, styled } from 'twin.macro';

const StyledContainer = styled.div`
    width: 180px;
    min-height: 160px;

    ${properties =>
        properties.checked
            ? css`
                  background-color: #14133a;
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

const OptionBlockSelect = ({ value, onSelect, nameCaptionKey, hintCaptionKey, options, separated, cost, icon, buttonColor }) => {
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

    const handleToggle = () => {
        setChecked(prevChecked => !prevChecked);
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
        <StyledContainer checked={checked}>
            {/* {hintCaptionKey && (
                <PopupMessage
                    message={t(`${hintCaptionKey}`)}
                    position={{ top: '-3rem', left: '20px' }}
                    isOpen={isHintPopupOpen}
                    setIsOpen={setIsHintPopupOpen}
                />
            )} */}
            <div className={`w-full ${icon !== undefined ? 'h-14' : ''} flex justify-center items-center`}>
                {checked && options && options.length > 0 ? (
                    <div className={`w-8/12 h-8 border rounded-md flex flex-row justify-around text-base font-bold`}>
                        <button className={`w-4/12`} onClick={() => handleValueChange(false)}>
                            -
                        </button>
                        <span className={`w-4/12 text-center pt-0.5`}>{options[selectedValue]?.value}</span>
                        <button className={`w-4/12`} onClick={() => handleValueChange(true)}>
                            +
                        </button>
                    </div>
                ) : (
                    icon !== undefined && <Image src={`/icons/${icon}`} alt={icon} width={55} height={55} />
                )}
            </div>
            <div className='flex flex-col justify-center items-center'>
                <div>
                    <div style={{ marginTop: '6px', marginBottom: '6px' }} className='flex flex-row justify-center font-bold text-center'>
                        {t(`${nameCaptionKey}`)}
                    </div>
                </div>
                <button
                    onClick={handleToggle}
                    className={`w-20 h-8 font-extrabold flex justify-center items-center rounded-md ${buttonColor.className}`}
                    style={{ backgroundColor: buttonColor.color }}
                >
                    {t(`${cost}`)}
                </button>
            </div>
        </StyledContainer>
    );
};

export default OptionBlockSelect;
