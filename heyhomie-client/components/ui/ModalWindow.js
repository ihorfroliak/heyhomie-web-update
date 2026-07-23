import tw, { css, styled, theme } from 'twin.macro';
import { useSpring, animated } from 'react-spring';

const StyledModal = styled.div`
    background-color: #ffffff;
    box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.05);
    border-radius: 4px;

    position: fixed;
    transition: 0.2s ease-in-out;

    min-height: 200px;
    top: calc(40% - 100px);

    width: 300px;
    left: calc(50% - 150px);

    padding-left: 5px;
    padding-right: 5px;

    @media (min-width: 440px) {
        width: 400px;
        left: calc(50% - 200px);
    }

    @media (min-width: 640px) {
        width: 528px;
        left: calc(50% - 264px);
        padding-left: 44px;
        padding-right: 44px;
    }

    overflow-y: auto;

    opacity: ${props => (props.isOpen ? '1' : '0')};
    z-index: ${props => (props.isOpen ? 50 : -10)};
`;

export default StyledModal;
