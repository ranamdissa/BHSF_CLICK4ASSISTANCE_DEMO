import * as THREE from "three";
import {CSS3DObject} from "three/examples/jsm/renderers/CSS3DRenderer";
import {ANNOTATION_LAYER_CHANEL, VIDEO_LAYER_CHANEL,VIDEO_PLAYING_MODE} from "../../client-data/GlobalConstants";
import {isIOS} from 'react-device-detect';

class VideoDisplay {
    videoScreen;
    videoElm;
    _isPlaying = false;
    videoButton;
    videoScreenInit = false;;

    constructor(mediaRecord, mesh, scene, css3dScene, videosGroup) {

        this.mediaRecord = mediaRecord;
        this.mesh = mesh;
        this._mediaId = mediaRecord.paintingId;
        this.scene = scene;
        this.css3dScene = css3dScene;

        const spriteMapPlay = new THREE.TextureLoader().load(mediaRecord.videoPlaySpriteImageURL);
        const spriteMapPause = new THREE.TextureLoader().load(mediaRecord.videoPauseSpriteImageURL);

        this.spriteMaterialPlay = new THREE.SpriteMaterial({map: spriteMapPlay, color: 0xffffff, fog: true});
        this.spriteMaterialPause = new THREE.SpriteMaterial({map: spriteMapPause, color: 0xffffff, fog: true});

        this.videosGroup = videosGroup;

        if (this.mediaRecord.isAudioPlayer) {
            this.calcAudioPosition();
        }
        else {

            this.calcPosition();
        }
    }

    calcPosition = ()=> {
        const boundingBox = this.mesh.geometry.boundingBox;
        const boxSize = boundingBox.getSize(new THREE.Vector3());
        const videoRotation = this.mesh.quaternion.clone();
        let worldPos = new THREE.Vector3();
        let worldPosVideoButton = new THREE.Vector3();

        this.videoElm = document.getElementById(this.mediaRecord.standaloneVideoElementId);
        if (isIOS) {

            this.videoElm.onloadedmetadata = this.canPlay;

        } else {
            this.videoElm.oncanplay = this.canPlay;

        }
        this.videoElm.onended  = this.ended;
        this.videoElm.onpause  = this.pause;
        this.videoElm.onplay  = this.play;
        this.videoElm.loop = this.mediaRecord.videoLoop;

        this.videoElm.src = this.mediaRecord.videoURL;
        const texture = new THREE.VideoTexture(this.videoElm);
        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.NearestFilter;
        texture.encoding = this.mediaRecord.videoTextureEncoding;

        const parameters = {color: 0xffffff, map: texture, side: THREE.DoubleSide};

        const geometry = new THREE.PlaneBufferGeometry(boxSize.x, boxSize.y);

        const material = new THREE.MeshBasicMaterial(parameters);
        this.videoScreen = new THREE.Mesh(geometry, material);

        const offsetPos = new THREE.Vector3(0, 0, boxSize.z + 0.001);
        const offsetPosVideoButton = new THREE.Vector3(0, -boxSize.y / 2 - .05, .1);
        this.mesh.add(this.videoScreen);

        this.videoScreen.position.copy(offsetPosVideoButton);
        this.videoScreen.getWorldPosition(worldPosVideoButton);
        this.videoScreen.position.copy(offsetPos);
        this.videoScreen.getWorldPosition(worldPos);
        this.videoScreen.visible = false;

        if (this.mediaRecord.videoAutoPlay === VIDEO_PLAYING_MODE.VIDEO_NOT_AUTO_PLAY || this.mediaRecord.videoAutoPlay === VIDEO_PLAYING_MODE.VIDEO_AUTO_PLAY_WITH_BUTTONS) {
            const videoButtonPos = this.mediaRecord.videoButtonPos || worldPosVideoButton.clone();
            this.videoButton = this.createVideoButton(videoButtonPos, boxSize);
            this.videosGroup.add(this.videoButton);
        }

        if (this.mediaRecord.displayMesh === 'N') {

            this.mesh.remove(this.videoScreen);
            this.videoScreen.position.copy(worldPos);
            this.videoScreen.applyQuaternion(videoRotation);
            this.scene.add(this.videoScreen);

        }

       /* if (this.mediaRecord.videoAutoPlay === VIDEO_PLAYING_MODE.VIDEO_AUTO_PLAY_NO_BUTTONS || this.mediaRecord.videoAutoPlay === VIDEO_PLAYING_MODE.VIDEO_AUTO_PLAY_WITH_BUTTONS) {
            const timeout = 10000;
            //this.videoScreen.visible = true;
            setTimeout(() => {
                    console.log("start video:",this.mediaRecord.standaloneVideoElementId,timeout);
                    this.autoPlay();
                },
                timeout);

        }*/
    }

