import {CSS3DObject} from "three/examples/jsm/renderers/CSS3DRenderer";
import {Euler, Vector3} from "three";
import {isIOS, isSafari} from 'react-device-detect'
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from "react-router-dom";
import App from "../../App";
import ThreeGLTFLoader from "../three-gltf-loader";
import ThreeCubeSample from "../three-cube-sample";
import * as THREE from "three";
import {CSS3D_LAYER_CHANEL} from "../../client-data/GlobalConstants";
import {DEFAULT_ANNOTATION_SCALE} from "../../client-data/clientOptions";

//import YouTubePlayer from 'youtube-player';


class CSS3DContainer {
    _css3dScene;
    _css3DGroup;
    _camera;
    spriteMaterialPlay;
    spriteMaterialPause;
    _videoButton;
    _mediaRecord;
    _scene;
    _player;
    _videoStatus;
    _div;


    constructor(css3dScene, scene,camera) {
        this._css3dScene = css3dScene;
        this._scene = scene;
        this._css3DGroup = new THREE.Group();
        this._camera = camera;
        this._camera.layers.enable(CSS3D_LAYER_CHANEL);
        window.addEventListener("click", this.onDocumentMouseMove, false);


    }

    addCSS3DObject = (node, mediaRecord) => {


        this._mediaRecord = mediaRecord;

        const spriteMapPlay = new THREE.TextureLoader().load(mediaRecord.videoPlaySpriteImageURL);
        const spriteMapPause = new THREE.TextureLoader().load(mediaRecord.videoPauseSpriteImageURL);

        this.spriteMaterialPlay = new THREE.SpriteMaterial({map: spriteMapPlay, color: 0xffffff, fog: true});
        this.spriteMaterialPause = new THREE.SpriteMaterial({map: spriteMapPause, color: 0xffffff, fog: true});

        const boundingBox = node.geometry.boundingBox;
        const center = boundingBox.getCenter(new THREE.Vector3())
        const boxSize = boundingBox.getSize(new THREE.Vector3());

        const videoButtonPos = this._mediaRecord.videoButtonPos || new THREE.Vector3();
        this._videoButton = this.createVideoButton(videoButtonPos, boxSize);
        this._css3DGroup.add(this._videoButton);

        const css3d = this.createCss3dVideoPlayer(node,boxSize);
        this._css3dScene.add(css3d);
        this._scene.add(this._css3DGroup);

        console.log("center=",center);
        console.log("position=",node.position);
        console.log("size=", boxSize);
    }

    createVideoButton = (videoButtonPos) => {

        const sprite = new THREE.Sprite(this.spriteMaterialPlay);
        const spriteScale = this._mediaRecord.videoButtonScale || DEFAULT_ANNOTATION_SCALE;
        sprite.scale.copy(spriteScale);
        sprite.userData = this._mediaRecord.paintingId;



        sprite.position.copy(videoButtonPos);
        sprite.layers.set(CSS3D_LAYER_CHANEL);
        return sprite;
    }


