<!-- Heading -->
<br />
<p align="center">
  <img src="public/apple-icon-180x180.png" alt="Logo" width="180" height="180">

  <h3 align="center">HeyHomie! Application</h3>

  <p align="center">
    Front-end application for HeyHomie, built with Next.js and Redux.
    <br />
  </p>
</p>

<!-- Table of contents -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#built-with">Built With</a>
      <ul>
        <li><a href="#key-libraries">Key Libraries</a></li>
        <li><a href="#component-libraries">Component Libraries</a></li>
      </ul>
    </li>
    <li>
      <a href="#application-architecture">Application Architecture</a>
      <ul>
        <li><a href="#project-structure-and-key-modules">Project Structure and Key Modules</a></li>
        <li><a href="#application-flow">Application Flow</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#deployment">Deployment</a></li>
        <li><a href="#adding-new-city">Adding New City</a></li>
        <li><a href="#adding-new-service">Adding New Service</a></li>
        <li><a href="#changing-translations">Changing Translations</a></li>
        <li><a href="#adding-new-locale">Adding New Locale</a></li>
        <li><a href="#updating-video-testimonials">Updating Video Testimonials</a></li>
      </ul>
    </li>
  </ol>
</details>



## About The Project

HeyHomie is the front-end part of the web-application for ordering different types of home services. It was built with scalability, multilinguality, and responsiveness in mind, in order to support different cities, and different types of services. The application utilizes Next.js Server-Side Rendering (SSR) feature to support better SEO and performance, and uses Redux State Management library for managing app's global state (including global system of modals and menus), and caching.

This README reveals the app's key technologies, overall structure and important modules, as well as contains guidelines for some of the expected use cases.

## Built With

### Key Libraries

