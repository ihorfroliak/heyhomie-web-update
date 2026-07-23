import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { ContactInformationContainer, FooterContainer, LinksDiv } from './styledComponents';
import { setSelectedCity } from '../../../lib/slices/userSlice';
import ContactManager from './ContactManager';
import SocialMediaLinks from './SocialMediaLinks';

const linksConfig = [
    {
        heading: 'services.heading',
        links: [
            { href: '/cleaning', label: 'services.cleaning' },
            { href: '/massage', label: 'services.massage' },
            { href: '/flowers', label: 'services.flowers' },
        ],
    },
    {
        heading: 'company.heading',
        links: [{ href: '/about', label: 'company.about_us' }],
    },
    {
        heading: 'legal.heading',
        links: [
            { href: '/terms_conditions', label: 'legal.terms_conditions' },
            { href: '/privacy', label: 'legal.privacy' },
        ],
    },
];

const Footer = ({ cities, handleChangeCity, promptChangeCityResetOrderMenu, manager_name, manager_email, manager_phone_number, manager_picture }) => {
    const t = useTranslations('CityPage.Footer');

    // Global state
    const dispatch = useDispatch();
    const { user, order } = useSelector(state => state);

    return (
        <FooterContainer>
            <LinksDiv>
                {linksConfig.map((section, index) => (
                    <div key={index}>
                        <h3>{t(section.heading)}</h3>
                        <ul>
                            {section.links.map((link, linkIndex) => (
                                <li key={linkIndex}>
                                    <Link href={link.href}>{t(link.label)}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                <div>
                    <h3>{t(`cities.heading`)}</h3>
                    <ul>
                        {manager_name && manager_email && manager_phone_number
                            ? cities.map(city => (
                                  <li key={city.name}>
                                      <button
                                          disabled={user && user.selectedCity === city.name}
                                          onClick={() => {
                                              if (order && order.services.filter(s => s.statusLocal !== 'staging').length > 0) {
                                                  promptChangeCityResetOrderMenu({ name: city.name, id: city.id });
                                              } else {
                                                  dispatch(setSelectedCity({ selectedCity: city.name, selectedCityID: city.id }));
                                                  handleChangeCity(city.name);
                                              }
                                          }}
                                      >
                                          {t(`cities.${city.name}`)}
                                      </button>
                                  </li>
                              ))
                            : cities.map(city => (
                                  <li key={city.name}>
                                      <Link href={`/${city.name}`}>{t(`cities.${city.name}`)}</Link>
                                  </li>
                              ))}
                    </ul>
                </div>
            </LinksDiv>
            <ContactInformationContainer>
                <SocialMediaLinks />
                {manager_name && manager_email && manager_phone_number && (
                    <ContactManager
                        manager_name={manager_name}
                        manager_email={manager_email}
                        manager_phone_number={manager_phone_number}
                        manager_picture={manager_picture}
                    />
                )}
            </ContactInformationContainer>
            <svg
                width='18'
                height='20'
                viewBox='0 0 18 20'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                style={{
                    position: 'absolute',
                    bottom: '33px',
                    left: '31px',
                }}
            >
                <path
                    d='M17.9847 11.8991C17.9589 6.56176 14.6262 1.54952 10.415 0.357421C7.28897 -0.536654 4.57627 0.249048 2.32861 2.68743C0.158449 5.01745 -0.513266 7.72677 0.390966 10.8425C0.856 12.4681 1.34687 14.1208 2.07026 15.6651C4.78295 21.5443 13.8769 21.2734 17.1063 15.8818C17.8556 14.6355 18.0623 13.1996 17.9847 11.8991Z'
                    fill='#FAD668'
                />
            </svg>
            <svg
                width='59'
                height='45'
                viewBox='0 0 59 45'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                style={{
                    position: 'absolute',
                    bottom: '0px',
                    left: '65px',
                }}
            >
                <path
                    d='M51.6587 14.2297C52.5272 19.2676 52.2328 24.1236 49.4479 28.6197C47.0145 32.5385 43.6237 35.11 39.2297 36.4831C35.7306 37.5648 32.055 38.0163 28.6365 39.4379C23.0766 41.7369 20.9792 44.8455 21.007 50.9197C21.0199 52.6847 20.9104 54.4231 20.4642 56.1236C19.8998 58.2446 18.9756 60.0489 16.5624 60.5715C14.0803 61.1056 12.1898 59.9619 10.7616 58.1986C8.49868 55.3973 7.47471 52.1055 7.45264 48.4571C7.40511 41.7029 9.52325 35.7635 14.2625 30.9631C16.7391 28.4272 19.9857 27.2465 23.5773 26.9976C27.0083 26.7756 30.2475 25.9731 33.1415 23.9562C35.4888 22.3373 36.5733 20.082 36.7318 17.3694C36.8828 14.8936 36.7737 12.4144 36.852 9.92725C36.9001 7.96355 36.8679 5.94265 37.9643 4.18012C39.5267 1.67971 42.7393 0.999528 45.204 2.61246C48.5718 4.82789 50.6979 8.64174 51.6587 14.2297Z'
                    fill='#FF3C87'
                />
            </svg>
        </FooterContainer>
    );
};

export default Footer;
