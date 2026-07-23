# -*- coding: utf-8 -*-
"""Generate the HeyHomie SEO & Booking-UX developer handoff PDF."""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak,
    HRFlowable, Preformatted, ListFlowable, ListItem,
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ---------- Fonts (Unicode for Polish characters) ----------
BASE, BOLD, MONO = "Helvetica", "Helvetica-Bold", "Courier"
try:
    fonts = r"C:\Windows\Fonts"
    pdfmetrics.registerFont(TTFont("AppFont", os.path.join(fonts, "arial.ttf")))
    pdfmetrics.registerFont(TTFont("AppFont-Bold", os.path.join(fonts, "arialbd.ttf")))
    BASE, BOLD = "AppFont", "AppFont-Bold"
    for cand in ("consola.ttf", "cour.ttf"):
        p = os.path.join(fonts, cand)
        if os.path.exists(p):
            pdfmetrics.registerFont(TTFont("AppMono", p))
            MONO = "AppMono"
            break
except Exception as e:  # noqa
    print("font fallback:", e)

# ---------- Palette ----------
DARK = colors.HexColor("#14133a")
TEAL = colors.HexColor("#1a7a50")
TEALBG = colors.HexColor("#eafff5")
PINK = colors.HexColor("#b3164c")
GREY = colors.HexColor("#727189")
LINE = colors.HexColor("#e2e2eb")
FEBG = colors.HexColor("#eef0ff")
FECOL = colors.HexColor("#3344cc")
BEBG = colors.HexColor("#fff6e8")
BECOL = colors.HexColor("#9a5c00")
CODEBG = colors.HexColor("#f6f7fb")

# ---------- Styles ----------
ss = getSampleStyleSheet()
def S(name, **kw):
    return ParagraphStyle(name, **kw)

h_title = S("h_title", fontName=BOLD, fontSize=24, textColor=DARK, leading=29, spaceAfter=6)
h_sub = S("h_sub", fontName=BASE, fontSize=11, textColor=GREY, leading=15, spaceAfter=2)
h1 = S("h1", fontName=BOLD, fontSize=16, textColor=DARK, leading=20, spaceBefore=16, spaceAfter=8)
h2 = S("h2", fontName=BOLD, fontSize=12.5, textColor=DARK, leading=16, spaceBefore=12, spaceAfter=5)
body = S("body", fontName=BASE, fontSize=9.7, textColor=DARK, leading=14.5, spaceAfter=6)
small = S("small", fontName=BASE, fontSize=8.5, textColor=GREY, leading=12)
cell = S("cell", fontName=BASE, fontSize=8.7, textColor=DARK, leading=12)
cellb = S("cellb", fontName=BOLD, fontSize=8.7, textColor=DARK, leading=12)
cellh = S("cellh", fontName=BOLD, fontSize=8.7, textColor=colors.white, leading=12)
code = S("code", fontName=MONO, fontSize=8.2, textColor=DARK, leading=12,
         backColor=CODEBG, borderPadding=6, leftIndent=2, spaceAfter=6)

def tag(t):
    if t == "FE":
        return f'<font name="{BOLD}" color="#3344cc">[FE]</font>'
    if t == "BE":
        return f'<font name="{BOLD}" color="#9a5c00">[BE]</font>'
    return ""

story = []

def hr(sp=8):
    story.append(Spacer(1, sp))
    story.append(HRFlowable(width="100%", thickness=0.7, color=LINE))
    story.append(Spacer(1, sp))

def para(t, st=body):
    story.append(Paragraph(t, st))

def bullets(items, st=body):
    story.append(ListFlowable(
        [ListItem(Paragraph(i, st), leftIndent=10, value="•") for i in items],
        bulletType="bullet", start="•", leftIndent=12,
    ))
    story.append(Spacer(1, 4))

def table(data, widths, header=True, zebra=True):
    t = Table(data, colWidths=widths, repeatRows=1 if header else 0)
    sts = [
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LINEBELOW", (0, 0), (-1, -1), 0.4, LINE),
        ("LINEAFTER", (0, 0), (-2, -1), 0.4, LINE),
        ("BOX", (0, 0), (-1, -1), 0.6, LINE),
    ]
    if header:
        sts += [("BACKGROUND", (0, 0), (-1, 0), DARK)]
    if zebra:
        for r in range(1, len(data)):
            if r % 2 == 0:
                sts.append(("BACKGROUND", (0, r), (-1, r), colors.HexColor("#fafbfe")))
    t.setStyle(TableStyle(sts))
    story.append(t)
    story.append(Spacer(1, 8))

