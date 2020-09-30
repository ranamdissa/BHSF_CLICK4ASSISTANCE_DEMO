import React, {Component} from "react";
import Modal from "react-bootstrap/Modal";
import Carousel from "react-bootstrap/Carousel";
import DisplayMediaComponent from "../annotations/DisplayMediaComponent";
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
        console.log("ZonesLinkModal onClickHandler:", zoneObj);
        this.props.onClickHandler(zoneObj);
    }

    render() {
        let zonesLinks = null;
        if (this.props.zonesData && this.props.zonesData.length > 0) {
            zonesLinks = this.props.zonesData.map((zoneObj) => {
                    // console.log("[ZonesLinkModal] zoneObj", zoneObj);

                    return (
                        <div key={"div_" + zoneObj.cameraLocationId.toString()}>
                            <a key={"a_" + zoneObj.cameraLocationId.toString()} href="#" onClick={() => this.onClickHandler(zoneObj)} style={{color: "black"}}>
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
                       onHide={this.hideModal} size={this.props.modelType} >
                    <Modal.Header closeButton style={{border:'none'}}  >
                    </Modal.Header>
                    <Modal.Body>
                        <div className="zone_links">
                            <h3>{ZONE_LINKS_LABEL}</h3>
                            {zonesLinks}
                        </div>

                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default ZonesLinkModal;
