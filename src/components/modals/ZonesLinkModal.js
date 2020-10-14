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
                    </Modal.Header>
                    <Modal.Body>
                        <div className="zone_links">
                            {/*<h3>{ZONE_LINKS_LABEL}</h3>*/}
                            {/*{zonesLinks}*/}
                            <h3>Event Progamme</h3>
                            <div className="row mx-0"> {/* Title */}
                                <div className="col">
                                    <b>TIME</b>
                                </div>
                                <div className="col">
                                    <b>NO.</b>
                                </div>
                                <div className="col">
                                    <b>STAND</b>
                                </div>
                                <div className="col">
                                    <b>EVENT</b>
                                </div>
                            </div>
                            <hr/>
                            <div> {/* Content */}
                                <div style={{display: "inline"}}> {/* Company A */}
                                    <h6>9am - 10am</h6>
                                    <h6>01</h6>
                                    <h6>COMPANY A</h6>
                                    <h6>EVENTS</h6>
                                    <div> {/* Event activities, has to show in a 1-column - many rows */}
                                        <ul>
                                            <li>Chat</li>
                                            <li>Watch Video</li>
                                            <li>Listen to Audio</li>
                                            <li>Download PDF</li>
                                        </ul>
                                    </div>
                                </div>
                                <div style={{display: "inline"}}> {/* Company A */}
                                    <h6>9am - 5pm</h6>
                                    <h6>02</h6>
                                    <h6>COMPANY B</h6>
                                    <h6>EVENTS</h6>
                                    <div> {/* Event activities, has to show in a 1-column - many rows */}
                                        <ul>
                                            <li>Chat</li>
                                            <li>Watch Video</li>
                                            <li>Listen to Audio</li>
                                            <li>Download PDF</li>
                                        </ul>
                                    </div>
                                </div>
                                <div style={{display: "inline"}}> {/* Company A */}
                                    <h6>9am - 6pm</h6>
                                    <h6>01</h6>
                                    <h6>COMPANY C</h6>
                                    <h6>EVENTS</h6>
                                    <div> {/* Event activities, has to show in a 1-column - many rows */}
                                        <ul>
                                            <li>Chat</li>
                                            <li>Watch Video</li>
                                            <li>Listen to Audio</li>
                                            <li>Download PDF</li>
                                        </ul>
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
