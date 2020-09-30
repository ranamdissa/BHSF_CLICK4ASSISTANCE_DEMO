import {AnnotationsDB, HAS_MEDIA_CAROUSEL_LINK} from '../../client-data/AnnotationDB';
import {ANNOTATION_VIDEO_DISPLAY, ANNOTATION_PARENT, VIDEO_PLAYING_MODE} from '../../client-data/GlobalConstants';
import * as THREE from 'three';

class AnnotationDataController {

    static cached_AnnotationDataById = {};

    constructor() {
    }

    static getAnnotationsWithNoParent() {
        const noParentRecords = [];
        const records = AnnotationsDB.filter(rec => rec.annotationParent === ANNOTATION_PARENT.PARENT_NONE);
        if (records) {
            records.forEach(item => {
                noParentRecords.push(AnnotationDataController.populateRecord(item));
            })
        }

        return noParentRecords;
    }

    //todo: need to cache these records in object
    static getAnnotationDataById(annotationId) {

        let records = AnnotationsDB.filter(rec => rec.paintingId === annotationId)
        if (records && records.length > 0) {
            const rec = AnnotationDataController.populateRecord(records[0]);
            if (annotationId in AnnotationDataController.cached_AnnotationDataById) {
                return AnnotationDataController.cached_AnnotationDataById[annotationId];
            } else {
                AnnotationDataController.cached_AnnotationDataById[annotationId] = rec;
                return rec;
            }
        }

        return null;
    }

