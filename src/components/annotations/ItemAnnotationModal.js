import React, {Component} from 'react';
import ContactLinksModal from "./ContactLinksModal";
import DisplayMediaComponentProxy from "./DisplayMediaComponentProxy";


class ItemAnnotationModal extends Component {

    constructor(props) {
        super(props);

    }

    onSendEmail = () => {
        window.location = this.props.annotationData.EnquireEmail;
    }

    gotoPage = (urlLink) => {
        window.open(urlLink, '_blank');
    }

    shareEmail = () => {
        window.location = this.props.annotationData.shareEmail;

    }


    render() {
        // console.log("[ItemAnnotationModal]", this.props.annotationData.annotationTextAlignment);

        return (

            <div className="annotation-modal">
                <div>
                    <div className="annotation-main-container-modal">
                        <div className="annotation-media-container">
                            <div className="annotation-image-wrapper">
                                <DisplayMediaComponentProxy annotationData={this.props.annotationData} isCarouselUsed={this.props.isCarouselUsed}/>
                            </div>
                        </div>
                        <div className="annotation-text-container">
                            <div className="annotation-header-text-container"
                                 dangerouslySetInnerHTML={{__html: this.props.annotationData.headerText}}>
                            </div>
                            <div className="annotation-body-text-container"
                                 style={{textAlign: this.props.annotationData.annotationTextAlignment,
                                lineHeight: this.props.annotationData.annotationTextLineHeight}}
                            >
                                <p dangerouslySetInnerHTML={{__html: this.props.annotationData.bodyText}}></p>
                            </div>
                        </div>
                        <div className="annotation-contact-container">
                            {/*<h6>*/}
                            {/*    {enquire} {questions} {exhibitionPdfLink}*/}

                            {/*</h6>*/}
                            <ContactLinksModal key="hasMediaCarouselLink" hasMediaCarouselLink={null} annotationData={this.props.annotationData}/>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default ItemAnnotationModal;
