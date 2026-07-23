import Image from 'next/image';
import { useRouter } from 'next/router';
import useDropdown from '../../../hooks/useDropdown';

const languageNames = {
    pl: 'Polski',
    en: 'English',
};

const languages = ['en', 'pl'];

const LanguageButton = ({ language, onClick, currentLocale }) =>
    language !== currentLocale && (
        <button
            key={language}
            className='
            transition ease-in-out duration-300 p-2
             out min-w-20 bg-whiteStandard hover:bg-secondary-saladLight
            focus:outline-none focus:backgroundColor focus:bg-secondary-saladLight'
            onClick={() => onClick(language)}
        >
            <Image src={`/${language}.png`} alt='flag' width='20px' height='14px' />
            &nbsp;{languageNames[language]}
        </button>
    );

const ChangeLanguageWidget = ({ handleChangeLanguage, isEnoughSpace }) => {
    const router = useRouter();
    const { isOpen, setIsOpen, node, dropdownRef } = useDropdown();

    return (
        <div className='relative' ref={node}>
            <button
                className={`transition ease-in-out duration-300 flex flex-wrap justify-center items-center ${
                    isEnoughSpace ? 'p-2' : 'py-3'
                } px-2 bg-transparent hover:bg-secondary-saladLight focus:outline-none focus:backgroundColor focus:bg-secondary-saladLight`}
                style={{ borderRadius: '20px', minWidth: '36px' }}
                onMouseDown={() => setIsOpen(true)}
            >
                <Image src={`/${router.locale}.png`} alt='flag' width='20px' height='14px' />
                {isEnoughSpace ? <span className='pl-0.5'>{languageNames[router.locale]}</span> : null}
            </button>
            <div
                ref={dropdownRef}
                className={`
                    origin-top absolute right-0 mt-2
                    rounded-md shadow-lg overflow-hidden
                    w-24 flex flex-col content-end
                    transform transition ease-in-out duration-300
                    ${isOpen ? 'scale-100' : 'scale-0'}
                `}
                style={{ left: dropdownRef.current ? `calc(50% - ${dropdownRef.current.clientWidth / 2}px)` : `0px`, backgroundColor: `#FFFFFF` }}
            >
                {languages.map(language => (
                    <LanguageButton key={language} language={language} onClick={handleChangeLanguage} currentLocale={router.locale} />
                ))}
            </div>
        </div>
    );
};

export default ChangeLanguageWidget;
