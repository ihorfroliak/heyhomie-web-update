import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { styled } from 'twin.macro';

import { servicesConfigSwitch } from '../../../api/servicesConfig';
import { synchronizeServicesConfig } from '../../../lib/slices/orderSlice';

import PriceField from './widgets/PriceField';
import PriceFieldCarpet from './widgets/PriceFieldCarpet';
import useWidgets from '../../../hooks/useWidgets';
import { PrimaryButtonFullSticky } from '../../ui/Buttons';
import { convertMinutes } from '../../../api/timeUtils';
import TwoColumnBlockGroup from './widgets/TwoColumnBlockGroup';

const StyledRoomsContainer = styled.div`
    div:nth-child(2) button {
        background-color: #414483;
    }
`;

const ServiceConfigEditor = ({ service }) => {
    const t = useTranslations('CityPage.ServiceConfig');

    const dispatch = useDispatch();

    const { widgets, minOrderValue } = servicesConfigSwitch(service.type);

    const switchWidget = useWidgets(service);

    const { order } = useSelector(state => state);

    const [totalPrice, setTotalPrice] = useState(0);
    const [totalHours, setTotalHours] = useState(0);

    useEffect(() => {
        // Calculate total price if services exist
        if (order.services.length > 0 && order.totalOrderPrice) {
            setTotalPrice(Object.values(order.totalOrderPrice).reduce((a, { price: b }) => a + b, 0));
            setTotalHours(order.totalOrderPrice[1]?.hours ? order.totalOrderPrice[1].hours : 0);
        }
    }, [order]);

    return (
        <>
            {widgets && widgets.rooms && (
                <div className='py-6 md:py-8 border-b border-borderColor'>
                    <p className='w-full text-center md:mb-6 font-bold text-lg hidden md:block'>Rooms</p>
                    <StyledRoomsContainer className='w-full flex flex-wrap md:flex-nowrap justify-center gap-x-6 gap-y-6 '>
                        {widgets.rooms.map(widget => switchWidget(widget))}
                    </StyledRoomsContainer>
                </div>
            )}

            {widgets && widgets.main && service.type !== 'upholstery' ? (
                widgets.main.map(widget => switchWidget(widget))
            ) : (
                <TwoColumnBlockGroup options={widgets.main} service={service} />
            )}
            {widgets && widgets.groups && (
                <>
                    {widgets.groups.map(group => (
                        <>
                            <div className={`font-bold w-5/5 py-6`}>{t(`${group.groupTitle}`)}</div>
                            {group.widgets && group.widgets.map(widget => switchWidget(widget))}
                        </>
                    ))}
                </>
            )}
            {widgets && widgets.additional && (
                <>
                    <div className={`font-bold w-full pt-6 md:pt-8 relative`}>
                        <div className={`relative h-32px flex justify-start items-center`}>
                            <div>{t(`additionalOptions`)}</div>
                        </div>
                    </div>
                    {service.type === 'cleaning' ? (
                        <div className='w-full flex flex-col justify-center items-center pt-2 pb-6 md:pb-8 gap-y-2 md:gap-y-4 border-b border-borderColor'>
                            {widgets &&
                                widgets.additional.map(widget => <div className='w-full flex justify-between items-center'>{switchWidget(widget)}</div>)}
                            {/* //! TODO: Add functionality fot Reset button */}
                            {/* <div className='w-full flex justify-end items-center py-3'>
                            <button className='text-primary-pink text-xs md:text-sm'>{t('additionalOptions_reset_btn')}</button>
                        </div> */}
                        </div>
                    ) : (
                        <TwoColumnBlockGroup options={widgets.additional} service={service} />
                    )}
                </>
            )}
            {service.type === 'carpet' ? (
                <PriceFieldCarpet service={service} config={service.config} minOrderValue={100} priceFieldMessage={widgets.priceFieldMessage} />
            ) : (
                <PriceField service={service} config={service.config} minOrderValue={minOrderValue} priceFieldMessage={widgets.priceFieldMessage} />
            )}

            <div className='w-full flex justify-center'>
                <PrimaryButtonFullSticky
                    onClick={() => {
                        // eslint-disable-next-line no-unused-expressions
                        window && window.scrollTo({ top: 0 });
                        dispatch(synchronizeServicesConfig(t));
                    }}
                >
                    {service.type === 'cleaning' && totalHours > 0 ? <div className='hidden md:block w-20 h-5' /> : <div />}
                    <div className='flex justify-center items-center w-full md:w-max'>
                        <span className='mr-2'>
                            {t(`priceFieldMessage_btn`)}&nbsp;
                            {totalPrice} zł
                        </span>
                        <Image src='/icons/lightning_bolt.svg' alt='lightning_bolt' width={20} height={20} />
                    </div>
                    <div className='flex justify-center items-center font-normal'>
                        {service.type === 'cleaning' && totalHours > 0 ? (
                            <span className='text-xs flex justify-center items-center'>
                                ca. &nbsp;
                                <span className='font-bold'>{convertMinutes(totalHours)} h</span>&nbsp;
                                <Image src='/icons/clock.svg' alt='clock' width={20} height={20} />
                            </span>
                        ) : (
                            <span />
                        )}
                    </div>
                </PrimaryButtonFullSticky>
            </div>
        </>
    );
};

export default ServiceConfigEditor;
