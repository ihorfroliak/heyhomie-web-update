/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-else-return */
/* eslint-disable no-param-reassign */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import tw, { styled, theme } from 'twin.macro';

import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';

import Calendar from 'react-calendar';

import { editServiceForOrder } from '../../../../../api/endpoints/orders';

import { _removeFromOverlayActionStack, _toggleMenu } from '../../../../../lib/slices/uiSlice';
import { _setServiceDatetime, _setServiceLoading, _updateService } from '../../../../../lib/slices/orderSlice';

import { SecondaryButtonFull } from '../../../../ui/Buttons';
import Dropdown from '../../../../ui/Dropdown';

const DatePickerContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    margin-top: 32px;
`;

export const StyledCalendar = styled(Calendar)`
    width: 350px;
    max-width: 100%;

    background-color: #ffffff;

    border-color: transparent;
    border-radius: 8px;
    box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.05);

    padding: 12px;

    font-family: Lato;
    line-height: 1.125em;

    @media (max-width: 400px) {
        width: 350px;
        padding: 2px;
    }

    .react-calendar--doubleView {
        width: 700px;
    }
    .react-calendar--doubleView .react-calendar__viewContainer {
        display: flex;
        margin: -0.5em;
    }
    .react-calendar--doubleView .react-calendar__viewContainer > * {
        width: 50%;
        margin: 0.5em;

        @media (max-width: 400px) {
            margin: 0.25em;
        }
    }

    *,
    *:before,
    *:after {
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
    }
    button {
        margin: 0;
        border: 0;
        outline: none;
    }
    button:enabled:hover {
        cursor: pointer;
    }
    .react-calendar__navigation {
        height: 44px;
        margin-bottom: 1em;

        @media (max-width: 400px) {
            height: 34px;
        }
    }
    .react-calendar__navigation button {
        min-width: 44px;
        background: none;

        @media (max-width: 400px) {
            min-width: 34px;
        }
    }
    .react-calendar__navigation button:enabled:hover,
    .react-calendar__navigation button:enabled:focus {
        background-color: #e6e6e6;
    }
    .react-calendar__navigation button[disabled] {
        //background-color: #f0f0f0;
        cursor: default;
    }

    .react-calendar__navigation__label {
        span {
            font-family: Lato;
            font-size: 15px;
            font-weight: bold;

            text-transform: capitalize;
        }

        @media (max-width: 400px) {
            font-size: 12px;
        }
    }

    .react-calendar__month-view__weekdays {
        text-align: center;
        text-transform: uppercase;
        font-weight: bold;
        font-size: 0.75em;

        @media (max-width: 400px) {
            font-size: 0.25em;
            justify-content: space-around;
        }
    }
    .react-calendar__month-view__weekdays__weekday {
        padding: 0.5em;

        abbr[title] {
            font-size: 14px;
            text-decoration: none;
            color: ${theme`colors.primary.grey`};
            text-transform: capitalize;
        }

        @media (max-width: 400px) {
            padding: 0.5em;
            flex-basis: initial !important;

            abbr[title] {
                font-size: 10px;
            }
        }
    }
    .react-calendar__month-view__weekNumbers {
        font-weight: bold;
    }
    .react-calendar__month-view__weekNumbers .react-calendar__tile {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75em;
        padding: calc(0.75em / 0.75) calc(0.5em / 0.75);

        @media (max-width: 400px) {
            font-size: 0.5em;
            padding: calc(0.5em / 0.5) calc(0.25em / 0.5);
        }
    }
    .react-calendar__month-view__days {
        @media (max-width: 370px) {
            justify-content: flex-start;
        }
    }
    .react-calendar__month-view__days__day--weekend {
        //color: #d10000;
    }
    .react-calendar__month-view__days__day--neighboringMonth {
        color: #757575;
    }
    .react-calendar__year-view .react-calendar__tile,
    .react-calendar__decade-view .react-calendar__tile,
    .react-calendar__century-view .react-calendar__tile {
        padding: 2em 0.5em;

        @media (max-width: 400px) {
            padding: 0.1em 0.1em;
        }
    }
    .react-calendar__tile {
        text-align: center;
        padding: 14px;
        margin-left: 1px;
        margin-right: 0px;

        background: none;

        height: 45px;
        width: 45px;
        border-radius: 50%;

        font-size: 14px;

        @media (max-width: 370px) {
            height: 36px;
            width: 36px;
            font-size: 10px;
            padding: 4px;
            margin: 3px;
        }

        @media (max-width: 330px) {
            height: 32px;
            width: 32px;
            font-size: 8px;
            padding: 1px;
            margin: 1px;
        }

        flex-basis: initial !important;

        &:focus {
            outline: none;
        }

        transition: 0.2s ease-in-out;
    }
    .react-calendar__tile:disabled {
        color: ${theme`colors.primary.grey`};
        cursor: default;
    }
    .react-calendar__tile:enabled:hover,
    .react-calendar__tile:enabled:focus {
        background-color: #e6e6e6;
    }
    .react-calendar__tile--now {
        //background: ${theme`colors.secondary.blue`};
    }
    .react-calendar__tile--now:enabled:hover,
    .react-calendar__tile--now:enabled:focus {
        //background: #ffffa9;
    }
    .react-calendar__tile--hasActive {
        background: ${theme`colors.secondary.saladLight`};
    }
    .react-calendar__tile--hasActive:enabled:hover,
    .react-calendar__tile--hasActive:enabled:focus {
        background: ${theme`colors.secondary.saladLight`};
    }
    .react-calendar__tile--active {
        background: ${theme`colors.secondary.salad`};
        font-weight: bold;
    }
    .react-calendar__tile--active:enabled:hover,
    .react-calendar__tile--active:enabled:focus {
        background: ${theme`colors.secondary.salad`};
    }
    .react-calendar--selectRange .react-calendar__tile--hover {
        background-color: #e6e6e6;
    }
    .react-calendar__tile--recurrentDay {
        background: ${theme`colors.secondary.saladLight`};
        font-weight: bold;
    }
