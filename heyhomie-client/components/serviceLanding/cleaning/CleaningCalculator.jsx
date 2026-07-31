/**
 * Cleaning calculator — the interactive price/time widget for /cleaning.
 *
 * Logic comes entirely from ../../../lib/cleaning/calculator.js (the canon engine,
 * matching heyhomie-shared/DOMAIN_RULES.md). This file is presentation only.
 *
 * Colours use the shared brand canon (heyhomie-shared/BRAND.md) directly, NOT the
 * tailwind theme — the theme still carries the older mixed palette (primary.salad =
 * #36F0C7); the design is the refreshed set. When the theme is migrated this can
 * switch to theme tokens.
 *
 * Copy is inline PL for now (the design is PL-first); step 4 moves it into next-intl
 * messages under CleaningLanding.Calculator. `onBook(state)` is the CTA seam → wire to
 * the existing BookingMenu (step 5).
 */
import { useMemo, useState } from 'react';
import tw, { styled } from 'twin.macro';
import { calculate, TYPES, FREQS, visibleAddons, zl } from '../../../lib/cleaning/calculator';
import { useCleaningCopy } from './cleaningCopy';

// Brand canon (heyhomie-shared/BRAND.md)
const C = {
    ink: '#141338',
    indigo: '#414483',
    slate: '#52516B',
    mint: '#77ECC8',
    light: '#F6FBFF',
    border: '#EDEEEF',
};

const AREA_MIN = 25;
const AREA_MAX = 250;

const Card = styled.div`
    width: 452px;
    max-width: 100%;
    box-sizing: border-box;
    border-radius: 16px;
    background: #fff;
    padding: 26px;
    color: ${C.ink};
    font-family: Manrope, sans-serif;
    box-shadow: 0 14px 36px rgba(20, 19, 56, 0.1);
    ${tw`text-left`}
`;

const num = {
    width: 22,
    height: 22,
    borderRadius: 7,
    background: C.light,
    color: C.indigo,
    fontWeight: 800,
    fontSize: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 'none',
};
const block = { marginTop: 20, paddingTop: 20, borderTop: `1px solid ${C.border}` };
const stepHead = { display: 'flex', alignItems: 'center', gap: 9 };
const stepTitle = { fontWeight: 700, fontSize: 14.5 };
const noteStyle = { fontWeight: 500, fontSize: 11.5, lineHeight: 1.5, color: C.slate, marginTop: 9 };

function Stepper({ value, onChange, min = 0, max = 9 }) {
    const btn = dis => ({
        width: 28,
        height: 28,
        borderRadius: 7,
        background: dis ? '#F4F4F7' : C.light,
        color: dis ? '#C4C4D0' : C.ink,
        border: 'none',
        cursor: dis ? 'default' : 'pointer',
        fontWeight: 700,
        fontSize: 16,
    });
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button type='button' style={btn(value <= min)} onClick={() => value > min && onChange(value - 1)}>
                −
            </button>
            <div style={{ minWidth: 26, textAlign: 'center', fontWeight: 800, fontSize: 15 }}>{value}</div>
            <button type='button' style={btn(value >= max)} onClick={() => value < max && onChange(value + 1)}>
                +
            </button>
        </div>
    );
}

function Toggle({ on, onClick, title, note }) {
    return (
        <div
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 11,
                marginTop: 10,
                padding: '13px 14px',
                borderRadius: 10,
                cursor: 'pointer',
                border: `1.5px solid ${on ? C.ink : C.border}`,
                background: on ? C.light : '#fff',
            }}
        >
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>{title}</div>
                <div style={{ fontWeight: 500, fontSize: 11.5, lineHeight: 1.45, color: C.slate, marginTop: 2 }}>{note}</div>
            </div>
            <div
                style={{
                    width: 40,
                    height: 24,
                    borderRadius: 12,
                    flex: 'none',
                    background: on ? C.mint : C.border,
                    padding: 3,
                    boxSizing: 'border-box',
                    display: 'flex',
                    justifyContent: on ? 'flex-end' : 'flex-start',
                    transition: 'all .15s',
                }}
            >
                <div style={{ width: 18, height: 18, borderRadius: 9, background: '#fff', boxShadow: '0 1px 3px rgba(20,19,56,0.22)' }} />
            </div>
        </div>
    );
}

