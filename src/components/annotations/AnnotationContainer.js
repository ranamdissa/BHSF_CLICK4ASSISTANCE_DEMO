import * as THREE from 'three';
import SpriteAnnotation from './SpriteAnnotation'
import {Vector3} from "three";
import {CSS3DObject} from "three/examples/jsm/renderers/CSS3DRenderer";
import {AnnotationsDB, ANNOTATION_CONTACT_TEXT} from '../../client-data/AnnotationDB'
import {ANNOTATION_LAYER_CHANEL} from "../../client-data/GlobalConstants";
import {DEFAULT_SPRITE_IMAGE_URL} from "../../client-data/clientOptions";


export const ANNOTATION_DOUBLE_SCALE = new THREE.Vector3(2, 2, 1);

class AnnotationContainer {
    constructor(scene, camera, css3dScene, callAnnotationModal) {

        this.isTouchScreen = 'ontouchstart' in window;
        this.selectedObject = null;
        this.scene = scene;
        this.camera = camera;
        this.css3dScene = css3dScene;
        this.camera.layers.enable(ANNOTATION_LAYER_CHANEL);
        this.annotationGroup = new THREE.Group();
        scene.add(this.annotationGroup);

        this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
        this.addAnnotationToMesh = this.addAnnotationToMesh.bind(this);

        window.addEventListener("click", this.onDocumentMouseMove, false);

        if (this.isTouchScreen) {
            window.addEventListener('touchstart', this.onDocumentMouseMove, {passive: false});
        }

        this.annatotions = {};
        this.originalAnnotScale = new THREE.Vector3();

        const spriteMap = new THREE.TextureLoader().load(process.env.PUBLIC_URL + DEFAULT_SPRITE_IMAGE_URL);
        // const spriteMap = new THREE.TextureLoader().load(process.env.PUBLIC_URL + '/assets/sprites/AnnotationsI.svg');

        this.spriteMaterial = new THREE.SpriteMaterial({map: spriteMap, color: 0xffffff, fog: true});

        /* const spriteMapVideo = new THREE.TextureLoader().load(process.env.PUBLIC_URL + '/assets/sprites/AnnotationsVideo.svg');

         this.spriteMaterialVideo = new THREE.SpriteMaterial({map: spriteMapVideo, color: 0xffffff, fog: true});*/

        //for preventing the annotation from flickering (closing and opening) while hovering on it
        this.lastSelectedAnnot = null;

        this.activeAnnotation = null;

        this.callAnnotationModal = callAnnotationModal;
    }

    resetScene = (scene)=> {
        this.scene = scene;
        this.scene.add(this.annotationGroup);
    }

    create3dAnnotation = (mesh, mediaRecord) => {
        let annotation = null;
        let sprite = null;


        const displayMesh = mediaRecord.displayMesh;
        const displayHeight = mediaRecord.displayHeight;

        /*if (mediaRecord.isVideo) {
            sprite = new THREE.Sprite(this.spriteMaterial);
            annotation = new SpriteAnnotation(mesh, sprite, (displayMesh === 'Y'), true);

        } else {
            sprite = new THREE.Sprite(this.spriteMaterial);
            annotation = new SpriteAnnotation(mesh, sprite);
        }*/
        if (mediaRecord.spriteImageURL) {
            const spriteMap = new THREE.TextureLoader().load(process.env.PUBLIC_URL + mediaRecord.spriteImageURL);
            const spriteMat = new THREE.SpriteMaterial({map: spriteMap, color: 0xffffff, fog: true});
            sprite = new THREE.Sprite(spriteMat);
            annotation = new SpriteAnnotation(mesh, sprite, (displayMesh === 'Y'),mediaRecord);
        }
        else {
            sprite = new THREE.Sprite(this.spriteMaterial);
            annotation = new SpriteAnnotation(mesh, sprite, (displayMesh === 'Y'),mediaRecord);
        }

        annotation.height = 1000 * displayHeight / 100;

        return {annotation, sprite}
    }

    addAnnotationToMesh(mesh, mediaRecord) {
        let {annotation, sprite} = this.create3dAnnotation(mesh, mediaRecord);

        sprite.layers.set(ANNOTATION_LAYER_CHANEL);
        this.annatotions[sprite.id] = annotation;
        this.annotationGroup.add(annotation.getAnnotationGroup());
    }

