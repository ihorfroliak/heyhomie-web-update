# -*- coding: utf-8 -*-
"""Generate UA + PL versions of the HeyHomie SEO & Booking-UX handoff PDF."""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak,
    HRFlowable, Preformatted, ListFlowable, ListItem,
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

BASE, BOLD, MONO = "Helvetica", "Helvetica-Bold", "Courier"
try:
    fdir = r"C:\Windows\Fonts"
    pdfmetrics.registerFont(TTFont("AppFont", os.path.join(fdir, "arial.ttf")))
    pdfmetrics.registerFont(TTFont("AppFont-Bold", os.path.join(fdir, "arialbd.ttf")))
    BASE, BOLD = "AppFont", "AppFont-Bold"
    for cand in ("consola.ttf", "cour.ttf"):
        p = os.path.join(fdir, cand)
        if os.path.exists(p):
            pdfmetrics.registerFont(TTFont("AppMono", p)); MONO = "AppMono"; break
except Exception as e:
    print("font fallback:", e)

DARK = colors.HexColor("#14133a"); GREY = colors.HexColor("#727189")
TEAL = colors.HexColor("#1a7a50"); TEALBG = colors.HexColor("#eafff5")
LINE = colors.HexColor("#e2e2eb"); CODEBG = colors.HexColor("#f6f7fb")

h_title = ParagraphStyle("t", fontName=BOLD, fontSize=23, textColor=DARK, leading=28, spaceAfter=6)
h_sub = ParagraphStyle("s", fontName=BASE, fontSize=10.5, textColor=GREY, leading=15, spaceAfter=2)
h1 = ParagraphStyle("h1", fontName=BOLD, fontSize=16, textColor=DARK, leading=20, spaceBefore=16, spaceAfter=8)
h2 = ParagraphStyle("h2", fontName=BOLD, fontSize=12.5, textColor=DARK, leading=16, spaceBefore=12, spaceAfter=5)
body = ParagraphStyle("b", fontName=BASE, fontSize=9.7, textColor=DARK, leading=14.5, spaceAfter=6)
small = ParagraphStyle("sm", fontName=BASE, fontSize=8.5, textColor=GREY, leading=12)
cell = ParagraphStyle("c", fontName=BASE, fontSize=8.7, textColor=DARK, leading=12)
cellb = ParagraphStyle("cb", fontName=BOLD, fontSize=8.7, textColor=DARK, leading=12)
cellh = ParagraphStyle("ch", fontName=BOLD, fontSize=8.7, textColor=colors.white, leading=12)
code = ParagraphStyle("code", fontName=MONO, fontSize=8.2, textColor=DARK, leading=12, backColor=CODEBG, borderPadding=6, spaceAfter=6)

FE = f'<font name="{BOLD}" color="#3344cc">[FE]</font>'
BE = f'<font name="{BOLD}" color="#9a5c00">[BE]</font>'


