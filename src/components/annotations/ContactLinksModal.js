import React from "react";
import ContactLink from "./ContactLink";
import {
    ENQUIRE_EMAIL,
    LINKED_IN,
    INSTAGRAM,
    SEND_TO_EMAIL,
    TWITTER,
    TIKTOK,
    YOUTUBE, SPOTIFY, IMDB, FACEBOOK
} from '../../client-data/AnnotationDB';
import {MAX_ANNOTATION_LINKS_PER_LINE} from '../../client-data/GlobalConstants';
import VerticalBarComponent from "./VerticalBarComponent";


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

    const contactLinksArray = [];


    let enquire = null;
    if (props.annotationData.EnquireEmail) {
        enquire = <ContactLink key="enquire" contactName={ENQUIRE_EMAIL}
                               hrefLink={props.annotationData.EnquireEmail} onClickHandler={onSendEmail.bind(this)}/>;
        contactLinksArray.push(enquire);
    }

    let sendToEmail = null;
    if (props.annotationData.isSendTo === 'Y' && props.annotationData.shareEmail) {
        sendToEmail = <ContactLink key="sendToEmail" contactName={SEND_TO_EMAIL}
                                   hrefLink={props.annotationData.shareEmail} onClickHandler={shareEmail.bind(this)}/>;
        contactLinksArray.push(sendToEmail);
    }

    let instagramUrl = null;
    if (props.annotationData.instagramUrl) {
        instagramUrl = <ContactLink key="instagramUrl" contactName={INSTAGRAM}
                                    hrefLink={props.annotationData.instagramUrl}
                                    onClickHandler={() => goToPage(props.annotationData.instagramUrl)}/>;
        contactLinksArray.push(instagramUrl);
    }

    let contactUrl = null;
    if (props.annotationData.ContactURL) {
        contactUrl = <ContactLink key="contactUrl" contactName={props.annotationData.contactUrlLabel}
                                  hrefLink={props.annotationData.ContactURL}
                                  onClickHandler={() => goToPage(props.annotationData.ContactURL)}/>;
        contactLinksArray.push(contactUrl);
    }

    let youtubeUrl = null;
    if (props.annotationData.youtubeUrl) {
        youtubeUrl = <ContactLink key="youtubeUrl" contactName={YOUTUBE}
                                  hrefLink={props.annotationData.youtubeUrl}
                                  onClickHandler={() => goToPage(props.annotationData.youtubeUrl)}/>;
        contactLinksArray.push(youtubeUrl);
    }

    let linkedInUrl = null;
    if (props.annotationData.linkedInIUrl) {
        linkedInUrl = <ContactLink key="linkedInUrl" contactName={LINKED_IN}
                                   hrefLink={props.annotationData.linkedInIUrl}
                                   onClickHandler={() => goToPage(props.annotationData.linkedInIUrl)}/>;
        contactLinksArray.push(linkedInUrl);
    }

    let tiktokUrl = null;
    if (props.annotationData.tiktokUrl) {
        tiktokUrl = <ContactLink key="tiktokUrl" contactName={TIKTOK}
                                 hrefLink={props.annotationData.tiktokUrl}
                                 onClickHandler={() => goToPage(props.annotationData.tiktokUrl)}/>;
        contactLinksArray.push(tiktokUrl);
    }

    let urlLink1 = null;
    if (props.annotationData.urlLink1 && props.annotationData.urlLink1Label) {
        urlLink1 =
            <ContactLink key="urlLink1" contactName={props.annotationData.urlLink1Label}
                         hrefLink={props.annotationData.urlLink1}
                         onClickHandler={() => goToPage(props.annotationData.urlLink1)}/>;
        contactLinksArray.push(urlLink1);
    }


    if (props.hasMediaCarouselLink) {
        contactLinksArray.push(props.hasMediaCarouselLink);
    }

    let spotifyUrl = null;
    if (props.annotationData.spotifyUrl) {
        spotifyUrl = <ContactLink key="spotifyUrl" contactName={SPOTIFY}
                                  hrefLink={props.annotationData.spotifyUrl}
                                  onClickHandler={() => goToPage(props.annotationData.spotifyUrl)}/>;
        contactLinksArray.push(spotifyUrl);
    }

    let twitterUrl = null;
    if (props.annotationData.twitterUrl) {
        twitterUrl = <ContactLink key="twitterUrl" contactName={TWITTER}
                                  hrefLink={props.annotationData.twitterUrl}
                                  onClickHandler={() => goToPage(props.annotationData.twitterUrl)}/>;
        contactLinksArray.push(twitterUrl);
    }

    let imdbUrl = null;
    if (props.annotationData.imdbUrl) {
        imdbUrl = <ContactLink key="imdbUrl" contactName={IMDB}
                               hrefLink={props.annotationData.imdbUrl}
                               onClickHandler={() => goToPage(props.annotationData.imdbUrl)}/>;
        contactLinksArray.push(imdbUrl);
    }

    let facebookUrl = null;
    if (props.annotationData.facebookUrl) {
        facebookUrl = <ContactLink key="facebookUrl" contactName={FACEBOOK}
                                   hrefLink={props.annotationData.facebookUrl}
                                   onClickHandler={() => goToPage(props.annotationData.facebookUrl)}/>;
        contactLinksArray.push(facebookUrl);
    }

    let urlLink2 = null;
    if (props.annotationData.urlLink2 && props.annotationData.urlLink2Label) {
        urlLink2 =
            <ContactLink key="urlLink2" contactName={props.annotationData.urlLink2Label}
                         hrefLink={props.annotationData.urlLink2}
                         onClickHandler={() => goToPage(props.annotationData.urlLink2)}/>;
        contactLinksArray.push(urlLink2);
    }

    let urlLink3 = null;
    if (props.annotationData.urlLink3 && props.annotationData.urlLink3Label) {
        urlLink3 =
            <ContactLink key="urlLink3" contactName={props.annotationData.urlLink3Label}
                         hrefLink={props.annotationData.urlLink3}
                         onClickHandler={() => goToPage(props.annotationData.urlLink3)}/>;
        contactLinksArray.push(urlLink3);
    }

    // console.log("[ContactLinksModal]", props.annotationData.paintingId, contactLinksArray.length, contactLinksArray);

    const annotationLinksFirstLine = [];
    let isVerticalBarFlag = false;
    let isVerticalBarComponent = null;

    let maxLoop = 0;
    if(contactLinksArray.length <= MAX_ANNOTATION_LINKS_PER_LINE) {
        maxLoop = contactLinksArray.length;
    } else {
        maxLoop = MAX_ANNOTATION_LINKS_PER_LINE;
    }

    if (contactLinksArray.length > 0) {
        for (let i = 0; i < maxLoop; i++) {
            if (i !== 0 && i !== MAX_ANNOTATION_LINKS_PER_LINE) {
                isVerticalBarFlag = true;

            } else {
                isVerticalBarFlag = false;
            }
            isVerticalBarComponent = <VerticalBarComponent key={`annotationLinksFirstLine_${i}`} isVerticalBar={isVerticalBarFlag}/>;

            // console.log("[ContactLinksModal]", i, isVerticalBarFlag, isVerticalBarComponent, contactLinksArray[i]);
            annotationLinksFirstLine.push(isVerticalBarComponent);
            annotationLinksFirstLine.push(contactLinksArray[i]);
        }
    }

