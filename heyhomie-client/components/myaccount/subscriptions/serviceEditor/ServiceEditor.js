import { useTranslations } from 'next-intl';

import { servicesConfigSwitch } from '../../../../api/servicesConfig';

import PriceField from './widgets/PriceField';
import PriceFieldCarpet from '../../main/missions/missionEditor/widgets/PriceFieldCarpet';
import useWidgets from '../../../../hooks/useWidgets';

const ServiceConfigEditor = ({ service, setService }) => {
    const t = useTranslations('CityPage.ServiceConfig');

    const { widgets, minOrderValue } = servicesConfigSwitch(service.type);

    const switchWidget = useWidgets(service, setService);

    return (
        <div style={{ width: 'calc(100% - 8px)' }}>
            {widgets && widgets.main && service.type === 'cleaning' ? (
                widgets.main.filter(({ name }) => name !== 'frequency' && name !== 'cleaning_house_size').map(widget => switchWidget(widget))
            ) : (
                <TwoColumnBlockGroup options={widgets.main} service={service} setService={setService} />
            )}
            {widgets && widgets.groups ? (
                <>
                    {widgets.groups.map(group => (
                        <>
                            <div className={`font-bold w-5/5 py-6`}>{t(`${group.groupTitle}`)}</div>
                            {group.widgets && group.widgets.map(widget => switchWidget(widget))}
                        </>
                    ))}
                </>
            ) : null}
            {widgets && widgets.additional && (
                <>
                    <div className={`font-bold w-full py-24px relative border-b border-borderColor`}>
                        <div className={`relative h-32px flex justify-start items-center`}>
                            <div>{t(`additionalOptions`)}</div>
                        </div>
                    </div>
                    {service.type === 'cleaning' ? (
                        // <div className='w-full flex flex-col justify-center items-center pt-2 pb-6 md:pb-8 gap-y-2 md:gap-y-4 border-b border-borderColor'>
                        //     {widgets &&
                        //         widgets.additional.map(widget => <div className='w-full flex justify-between items-center'>{switchWidget(widget)}</div>)}
                        //     {/* //! TODO: Add functionality fot Reset button */}
                        //     {/* <div className='w-full flex justify-end items-center py-3'>
                        //     <button className='text-primary-pink text-xs md:text-sm'>{t('additionalOptions_reset_btn')}</button>
                        // </div> */}
                        // </div>
                        <div>{t(`additionalOptions`)}</div>
                    ) : (
                        <TwoColumnBlockGroup options={widgets.additional} service={service} setService={setService} />
                    )}
                </>
            )}
            {service.type !== 'carpet' ? (
                <PriceField service={service} config={service.config} minOrderValue={minOrderValue} priceFieldMessage={widgets.priceFieldMessage} />
            ) : (
                <PriceFieldCarpet service={service} config={service.config} minOrderValue={100} priceFieldMessage={widgets.priceFieldMessage} />
            )}
        </div>
    );
};

export default ServiceConfigEditor;
