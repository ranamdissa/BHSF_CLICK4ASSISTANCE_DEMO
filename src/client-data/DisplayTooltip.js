import React from "react";
import {Tooltip} from "react-bootstrap";


export const getToolTipMsg = (toolTipType) => {

    switch (toolTipType) {
        case "hamburger":
            return "Main Menu"
        case 'vreality':
            return "Virtual Reality"
        case 'help':
            return "Navigation Tips"
        case 'wscreen':
            return "Exit Full Screen"
        case 'fullscreen':
            return "Full Screen"
        case 'resetview':
            return "Reset View"
        case 'toggleAnnotationHide':
            return "Hide Tag"
        case 'toggleAnnotationShow':
            return "Show Tag"
        case 'floor_plan':
            return "Teleport"
        case 'hide_all_controls':
            return 'Hide Controls and Menu'
        case 'unhide_all_controls':
            return 'Show Controls and Menu'
        default:
            return "Click Here"
    }
}

const DisplayTooltip = (props) => {
    return (
        <Tooltip id={props.tooltip_type + "button-tooltip"} {...props}>{getToolTipMsg(props.tooltip_type)}</Tooltip>
    );
}
export default DisplayTooltip;