let annotationLinksSecondLine = [];
    isVerticalBarFlag = false;
    isVerticalBarComponent = null;

    maxLoop = 0;
    if(contactLinksArray.length <= 2*MAX_ANNOTATION_LINKS_PER_LINE) {
        maxLoop = contactLinksArray.length
    } else {
        //Raise an error here, we need to see about this once we encounter the scenario!
        maxLoop = 2*MAX_ANNOTATION_LINKS_PER_LINE;
        console.warn("[ContactLinksModal]: ANNOTATION CONTACT LINKS ARE MORE THAN ALLOWED BY APP: PLEASE CONTACT IT DEPARTMENT");
    }

    if (contactLinksArray.length > 0) {
        for (let i = MAX_ANNOTATION_LINKS_PER_LINE; i < maxLoop; i++) {
            if (i !== MAX_ANNOTATION_LINKS_PER_LINE && i !== 2*MAX_ANNOTATION_LINKS_PER_LINE) {
                isVerticalBarFlag = true;

            } else {
                isVerticalBarFlag = false;
            }
            isVerticalBarComponent = <VerticalBarComponent key={`annotationLinksFirstLine_${i}`} isVerticalBar={isVerticalBarFlag}/>;

            // console.log("[ContactLinksModal]", i, isVerticalBarFlag, isVerticalBarComponent, contactLinksArray[i]);
            annotationLinksSecondLine.push(isVerticalBarComponent);
            annotationLinksSecondLine.push(contactLinksArray[i]);
        }
    }

    return (
        <div className="annotation-contact-container">
            <h6>
                {annotationLinksFirstLine}
            </h6>
            <h6>
                {annotationLinksSecondLine}
            </h6>
        </div>
    )
}

export default ContactLinksModal;
