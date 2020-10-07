
import AnnotationDataController from "./AnnotationDataController";

class MediaController{
    constructor(annotationContainer,videoContainer,css3dContainer) {
        this._annotationContainer = annotationContainer;
        this._videoContainer = videoContainer;
        this._css3dContainer = css3dContainer;
    }

    static getNodeRecord = (node) => {
        return AnnotationDataController.getAnnotationDataById(node.userData.painting_id);
    }
    addMedia = (node) => {
        const mediaRecord = MediaController.getNodeRecord(node);
        if (mediaRecord) {
            if (mediaRecord.isCSS3DObject) {
                this._css3dContainer.addCSS3DObject(node,mediaRecord);
            }
            else {
                if (mediaRecord.isAnnotation) {
                    this._annotationContainer.addAnnotationToMesh(node, mediaRecord);
                }
                if (mediaRecord.isStandaloneVideo) {
                    this._videoContainer.addVideoDisplay(mediaRecord, node);
                }
                else if (mediaRecord.isAudioPlayer) {
                    this._videoContainer.addVideoDisplay(mediaRecord, node);
                }
            }

            if (mediaRecord.displayMesh === 'N' && !(mediaRecord.isStandaloneVideo || mediaRecord.isAudioPlayer)) {
                node.visible = false;
            }


        }
    }

    addMediaWithNoParent = () => {
        const records = AnnotationDataController.getAnnotationsWithNoParent();
        records.forEach(mediaRecord => {
            if (mediaRecord.isAnnotation) {
                this._annotationContainer.addAnnotationToMesh(null, mediaRecord);
            }
            else if (mediaRecord.isCSS3DObject) {
                this._css3dContainer.addCSS3DObject(null,mediaRecord);
            }
            else if (mediaRecord.isAudioPlayer) {
                this._videoContainer.addVideoDisplay(mediaRecord, null);
            }

        })
    }

    get annotationContainer() {
        return this._annotationContainer;
    }

    get videoContainer() {
        return this._videoContainer;
    }

}

export default MediaController;
