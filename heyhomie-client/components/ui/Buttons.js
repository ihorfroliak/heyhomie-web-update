import tw, { css, styled, theme } from 'twin.macro';

export const PrimaryButtonFull = styled.button`
    ${tw`
        rounded-lg bg-primary-dark border-2 border-primary-dark border-solid
        m-4
        text-white font-bold
    `};
    &:disabled {
        opacity: 0.2;
        cursor: default;
    }
    &:hover:enabled {
        opacity: 0.9;
    }
    &:focus {
        outline: none;
        opacity: 0.9;
    }
`;

export const PrimaryButtonFullSticky = styled.button`
    ${tw`
        rounded-lg bg-primary-dark border-2 border-primary-dark border-solid
        text-white font-bold my-4 text-xl
        flex justify-between items-center flex-col md:flex-row
    `};

    width: 100%;
    padding: 16px 38px;

    &:disabled {
        opacity: 0.2;
        cursor: default;
    }
    &:hover:enabled {
        opacity: 0.9;
    }
    &:focus {
        outline: none;
        opacity: 0.9;
    }
`;

export const PrimaryButtonOutlined = styled.button`
    ${tw`
        rounded-lg border-primary-dark border-solid
        m-4
        text-primary-dark font-bold
    `};
    border-width: 1px;
    &:disabled {
        opacity: 0.2;
        cursor: default;
    }
    &:hover:enabled {
        opacity: 0.75;
    }
    &:focus {
        outline: none;
        opacity: 0.9;
    }
`;

export const SecondaryButtonFull = styled.button`
    transition: 0.3s ease-in-out;
    ${tw`
        rounded-lg border-solid border-2
        bg-secondary-salad border-secondary-salad
        m-4
        text-primary-dark font-bold
    `};
    &:disabled {
        opacity: 0.2;
        cursor: default;
    }
    &:hover:enabled {
        opacity: 0.75;
    }
    &:focus {
        outline: none;
        opacity: 0.9;
    }
`;

export const SecondaryButtonFullFixed = styled.button`
    transition: 0.3s ease-in-out;
    ${tw`
        rounded-lg border-solid border-2
        bg-secondary-salad border-secondary-salad
        text-primary-dark font-bold text-xl
        fixed bottom-0 my-4
    `};

    left: 50%;
    transform: translateX(-50%);
    height: 68px;
    width: 93%;

    @media (min-width: 550px) {
        width: 480px;
    }

    &:disabled {
        opacity: 0.2;
        cursor: default;
    }
    &:hover:enabled {
        opacity: 0.75;
    }
    &:focus {
        outline: none;
        opacity: 0.9;
    }
`;
