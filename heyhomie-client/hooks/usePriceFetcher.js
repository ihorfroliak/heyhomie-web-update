import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { calculateServicePrice } from '../api/endpoints/services';
import { _incrementTotalOrderPrice } from '../lib/slices/orderSlice';

function usePriceFetcher(service, priceApiConfig) {
    const { user } = useSelector(state => state);
    const dispatch = useDispatch();

    const [priceFromAPI, setPriceFromAPI] = useState('');
    const [hoursFromAPI, setHoursFromAPI] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchPriceFromAPI() {
            if (isLoading) {
                setPriceFromAPI(priceFromAPI => priceFromAPI);
                return;
            }

            const payload = {
                service: { ...priceApiConfig, type: service.type },
            };

            setIsLoading(true);

            try {
                const { price, duration } = await calculateServicePrice(
                    user.headers,
                    user.x_token_user,
                    user.x_token_visitor,
                    service.homie_service_id,
                    payload
                );

                if (service.statusLocal) {
                    dispatch(_incrementTotalOrderPrice({ price: price, hours: duration, homie_service_id: service.homie_service_id }));
                }
                setPriceFromAPI(price);
                setHoursFromAPI(duration);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchPriceFromAPI();
    }, [service.statusLocal, service.config]);

    return { priceFromAPI, hoursFromAPI, isLoading };
}
export default usePriceFetcher;