def build_story(T):
    st = []
    def P(t, s=body): st.append(Paragraph(t, s))
    def SP(h=8): st.append(Spacer(1, h))
    def HR():
        SP(8); st.append(HRFlowable(width="100%", thickness=0.7, color=LINE)); SP(8)
    def BUL(items, s=body):
        st.append(ListFlowable([ListItem(Paragraph(i, s), leftIndent=10, value="•") for i in items],
                               bulletType="bullet", start="•", leftIndent=12)); SP(4)
    def C(t, b=False): return Paragraph(t, cellb if b else cell)
    def H(t): return Paragraph(t, cellh)
    def TBL(data, widths, header=True):
        tb = Table(data, colWidths=widths, repeatRows=1 if header else 0)
        sty = [("VALIGN", (0, 0), (-1, -1), "TOP"),
               ("LEFTPADDING", (0, 0), (-1, -1), 6), ("RIGHTPADDING", (0, 0), (-1, -1), 6),
               ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
               ("LINEBELOW", (0, 0), (-1, -1), 0.4, LINE), ("LINEAFTER", (0, 0), (-2, -1), 0.4, LINE),
               ("BOX", (0, 0), (-1, -1), 0.6, LINE)]
        if header: sty.append(("BACKGROUND", (0, 0), (-1, 0), DARK))
        for r in range(1, len(data)):
            if r % 2 == 0: sty.append(("BACKGROUND", (0, r), (-1, r), colors.HexColor("#fafbfe")))
        tb.setStyle(TableStyle(sty)); st.append(tb); SP(8)

    # ---- Title ----
    SP(36)
    P(T["title"], h_title); P(T["subtitle"], h_title); SP(6)
    P(T["meta1"], h_sub); P(T["meta2"], h_sub); P(T["meta3"], h_sub); SP(14)
    box = Table([[Paragraph(T["legend"], cell)]], colWidths=[166 * mm])
    box.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), TEALBG), ("BOX", (0, 0), (-1, -1), 0.6, TEAL),
                             ("LEFTPADDING", (0, 0), (-1, -1), 10), ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                             ("TOPPADDING", (0, 0), (-1, -1), 8), ("BOTTOMPADDING", (0, 0), (-1, -1), 8)]))
    st.append(box); HR()

    # ---- 1 Overview ----
    P(T["s1_h"], h1); P(T["s1_p"], body); BUL([T["s1_b1"], T["s1_b2"]]); P(T["s1_p2"], body)

    # ---- 2 Done ----
    P(T["s2_h"], h1); P(T["s2_new"], h2)
    rows = [[H(T["col_file"]), H(T["col_purpose"])]] + [[C(f, True), C(p)] for f, p in T["new_files"]]
    TBL(rows, [70 * mm, 96 * mm])
    P(T["s2_mod"], h2)
    rows = [[H(T["col_file"]), H(T["col_change"])]] + [[C(f, True), C(p)] for f, p in T["mod_files"]]
    TBL(rows, [70 * mm, 96 * mm])
    P(T["s2_verify"], h2)
    st.append(Preformatted(T["verify_code"], code))

    # ---- 3 SEO ----
    st.append(PageBreak())
    P(T["s3_h"], h1); P(T["s3_p"], body)
    rows = [[H(T["col_pri"]), H(T["col_lever"]), H(T["col_why"]), H(T["col_type"])]]
    for pri, lev, why, typ in T["seo_rows"]:
        rows.append([C(pri, True), C(lev, True), C(why), C(typ)])
    TBL(rows, [12 * mm, 46 * mm, 85 * mm, 23 * mm])
    P(T["home_note_h"], h2); P(T["home_note_p"], body)
    P(T["h1_note_h"], h2); P(T["h1_note_p"], body)
    P(T["honesty_h"], h2); P(T["honesty_p"], body)

    # ---- 4 UX ----
    st.append(PageBreak())
    P(T["s4_h"], h1); P(T["s4_p"], body)
    P(T["cur_opt_h"], h2)
    rows = [[H(T["col_cur"]), H(T["col_opt"])]] + [[C(a), C(b)] for a, b in T["flow_rows"]]
    TBL(rows, [82 * mm, 82 * mm])
    P(T["changes_h"], h2)
    for title, tg, items in T["changes"]:
        P(f'<b>{title}</b> {tg}', body); BUL(items)

    # ---- 5 Deploy / 6 Guardrails ----
    st.append(PageBreak())
    P(T["s5_h"], h1); BUL(T["deploy"])
    P(T["s6_h"], h1); BUL(T["guard"])
    HR(); P(T["footer"], small)
    return st


