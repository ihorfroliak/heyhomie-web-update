import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import tw, { css, styled, theme } from 'twin.macro';

import { useRouter } from 'next/router';
import Dropdown from '../../../ui/Dropdown';
import { DeleteCarpetBtn } from '../../../myaccount/main/missions/missionEditor/widgets/DropdownSelectCarpetItems';

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

    margin-top: 6px;
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

const DeleteCarpetButton = styled.button`
    svg {
        fill: ${theme`colors.secondary.pink`};
        transition: 0.2s ease-in-out;

        fill-opacity: 0.3;
    }

    &:hover > svg {
        fill-opacity: 1;
    }
    &:focus > svg {
        fill-opacity: 1;
    }
`;

const carpetSizeEnSwitch = carpetSize => {
    switch (carpetSize) {
        case 1: {
            return `${carpetSize}st`;
        }
        case 2: {
            return `${carpetSize}nd`;
        }
        case 3: {
            return `${carpetSize}rd`;
        }
        default: {
            return `${carpetSize}th`;
        }
    }
};

const IndividualCarpetSizeWidget = ({
    size,
    index,
    length,
    carpet_detailed_sizes: carpetDetailedSizes,
    carpet_items: carpetItems,
    handleChangeSize,
    handleDeleteItem,
}) => {
    const t = useTranslations('CityPage.ServiceConfig');
    const router = useRouter();

    const [input, setInput] = useState(size);

    const handleInputChange = event_ => {
        setInput(event_.target.value);
    };

    useEffect(() => {
        setInput(size);
    }, [size, carpetDetailedSizes, carpetItems]);

    return (
        <StyledContainer>
            <div
                className={`font-bold w-1/12 sm:w-1/12`}
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                }}
            >
                {length > 1 && (
                    <DeleteCarpetBtn onClick={() => handleDeleteItem(index)}>
                        <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' viewBox='0 0 16 16'>
                            <path d='M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z' />
                            <path d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z' />
                        </svg>
                    </DeleteCarpetBtn>
                )}
            </div>
            <div className={`font-bold text-right sm:text-left w-5/12 sm:w-8/12`}>
                {t(`individualCarpetItem`, { value: router.locale === 'pl' ? index + 1 : carpetSizeEnSwitch(index + 1) })}
            </div>
            <div
                className={`font-bold w-6/12 sm:w-3/12`}
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                }}
            >
                <div style={{ position: 'relative', marginRight: '18px' }}>
                    <span>{t(`carpet_upTo`)}</span>
                    <StyledInput
                        value={input}
                        onChange={event_ => handleInputChange(event_)}
                        min={1}
                        onBlur={async event_ => {
                            if (event_.target.value < 1) {
                                handleChangeSize(1, index);
                            } else if (event_.target.value > 30) {
                                handleChangeSize(30, index);
                            } else {
                                handleChangeSize(event_.target.value, index);
                            }
                        }}
                        onKeyUp={event_ => {
                            if (event_.key === 'Enter' || event_.keyCode === 13) {
                                if (event_.target.value < 1) {
                                    handleChangeSize(1, index);
                                } else if (event_.target.value > 30) {
                                    handleChangeSize(30, index);
                                } else {
                                    handleChangeSize(event_.target.value, index);
                                }
                            }
                        }}
                    />
                    <span
                        style={{
                            position: 'absolute',
                            top: '0',
                            right: '-1.25rem',
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

const DropdownSelectCarpetItems = ({
    // eslint-disable-next-line no-unused-vars
    service,
    // eslint-disable-next-line no-unused-vars
    config,
    nameCaptionKey,
    // eslint-disable-next-line no-unused-vars
    descriptionCaptionKey,
    options,
    carpet_items: carpetItems,
    carpet_detailed_sizes: carpetDetailedSizes,
    handleChangeCarpetItems,
    handleChangeCarpetItemDetailedSizes,
}) => {
    const t = useTranslations('CityPage.ServiceConfig');

    const handleSelect = value => {
        let workingArray = [...carpetDetailedSizes];

        if (workingArray.length > value) {
            workingArray = workingArray.filter((_, index) => index + 1 <= value);
        } else if (workingArray.length < value) {
            const diff = value - workingArray.length;

            for (let index = 0; index < diff; index++) {
                workingArray.push(1);
            }
        }

        handleChangeCarpetItems(value);
        handleChangeCarpetItemDetailedSizes(workingArray);
    };

    const handleChangeIndividualItem = (value, index) => {
        const workingArray = [...carpetDetailedSizes];

        workingArray[index] = value === undefined ? value : Number.parseInt(value, 10);

        handleChangeCarpetItemDetailedSizes(workingArray);
    };

    const handleDeleteIndividualItem = indexToDelete => {
        const workingArray = carpetDetailedSizes.filter((value, index) => index !== indexToDelete);

        handleChangeCarpetItems(carpetItems - 1);
        handleChangeCarpetItemDetailedSizes(workingArray);
    };

    return (
        <StyledContainer separated={false}>
            <div className={`font-bold w-3/5`}>{t(`${nameCaptionKey}`)}</div>
            <div className={`w-2/5 flex flex-wrap flex-row justify-end items-center`}>
                <Dropdown
                    onChange={event_ => handleSelect(event_.target.value)}
                    value={carpetItems}
                    style={{
                        marginRight: '1rem',
                    }}
                >
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {t(`${option.captionKey}`)}
                        </option>
                    ))}
                </Dropdown>
            </div>
            <div
                className={`
                    w-full
                `}
            >
                {carpetDetailedSizes &&
                    carpetDetailedSizes.map((size, index) => (
                        <IndividualCarpetSizeWidget
                            size={size}
                            index={index}
                            length={carpetDetailedSizes.length}
                            carpet_detailed_sizes={carpetDetailedSizes}
                            carpet_items={carpetDetailedSizes}
                            handleChangeSize={handleChangeIndividualItem}
                            handleDeleteItem={handleDeleteIndividualItem}
                        />
                    ))}
            </div>
        </StyledContainer>
    );
};

export default DropdownSelectCarpetItems;
