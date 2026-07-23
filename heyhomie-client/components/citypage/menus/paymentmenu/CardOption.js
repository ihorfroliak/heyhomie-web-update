import tw, { css, styled, theme } from 'twin.macro';

import RadioButton from '../../../ui/Radiobutton';

const StyledCardOption = styled.div`
    min-height: 52px;
    min-width: 300px;
    background-color: #ffffff;
    font-weight: bold;

    border-radius: 4px;
    box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.05);

    padding-left: 16px;

    display: flex;
    justify-content: flex-start;
    align-items: center;

    margin-top: 8px;

    @media (min-width: 640px) {
        min-width: 400px;
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
        case 'cash': {
            return '/cash.png';
        }
        default: {
            return '/default-card-brand2.png';
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

const CardOption = ({ card, checked, disabled, onSelect }) => {
    return (
        <StyledCardOption>
            <RadioButton
                label={
                    <div
                        className={`
                            flex justify-between items-center
                            w-full
                            flex-wrap
                        `}
                        style={{
                            fontWeight: 'normal',
                        }}
                    >
                        <div
                            className={`
                                flex justify-betweeen items-center
                                w-full
                                sm:w-9/12 sm:justify-start
                            `}
                        >
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
                                style={{
                                    marginLeft: '13px',
                                    marginRight: '16px',
                                    minWidth: '100px',
                                }}
                            >
                                {cardBrandNameSwitch(card.brand)}
                            </div>
                            {card.last4 && (
                                <div
                                    className={`
                                    mr-4 justify-self-end
                                    sm:mr-0
                                `}
                                >
                                    ***-{card.last4}
                                </div>
                            )}
                        </div>
                        {card.exp_month && card.exp_year && (
                            <div
                                className={`
                                w-full
                                text-right
                                sm:w-min
                            `}
                                style={{
                                    marginRight: '16px',
                                    color: theme`colors.primary.grey`,
                                    justifySelf: 'flex-end',
                                }}
                            >
                                {card.exp_month < 10 ? `0${card.exp_month}` : card.exp_month}/{card.exp_year}
                            </div>
                        )}
                    </div>
                }
                checked={checked}
                onChange={() => onSelect(card.id)}
                disabled={disabled}
            />
        </StyledCardOption>
    );
};

export default CardOption;
