import { useTranslations } from 'next-intl';
import Link from 'next/link';
import tw, { css, styled } from 'twin.macro';

// padding-top: 16px;
// padding-left: 24px;
// padding-right: 24px;
const StyledContainer = styled.div`
    ${properties =>
        properties.separated &&
        css`
            border-bottom: solid 1px;
        `};

    ${tw`py-6 md:py-12`}

    display: flex;
    flex-direction: column;
    align-items: center;

    border-color: #e2e2eb;
`;

const StyledOption = styled.button`
    ${properties => (properties.active ? tw`text-primary-dark bg-primary-saladLight border-secondary-salad` : tw`text-primary-grey bg-secondary-lightGrey`)};

    ${tw`border border-solid border-primary-grey`}

    transition: 0.3s ease-in-out;
    width: 100%;

    border-radius: 5px;

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

const Option = ({ active, captionKey, onClick, type }) => {
    return (
        <StyledOption active={active} onClick={onClick} type={type} className='h-7 md:h-12 text-xs md:text-lg'>
            {captionKey}
        </StyledOption>
    );
};

// eslint-disable-next-line no-unused-vars
const Select = ({ value, onSelect, nameCaptionKey, descriptionCaptionKey, options, separated, hidden, widget, type }) => {
    const t = useTranslations('CityPage.ServiceConfig');

    return (
        <StyledContainer separated={separated} style={{ display: hidden ? 'none' : '' }}>
            <div className='flex flex-col justify-center items-center w-full'>
                <div className={`font-bold ${widget.linkToLanding ? 'mb-1 md:mb-2' : 'mb-2 md:mb-6'}`}>
                    <span className='text-sm md:text-lg'>{t(`${nameCaptionKey}`)}</span>
                </div>
                {widget.linkToLanding && (
                    <div className='text-xs md:text-base mb-4'>
                        <Link target='_blank' href={`/${widget.linkToLanding__slug}`}>
                            <a target='_blank' rel='noopener noreferrer' className='text-primary-pink'>
                                {t(`${widget.linkToLanding__Caption}`)}
                            </a>
                        </Link>
                    </div>
                )}
            </div>
            <div className={`w-full grid grid-cols-2 gap-2 ${options.length > 2 && 'md:grid-cols-4'}`}>
                {options.map(option => (
                    <Option
                        key={option.value}
                        active={option.value === value}
                        captionKey={t(`${option.captionKey}`)}
                        onClick={() => onSelect(option.value)}
                        type={type}
                    />
                ))}
            </div>
        </StyledContainer>
    );
};

export default Select;
