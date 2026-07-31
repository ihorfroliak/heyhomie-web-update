/**
 * Cleaning calculator section — the interactive hero band on /cleaning.
 *
 * Left: headline + trust promises (canon: pay-after-service, free 24h cancel,
 * insured, fragile declared). Right: the live <CleaningCalculator/>.
 *
 * Presentation only; pricing lives in the engine. Copy is inline PL for now
 * (step 4 moves it to next-intl messages). `onBook` is wired to the page's existing
 * booking trigger.
 */
import tw, { styled } from 'twin.macro';
import CleaningCalculator from './CleaningCalculator';
import { useCleaningCopy } from './cleaningCopy';

const C = { ink: '#141338', slate: '#52516B', light: '#F6FBFF', border: '#EDEEEF' };

const Section = styled.section`
    background: ${C.light};
    width: 100%;
    ${tw`py-10 md:py-14`}
`;

const Inner = styled.div`
    max-width: 1216px;
    margin: 0 auto;
    box-sizing: border-box;
    ${tw`px-5 md:px-10`}
    display: flex;
    flex-wrap: wrap;
    gap: 44px;
    align-items: flex-start;
    justify-content: center;
    font-family: Manrope, sans-serif;
    color: ${C.ink};
`;

const Intro = styled.div`
    flex: 1 1 420px;
    min-width: 0;
`;

const Crumbs = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    font-size: 13px;
    color: ${C.slate};
    span:last-child {
        font-weight: 700;
        color: ${C.ink};
    }
`;

const Title = styled.h1`
    font-weight: 800;
    font-size: 34px;
    line-height: 1.1;
    letter-spacing: -0.025em;
    margin: 18px 0 0;
    ${tw`md:text-[42px]`}
`;

const Sub = styled.p`
    font-weight: 500;
    font-size: 16px;
    line-height: 1.65;
    color: ${C.slate};
    margin: 16px 0 0;
    max-width: 54ch;
`;

const Promises = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    margin-top: 24px;
    max-width: 560px;
    ${tw`sm:grid-cols-2`}
`;

const Promise = styled.div`
    border-radius: 12px;
    background: #fff;
    border: 1px solid ${C.border};
    padding: 15px 17px;
    div:first-child {
        font-weight: 700;
        font-size: 14px;
    }
    div:last-child {
        font-weight: 500;
        font-size: 12.5px;
        line-height: 1.5;
        color: ${C.slate};
        margin-top: 3px;
    }
`;

const CleaningCalculatorSection = ({ onBook }) => {
    const PL = useCleaningCopy().hero;
    return (
        <Section>
            <Inner>
                <Intro>
                    <Crumbs>
                        {PL.breadcrumb.map((c, i) => (
                            <span key={i}>
                                {i > 0 ? '› ' : ''}
                                {c}
                            </span>
                        ))}
                    </Crumbs>
                    <Title>{PL.title}</Title>
                    <Sub>{PL.sub}</Sub>
                    <Promises>
                        {PL.promises.map((p, i) => (
                            <Promise key={i}>
                                <div>{p[0]}</div>
                                <div>{p[1]}</div>
                            </Promise>
                        ))}
                    </Promises>
                </Intro>
                <CleaningCalculator onBook={onBook} />
            </Inner>
        </Section>
    );
};

export default CleaningCalculatorSection;