`;

const TimeButtonsContainer = styled.div`
    ${tw`
        grid grid-cols-3 gap-2
    `};

    @media (min-width: 400px) {
        ${tw`
            grid grid-cols-4 gap-2
        `};
    }

    margin-top: 16px;
    max-width: 356px;
`;
const TimeButton = styled.button`
    display: block;

    width: 83px;
    height: 36px;

    background-color: ${props => (props.active ? theme`colors.secondary.salad` : '#ffffff')};
    font-weight: ${props => (props.active ? `bold` : `normal`)};

    ${tw`
            shadow-surface2
        `}
    border-radius: 8px;

    font-size: 12px;

    cursor: pointer;
    transition: 0.2s ease-in-out;

    &:disabled {
        opacity: 0.5;
        cursor: default;
    }
    &:focus {
        outline: none;
    }
`;

// Utils

const daySwitch = dayString => {
    let number;
    switch (dayString) {
        case 'monday': {
            number = 1;
            break;
        }
        case 'tuesday': {
            number = 2;
            break;
        }
        case 'wednesday': {
            number = 3;
            break;
        }
        case 'thursday': {
            number = 4;
            break;
        }
        case 'friday': {
            number = 5;
            break;
        }
        case 'saturday': {
            number = 6;
            break;
        }
        default: {
            number = 0;
            break;
        }
    }

    return number;
};
const daySwitchReversed = dayInteger => {
    let string;
    switch (dayInteger) {
        case 1: {
            string = 'monday';
            break;
        }
        case 2: {
            string = 'tuesday';
            break;
        }
        case 3: {
            string = 'wednesday';
            break;
        }
        case 4: {
            string = 'thursday';
            break;
        }
        case 5: {
            string = 'friday';
            break;
        }
        case 6: {
            string = 'saturday';
            break;
        }
        default: {
            string = 'sunday';
            break;
        }
    }

    return string;
};

function withoutTime(dateTime) {
    const date = new Date(dateTime.getTime());
    date.setUTCHours(0, 0, 0, 0);
    return date;
}
function initializeFirstMissionDate(opening_days) {
    const workingArrayDays = [];
    for (let i = 0; i < opening_days.length; i++) {
        workingArrayDays.push(daySwitch(opening_days[i]));
    }

    const d = new Date();
    d.setDate(d.getDate() + 1);

    if (!workingArrayDays.includes(d.getDay())) {
        while (!workingArrayDays.includes(d.getDay())) {
            d.setDate(d.getDate() + 1);
        }
    }

    const date = withoutTime(d);

    return date;
}

function extractDate(missionDate) {
    const date = new Date(missionDate * 1000);
    date.setUTCHours(0, 0, 0, 0);
    return date;
}
function extractTime(missionDate) {
    const time = new Date(missionDate * 1000).getUTCHours();
    return time;
}

function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    // Get first day of year
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    // Return array of year and week number
    return [d.getUTCFullYear(), weekNo];
}
function getWeeksInMonth(month, year) {
    const weeks = [];
    const firstDate = new Date(year, month, 1);
    const lastDate = new Date(year, month + 1, 0);
    const numDays = lastDate.getDate();

    let start = 1;
    let end = 7 - firstDate.getDay();
    while (start <= numDays) {
        weeks.push({ start: start, end: end, days: end - start + 1 });
        start = end + 1;
        end += 7;
        if (end > numDays) end = numDays;
    }
    return weeks;
}

function arriveDate(selectedFirstMissionDate) {
    const d = new Date(selectedFirstMissionDate);
    return d.toLocaleDateString('en-US');
}

function arriveHours(selectedFirstMissionHour) {
    const hour = selectedFirstMissionHour + 1;

    return hour;
}

function convertToAmPm(hour) {
    let hours = hour;
    const ampm = hour >= 12 ? 'pm' : 'am';

    hours %= 12;
    hours = hours || 12;
    const timeString = hours + ampm;
    return timeString;
}

function laundryDeliveryStandard(selectedFirstMissionDate) {
    const d = new Date(selectedFirstMissionDate);
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0) {
        d.setDate(d.getDate() + 1);
    }
    return d.toLocaleDateString('en-US');
}
function laundryDeliveryStandardIsSunday(selectedFirstMissionDate) {
    const d = new Date(selectedFirstMissionDate);
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0) {
        return true;
    } else {
        return false;
    }
}
function laundryDeliveryExpress(selectedFirstMissionDate, selectedFirstMissionHour) {
    const d = new Date(selectedFirstMissionDate);

    if (selectedFirstMissionHour > 10) {
        d.setDate(d.getDate() + 1);
    }

    if (d.getDay() === 0) {
        d.setDate(d.getDate() + 1);
    }

    return d.toLocaleDateString();
}

function carpetDelivery(selectedFirstMissionDate) {
    const d = new Date(selectedFirstMissionDate);
    d.setDate(d.getDate() + 4);
    if (d.getDay() === 0) {
        d.setDate(d.getDate() + 1);
    }
    return d.toLocaleDateString();
}

function carpetDeliveryIsSunday(selectedFirstMissionDate) {
    const d = new Date(selectedFirstMissionDate);
    d.setDate(d.getDate() + 4);
    if (d.getDay() === 0) {
        return true;
    } else {
        return false;
    }
}

const DatePicker = ({ service, available_params }) => {
    // UI translations for the component
    const t = useTranslations('CityPage.BookingMenu.DatePickerSubmenu');
    const router = useRouter();

    // Redux state
    const dispatch = useDispatch();
    const { ui, order, user } = useSelector(state => state);

    // Input
    // First mission
    const [selectedFirstMissionDate, setSelectedFirstMissionDate] = useState(
        service.date_time.mission_date
            ? extractDate(service.date_time.mission_date)
            : new Date().getTime() + available_params.minimum_bookable_hour * 60 * 60 * 1000 > new Date().setHours(available_params.closing_hour)
            ? initializeFirstMissionDate(available_params.opening_days)
            : withoutTime(new Date())
    );
    const [selectedFirstMissionHour, setSelectedFirstMissionHour] = useState(service.date_time.mission_date ? extractTime(service.date_time.mission_date) : '');
    const [firstMissionDate, setFirstMissionDate] = useState(service.date_time.mission_date ? service.date_time.mission_date : '');

    // Recurrent mission
    const [selectedRecurrentMissionDay, setSelectedRecurrentMissionDay] = useState(
        service.date_time.frequent_mission_day ? service.date_time.frequent_mission_day : null
    );
    const [selectedRecurrentMissionHour, setSelectedRecurrentMissionHour] = useState(
        service.date_time.frequent_mission_time ? service.date_time.frequent_mission_time : null
    );

    // Validator
    const [isSubmitValid, setIsSubmitValid] = useState(false);

    // Params
    const [availHours, setAvailHours] = useState([]);
    const [availDays, setAvailDays] = useState([]);

    const [availHoursFirstMission, setAvailHoursFirstMission] = useState([]);

    // Marking calendar date handlers
    const handleDetermineTileDisabled = ({ activeStartDate, date, view }) => {
        if (!availDays.includes(date.getDay())) {
            return true;
        } else if (
            new Date().getTime() + available_params.minimum_bookable_hour * 60 * 60 * 1000 >
            new Date(date).getTime() + available_params.closing_hour * 60 * 60 * 1000
        ) {
            return true;
        } else {
            return false;
        }
    };

    const handleDetermineTileRecurrent = ({ activeStartDate, date, view }) => {
        if (!selectedRecurrentMissionDay) return null;

        const dateFined = new Date(date.setHours(0, 0, 0, 0));

        const dateFinedWeekNumber = getWeekNumber(dateFined);
        const selectedFirstMissionDateWeekNumber = getWeekNumber(selectedFirstMissionDate);

        if (daySwitchReversed(date.getDay()) === selectedRecurrentMissionDay && dateFinedWeekNumber[1] > selectedFirstMissionDateWeekNumber[1]) {
            if (service.config.frequency === 'every_week') {
                return 'react-calendar__tile--recurrentDay';
            } else if (service.config.frequency === 'every_two_weeks') {
                if ((selectedFirstMissionDateWeekNumber[1] - dateFinedWeekNumber[1]) % 2 === 0) {
                    return 'react-calendar__tile--recurrentDay';
                }
            } else if (service.config.frequency === 'every_month') {
                if (dateFined.getMonth() > selectedFirstMissionDate.getMonth()) {
                    const dateFinedWeeksInMonth = getWeeksInMonth(dateFined.getMonth(), dateFined.getFullYear());
                    const selectedFirstMissionDateWeeksInMonth = getWeeksInMonth(selectedFirstMissionDate.getMonth(), selectedFirstMissionDate.getFullYear());

                    const dateFinedWeekOrderInMonth = dateFinedWeeksInMonth.findIndex(weekNumber => {
                        const day = dateFined.getDate();

                        return day >= weekNumber.start && day <= weekNumber.end;
                    });

                    const selectedFirstMissionDateWeekOrderInMonth = selectedFirstMissionDateWeeksInMonth.findIndex(weekNumber => {
                        const day = selectedFirstMissionDate.getDate();

                        return day >= weekNumber.start && day <= weekNumber.end;
                    });

                    const weekIncludesDay = weekObject => {
                        let includes = false;
                        for (let i = weekObject.start; i < weekObject.end + 1; i++) {
                            const date = new Date();
                            date.setFullYear(dateFined.getFullYear());
                            date.setMonth(dateFined.getMonth());
                            date.setDate(i);
                            if (date.getDay() === dateFined.getDay()) {
                                includes = true;
                                break;
                            }
                        }

                        return includes;
                    };

                    if (dateFinedWeekOrderInMonth === selectedFirstMissionDateWeekOrderInMonth) {
                        return 'react-calendar__tile--recurrentDay';
                    } else if (
                        dateFinedWeekOrderInMonth !== selectedFirstMissionDateWeekOrderInMonth &&
                        dateFinedWeekOrderInMonth - 1 === selectedFirstMissionDateWeekOrderInMonth &&
                        dateFinedWeeksInMonth[dateFinedWeekOrderInMonth - 1]
                            ? !weekIncludesDay(dateFinedWeeksInMonth[dateFinedWeekOrderInMonth - 1])
                            : null
                    ) {
                        return 'react-calendar__tile--recurrentDay';
                    } else if (
                        dateFinedWeekOrderInMonth !== selectedFirstMissionDateWeekOrderInMonth &&
                        dateFinedWeekOrderInMonth + 1 === selectedFirstMissionDateWeekOrderInMonth &&
                        dateFinedWeeksInMonth[dateFinedWeekOrderInMonth + 1]
                            ? !weekIncludesDay(dateFinedWeeksInMonth[dateFinedWeekOrderInMonth + 1])
                            : null
                    ) {
                        return 'react-calendar__tile--recurrentDay';
                    }
                }
            } else {
                return null;
            }
        } else {
            return null;
        }
    };

    function convertLocalToUTCDate(date) {
        if (!date) {
            return date;
        }
        date = new Date(date);
        date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        return date;
    }

    // Input handlers
    const handleFirstMissionDateSelect = e => {
        setSelectedFirstMissionDate(convertLocalToUTCDate(e));
    };

    const handleFirstMissionHourSelect = value => {
        setSelectedFirstMissionHour(value);
    };

    // Hanlde submit
    const handleValidateSelectedDate = async () => {
        try {
            const date_time = {
                mission_date: firstMissionDate,
                // Booking day	"monday" / "tuesday" / ...
                frequent_mission_day: selectedRecurrentMissionDay,
                // Booking time	0-24
                frequent_mission_time: selectedRecurrentMissionHour,
            };
            const payload = {
                service: {
                    id: service.id,
                    ...date_time,
                },
            };

            dispatch(
                _setServiceLoading({
                    homie_service_id: service.homie_service_id,
                    isLoading: true,
                })
            );

            const data = await editServiceForOrder(user.headers, user.x_token_user, user.x_token_visitor, order.id, payload);

            const configFromAPI = {};
            Object.keys(data.service).forEach(key => {
                if (
                    key !== 'id' &&
                    key !== 'type' &&
                    key !== 'status' &&
                    key !== 'city_id' &&
                    key !== 'address_id' &&
                    key !== 'address_name' &&
                    key !== 'mission_date' &&
                    key !== 'frequent_mission_day' &&
                    key !== 'frequent_mission_time'
                ) {
                    configFromAPI[key] = data.service[key];
                }
            });

            const updatedData = {
                status: data.service.status,
                config: { ...configFromAPI },
                address: {
                    address_id: data.service.address_id,
                    address_name: data.service.address_name,
                },
                date_time: {
                    mission_date: data.service.mission_date,
                    frequent_mission_day: data.service.frequent_mission_day,
                    frequent_mission_time: data.service.frequent_mission_time,
                },
                user_comment: data.service.user_comment,
            };

            dispatch(
                _updateService({
                    serviceID: service.id,
                    updatedData,
                })
            );

            dispatch(
                _setServiceLoading({
                    homie_service_id: service.homie_service_id,
                    isLoading: false,
                })
            );

            dispatch(_toggleMenu({ menu: `${service.type}DatePickerSubmenu`, isOpen: false }));
            dispatch(_removeFromOverlayActionStack(`${service.type}DatePickerSubmenu`));
        } catch (err) {
            console.log(err);
            dispatch(
                _setServiceLoading({
                    homie_service_id: service.homie_service_id,
                    isLoading: false,
                })
            );
        }
    };

    // Effects
    // Available days and hours
    useEffect(() => {
        if (available_params) {
            const workingArrayHours = [];
            const workingArrayDays = [];

            for (let i = available_params.opening_hour; i < available_params.closing_hour + 1; i++) {
                const workingObject = {
                    value: i,
                    caption: i === 12 ? `${i}pm` : i >= 12 ? `${i - 12}pm` : `${i}am`,
                };
                workingArrayHours.push(workingObject);
            }

            for (let i = 0; i < available_params.opening_days.length; i++) {
                workingArrayDays.push(daySwitch(available_params.opening_days[i]));
            }

            setAvailHours([...workingArrayHours]);
            setAvailDays([...workingArrayDays]);
        }
    }, [available_params]);

    useEffect(() => {
        let workingArray = [...availHours];

        const workingDateGlobalTime = new Date(selectedFirstMissionDate).getTime() + 60 * 60 * 1000;
        const workingDateLocalTime = new Date().setHours(new Date().getHours() + 1);

        const indices = [];

        if (new Date().getDate() === new Date(selectedFirstMissionDate).getDate()) {
            for (let i = 0; i < workingArray.length; i++) {
                if (
                    new Date(workingDateGlobalTime + workingArray[i].value * 60 * 60 * 1000) <
                    new Date(workingDateLocalTime + available_params.minimum_bookable_hour * 60 * 60 * 1000)
                ) {
                    indices.push(i);
                }
            }
        }

        workingArray = workingArray.filter((h, i) => !indices.includes(i));

        if (service && service.type === 'laundry' && service.config.laundry_express) {
            workingArray = workingArray.filter(h => h.value < 10);
        }

        setAvailHoursFirstMission(availHoursFirstMission => [...workingArray]);
    }, [availHours, selectedFirstMissionDate]);

    // Validators and setters
    // Set first mission date and hour

    useEffect(() => {
        if (selectedFirstMissionDate && selectedFirstMissionHour) {
            const working = selectedFirstMissionDate;

            working.setUTCHours(0, 0, 0, 0);

            const firstMissionDateWorking = parseInt((working.getTime() / 1000).toFixed(0), 10) + selectedFirstMissionHour * 60 * 60;

            setFirstMissionDate(firstMissionDateWorking);
        } else {
            setFirstMissionDate('');
        }
    }, [selectedFirstMissionDate, selectedFirstMissionHour]);

    useEffect(() => {
        if (selectedFirstMissionDate && service.config.frequency !== 'once') {
            setSelectedRecurrentMissionDay(daySwitchReversed(selectedFirstMissionDate.getDay()));
        }
    }, [selectedFirstMissionDate]);

    useEffect(() => {
        if (selectedFirstMissionHour && service.config.frequency !== 'once') {
            setSelectedRecurrentMissionHour(selectedFirstMissionHour);
        }
    }, [selectedFirstMissionHour]);

    // useEffect(() => {
    //     if (firstMissionDate && service.config.frequency !== "once") {
    //         setSelectedRecurrentMissionDay(daySwitchReversed(selectedFirstMissionDate.getDay()));
    //         setSelectedRecurrentMissionHour(selectedFirstMissionHour)
    //     }
    // }, [firstMissionDate]);

    useEffect(() => {
        if (service.config.frequency === 'once') {
            firstMissionDate ? setIsSubmitValid(true) : setIsSubmitValid(false);
        } else {
            firstMissionDate && selectedRecurrentMissionDay && selectedRecurrentMissionHour ? setIsSubmitValid(true) : setIsSubmitValid(false);
        }
    }, [firstMissionDate, selectedRecurrentMissionDay, selectedRecurrentMissionHour]);

    return (
        <>
            <DatePickerContainer>
                {service && service.type !== 'laundry' && service.type !== 'carpet' ? (
                    service && service.config.frequency !== 'once' ? (
                        <div
                            className={`
                        font-bold text-16px
                        w-full
                    `}
                            style={{
                                marginBottom: '16px',
                            }}
                        >
                            {t(`firstMission`)}
                        </div>
                    ) : null
                ) : (
                    <div
                        className={`
                    font-bold text-16px
                    w-full
                `}
                        style={{
                            marginBottom: '16px',
                        }}
                    >
                        {t(`${service.type}_for_pick_up`)}
                    </div>
                )}
                {service && service.type === 'laundry' && service.config.laundry_express ? (
                    <div
                        className={`
                        italic text-14px
                        w-full
                    `}
                        style={{
                            marginBottom: '16px',
                        }}
                    >
                        {t(`laundry_express_delivery_tip`)}
                    </div>
                ) : null}
                <StyledCalendar
                    calendarType='ISO 8601'
                    maxDetail='month'
                    minDetail='month'
                    showNeighboringMonth={false}
                    navigationLabel={({ date, label, locale, view }) => `${date.toLocaleString(router.locale, { month: 'long' })} ${date.getFullYear()}`}
                    formatShortWeekday={(locale, date) => `${date.toLocaleString(router.locale, { weekday: 'short' })}`}
                    nextLabel={
                        <div className={`relative w-full h-full`}>
                            <svg
                                width='10'
                                height='14'
                                viewBox='0 0 10 14'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                                style={{
                                    position: 'absolute',
                                    top: 'calc(50% - 7px)',
                                    left: 'calc(50% - 5px)',
                                }}
                            >
                                <path
                                    d='M8.74806 7.93073C7.39506 10.0624 5.58824 11.8693 3.45653 13.2223C3.20227 13.3783 2.91961 13.4825 2.62486 13.5286C2.33012 13.5748 2.02915 13.5621 1.73936 13.4912C1.44956 13.4204 1.17668 13.2928 0.936496 13.1158C0.696311 12.9388 0.493583 12.716 0.340033 12.4602C0.186482 12.2045 0.0851543 11.9208 0.0419064 11.6256C-0.00134155 11.3304 0.0143483 11.0296 0.0880692 10.7405C0.16179 10.4514 0.292079 10.1798 0.471405 9.94139C0.650732 9.70297 0.875539 9.50245 1.13283 9.35144C2.23119 8.65726 3.2058 7.78438 4.01638 6.76888C3.17968 5.77686 2.20208 4.91285 1.11477 4.20438C0.857478 4.05337 0.632672 3.85285 0.453346 3.61443C0.274019 3.37601 0.14373 3.1044 0.0700089 2.81532C-0.00371192 2.52624 -0.0194018 2.22541 0.0238461 1.93023C0.0670941 1.63504 0.168422 1.35136 0.321973 1.09557C0.475523 0.839789 0.67825 0.616976 0.918435 0.440016C1.15862 0.263056 1.4315 0.135459 1.7213 0.0645998C2.01109 -0.00625891 2.31206 -0.0189734 2.6068 0.0271913C2.90155 0.073356 3.18421 0.177484 3.43847 0.333557C5.5748 1.67928 7.38779 3.47993 8.74806 5.60703C8.95872 5.95797 9.07 6.35957 9.07 6.76888C9.07 7.17819 8.95872 7.57979 8.74806 7.93073Z'
                                    fill='#14133A'
                                />
                            </svg>
                        </div>
                    }
                    next2Label={null}
                    prevLabel={
                        <div className={`relative w-full h-full`}>
                            <svg
                                width='10'
                                height='14'
                                viewBox='0 0 10 14'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                                style={{
                                    position: 'absolute',
                                    top: 'calc(50% - 5px)',
                                    left: 'calc(50% - 5px)',
                                }}
                            >
                                <path
                                    d='M0.321938 5.62509C1.67494 3.49338 3.48176 1.68656 5.61347 0.333557C5.86773 0.177484 6.15039 0.073356 6.44514 0.0271913C6.73988 -0.0189734 7.04085 -0.00625891 7.33064 0.0645998C7.62044 0.135459 7.89332 0.263056 8.1335 0.440016C8.37369 0.616976 8.57642 0.839789 8.72997 1.09557C8.88352 1.35136 8.98485 1.63504 9.02809 1.93023C9.07134 2.22541 9.05565 2.52624 8.98193 2.81532C8.90821 3.1044 8.77792 3.37601 8.59859 3.61443C8.41927 3.85285 8.19446 4.05337 7.93717 4.20438C6.83881 4.89857 5.8642 5.77144 5.05362 6.78694C5.89032 7.77896 6.86792 8.64297 7.95523 9.35144C8.21252 9.50245 8.43733 9.70297 8.61666 9.94139C8.79598 10.1798 8.92627 10.4514 8.99999 10.7405C9.07371 11.0296 9.0894 11.3304 9.04615 11.6256C9.00291 11.9208 8.90158 12.2045 8.74803 12.4602C8.59448 12.716 8.39175 12.9388 8.15156 13.1158C7.91138 13.2928 7.6385 13.4204 7.3487 13.4912C7.05891 13.5621 6.75794 13.5748 6.4632 13.5286C6.16845 13.4825 5.88579 13.3783 5.63153 13.2223C3.4952 11.8765 1.68221 10.0759 0.321938 7.94879C0.111282 7.59785 0 7.19625 0 6.78694C0 6.37763 0.111282 5.97603 0.321938 5.62509Z'
                                    fill='#14133A'
                                />
                            </svg>
                        </div>
                    }
                    prev2Label={null}
                    value={selectedFirstMissionDate}
                    onChange={handleFirstMissionDateSelect}
                    // Disabled
                    tileDisabled={handleDetermineTileDisabled}
                    // Recurrent day
                    tileClassName={handleDetermineTileRecurrent}
                />
                <TimeButtonsContainer>
                    {availHoursFirstMission.map(hour => (
                        <TimeButton key={hour.value} onClick={() => handleFirstMissionHourSelect(hour.value)} active={selectedFirstMissionHour === hour.value}>
                            {hour.caption}
                        </TimeButton>
                    ))}
                </TimeButtonsContainer>
                {service && service.config.frequency !== 'once' ? (
                    <div className={`w-full relative hidden`}>
                        <div
                            className={`
                        font-bold text-16px
                        w-full
                    `}
                            style={{
                                marginTop: '32px',
                            }}
                        >
                            {t(`followingMissions`)}
                        </div>
                        <div
                            className={`
                        flex flex-wrap justify-center
                    `}
                        >
                            {/* Recurrent day dropdown */}
                            <div
                                style={{
                                    position: 'relative',
                                    marginTop: '20px',
                                }}
                            >
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: '6%',
                                        bottom: '1.9rem',
                                        zIndex: '5',

                                        minWidth: '1.5rem',
                                        paddingRight: '.5rem',
                                        fontSize: '10px',

                                        backgroundColor: theme`colors.surfaceGrey`,
                                    }}
                                >
                                    {service.config.frequency === 'every_week'
                                        ? `${t(`dayPlaceHolderEveryWeek`)}`
                                        : service.config.frequency === 'every_two_weeks'
                                        ? `${t(`dayPlaceHolderEveryTwoWeeks`)}`
                                        : `${t(`dayPlaceHolderEveryMonth`)}`}
                                </div>
                                <Dropdown
                                    style={{
                                        marginLeft: '0',
                                        width: '192px',
                                    }}
                                    value={selectedRecurrentMissionDay}
                                    onChange={e => setSelectedRecurrentMissionDay(e.target.value)}
                                    disabled={!firstMissionDate}
                                >
                                    {available_params.opening_days &&
                                        available_params.opening_days.map(day => (
                                            <option key={day} value={day}>
                                                {t(`weekDays.${day}`)}
                                            </option>
                                        ))}
                                </Dropdown>
                            </div>
                            {/* Recurrent time dropdown */}
                            <div
                                style={{
                                    position: 'relative',
                                    marginTop: '20px',
                                }}
                            >
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: '12%',
                                        bottom: '1.9rem',
                                        zIndex: '5',

                                        minWidth: '1.5rem',
                                        paddingRight: '.5rem',
                                        fontSize: '10px',

                                        backgroundColor: theme`colors.surfaceGrey`,
                                    }}
                                >
                                    {t(`timePlaceholder`)}
                                </div>
                                <Dropdown
                                    style={{
                                        marginLeft: '8px',
                                        width: '156px',
                                    }}
                                    value={selectedRecurrentMissionHour}
                                    onChange={e => setSelectedRecurrentMissionHour(e.target.value)}
                                    disabled={!firstMissionDate}
                                >
                                    {availHours &&
                                        availHours.map(hour => (
                                            <option key={hour.value} value={hour.value}>
                                                {/* {t(`${option.captionKey}`)} */}
                                                {hour.caption}
                                            </option>
                                        ))}
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                ) : null}
            </DatePickerContainer>
            <SecondaryButtonFull
                style={{
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '224px',
                    height: '48px',
                }}
                disabled={service && !isSubmitValid ? true : false}
                onClick={() => handleValidateSelectedDate()}
            >
                {t(`validate`)}
            </SecondaryButtonFull>
            {selectedFirstMissionHour && service.type !== 'massage' && service.type !== 'cleaning' && service.type !== 'upholstery' ? (
                <div
                    className={`
                    text-16px
                    w-full
                    inline
                `}
                >
                    {t(`we_will_arrive_to_you_${service.type}`, {
                        arrive_date: arriveDate(selectedFirstMissionDate),
                        hour_1: router.locale === 'en' ? convertToAmPm(selectedFirstMissionHour) : `${selectedFirstMissionHour}:00`,
                        hour_2: router.locale === 'en' ? convertToAmPm(arriveHours(selectedFirstMissionHour)) : `${arriveHours(selectedFirstMissionHour)}:00`,
                    })}
                </div>
            ) : null}
            {service && (service.type === 'laundry' || service.type === 'carpet') && selectedFirstMissionHour ? (
                service.config.laundry_express ? (
                    <div
                        className={`
                        text-16px
                        w-full
                    `}
                    >
                        {t(`laundry_delivery_express`, { laundry_delivery_date: laundryDeliveryExpress(selectedFirstMissionDate, selectedFirstMissionHour) })}
                    </div>
                ) : (
                    <div
                        className={`
                        text-16px
                        w-full
                        inline
                    `}
                    >
                        {t(`${service.type}_delivery_standard`, { delivery_date: laundryDeliveryStandard(selectedFirstMissionDate) })}
                        {laundryDeliveryStandardIsSunday(selectedFirstMissionDate) ? (
                            <strong>
                                {` `}
                                {t(`${service.type}_delivery_standard_no_delivery_on`)}&nbsp;
                            </strong>
                        ) : null}
                    </div>
                )
            ) : service && service.type === 'carpet' && selectedFirstMissionHour ? (
                <div
                    className={`
                            text-16px
                            w-full
                            inline
                        `}
                >
                    {t(`laundry_delivery_standard`, { delivery_date: carpetDelivery(selectedFirstMissionDate) })}
                    {carpetDeliveryIsSunday(selectedFirstMissionDate) ? <strong>{t(`${service.type}_delivery_standard_no_delivery_on`)}&nbsp;</strong> : null}
                </div>
            ) : null}
        </>
    );
};

export default DatePicker;
