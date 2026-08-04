import { useTranslations } from 'next-intl';
import { useState, useEffect, useRef } from 'react';

import tw, { css, styled, theme } from 'twin.macro';

const StyledHomieDetailsPopup = styled.div`
    min-width: 176px;
    min-height: 140px;

    position: absolute;
    opacity: 0;
    visibility: hidden;

    background: #ffffff;
    box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.04);
    border-radius: 4px;

    ${tw`
            py-16px px-16px
            font-normal
        `}
    color: ${theme`colors.primary.dark`};

    cursor: default;

    ${props =>
        props.isOpen
            ? css`
                  animation: fadeIn forwards linear 0.2s;
              `
            : css`
                  opacity: 0;
                  visibility: hidden;
              `};

    transition: 0.2s ease-in-out;

    @keyframes fadeIn {
        0% {
            opacity: 0;

            visibility: hidden;
        }
        1% {
            opacity: 0;

            visibility: visible;
        }
        100% {
            opacity: 1;

            visibility: visible;
        }
    }

    @keyframes fadeOut {
        0% {
            opacity: 1;

            visibility: hidden;
        }
        99% {
            opacity: 0;

            visibility: hidden;
        }
        100% {
            opacity: 0;

            visibility: hidden;
        }
    }
`;

const HomieDetailsPopupContent = styled.div`
    .homie__namePicture {
        display: flex;
        align-items: center;

        padding-bottom: 16px;

        border-bottom: 1px solid #e2e2eb;

        div {
            margin-left: 8px;

            font-weight: bold;
            font-size: 12px;
            color: #141338;
        }
    }

    .homie__spokenLanguages {
        margin-top: 8px;

        .spokenLanguages__heading {
            text-transform: uppercase;
            font-size: 10px;
            color: #141338;
        }

        .spokenLanguages__languages {
            font-weight: bold;
            font-size: 12px;
            color: #141338;
        }
    }
`;

const HomieDetailsPopup = ({ homie, position, isOpen, setIsOpen }) => {
    // UI translations for the component
    const t = useTranslations('AccountPage.IndexPage.MissionsComponent.missions');

    // Ref to track outside clicks/touches
    const node = useRef();

    const handleOutsideClick = event => {
        if (node.current.contains(event.target)) {
            return;
        } else {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen]);

    return (
        <StyledHomieDetailsPopup ref={node} isOpen={isOpen} style={{ ...position }} onMouseLeave={() => setIsOpen(false)} onClick={() => setIsOpen(false)}>
            {homie ? (
                <HomieDetailsPopupContent>
                    <div className='homie__namePicture'>
                        <img
                            src={homie.profile_picture}
                            style={{
                                height: 48,
                                width: 48,
                            }}
                        />
                        <div>
                            {homie.first_name}
                            {` `}
                            {homie.last_name[0]}.
                        </div>
                    </div>
                    <div className='homie__spokenLanguages'>
                        <div className='spokenLanguages__heading'>{t(`spokenLanguages.heading`)}</div>
                        <div className='spokenLanguages__languages'>
                            {homie.languages &&
                                homie.languages.map((lang, index, arr) => (
                                    <span key={lang}>
                                        {t(`spokenLanguages.languages.${lang}`)}
                                        {index !== arr.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                        </div>
                    </div>
                </HomieDetailsPopupContent>
            ) : null}
        </StyledHomieDetailsPopup>
    );
};

export default HomieDetailsPopup;
