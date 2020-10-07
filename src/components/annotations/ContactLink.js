import React from "react";

const ContactLink = (props) => {

        if(props.hrefLink) {
            return (

                <div style={{display: "inline"}}>
                    <a href={props.hrefLink} target="_blank" onClick={props.onClickHandler}>
                        {props.contactName}
                    </a>

                </div>
            )
        }
        return null;
}

export default ContactLink;