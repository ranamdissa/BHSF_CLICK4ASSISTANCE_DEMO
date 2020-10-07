import React from "react";

const VerticalBarComponent = (props) => {

    return(
        props.isVerticalBar ? <span>&nbsp;|&nbsp;</span> : null
    )
}

export default VerticalBarComponent;