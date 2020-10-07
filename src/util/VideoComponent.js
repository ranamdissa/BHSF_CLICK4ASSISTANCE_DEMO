import React from "react";

const VideoComponent = (props) => {
    return (
        <div>
            {props.audio === 'Y' ?

                <audio  id={props.id} hidden>
                    <source src={props.src} type="audio/ogg"/>
                    <source src={props.src} type="audio/mpeg"/>
                    Your browser does not support the audio element.
                </audio>
                :
                <video id={props.id} playsInline style={{display: 'none'}}>
                    <source src={props.src} type='video/mp4 "avc1.42E01E, mp4a.40.2"'/>
                    <source src={props.src} type='video/ogg codecs="theora, vorbis"'/>
                </video>
            }
        </div>
    )
}

export default VideoComponent;