* [Next.js](https://nextjs.org/) - React-based framework that supports SSR and i18ned routing
* [Redux Toolkit](https://redux-toolkit.js.org/) - a modern way of building Redux state systems, allows to "semantically" separate different parts of state into "slices" that contain corresponding actions, reducers and thunks.
* [next-intl](https://github.com/amannn/next-intl) - an excellent tiny wrapper around the [react-intl](https://formatjs.io/docs/react-intl/) library for Next.js, based on Format.js. Works well with Next.js i18ned routing and allows accessing the required parts of the corresponding translation file (stored in [messages](/messages) folder) in a React component using Hooks
* [twin.macro](https://github.com/ben-rogerson/twin.macro) - a wonderful library that allows using [Tailwind.css](https://tailwindcss.com/) along with CSS-in-JS ([Styled Components](https://styled-components.com/)) and animation ([React Spring](https://www.react-spring.io/)) libraries. It allowed using Tailwind's structural features along with the Styled Component's flexibility. This library required some additional dependencies ([sass](https://sass-lang.com/), [postcss](https://postcss.org/), etc.) to work and be pruned correctly in the Next.js context.
* [React Stripe](https://stripe.com/docs/stripe-js/react) - Stripe's library for payment integrations
* [axios](https://www.npmjs.com/package/axios) - a robust HTTP client
* [validator](https://www.npmjs.com/package/validator) - a library for client-side validations

### Component Libraries

* [React Calendar](https://www.npmjs.com/package/react-calendar) - the underlying base for the [DatePicker Component](/components/citypage/menus/bookingmenu/submenus/Datepicker.js) almost fully rebuilt with Styled Components and Custom handlers.
* [React Toastify](https://www.npmjs.com/package/react-toastify) - an excellent library for displaying customizable swipeable messages in the application. Was integrated into the Redux state in i18ned using thunks' callbacks for asynchronous error-handling.
* [React Phone Number Input](https://www.npmjs.com/package/react-phone-number-input) - a highly customizable library for phone number inputs. Was customized with Styled Components and used in the applcation's [Inputs module](/components/citypage/menus/widgets/Inputs.js)
* [React Share](https://www.npmjs.com/package/react-share) - a library for displaying Social Media share buttons.







## Application Architecture

### Project Structure and Key Modules

The application is based on Next.js' pages-based routing and `getServerSideProps()` method for SSR. An alternative to SSR, Server-Side Generation (SSG), supported in Next.js v. >9., would not fit the project properly, since it would require rebuilds after every minor API change (e.g. service icon update), that's way the project is entirely based on SSR. Pages source files are stored in the [pages](/pages) folder.

The application contains several pre-defined "static" pages (`index.js`, `404.js`, `privacy.js`, `terms_conditions.js`, all of the pages in the [account](/pages/account/) folder) and one "dynamic" page - `[city].js` which is being a unique page generated for each city existing in the backend and served via the API.

In order to fetch the data required for the page on server-side (i.e. the data that does not need JavaScript AJAX requests to be fetched and will be crwaled more easily by the search engines), each page uses the `getServerSideProps()` method, defined in the bottom of the page `.js` file. Each page makes a call to `GET /api/v1/cities` here. This data shapes the city links in the Footer for all pages, as well as the content of the ChangeCityWidget in the `Topnav` component. `[city].js` makes additional call to `GET /api/v1/cities/:city_id/homie_services` to fetch the required city-specific data (i.e. available services, city manager information, etc.).

Each page behaves like a separate "mini-SPA" with its own inner logic, connected to the Redux Global state object, initialized and filled with data client-side. In this application, we use Redux Toolkit approach to initializing Redux, adapted to Next.js specifics. The Combined Reducers and Store Configuration method are exported from the [store.js](/store.js) file in the root folder, and then used in the [_app.js](/pages/_app.js) - a special global page wrapper that can be used in Next.js for Application-level State. In case of HeyHomie, it contains:

1. **Next-Intl Provider** for translations
2. **Redux Provider**
3. **GlobalStyles** component required for the twin.macro to work correctly
4. **`getInitialProps()` declaration** that is required to load translations from the [messages](/messages) folder on server-side (thus, making fully-translated pages available for Search Crawlers)

All text content of the application is stored in the locale files in the [messages](/messages) folder, none of the text data is hardcoded. The app's i18n is based on two main technologies: Next.js native internationalized routing system and the Next-Intl's messages/translations that are in sync with the page's locale and provide the required translations. Unfortunately, Next.js current approach to i18n is a bit rigid due to SSR nature of the framework, however proves to be quite robust. Available locales are configured in the [next.config.js](/next.config.js) file in the root of the application. To avoid too complex abstractions, app's used languages are currently hardcoded both in the `next.config.js` config file and the ChangeLanguages Widgets. If necessary, that can be fairly easily tuned in the future versions of the application.

Translation files in the [messages](/messages) folder are `.json` files that contain translation tokens that are used in the actual React Components with the `useTranslations()` Hook. The Hooks allows scoping the component's translation to the part of the translation file to avoid nesting tokens in the `return ()` part of the component.

```javascript
const AddNewAddressModalDialog = ({...) => {
  // UI translations for the component
  const t = useTranslations('AccountPage.AddressesPage.AddNewAddressModalDialog');

  ...

  return (
    ...
      <h2>
          {t(`heading`)}
      </h2>
      /* Instead of {t(`AccountPage.AddressesPage.AddNewAddressModalDialog.heading`)} */
    ...
  );
}
```

Next-Intl supports String interpolation, so the actual translation token can be derived based on a variables' name or value.

According to the approach of the **Redux Toolkit**, state's model, actions and reducer are divided into **slices**, that are stored in the [lib/slices](/lib/slices) folder. These files export different synchronous functions for directly updating the state and asynchronous **thunks** that allow compose synchronous Redux State updates with side effects - including caching in **LocalStorage** and making AJAX API calls. [/lib](/lib) also contains `loadState.js` module that exports functions for updating LocalStorage and SessionStorage in a consistent manner. The slices are divided into several parts, shaping the semantically separate parts of the state that should be made Global. (e.g. `uiSlice.js` is responsible for menus and modal widnows, and the Overlay behavior, while `userSlice.js` is all about the user-related state).

Functions for making API requests are stored in the [/api/endpoints](/api/endpoints) folder. They are divided roughly according to the API documentation sections. Some of them are used only in Redux thunks, some are used directly by components if they don't affect the Global, but only the component's local state.

Applications components are stored in the [components](/components) folder, and are divided into several subfolders:

1. [citypage](/components/citypage) - exports components used primarely in the `[city].js` dynamic page
2. [myaccount](/components/myaccount) - and its subfolders export components used in the Account section of the Application
3. [utilpages](/components/utilpages) - exports components used in the Privacy Policy and Terms & Conditions pages
4. [ui](/components/ui) - exports components that used throughout the application - buttons, inputs, Modal Windows, Popovers. NB! Some of the components in the above folders are used in other part of the application, as well, while some of them duplicate each other's functionality. Hoever, due to the app's dynamic requirements blindly following the DRY principle could result in overcomplecated abstractions that would be hard to reason about without any apparent maintainablity benefits.

The [/api](/api) folder apart from the endpoints functions also contains another two important modules: `citiesCoordinates.js` and `servicesConfig.js`. The former is responsible for storing and exporting cities' coordinates for geolocation on the `index.js` page. The latter contains "pseudo-API" arrays of objects required for generating services' UI and initial state, it exports three switch functions that return the required data based on the service's name (e.g. 'flowers'): `servicesConfigSwitch()`, `initialConfigSwitch()`, and `servicesDetailsSwitch()`. [/api](/api) folder also contains [url.js](/api/url.js) module that exports the `BASE_URL` and the [api.js](/api/api.js) module that export the instance of axios HTTP-client for consistent configurations.

[/hooks](/hooks) folder contains useful customly-defined Hooks for usage inside of the application (e.g. `useWindowResize.js`) that was used to avoid external dependencies like React Media.

[/public](/public) folder stores all the static assests used throughout the application. It also includes `robots.txt` file and `manifest.json` files.

### Application Flow

The entry point of the application is the [`index.js`](/pages/index.js) page. This page contains the required data for better SEO (available cities and pages in footer navigation, metadata), however is not purposed for actual user viewing: client-side code the `useEffect()` Hook (that guarantees that page was loaded by a browser and not a crawler) tries to determine whether the visit is the first ever (runs `determineGeolocation()` function in this case), whether the URL query params contains a referral code for caching and automated later usage, or if if finds out that the user/visitor is not new, it redirects them to the `[city].js` page.

`[city].js` page is the main page a visitor/user interacts with. It contains the services selection slider, services configurations interface, as well as the complex system of side menus and modal menus orchestrated by the `uiSlice.js` State. The core of the page is the `initCitySession()` thunk, defined in the [`userSlice.js`](lib/slices/userSlice.js). This function is a set of `if...else` statements that determine which action should be done to initialize the state properly: is it a visitor, or a user? is the user's token valid? is there an unfinished order and does it take place in the currently selected city? is there referral code stored in the cache from the `index.js` page? System of modal windows and side menus is regulated by the `uiSlice.js` by pushing and removing items in the `overlayActionsStack` state. This allows evoking different parts of the user journey and also trigger actions that are not scoped to the current page (e.g. open "Share refferral code" side menu after a succesful order) and can wtill be used after redirects, since Redux state is Global for the whole application.

Page components in the [/account](/pages/account) folder work in the same manner as the `[city].js` page: modal and side menus work based on the `uiSlice.js` state. The actual modal and side menus components are placed in the bottom of the `return()` statement of the page component. Authentication is all client-side, so in case of absent or invalid token, the user-related state will be set to default and visiotr will be redirected to the `index.js`, and, subsequently, to `[city].js` page.

## Usage

### Deployment

Current version of the application is tuned to be deployed on Heroku. Without CD/CI pipeline, after connecting repository to the Heroku application, updates can be deployed from the connected repository with `git push heroku master` command. The `start` command in the [`package.json`](/package.json) has a defined `-p $PORT` flag to support Heroku's dyno's port system:

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start -p $PORT"
  },
```

For correct work of the debug tools and 3-d party services (Redux devtools, Stripe integration, Google Analytics, Bugsnag), Heroku application has to have the following configs (i.e. environment variables):

* NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
* NEXT_PUBLIC_GA_TRACKING_ID
* NEXT_PUBLIC_BUGSNAG_API_KEY
* NEXT_PUBLIC_NODE_ENV
* NEXT_PUBLIC_BASE_URL

NEXT_PUBLIC_ prefix is required by Next.js to correctly derive environment variables in production.

After changing/adding the environment variables the application needs to be **rebuild** in order to catch the updated data.

### Adding New City

Since the appliction is SSR and not SSG-based, adding a new city technically does not require additional rebuilds. However, since the `index.js` pages attempts to determine new visitor's geolocation, and cities's geolocation is hardcoded and not fetched from the API, fully functional update would need to update the [`citiesCoordinates.js`](/api/citiesCoordinates.js) module.

Proposed steps are as following:

1. Add a new city with all the required data (including services and city manager's information) in the backend:
    - Add cities to the `cities` DB table.
    - Add cities with their id's to the `homie_services` DB table.
2. Update [`citiesCoordinates.js`](/api/citiesCoordinates.js) module: add a new item in the exported array that would include:
  * New city's name (same as provided by API)
  * New city's latitude and longitude
3. Push the updated data to Heroku to rebuild the application

New city will be available as a new `[city].js` page, in the Footer navigation and in the ChangeCity Widget in the top navigation

### Adding New Service

Current version of the application supports 5 types of services:

* cleaning
* flowers
* nails
* massage
* laundry

All of them have defined Initial State (used when first selecting the service), UI Configurations (used in ServicesConfig component) and Details objects. The determening functions are exported from the [`servicesConfig.js`](/api/servicesConfig.js)module. Adding new services of these kinds is seamless and does not require any rebuilds if their characteristics do not involce heavy UI alterations.

**NOTE** Each city supports single instance of a service type being added, due to the API and front-end logic. The logic for UI generation is partly based on the service's String name (e.g. 'flowers'), and partly - on its `id` property.

Adding a completely new service, not yet covered by the [`servicesConfig.js`](/api/servicesConfig.js) module (e.g. 'babysitting') can vary. If the new service's configurations can generated with the [existing widgets](/components/citypage/servicesContainer/widgets), then the steps are as following:

1. Create new service in the API with all the required data.
2. Update [`servicesConfig.js`](/api/servicesConfig.js) module: add new items to the end of the `servicesConfigs`, `servicesInitialConfigs`, and `servicesConfigDetails` arrays, using existing widgets.
3. Update `servicesConfigSwitch()`, `initialConfigSwitch()`, and `servicesDetailsSwitch()` methods to return the required object based on the new service's name.
4. Update translation files to support new service's translation tokens. Crucial parts being: `CityPage.ServiceConfig`, `servicesNames` (used in several parent objects), and `AccountPage.IndexPage.MissionsComponent`.
5. Push the updated data to Heroku to rebuild the application

Currently supported service config widgets:

* Select - select one of the buttons (example: frequency selection)
* RadioSelect - select one of the radio options (example: massage duration)
* DropdownSelect - select a non-null/non-zero value from the dropdown (example: flowers' quantity)
* Option - checkbox true/false select (example: cleaning's express delivery)
* OptionWithDropDownSelect - select a possibly-null/possibly-zero value from the dropdown (example: cleaning' windows option)
* CleaningPriceCalculationInput - a unique widget for the cleaing service's Size property. For a new service with a similar configuration can be adopted/abstracted higher
* PriceField - used for displaying and calculating service's price based on the configurations

If new service's configurations cannot be covered with the existing widgets, adding a new service would require an additional step of creating a new custom widget, and updating the [`ServiceConfigEditor.js`](/components/citypage/servicesContainer/ServiceConfigEditor.js) Component.


### Changing Translations

All text content of the application is token-based. Serious changes of the layour require making changes to the Component's architecture, however changining modifying the value of an existing token is straightforward:

1. Find the component whose texts are to be modified.
2. Look up what part of the translation file it uses in the `useTranslations()` Hook (e.g. `useTranslations('AccountPage.AddressesPage.AddNewAddressModalDialog')`).
3. Update the corresponding token's value in the translation file.
4. Push the updated data to Heroku to rebuild the application.

**NB!** Updating Privacy Policy and Terms & Conditions pages

In the current version of the application, the bodies of these two pages are basically innerHTML that is stored in the translation files. That's why unlike with other translation tokens' values, there are additional single quotes inside the double quotes:

```json
 "body": "'<p>Lorem ipsum</p>'"
```

### Adding New Locale

Adding new locale is a slightly more complex process. To add a new locale (e.g. French), it is required to:

1. Add new locale in [next.config.js](/next.config.js), e.g.:

```javascript
  module.exports = {
      i18n: {
        locales: ['en', 'pl', 'fr'],
        defaultLocale: 'pl'
      },
      ...
```

This wil make Next.js generate new locale's routes

2. Create new translation file in [messages](/messages) folder (`fr.json`), copy & paste tokens from a valid translations file for consistency, provide new translations for the token
3. Provide new values to the ChangelLanguage Widgets ([city page](/components/citypage/topnav/ChangeLanguageWIdget.js), [account pages](components/myaccount/topnav/ChangeLanguageWidget.js). [utils pages](/components/utilpages/topnav/ChangeLanguageWIdget.js)):

```javascript
const langNameSwitch = (languageName) => {
    let langNameString;
    switch(languageName) {
        case 'pl':
            langNameString = 'Polski';
        break;
        case 'en':
            langNameString = 'English'
        break;
        case 'fr':
            langNameString = 'Français'
        break;
        default:
        break;
    }
    return langNameString;
}

const languages = ['en', 'pl', 'fr'];
```
4. Provide new flag image to the [/public](/public) folder in `.png` format (`/public/fr.png`)
5. Push the updated data to Heroku to rebuild the application.


### Updating Video Testimonials

Currently, testimonials array is hardcoded in [`testimonials.js`](/components/citypage/body/testimonials.js) file. Array's items contain the translation tokens and URLs of the videos in the [/public](/public) folder. Current component layout and logic is aimed at supporting Vimeo videos, so the URL has to be a valid Vimeo embedded string in the form of:

```javascript
  videoURL: 'https://player.vimeo.com/video/519146734?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479'
```

This array is used in the [`CityPageBody`](/components/citypage/body/CitypageBody.js) and passed down to [TestimonialsVideoGallery](/components/citypage/body/TestimonialsVideoGallery.js) as props. In order to update these items:

1. Modify the Array exported from the [`testimonials.js`](/components/citypage/body/testimonials.js) file.
2. Modify transaltions values for the corresponding tokens in the [messages](/messages) folder.
3. Push the updated data to Heroku to rebuild the application.
