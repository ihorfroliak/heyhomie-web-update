import { useState, useEffect, useRef } from 'react';

import tw, { css, styled, theme } from 'twin.macro';

const StyledPopupMessage = styled.div`
    position: absolute;
    opacity: 0;
    visibility: hidden;
    background-color: ${theme`colors.primary.dark`};
    ${tw`
            py-8px px-24px
            font-normal
        `}
    color: white;

    border-radius: 4px;

    font-size: 13px;

    cursor: default;

    ${props =>
        props.isOpen
            ? css`
                  z-index: 30;
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

const PopupMessage = ({ message, position, isOpen, setIsOpen }) => {
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
        <StyledPopupMessage ref={node} isOpen={isOpen} style={{ ...position }} onMouseLeave={() => setIsOpen(false)} onClick={() => setIsOpen(false)}>
            {message}
        </StyledPopupMessage>
    );
};

export default PopupMessage;
