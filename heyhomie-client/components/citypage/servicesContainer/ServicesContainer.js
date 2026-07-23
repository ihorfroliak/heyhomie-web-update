import { useEffect, useRef, useState } from 'react';
import { css, styled } from 'twin.macro';
import { useSelector } from 'react-redux';
import ServiceConfigContainer from './ServiceCongifContainer';
import ServicesSlider from './ServicesSlider';

import useWindowSize from '../../../hooks/useWindowResize';

const StyledContainer = styled.div`
    position: relative;

    width: 100%;

    display: flex;
    flex-direction: column;

    //transition: ease-in-out .1s;
    ${properties =>
        properties.expanded
            ? css`
                  margin-bottom: 64px;
                  @media (min-width: 640px) {
                      margin-bottom: 128px;
                  }
              `
            : css`
                  margin-bottom: 64px;
                  @media (min-width: 640px) {
                      margin-bottom: 128px;
                  }
              `};
`;

const StyledBackgroundImage = styled.img`
    overflow: hidden;
    position: absolute;
    top: 48px;
    right: 0;
    //height: 450px;
    max-width: 55%;
    max-height: 580px;

    object-fit: fill;
    z-index: -3;

    transition: ease-out 0.3s;
    ${properties =>
        properties.currentBackgroundImg === properties.image
            ? css`
                  opacity: 1;
              `
            : css`
                  opacity: 0;
              `};

    @media (max-width: 769px) {
        display: none;
    }
`;

const ServicesContainer = ({ default_background_image: defaultBackgroundImage, services }) => {
    const windowSize = typeof window === 'undefined' ? { height: '', width: '' } : useWindowSize();

    // For scrolling
    const servicesConfigContainerReference = useRef(null);

    const { order } = useSelector(state => state);

    const backgroundImages = services && services.map(s => s.header_background_image);
    const [defaultBgImage, setDefaultBgImage] = useState(defaultBackgroundImage);
    const [currentBackgroundImg, setCurrentBackgroundImg] = useState(defaultBgImage);
    const [defaultHeaderCopy, setDefaultHeaderCopy] = useState('');
    const [currentHeaderCopy, setCurrentHeaderCopy] = useState(defaultHeaderCopy);

    const handleChangeBackgroundImg = (imgURL, serviceName) => {
        setCurrentBackgroundImg(imgURL);
        setCurrentHeaderCopy(serviceName);
    };

    const handleSetDefaultImageCopy = (imgURL, serviceName) => {
        setDefaultBgImage(imgURL);
        setDefaultHeaderCopy(serviceName);
    };

    const handleResetBackgroundImg = () => {
        setCurrentBackgroundImg(defaultBgImage);
        setCurrentHeaderCopy(defaultHeaderCopy);
    };

    useEffect(() => {
        const serviceSelectedAndExpanded = order.services && order.services.find(s => s.cardExpanded === true);
        if (serviceSelectedAndExpanded) {
            const bgImgURL = services.find(s => s.name === serviceSelectedAndExpanded.type).header_background_image;
            handleSetDefaultImageCopy(bgImgURL, serviceSelectedAndExpanded.type);
            handleChangeBackgroundImg(bgImgURL, serviceSelectedAndExpanded.type);
        } else {
            handleSetDefaultImageCopy(defaultBackgroundImage, '');
            handleChangeBackgroundImg(defaultBackgroundImage, '');
        }
    }, [order.services]);

    return (
        <div>
            <StyledBackgroundImage src={defaultBackgroundImage} image={defaultBackgroundImage} currentBackgroundImg={currentBackgroundImg} />
            {windowSize && windowSize.width > 769
                ? backgroundImages.map(image => <StyledBackgroundImage key={image} src={image} image={image} currentBackgroundImg={currentBackgroundImg} />)
                : undefined}
            <StyledContainer expanded={order && order.services.length > 0}>
                <ServicesSlider
                    handleChangeBackgroundImg={handleChangeBackgroundImg}
                    handleSetDefaultImageCopy={handleSetDefaultImageCopy}
                    handleResetBackgroundImg={handleResetBackgroundImg}
                    services={services}
                    servicesConfigContainerRef={servicesConfigContainerReference}
                    currentHeaderCopy={currentHeaderCopy}
                />
                <ServiceConfigContainer ref={servicesConfigContainerReference} />
            </StyledContainer>
        </div>
    );
};

export default ServicesContainer;
