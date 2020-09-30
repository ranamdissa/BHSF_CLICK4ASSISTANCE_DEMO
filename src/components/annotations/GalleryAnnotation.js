import React, {Component} from "react";
import Modal from "react-bootstrap/Modal";
import ContactLink from "./ContactLink";
import Carousel from "react-bootstrap/Carousel";
import ItemAnnotationModal from "./ItemAnnotationModal";
import ReactGa from "react-ga";
import DisplayMediaComponentProxy from "./DisplayMediaComponentProxy";
import ContactLinksModal from "./ContactLinksModal";

class GalleryAnnotation extends Component {
    constructor(props) {
        super(props);

            this.state = {
                showChildWorks: false,
                showAnnotationModal: true,
            }



        this.showWorksHandler = this.showWorksHandler.bind(this);
        this.goToPage = this.goToPage.bind(this);
        this.hideChildWorksHandler = this.hideChildWorksHandler.bind(this);
        this.displayItemsInCarousel = this.displayItemsInCarousel.bind(this);


        //This is part of the Google Analytics Module
        // console.log("ReactGa", this.props.annotationData.paintingId);
        ReactGa.event({
            category: 'Annotation',
            action: `User clicked an annotation ${this.props.annotationData.paintingId}`,
        })
    }


    showWorksHandler = () => {
        this.setState({
            showChildWorks: true,
            showAnnotationModal: true
        });

    }

    goToPage = (urlLink) => {
        window.open(urlLink, '_blank');
    }

    hideChildWorksHandler = () => {
        this.setState({
            showChildWorks: false,
            showAnnotationModal: false
        })
    }

    displayItemsInCarousel = () => {
        let displayCarouselItems = [];
        if (this.props.annotationData.childPaintings && this.props.annotationData.childPaintings.length > 0) {
            this.props.annotationData.childPaintings.map((childPainting, index) => {
                // console.log("[GalleryAnnotation] child painting Object", childPainting,)
                displayCarouselItems.push(
                    // <div key={childPainting.paintingId}>{childPainting.paintingId}</div>
                    <Carousel.Item key={`carousel_item_${childPainting.paintingId}`}>
                        {/*<div key={childPainting.paintingId}>{childPainting.paintingId}</div>*/}
                        <ItemAnnotationModal key={`annotation_modal_${childPainting.paintingId}`}
                                             showAnnotationModal={this.state.showAnnotationModal}
                                             hideAnnotationModal={this.hideChildWorksHandler}
                                             annotationModalSize={this.props.annotationModalSize}
                                             annotationData={childPainting}/>
                    </Carousel.Item>
                )
            })

        }
        return displayCarouselItems;
    }


    render() {

        const works = <ContactLink contactName="WORKS" isVerticalBar={false} hrefLink="#"
                                   onClickHandler={this.showWorksHandler}/>;
        // console.log("[GalleryAnnotation] displayCarouselItems", this.displayItemsInCarousel());

        if (this.state.showChildWorks) {
            return (
                <div className="annotation-modal">
                    <Modal
                        dialogClassName={"primaryModal modal-dialog annotation-modal-classname modal-dialog-scrollable"}
                        show={this.state.showChildWorks}
                        onHide={this.hideChildWorksHandler} size={this.props.annotationModalSize} centered={true}
                        backdrop="static">
                        <Modal.Header closeButton style={{border: 'none'}}>
                        </Modal.Header>
                        <Modal.Body>

                            <Carousel indicators="false">
                                {this.displayItemsInCarousel()}
                            </Carousel>


                        </Modal.Body>
                    </Modal>
                </div>
            )

        } else {
            return (
                <div className="annotation-modal">
                    <Modal
                        dialogClassName={"primaryModal modal-dialog annotation-modal-classname modal-dialog-scrollable"}
                        show={this.props.showAnnotation}
                        onHide={this.props.hideGalleryAnnotation} size={this.props.annotationModalSize} centered={true}
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
                                             dangerouslySetInnerHTML={{__html: this.props.annotationData.headerText}}>
                                        </div>
                                        <div className="annotation-body-text-container">
                                            <p dangerouslySetInnerHTML={{__html: this.props.annotationData.bodyText}}></p>
                                        </div>
                                    </div>
                                    <div className="annotation-contact-container">
                                        <ContactLinksModal hasMediaCarouselLink={works} annotationData={this.props.annotationData}/>

                                    </div>
                                </div>
                            </div>

                        </Modal.Body>
                    </Modal>
                </div>
            )
        }

    }

}

export default GalleryAnnotation;