def H(txt):
    return Paragraph(txt, cellh)
def C(txt, b=False):
    return Paragraph(txt, cellb if b else cell)

# ============================ TITLE ============================
story.append(Spacer(1, 40))
para("HeyHomie Client", h_title)
para("SEO &amp; Booking-UX Implementation Handoff", h_title)
story.append(Spacer(1, 6))
para("Next.js client (heyhomie-client) - cleaning marketplace, Poland", h_sub)
para("Audience: frontend developer responsible for deployment", h_sub)
para("Goal: rank #1 for cleaning in Krakow / Warszawa / Poland, reduce booking friction, never break the order business logic.", h_sub)
story.append(Spacer(1, 16))

box = Table([[Paragraph(
    f'<b>Legend.</b> {tag("FE")} = frontend-only change, safe to apply and deploy without backend work. '
    f'{tag("BE")} = requires backend (Rails / Go API) coordination. Each proposed change below is tagged.',
    cell)]], colWidths=[165 * mm])
box.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), TEALBG),
    ("BOX", (0, 0), (-1, -1), 0.6, TEAL),
    ("LEFTPADDING", (0, 0), (-1, -1), 10), ("RIGHTPADDING", (0, 0), (-1, -1), 10),
    ("TOPPADDING", (0, 0), (-1, -1), 8), ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
]))
story.append(box)

hr()
para("1. Overview", h1)
para("This document covers two workstreams:", body)
bullets([
    "<b>A - SEO (implemented, ready to deploy).</b> A city-aware cleaning content section, structured data (schema.org), hreflang, robots.txt, a dynamic sitemap, and city-specific meta tags.",
    "<b>B - Booking UX (proposed).</b> A plan to cut the order flow from ~15-17 interactions to ~6-8, without breaking the Redux order/auth logic.",
])
para("Everything in section A is already in the codebase. Section B is a reviewed proposal with exact files, risk and tests so it can be implemented in a single day.", body)

# ============================ SECTION 2: DONE ============================
para("2. Already implemented (section A) - files", h1)
para("New files", h2)
table([
    [H("File"), H("Purpose")],
    [C("components/serviceLanding/cleaning/cityDistricts.js", True), C("6 cities + real district lists + getCitySeoForms() helper (Polish locative cases).")],
    [C("components/serviceLanding/cleaning/CleaningSeoSection.js", True), C("City-aware cleaning section: intro, trust signals, standard/deep plans, related services, districts, FAQ accordion, city cross-links. Link to /cleaning.")],
    [C("components/serviceLanding/cleaning/CleaningSeoJsonLd.js", True), C("schema.org: Service + CleaningService/LocalBusiness + FAQPage + BreadcrumbList + canonical. No aggregateRating (intentional - see 3).")],
    [C("components/seo/HreflangLinks.js", True), C("Reusable pl/en/x-default hreflang alternates.")],
    [C("pages/sitemap.xml.js", True), C("Dynamic sitemap.xml: static routes + all cities (from API) x pl/en, hreflang alternates.")],
], [70 * mm, 95 * mm])

para("Modified files", h2)
table([
    [H("File"), H("Change")],
    [C("pages/[city].js", True), C("Renders &lt;CleaningSeoSection&gt; before the footer; city-aware title/description/og meta; &lt;HreflangLinks&gt;.")],
    [C("pages/cleaning.js", True), C("&lt;HreflangLinks&gt;; is the link target for standard/deep cleaning.")],
    [C("public/robots.txt", True), C("Added Sitemap reference; account pages disallowed (incl. localized /*/account/).")],
    [C("messages/pl.json, en.json", True), C("New CleaningSeoSection namespace (intro, trust, plans, services, 11 FAQ items) + CityPage.meta.*_city keys.")],
    [C("components/citypage/servicesContainer/ServicesSlider.js", True), C("Guarantees one &lt;h1&gt; in the 'service selected' state (was missing); additive, visually hidden, mutually exclusive with the hero h1.")],
], [70 * mm, 95 * mm])

para("How to verify locally", h2)
story.append(Preformatted(
    "cd heyhomie-client\n"
    "npm install\n"
    "npm run dev        # http://localhost:3001/pl/krakow  (scroll to the bottom)\n\n"
    "# Then check:\n"
    "#  /robots.txt          -> contains Sitemap: ...\n"
    "#  /sitemap.xml         -> lists all cities for pl + en\n"
    "#  Google Rich Results Test -> paste page HTML, expect FAQPage + Service",
    code))

