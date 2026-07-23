import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import tw, { css, styled, theme } from 'twin.macro';
import { _removeFromOverlayActionStack, _toggleMenu } from '../../../../lib/slices/uiSlice';
import { PrimaryButtonFull, PrimaryButtonOutlined } from '../../../ui/Buttons';
import ServiceConfigEditor from '../serviceEditor/ServiceEditor';

const CommentTextArea = styled.textarea`
    padding: 1rem;

    width: 100%;

    font-weight: 500;
    font-size: 16px;
    line-height: 19px;

    color: #14133a;

    border: 1px solid #727189;
    border-radius: 4px;

    &:focus {
        border: 1px solid #14133a;
        outline: none;
    }
`;

const EditServiceCommentModalDialogContainer = styled.div`
    position: 'relative';

    background-color: #ffffff;
    box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.05);
    border-radius: 4px;

    position: fixed;
    transition: 0.2s ease-in-out;

    max-height: 95vh;
    top: 20px;

    width: 94vw;
    left: calc(50% - 47vw);

    @media (min-width: 440px) {
        width: 400px;
        left: calc(50% - 200px);
    }

    @media (min-width: 640px) {
        max-height: 85vh;

        width: 56%;
        left: 22%;
    }

    @media (min-width: 1110px) {
        top: 10vh;

        width: 668px;
        left: calc(50% - 334px);
    }

    opacity: ${props => (props.isOpen ? '1' : '0')};
    z-index: ${props => (props.isOpen ? 50 : -10)};
`;

const EditServiceCommentModalDialogContentContainer = styled.div`
    width: 100%;
    height: 100%;

    h2 {
        font-weight: bold;
        font-size: 28px;
        line-height: 130%;
        /* or 36px */

        text-align: center;

        color: #14133a;
    }

    padding-bottom: 16px;
    padding-top: 24px;
    padding-left: 8px;
    padding-right: 8px;

    @media (min-width: 640px) {
        padding-bottom: 40px;
        padding-top: 48px;
        padding-left: 36px;
        padding-right: 36px;
    }
`;

const ServiceEditorWrapper = styled.div`
    overflow-y: auto;

    max-height: 35vh;

    @media (min-width: 640px) {
        max-height: 40vh;
    }
`;

const EditServiceCommentModalDialog = ({ service, handleValidateService, handleCancel }) => {
    // UI translations for the component
    const t = useTranslations('AccountPage.SubscriptionsPage.EditServiceCommentModalDialog');

    // Redux state
    const { ui } = useSelector(state => state);

    // Component state
    const [serviceInEdit, setServiceInEdit] = useState(service);

    const setServiceConfigItem = ({ field, value }) => {
        const workingObject = { ...serviceInEdit };

        workingObject.config[field] = value;

        setServiceInEdit({ ...workingObject });
    };

    useEffect(() => {
        setServiceInEdit(service);
    }, [service]);

    return (
        <EditServiceCommentModalDialogContainer isOpen={ui.editServiceCommentModalDialog}>
            {ui.editServiceCommentModalDialog && serviceInEdit ? (
                <EditServiceCommentModalDialogContentContainer>
                    <h2
                        style={{
                            marginBottom: `1rem`,
                        }}
                    >
                        {t(`heading`)}
                    </h2>
                    <ServiceEditorWrapper>
                        <CommentTextArea
                            value={serviceInEdit.config.user_comment}
                            placeholder={t(`placeholder`)}
                            rows={6}
                            onChange={e => {
                                setServiceConfigItem({
                                    field: `user_comment`,
                                    value: e.target.value,
                                });
                            }}
                        />
                    </ServiceEditorWrapper>
                    <div
                        className={`
                            flex justify-around flex-wrap
                        `}
                    >
                        <PrimaryButtonOutlined
                            style={{
                                display: 'block',
                                height: '48px',
                                width: '220px',
                                marginTop: '24px',
                                marginLeft: 0,
                                marginRight: 8,
                                marginBottom: 0,
                            }}
                            onClick={() => {
                                handleCancel();
                            }}
                        >
                            {t(`cancel_btn`)}
                        </PrimaryButtonOutlined>
                        <PrimaryButtonFull
                            style={{
                                display: 'block',
                                height: '48px',
                                width: '220px',
                                marginTop: '24px',
                                marginLeft: 0,
                                marginRight: 8,
                                marginBottom: 0,
                            }}
                            onClick={() => {
                                handleValidateService(serviceInEdit);
                            }}
                            disabled={!(service.config && service.config.user_comment)}
                        >
                            {t(`validate_btn`)}
                        </PrimaryButtonFull>
                    </div>
                </EditServiceCommentModalDialogContentContainer>
            ) : null}
        </EditServiceCommentModalDialogContainer>
    );
};

export default EditServiceCommentModalDialog;
