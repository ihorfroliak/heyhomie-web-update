// styledComponents.js
import tw, { styled } from 'twin.macro';

export const LogoContainer = styled.div`
    position: relative;

    cursor: pointer;

    @media (min-width: 640px) {
        left: initial;
        img {
            height: 80px;
            width: auto;
        }
    }
    @media (min-width: 1024px) {
        img {
            height: 80px;
        }
    }

    // @media (max-width: 420px) {
    //     position: absolute;
    //     top: 52px;
    //     left: 12px;
    // }
`;

export const TopnavButtonsContainer = styled.div`
    ${tw`flex`}
    height: 40px;
    // @media (max-width: 420px) {
    //     width: 100%;
    //     justify-content: ${props => (props.between ? 'space-between' : 'space-around')};
    // }
`;

export const DropdownContainer = styled.div`
    position: relative;

    a {
        height: 32px;
        margin: 4px 0;
    }
`;