    createCss3dVideoPlayer = (node, boxSize,width = 420 * 1.25, height = 250 * 1.25) => {
        const div = this._div = document.createElement('div');
        // div.id='W2V1iframevideo';
        //div.setAttribute("id", "W2V1iframevideo");
        div.style.width = `${width}px`;
        div.style.height = `${height}px`;
        // div.style.backgroundColor = '#000';
        div.style.backgroundColor = '#000';

        const video = document.createElement('iframe');
        // video.style.width = `${width}px`;
        video.id = 'W2V1-iframe-video';
        video.style.width = `100%`;
        video.style.height = `100%`;
        video.style.border = '100px';
        // video.src = ['https://www.youtube.com/embed/', 'SJOz3qjfQXU', '?rel=0'].join('');
        // video.src = ['https://www.youtube.com/embed/', 'b9sSnu7nqpE', '?rel=0'].join('');
        video.src = `https://www.youtube.com/embed/b9sSnu7nqpE?modestbranding=1&playsinline=0&showinfo=0&enablejsapi=1&origin=${window.location.origin}&widgetid=1`;


        div.appendChild(video);
        div.style.visibility = 'hidden';

        let player;
        if (window.YT) {


            player = new window.YT.Player(video, {
                events: {
                    'onReady': this.onPlayerReady,
                    'onStateChange': this.onPlayerStateChange,
                    //playerVars: { 'autoplay': 1, 'controls': 0,'autohide':1,'wmode':'opaque','origin':'http://localhost:3000' },
                }
            });
            /*   console.log("Youtube api=",player,window.YT);
               console.log("local host=",window.location.host);
               console.log("local host=",window.location.origin);
               console.log("local host=",window.location);*/

        } else {
            alert("Error loading Youtube iframe API");
        }

        //  ReactDOM.render(React.createElement('div',null,'Hello world'), div);



        const scaleX = boxSize.x / width;
        const scaleY = boxSize.y / height;
        const object = new CSS3DObject(div);


        // object.scale.set(.0101, .0095, 1);
        object.scale.set(scaleX, scaleY, 1);
        object.rotateY(-Math.PI / 2);
        if (isIOS || isSafari) {
            object.position.set(7.73, -.225, 0);
        } else {

            object.position.set(7.73, 0.025, 0); //works for everything except ios
        }
        return object;

    }

    annotationSelected = (obj) => {
        console.log("annotationSelected=",obj);
        if (this._videoStatus !== 1) {
            this._div.style.visibility = 'visible';
            this._videoButton.visible = false;
            //this._player.playVideo();
        }
    }



    onPlayerReady = (event) => {

        console.log("*****onPlayerReady");
        //document.getElementById('W2V1-iframe-video').style.borderColor = '#FF6D00';
        //event.target.playVideo();
        this._player = event.target;

    }
    changeBorderColor = (playerStatus) => {
        this._videoStatus = playerStatus;
        if (playerStatus === 0 || playerStatus === 2) {
            console.log("changeBorderColor=",playerStatus);
            this._div.style.visibility = 'hidden';
            this._videoButton.visible = true;
        }
        else if (playerStatus === 1) {
            this._div.style.visibility = 'visible';
            this._videoButton.visible = false;
        }
       /* let color;
        if (playerStatus == -1) {
            color = "#37474F"; // unstarted = gray
        } else if (playerStatus == 0) {
            color = "#FFFF00"; // ended = yellow
        } else if (playerStatus == 1) {
            color = "#33691E"; // playing = green
        } else if (playerStatus == 2) {
            color = "#DD2C00"; // paused = red
        } else if (playerStatus == 3) {
            color = "#AA00FF"; // buffering = purple
        } else if (playerStatus == 5) {
            color = "#FF6DOO"; // video cued = orange
        }*/
        /* if (color) {
             document.getElementById('W2V1-iframe-video').style.borderColor = color;
         }*/
    }
    onPlayerStateChange = (event) => {
        console.log("*****onPlayerStateChange", event.data);
        this.changeBorderColor(event.data);
    }

    onDocumentMouseMove = (event) => {

        // event.preventDefault();
        let intersects = null;


        intersects = this.getIntersects(event.clientX, event.clientY);
        if (intersects && intersects.length > 0) {

            let res = intersects[0];

            if (res && res.object && (res.object.userData === this._mediaRecord.paintingId)) {
                this.annotationSelected(res.object);
            }
        }
    }

    getIntersects = (x, y) => {

        const raycaster = new THREE.Raycaster();
        const mouseVector = new THREE.Vector3();
        raycaster.layers.enable(CSS3D_LAYER_CHANEL);


        x = (x / window.innerWidth) * 2 - 1;
        y = -(y / window.innerHeight) * 2 + 1;

        mouseVector.set(x, y, 0.5);
        raycaster.setFromCamera(mouseVector, this._camera);

        return raycaster.intersectObject(this._css3DGroup, true);

    }


}

export default CSS3DContainer;
