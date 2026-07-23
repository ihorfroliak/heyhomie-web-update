import { useTranslations } from 'next-intl';
import tw, { css, styled, theme } from 'twin.macro';

const StyledCardOption = styled.div`
    min-height: 88px;
    min-width: 300px;
    background-color: #ffffff;
    font-weight: normal;

    border-radius: 4px;
    box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.05);

    padding-left: 16px;
    padding-right: 16px;

    display: grid;
    grid-template-areas:
        'mainInfo cardDefault'
        'date actions';

    margin-bottom: 16px;

    .mainInfo {
        grid-area: mainInfo;
    }
    .cardDefault {
        grid-area: cardDefault;

        justify-content: flex-end;

        text-align: right;
        font-weight: bold;

        @media (min-width: 640px) {
            justify-content: flex-start;
        }
        svg {
            position: relative;
            top: 1px;
        }
    }
    .date {
        grid-area: date;
    }
    .actions {
        grid-area: actions;

        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;

        button {
            font-weight: bold;
            display: block;

            text-align: right;
        }
        button:focus {
            outline: none;
        }
    }

    @media (min-width: 640px) {
        min-width: 400px;
        min-height: 52px;

        grid-template-areas: 'mainInfo cardDefault date actions';
        grid-template-columns: 2fr 1fr 1fr 1fr;
    }
`;

const CardBrandImage = styled.img`
    height: 32px;
    width: auto;
`;
// Can be amex, diners, discover, jcb, mastercard, unionpay, visa, or unknown.
const cardBrandImgSwitch = brand => {
    switch (brand.toLowerCase()) {
        case 'visa': {
            return '/visa-card-brand.png';
        }
        case 'mastercard': {
            return '/mastercard-card-brand.png';
        }
        case 'american express': {
            return '/american-express-brand.png';
        }
        default: {
            return '/default-card-brand.png';
        }
    }
};

const cardBrandNameSwitch = brand => {
    switch (brand.toLowerCase()) {
        case 'JSB': {
            return brand.toUpperCase();
        }
        default: {
            return brand[0].toUpperCase() + brand.slice(1);
        }
    }
};

const CardOption = ({ card, handleSetCardForDelete, handleSetCardDefault }) => {
    // UI translations for the component
    const t = useTranslations('AccountPage.PaymentPage.CardsComponent');

    return (
        <StyledCardOption>
            <div className='mainInfo flex items-center'>
                <div
                    className={`
                        flex justify-center items-center
                    `}
                    style={{
                        width: '52px',
                        height: '32px',
                    }}
                >
                    <CardBrandImage src={cardBrandImgSwitch(card.brand)} alt={card.brand} />
                </div>
                <div
                    className='mainInfo flex flex-wrap items-center'
                    style={{
                        marginLeft: '13px',
                    }}
                >
                    <div>{cardBrandNameSwitch(card.brand)}</div>
                    {card.last4 && (
                        <div
                            style={{
                                marginLeft: '13px',
                            }}
                        >
                            ***-{card.last4}
                        </div>
                    )}
                </div>
            </div>
            <div className='cardDefault flex items-center'>
                {card.default ? (
                    <>
                        <svg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <rect x='1' y='1' width='10' height='10' rx='5' fill='#36F0C7' stroke='#36F0C7' strokeWidth='2' />
                            <path
                                d='M8.02583 3.81065C8.62352 3.79571 8.92237 4.51307 8.49651 4.93153L5.44825 7.98032C5.26147 8.16713 4.94767 8.16713 4.76089 7.98032L3.21435 6.42603C2.57182 5.81329 3.52067 4.86428 4.13331 5.50691L4.9925 6.36625C5.05227 6.42603 5.15687 6.42603 5.22411 6.36625L7.57755 4.01241C7.69709 3.88538 7.85399 3.81813 8.02583 3.81065Z'
                                fill='white'
                            />
                        </svg>
                        <div style={{ marginLeft: '6px' }}>{t(`cardActive`)}</div>
                    </>
                ) : new Date().setFullYear(card.exp_year, card.exp_month) < new Date() ? (
                    <>
                        <svg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <circle cx='6' cy='6' r='5.5' fill='#B31E50' stroke='#B31E50' />
                            <path
                                d='M5.38086 4.09375C5.38086 3.92188 5.44076 3.77604 5.56055 3.65625C5.68294 3.53385 5.83008 3.47266 6.00195 3.47266C6.17122 3.47266 6.31576 3.53385 6.43555 3.65625C6.55794 3.77604 6.61914 3.92188 6.61914 4.09375C6.61914 4.26562 6.55794 4.41276 6.43555 4.53516C6.31576 4.65495 6.17122 4.71484 6.00195 4.71484C5.83008 4.71484 5.68294 4.65495 5.56055 4.53516C5.44076 4.41276 5.38086 4.26562 5.38086 4.09375ZM5.0293 8.80859C5.16992 8.78516 5.26628 8.75 5.31836 8.70312C5.39648 8.63281 5.43555 8.50651 5.43555 8.32422V5.97266C5.43555 5.8112 5.4082 5.70182 5.35352 5.64453C5.29883 5.58464 5.19076 5.54036 5.0293 5.51172V5.31641H6.56445V8.35547C6.56445 8.52995 6.59049 8.64193 6.64258 8.69141C6.69466 8.74089 6.79232 8.77995 6.93555 8.80859V9H5.0293V8.80859Z'
                                fill='white'
                            />
                        </svg>
                        <div style={{ marginLeft: '6px', color: '#B31E50' }}>{t(`cardExpired`)}</div>
                    </>
                ) : null}
            </div>
            {card.exp_month && card.exp_year && (
                <div
                    className='date flex items-center md:justify-end'
                    style={{
                        marginRight: '16px',
                        color: theme`colors.primary.grey`,
                    }}
                >
                    {card.exp_month < 10 ? `0${card.exp_month}` : card.exp_month}/{card.exp_year}
                </div>
            )}
            <div className='actions'>
                {!card.default &&
                (new Date().setFullYear(card.exp_year, card.exp_month) > new Date() ||
                    card.payment_method === 'pay_later' ||
                    card.payment_method === 'cash') ? (
                    <button onClick={() => handleSetCardDefault(card.id)}>{t(`setCard_btn`)}</button>
                ) : null}
                {!card.default && card.exp_month && card.exp_year && card.last4 ? (
                    <button
                        onClick={() => handleSetCardForDelete(card)}
                        className={`
                        ml-16px
                        md:ml-24px
                    `}
                        style={{
                            color: '#B31E50',
                        }}
                    >
                        {t(`deleteCard_btn`)}
                    </button>
                ) : null}
            </div>
        </StyledCardOption>
    );
};

export default CardOption;
