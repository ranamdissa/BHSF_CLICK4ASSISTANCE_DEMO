import React, {useEffect, useRef, useState} from "react";
import {CSSTransition} from "react-transition-group";
import V21DropdownItem from "./V21DropdownItem";
/*
import {ReactComponent as VR} from '../../icons/VR.svg';
import {ReactComponent as FullScreen} from '../../icons/FullScreen.svg';
import {ReactComponent as QuestionMark} from '../../icons/QuestionMark.svg';
import {ReactComponent as ResetArrows} from '../../icons/ResetArrows.svg';
*/

import  VR from '../../icons/VR.svg';
import FullScreen from '../../icons/FullScreen.svg';
import QuestionMark from '../../icons/QuestionMark.svg';
import forPlanIconBlack from '../../icons/forPlanIconBlack.svg'
import ResetArrows from '../../icons/ResetArrows.svg';
import CloseFullScreen from '../../icons/CloseFullScreen.svg';
import ToggleAnnotation from '../../icons/ToggleAnnotaion.svg';
import HideAllControls from '../../icons/hideEyeBlack.svg';


function V21DropdownMenu(props) {
    const [activeMenu, setActiveMenu] = useState('main');
    const [menuHeight, setMenuHeight] = useState(null);
    const dropdownRef = useRef(null);


    /*  useEffect(() => {
          setMenuHeight(dropdownRef.current?.firstChild.offsetHeight)
      }, [])
  */
    function calcHeight(el) {
        const height = el.offsetHeight;
        setMenuHeight(height);
    }

    function onClickVR(evt) {

        if (props.onClick) {
            props.onClick(evt);
        }
        if (props.onClickVR) {
            props.onClickVR(evt);

        }
    }

    function onClickFullScreen(evt) {

        if (props.onClick) {
            props.onClick(evt);
        }
        if (props.onClickFullScreen) {
            props.onClickFullScreen(evt);

        }
    }

    function onClickQuestionMark(evt) {

        if (props.onClick) {
            props.onClick(evt);
        }
        if (props.onClickQuestionMark) {
            props.onClickQuestionMark(evt);

        }
    }

    function onClickZonesLink(evt) {
        if (props.onClick) {
            props.onClick(evt);
        }
        if (props.onClickZonesLink) {
            props.onClickZonesLink(evt);

        }
    }

    function onClickHideAllControlsHandler(evt) {
        if (props.onClick) {
            props.onClick(evt);
        }
        if (props.onClickHideAllControlsHandler) {
            props.onClickHideAllControlsHandler(evt);

        }
    }

    function onClickResetArrows(evt) {

        if (props.onClick) {
            props.onClick(evt);
        }
        if (props.onClickResetArrows) {
            props.onClickResetArrows(evt);

        }
    }

    function onToggleAnnotation(evt) {

        if (props.onClick) {
            props.onClick(evt);
        }
        if (props.onClickToggleAnnotation) {
            props.onClickToggleAnnotation(evt);

        }
    }

    return (

        <div className="dropdown" style={{height: menuHeight}} ref={dropdownRef}>
            <CSSTransition
                in={activeMenu === 'main'}
                timeout={500}
                classNames="menu-primary"
                unmountOnExit
                onEnter={calcHeight}>
                <div className="menu">
                    {/* <V21DropdownItem leftIcon={VR}  tooltip_type="vreality" onClick={evt => onClickVR(evt)}></V21DropdownItem> */}
                    <V21DropdownItem
                        leftIcon={props.isfullScreen ? CloseFullScreen : FullScreen}
                        tooltip_type={props.isfullScreen ? "wscreen" : "fullscreen"}
                        onClick={evt => onClickFullScreen(evt)}>
                    </V21DropdownItem>
                    <V21DropdownItem leftIcon={QuestionMark} tooltip_type="help" onClick={evt => onClickQuestionMark(evt)}></V21DropdownItem>
                    {props.displayZoneLink ?
                        <V21DropdownItem leftIcon={forPlanIconBlack} tooltip_type="floor_plan" onClick={evt => onClickZonesLink(evt)}></V21DropdownItem>
                        :null
                    }
                    <V21DropdownItem leftIcon={ResetArrows} tooltip_type="resetview" onClick={evt => onClickResetArrows(evt)}></V21DropdownItem>
                    <V21DropdownItem leftIcon={ToggleAnnotation} tooltip_type={props.toggleAnnotation} onClick={evt => onToggleAnnotation(evt)}></V21DropdownItem>
                    <V21DropdownItem leftIcon={HideAllControls} tooltip_type={props.toggleHideControlls} onClick={evt => onClickHideAllControlsHandler(evt)}></V21DropdownItem>
                </div>
            </CSSTransition>
        </div>

    );
}

export default V21DropdownMenu;
