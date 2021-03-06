import React from "react";
import Carousel from "react-bootstrap/Carousel";
import DisplayMediaComponent from "./DisplayMediaComponent";
import Modal from "react-bootstrap/Modal";

/**
 * This component creates a Carousel of media: image, video, and/or iframe
 * This component doesn't show an annotation modal
 * @param props
 * @returns {*}
 * @constructor
 */
const OnlyMediaCarousel = (props) => {


    let displayCarouselItems = null;
    if (props.annotationData.mediaObjects && props.annotationData.mediaObjects.length > 0) {
        displayCarouselItems = props.annotationData.mediaObjects.map((mediaObject, index) => {
            if(mediaObject.type === "image") {
                // console.log("[AnnotationModal] image media", mediaObject);

                return (
                    <Carousel.Item key={mediaObject.link}>
                        <DisplayMediaComponent
                            isAnnotationVideo={null}
                            videoURL={null}
                            iframeSource={null}
                            iiifSource={null}
                            iiifMultiSource={null}
                            imageUrl={process.env.PUBLIC_URL + mediaObject.link}
                            carouselUsed={true}
                            isMediaUsed={props.annotationData.isMediaUsed}
                        />
                    </Carousel.Item>
                )
            }
            else if(mediaObject.type === "iframe") {
                // console.log("[AnnotationModal] iframe media", mediaObject);
                return (
                    <Carousel.Item key={mediaObject.link}>
                        <DisplayMediaComponent
                            isAnnotationVideo={null}
                            videoURL={null}
                            iframeSource={mediaObject.link}
                            iiifSource={null}
                            iiifMultiSource={null}
                            imageUrl={null}
                            carouselUsed={true}
                            isMediaUsed={props.annotationData.isMediaUsed}
                        />
                    </Carousel.Item>
                )
            } else if (mediaObject.type === "iiifSource") {
                //    iiifSource
                return (
                    <Carousel.Item key={mediaObject.link}>
                        <DisplayMediaComponent
                            isAnnotationVideo={null}
                            videoURL={null}
                            iframeSource={null}
                            iiifSource={mediaObject.link}
                            iiifMultiSource={null}
                            imageUrl={null}
                            carouselUsed={true}
                            isMediaUsed={props.annotationData.isMediaUsed}
                        />
                    </Carousel.Item>
                )
            } else if (mediaObject.type === "iiifMultiSource") {
                //iiifMultiSource
                return (
                    <Carousel.Item key={mediaObject.link}>
                        <DisplayMediaComponent
                            isAnnotationVideo={null}
                            videoURL={null}
                            iframeSource={null}
                            iiifSource={null}
                            iiifMultiSource={mediaObject.link}
                            imageUrl={null}
                            carouselUsed={true}
                            isMediaUsed={props.annotationData.isMediaUsed}
                        />
                    </Carousel.Item>
                )
            }
            else {
                // console.log("[AnnotationModal] video media", mediaObject);
                return (
                    <Carousel.Item key={mediaObject.link}>
                        <DisplayMediaComponent
                            isAnnotationVideo={true}
                            videoURL={process.env.PUBLIC_URL + mediaObject.link}
                            iframeSource={null}
                            iiifSource={null}
                            iiifMultiSource={null}
                            imageUrl={null}
                            carouselUsed={true}
                            isMediaUsed={props.annotationData.isMediaUsed}
                        />
                    </Carousel.Item>
                )

            }
        })
    }

    return (
        <div className="annotation-modal">
            <Modal
                dialogClassName={"primaryModal modal-dialog annotation-modal-classname modal-dialog-scrollable"}
                show={props.showMediaCarousel}
                onHide={props.mediaCarouselCloseBtnHandler} size={props.annotationModalSize} centered={true}
                backdrop="static">
                <Modal.Header closeButton style={{border: 'none'}}>
                </Modal.Header>
                <Modal.Body>

                    <Carousel>
                        {displayCarouselItems}
                    </Carousel>
                </Modal.Body>
            </Modal>
        </div>
    )

}

export default OnlyMediaCarousel;