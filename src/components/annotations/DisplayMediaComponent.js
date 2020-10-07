import React from "react";
import {Viewer, MultiViewer} from "react-iiif-viewer";

const DisplayMediaComponent = (props) => {
    // console.log("[DisplayMediaComponent]", props.videoURL);

    let displayMedia = null;

    if(props.isMediaUsed === 'Y') {
        if (props.isAnnotationVideo) {

            displayMedia = <video playsInline width="100%" controls>
                <source src={props.videoURL} type="video/mp4"/>
                <source src={props.videoURL} type="video/ogg"/>
                Your browser does not support HTML video.
            </video>;

        } else if (props.iframeSource) {

            displayMedia =
                <iframe allowFullScreen allow="fullscreen" style={{border: 'none', width: '100%', height: '100%'}}
                        src={props.iframeSource}></iframe>;

        } else if (props.iiifSource) {

            if(props.carouselUsed) {

                displayMedia =   <div style={{
                        display: "block", margin: "auto auto", padding: "0px 0px 0px 3vw", maxWidth: "80%", justifyContent: "center" }}>
                        <Viewer height="35vh" width="80%" iiifUrl={props.iiifSource}/>
                    </div>;
            } else {
                displayMedia =  <Viewer height="35vh" width="100%" iiifUrl={props.iiifSource}/>;
            }

        } else if (props.iiifMultiSource) {

            if(props.carouselUsed) {

                displayMedia =   <div style={{
                        display: "block", margin: "auto auto", padding: "0px 0px 0px 3vw", maxWidth: "80%", justifyContent: "center" }}>
                        <MultiViewer height="35vh" width="80%" iiifUrls={props.iiifMultiSource}/>
                    </div>;
            } else {
                displayMedia =    <MultiViewer height="35vh" width="100%" iiifUrls={props.iiifMultiSource}/>;
            }

        } else {
            //This is the original class that came with the Carousel: className="d-block w-100"
            displayMedia = <img className="img-fluid"
                                src={props.imageUrl} alt="Annotation painting section"/>;
        }
    }


    return (
        <div className="annotation-media-container">
            <div className="annotation-image-wrapper">
                {displayMedia}
            </div>
        </div>
    )


}

export default DisplayMediaComponent;
