import React, {Component} from 'react';
import ContactLink from "./ContactLink";
import ContactLinksModal from "./ContactLinksModal";
// import DisplayMediaComponent from './DisplayMediaComponent';
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

        // console.log("ItemAnnotationModal", this.props.annotationData);

        // /* isVerticalBar expects a boolean value, to check whether it is needed to populate the verticalbar (pipe) or not  */
        // const enquire = <ContactLink contactName="ENQUIRE" isVerticalBar={false} hrefLink={this.props.annotationData.EnquireEmail} onClickHandler={this.onSendEmail} />;
        // const questions = <ContactLink contactName="QUESTIONS" isVerticalBar={true} hrefLink={this.props.annotationData.EnquireEmail} onClickHandler={this.onSendEmail} />;
        // // const buyNow = <ContactLink contactName="BUY NOW" isVerticalBar={this.props.annotationData.EnquireEmail} hrefLink={this.props.annotationData.ContactURL} onClickHandler={() => this.gotoPage(this.props.annotationData.ContactURL)} />;
        // const exhibitionPdfLink = <ContactLink contactName="WORKS PDF" isVerticalBar={true} hrefLink={this.props.annotationData.ContactURL} onClickHandler={() => this.gotoPage(this.props.annotationData.ContactURL)} />;
        // // const sendTo = <ContactLink contactName="SEND TO" isVerticalBar={this.props.annotationData.EnquireEmail || this.props.annotationData.ContactURL} hrefLink={this.props.annotationData.shareEmail} onClickHandler={() => this.shareEmail()}/>;

        return (

            <div className="annotation-modal">
                <div>
                    <div className="annotation-main-container-modal">
                        <div className="annotation-media-container">
                            <div className="annotation-image-wrapper">
                                <DisplayMediaComponentProxy annotationData={this.props.annotationData}/>
                            </div>
                        </div>
                        <div className="annotation-text-container">
                            <div className="annotation-header-text-container"
                                 dangerouslySetInnerHTML={{__html: this.props.annotationData.headerText}}>
                            </div>
                            <div className="annotation-body-text-container">
                                <p dangerouslySetInnerHTML={{__html: this.props.annotationData.bodyText}}></p>
                            </div>
                        </div>
                        <div className="annotation-contact-container">
                            {/*<h6>*/}
                            {/*    {enquire} {questions} {exhibitionPdfLink}*/}

                            {/*</h6>*/}
                            <ContactLinksModal hasMediaCarouselLink={null} annotationData={this.props.annotationData}/>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default ItemAnnotationModal;
