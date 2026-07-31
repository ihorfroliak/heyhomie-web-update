/**
 * The /cleaning scope content sections (DOMAIN_RULES §8–§12):
 *   1. "Co robimy w każdym pomieszczeniu"  — per-room scope cards
 *   2. "Czego nie robimy"                  — exclusions
 *   3. Fragile disclosure                  — flag delicate items before the visit
 *   4. "HeyHomie robi też"                 — other-services strip
 *
 * Presentation only; content comes from ./cleaningContent. Uses the repo pattern:
 * `styled` + `${tw``}` for responsive structure, plain `style={{}}` for static bits
 * (the `tw=`/`css=` props are NOT configured in this project). Brand-canon palette
 * inline (heyhomie-shared/BRAND.md); copy PL-first (step 4 → next-intl).
 */
import { useState } from 'react';
import tw, { styled } from 'twin.macro';
import { ROOM_CARDS, TOTAL_TASKS, EXCLUSIONS, FRAGILE, FRAGILE_PLACEHOLDER, FRAGILE_NOTE, OTHER_SERVICES } from './cleaningContent';

const C = { ink: '#141338', indigo: '#414483', slate: '#52516B', mint: '#77ECC8', light: '#F6FBFF', border: '#EDEEEF' };

const Band = styled.section`
    width: 100%;
    background: ${p => (p.dark ? C.ink : p.tint ? C.light : '#fff')};
    color: ${p => (p.dark ? '#fff' : C.ink)};
    ${tw`py-12 md:py-14`}
`;
const Inner = styled.div`
    max-width: 1216px;
    margin: 0 auto;
    box-sizing: border-box;
    font-family: Manrope, sans-serif;
    ${tw`px-5 md:px-10`}
`;
const H2 = styled.h2`
    font-weight: 800;
    font-size: 26px;
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin: 0;
    ${tw`md:text-[32px]`}
`;
const Lead = styled.p`
    font-weight: 500;
    font-size: 15px;
    line-height: 1.6;
    color: ${p => (p.dark ? 'rgba(255,255,255,0.62)' : C.slate)};
    margin: 12px 0 0;
    max-width: 74ch;
`;
const Grid = styled.div`
    display: grid;
    gap: 14px;
    margin-top: 24px;
    grid-template-columns: 1fr;
    ${tw`sm:grid-cols-2`}
    ${p => p.cols === 3 && tw`lg:grid-cols-3`}
    ${p => p.cols === 4 && tw`lg:grid-cols-4`}
    ${p => p.cols === 5 && tw`md:grid-cols-3 lg:grid-cols-5`}
`;
const RoomCard = styled.div`
    border-radius: 16px;
    border: 1px solid ${C.border};
    padding: 20px;
`;
const Counts = styled.div`
    display: flex;
    gap: 14px;
    margin-top: 8px;
    b {
        font-weight: 800;
        font-size: 19px;
    }
    span {
        font-weight: 500;
        font-size: 11px;
        color: ${C.slate};
        display: block;
    }
`;
const Chip = styled.button`
    border: 1.5px solid ${p => (p.on ? C.ink : C.border)};
    background: ${p => (p.on ? C.light : '#fff')};
    color: ${C.ink};
    border-radius: 999px;
    padding: 8px 14px;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    font-family: inherit;
`;
const Btn = styled.button`
    height: 48px;
    padding: 0 24px;
    border-radius: 8px;
    border: ${p => (p.solid ? 'none' : `1.5px solid ${p.dark ? 'rgba(255,255,255,0.22)' : C.border}`)};
    background: ${p => (p.solid ? C.mint : 'transparent')};
    color: ${p => (p.dark ? '#fff' : C.ink)};
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
    font-family: inherit;
`;

// static (non-responsive) style objects — plain React inline
const rowHeader = { display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24 };
const split = { display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'flex-start' };
const chips = { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 };
const exCard = { borderRadius: 16, background: '#fff', padding: 22 };
const panel = { width: 452, maxWidth: '100%', borderRadius: 16, border: `1.5px solid ${C.border}`, padding: 26 };

