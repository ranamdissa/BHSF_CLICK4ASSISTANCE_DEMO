import React, {Component} from "react";
import Modal from "react-bootstrap/Modal";
import {ZONE_LINKS_LABEL} from "../../client-data/clientOptions";


class ZonesLinkModal extends Component {
    constructor(props) {
        super(props);
        this.hideModal = this.hideModal.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
    }


    hideModal = (evt) => {
        this.props.close(evt);
    };

    onClickHandler(zoneObj) {
        // console.log("ZonesLinkModal onClickHandler:", zoneObj);
        this.props.onClickHandler(zoneObj);
    }

    render() {
        let zonesLinks = null;
        if (this.props.zonesData && this.props.zonesData.length > 0) {
            zonesLinks = this.props.zonesData.map((zoneObj) => {
                // console.log("[ZonesLinkModal] zoneObj", zoneObj);

                return (
                    <div key={"div_" + zoneObj.cameraLocationId.toString()}>
                        <a key={"a_" + zoneObj.cameraLocationId.toString()} href="#"
                           onClick={() => this.onClickHandler(zoneObj)} style={{color: "black"}}>
                            {zoneObj.locationName}
                        </a>
                    </div>
                )

            })
        }

        //style={{textAlign: "center"}}

        return (
            <div className="help-dialog">
                <Modal dialogClassName={"primaryModal modal-dialog modal-dialog-centered modal-dialog-scrollable"}
                       show={this.props.show}
                       onHide={this.hideModal} size={this.props.modelType}>
                    <Modal.Header closeButton style={{border: 'none'}}>
                        <Modal.Title>Event Progamme</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="programme_layout">
                            <div className="row mx-0 mb-0"> {/* Title */}
                                <div className="col">
                                    <b>LOCATION NAME</b>
                                </div>
                                <div className="col-3">
                                    <b>TIME</b>
                                </div>
                                <div className="col">
                                    <b>EVENTS LINK</b>
                                </div>
                            </div>
                            <hr/>
                            <div style={{textAlign: "left"}}> {/* Content */}
                                <div className="row mx-0 mb-2"> {/* Company A */}
                                    <div className="col">
                                        LOBBY
                                    </div>
                                    <div className="col-3">
                                        9am-5pm
                                    </div>
                                    <div className="col">
                                        <div className="row">
                                            <a href="#">
                                                GO TO LOBBY
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="row mx-0 mb-2"> {/* Company A */}
                                    <div className="col">
                                        BSHF STAND
                                    </div>
                                    <div className="col-3">
                                        9am-5pm
                                    </div>
                                    <div className="col">
                                        <div className="row">
                                            <a href="#">CHAT</a>
                                        </div>
                                        <div className="row">
                                            <a href="#">WATCH VIDEO</a>
                                        </div>
                                        <div className="row">
                                            <a href="#">LISTEN TO BSHF SPEAKER</a>
                                        </div>
                                        <div className="row">
                                            <a href="#">DOWNLOAD PDF</a>
                                        </div>
                                    </div>
                                </div>

                                <div className="row mx-0 mb-2"> {/* Company A */}
                                    <div className="col">
                                        LA MEDICA STAND
                                    </div>
                                    <div className="col-3">
                                        <div className="row">
                                            9am-10am
                                        </div>
                                        <div className="row">
                                            10:05am-11:00am
                                        </div>
                                        <div className="row">
                                            12am-2pm
                                        </div>
                                        <div className="row">
                                            2:15pm-4:30pm
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="row">
                                            <a href="#">CHAT</a>
                                        </div>
                                        <div className="row">
                                            <a href="#">WATCH VIDEO</a>
                                        </div>
                                        <div className="row">
                                            <a href="#">LISTEN TO BSHF SPEAKER</a>
                                        </div>
                                        <div className="row">
                                            <a href="#">DOWNLOAD PDF</a>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>

                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default ZonesLinkModal;