    static populateRecord(record) {

        if (record) {

            //For now we are not using the "isSold" for almost anything!
            const isSold = record.isSold || 'N';
            const isSendTo = record.isSendTo || 'N';
            const hasChildren = record.hasChildren || 'N';
            let videoURL = null;
            let isAnnotationVideo = false;
            let isStandaloneVideo = false;
            let isAnnotation = false;
            let isCSS3DObject = false;
            let isAudioPlayer = false;
            let displayType = record.displayType || ANNOTATION_VIDEO_DISPLAY.ANNOTATION_TEXT;
            isAnnotationVideo = (displayType & ANNOTATION_VIDEO_DISPLAY.ANNOTATION_VIDEO);
            isAnnotation = (displayType & ANNOTATION_VIDEO_DISPLAY.ANNOTATION_TEXT) || (displayType & ANNOTATION_VIDEO_DISPLAY.ANNOTATION_VIDEO);
            isStandaloneVideo = (displayType & ANNOTATION_VIDEO_DISPLAY.VIDEO_STANDALONE);
            isCSS3DObject = (displayType & ANNOTATION_VIDEO_DISPLAY.CSS3D_OBJECT);
            isAudioPlayer = (displayType & ANNOTATION_VIDEO_DISPLAY.AUDIO_PLAYER);

            const annotationScale = record.annotationScale ? new THREE.Vector3(record.annotationScale.x, record.annotationScale.y, record.annotationScale.z) : null;
            const annotationPos = record.annotationPos ? new THREE.Vector3(record.annotationPos.x, record.annotationPos.y, record.annotationPos.z) : null;
            const annotationRotation = record.annotationRotation ? new THREE.Vector3(record.annotationRotation.x, record.annotationRotation.y, record.annotationRotation.z) : null;
            const imageURL = record.imageURL || `/paintings/${record.paintingId}.jpg`;
            const iframeSource = record.iframeSource || null;
            const hasCarouselAsParent = record.hasCarouselAsParent || false;


            // console.log("[AnnotationDataController]", record.paintingId);


            let ContactURL = null;
            let EnquireEmail = null;
            let shareEmail = null;

            //this is pending for answer from Claire and Joe
            let emailSubjectText = record.emailSubjectText || record.headerText;

            if (record.ContactURL) {
                ContactURL = record.ContactURL;
            }

            //"ENQUIRE" email link
            if (record.EnquireEmail) {
                EnquireEmail = `mailto:${record.EnquireEmail}?subject=${emailSubjectText}`;
            }

            //"SEND TO" email link: this sends an email with the ContactURL to anyone (not specified).
            if (isSendTo) {
                if (ContactURL) {
                    shareEmail = `mailto:?subject= ${emailSubjectText} &body=${emailSubjectText}` + escape("\n") + encodeURIComponent(record.ContactURL);
                } else {
                    shareEmail = `mailto:?subject= ${emailSubjectText} &body=${emailSubjectText}`;
                }
            }





            // console.log("[AnnotationDataControl], hasChildren", record.paintingId, hasChildren);

            let childPaintings = [];
            if (hasChildren === 'Y') {
                //Create an array of objects of the child paintingId we have from record.childPaintingId

                if (record.childPaintingId) {
                    record.childPaintingId.map((cPantingId) => {
                        childPaintings.push(AnnotationDataController.getAnnotationDataById(cPantingId));
                    })

                }
            }
            let carouselAnnotationSiblings = [];
            if (hasCarouselAsParent === 'Y') {
                //Create an array of objects of the child paintingId we have from record.childPaintingId

                // console.log("[AnnotationDataControl], hasCarouselAsParent", record.paintingId, hasCarouselAsParent);

                if (record.carouselAnnotationSiblings) {

                    record.carouselAnnotationSiblings.map((cPantingId) => {
                        carouselAnnotationSiblings.push(AnnotationDataController.getAnnotationDataById(cPantingId));
                    })
                }
            }


            const videoButtonScale = record.videoButtonScale ? new THREE.Vector3(record.videoButtonScale.x, record.videoButtonScale.y, record.videoButtonScale.z) : null;
            const videoButtonPos = record.videoButtonPos ? new THREE.Vector3(record.videoButtonPos.x, record.videoButtonPos.y, record.videoButtonPos.z) : null;

            const videoPlaySpriteImageURL = record.videoPlaySpriteImageURL ? process.env.PUBLIC_URL + record.videoPlaySpriteImageURL : process.env.PUBLIC_URL + '/assets/sprites/videoPlayButton.svg';
            const videoPauseSpriteImageURL = record.videoPauseSpriteImageURL ? process.env.PUBLIC_URL + record.videoPauseSpriteImageURL : process.env.PUBLIC_URL + '/assets/sprites/videoPauseButton.svg';


            return ({
                moreText: record.moreText,
                headerText: record.headerText,
                bodyText: record.bodyText,
                paintingId: record.paintingId,
                imageUrl: process.env.PUBLIC_URL + imageURL,
                isAnnotationVideo: isAnnotationVideo,
                isAnnotation: isAnnotation,
                isStandaloneVideo: isStandaloneVideo,
                isCSS3DObject:isCSS3DObject,
                isAudioPlayer:isAudioPlayer,
                displayMesh: record.displayMesh || 'Y',
                displayHeight: record.displayHeight || 100,
                videoURL: process.env.PUBLIC_URL + `/videos/${record.videoURL}`,
                EnquireEmail: EnquireEmail,
                isSendTo: isSendTo,
                shareEmail: shareEmail,
                annotationScale: annotationScale,
                annotationPos: annotationPos,
                annotationParent: record.annotationParent || ANNOTATION_PARENT.PARENT_MESH,
                isSold: isSold,
                socialMedia: record.socialMedia || 'N',
                spriteImageURL: record.spriteImageURL,
                hasMediaCarousel: record.hasMediaCarousel || 'N',
                hasOnlyMediaCarousel: record.hasOnlyMediaCarousel || 'N',
                mediaCarouselLinkLabel: record.mediaCarouselLinkLabel || HAS_MEDIA_CAROUSEL_LINK,
                mediaObjects: record.mediaObjects || null,
                artistInspirationUrl: record.artistInspirationUrl,
                emailSubjectText: emailSubjectText,
                hasChildren: hasChildren,
                childPaintings: childPaintings,
                iframeSource: iframeSource,
                standaloneVideoElementId: record.standaloneVideoElementId || 'displayVideo',
                hasCarouselAsParent: hasCarouselAsParent,
                carouselAnnotationSiblings: carouselAnnotationSiblings,
                ContactURL: ContactURL,
                youtubeUrl: record.youtubeUrl || null,
                spotifyUrl: record.spotifyUrl || null,
                linkedInIUrl: record.linkedInIUrl || null,
                instagramUrl: record.instagramUrl || null,
                twitterUrl: record.twitterUrl || null,
                tiktokUrl: record.tiktokUrl || null,
                imdbUrl: record.imdbUrl || null,
                facebookUrl: record.facebookUrl || null,
                urlLink1Label:  record.urlLink1Label|| null,
                urlLink1: record.urlLink1 || null,
                urlLink2Label: record.urlLink2Label || null,
                urlLink2: record.urlLink2 || null,
                urlLink3Label: record.urlLink3Label || null,
                urlLink3: record.urlLink3 || null,
                videoAutoPlay: record.videoAutoPlay || VIDEO_PLAYING_MODE.VIDEO_NOT_AUTO_PLAY, //auto play video
                videoButtonScale: videoButtonScale,
                videoButtonPos: videoButtonPos,
                videoPlaySpriteImageURL: videoPlaySpriteImageURL,
                videoPauseSpriteImageURL: videoPauseSpriteImageURL,
                videoTextureEncoding: record.videoTextureEncoding || THREE.LinearEncoding,
                videoLoop:record.videoLoop || false, // true/false value for video continues playing
                iiifSource: record.iiifSource || null,
                iiifMultiSource: record.iiifMultiSource || null,
                chatSrc: record.chatSrc || null,
                chatTitle: record.chatTitle || null,
            });
        }

        return null;
    }
}

export default AnnotationDataController;
