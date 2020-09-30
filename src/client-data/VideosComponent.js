import React from "react";
import VideoComponent from "../util/VideoComponent";

const VideosComponent = (props) => {
    return (
        <div>
            <VideoComponent id="Z4V1" src={process.env.PUBLIC_URL + `/videos/Z4V1.mp4`}/>
            <VideoComponent id="audio01" src={process.env.PUBLIC_URL + `/audio/Test audio file.mp3`} audio="Y"/>

        </div>
    )
}

export default VideosComponent;
