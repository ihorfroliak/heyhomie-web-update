import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { animated, useSpring, useTransition } from 'react-spring';
import tw, { css, styled, theme } from 'twin.macro';
import { ClearAllMenusAndModals, _closeOverlay, _toggleMenu } from '../../../lib/slices/uiSlice';

const Backdrop = styled(animated.div)`
    position: fixed;
    top: 0;
    left: 0;
    content: '';
    width: 100%;
    height: 100%;
    background: rgba(20, 19, 58, 0.6);

    opacity: 0;
    z-index: 25;
    ${props =>
        props.isShown
            ? css`
                  display: block;
                  visibility: visible;
              `
            : ``};
`;

const Overlay = () => {
    const dispatch = useDispatch();
    const { ui, order } = useSelector(state => state);

    const spring = useSpring({
        opacity: ui.overlayActionsStack.length > 0 ? '1' : '0',
    });

    return (
        <Backdrop
            isShown={ui.overlayActionsStack.length > 0}
            style={{
                ...spring,
                visibility: spring.opacity.interpolate(o => (o === '0' ? 'hidden' : 'visible')),
                display: spring.opacity.interpolate(o => (o === '0' ? 'none' : 'block')),
            }}
            onClick={() => {
                dispatch(ClearAllMenusAndModals());
            }}
        />
    );
};

export default Overlay;
