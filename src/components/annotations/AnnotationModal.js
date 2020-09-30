import React, {Component} from 'react';
import ContactLink from "./ContactLink";
import {HAS_MEDIA_CAROUSEL_LINK} from "../../client-data/GlobalConstants"

import Modal from "react-bootstrap/Modal";
import Carousel from "react-bootstrap/Carousel";

import ReactGa from 'react-ga';
import DisplayMediaComponent from "./DisplayMediaComponent";
import DisplayMediaComponentProxy from "./DisplayMediaComponentProxy";
import OnlyMediaCarousel from "./OnlyMediaCarousel";
import ContactLinksModal from "./ContactLinksModal";

class AnnotationModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            // isShowInSitu: false,
            showMediaCarousel: false,
        }

        this.showMediaCarouselHandler = this.showMediaCarouselHandler.bind(this);
        this.mediaCarouselCloseBtnHandler = this.mediaCarouselCloseBtnHandler.bind(this);
    }

    onShow = () => {
        this.setState({
            ...this.props.annotationData
        })

        //This is part of the Google Analytics Module
        // console.log("ReactGa", this.props.annotationData.paintingId);
        ReactGa.event({
            category: 'Annotation',
            action: `User clicked an annotation ${this.props.annotationData.paintingId}`,
        })
    }

    showMediaCarouselHandler = () => {
        // this.setState((state) => ({isShowInSitu: true}))
        this.setState((state) => ({showMediaCarousel: true}))

    }

    mediaCarouselCloseBtnHandler = () => {
        //this.setState({isShowInSitu: false});
        this.setState({showMediaCarousel: false});
    }

    render() {

        let hasMediaCarouselLink = null;
        if (this.state.hasMediaCarousel === "Y") {
            hasMediaCarouselLink = <ContactLink contactName={this.props.annotationData.mediaCarouselLinkLabel} isVerticalBar={false} hrefLink="#" onClickHandler={this.showMediaCarouselHandler}/>
        }



        if (this.state.showMediaCarousel) {
            /* Show a carousel page*/
            // console.log("[AnnotationModal] images length", this.props.annotationData.images.length);
            return (
                <OnlyMediaCarousel
                    annotationData={this.props.annotationData}
                    showMediaCarousel={this.state.showMediaCarousel}
                    mediaCarouselCloseBtnHandler={this.mediaCarouselCloseBtnHandler}
                    annotationModalSize={this.props.annotationModalSize}
                />
            )

        } else {

            return (

                <div className="annotation-modal">
                    <Modal
                        dialogClassName={"primaryModal modal-dialog annotation-modal-classname modal-dialog-scrollable"}
                        show={this.props.showAnnotationModal} onShow={() => this.onShow()}
                        onHide={this.props.hideAnnotationModal} size={this.props.annotationModalSize} centered={true}
                        backdrop="static">
                        <Modal.Header closeButton style={{border: 'none'}}>
                        </Modal.Header>
                        <Modal.Body>
                            <div>
                                <div className="annotation-main-container-modal">
                                    <div className="annotation-media-container">
                                        <div className="annotation-image-wrapper">
                                            <DisplayMediaComponentProxy annotationData={this.props.annotationData}/>
                                        </div>
                                    </div>
                                    <div className="annotation-text-container">
                                        <div className="annotation-header-text-container"
                                             dangerouslySetInnerHTML={{__html: this.state.headerText}}>
                                        </div>
                                        <div className="annotation-body-text-container">
                                            <p dangerouslySetInnerHTML={{__html: this.state.bodyText}}></p>
                                        </div>
                                    </div>
                                    <ContactLinksModal hasMediaCarouselLink={hasMediaCarouselLink} annotationData={this.props.annotationData}/>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>

                /* */
            )

        }
    }
}

export default AnnotationModal;
