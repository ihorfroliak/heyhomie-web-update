import tw, { css, styled, theme } from 'twin.macro';

const StyledSidebar = styled.div`
    ${tw`bg-whiteStandard`};
    z-index: ${props => props.order + 30};

    position: fixed;
    transition: 0.3s ease-in-out;

    top: 0;

    height: 100%;
    width: 100vw;

    overflow-y: auto;

    right: ${props => (props.isOpen ? css`0` : '-100vw')};

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    @media (min-width: 1024px) {
        width: ${props => (props.customWidth ? `${props.customWidth}px` : '480px')};

        right: ${props => (props.isOpen ? (props.order === 0 ? css`0` : '480px') : '-480px')};
        box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.05);

        z-index: ${props => (props.order === 1 ? 28 : props.order + 30)};
    }
`;

export default StyledSidebar;
