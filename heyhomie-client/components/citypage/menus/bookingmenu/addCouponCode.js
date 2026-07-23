import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { toast } from 'react-toastify';

import { keyframes } from 'styled-components';
import tw, { css, styled, theme } from 'twin.macro';
import { addCoupon } from '../../../../api/endpoints/user';
import { synchronizeCouponData } from '../../../../lib/slices/userSlice';
import { TextInput } from '../../../ui/Input';
import Spinner from '../../../ui/Spinner';

const AddCouponCodeContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 24px;
    padding-bottom: 24px;
`;

const AddCouponCode = () => {
    // UI translations
    const t = useTranslations('CityPage.ValidatePaymentConfirmOrderMenu.AddCouponCode');

    // Redux global state
    const dispatch = useDispatch();
    const { user } = useSelector(state => state);

    // Component state
    const [formOpen, setFormOpen] = useState(false);

    // Add coupon
    const [couponInput, setCouponInput] = useState('');
    const [isLoading, setIsloading] = useState(false);

    const handleAddCoupon = async () => {
        setIsloading(true);
        try {
            const res = await addCoupon(user.headers, user.x_token_user, couponInput);

            toast.success(t(`coupon_added_toast`));
            setIsloading(false);
            setCouponInput('');
            setFormOpen(false);
            dispatch(synchronizeCouponData());
        } catch (err) {
            setIsloading(false);
            if (err.response && err.response.data && err.response.data.errors[0].code) {
                switch (err.response.data.errors[0].code) {
                    case 'coupon_is_duplicate': {
                        toast.warning(t(`coupon_duplicate_toast`));
                        break;
                    }
                    case 'not_found': {
                        toast.error(t(`coupon_not_valid_toast`));
                        break;
                    }
                    case 'coupon_has_expired': {
                        toast.error(t(`coupon_has_expired`));
                        break;
                    }
                    case 'coupon_is_not_active_yet': {
                        toast.warning(t(`coupon_is_not_active_yet`));
                        break;
                    }
                    case 'user_already_ordered': {
                        toast.error(t(`user_already_ordered`));
                        break;
                    }
                    case 'user_has_referral_coupon': {
                        toast.error(t(`user_has_referral_coupon`));
                        break;
                    }
                    case 'user_identical_to_sponsor': {
                        toast.error(t(`user_identical_to_sponsor`));
                        break;
                    }
                    default: {
                        toast.error(t(`coupon_error_generic_toast`));
                        break;
                    }
                }
            }
            dispatch(synchronizeCouponData());
        }
    };

    return (
        <AddCouponCodeContainer>
            {formOpen ? (
                <div className='relative w-full px-40px'>
                    <TextInput
                        styleLabel={{
                            position: 'relative',
                            width: '100%',
                            margin: 0,
                        }}
                        disabled={isLoading}
                        value={couponInput}
                        onChange={e => setCouponInput(e.target.value)}
                        placeholder={t(`addCoupon_placeholder`)}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            right: '48px',
                            top: '12px',
                        }}
                    >
                        {!isLoading ? (
                            <button onClick={() => handleAddCoupon()} disabled={!couponInput}>
                                OK
                            </button>
                        ) : (
                            <Spinner />
                        )}
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setFormOpen(true)}
                    style={{
                        fontSize: '18px',
                        color: '#14133A',
                    }}
                >
                    {t(`switchToAddCouponForm_btn`)}
                </button>
            )}
        </AddCouponCodeContainer>
    );
};

export default AddCouponCode;
