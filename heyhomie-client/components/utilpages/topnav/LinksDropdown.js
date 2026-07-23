import { useTranslations } from 'next-intl';
import { DropdownContainer } from './styledComponents';
import useDropdown from '../../../hooks/useDropdown';

const DropdownButton = ({ text, handlePush, setIsOpen, path }) => {
    return (
        <button
            className={`
                transition ease-in-out duration-300
                p-2
                px-6
                out
                min-w-20
                bg-whiteStandard
                hover:bg-secondary-saladLight
                focus:outline-none focus:backgroundColor focus:bg-secondary-saladLight
            `}
            onClick={() => {
                setIsOpen(false);
                handlePush(path);
            }}
        >
            {text}
        </button>
    );
};

const LinksDropdown = ({ handlePush }) => {
    const { isOpen, setIsOpen, node, dropdownRef } = useDropdown();
    const t = useTranslations('CityPage.Topnav.LinksDropdown');

    let timeoutId;

    return (
        <DropdownContainer
            ref={node}
            onMouseLeave={() => {
                timeoutId = setTimeout(() => {
                    setIsOpen(false);
                }, 400);
            }}
        >
            <button
                className={`
                    transition ease-in-out duration-300
                    flex flex-wrap justify-center items-center
                    p-2
                    px-12px md:px-16px
                    bg-transparent
                    hover:bg-secondary-saladLight
                    focus:outline-none focus:backgroundColor focus:bg-secondary-saladLight
                `}
                style={{ borderRadius: '20px' }}
                onMouseOver={() => {
                    clearTimeout(timeoutId);

                    !isOpen && setIsOpen(true);
                }}
            >
                {t(`heading`)}
            </button>
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
                style={{
                    left: dropdownRef.current ? `calc(50% - ${dropdownRef.current.clientWidth / 2}px)` : `0px`,
                    backgroundColor: `#FFFFFF`,
                }}
                onMouseOver={() => clearTimeout(timeoutId)}
            >
                <DropdownButton text={t(`cleaning`)} path='/cleaning' handlePush={handlePush} setIsOpen={setIsOpen} />
                <DropdownButton text={t(`massage`)} path='/massage' handlePush={handlePush} setIsOpen={setIsOpen} />
                <DropdownButton text={t(`flowers`)} path='/flowers' handlePush={handlePush} setIsOpen={setIsOpen} />
            </div>
        </DropdownContainer>
    );
};

export default LinksDropdown;
