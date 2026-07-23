import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

import tw, { css, styled, theme } from 'twin.macro';

const FAQSectionContainer = styled.div`
    h2 {
        position: relative;
        text-align: center;
        color: #14133a;

        font-family: Quicksand;
        font-style: normal;
        font-weight: bold;
        font-size: 32px;
        line-height: 40px;
        text-align: center;

        padding-top: 64px;
        margin-bottom: 48px;

        white-space: pre;

        @media (min-width: 1024px) {
            font-size: 48px;
            line-height: 60px;

            padding-top: 85px;
            margin-bottom: 96px;

            white-space: initial;
        }

        img {
            position: absolute;

            width: 40px;

            bottom: -24px;
            right: 28px;

            @media (min-width: 1024px) {
                width: 70px;

                right: 14vw;
            }
        }

        svg {
            position: absolute;

            display: none;

            @media (min-width: 1024px) {
                display: block;

                left: 14vw;
                bottom: -64px;
            }
        }
    }
`;

const FAQSectionQuestionsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const FAQSectionItemStyled = styled.div`
    overflow: hidden;

    background: #ffffff;
    box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.05);
    border-radius: 8px;

    margin-bottom: 16px;
    margin-left: 16px;
    margin-right: 16px;

    width: 100%;
    max-width: 926px;

    padding-left: 24px;
    padding-right: 24px;

    .FAQSectionItem__question {
        display: flex;
        justify-content: space-between;
        align-items: center;

        div {
            color: #14133a;

            font-weight: bold;
            font-size: 14px;
            line-height: 24px;

            padding-top: 20px;
            margin-bottom: 20px;

            @media (min-width: 1024px) {
                font-size: 18px;
                line-height: 24px;

                padding-top: 24px;
                margin-bottom: 24px;
            }
        }

        button {
            &:focus {
                outline: none;
            }

            svg {
                transition: 0.4s ease-in-out;
            }

            ${props =>
                props.isOpen
                    ? css`
                          svg {
                              transform: rotate(180deg);
                          }
                      `
                    : css``}
        }
    }

    .FAQSectionItem__answer {
        transition: 0.6s ease-in-out;

        font-size: 14px;
        line-height: 24px;

        & > ul > li {
            position: relative;
            padding-left: 2rem;
        }
        & > ul > li::before {
            content: '•';
            position: absolute;
            left: 0.5rem;
        }

        @media (min-width: 1024px) {
            font-size: 16px;
            line-height: 22px;
        }

        transition: 0.3s ease-in-out;
        transform-origin: top;
        ${props =>
            props.isOpen
                ? css`
                      margin-bottom: 20px;

                      max-height: 300vh;

                      @media (min-width: 1024px) {
                          margin-bottom: 24px;
                          max-height: 150vh;
                      }

                      transform: scaleY(1);
                  `
                : css`
                      transform: scaleY(0);

                      max-height: 0;
                  `}
    }
`;

const FAQSectionItem = ({ item, index, translationNamespace, toggleOpen, isOpen }) => {
    // UI translations for the component
    const t = useTranslations(`ServicesLandings.${translationNamespace}.faq`);

    return (
        <FAQSectionItemStyled isOpen={isOpen}>
            <div className='FAQSectionItem__question'>
                <div>{t(item.question)}</div>
                <button onClick={() => toggleOpen(index)}>
                    <svg width='16' height='9' viewBox='0 0 16 9' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M8.69461 8.69461L15.7126 1.7006C16.0958 1.29341 16.0958 0.670659 15.7126 0.287425C15.3293 -0.0958084 14.6826 -0.0958084 14.2994 0.287425L8 6.58683L1.7006 0.287425C1.29341 -0.0958084 0.670659 -0.0958084 0.287425 0.287425C-0.0958084 0.670659 -0.0958084 1.29341 0.287425 1.7006L7.28144 8.69461C7.68862 9.07784 8.31138 9.07784 8.69461 8.69461Z'
                            fill='#14133A'
                        />
                    </svg>
                </button>
            </div>
            <div
                className='FAQSectionItem__answer'
                dangerouslySetInnerHTML={{
                    __html: t(item.answer),
                }}
            />
        </FAQSectionItemStyled>
    );
};

const FAQSection = ({ itemsArray, translationNamespace }) => {
    // UI translations for the component
    const t = useTranslations('ServicesLandings.common.FAQSection');

    const [openItem, setOpenItem] = useState('');

    const handleToggleOpen = index => {
        setOpenItem(current => {
            if (current === index) {
                return '';
            } else {
                return index;
            }
        });
    };

    return (
        <FAQSectionContainer>
            <h2>
                {t(`heading`)}
                <svg width='116' height='110' viewBox='0 0 116 110' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                        d='M21.563 51.6137C18.5397 47.2151 12.965 44.9453 8.81258 46.3281C5.72497 47.3471 3.92391 49.5224 3.4369 52.8028C2.95302 55.9499 3.92144 58.5679 6.4215 60.6355C7.7203 61.718 9.0557 62.8084 10.5224 63.6785C16.0721 67.0139 23.439 61.6751 23.0767 55.4008C22.9953 53.9489 22.3585 52.6454 21.563 51.6137Z'
                        fill='#FAD668'
                    />
                    <path
                        d='M83.3287 22.093C86.8804 25.77 89.3681 29.9508 89.5943 35.2347C89.7863 39.8436 88.429 43.8769 85.5682 47.4835C83.2833 50.3459 80.4982 52.7866 78.4712 55.8847C75.1671 60.9127 75.1812 64.6627 78.6206 69.6694C79.624 71.1215 80.5112 72.6205 81.0987 74.2775C81.825 76.3487 82.0756 78.3604 80.3742 80.1497C78.6223 81.9874 76.4158 82.105 74.2433 81.4504C70.7966 80.4069 68.0985 78.261 66.0283 75.2568C62.1901 69.6988 60.601 63.5966 61.8197 56.9619C62.4411 53.4722 64.4615 50.6699 67.2911 48.444C70.0031 46.3308 72.2301 43.8454 73.4886 40.5501C74.5189 37.8913 74.1471 35.4165 72.7525 33.0845C71.4849 30.9525 70.0002 28.9639 68.6661 26.8634C67.6015 25.2127 66.4382 23.5599 66.3534 21.4859C66.239 18.5397 68.5127 16.1704 71.4578 16.1178C75.4885 16.0554 79.3914 18.0131 83.3287 22.093Z'
                        fill='#FF3C87'
                    />
                </svg>
                <img src='/faq-emoji.png' />
            </h2>
            <FAQSectionQuestionsContainer>
                {itemsArray.map((item, index) => (
                    <FAQSectionItem
                        key={index}
                        item={item}
                        index={index}
                        translationNamespace={translationNamespace}
                        toggleOpen={handleToggleOpen}
                        isOpen={openItem === index}
                    />
                ))}
            </FAQSectionQuestionsContainer>
        </FAQSectionContainer>
    );
};

export default FAQSection;
