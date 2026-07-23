import { theme, styled } from 'twin.macro';

export const FooterContainer = styled.footer`
    width: 100%;
    min-height: 310px;

    position: relative;

    background-color: ${theme`colors.primary.dark`};
    color: white;

    padding: 64px 32px;

    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;

    @media (max-width: 788px) {
        padding-top: 48px;
    }
`;

export const LinksDiv = styled.div`
    height: max-content;

    display: grid;
    grid-auto-flow: column;

    @media (max-width: 607px) {
        margin-top: 2em;
        grid-auto-flow: row;
        grid-template-columns: 1fr 1fr;

        div {
            margin-top: 0.5em;
        }
    }

    @media (max-width: 788px) {
        order: 2;
    }

    div {
        display: flex;
        flex-direction: column;
        padding-inline: 1em;

        h3 {
            color: ${theme`colors.secondary.salad`};
            font-weight: bold;
            font-size: 24px;
        }
        a,
        button {
            font-size: 18px;
            &:focus {
                outline: none;
            }
            &:disabled {
                cursor: default;
            }
        }
    }
`;

export const ContactInformationContainer = styled.div`
    width: 182px;
    display: flex;
    flex-direction: column;

    @media (max-width: 788px) {
        flex-direction: column-reverse;
    }
`;

export const ContactManagerContainer = styled.div`
    position: relative;

    margin-bottom: 1em;

    display: flex;
    justify-content: space-between;

    & > div {
        font-size: 24px;
    }
    a {
        font-size: 18px;
    }
`;

export const SocialMediaLinksContainer = styled.div`
    width: max-content;

    margin-bottom: 1em;

    display: flex;
    flex-direction: row;
    gap: 1em;

    * {
        height: 32px;
    }
`;
