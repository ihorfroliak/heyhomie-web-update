import { useTranslations } from 'next-intl';
import tw, { css, styled } from 'twin.macro';

import Dropdown from '../../../ui/Dropdown';

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

// eslint-disable-next-line no-unused-vars
const DropdownSelect = ({ value, onSelect, nameCaptionKey, descriptionCaptionKey, options, separated }) => {
    const t = useTranslations('CityPage.ServiceConfig');

    return (
        <StyledContainer separated={separated}>
            <div className={`font-bold w-1/5`}>{t(`${nameCaptionKey}`)}</div>
            <div className={`w-4/5 flex flex-wrap flex-row justify-end items-center`}>
                {/* <Dropdown
                    value={value}
                    onSelect={onSelect}
                    options={options}
                /> */}
                <Dropdown onChange={event_ => onSelect(event_.target.value)} value={value}>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {t(`${option.captionKey}`)}
                        </option>
                    ))}
                </Dropdown>
            </div>
        </StyledContainer>
    );
};

export default DropdownSelect;