    calcAudioPosition = () => {

        this.videoElm = document.getElementById(this.mediaRecord.standaloneVideoElementId);
        if (isIOS) {

            this.videoElm.onloadedmetadata = this.canPlay;

        } else {
            this.videoElm.oncanplay = this.canPlay;

        }
        this.videoElm.onended = this.ended;
        this.videoElm.onpause = this.pause;
        this.videoElm.onplay = this.play;
        this.videoElm.loop = this.mediaRecord.videoLoop;
        //this.videoElm.src = this.mediaRecord.videoURL;

        const videoButtonPos = this.mediaRecord.videoButtonPos;
        this.videoButton = this.createVideoButton(videoButtonPos, null);
        this.videosGroup.add(this.videoButton);
    }

    canPlay = () => {
        if (this.mediaRecord.videoAutoPlay === VIDEO_PLAYING_MODE.VIDEO_AUTO_PLAY_NO_BUTTONS || this.mediaRecord.videoAutoPlay === VIDEO_PLAYING_MODE.VIDEO_AUTO_PLAY_WITH_BUTTONS) {
            this.autoPlay();
        }
    }

    ended = () => {
        this._isPlaying = false;
        if (this.mediaRecord.videoAutoPlay !== VIDEO_PLAYING_MODE.VIDEO_AUTO_PLAY_NO_BUTTONS) {

            this.videoButton.material = this.spriteMaterialPlay;
        }
    }

    pause = () => {
        this._isPlaying = false;
        if (this.mediaRecord.videoAutoPlay !== VIDEO_PLAYING_MODE.VIDEO_AUTO_PLAY_NO_BUTTONS) {
            this.videoButton.material = this.spriteMaterialPlay;
        }
    }

    play = () => {
        if (!this.mediaRecord.isAudioPlayer) {
            this.initVideoScreen();
        }
        this._isPlaying = true;
        if (this.mediaRecord.videoAutoPlay !== VIDEO_PLAYING_MODE.VIDEO_AUTO_PLAY_NO_BUTTONS) {
            this.videoButton.material = this.spriteMaterialPause;
        }
    }




    autoPlay = ()=> {

        const self = this;

        //this.initVideoScreen();
        this.videoElm.play();
    }



    initVideoScreen = () => {
        if (this.videoScreenInit) return;
        this.videoScreen.visible = true;
        this.videoScreenInit = true;
    }


    playVideo = () => {

        console.log("playVideo is pressed");
        if (this.isPlaying) {
            return;
        }


       // this.initVideoScreen();
        this.videoElm.play();

    }

    PauseVideo = () => {
        if (!this.isPlaying) {
            return;
        }
        this.videoElm.pause();

    }


    get isPlaying() {
        return this._isPlaying;
    }


    createVideoButton = (videoButtonPos, boxSize) => {

        const sprite = new THREE.Sprite(this.spriteMaterialPlay);
        const spriteScale = this.mediaRecord.videoButtonScale || new THREE.Vector3(.1,.1,.1);
        sprite.scale.copy(spriteScale);
        sprite.userData = this.mediaRecord.paintingId;

        sprite.position.copy(videoButtonPos);
        sprite.layers.set(VIDEO_LAYER_CHANEL);
        return sprite;
    }

    createCss3dVideoPlayer(width, height) {
        const div = document.createElement('div');
        div.style.width = `${width}px`;
        div.style.height = `${height}px`;
        div.style.backgroundColor = '#000';
        const video = document.createElement('iframe');
        video.style.width = `${width}px`;
        video.style.height = `${height}px`;
        video.style.border = '0px';
        video.src = ['https://www.youtube.com/embed/', 'SJOz3qjfQXU', '?rel=0'].join('');



        div.appendChild(video);

        const object = new CSS3DObject(div);
        object.scale.set(.001, .001, 1);

        return object;

    }


    get mediaId() {
        return this._mediaId;
    }
}

export default VideoDisplay;
