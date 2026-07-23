import React from 'react';
import {
    TwitterShareButton,
    TwitterIcon,
    FacebookShareButton,
    FacebookShareCount,
    FacebookIcon,
    WhatsappShareButton,
    WhatsappIcon,
    FacebookMessengerShareButton,
    FacebookMessengerIcon,
} from 'react-share';

import tw, { css, styled, theme } from 'twin.macro';

const SocialShareContainer = styled.div`
    width: 100%;

    margin-top: 0.5em;
    margin-bottom: 0.8em;

    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;

    .react-share__ShareButton {
        margin: 4px;
    }
`;

const SocialShare = ({ title, url }) => {
    return (
        <SocialShareContainer>
            <FacebookShareButton url={url} title={title}>
                <FacebookIcon size={40} borderRadius={8} />
                <FacebookShareCount url={url} />
            </FacebookShareButton>
            <TwitterShareButton url={url} title={title}>
                <TwitterIcon size={40} borderRadius={8} />
            </TwitterShareButton>
            <FacebookMessengerShareButton url={url} title={title} appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}>
                <FacebookMessengerIcon size={40} borderRadius={8} />
            </FacebookMessengerShareButton>
            <WhatsappShareButton url={url} title={title}>
                <WhatsappIcon size={40} borderRadius={8} />
            </WhatsappShareButton>
        </SocialShareContainer>
    );
};

export default SocialShare;
