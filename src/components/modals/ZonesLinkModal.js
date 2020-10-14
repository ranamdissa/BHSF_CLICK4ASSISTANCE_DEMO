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
                            <div className="row mx-0"> {/* Title */}
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
                                <div className="row"> {/* Company A */}
                                    <div className="col">
                                        LOBBY
                                    </div>
                                    <div className="col-3">
                                        9am-5pm
                                    </div>
                                    <div className="col">
                                        <a href="#">
                                            GO TO LOBBY
                                        </a>
                                    </div>
                                </div>

                                <div className="row"> {/* Company A */}
                                    <div className="col">
                                        BSHF STAND
                                    </div>
                                    <div className="col-3">
                                        9am-5pm
                                    </div>
                                    <div style={{display: "block"}} className="col">
                                            <a href="#">CHAT</a>
                                            <a href="#">WATCH VIDEO</a>
                                            <a href="#">LISTEN TO BSHF SPEAKER</a>
                                            <a href="#">DOWNLOAD PDF</a>

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
