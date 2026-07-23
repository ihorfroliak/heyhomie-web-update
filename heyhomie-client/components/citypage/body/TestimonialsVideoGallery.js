import { useState } from 'react';

import tw, { css, styled, theme } from 'twin.macro';
import Testimonial from './TestimonialVideo';

const TestimonialsVideoGalleryContainer = styled.div``;

const ContainerDiv = styled.div`
    margin-top: 16px;

    position: relative;

    width: 100%;
    min-height: 450px;

    @media (min-width: 640px) {
        height: 380px;
    }

    @media (min-width: 1440px) {
        height: calc(40vh + 28px);

        margin-top: 64px;
    }
`;

const ControlsDiv = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;

    margin-top: 16px;

    @media (max-width: 640px) {
    }
`;
const ControlButton = styled.button`
    width: 12px;
    height: 12px;
    border-radius: 50%;

    margin-left: 8px;
    margin-right: 8px;

    background-color: ${props => (props.active ? theme`colors.primary.dark` : '#E2E2EB')};
    &:focus {
        outline: none;
    }

    transition: 0.2s ease-in-out;
`;

const TestimonialsVideoGallery = ({ testimonials }) => {
    const [currentVisible, setCurrentVisible] = useState(testimonials[0].id);

    return (
        <TestimonialsVideoGalleryContainer>
            <ContainerDiv>
                {testimonials.map(testimonial => (
                    <Testimonial
                        key={testimonial.id}
                        isVisible={currentVisible === testimonial.id}
                        videoURL={testimonial.videoURL}
                        title={testimonial.title}
                        quote={testimonial.quote}
                        author={testimonial.author}
                    />
                ))}
            </ContainerDiv>
            <ControlsDiv>
                {testimonials.map(testimonial => (
                    <ControlButton key={testimonial.id} active={currentVisible === testimonial.id} onClick={() => setCurrentVisible(testimonial.id)} />
                ))}
            </ControlsDiv>
        </TestimonialsVideoGalleryContainer>
    );
};

export default TestimonialsVideoGallery;
