import React from "react";
import DisplayMediaComponent from "./DisplayMediaComponent";

const DisplayMediaComponentProxy = (props) => {
    return (
        <DisplayMediaComponent
            isAnnotationVideo={props.annotationData.isAnnotationVideo}
            videoURL={props.annotationData.videoURL}
            iframeSource={props.annotationData.iframeSource}
            imageUrl={props.annotationData.imageUrl}
            iiifSource={props.annotationData.iiifSource}
            iiifMultiSource={props.annotationData.iiifMultiSource}
            carouselUsed={props.isCarouselUsed}
            isMediaUsed={props.annotationData.isMediaUsed}
        />
    )

}

export default DisplayMediaComponentProxy;