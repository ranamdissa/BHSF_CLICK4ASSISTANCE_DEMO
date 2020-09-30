import VideoDisplay from "./VideoDisplay";
import * as THREE from "three";
import {ANNOTATION_LAYER_CHANEL, VIDEO_LAYER_CHANEL} from "../../client-data/GlobalConstants";

class VideoContainer {
    constructor(scene, camera, css3dScene) {

        this.scene = scene;
        this.camera = camera;
        this.css3dScene = css3dScene;
        this.videoDisplays = {};
        this.videosGroup = new THREE.Group();
        scene.add(this.videosGroup);



        this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
        window.addEventListener("click", this.onDocumentMouseMove, false);

        this.camera.layers.enable(VIDEO_LAYER_CHANEL);

    }

    resetScene = (scene)=> {
        this.scene = scene;
        this.scene.add(this.videosGroup);
    }

    addVideoDisplay(mediaRecord,mesh) {
        const videoDisplay = new VideoDisplay(mediaRecord,mesh,this.scene,this.css3dScene,this.videosGroup);
        this.videoDisplays[videoDisplay.mediaId] = videoDisplay;
    }

    annotationSelected(videoDisplay) {

        if (videoDisplay.isPlaying) {

            videoDisplay.PauseVideo();
        }
        else {
            videoDisplay.playVideo();
        }
    }

    annotationUnSelected(videoDisplay) {

    }

    onDocumentMouseMove(event) {

        // event.preventDefault();
        let intersects = null;



        intersects = this.getIntersects(event.clientX, event.clientY);
        if (intersects && intersects.length > 0) {

            let res = intersects.filter(res => {

                return (res && (res.object.userData in this.videoDisplays));

            })[0];

            if (res && res.object && (res.object.userData in this.videoDisplays)) {

                this.selectedObject = res.object;
                this.annotationSelected(this.videoDisplays[this.selectedObject.userData]);

            } else {

                if (this.selectedObject) {

                    this.annotationUnSelected(this.videoDisplays[this.selectedObject.userData]);
                    this.selectedObject = null;

                }
            }

        } else {
            if (this.selectedObject) {

                this.annotationUnSelected(this.videoDisplays[this.selectedObject.userData]);
                this.selectedObject = null;

            }
        }

    }

    getIntersects(x, y) {

        const raycaster = new THREE.Raycaster();
        const mouseVector = new THREE.Vector3();
        raycaster.layers.enable(VIDEO_LAYER_CHANEL);


        x = (x / window.innerWidth) * 2 - 1;
        y = -(y / window.innerHeight) * 2 + 1;

        mouseVector.set(x, y, 0.5);
        raycaster.setFromCamera(mouseVector, this.camera);

        return raycaster.intersectObject(this.videosGroup, true);

    }

    get videoContainerGroup() {
        return this.videosGroup;
    }

    dispose = ()=> {
        // this.videoContainerGroup.remove(...this.videoContainerGroup.children);
        this.videoContainerGroup.traverse((object) => {
            object.remove(...object.children);
        });
        this.videoDisplays = {};
    }

}

export default VideoContainer;