# ============================ POLISH ============================
PL = {
    "title": "HeyHomie Client", "subtitle": "Wdrożenie SEO i UX rezerwacji - dokumentacja",
    "meta1": "Klient Next.js (heyhomie-client) - marketplace sprzątania, Polska.",
    "meta2": "Odbiorca: programista frontend odpowiedzialny za wdrożenie.",
    "meta3": "Cel: pozycja #1 dla sprzątania w Krakowie / Warszawie / Polsce, mniej tarcia w rezerwacji, bez psucia logiki zamówień.",
    "legend": f'<b>Legenda.</b> {FE} = zmiana tylko po stronie frontendu, bezpieczna do wdrożenia bez prac backendowych. {BE} = wymaga koordynacji z backendem (Rails / Go API). Każda propozycja poniżej jest oznaczona.',
    "s1_h": "1. Przegląd", "s1_p": "Dokument obejmuje dwa nurty prac:",
    "s1_b1": "<b>A - SEO (wdrożone, gotowe).</b> Sekcja o sprzątaniu zależna od miasta, dane strukturalne (schema.org), hreflang, robots.txt, dynamiczny sitemap oraz meta tagi per miasto.",
    "s1_b2": "<b>B - UX rezerwacji (propozycja).</b> Plan skrócenia ścieżki zamówienia z ~15-17 do ~6-8 interakcji, bez psucia logiki Redux.",
    "s1_p2": "Wszystko z sekcji A jest już w kodzie. Sekcja B to przemyślana propozycja z plikami, ryzykiem i testami - do wdrożenia w jeden dzień.",
    "s2_h": "2. Już wdrożone (sekcja A) - pliki", "s2_new": "Nowe pliki",
    "col_file": "Plik", "col_purpose": "Cel", "col_change": "Zmiana",
    "new_files": [
        ("components/serviceLanding/cleaning/cityDistricts.js", "6 miast + listy dzielnic + helper getCitySeoForms() (przypadek miejscownika)."),
        ("components/serviceLanding/cleaning/CleaningSeoSection.js", "Sekcja zależna od miasta: wstęp, zaufanie, plany standardowy/generalny, usługi powiązane, dzielnice, FAQ (akordeon), linki do innych miast, link do /cleaning."),
        ("components/serviceLanding/cleaning/CleaningSeoJsonLd.js", "schema.org: Service + CleaningService/LocalBusiness + FAQPage + BreadcrumbList + canonical. Bez aggregateRating (celowo)."),
        ("components/seo/HreflangLinks.js", "Alternatywy hreflang pl/en/x-default."),
        ("components/home/HomeLanding.js", "Strona glowna /: hero z H1, wybor miasta, propozycja wartosci, CTA."),
        ("pages/sitemap.xml.js", "Dynamiczny sitemap.xml: trasy statyczne + wszystkie miasta (z API) x pl/en."),
    ],
    "s2_mod": "Zmienione pliki",
    "mod_files": [
        ("pages/[city].js", "Renderuje <CleaningSeoSection> przed stopka; meta per miasto; <HreflangLinks>."),
        ("pages/index.js", "Strona glowna jest teraz indeksowalnym landingiem; przekierowanie tylko dla powracajacych (z zapisanym miastem). Zastepuje auto-redirect z geolokacji."),
        ("pages/cleaning.js", "<HreflangLinks>; cel linku 'standardowe i generalne sprzatanie'."),
        ("public/robots.txt", "Dodano Sitemap; zablokowano /account (takze /*/account/)."),
        ("messages/pl.json, en.json", "Nowy namespace CleaningSeoSection (11 FAQ) + IndexPage.landing + CityPage.meta.*_city."),
        ("components/citypage/servicesContainer/ServicesSlider.js", "Gwarantuje jeden <h1> w stanie 'wybrana usluga' (brakowalo); dodatkowo, ukryty wizualnie."),
        ("components/citypage/menus/bookingmenu/BookingMenu.js", "Zabezpieczenie defaultCard: Pay Later/Cash zawsze dziala jako domyslna platnosc (brak awarii)."),
    ],
    "s2_verify": "Jak sprawdzić lokalnie",
    "verify_code": "cd heyhomie-client\nnpm install\nnpm run dev        # http://localhost:3001/pl/krakow (przewin na dol)\n\n# Sprawdz:\n#  /                    -> landing z H1 + wybor miasta\n#  /robots.txt          -> zawiera Sitemap: ...\n#  /sitemap.xml         -> wszystkie miasta pl + en\n#  Google Rich Results Test -> FAQPage + Service",
    "s3_h": "3. SEO - pozostałe dźwignie (priorytety)",
    "s3_p": "Poza tym co już wdrożone, te elementy podnoszą pozycję dalej. P0 [zrobione] są w tej dostawie.",
    "col_pri": "Pri", "col_lever": "Dzwignia", "col_why": "Dlaczego", "col_type": "Typ",
    "seo_rows": [
        ("P0", "hreflang pl/en", "Google przestaje traktowac wersje jezykowe jako duplikaty.", "FE [zrobione]"),
        ("P0", "H1 w stanie 'wybrana usluga'", "Lejek sprzatania (?selectedService=cleaning) nie mial H1.", "FE [zrobione]"),
        ("P0", "Pusta strona glowna /", "Naprawiono: / jest teraz indeksowalnym landingiem (bylo puste + JS redirect).", "FE [zrobione]"),
        ("P1", "Realne opinie -> AggregateRating", "Gwiazdki w wynikach podnosza CTR. Macie Trustpilot - tylko realne dane.", "BE"),
        ("P1", "Google Business Profile per miasto", "Napedza lokalny pakiet map - najwiekszy ruch lokalny.", "off-site"),
        ("P1", "Core Web Vitals", "Next 10 jest stary; sprawdz LCP/CLS na stronach miast.", "FE"),
        ("P2", "Blog / porady", "Lapie zapytania long-tail (jak przygotowac mieszkanie...).", "FE"),
        ("P2", "Strony dzielnic /krakow/kazimierz", "Najsilniejsze lokalne SEO; wiekszy projekt.", "FE/BE"),
    ],
    "home_note_h": "Uwaga o stronie głównej (/).",
    "home_note_p": "Strona / jest teraz indeksowalnym landingiem (hero + H1 + wybor miasta). Przekierowanie zostalo zachowane tylko dla powracajacych uzytkownikow (z zapisanym miastem). Poprzednie auto-przekierowanie z geolokacji zostalo usuniete; aby je przywrocic, uzyj flow determineLocation() z historii git.",
    "h1_note_h": "Uwaga o widocznym tekście H1.",
    "h1_note_p": 'Domyslny H1 hero ("Korzystaj wygodnie z uslug") to slogan marki bez miasta/slowa kluczowego. Zmiana na "Sprzatanie w Krakowie" pomoglaby SEO, ale to widoczna zmiana designu - pozostawiona jako opcjonalna.',
    "honesty_h": "Uczciwość / bezpieczeństwo (kary Google).",
    "honesty_p": "JSON-LD celowo pomija aggregateRating i review. Sfabrykowane oceny lamia wytyczne Google i grozi kara reczna. Dodaj je tylko z realnymi, weryfikowalnymi opiniami.",
    "s4_h": "4. UX rezerwacji - mniej kliknięć (sekcja B, propozycja)",
    "s4_p": "Na podstawie BookingMenu.js: rezerwacja jest blokowana, jesli user nie jest zalogowany. Platnosc nie blokuje - Pay Later jest juz domyslny (i zabezpieczony). Glowne tarcie to obowiazkowa rejestracja.",
    "cur_opt_h": "Obecnie vs zoptymalizowane",
    "col_cur": "Obecnie (~15-17 klikniec)", "col_opt": "Zoptymalizowane (~6-8 klikniec)",
    "flow_rows": [
        ("1. Wybierz usluge 'Sprzatanie'", "1. Wybierz usluge 'Sprzatanie'"),
        ("2. Konfiguracja (3-5 klikniec)", "2. Konfiguracja z domyslnymi (1-2)"),
        ("3. Dodaj adres", "3. Adres + data w jednym kroku"),
        ("4. Wybierz date + godzine", "4. Cena przypieta przy 'Book now' [FE]"),
        ("5. Obowiazkowa rejestracja: imie, nazwisko, email, telefon + 2 zgody", "5. Tylko telefon + email (imie pozniej) [FE]"),
        ("6. Kod SMS", "6. Kod SMS; telefon auto-uzupelniony dla powracajacych [FE]"),
        ("7. 'Let's book'", "7. 'Zarezerwuj' - gotowe"),
    ],
    "changes_h": "Proponowane zmiany",
    "changes": [
        ("Zmiana 1 - Przypnij cene przy 'Book now'.", FE, ["Cena jest juz liczona i pokazywana w BookingMenu. Opcja: zapisz policzona cene w orderSlice, by byla stabilna do potwierdzenia.", "Ryzyko: niskie. Test: skonfiguruj usluge, otworz rezerwacje, sprawdz ze cena sie zgadza."]),
        ("Zmiana 2 - Domyslna platnosc Cash / Pay Later.", FE, ["JUZ DZIALA: Pay Later jest default w cardsSlice, a defaultCard jest zabezpieczony (ta dostawa). Karta nie jest wymagana.", "Test: zalogowany bez karty konczy rezerwacje z Pay Later."]),
        ("Zmiana 3 - Skroc rejestracje do telefon + email.", FE, ["Zbieraj tylko telefon + email; imie pozniej lub opcjonalnie (SignUpMenu.js, isSignUpAllowed).", "Potwierdz, ze endpoint rejestracji akceptuje pusty/brak nazwiska."]),
        ("Zmiana 4 - Auto-uzupelnienie telefonu + auto-start OTP dla powracajacych.", FE, ["Slice user jest zapisany w localStorage; uzupelnij telefon i wyslij kod automatycznie. Caly flow jest w aplikacji (brak zewnetrznej strony)."]),
        ("Zmiana 5 - Pelny gosc-checkout (bez konta).", BE, ["orders/confirm wymaga x_token_user; sam frontend nie pominie tego bezpiecznie.", "Koordynuj z wlascicielem Rails/Go, by przyjmowac zamowienia gosci, potem podlacz FE. Rob po zmianach 1-4."]),
    ],
    "s5_h": "5. Lista kontrolna wdrożenia",
    "deploy": ["npm install (archiwum bez node_modules).", "Sprawdz zmienne srodowiskowe: NEXT_PUBLIC_BASE_URL(_SERVER/_CLIENT), Stripe, GA, FB.",
               "npm run build i npm start (lub pipeline Heroku / server.js).", "Otworz / , /pl/krakow , /en/krakow - landing i sekcja sprzatania dzialaja.",
               "Sprawdz /robots.txt i /sitemap.xml.", "Search Console: zglos https://www.heyhomie.io/sitemap.xml.",
               "Rich Results Test: FAQPage + Service na stronie miasta.", "npm run lint, npm run format:check (eslint + prettier)."],
    "s6_h": "6. Czego NIE psuć",
    "guard": ["Flow Redux: initCitySession, confirmOrderClearOrderState, resetOrderSession - nie zmieniaj sygnatur.",
              "Tokeny: x_token_user (zalogowany) vs x_token_visitor (gosc). orders/confirm wymaga x_token_user.",
              "i18n / ICU: w tlumaczeniach owijaj literalny HTML lub '{','<' w apostrofy; tekst z {placeholder} bez apostrofow.",
              "Menu: overlayActionsStack napedza kazdy sidebar/modal; push/pop parami.",
              "Tylko jeden <h1> na stan; galezie ServicesSlider sa rozlaczne - zachowaj to."],
    "footer": "Dokument dla programisty. Sekcja A jest gotowa do wdrozenia; sekcja B to plan na jeden dzien.",
}

