import React, {Component} from 'react';
import Modal from "react-bootstrap/Modal";
import Image from "react-bootstrap/Image";
import Container from 'react-bootstrap/Container'
import Row from "react-bootstrap/Row";
import Button from 'react-bootstrap/Button'
import {Col} from "react-bootstrap";

const EnterAppModal = (props) => {

    const [isOpen, setIsOpen] = React.useState(true);

    const showModal = () => {
        setIsOpen(true);
    };

    const hideModal = (evt) => {
        setIsOpen(false);
        props.enterApp(evt);
    };

    return (

       /* <Modal dialogClassName={"primaryModal modal-dialog modal-dialog-centered"} show={isOpen} onHide={hideModal}
               size="lg" backdrop="static">
            <Container>

                <Row className="justify-content-sm-center">

                    <div style={{margin:'20px', cursor:'pointer'}}  onClick={evt => hideModal(evt)}>
                    <Col><p className="text-center"><Image
                        src={process.env.PUBLIC_URL + "/images/EnterExhibitionCard_Mockup.png"}
                        alt={"Entry Image"} fluid/></p></Col>
                    </div>

                </Row>


            </Container>
        </Modal>*/

    <div className="v21-entry-panel"  onClick={evt => hideModal(evt)}><img className="v21-entry-logo"
                                            src={process.env.PUBLIC_URL + "/images/EnterExhibitionCard.png"}
                                            alt={"Entry Image"}/>
    </div>

    );
};

export default EnterAppModal;
