import React from "react";
import ReactDOM from "react-dom";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
//import "bootstrap/dist/css/bootstrap.min.css";
import Image from 'react-bootstrap/Image'
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import {Col} from "react-bootstrap";
import Button from "react-bootstrap/Button";

const HelpModal = (props) => {


    const hideModal = (evt) => {
        props.closefunc(evt);
    };

    const imageURL =  window.isMobile ? process.env.PUBLIC_URL + "/images/MobilePortrait_QuestionMarkHelpCard.png" : process.env.PUBLIC_URL + "/images/Desktop_QuestionMarkHelpCard.png";

    return (
        <div className="help-dialog">
            <Modal dialogClassName={"primaryModal modal-dialog modal-dialog-centered modal-dialog-scrollable"} show={props.showHelp}
                   onHide={hideModal} size={props.modelType} >
                <Modal.Header closeButton style={{border:'none'}}  >
                </Modal.Header>
                <Modal.Body>
                    <p className="text-center"><Image className="img-responsive"
                                                      src={imageURL }
                                                      alt={"Entry Image"} fluid/></p>
                    {/*<Container>
                        <Row className="justify-content-sm-center">
                            <Col><p className="text-center"><Image className="img-responsive" style={{maxHeight:'500px'}}
                                src={props.modelType === 'sm' ? process.env.PUBLIC_URL + "/images/MobilePortrait_QuestionMarkHelpCard.png" : process.env.PUBLIC_URL + "/images/Desktop_QuestionMarkHelpCard.png" }
                                alt={"Entry Image"} fluid/></p></Col>
                        </Row>
                    </Container>*/}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default HelpModal;