const CleaningScopeSections = ({ onBook, onChecklist }) => {
    const [fragile, setFragile] = useState({});
    const toggle = f => setFragile(s => ({ ...s, [f]: !s[f] }));

    return (
        <>
            {/* 1 · what's included */}
            <Band>
                <Inner>
                    <div style={rowHeader}>
                        <div>
                            <H2>Co robimy w każdym pomieszczeniu</H2>
                            <Lead>
                                Pełna lista {TOTAL_TASKS} — bez „i inne prace porządkowe”. W generalnym dochodzą wnętrza AGD, fugi i szafki; część pozycji jest
                                dopłatą w standardowym, a w generalnym w cenie.
                            </Lead>
                        </div>
                        <Btn type='button' onClick={onChecklist}>
                            Otwórz pełny checklist →
                        </Btn>
                    </div>
                    <Grid cols={4}>
                        {ROOM_CARDS.map(rc => (
                            <RoomCard key={rc.room}>
                                <div style={{ fontWeight: 700, fontSize: 16 }}>{rc.room}</div>
                                <Counts>
                                    <div>
                                        <b>{rc.std}</b>
                                        <span>standardowe</span>
                                    </div>
                                    <div>
                                        <b style={{ color: C.indigo }}>{rc.gen}</b>
                                        <span>generalne</span>
                                    </div>
                                </Counts>
                                <div style={{ fontWeight: 500, fontSize: 12.5, lineHeight: 1.55, color: C.slate, marginTop: 12 }}>{rc.sample}</div>
                            </RoomCard>
                        ))}
                    </Grid>
                </Inner>
            </Band>

            {/* 2 · what we don't do */}
            <Band tint>
                <Inner>
                    <H2>Czego nie robimy</H2>
                    <Lead>Mówimy o tym wprost przed rezerwacją, a nie w regulaminie. Część prac możemy wykonać osobno — jak, napisane jest przy każdej.</Lead>
                    <Grid cols={3}>
                        {EXCLUSIONS.map(ex => (
                            <div key={ex.title} style={exCard}>
                                <div style={{ fontWeight: 700, fontSize: 15.5, lineHeight: 1.4 }}>{ex.title}</div>
                                <div style={{ fontWeight: 500, fontSize: 13, lineHeight: 1.55, color: C.slate, marginTop: 11 }}>{ex.body}</div>
                                {ex.tag ? (
                                    <div
                                        style={{
                                            display: 'inline-block',
                                            marginTop: 12,
                                            padding: '4px 10px',
                                            borderRadius: 999,
                                            background: C.light,
                                            color: C.indigo,
                                            fontWeight: 700,
                                            fontSize: 11,
                                        }}
                                    >
                                        {ex.tag}
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </Grid>
                </Inner>
            </Band>

            {/* 3 · fragile disclosure */}
            <Band>
                <Inner>
                    <div style={split}>
                        <div style={{ flex: '1 1 320px', minWidth: 0 }}>
                            <H2>Rzeczy wymagające szczególnej ostrożności</H2>
                            <Lead>
                                Naturalny kamień, mosiądz bez powłoki, antyki i sprzęt, który już jest uszkodzony, wymagają innych środków niż reszta domu —
                                albo pominięcia. Zaznacz je przy rezerwacji: homie dostanie tę informację przed wejściem, a Ty masz to udokumentowane.
                            </Lead>
                        </div>
                        <div style={panel}>
                            <div style={{ fontWeight: 700, fontSize: 16 }}>Zgłoś przed sprzątaniem</div>
                            <div style={chips}>
                                {FRAGILE.map(f => (
                                    <Chip key={f} type='button' on={!!fragile[f]} onClick={() => toggle(f)}>
                                        {f}
                                    </Chip>
                                ))}
                            </div>
                            <div
                                style={{
                                    border: `1px solid ${C.border}`,
                                    borderRadius: 8,
                                    padding: '13px 15px',
                                    minHeight: 84,
                                    marginTop: 16,
                                    color: '#A9A9B8',
                                    fontWeight: 500,
                                    fontSize: 13.5,
                                    lineHeight: 1.55,
                                }}
                            >
                                {FRAGILE_PLACEHOLDER}
                            </div>
                            <div
                                style={{
                                    fontWeight: 500,
                                    fontSize: 12.5,
                                    lineHeight: 1.55,
                                    color: C.slate,
                                    marginTop: 14,
                                    paddingTop: 14,
                                    borderTop: `1px solid ${C.border}`,
                                }}
                            >
                                {FRAGILE_NOTE}
                            </div>
                        </div>
                    </div>
                </Inner>
            </Band>

            {/* 4 · other services */}
            <Band dark>
                <Inner>
                    <div style={rowHeader}>
                        <div>
                            <H2>HeyHomie robi też</H2>
                            <Lead dark>Osobne usługi — możesz zamówić je razem ze sprzątaniem albo pojedynczo.</Lead>
                        </div>
                        <Btn type='button' dark onClick={onBook}>
                            Wszystkie usługi →
                        </Btn>
                    </div>
                    <Grid cols={5}>
                        {OTHER_SERVICES.map(s => (
                            <div key={s.id} onClick={onBook} style={{ borderRadius: 14, background: 'rgba(255,255,255,0.06)', padding: 20, cursor: 'pointer' }}>
                                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{s.name}</div>
                                <div style={{ fontWeight: 700, fontSize: 13, color: C.mint, marginTop: 6 }}>
                                    {s.price} <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{s.unit}</span>
                                </div>
                            </div>
                        ))}
                    </Grid>
                </Inner>
            </Band>
        </>
    );
};

export default CleaningScopeSections;
