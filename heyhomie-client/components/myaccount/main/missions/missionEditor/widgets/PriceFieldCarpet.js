import { useTranslations } from 'next-intl';
import tw, { css, styled, theme } from 'twin.macro';

import Spinner from '../../../../../ui/Spinner';
import usePriceFetcher from '../../../../../../hooks/usePriceFetcher';

const StyledContainer = styled.div`
    position: relative;

    ${props =>
        props.separated
            ? css`
                  border-bottom: solid 1px;
              `
            : css``};
    padding-top: 24px;
    padding-bottom: 8px;

    ${tw`
        flex flex-row flex-wrap items-center
    `};

    border-color: #e2e2eb;
`;

const PriceFieldCarpet = ({ service, config, minOrderValue, priceFieldMessage }) => {
    const t = useTranslations('CityPage.ServiceConfig');

    const { priceFromAPI, isLoading } = usePriceFetcher(service, config);

    return (
        <StyledContainer separated={false}>
            {priceFieldMessage ? (
                <div
                    className={`
                        absolute top-0 text-12px pt-1
                    `}
                >
                    {t(priceFieldMessage)}
                </div>
            ) : null}
            <div className={`font-bold w-8/12`}>
                <div
                    className={`
                        relative
                        flex flex-row flex-wrap justify-start items-center
                    `}
                >
                    <div style={{ width: 'fit-content' }}>
                        {t(`price`)}{' '}
                        {minOrderValue ? (
                            <span style={{ fontWeight: 'normal' }}>
                                ({t(`minOrderValue`)} {minOrderValue}zł)
                            </span>
                        ) : null}
                    </div>
                </div>
            </div>
            <div
                className={`
                    w-4/12 h-8
                    flex flex-wrap flex-row justify-end items-center
                `}
            >
                {isLoading ? (
                    <div style={{ width: '50%', justifySelf: 'center', display: 'flex', justifyContent: 'center' }}>
                        <Spinner />
                    </div>
                ) : (
                    <div
                        className={`
                            font-bold text-center text-primary-dark
                        `}
                        style={{
                            fontSize: '18px',
                            width: '50px',
                            marginRight: '.5rem',
                        }}
                    >
                        {priceFromAPI}zł
                    </div>
                )}
            </div>
        </StyledContainer>
    );
};

export default PriceFieldCarpet;
