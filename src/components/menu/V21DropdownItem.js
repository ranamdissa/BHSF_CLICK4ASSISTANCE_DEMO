import React, {useRef, useState} from "react";
import {getToolTipMsg} from "../../client-data/DisplayTooltip";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import {MOBILE_TOOLTIP_TIMEOUT} from "../../client-data/GlobalConstants";

function V21DropdownItem(props) {
    const [show, setShow] = useState(false);
    const target = useRef(null);
    const parentProps = props;
    const style = {
        display: 'inline-block'
    }

    function onClick(evt) {
        if (!show) {

            setShow(true);
            setTimeout(() => {
                setShow(false);
            }, MOBILE_TOOLTIP_TIMEOUT);
        } else {
            setShow(false);
            if (props.onClick) {
                props.onClick(evt);
            }
        }
    }

    function loseFocus(evt) {
        setShow(false);
    }

    return (
        <div>
            <button ref={target} className="menu-item v21-button-menu-item"
                    onClick={evt => onClick(evt)} onBlur={(evt) => loseFocus(evt)}>
                <span style={style}><img src={props.leftIcon} className="icon-button"/></span>
                {props.children}
            </button>
            <Overlay target={target.current} show={show} placement="left">
                {(props) => (
                    <Tooltip id="overlay-example" {...props}>
                        {getToolTipMsg(parentProps.tooltip_type)}
                    </Tooltip>
                )}
            </Overlay>
        </div>
    );
}

export default V21DropdownItem;
