import React from "react";

const ContactLink = (props) => {


        if(props.hrefLink) {

            let verticalBar = null;
            if (props.isVerticalBar) {
                verticalBar = <span>&nbsp;|&nbsp;</span>;
            }

            return (

                <div style={{display: "inline"}}>
                    {verticalBar}
                    <a href={props.hrefLink} target="_blank" onClick={props.onClickHandler}>
                        {props.contactName}
                    </a>

                </div>
            )
        }
        return null;
}

export default ContactLink;