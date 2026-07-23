import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import tw, { styled } from 'twin.macro';

const StyledContainer = styled.div`
    width: 100%;
    ${tw`h-10 md:h-11`}

    background-color: #ffffff;

    border: solid 1px #727189;

    div > button {
        background-color: #f2f1f1;
    }

    div > button:first-child {
        border-radius: 5px 0px 0px 5px;
    }

    div > button:last-child {
        border-radius: 0px 5px 5px 0px;
    }

    border-radius: 5px;

    display: flex;
    justify-content: center;
    align-items: center;

    -webkit-box-shadow: 0px 0px 22.2px rgba(0, 0, 0, 0.08);
    -moz-box-shadow: 0px 0px 22.2px rgba(0, 0, 0, 0.08);
    box-shadow: 0px 0px 22.2px rgba(0, 0, 0, 0.08);

    div {
        font-size: 24px;
    }
`;

const CounterCalculator = ({ value, onSelect, options }) => {
    const t = useTranslations('CityPage.ServiceConfig');

    const [selectedValue, setSelectedValue] = useState(value - 1);

    useEffect(() => {
        const timer = setTimeout(() => {
            onSelect(options[selectedValue]?.value);
        }, 300);

        return () => clearTimeout(timer);
    }, [selectedValue]);

    return (
        <StyledContainer>
            <div className={`w-full h-full rounded-md flex flex-row justify-between text-base`}>
                <button
                    className={`w-8 md:w-11 flex justify-center items-center`}
                    onClick={() => {
                        setSelectedValue(value => (value > 0 ? value - 1 : 0));
                    }}
                >
                    <Image src={`/icons/minus.svg`} alt={'minus'} width={24} height={24} />
                </button>
                <span className={`text-center flex justify-center items-center text-sm md:text-lg text-primary-grey`}>
                    {options[selectedValue]?.value} {t(`${options[selectedValue]?.captionKey}`)}
                </span>
                <button
                    className={`w-8 md:w-11 flex justify-center items-center`}
                    onClick={() => {
                        setSelectedValue(value => (value < options.length - 1 ? value + 1 : options.length - 1));
                    }}
                >
                    <Image src={`/icons/plus.svg`} alt={'plus'} width={24} height={24} />
                </button>
            </div>
        </StyledContainer>
    );
};

export default CounterCalculator;
