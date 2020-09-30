import React from "react";
import ContactLink from "./ContactLink";
import {
    ENQUIRE_EMAIL,
    LINKED_IN,
    CONTACT_URL,
    INSTAGRAM,
    SEND_TO_EMAIL,
    TWITTER,
    TIKTOK,
    YOUTUBE, SPOTIFY, IMDB, FACEBOOK
} from '../../client-data/AnnotationDB';


const ContactLinksModal = (props) => {

    const onSendEmail = () => {
        window.location = props.annotationData.EnquireEmail;
    }

    const shareEmail = () => {
        window.location = props.annotationData.shareEmail;
    }

    const goToPage = (urlLink) => {
        window.open(urlLink, '_blank');
    }


    /* isVerticalBar expects a boolean value, to check whether it is needed to populate the verticalbar (pipe) or not  */
    let isVerticalBar = false;
    let enquire = null;
    if (props.annotationData.EnquireEmail) {
        enquire = <ContactLink contactName={ENQUIRE_EMAIL} isVerticalBar={isVerticalBar}
                               hrefLink={props.annotationData.EnquireEmail} onClickHandler={onSendEmail.bind(this)}/>;
        isVerticalBar = true;
    }

    let sendToEmail = null;
    if (props.annotationData.isSendTo === 'Y' && props.annotationData.shareEmail) {
        sendToEmail = <ContactLink contactName={SEND_TO_EMAIL} isVerticalBar={isVerticalBar}
                                   hrefLink={props.annotationData.shareEmail} onClickHandler={shareEmail.bind(this)}/>;
        isVerticalBar = true;
    }

    let instagramUrl = null;
    if (props.annotationData.instagramUrl) {
        instagramUrl = <ContactLink contactName={INSTAGRAM} isVerticalBar={isVerticalBar}
                                    hrefLink={props.annotationData.instagramUrl}
                                    onClickHandler={() => goToPage(props.annotationData.instagramUrl)}/>;
        isVerticalBar = true;
    }

    let contactUrl = null;
    if (props.annotationData.ContactURL) {
        contactUrl = <ContactLink contactName={CONTACT_URL} isVerticalBar={isVerticalBar}
                                  hrefLink={props.annotationData.ContactURL}
                                  onClickHandler={() => goToPage(props.annotationData.ContactURL)}/>;
        isVerticalBar = true;
    }

    let youtubeUrl = null;
    if (props.annotationData.youtubeUrl) {
        youtubeUrl = <ContactLink contactName={YOUTUBE} isVerticalBar={isVerticalBar}
                                  hrefLink={props.annotationData.youtubeUrl}
                                  onClickHandler={() => goToPage(props.annotationData.youtubeUrl)}/>;
        isVerticalBar = true;
    }

    let linkedInUrl = null;
    if (props.annotationData.linkedInIUrl) {
        linkedInUrl = <ContactLink contactName={LINKED_IN} isVerticalBar={isVerticalBar}
                                   hrefLink={props.annotationData.linkedInIUrl}
                                   onClickHandler={() => goToPage(props.annotationData.linkedInIUrl)}/>;
        isVerticalBar = true;
    }

    let tiktokUrl = null;
    if (props.annotationData.tiktokUrl) {
        linkedInUrl = <ContactLink contactName={TIKTOK} isVerticalBar={isVerticalBar}
                                   hrefLink={props.annotationData.tiktokUrl}
                                   onClickHandler={() => goToPage(props.annotationData.tiktokUrl)}/>;
        isVerticalBar = true;
    }

    let urlLink1 = null;
    if (props.annotationData.urlLink1 && props.annotationData.urlLink1Label) {
        urlLink1 = <ContactLink contactName={props.annotationData.urlLink1Label} isVerticalBar={isVerticalBar}
                                hrefLink={props.annotationData.urlLink1}
                                onClickHandler={() => goToPage(props.annotationData.urlLink1)}/>;
        isVerticalBar = true;
    }


   //The second line of links starts here
    if(props.hasMediaCarouselLink) {
        isVerticalBar = true;
    }
    else {
        isVerticalBar = false;
    }

    let spotifyUrl = null;
    if (props.annotationData.spotifyUrl) {
        spotifyUrl = <ContactLink contactName={SPOTIFY} isVerticalBar={isVerticalBar}
                                  hrefLink={props.annotationData.spotifyUrl}
                                  onClickHandler={() => goToPage(props.annotationData.spotifyUrl)}/>;
        isVerticalBar = true;
    }

    let twitterUrl = null;
    if (props.annotationData.twitterUrl) {
        twitterUrl = <ContactLink contactName={TWITTER} isVerticalBar={isVerticalBar}
                                  hrefLink={props.annotationData.twitterUrl}
                                  onClickHandler={() => goToPage(props.annotationData.twitterUrl)}/>;
        isVerticalBar = true;
    }

    let imdbUrl = null;
    if (props.annotationData.imdbUrl) {
        imdbUrl = <ContactLink contactName={IMDB} isVerticalBar={isVerticalBar}
                               hrefLink={props.annotationData.imdbUrl}
                               onClickHandler={() => goToPage(props.annotationData.imdbUrl)}/>;
        isVerticalBar = true;
    }

    let facebookUrl = null;
    if (props.annotationData.facebookUrl) {
        facebookUrl = <ContactLink contactName={FACEBOOK} isVerticalBar={isVerticalBar}
                                   hrefLink={props.annotationData.facebookUrl}
                                   onClickHandler={() => goToPage(props.annotationData.facebookUrl)}/>;
        isVerticalBar = true;
    }

    let urlLink2 = null;
    if (props.annotationData.urlLink2 && props.annotationData.urlLink2Label) {
        urlLink2 = <ContactLink contactName={props.annotationData.urlLink2Label} isVerticalBar={isVerticalBar}
                                hrefLink={props.annotationData.urlLink2}
                                onClickHandler={() => goToPage(props.annotationData.urlLink2)}/>;
        isVerticalBar = true;
    }

    let urlLink3 = null;
    if (props.annotationData.urlLink3 && props.annotationData.urlLink3Label) {
        urlLink3 = <ContactLink contactName={props.annotationData.urlLink3Label} isVerticalBar={isVerticalBar}
                                hrefLink={props.annotationData.urlLink3}
                                onClickHandler={() => goToPage(props.annotationData.urlLink3)}/>;
        // isVerticalBar = true;
    }


    return (
        <div className="annotation-contact-container">
            <h6>
                {enquire} {sendToEmail} {instagramUrl} {contactUrl} {youtubeUrl} {urlLink1} {linkedInUrl}
            </h6>
            <h6>
                {props.hasMediaCarouselLink} {twitterUrl} {tiktokUrl}  {imdbUrl} {facebookUrl} {urlLink2} {urlLink3} {spotifyUrl}
            </h6>

        </div>
    )
}

export default ContactLinksModal;
