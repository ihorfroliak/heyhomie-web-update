import { useDispatch, useSelector } from 'react-redux';
import { useTranslations } from 'next-intl';
import { setSelectedCity } from '../../../lib/slices/userSlice';
import Spinner from '../../ui/Spinner';
import useDropdown from '../../../hooks/useDropdown';

const ChangeCityWidget = ({ cities, handleChangeCity, promptChangeCityResetOrderMenu, isEnoughSpace }) => {
    const { user, order } = useSelector(state => state);
    const { node, isOpen, setIsOpen } = useDropdown();
    const dispatch = useDispatch();
    const t = useTranslations('CityPage.Topnav');

    const handleCityChange = city => {
        if (order && order.services.filter(s => s.statusLocal !== 'staging').length > 0) {
            promptChangeCityResetOrderMenu({ name: city.name, id: city.id });
        } else {
            dispatch(setSelectedCity({ selectedCity: city.name, selectedCityID: city.id }));
            handleChangeCity(city.name);
        }
        setIsOpen(false);
    };

    return (
        <div className='relative block'>
            {user && user.selectedCity ? (
                <div>
                    <button
                        className={`
                            transition ease-in-out duration-300
                            p-2
                            px-12px md:px-16px
                            bg-transparent
                            hover:bg-secondary-saladLight
                            focus:outline-none focus:backgroundColor focus:bg-secondary-saladLight
                        `}
                        style={{ borderRadius: '20px', width: 'max-content' }}
                        onMouseDown={() => setIsOpen(true)}
                    >
                        <svg
                            className='inline-block'
                            width={isEnoughSpace ? '11' : '16'}
                            height={isEnoughSpace ? '15' : '20'}
                            viewBox='0 0 11 15'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path
                                d='M5.49263 14.2456C5.19684 14.2456 4.93196 14.0922 4.78412 13.8353C4.78256 13.8326 4.78105 13.8298 4.77954 13.8271L1.41928 7.67664C0.617185 6.20851 0.640184 4.46592 1.48082 3.01523C2.30322 1.59598 3.76396 0.72891 5.38833 0.695774C5.45772 0.694345 5.52749 0.694345 5.59683 0.695774C7.22122 0.72891 8.68197 1.59598 9.50439 3.01523C10.345 4.46592 10.368 6.20848 9.56593 7.67664L6.20567 13.8271C6.20416 13.8298 6.20265 13.8326 6.20109 13.8353C6.05327 14.0922 5.78842 14.2456 5.49263 14.2456ZM5.4926 1.54165C5.46352 1.54165 5.43451 1.54194 5.40556 1.54252C4.0796 1.56957 2.88633 2.27885 2.21357 3.43986C1.52261 4.63232 1.5035 6.06435 2.16249 7.27054L5.4926 13.3658L8.82269 7.27056C9.48168 6.06435 9.4626 4.63232 8.77158 3.43986C8.09883 2.27888 6.90555 1.56957 5.5796 1.54252C5.55072 1.54194 5.52169 1.54165 5.4926 1.54165Z'
                                fill='#141338'
                            />
                            <path
                                d='M5.49129 6.835C4.44054 6.835 3.58569 5.98015 3.58569 4.9294C3.58569 3.87865 4.44054 3.0238 5.49129 3.0238C6.54204 3.0238 7.39689 3.87865 7.39689 4.9294C7.39689 5.98015 6.54207 6.835 5.49129 6.835ZM5.49129 3.87074C4.90754 3.87074 4.43263 4.34565 4.43263 4.9294C4.43263 5.51315 4.90754 5.98807 5.49129 5.98807C6.07504 5.98807 6.54996 5.51315 6.54996 4.9294C6.54996 4.34565 6.07504 3.87074 5.49129 3.87074Z'
                                fill='#141338'
                            />
                            <path
                                fillRule='evenodd'
                                clipRule='evenodd'
                                d='M5.49085 6.90503C4.40191 6.90503 3.51611 6.01923 3.51611 4.9303C3.51611 3.84137 4.40191 2.95557 5.49085 2.95557C6.57978 2.95557 7.46558 3.84137 7.46558 4.9303C7.46558 6.01923 6.57981 6.90503 5.49085 6.90503ZM5.49085 3.94077C4.94528 3.94077 4.50132 4.38474 4.50132 4.9303C4.50132 5.47586 4.94528 5.91983 5.49085 5.91983C6.03641 5.91983 6.48037 5.47586 6.48037 4.9303C6.48037 4.38474 6.03641 3.94077 5.49085 3.94077ZM3.58525 4.9303C3.58525 5.98105 4.4401 6.8359 5.49085 6.8359C6.54162 6.8359 7.39644 5.98105 7.39644 4.9303C7.39644 3.87955 6.5416 3.0247 5.49085 3.0247C4.4401 3.0247 3.58525 3.87955 3.58525 4.9303ZM4.43218 4.9303C4.43218 4.34655 4.9071 3.87164 5.49085 3.87164C6.07459 3.87164 6.54951 4.34655 6.54951 4.9303C6.54951 5.51405 6.07459 5.98896 5.49085 5.98896C4.9071 5.98896 4.43218 5.51405 4.43218 4.9303Z'
                                fill='#141338'
                            />
                        </svg>
                        &nbsp;{user && user.selectedCity ? t(`cityNames.${user.selectedCity}`) : ''}
                    </button>
                    <div
                        ref={node}
                        className={`
                            origin-top absolute right-0 mt-2 rounded-md shadow-lg overflow-hidden
                            min-w-full
                            flex flex-col content-end
                            transform
                            transition ease-in-out duration-300
                            ${isOpen ? 'scale-100' : 'scale-0'}
                        `}
                    >
                        {cities.map(
                            city =>
                                city.name !== user.selectedCity && (
                                    <button
                                        key={city.name}
                                        className={`
                                        transition ease-in-out duration-300
                                        p-2
                                        out
                                        bg-whiteStandard
                                        hover:bg-secondary-saladLight
                                        focus:outline-none focus:backgroundColor focus:bg-secondary-saladLight
                                    `}
                                        onClick={() => handleCityChange(city)}
                                    >
                                        {t(`cityNames.${city.name}`)}
                                    </button>
                                )
                        )}
                    </div>
                </div>
            ) : (
                <Spinner />
            )}
        </div>
    );
};

export default ChangeCityWidget;
