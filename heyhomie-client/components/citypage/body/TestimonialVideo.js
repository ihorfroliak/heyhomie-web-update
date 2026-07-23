import { useTranslations } from 'next-intl';
import { keyframes } from 'styled-components';
import tw, { css, styled, theme } from 'twin.macro';

import LazyLoad from 'react-lazyload';

import { useRouter } from 'next/router';
import Spinner from '../../ui/Spinner';

const TestimonialContainer = styled.div`
    top: 0;
    position: absolute;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    height: 380px;
    width: 100%;

    animation-fill-mode: forwards;

    ${props =>
        props.isVisible
            ? css`
                  animation-name: fadeIn;
                  animation-duration: 0.6s;
              `
            : css`
                  animation-name: fadeOut;
                  animation-duration: 0.3s;
              `};

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

            visibility: visible;
        }
        99% {
            opacity: 0;

            visibility: visible;
        }
        100% {
            opacity: 0;

            visibility: hidden;
        }
    }

    @media (min-width: 1440px) {
        height: 40vh;
    }
`;

const VideoContainer = styled.div`
    position: relative;

    height: 300px;
    width: 100%;

    iframe {
        position: absolute;
        top: 0;
        left: 0;

        width: 100%;
        height: 100%;
    }

    @media (min-width: 640px) {
        height: 100%;
        width: 50%;

        iframe {
            left: initial;
            right: 0;
        }
    }

    @media (min-width: 1440px) {
        width: 52%;
    }

    @media (min-width: 1600px) {
        iframe {
            width: 800px;
            height: 450px;
        }
    }
`;

const QuoteContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;

    padding-left: 10px;
    padding-right: 10px;

    text-align: center;

    height: 130px;

    white-space: pre-line;

    h2 {
        font-size: 18px;
    }
    div {
        font-size: 16px;
    }

    padding-bottom: 16px;

    @media (min-width: 640px) {
        width: 50%;
        height: 380px;

        padding-left: 20px;

        text-align: left;
        h2 {
            font-size: 24px;
            max-width: 450px;
        }
        div {
            font-size: 18px;
        }
    }

    @media (min-width: 1440px) {
        width: 48%;

        height: 40vh;
    }
`;

const Testimonial = ({ videoURL, quote, author, title, isVisible }) => {
    const t = useTranslations('CityPage.CitypageBody');

    const router = useRouter();

    return (
        <TestimonialContainer isVisible={isVisible}>
            <VideoContainer>
                {isVisible ? (
                    <iframe
                        src={videoURL[router.locale]}
                        frameBorder='0'
                        allow='autoplay; fullscreen; picture-in-picture'
                        allowFullScreen
                        title={`Homie - ${title}`}
                    ></iframe>
                ) : (
                    <div className='flex justify-center items-center w-full h-full'>
                        <Spinner />
                    </div>
                )}
            </VideoContainer>
            <QuoteContainer>
                <h2>{t(`testimonials.${quote}`)}</h2>
                <div>{t(`testimonials.${author}`)}</div>
            </QuoteContainer>
        </TestimonialContainer>
    );
};
export default Testimonial;
