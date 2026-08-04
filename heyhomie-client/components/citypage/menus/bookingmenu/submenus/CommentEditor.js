import { useState } from 'react';
import tw, { css, styled, theme } from 'twin.macro';

import { useTranslations } from 'next-intl';

import { useDispatch, useSelector } from 'react-redux';
import { editServiceForOrder } from '../../../../../api/endpoints/orders';
import { _setServiceLoading, _updateService } from '../../../../../lib/slices/orderSlice';
import { SecondaryButtonFull } from '../../../../ui/Buttons';
import { _removeFromOverlayActionStack, _toggleMenu } from '../../../../../lib/slices/uiSlice';

const CommentEditorContainer = styled.div`
    h2 {
        font-size: 24px;
        color: ${theme`colors.primary.dark`};
        ${tw`
                font-bold
            `};

        margin-bottom: 1rem;
    }
    p {
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 17px;

        color: #141338;

        margin-bottom: 1rem;
    }

    textarea {
        padding: 1rem;

        width: 100%;

        font-weight: 500;
        font-size: 16px;
        line-height: 19px;

        color: #141338;

        border: 1px solid #727189;
        border-radius: 4px;

        &:focus {
            border: 1px solid #141338;
            outline: none;
        }
    }
`;

const CommentEditor = ({ service }) => {
    // UI translations for the component
    const t = useTranslations('CityPage.BookingMenu.AddCommentSubmenu');

    // Redux state
    const { ui, order, user } = useSelector(state => state);
    const dispatch = useDispatch();

    // Local state
    const [commentInEdit, setCommentInEdit] = useState(service.user_comment ? service.user_comment : '');

    const handleChange = e => {
        setCommentInEdit(e.target.value);
    };

    // Handle submit
    const handleValidateComment = async () => {
        try {
            const payload = {
                service: {
                    id: service.id,
                    user_comment: commentInEdit,
                },
            };

            dispatch(
                _setServiceLoading({
                    homie_service_id: service.homie_service_id,
                    isLoading: true,
                })
            );

            const data = await editServiceForOrder(user.headers, user.x_token_user, user.x_token_visitor, order.id, payload);

            console.log(data);

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

            dispatch(_toggleMenu({ menu: `${service.type}AddCommentSubmenuOpen`, isOpen: false }));
            dispatch(_removeFromOverlayActionStack(`${service.type}AddCommentSubmenuOpen`));
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

    return (
        <CommentEditorContainer>
            <h2>{t(`heading`)}</h2>
            <p>{t(`para`)}</p>
            <textarea rows={6} value={commentInEdit} placeholder={t(`textareaPlacheloder`)} onChange={handleChange} />
            <SecondaryButtonFull
                onClick={() => handleValidateComment()}
                style={{
                    display: 'block',
                    width: '100%',
                    height: '48px',
                    marginLeft: '0',
                    marginRight: '0',
                }}
                disabled={service.isLoading || (!commentInEdit && !service.user_comment)}
            >
                {t(`validateBTN`)}
            </SecondaryButtonFull>
        </CommentEditorContainer>
    );
};

export default CommentEditor;
