import React, {Component} from 'react';
import Modal from "react-bootstrap/Modal";
import Image from "react-bootstrap/Image";
import ReactPlayer from "react-player";

class SocialMediaAnnotationModal extends Component {
    //annotationURL;
    constructor(props) {
        super(props);

        this.state = {
            annotationURL: ''
        }
    }

    onShow = () => {
        // this.annotationURL = this.props.annotationURL;
        this.setState({
            // ...this.state,
            ...this.props.annotationData
        })
    }



    gotoPage = (url) => {
        // window.location = this.state.ContactURL;
        window.open(url,'_blank');
    }



    render() {
        let buyNow = null;
        let sendTo = null;
        let pipe1 = null;

        let enquire =   <a href={this.state.EnquireEmail}  onClick={()=> this.onSendEmail()} >ENQUIRE</a> /*+ this.state.isSold === 'N' ?  `&nbsp;|&nbsp` : ''*/;

        if (this.state.isSold === 'N') {
            pipe1 =  <span>&nbsp;|&nbsp;</span>;
            buyNow = <a href={this.state.ContactURL} target="_blank" onClick={() => this.gotoPage()}>BUY NOW</a> ;
            sendTo = <a href={this.state.shareEmail} target="_blank" onClick={() => this.shareEmail()}>SEND TO</a>

        }

        return (

            <div className="annotation-modal">
                <Modal dialogClassName={"primaryModal modal-dialog annotation-modal-classname modal-dialog-scrollable"}
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
                                        {this.state.isAnnotationVideo ?
                                            <video width="100%" controls>
                                                <source src={this.state.videoURL} type="video/mp4"/>
                                                <source src={this.state.videoURL} type="video/ogg"/>
                                                Your browser does not support HTML video.
                                            </video> :
                                            <img
                                                src={this.state.imageUrl} alt="Annotation painting section"/>
                                        }
                                    </div>
                                </div>
                                <div className="annotation-text-container">
                                    <div className="annotation-header-text-container">
                                        <h5>{this.state.headerText}</h5>
                                    </div>
                                    <div className="annotation-social-media-container">
                                        <h6>KAHN GALLERY</h6>
                                        <a href="https://www.kahn-gallery.com/about" target="_blank" onClick={() => this.gotoPage("https://www.kahn-gallery.com/about")}>Mailing List</a>
                                        {pipe1}
                                        <a href="https://www.pinterest.co.uk/geraldine8195/" target="_blank" onClick={() => this.gotoPage("https://www.pinterest.co.uk/geraldine8195/")}>Pinterest</a>
                                        {pipe1}
                                        <a href="http://instagram.com/kahngallery" target="_blank" onClick={() => this.gotoPage("http://instagram.com/kahngallery")}>Instagram</a>
                                        {pipe1}
                                        <a href="https://twitter.com/KahnGallery" target="_blank" onClick={() => this.gotoPage("https://twitter.com/KahnGallery")}>Twitter</a>
                                        {pipe1}
                                        <a href="https://www.facebook.com/kahngallery/" target="_blank" onClick={() => this.gotoPage("https://www.facebook.com/kahngallery/")}>Facebook</a>
                                        {pipe1}
                                        <a href="https://www.kahn-gallery.com/" target="_blank" onClick={() => this.gotoPage("https://www.kahn-gallery.com/")}>Website</a>
                                        <br/> <br/>
                                        <h6>AURÉLIE QUENTIN</h6>
                                        <a href="https://www.pinterest.co.uk/aureliequentinpeintures/chill-masters/" target="_blank" onClick={() => this.gotoPage("https://www.pinterest.co.uk/aureliequentinpeintures/chill-masters/")}>Pinterest</a>
                                        {pipe1}
                                        <a href="https://www.instagram.com/aurelie_quentin_peintures/" target="_blank" onClick={() => this.gotoPage("https://www.instagram.com/aurelie_quentin_peintures/")}>Instagram</a>
                                        {pipe1}
                                        <a href="https://www.facebook.com/aureliequentinpeintures/" target="_blank" onClick={() => this.gotoPage("https://www.facebook.com/aureliequentinpeintures/")}>Facebook</a>
                                        {pipe1}
                                        <a href="https://www.aureliequentin.com/" target="_blank" onClick={() => this.gotoPage("https://www.aureliequentin.com/")}>Website</a>


                                    </div>
                                </div>

                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>


        )
    }


}

export default SocialMediaAnnotationModal;