    annotationSelected(annot) {

        //use modal annotation
        if (this.callAnnotationModal) {
            this.callAnnotationModal(annot.paintingId);
            return;
        }

        this.lastSelectedAnnot = annot;
        if (annot.selected) {

            this.closeAnnotation(annot);
        } else {

            this.closeActiveAnnotation();
            const cssObj = this.create3dPage(
                700, annot.height,
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 0, 0),
                '/AnnotationPage/' + annot.paintingId);

            cssObj.applyQuaternion(annot.css3dRotation);
            cssObj.position.copy(annot.annotationWorldPos)
            annot.css3dAnnot = cssObj;
            annot.css3dAnnot.element.style.visibility = 'visible';
            annot.selected = true;
            this.activeAnnotation = annot;
        }


    }

    annotationUnSelected(annot) {
        this.lastSelectedAnnot = null;
    }

    closeAnnotation = (annotation) => {
        annotation.css3dAnnot.element.style.visibility = 'hidden';
        //need to remove the video, because if video is playing then it will continue to play sound even after getting hidden
        // if (this.activeAnnotation.isVideo) {
        this.css3dScene.remove(annotation.css3dAnnot);
        annotation.css3dAnnot = null;
        annotation.selected = false;
        this.activeAnnotation = null;
    }

    closeActiveAnnotation = () => {

        if (this.activeAnnotation) {
            this.closeAnnotation(this.activeAnnotation)

            /*  this.activeAnnotation.css3dAnnot.element.style.visibility = 'hidden';
              //need to remove the video, because if video is playing then it will continue to play sound even after getting hidden
              // if (this.activeAnnotation.isVideo) {
              this.css3dScene.remove(this.activeAnnotation.css3dAnnot);
              this.activeAnnotation.css3dAnnot = null;
              this.activeAnnotation.selected = false;*/
        }
        // this.activeAnnotation = null;

    }

    onDocumentMouseMove(event) {

        // event.preventDefault();
        let intersects = null;


        /*   if (this.isTouchScreen) {
               if (event.targetTouches && event.targetTouches) {
                   intersects = this.getIntersects(event.targetTouches[0].pageX, event.targetTouches[0].pageY);
               }
           } else {

               intersects = this.getIntersects(event.clientX, event.clientY);
           }*/
        intersects = this.getIntersects(event.clientX, event.clientY);
        if (intersects && intersects.length > 0) {

            let res = intersects.filter(res => {

                return (res && (res.object.id in this.annatotions));

            })[0];

            if (res && res.object && (res.object.id in this.annatotions)) {

                /*   if (this.selectedObject && this.selectedObject.id === res.object.id) {
                       return;
                   }*/
                this.selectedObject = res.object;
                this.annotationSelected(this.annatotions[this.selectedObject.id]);

            } else {

                if (this.selectedObject) {

                    this.annotationUnSelected(this.annatotions[this.selectedObject.id]);
                    this.selectedObject = null;

                }
            }

        } else {
            if (this.selectedObject) {

                this.annotationUnSelected(this.annatotions[this.selectedObject.id]);
                this.selectedObject = null;

            }
        }

    }

    getIntersects(x, y) {

        const raycaster = new THREE.Raycaster();
        const mouseVector = new THREE.Vector3();
        raycaster.layers.enable(ANNOTATION_LAYER_CHANEL);


        x = (x / window.innerWidth) * 2 - 1;
        y = -(y / window.innerHeight) * 2 + 1;

        mouseVector.set(x, y, 0.5);
        raycaster.setFromCamera(mouseVector, this.camera);

        return raycaster.intersectObject(this.annotationGroup, true);

    }

    createCssObject(w, h, position, rotation, url) {

        const html = [

            '<div  style="width:' + w + 'px; height:' + h + 'px;">',
            '<iframe src="' + url + '" width="' + w + '" height="' + h + '">',
            '</iframe>',
            '</div>'

        ].join('\n');
        const imageUrl = process.env.PUBLIC_URL + "/images/01_PreloadBackground.png";
        const headText = 'Sara Mohr-Pietsch with an adventurous';
        const bodyText = `This text is the content of the box. We have added a 50px padding, 20px margin and a 15px green border. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
        const moreText = 'Some more text';

        /* const html2 = `<div class="css3d-annotaion-container">
     <div id="css3dTextAnnotation" class="css3d-annotaion-sub-container">
         <div class="css3d-media-container">
             <div class="css3d-media-sub"><img src=${imageUrl} height="100%" width="100%"></div>
         </div>
         <div class="css3d-text-container">
             <div class="css3d-text-sub">
                 <h1 class="css3d-text-head">${headText}</h1>
                 <h2 class="text-left css3d-text-body">${bodyText}</h2>
             </div>
         </div>
         <div class="css3d-more-container">
             <div class="css3d-more-sub">
                 <h1 class="text-center">${moreText}</h1>
             </div>
         </div>
     </div>
 </div>`;*/

        const html3 = `<div style=" width: ${w}px; height: ${h}px;"> <iframe src="${url}" width="100%" height="100%" ></iframe> </div>`;


        const div = document.createElement('div');
        this.div = div;

        div.innerHTML = html3;
        div.style.visibility = 'hidden';

        const cssObject = new CSS3DObject(div);

        cssObject.position.x = 0;
        cssObject.position.y = 0;
        cssObject.position.z = 0;

        cssObject.rotation.x = rotation.x;
        cssObject.rotation.y = rotation.y;
        cssObject.rotation.z = rotation.z;

        cssObject.scale.set(.001, .001, .001);

        return cssObject;
    }


    create3dPage(w, h, position, rotation, url) {


        const cssObject = this.createCssObject(
            w, h,
            position,
            rotation,
            url);

        this.css3dScene.add(cssObject);
        return cssObject;
    }

    get annotationContainerGroup() {
        return this.annotationGroup;
    }

    dispose = () => {
        // this.annotationGroup.remove(...this.annotationGroup.children);
        this.annotationGroup.traverse((object) => {
            object.remove(...object.children);
        });
        this.annatotions = {};
    }
}

export default AnnotationContainer;