# ============================ SECTION 3: SEO LEVERS ============================
story.append(PageBreak())
para("3. SEO - remaining levers (prioritised)", h1)
para("Beyond what is already shipped, these move the ranking further. P0 marked [done] are already in this delivery.", body)
table([
    [H("Pri"), H("Lever"), H("Why it matters"), H("Type")],
    [C("P0", True), C("hreflang pl/en", True), C("Stops Google treating language versions as duplicates."), C("FE [done]")],
    [C("P0", True), C("H1 in 'service selected' state", True), C("The cleaning funnel (?selectedService=cleaning) had no H1."), C("FE [done]")],
    [C("P0", True), C("Empty homepage /", True), C("/ is a client-side redirect; the highest-authority URL renders no content. Decide: real landing vs server 302. NOT changed (product/UX decision)."), C("FE/BE")],
    [C("P1", True), C("Real reviews -> AggregateRating", True), C("Star ratings in results raise CTR. You already use Trustpilot - feed real data only."), C("BE")],
    [C("P1", True), C("Google Business Profile per city", True), C("Drives the local map pack - the biggest local-search surface."), C("off-site")],
    [C("P1", True), C("Core Web Vitals", True), C("Next 10 is old; check LCP/CLS on city pages."), C("FE")],
    [C("P2", True), C("Blog / tips hub", True), C("Captures long-tail queries (jak przygotowac mieszkanie...)."), C("FE")],
    [C("P2", True), C("District landing pages /krakow/kazimierz", True), C("Strongest possible local SEO; larger build."), C("FE/BE")],
], [12 * mm, 46 * mm, 84 * mm, 23 * mm])

para("Note on the homepage (/).", h2)
para("It currently redirects with client-side JS in a useEffect. Changing this affects UX (users expect to land on a city), so it was intentionally left untouched. The recommended fix is a product decision: either (a) make / a real, indexable landing page with a city picker, or (b) keep the redirect but issue it server-side (302) so authority flows cleanly to the city page. Pick one with the product owner before implementing.", body)
para("Note on the visible H1 text.", h2)
para('The default hero H1 ("Korzystaj wygodnie z uslug") is a brand tagline without a city/keyword. Making it city-aware ("Sprzatanie i uslugi domowe w Krakowie") would help SEO but is a visible design change - left as an optional, design-reviewed tweak.', body)
para("Honesty / penalty safety.", h2)
para("The JSON-LD intentionally omits aggregateRating and review markup. Fabricated star ratings violate Google's guidelines and can trigger a manual penalty. Add them only when wired to real, verifiable reviews.", body)

# ============================ SECTION 4: UX ============================
story.append(PageBreak())
para("4. Booking UX - reduce clicks (section B, proposed)", h1)
para("Grounded in components/citypage/menus/bookingmenu/BookingMenu.js: booking is blocked unless user.isAuthenticated AND a card exists (bookingAllowed). A guest pressing 'Let's book' only gets a shake animation - they must register and add a card first. That is the ~15-17 interaction path.", body)

para("Current vs optimised", h2)
table([
    [H("Current (~15-17 clicks)"), H("Optimised (~6-8 clicks)")],
    [C("1. Pick 'Sprzatanie' service"), C("1. Pick 'Sprzatanie' service")],
    [C("2. Configure (3-5 clicks)"), C("2. Configure with smart defaults (1-2 clicks)")],
    [C("3. Add address (form)"), C("3. Address + date in one step")],
    [C("4. Pick date + time"), C("4. Price pinned at 'Book now' - shown immediately [FE]")],
    [C("5. Mandatory sign-up: name, surname, email, phone + 2 checkboxes [friction]"), C("5. Phone + email only (name later) [FE]")],
    [C("6. SMS code [friction]"), C("6. SMS code; phone pre-filled for returning users [FE]")],
    [C("7. Mandatory card [friction]"), C("Card no longer required -> Cash / Pay Later default [FE]")],
    [C("8. 'Let's book'"), C("7. 'Zarezerwuj' - done")],
], [82 * mm, 82 * mm])

para("Proposed changes", h2)

