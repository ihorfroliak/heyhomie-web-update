import React from 'react';
import { useSelector } from 'react-redux';
import { css, styled } from 'twin.macro';

import ServiceConfigCard from './ServiceConfigCard';

const StyledServiceConfigContainer = styled.div`
    margin-top: 16px;
    transition: ease-in-out 1s;
    max-width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    z-index: 2;
    ${properties =>
        properties.maxHeight
            ? css`
                  max-height: 800vh;
                  @media (min-width: 640px) {
                      max-height: 600vh;
                  }
              `
            : css`
                  max-height: 0;
              `};
`;

const ServiceConfigContainer = React.forwardRef((properties, reference) => {
    // Redux state
    const { order } = useSelector(state => state);

    return (
        <StyledServiceConfigContainer maxHeight={order && order.services.length > 0} id='servicesConfigContainer' ref={reference}>
            {order &&
                order.services.length > 0 &&
                order.services.map(service => <ServiceConfigCard key={service.id ?? service.homie_service_id} service={service} />)}
        </StyledServiceConfigContainer>
    );
});

export default ServiceConfigContainer;
