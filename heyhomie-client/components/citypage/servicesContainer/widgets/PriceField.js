import { useTranslations } from 'next-intl';
import tw, { css, styled } from 'twin.macro';

import Spinner from '../../../ui/Spinner';
import usePriceFetcher from '../../../../hooks/usePriceFetcher';

const PriceField = ({ service, config, minOrderValue, priceFieldMessage }) => {
    const t = useTranslations('CityPage.ServiceConfig');

    const { priceFromAPI, isLoading } = usePriceFetcher(service, config);

    return (
        <div className='py-6 text-xs md:text-base'>
            <div className='w-full'>{priceFieldMessage && <span>{t(priceFieldMessage)}</span>}</div>
            <div className='flex justify-between py-2'>
                <div className={`flex flex-row flex-wrap justify-start items-center font-bold`}>
                    {t(`price`)}&nbsp;
                    {minOrderValue && (
                        <span className='font-normal'>
                            ({t(`minOrderValue`)} {minOrderValue}zł)
                        </span>
                    )}
                </div>
                <div>
                    {isLoading ? (
                        <div className={'w-6/12 flex justify-center justify-self-center'}>
                            <Spinner />
                        </div>
                    ) : (
                        <div className={`w-12 font-bold text-center text-primary-dark`}>{priceFromAPI}zł</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PriceField;