para(f'<b>Change 1 - Pin the price at "Book now".</b> {tag("FE")}', body)
bullets([
    "What: when the user opens booking, store the calculated price in orderSlice and display the pinned value instead of recalculating silently.",
    "Where: lib/slices/orderSlice.js (add pinnedPrice), BookingMenu.js (read it).",
    "Risk: low - price is already computed via calculatePriceForOrder; we only persist it in state.",
    "Test: configure a service, open booking, confirm the price shown matches and does not change unexpectedly.",
])
para(f'<b>Change 2 - Default payment to Cash / Pay Later.</b> {tag("FE")}', body)
bullets([
    "What: the cards slice already includes 'Cash' and 'Pay Later'. Make one of them default so bookingAllowed no longer requires a card.",
    "Where: lib/slices/cardsSlice.js (default flag), BookingMenu.js (the cards.cards.length / defaultCard guard).",
    "Risk: low-medium - confirm the backend accepts orders with cash/pay_later (it already supports these payment types).",
    "Test: as a logged-in user with no card, complete a booking with Cash.",
])
para(f'<b>Change 3 - Slim sign-up to phone + email.</b> {tag("FE")}', body)
bullets([
    "What: collect only phone + email up front; ask for name after the order (or make it optional).",
    "Where: components/citypage/menus/signupmenu/SignUpMenu.js (isSignUpAllowed validation).",
    "Risk: low on FE; confirm the registration endpoint accepts empty/last name.",
    "Test: register with only phone + email, ensure OTP + order still complete.",
])
para(f'<b>Change 4 - Auto-prefill phone + auto-start OTP for returning users.</b> {tag("FE")}', body)
bullets([
    "What: the user slice is persisted to localStorage; pre-fill the phone and auto-trigger the code for known visitors.",
    "Where: SignUpMenu.js / userSlice.js (read persisted phone_number).",
    "Risk: low - all in-app sidebars; no external page is involved today.",
])
para(f'<b>Change 5 - True guest checkout (no account).</b> {tag("BE")}', body)
bullets([
    "What: let a guest order with just phone + email; create the account lazily on the backend.",
    "Why BE: orders/confirm requires x_token_user (an authenticated token). The frontend alone cannot skip this safely.",
    "Action: coordinate with the Rails/Go owner to accept guest orders, then wire the FE.",
    "Risk: medium-high - touches auth and order confirmation; do it after changes 1-4.",
])

# ============================ SECTION 5: DEPLOY ============================
story.append(PageBreak())
para("5. Deploy checklist", h1)
bullets([
    "npm install (the delivered archive ships without node_modules).",
    "Confirm env vars: NEXT_PUBLIC_BASE_URL(_SERVER/_CLIENT), Stripe, GA, FB pixel.",
    "npm run build &amp;&amp; npm start (or the Heroku pipeline / server.js).",
    "Open /pl/krakow and /en/krakow - the cleaning section renders at the bottom; FAQ accordion works.",
    "Validate /robots.txt and /sitemap.xml in the browser.",
    "Google Search Console: submit https://www.heyhomie.io/sitemap.xml.",
    "Google Rich Results Test: confirm FAQPage + Service are detected on a city page.",
    "Lint/format per repo config: npm run lint, npm run format:check (eslint + prettier already configured).",
])

para("6. Guardrails - do NOT break", h1)
bullets([
    "Redux order flow: initCitySession, confirmOrderClearOrderState, resetOrderSession - keep their signatures.",
    "Auth tokens: x_token_user (authenticated) vs x_token_visitor (guest). orders/confirm needs x_token_user today.",
    "i18n / ICU: in messages, wrap literal HTML or '{', '<' in single quotes to escape ICU; plain text with {placeholders} must NOT be quoted.",
    "Menu system: overlayActionsStack drives every sidebar/modal; push/pop in pairs (_pushToOverlayActionStack / _removeFromOverlayActionStack).",
    "Only one <h1> per rendered state - the ServicesSlider branches are mutually exclusive; keep them so.",
])

hr()
para("Prepared as a developer handoff. Section A is deployable as-is; section B is a one-day, reviewed plan. Questions or a UA/PL version of this document can be produced on request.", small)

doc = SimpleDocTemplate(
    r"C:\Users\ihorf\Downloads\HeyHomie_SEO_UX_Handoff.pdf",
    pagesize=A4, leftMargin=22 * mm, rightMargin=22 * mm, topMargin=18 * mm, bottomMargin=16 * mm,
    title="HeyHomie SEO & Booking-UX Handoff", author="HeyHomie",
)
doc.build(story)
print("PDF written:", r"C:\Users\ihorf\Downloads\HeyHomie_SEO_UX_Handoff.pdf")
