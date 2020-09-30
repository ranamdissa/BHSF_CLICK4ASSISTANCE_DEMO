import React from "react";
import {Viewer, MultiViewer} from "react-iiif-viewer";

const DisplayMediaComponent = (props) => {

    if (props.isAnnotationVideo) {

        // console.log("[DisplayMediaComponent]", props.videoURL);

        return (
            <video playsInline width="100%" controls>
                <source src={props.videoURL} type="video/mp4"/>
                <source src={props.videoURL} type="video/ogg"/>
                Your browser does not support HTML video.
            </video>
        )
    } else if (props.iframeSource) {
        // console.log("[DisplayMediaComponent]", props.iframeSource);
        return (
            <iframe allowFullScreen allow="fullscreen" style={{border: 'none', width: '100%', height: '100%'}}
                    src={props.iframeSource}></iframe>
        )
    } else if (props.iiifSource) {
        return (
            <Viewer height="35vh" width="100%" iiifUrl={props.iiifSource}/>
        )
    } else if (props.iiifMultiSource) {
        return (
            <MultiViewer height="35vh" width="100%" iiifUrls={props.iiifMultiSource}/>
        )
    }
    //This is the original class that came with the Carousel: className="d-block w-100"
    return (
        <img className="img-fluid"
             src={props.imageUrl} alt="Annotation painting section"/>
    )

}

export default DisplayMediaComponent;
