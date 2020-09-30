import React from "react";
import Modal from "react-bootstrap/Modal";
import Image from 'react-bootstrap/Image'
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import ProgressBar from "react-bootstrap/ProgressBar";
import Col from "react-bootstrap/Col";

const LoadingProgressModal = (props) => {


    const hideModal = (evt) => {
        // props.closefunc(evt);
    };

    return (


        <div className="v21-loading-panel"><img className="v21-loading-logo"
                                                src={process.env.PUBLIC_URL + "/images/V21Artspace.png"}
                                                alt={"Loading image"}/>

            <div>
                <ProgressBar className="loading-ProgressBar" animated={false} now={props.progress} label={`${props.progress}%`} variant="warning" />
            </div>


        </div>

    );
};

export default LoadingProgressModal;
