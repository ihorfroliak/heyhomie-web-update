import Image from 'next/image';
import useDropdown from '../../../hooks/useDropdown';
import { DropdownContainer } from './styledComponents';

const DropdownButton = ({ onClick, label }) => (
    <button
        className={`
            transition ease-in-out duration-300
            p-2 px-6 out w-32
            bg-whiteStandard
            hover:bg-secondary-saladLight
            focus:outline-none focus:backgroundColor focus:bg-secondary-saladLight
        `}
        onClick={onClick}
    >
        {label}
    </button>
);

const ContactInformationDropdown = ({ isEnoughSpace }) => {
    const { isOpen, setIsOpen, node, dropdownRef } = useDropdown();

    const handleLinkClick = url => {
        setIsOpen(false);
        window.open(url, '_blank');
    };

    return (
        <DropdownContainer ref={node} onMouseLeave={() => setIsOpen(false)}>
            {isEnoughSpace ? (
                <div className='flex flex-row justify-between w-28'>
                    {/* Social Icons */}
                    <a target='_blank' href='https://www.instagram.com/heyhomie.io'>
                        <Image src='/icons/instagram.svg' alt='Instagram account icon' width={32} height={32} />
                    </a>
                    <a target='_blank' href='https://www.facebook.com/heyhomie.io/'>
                        <Image src='/icons/facebook.svg' alt='Facebook account icon' width={32} height={32} />
                    </a>
                    <a target='_blank' href='https://wa.me/+48530277998'>
                        <Image src='/icons/whatsapp.svg' alt='WhatsApp account icon' width={32} height={32} />
                    </a>
                </div>
            ) : (
                <div className='flex flex-row'>
                    <a target='_blank' href='https://www.instagram.com/heyhomie.io'>
                        <Image src='/icons/instagram.svg' alt='Instagram account icon' width={32} height={32} />
                    </a>
                    <button
                        className={`
                        transition ease-in-out duration-300
                        flex flex-wrap justify-center items-center
                        px-2 py-1
                        bg-transparent
                        hover:bg-secondary-saladLight
                        focus:outline-none focus:backgroundColor focus:bg-secondary-saladLight
                    `}
                        style={{ borderRadius: '20px' }}
                        onMouseOver={() => setIsOpen(true)}
                    >
                        <Image src='/icons/phone-call.png' alt='phone-call' width={32} height={32} />
                    </button>
                </div>
            )}
            <div
                ref={dropdownRef}
                className={`
                    origin-top absolute mt-2 rounded-md shadow-lg overflow-hidden
                    min-w-10
                    flex flex-col content-end
                    transform
                    transition ease-in-out duration-300
                    ${isOpen ? 'scale-100' : 'scale-0'}
                `}
                style={{ left: dropdownRef.current ? `calc(50% - ${dropdownRef.current.clientWidth / 2}px)` : `0px`, backgroundColor: `#FFFFFF` }}
            >
                <DropdownButton
                    onClick={() => {
                        window.location.href = `tel:+48530277998`;
                    }}
                    label={'Call Center'}
                />
                {/* <DropdownButton onClick={() => handleLinkClick('https://instagram.com/heyhomie.io')} label={'Instagram'} /> */}
                <DropdownButton onClick={() => handleLinkClick('https://www.facebook.com/heyhomie.io')} label={'Facebook'} />
                <DropdownButton onClick={() => handleLinkClick('https://wa.me/+48530277998')} label={'WhatsApp'} />
            </div>
        </DropdownContainer>
    );
};

export default ContactInformationDropdown;
