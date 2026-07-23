import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';

import { useDispatch, useSelector } from 'react-redux';

import tw, { css, styled, theme } from 'twin.macro';

import { deleteServiceFromOrderAndState, _toggleServiceConfigCardExpanded, _decrementTotalOrderPrice } from '../../../../lib/slices/orderSlice';
import { _pushToOverlayActionStack, _removeFromOverlayActionStack, _toggleMenu } from '../../../../lib/slices/uiSlice';
import stylesShaking from '../../../../styles/ShakingText.module.css';

const StyledServiceCard = styled.div`
    position: relative;

    width: 100%;
    height: 166px;

    margin-bottom: 16px;

    padding: 24px;

    box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.05);

    border-radius: 8px;

    ${props =>
        props.active
            ? css`
                  background-color: #f5fbff;
                  box-shadow: inset 0px 0px 4px 2px rgba(0, 0, 0, 0.05);
              `
            : ``};

    transition: 0.2s ease-in-out;
`;

const EditButton = styled.button`
    position: absolute;
    right: 24px;
    top: 24px;
`;

const DeleteButton = styled.button`
    position: absolute;
    right: 64px;
    top: 25px;

    @media (min-width: 1200px) {
        animation-duration: 0.3s;
        animation-fill-mode: forwards;
        ${props =>
            props.isVisible
                ? css`
                      animation-name: fadeIn;
                  `
                : css`
                      animation-name: fadeOut;
                  `};
    }

    @keyframes fadeIn {
        0% {
            opacity: 0;

            visibility: hidden;
        }
        1% {
            opacity: 0;

            visibility: visible;
        }
        100% {
            opacity: 1;

            visibility: visible;
        }
    }

    @keyframes fadeOut {
        0% {
            opacity: 1;

            visibility: visible;
        }
        99% {
            opacity: 0;

            visibility: visible;
        }
        100% {
            opacity: 0;

            visibility: hidden;
        }
    }
`;

