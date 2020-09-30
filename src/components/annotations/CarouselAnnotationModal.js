import React, {Component} from "react";
import Modal from "react-bootstrap/Modal";
import Carousel from "react-bootstrap/Carousel";
import ItemAnnotationModal from "./ItemAnnotationModal";

class CarouselAnnotationModal extends Component{
    constructor(props) {
        super(props);

        this.state = {
            carouselIndicators: false,
        }

        this.displayItemsInCarousel = this.displayItemsInCarousel.bind(this);

    }


    displayItemsInCarousel = () => {
        let displayCarouselItems = [];
        if (this.props.annotationData.hasCarouselAsParent && this.props.annotationData.carouselAnnotationSiblings.length > 0) {
            this.props.annotationData.carouselAnnotationSiblings.map((carouselPainting) => {
                // console.log("[CarouselAnnotationModal] child painting Object", childPainting,)
                displayCarouselItems.push(
                    <Carousel.Item key={`carousel_item_${carouselPainting.paintingId}`}>
                        <ItemAnnotationModal key={`annotation_modal_${carouselPainting.paintingId}`}
                                             annotationData={carouselPainting}/>
                    </Carousel.Item>
                )
            })

        }
        return displayCarouselItems;
    }


    render() {
        return (
            <div className="annotation-modal">
                <Modal
                    dialogClassName={"primaryModal modal-dialog annotation-modal-classname modal-dialog-scrollable"}
                    show={this.props.showAnnotation}
                    onHide={this.props.hideCarouselAnnotation} size={this.props.annotationModalSize} centered={true}
                    backdrop="static">
                    <Modal.Header closeButton style={{border: 'none'}}>
                    </Modal.Header>
                    <Modal.Body>

                        <Carousel indicators={this.state.carouselIndicators}>
                            {this.displayItemsInCarousel()}
                        </Carousel>

                    </Modal.Body>
                </Modal>
            </div>
        )
    }

}

export default CarouselAnnotationModal;