# ============================ UKRAINIAN ============================
UK = {
    "title": "HeyHomie Client", "subtitle": "Впровадження SEO та UX замовлення - документація",
    "meta1": "Next.js клієнт (heyhomie-client) - маркетплейс прибирання, Польща.",
    "meta2": "Аудиторія: фронтенд-розробник, відповідальний за деплой.",
    "meta3": "Мета: позиція #1 для прибирання у Кракові / Варшаві / Польщі, менше тертя в замовленні, без поломки бізнес-логіки.",
    "legend": f'<b>Легенда.</b> {FE} = зміна лише на фронтенді, безпечна для деплою без бекенду. {BE} = потребує координації з бекендом (Rails / Go API). Кожну пропозицію нижче позначено.',
    "s1_h": "1. Огляд", "s1_p": "Документ охоплює два напрями робіт:",
    "s1_b1": "<b>A - SEO (зроблено, готове).</b> City-aware секція про прибирання, структуровані дані (schema.org), hreflang, robots.txt, динамічний sitemap та мета-теги по містах.",
    "s1_b2": "<b>B - UX замовлення (пропозиція).</b> План скоротити шлях замовлення з ~15-17 до ~6-8 взаємодій, без поломки логіки Redux.",
    "s1_p2": "Усе з секції A вже в коді. Секція B - продуманий план з файлами, ризиком і тестами - реалізується за один день.",
    "s2_h": "2. Вже зроблено (секція A) - файли", "s2_new": "Нові файли",
    "col_file": "Файл", "col_purpose": "Призначення", "col_change": "Зміна",
    "new_files": [
        ("components/serviceLanding/cleaning/cityDistricts.js", "6 міст + списки дільниць + хелпер getCitySeoForms() (місцевий відмінок)."),
        ("components/serviceLanding/cleaning/CleaningSeoSection.js", "City-aware секція: вступ, довіра, плани стандарт/генеральне, суміжні сервіси, дільниці, FAQ (акордеон), перелінковка міст, лінк на /cleaning."),
        ("components/serviceLanding/cleaning/CleaningSeoJsonLd.js", "schema.org: Service + CleaningService/LocalBusiness + FAQPage + BreadcrumbList + canonical. Без aggregateRating (навмисно)."),
        ("components/seo/HreflangLinks.js", "Альтернативи hreflang pl/en/x-default."),
        ("components/home/HomeLanding.js", "Головна /: герой з H1, вибір міста, цінність, CTA."),
        ("pages/sitemap.xml.js", "Динамічний sitemap.xml: статичні маршрути + усі міста (з API) x pl/en."),
    ],
    "s2_mod": "Змінені файли",
    "mod_files": [
        ("pages/[city].js", "Рендерить <CleaningSeoSection> перед футером; мета по місту; <HreflangLinks>."),
        ("pages/index.js", "Головна тепер індексований лендинг; редирект лише для повторних (із збереженим містом). Замінює авто-редирект з геолокації."),
        ("pages/cleaning.js", "<HreflangLinks>; ціль лінку 'стандартне і генеральне прибирання'."),
        ("public/robots.txt", "Додано Sitemap; заблоковано /account (також /*/account/)."),
        ("messages/pl.json, en.json", "Новий namespace CleaningSeoSection (11 FAQ) + IndexPage.landing + CityPage.meta.*_city."),
        ("components/citypage/servicesContainer/ServicesSlider.js", "Гарантує один <h1> у стані 'вибраний сервіс' (його бракувало); додатково, приховано візуально."),
        ("components/citypage/menus/bookingmenu/BookingMenu.js", "Захист defaultCard: Pay Later/Cash завжди працює як дефолтна оплата (без краху)."),
    ],
    "s2_verify": "Як перевірити локально",
    "verify_code": "cd heyhomie-client\nnpm install\nnpm run dev        # http://localhost:3001/pl/krakow (прокрути вниз)\n\n# Перевір:\n#  /                    -> лендинг з H1 + вибір міста\n#  /robots.txt          -> містить Sitemap: ...\n#  /sitemap.xml         -> усі міста pl + en\n#  Google Rich Results Test -> FAQPage + Service",
    "s3_h": "3. SEO - решта важелів (пріоритети)",
    "s3_p": "Окрім зробленого, ці пункти піднімають позицію далі. P0 [зроблено] - у цій поставці.",
    "col_pri": "Пр", "col_lever": "Важіль", "col_why": "Чому", "col_type": "Тип",
    "seo_rows": [
        ("P0", "hreflang pl/en", "Google перестає вважати мовні версії дублями.", "FE [зроблено]"),
        ("P0", "H1 у стані 'вибраний сервіс'", "Воронка прибирання (?selectedService=cleaning) не мала H1.", "FE [зроблено]"),
        ("P0", "Порожня головна /", "Виправлено: / тепер індексований лендинг (було порожньо + JS-редирект).", "FE [зроблено]"),
        ("P1", "Реальні відгуки -> AggregateRating", "Зірочки у видачі підіймають CTR. У вас є Trustpilot - лише реальні дані.", "BE"),
        ("P1", "Google Business Profile по містах", "Дає локальний пак мап - головний локальний трафік.", "off-site"),
        ("P1", "Core Web Vitals", "Next 10 старий; перевір LCP/CLS на сторінках міст.", "FE"),
        ("P2", "Блог / поради", "Ловить long-tail запити (як підготувати квартиру...).", "FE"),
        ("P2", "Сторінки дільниць /krakow/kazimierz", "Найсильніше локальне SEO; більший проєкт.", "FE/BE"),
    ],
    "home_note_h": "Примітка про головну (/).",
    "home_note_p": "Головна / тепер індексований лендинг (герой + H1 + вибір міста). Редирект збережено лише для повторних користувачів (із збереженим містом). Попередній авто-редирект з геолокації прибрано; щоб повернути, візьми flow determineLocation() з історії git.",
    "h1_note_h": "Примітка про видимий текст H1.",
    "h1_note_p": 'Дефолтний H1 героя ("Korzystaj wygodnie z uslug") - слоган бренду без міста/ключа. Зміна на "Sprzatanie w Krakowie" допомогла б SEO, але це видима зміна дизайну - лишено опційно.',
    "honesty_h": "Чесність / безпека (покарання Google).",
    "honesty_p": "JSON-LD навмисно без aggregateRating і review. Вигадані рейтинги порушують правила Google і ризикують ручним покаранням. Додавати лише з реальними відгуками.",
    "s4_h": "4. UX замовлення - менше кліків (секція B, пропозиція)",
    "s4_p": "На основі BookingMenu.js: замовлення блокується, якщо користувач не авторизований. Оплата не блокує - Pay Later вже дефолт (і захищений). Головне тертя - обов'язкова реєстрація.",
    "cur_opt_h": "Зараз vs оптимізовано",
    "col_cur": "Зараз (~15-17 кліків)", "col_opt": "Оптимізовано (~6-8 кліків)",
    "flow_rows": [
        ("1. Вибрати сервіс 'Прибирання'", "1. Вибрати сервіс 'Прибирання'"),
        ("2. Налаштування (3-5 кліків)", "2. Налаштування зі смарт-дефолтами (1-2)"),
        ("3. Додати адресу", "3. Адреса + дата в одному кроці"),
        ("4. Вибрати дату + час", "4. Ціна запінена при 'Book now' [FE]"),
        ("5. Обов'язкова реєстрація: ім'я, прізвище, email, телефон + 2 згоди", "5. Лише телефон + email (ім'я пізніше) [FE]"),
        ("6. SMS-код", "6. SMS-код; телефон авто-заповнено для повторних [FE]"),
        ("7. 'Let's book'", "7. 'Замовити' - готово"),
    ],
    "changes_h": "Запропоновані зміни",
    "changes": [
        ("Зміна 1 - Запінити ціну при 'Book now'.", FE, ["Ціна вже рахується і показується в BookingMenu. Опція: зберегти пораховану ціну в orderSlice, щоб була стабільною до підтвердження.", "Ризик: низький. Тест: налаштуй сервіс, відкрий замовлення, переконайся що ціна збігається."]),
        ("Зміна 2 - Дефолтна оплата Cash / Pay Later.", FE, ["ВЖЕ ПРАЦЮЄ: Pay Later - default у cardsSlice, а defaultCard захищено (ця поставка). Картка не обов'язкова.", "Тест: авторизований без картки завершує замовлення з Pay Later."]),
        ("Зміна 3 - Скоротити реєстрацію до телефон + email.", FE, ["Збирай лише телефон + email; ім'я пізніше або опційно (SignUpMenu.js, isSignUpAllowed).", "Підтвердь, що ендпоінт реєстрації приймає порожнє/без прізвища."]),
        ("Зміна 4 - Авто-заповнення телефону + авто-старт OTP для повторних.", FE, ["Slice user збережено в localStorage; заповни телефон і надішли код автоматично. Весь flow в застосунку (без зовнішньої сторінки)."]),
        ("Зміна 5 - Повний гість-checkout (без акаунта).", BE, ["orders/confirm вимагає x_token_user; сам фронтенд не пропустить це безпечно.", "Координуй з власником Rails/Go, щоб приймати замовлення гостей, потім підключи FE. Роби після змін 1-4."]),
    ],
    "s5_h": "5. Чекліст деплою",
    "deploy": ["npm install (архів без node_modules).", "Перевір env: NEXT_PUBLIC_BASE_URL(_SERVER/_CLIENT), Stripe, GA, FB.",
               "npm run build і npm start (або pipeline Heroku / server.js).", "Відкрий / , /pl/krakow , /en/krakow - лендинг і секція прибирання працюють.",
               "Перевір /robots.txt і /sitemap.xml.", "Search Console: подай https://www.heyhomie.io/sitemap.xml.",
               "Rich Results Test: FAQPage + Service на сторінці міста.", "npm run lint, npm run format:check (eslint + prettier)."],
    "s6_h": "6. Що НЕ ламати",
    "guard": ["Redux flow: initCitySession, confirmOrderClearOrderState, resetOrderSession - не міняй сигнатури.",
              "Токени: x_token_user (авторизований) vs x_token_visitor (гість). orders/confirm потребує x_token_user.",
              "i18n / ICU: у перекладах огортай літеральний HTML або '{','<' в апострофи; текст з {placeholder} - без апострофів.",
              "Меню: overlayActionsStack керує кожним sidebar/modal; push/pop парами.",
              "Лише один <h1> на стан; гілки ServicesSlider взаємовиключні - збережи це."],
    "footer": "Документ для розробника. Секція A готова до деплою; секція B - план на один день.",
}

for code_name, T in (("PL", PL), ("UA", UK)):
    out = rf"C:\Users\ihorf\Downloads\HeyHomie_SEO_UX_Handoff_{code_name}.pdf"
    doc = SimpleDocTemplate(out, pagesize=A4, leftMargin=22 * mm, rightMargin=22 * mm,
                            topMargin=18 * mm, bottomMargin=16 * mm,
                            title=f"HeyHomie SEO & UX Handoff ({code_name})", author="HeyHomie")
    doc.build(build_story(T))
    print("PDF written:", out)
