import Image from 'next/image';
import { SocialMediaLinksContainer } from './styledComponents';

const SocialMediaLinks = () => {
    return (
        <SocialMediaLinksContainer>
            <a target='_blank' href='https://www.instagram.com/heyhomie.io'>
                <Image src='/icons/instagram_turquoise.svg' width={32} height={32} />
            </a>
            <a target='_blank' href='https://www.facebook.com/heyhomie.io/'>
                <Image src='/icons/facebook_turquoise.svg' width={32} height={32} />
            </a>
            <a target='_blank' href='https://wa.me/+48530277998'>
                <Image src='/icons/whatsapp_turquoise.svg' width={32} height={32} />
            </a>
            <a target='_blank' href='https://www.linkedin.com/company/heyhomie-io'>
                <Image src='/icons/linkedin_turquoise.svg' width={32} height={32} />
            </a>
        </SocialMediaLinksContainer>
    );
};

export default SocialMediaLinks;
