import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import tw, { css, styled, theme } from 'twin.macro';
import Checkbox from '../../../../ui/Checkbox';

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

    border-color: #e2e2eb;
`;

const Option = ({ value, service, widget, onSelect, nameCaptionKey, optionPriceCaption, subtitleCaptionKey, separated }) => {
    const t = useTranslations('CityPage.ServiceConfig');

    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        if (widget.excludes) {
            let result = false;
            for (let i = 0; i < widget.excludes.length; i++) {
                if (service.config[widget.excludes[i]] === true) {
                    result = true;
                    break;
                }
            }

            setIsDisabled(result);
        }

        if (widget.requires) {
            let result = true;
            for (let i = 0; i < widget.requires.length; i++) {
                if (service.config[widget.requires[i]] === true) {
                    result = false;
                }
            }

            setIsDisabled(result);
            if (result && value) {
                onSelect(false);
            }
        }
    }, [service, widget]);

    return (
        <StyledContainer separated={separated}>
            <div className={`${optionPriceCaption ? `w-10/12` : `w-full`}`}>
                <label>
                    <Checkbox checked={value} onChange={e => onSelect(e.target.checked)} disabled={isDisabled} />
                    <span style={{ marginLeft: '1rem' }}>{t(`${nameCaptionKey}`)}</span>
                    {subtitleCaptionKey ? (
                        <div className={`text-primary-grey`} style={{ fontSize: '14px', width: '100%', marginTop: '14px', lineHeight: '17px' }}>
                            {t(`${subtitleCaptionKey}`)}
                        </div>
                    ) : null}
                </label>
            </div>
            {optionPriceCaption ? (
                <div
                    className={`
                        w-2/12
                        flex flex-wrap flex-row justify-end items-center
                        font-bold
                        ${value ? `text-primary-dark` : `text-primary-grey`}
                    `}
                    style={{ fontSize: '18px' }}
                >
                    +&nbsp;{t(`${optionPriceCaption}`)}
                </div>
            ) : null}
        </StyledContainer>
    );
};

export default Option;
