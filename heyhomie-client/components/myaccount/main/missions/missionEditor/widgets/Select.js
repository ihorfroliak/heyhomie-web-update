import { useTranslations } from 'next-intl';
import tw, { css, styled, theme } from 'twin.macro';

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

    margin-top: 0.5em;

    border-color: #e2e2eb;
`;

const StyledOption = styled.button`
    transition: 0.3s ease-in-out;
    height: 37px;
    ${tw`
        rounded-lg border-solid
        m-1
        px-4
        text-14px
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

const Select = ({ value, onSelect, nameCaptionKey, descriptionCaptionKey, options, separated }) => {
    const t = useTranslations('CityPage.ServiceConfig');

    return (
        <StyledContainer separated={separated}>
            <div className={`font-bold w-1/5`}>{t(`${nameCaptionKey}`)}</div>
            <div className={`w-4/5 flex flex-wrap flex-row justify-end items-center`}>
                {options.map(option => (
                    <Option key={option.value} active={option.value === value} captionKey={t(`${option.captionKey}`)} onClick={() => onSelect(option.value)} />
                ))}
            </div>
        </StyledContainer>
    );
};

export default Select;
