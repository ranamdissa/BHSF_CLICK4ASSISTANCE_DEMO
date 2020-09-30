import React, {Component} from 'react';
import {AnnotationsDB, ANNOTATION_CONTACT_TEXT} from '../../client-data/AnnotationDB'
import ReactPlayer from 'react-player'
import AnnotationDataController from "./AnnotationDataController";

class AnnotationPage extends Component {
    moreText;
    bodyText;
    headerText;
    imageUrl;
    paintingId;

    constructor(props) {
        super(props);


        this.state = {
            moreText: null,
            headerText: null,
            bodyText: null,
            paintingId: null,
            imageUrl: null,
            EnquireEmail: null,
            ContactURL: null,
            isVideo: false,

        }
    }

    componentDidMount() {
        let records = AnnotationDataController.getAnnotationDataById(this.props.match.params.id)
        if (records) {

            this.setState({
                ...this.state,
                ...records

            });
        }
    }

    render() {
        return (

            /* <div className="css3d-annotaion-container">
                 <div className="css3d-annotaion-container-sub">
                     <div className="css3d-text-container"></div>
                     <div className="css3d-annotaion-sub-container">
                         <div className="css3d-media-container">
                             <div className="css3d-media-sub">
                                 {this.state.isVideo ?
                                     <ReactPlayer id="AnnotationVideoPlayer" playing={false} controls={true}
                                                  url={this.state.videoURL} width="850px" heigt="478px"/> :
                                     <img
                                         className="d-lg-flex justify-content-lg-center align-items-lg-center"
                                         src={this.state.imageUrl} height="100%" width="100%"/>
                                 }

                                 <div className="css3d-text-sub">
                                     <h3 className="text-center css3d-text-head"><strong>{this.state.headerText}</strong>
                                     </h3>
                                     <p className="text-center css3d-text-body">{this.state.bodyText}<br/></p>
                                 </div>
                                 <div className="css3d-more-sub">
                                     <h3 className="text-center"><a
                                         href={this.state.EnquireEmail}>ENQUIRE</a>&nbsp;|&nbsp;<a
                                         href={this.state.ContactURL} target="_blank">BUY NOW</a></h3>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>*/
            <div>
                <div className="annotation-main-container">
                    <div className="annotation-media-container">
                        <div className="annotation-image-wrapper">
                            {this.state.isAnnotationVideo ?
                                <ReactPlayer id="AnnotationVideoPlayer" playing={false} controls={true}
                                             url={this.state.videoURL} /> :
                                <img
                                    src={this.state.imageUrl} alt="Annotation painting section"/>
                            }
                        </div>
                    </div>
                    <div className="annotation-text-container">
                        <div className="annotation-header-text-container">
                            <h3>{this.state.headerText}</h3>
                        </div>
                        <div className="annotation-body-text-container">
                            <p>{this.state.bodyText}</p>
                        </div>
                    </div>
                    <div className="annotation-contact-container">
                        {this.state.EnquireEmail ?
                            <h3>
                                <a href={this.state.EnquireEmail}>ENQUIRE</a>&nbsp;|&nbsp;
                                <a href={this.state.ContactURL} target="_blank">BUY NOW</a>
                            </h3> : null
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default AnnotationPage;
