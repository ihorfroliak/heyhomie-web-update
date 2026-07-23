import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { animated } from 'react-spring';
import { initialConfigSwitch } from '../../../api/servicesConfig';
import {
    initOrderSession,
    initService,
    _closeAllServiceConfigCards,
    _setServiceDeleted,
    _toggleServiceConfigCardExpanded,
} from '../../../lib/slices/orderSlice';

const ServiceCard = ({ service, handleChangeBackgroundImg, handleSetDefaultImageCopy, handleResetBackgroundImg, isDragging, servicesConfigContainerRef }) => {
    const t = useTranslations('CityPage.ServiceGeneral');

    const dispatch = useDispatch();
    const { order } = useSelector(state => state);

    const [selected, setSelected] = useState(
        order && order.services.find(s => s.homie_service_id === service.id) ? order.services.find(s => s.homie_service_id === service.id) : {}
    );

    const [x, setX] = useState('');
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseDown = event_ => {
        setX(event_.screenX);
    };

    const handleClick = async event_ => {
        const delta = Math.abs(event_.screenX - x);

        if (delta > 10) {
            event_.preventDefault();
            setX('');
        } else {
            if (service.open && Object.keys(selected).length === 0) {
                try {
                    if (order && (!order.id || Math.round(Date.now() / 1000) >= order.expires_at)) {
                        await dispatch(initOrderSession());
                    }

                    const { config, address, date_time: dateTime } = initialConfigSwitch(service.name);

                    const serviceToInit = {
                        city_id: service.city_id,
                        homie_service_id: service.id,
                        type: service.name,
                        icon_image: service.icon_image,
                        statusLocal: 'staging',
                        cardExpanded: true,
                        available_params: {
                            opening_days: service.opening_days,
                            opening_hour: service.opening_hour,
                            closing_hour: service.closing_hour,
                            minimum_bookable_hour: service.minimum_bookable_hour,
                        },
                        config,
                        address,
                        date_time: dateTime,
                    };

                    dispatch(_closeAllServiceConfigCards());

                    dispatch(initService(serviceToInit));

                    handleSetDefaultImageCopy(service.header_background_image, service.name);

                    window &&
                        window.scrollTo({
                            top: servicesConfigContainerRef.current.getBoundingClientRect().top,
                        });
                    servicesConfigContainerRef.current && servicesConfigContainerRef.current.scrollIntoView(true);
                } catch (error) {
                    console.error(error);
                }
            } else if (service.open && Object.keys(selected).length > 0 && selected.statusLocal === 'staging') {
                dispatch(
                    _toggleServiceConfigCardExpanded({
                        homie_service_id: selected.homie_service_id,
                        expanded: false,
                    })
                );
                dispatch(
                    _setServiceDeleted({
                        homie_service_id: selected.homie_service_id,
                    })
                );
            }
            setX('');
        }
    };

    useEffect(() => {
        if (order && order.services.find(s => s.homie_service_id === service.id)) {
            setSelected(order.services.find(s => s.homie_service_id === service.id));
        } else {
            setSelected({});
        }
    }, [order]);

    return (
        <animated.button
            className={`
                relative
                overflow-hidden
                flex
                flex-col
                justify-between
                items-center
                shadow-surface2
                rounded-md
                transition
                ease-out
                duration-200
                focus:outline-none
                keen-slider__slide
            `}
            style={{
                userSelect: 'none',
                minWidth: '150px',
                maxWidth: '150px',
                width: '150px',
                height: '110px',
                backgroundColor: 'white',
                border: service.open && '1px solid #E4E4E7',
            }}
            disabled={selected && selected.isLoading}
            onMouseEnter={() => {
                if (!isDragging) {
                    handleChangeBackgroundImg(service.header_background_image, service.name);
                    setIsHovered(true);
                }
            }}
            onMouseLeave={() => {
                const serviceSelectedAndExpanded =
                    order &&
                    order.services &&
                    order.services.find(s => s.type === service.name) &&
                    order.services.find(s => s.type === service.name).cardExpanded;
                if (!serviceSelectedAndExpanded) {
                    handleResetBackgroundImg();
                }
                setIsHovered(false);
            }}
            onMouseDown={e => handleMouseDown(e)}
            onClick={e => handleClick(e)}
        >
            <div
                className={`
                    relative
                    overflow-hidden
                    flex
                    flex-col
                    justify-between
                    items-center
                    transition
                    ease-out
                    duration-200
                `}
                style={{
                    backgroundColor: Object.keys(selected).length > 0 || isHovered ? service.icon_hex_color : '#FFFFFF',
                    width: '100%',
                    height: '100%',
                }}
            >
                <div style={{ marginTop: '12px' }}>
                    <img
                        draggable={false}
                        src={service.icon_image}
                        style={{
                            height: '70px',
                        }}
                    />
                </div>
                <div className={`font-bold text-14px`} style={{ marginBottom: '12px' }}>
                    {t(`${service.name.toLowerCase()}.name`)}
                </div>
            </div>
            {service.open ? null : (
                <div
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(20, 19, 58, 0.6)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div className={`text-12px font-bold`} style={{ color: 'white' }}>
                        {t(`coming_soon`)}
                    </div>
                </div>
            )}
        </animated.button>
    );
};

export default ServiceCard;
