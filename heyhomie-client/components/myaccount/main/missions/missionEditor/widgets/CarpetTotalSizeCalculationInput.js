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

const CarpetTotalSizeCalculationInput = ({ carpet_items, carpet_detailed_sizes, handleChangeTotalSize, value, nameCaptionKey }) => {
    const t = useTranslations('CityPage.ServiceConfig');

    useEffect(() => {
        function updateTotalSize(sizesArray) {
            const totalSize = sizesArray.reduce((a, b) => parseInt(a, 10) + parseInt(b, 10), 0);

            handleChangeTotalSize(totalSize);
        }

        updateTotalSize(carpet_detailed_sizes);
    }, [carpet_detailed_sizes, carpet_items]);

    return (
        <StyledContainer separated={true}>
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
                    <span>{t(`carpet_upTo`)}&nbsp;</span>
                    <span
                        style={{
                            fontSize: '18px',
                        }}
                    >
                        {value}
                    </span>
                    <span
                        style={{
                            position: 'relative',
                            left: '2px',
                            bottom: '8px',
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

export default CarpetTotalSizeCalculationInput;