const CleaningCalculator = ({ onBook }) => {
    const PL = useCleaningCopy().calc;
    const [type, setType] = useState('standard');
    const [freq, setFreq] = useState('once');
    const [rooms, setRooms] = useState(2);
    const [bathrooms, setBathrooms] = useState(1);
    const [area, setArea] = useState(55);
    const [addons, setAddons] = useState({});
    const [pets, setPets] = useState(false);
    const [gearOnSite, setGearOnSite] = useState(true);

    const visible = useMemo(() => visibleAddons(type), [type]);
    const result = useMemo(() => calculate({ type, freq, rooms, bathrooms, addons, gearOnSite }), [type, freq, rooms, bathrooms, addons, gearOnSite]);

    const toggleAddon = (id, isQty) =>
        setAddons(s => {
            const cur = s[id] || 0;
            if (isQty) return { ...s, [id]: cur > 0 ? 0 : 1 };
            return { ...s, [id]: cur ? 0 : 1 };
        });
    const setQty = (id, q) => setAddons(s => ({ ...s, [id]: Math.max(0, q) }));

    const lineLabel = l => {
        if (l.id === 'base') return PL.line.base;
        if (l.id === 'rooms') return `${PL.line.rooms} ×${l.qty}`;
        if (l.id === 'baths') return `${PL.line.baths} ×${l.qty}`;
        if (l.id === 'gear') return PL.line.gear;
        if (l.id === 'discount') return `${PL.line.discount} ${PL.freq[freq]}`;
        const a = PL.addon[l.id];
        return a ? (l.qty ? `${a[0]} ×${l.qty}` : a[0]) : l.id;
    };

    return (
        <Card>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ fontWeight: 800, fontSize: 21, letterSpacing: '-0.015em' }}>{PL.title}</div>
            </div>

            {/* 1 · size */}
            <div style={{ marginTop: 14 }}>
                <div style={stepHead}>
                    <div style={num}>1</div>
                    <div style={stepTitle}>{PL.s1}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 13 }}>
                    {[
                        [PL.rooms, rooms, setRooms, 0],
                        [PL.baths, bathrooms, setBathrooms, 0],
                    ].map(([label, val, set, min]) => (
                        <div
                            key={label}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '11px 14px',
                                border: `1px solid ${C.border}`,
                                borderRadius: 8,
                            }}
                        >
                            <div style={{ fontWeight: 700, fontSize: 14 }}>{label}</div>
                            <Stepper value={val} onChange={set} min={min} />
                        </div>
                    ))}
                </div>
                <div style={noteStyle}>{PL.kitchenNote}</div>
            </div>

            {/* 2 · frequency */}
            <div style={block}>
                <div style={stepHead}>
                    <div style={num}>2</div>
                    <div style={stepTitle}>{PL.s2}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 7, marginTop: 13 }}>
                    {FREQS.map(f => {
                        const on = freq === f.id;
                        return (
                            <div
                                key={f.id}
                                onClick={() => setFreq(f.id)}
                                style={{
                                    padding: '10px 6px',
                                    borderRadius: 9,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    border: `1.5px solid ${on ? C.ink : C.border}`,
                                    background: on ? C.light : '#fff',
                                }}
                            >
                                <div style={{ fontWeight: 700, fontSize: 12.5 }}>{PL.freq[f.id]}</div>
                                {f.save ? <div style={{ fontWeight: 700, fontSize: 11, color: C.indigo, marginTop: 2 }}>{f.save}</div> : null}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 3 · type */}
            <div style={block}>
                <div style={stepHead}>
                    <div style={num}>3</div>
                    <div style={stepTitle}>{PL.s3}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 13 }}>
                    {['standard', 'general'].map(tid => {
                        const on = type === tid;
                        const preview = calculate({ type: tid, freq, rooms, bathrooms, gearOnSite: true });
                        return (
                            <div
                                key={tid}
                                onClick={() => setType(tid)}
                                style={{
                                    padding: 14,
                                    borderRadius: 10,
                                    cursor: 'pointer',
                                    border: `1.5px solid ${on ? C.ink : C.border}`,
                                    background: on ? C.light : '#fff',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 700, fontSize: 14.5 }}>{PL.type[tid].label}</span>
                                    <span style={{ color: on ? C.ink : 'transparent', fontWeight: 800 }}>✓</span>
                                </div>
                                <div style={{ fontWeight: 500, fontSize: 11.5, lineHeight: 1.45, color: C.slate, marginTop: 4 }}>{PL.type[tid].meta}</div>
                                <div style={{ fontWeight: 800, fontSize: 15, marginTop: 8 }}>{zl(preview.total)}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 4 · area */}
            <div style={block}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={stepHead}>
                        <div style={num}>4</div>
                        <div style={stepTitle}>{PL.s4}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                        <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em' }}>{area}</span>
                        <span style={{ fontWeight: 700, fontSize: 13, color: C.slate }}>m²</span>
                    </div>
                </div>
                <input
                    type='range'
                    min={AREA_MIN}
                    max={AREA_MAX}
                    step={5}
                    value={area}
                    onChange={e => setArea(Number(e.target.value))}
                    style={{ width: '100%', marginTop: 12, accentColor: C.mint }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 11, color: C.slate }}>
                    <span>{AREA_MIN} m²</span>
                    <span>{AREA_MAX} m²</span>
                </div>
                <div style={noteStyle}>{PL.areaNote}</div>
            </div>

            {/* 5 · add-ons */}
            <div style={block}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={stepHead}>
                        <div style={num}>5</div>
                        <div style={stepTitle}>{PL.s5}</div>
                    </div>
                    {type === 'general' ? <div style={{ fontWeight: 700, fontSize: 11, color: C.indigo }}>{PL.generalHint(visible.length)}</div> : null}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 13 }}>
                    {visible.map(a => {
                        const qty = addons[a.id] || 0;
                        const on = qty > 0;
                        const meta = PL.addon[a.id] ? PL.addon[a.id][1] : '';
                        return (
                            <div
                                key={a.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    padding: '11px 13px',
                                    borderRadius: 8,
                                    border: `1px solid ${on ? C.ink : C.border}`,
                                    background: on ? C.light : '#fff',
                                }}
                            >
                                <div
                                    onClick={() => toggleAddon(a.id, !!a.qty)}
                                    style={{ display: 'flex', alignItems: 'center', gap: 11, flex: 1, cursor: 'pointer' }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
                                            <span style={{ fontWeight: 700, fontSize: 13.5 }}>{PL.addon[a.id] ? PL.addon[a.id][0] : a.id}</span>
                                            <span style={{ fontWeight: 700, fontSize: 12, color: C.slate }}>
                                                +{a.price} zł{meta ? ` / ${meta.replace('za ', '')}` : ''}
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: 6,
                                            flex: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 700,
                                            fontSize: 12,
                                            color: on ? C.ink : 'transparent',
                                            background: on ? C.mint : '#fff',
                                            border: on ? 'none' : `1.5px solid ${C.border}`,
                                        }}
                                    >
                                        ✓
                                    </div>
                                </div>
                                {a.qty && on ? <Stepper value={qty} onChange={q => setQty(a.id, q)} min={1} max={20} /> : null}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 6 · property facts */}
            <div style={block}>
                <div style={stepHead}>
                    <div style={num}>6</div>
                    <div style={stepTitle}>{PL.s6}</div>
                </div>
                <div style={{ ...noteStyle, marginTop: 5 }}>{PL.s6note}</div>
                <Toggle on={pets} onClick={() => setPets(v => !v)} title={PL.pets} note={PL.petsNote} />
                <Toggle on={gearOnSite} onClick={() => setGearOnSite(v => !v)} title={PL.gear} note={type === 'general' ? PL.gearNoteGen : PL.gearNoteStd} />
            </div>

            {/* summary */}
            <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${C.border}` }}>
                {result.lines.map((l, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, padding: '3px 0' }}>
                        <span style={{ fontWeight: 500, fontSize: 12.5, color: l.id === 'discount' ? C.indigo : C.slate }}>{lineLabel(l)}</span>
                        <span style={{ fontWeight: 700, fontSize: 12.5, color: l.value < 0 ? C.indigo : C.ink }}>
                            {l.value < 0 ? '−' : ''}
                            {zl(Math.abs(l.value))}
                        </span>
                    </div>
                ))}

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        gap: 14,
                        marginTop: 14,
                        paddingTop: 14,
                        borderTop: `1px solid ${C.border}`,
                    }}
                >
                    <div>
                        <div style={{ fontWeight: 500, fontSize: 12.5, color: C.slate }}>{PL.priceCaption}</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 2 }}>
                            <span style={{ fontWeight: 800, fontSize: 38, letterSpacing: '-0.03em' }}>{zl(result.total)}</span>
                            {result.discountPln > 0 ? (
                                <span style={{ fontWeight: 700, fontSize: 16, color: C.slate, textDecoration: 'line-through' }}>{zl(result.undiscounted)}</span>
                            ) : null}
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 500, fontSize: 12.5, color: C.slate }}>{PL.time}</div>
                        <div style={{ fontWeight: 700, fontSize: 17, marginTop: 3 }}>{result.hours} h</div>
                        <div style={{ fontWeight: 500, fontSize: 11.5, color: C.slate, marginTop: 1 }}>{PL.crew(result.crew)}</div>
                    </div>
                </div>

                <button
                    type='button'
                    onClick={() => onBook && onBook({ type, freq, rooms, bathrooms, area, addons, pets, gearOnSite, ...result })}
                    style={{
                        width: '100%',
                        marginTop: 16,
                        height: 52,
                        border: 'none',
                        borderRadius: 8,
                        background: C.mint,
                        color: C.ink,
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: 16,
                    }}
                >
                    {PL.cta}
                </button>
                <div style={{ fontWeight: 500, fontSize: 11.5, lineHeight: 1.5, textAlign: 'center', color: C.slate, marginTop: 10 }}>{PL.footnote}</div>
            </div>
        </Card>
    );
};

export default CleaningCalculator;