const ServiceCardBooking = ({ service, isAddressOrTimeEdited, isAnimating }) => {
    // UI translations for the component
    const router = useRouter();
    const t = useTranslations('CityPage.BookingMenu');

    const dispatch = useDispatch();
    const { ui, order, user } = useSelector(state => state);

    const active = ui.overlayActionsStack.some(stackItem => stackItem.includes(service.type));

    // Delete button visibility
    const [isDeleteBtnVisible, setIsDeleteBtnVisible] = useState(false);

    // Utils
    const parseDateTime = date_timeObject => {
        const { locale } = router;
        let month = new Date(date_timeObject * 1000).toLocaleString(locale, { month: 'long' });
        month = month.charAt(0).toUpperCase() + month.slice(1);

        const day = new Date(date_timeObject * 1000).getUTCDate();

        const year = new Date(date_timeObject * 1000).getUTCFullYear();

        const time = new Date(date_timeObject * 1000).getUTCHours();

        const string = `${month} ${day}, ${year} ${t(`ServiceCard.utils.time_at`)} ${time}:00`;
        return string;
    };

    return (
        <StyledServiceCard active={active} onMouseEnter={() => setIsDeleteBtnVisible(true)} onMouseLeave={() => setIsDeleteBtnVisible(false)}>
            <div
                className={`
                    w-full flex flex-row items-center justify-start

                `}
            >
                <div
                    className={`
                        w-full flex flex-row items-center justify-start
                        text-16px
                    `}
                >
                    <img
                        src={service.icon_image}
                        style={{
                            width: '24px',
                        }}
                    />
                    <div
                        style={{
                            marginLeft: '1rem',
                            fontWeight: 'bold',
                        }}
                    >
                        {t(`ServiceCard.servicesNames.${service.type}`)}
                    </div>
                    <div
                        style={{
                            marginLeft: '1rem',
                            fontSize: '14px',
                            color: theme`colors.primary.grey`,
                        }}
                    >
                        {t(`ServiceCard.frequency.${service.config.frequency}`)}
                    </div>
                </div>
            </div>
            <div
                className={`
                    w-full flex flex-row items-center justify-start
                `}
                style={{
                    marginTop: '8px',
                }}
            >
                <button
                    className={`
                        flex flex-row items-center justify-start
                        text-16px
                        rounded-md
                        focus:outline-none focus:bg-secondary-saladLight
                    `}
                    style={{
                        paddingRight: '.5rem',
                    }}
                    onClick={() => {
                        dispatch(_toggleMenu({ menu: `${service.type}DatePickerSubmenu`, isOpen: true }));
                        dispatch(_pushToOverlayActionStack(`${service.type}DatePickerSubmenu`));
                    }}
                    disabled={isAddressOrTimeEdited}
                >
                    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                            d='M18.3643 4.50904H16.7945V3.69004C16.7945 3.38851 16.5501 3.14404 16.2485 3.14404C15.947 3.14404 15.7025 3.38851 15.7025 3.69004V4.50904H8.05853V3.69004C8.05853 3.38851 7.81409 3.14404 7.51253 3.14404C7.21097 3.14404 6.96653 3.38851 6.96653 3.69004V4.50904H5.39678C4.15487 4.50904 3.14453 5.51938 3.14453 6.76129V18.3638C3.14453 19.6057 4.15487 20.616 5.39678 20.616H18.3643C19.6062 20.616 20.6165 19.6057 20.6165 18.3638V6.76129C20.6165 5.51938 19.6062 4.50904 18.3643 4.50904ZM5.39678 5.60104H6.96653V6.14704C6.96653 6.44857 7.21097 6.69304 7.51253 6.69304C7.81409 6.69304 8.05853 6.44857 8.05853 6.14704V5.60104H15.7025V6.14704C15.7025 6.44857 15.947 6.69304 16.2485 6.69304C16.5501 6.69304 16.7945 6.44857 16.7945 6.14704V5.60104H18.3643C19.0041 5.60104 19.5245 6.12152 19.5245 6.76129V8.05804H4.23653V6.76129C4.23653 6.12152 4.75701 5.60104 5.39678 5.60104ZM18.3643 19.524H5.39678C4.75701 19.524 4.23653 19.0036 4.23653 18.3638V9.15004H19.5245V18.3638C19.5245 19.0036 19.0041 19.524 18.3643 19.524Z'
                            fill='#14133A'
                        />
                        <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M16.938 4.365H18.3638C19.6852 4.365 20.76 5.43981 20.76 6.76125V18.3638C20.76 19.6852 19.6852 20.76 18.3638 20.76H5.39625C4.07481 20.76 3 19.6852 3 18.3638V6.76125C3 5.43981 4.07481 4.365 5.39625 4.365H6.822V3.69C6.822 3.30895 7.1309 3 7.512 3C7.8931 3 8.202 3.30895 8.202 3.69V4.365H15.558V3.69C15.558 3.30895 15.8669 3 16.248 3C16.6291 3 16.938 3.30895 16.938 3.69V4.365ZM6.822 5.745H5.39625C4.836 5.745 4.38 6.201 4.38 6.76125V7.914H19.38V6.76125C19.38 6.201 18.924 5.745 18.3638 5.745H16.938V6.147C16.938 6.52805 16.6291 6.837 16.248 6.837C15.8669 6.837 15.558 6.52805 15.558 6.147V5.745H8.202V6.147C8.202 6.52805 7.8931 6.837 7.512 6.837C7.1309 6.837 6.822 6.52805 6.822 6.147V5.745ZM5.39625 19.38H18.3638C18.924 19.38 19.38 18.924 19.38 18.3638V9.294H4.38V18.3638C4.38 18.924 4.836 19.38 5.39625 19.38ZM18.3638 4.509C19.6057 4.509 20.616 5.51934 20.616 6.76125V18.3638C20.616 19.6057 19.6057 20.616 18.3638 20.616H5.39625C4.15434 20.616 3.144 19.6057 3.144 18.3638V6.76125C3.144 5.51934 4.15434 4.509 5.39625 4.509H6.966V3.69C6.966 3.38847 7.21044 3.144 7.512 3.144C7.81356 3.144 8.058 3.38847 8.058 3.69V4.509H15.702V3.69C15.702 3.38847 15.9464 3.144 16.248 3.144C16.5496 3.144 16.794 3.38847 16.794 3.69V4.509H18.3638ZM5.39625 5.601C4.75647 5.601 4.236 6.12147 4.236 6.76125V8.058H19.524V6.76125C19.524 6.12147 19.0035 5.601 18.3638 5.601H16.794V6.147C16.794 6.44853 16.5496 6.693 16.248 6.693C15.9464 6.693 15.702 6.44853 15.702 6.147V5.601H8.058V6.147C8.058 6.44853 7.81356 6.693 7.512 6.693C7.21044 6.693 6.966 6.44853 6.966 6.147V5.601H5.39625ZM5.39625 19.524H18.3638C19.0035 19.524 19.524 19.0035 19.524 18.3638V9.15H4.236V18.3638C4.236 19.0035 4.75647 19.524 5.39625 19.524Z'
                            fill='#14133A'
                        />
                    </svg>
                    <span
                        style={{
                            marginLeft: '1rem',
                        }}
                        className={`${isAnimating && service.date_time.mission_date === 0 ? stylesShaking.animating : ''}`}
                    >
                        {service.date_time.mission_date && !ui.overlayActionsStack.some(stackItem => stackItem.includes(`${service.type}DatePickerSubmenu`))
                            ? parseDateTime(service.date_time.mission_date)
                            : t(`ServiceCard.utils.pickDateHour`)}
                    </span>
                    <span
                        className={`text-md text-primary-maroon pl-0.5 ${isAnimating && service.date_time.mission_date === 0 ? stylesShaking.animating : ''}`}
                    >
                        *
                    </span>
                </button>
            </div>
            <div
                className={`
                    w-full flex flex-row items-center justify-start
                `}
                style={{
                    marginTop: '8px',
                }}
            >
                <button
                    className={`
                        flex flex-row items-center justify-start
                        text-16px
                        rounded-md
                        focus:outline-none focus:bg-secondary-saladLight
                    `}
                    style={{
                        paddingRight: '.5rem',
                    }}
                    onClick={() => {
                        dispatch(_toggleMenu({ menu: `${service.type}SelectAddressSubmenuOpen`, isOpen: true }));
                        dispatch(_pushToOverlayActionStack(`${service.type}SelectAddressSubmenuOpen`));
                    }}
                    disabled={isAddressOrTimeEdited}
                >
                    <svg
                        width='16'
                        height='22'
                        viewBox='0 0 16 22'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        style={{
                            position: 'relative',
                            left: '4px',
                        }}
                    >
                        <path
                            d='M7.9886 21.7931C7.51534 21.7931 7.09153 21.5476 6.85498 21.1365C6.85248 21.1322 6.85007 21.1278 6.84766 21.1234L1.47124 11.2827C0.187886 8.93366 0.224685 6.14552 1.5697 3.82442C2.88554 1.55362 5.22273 0.166305 7.82171 0.113287C7.93275 0.111001 8.04437 0.111001 8.15532 0.113287C10.7543 0.166305 13.0915 1.55362 14.4074 3.82442C15.7524 6.14552 15.7892 8.93362 14.5059 11.2827L9.12946 21.1234C9.12705 21.1278 9.12464 21.1322 9.12214 21.1365C8.88563 21.5476 8.46187 21.7931 7.9886 21.7931ZM7.98856 1.46669C7.94202 1.46669 7.89561 1.46715 7.84928 1.46808C5.72776 1.51136 3.81852 2.64621 2.74211 4.50383C1.63656 6.41175 1.60599 8.703 2.66038 10.6329L7.98856 20.3853L13.3167 10.6329C14.3711 8.703 14.3406 6.41175 13.2349 4.50383C12.1585 2.64625 10.2493 1.51136 8.12775 1.46808C8.08155 1.46715 8.0351 1.46669 7.98856 1.46669Z'
                            fill='#14133A'
                        />
                        <path
                            d='M7.98548 9.93605C6.30428 9.93605 4.93652 8.56829 4.93652 6.88709C4.93652 5.20589 6.30428 3.83813 7.98548 3.83813C9.66668 3.83813 11.0344 5.20589 11.0344 6.88709C11.0344 8.56829 9.66672 9.93605 7.98548 9.93605ZM7.98548 5.19323C7.05148 5.19323 6.29162 5.95309 6.29162 6.88709C6.29162 7.82109 7.05148 8.58096 7.98548 8.58096C8.91948 8.58096 9.67934 7.82109 9.67934 6.88709C9.67934 5.95309 8.91948 5.19323 7.98548 5.19323Z'
                            fill='#14133A'
                        />
                        <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M7.9877 10.046C6.2454 10.046 4.82812 8.62868 4.82812 6.88638C4.82812 5.14409 6.2454 3.72681 7.9877 3.72681C9.73 3.72681 11.1473 5.14409 11.1473 6.88638C11.1473 8.62868 9.73004 10.046 7.9877 10.046ZM7.9877 5.30314C7.1148 5.30314 6.40446 6.01348 6.40446 6.88638C6.40446 7.75928 7.1148 8.46963 7.9877 8.46963C8.8606 8.46963 9.57094 7.75928 9.57094 6.88638C9.57094 6.01348 8.8606 5.30314 7.9877 5.30314ZM4.93874 6.88638C4.93874 8.56758 6.3065 9.93534 7.9877 9.93534C9.66894 9.93534 11.0367 8.56758 11.0367 6.88638C11.0367 5.20518 9.6689 3.83743 7.9877 3.83743C6.3065 3.83743 4.93874 5.20518 4.93874 6.88638ZM6.29384 6.88638C6.29384 5.95238 7.0537 5.19252 7.9877 5.19252C8.9217 5.19252 9.68156 5.95238 9.68156 6.88638C9.68156 7.82038 8.9217 8.58025 7.9877 8.58025C7.0537 8.58025 6.29384 7.82038 6.29384 6.88638Z'
                            fill='#14133A'
                        />
                    </svg>
                    <span
                        style={{
                            marginLeft: '1.5rem',
                        }}
                        className={`${isAnimating && service.address.address_id === null ? stylesShaking.animating : ''}`}
                    >
                        {service.address.address_id && !ui.overlayActionsStack.some(stackItem => stackItem.includes(`${service.type}SelectAddressSubmenuOpen`))
                            ? service.address.address_name
                            : t(`ServiceCard.utils.pickAddress`)}
                    </span>
                    <span className={`text-md text-primary-maroon pl-0.5 ${isAnimating && service.address.address_id === null ? stylesShaking.animating : ''}`}>
                        *
                    </span>
                </button>
            </div>
            <div
                className={`
                    w-full flex flex-row items-center justify-start
                `}
                style={{
                    marginTop: '8px',
                }}
            >
                <button
                    className={`
                        flex flex-row items-center justify-start
                        text-16px
                        rounded-md
                        focus:outline-none focus:bg-secondary-saladLight
                    `}
                    style={{
                        paddingRight: '.5rem',
                    }}
                    onClick={() => {
                        dispatch(_toggleMenu({ menu: `${service.type}AddCommentSubmenuOpen`, isOpen: true }));
                        dispatch(_pushToOverlayActionStack(`${service.type}AddCommentSubmenuOpen`));
                    }}
                    disabled={isAddressOrTimeEdited}
                >
                    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                            d='M6.03917 2C5.2251 2 4.5498 2.6753 4.5498 3.48936V20.5106C4.5498 21.3247 5.2251 22 6.03917 22H17.9541C18.7681 22 19.4434 21.3247 19.4434 20.5106V3.48936C19.4434 2.6753 18.7681 2 17.9541 2H6.03917ZM6.03917 3.2766H17.9541C18.083 3.2766 18.1668 3.36045 18.1668 3.48936V20.5106C18.1668 20.6395 18.083 20.7234 17.9541 20.7234H6.03917C5.91025 20.7234 5.8264 20.6395 5.8264 20.5106V3.48936C5.8264 3.36045 5.91025 3.2766 6.03917 3.2766ZM7.74129 5.61702C7.38878 5.61702 7.103 5.90281 7.103 6.25532C7.103 6.60783 7.38878 6.89362 7.74129 6.89362H16.2519C16.6045 6.89362 16.8902 6.60783 16.8902 6.25532C16.8902 5.90281 16.6045 5.61702 16.2519 5.61702H7.74129ZM7.74129 9.44681C7.38878 9.44681 7.103 9.7326 7.103 10.0851C7.103 10.4376 7.38878 10.7234 7.74129 10.7234H16.2519C16.6045 10.7234 16.8902 10.4376 16.8902 10.0851C16.8902 9.7326 16.6045 9.44681 16.2519 9.44681H7.74129ZM7.74129 13.2766C7.38878 13.2766 7.103 13.5624 7.103 13.9149C7.103 14.2674 7.38878 14.5532 7.74129 14.5532H10.2519C10.6045 14.5532 10.8902 14.2674 10.8902 13.9149C10.8902 13.5624 10.6045 13.2766 10.2519 13.2766H7.74129ZM7.74129 17.1064C7.38878 17.1064 7.103 17.3922 7.103 17.7447C7.103 18.0972 7.38878 18.383 7.74129 18.383H10.2519C10.6045 18.383 10.8902 18.0972 10.8902 17.7447C10.8902 17.3922 10.6045 17.1064 10.2519 17.1064H7.74129Z'
                            fill='#14133A'
                        />
                        <path
                            d='M12.103 15.9937C12.103 15.6412 12.3888 15.3554 12.7413 15.3554H16.2519C16.6045 15.3554 16.8902 15.6412 16.8902 15.9937C16.8902 16.3463 16.6045 16.632 16.2519 16.632H12.7413C12.3888 16.632 12.103 16.3463 12.103 15.9937Z'
                            fill='#14133A'
                        />
                        <path
                            d='M14.5 18.383C14.1475 18.383 13.8617 18.0972 13.8617 17.7447V14.234C13.8617 13.8815 14.1475 13.5957 14.5 13.5957C14.8525 13.5957 15.1383 13.8815 15.1383 14.234V17.7447C15.1383 18.0972 14.8525 18.383 14.5 18.383Z'
                            fill='#14133A'
                        />
                    </svg>
                    <span
                        style={{
                            marginLeft: '1rem',
                        }}
                    >
                        {service.user_comment && !ui.overlayActionsStack.some(stackItem => stackItem.includes(`${service.type}AddCommentSubmenuOpen`))
                            ? service.user_comment.length > 20
                                ? `${service.user_comment.slice(0, 21)}...`
                                : service.user_comment
                            : t(`ServiceCard.utils.addComment`)}
                    </span>
                </button>
            </div>
            <DeleteButton
                onClick={() => {
                    dispatch(_decrementTotalOrderPrice({ homie_service_id: service.homie_service_id }));
                    dispatch(deleteServiceFromOrderAndState(service, t(`error_deleting_service_toast`)));
                }}
                isVisible={isAddressOrTimeEdited ? false : isDeleteBtnVisible}
                disabled={isAddressOrTimeEdited}
            >
                <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                        d='M18.8668 2.73511H1.13334C0.965366 2.73511 0.804274 2.79398 0.6855 2.89879C0.566727 3.00359 0.5 3.14573 0.5 3.29394C0.5 3.44215 0.566727 3.58429 0.6855 3.68909C0.804274 3.79389 0.965366 3.85277 1.13334 3.85277H3.03335V16.7059C3.03335 17.0728 3.11526 17.4361 3.2744 17.7751C3.43354 18.1142 3.6668 18.4222 3.96085 18.6816C4.25491 18.9411 4.604 19.1469 4.9882 19.2873C5.3724 19.4277 5.78418 19.5 6.20004 19.5H13.8001C14.2159 19.5 14.6277 19.4277 15.0119 19.2873C15.3961 19.1469 15.7452 18.9411 16.0393 18.6816C16.3333 18.4222 16.5666 18.1142 16.7257 17.7751C16.8849 17.4361 16.9668 17.0728 16.9668 16.7059V3.85277H18.8668C19.0348 3.85277 19.1959 3.79389 19.3146 3.68909C19.4334 3.58429 19.5001 3.44215 19.5001 3.29394C19.5001 3.14573 19.4334 3.00359 19.3146 2.89879C19.1959 2.79398 19.0348 2.73511 18.8668 2.73511ZM15.7001 16.7059C15.7001 17.1505 15.4999 17.5769 15.1436 17.8913C14.7873 18.2057 14.304 18.3824 13.8001 18.3824H6.20004C5.69612 18.3824 5.21285 18.2057 4.85653 17.8913C4.5002 17.5769 4.30003 17.1505 4.30003 16.7059V3.85277H15.7001V16.7059Z'
                        fill='#B31E50'
                        stroke='#B31E50'
                        strokeWidth='0.5'
                    />
                    <path
                        d='M7.46146 1.61766H12.5282C12.6961 1.61766 12.8572 1.55878 12.976 1.45398C13.0948 1.34918 13.1615 1.20704 13.1615 1.05883C13.1615 0.91062 13.0948 0.768479 12.976 0.663678C12.8572 0.558877 12.6961 0.5 12.5282 0.5H7.46146C7.29349 0.5 7.1324 0.558877 7.01362 0.663678C6.89485 0.768479 6.82812 0.91062 6.82812 1.05883C6.82812 1.20704 6.89485 1.34918 7.01362 1.45398C7.1324 1.55878 7.29349 1.61766 7.46146 1.61766Z'
                        fill='#B31E50'
                        stroke='#B31E50'
                        strokeWidth='0.5'
                    />
                    <path
                        d='M8.09428 15.0293C8.26225 15.0293 8.42334 14.9704 8.54211 14.8656C8.66089 14.7608 8.72761 14.6187 8.72761 14.4705V7.76452C8.72761 7.61631 8.66089 7.47417 8.54211 7.36937C8.42334 7.26456 8.26225 7.20569 8.09428 7.20569C7.9263 7.20569 7.76521 7.26456 7.64644 7.36937C7.52766 7.47417 7.46094 7.61631 7.46094 7.76452V14.4705C7.46094 14.6187 7.52766 14.7608 7.64644 14.8656C7.76521 14.9704 7.9263 15.0293 8.09428 15.0293Z'
                        fill='#B31E50'
                        stroke='#B31E50'
                        strokeWidth='0.5'
                    />
                    <path
                        d='M11.899 15.0293C12.0669 15.0293 12.228 14.9704 12.3468 14.8656C12.4656 14.7608 12.5323 14.6187 12.5323 14.4705V7.76452C12.5323 7.61631 12.4656 7.47417 12.3468 7.36937C12.228 7.26456 12.0669 7.20569 11.899 7.20569C11.731 7.20569 11.5699 7.26456 11.4511 7.36937C11.3324 7.47417 11.2656 7.61631 11.2656 7.76452V14.4705C11.2656 14.6187 11.3324 14.7608 11.4511 14.8656C11.5699 14.9704 11.731 15.0293 11.899 15.0293Z'
                        fill='#B31E50'
                        stroke='#B31E50'
                        strokeWidth='0.5'
                    />
                </svg>
            </DeleteButton>
            <EditButton
                onClick={() => {
                    dispatch(_toggleMenu({ menu: `${service.type}DatePickerSubmenu`, isOpen: true }));
                    dispatch(_pushToOverlayActionStack(`${service.type}DatePickerSubmenu`));
                }}
                disabled={isAddressOrTimeEdited}
            >
                <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                        d='M20.25 9C19.836 9 19.5 9.336 19.5 9.75V18.75C19.5 19.1636 19.1636 19.5 18.75 19.5H5.25C4.83637 19.5 4.5 19.1636 4.5 18.75V5.25C4.5 4.83637 4.83637 4.5 5.25 4.5H14.25C14.664 4.5 15 4.164 15 3.75C15 3.336 14.664 3 14.25 3H5.25C4.00912 3 3 4.00912 3 5.25V18.75C3 19.9909 4.00912 21 5.25 21H18.75C19.9909 21 21 19.9909 21 18.75V9.75C21 9.336 20.664 9 20.25 9Z'
                        fill='#14133A'
                    />
                    <path
                        d='M9 12.1287V14.2501C9 14.6641 9.336 15.0001 9.75 15.0001H11.8714C12.0701 15.0001 12.261 14.9209 12.4016 14.7803L20.5605 6.62144C21.1455 6.03644 21.1455 5.08507 20.5605 4.50007L19.5 3.43957C18.9154 2.85494 17.964 2.85494 17.3786 3.43957L9.21975 11.5984C9.07913 11.7391 9 11.9299 9 12.1287ZM18.4387 4.49969L19.5 5.56094L18.4391 6.62182L17.3779 5.56057L18.4387 4.49969ZM10.5 12.4392L16.3177 6.62069L17.379 7.68194L11.5605 13.5001H10.5V12.4392Z'
                        fill='#14133A'
                    />
                </svg>
            </EditButton>
        </StyledServiceCard>
    );
};

export default ServiceCardBooking;
