import * as THREE from 'three';
import {Object3D} from "three";
import {ANNOTATION_LOCATION, DEFAULT_ANNOTATION_POS} from '../../client-data/GlobalConstants'
import {
    DEFAULT_ANNOTATION_LOCATION,
    DEFAULT_ANNOTATION_LOCATION_HORIZ_OFFSET,
    DEFAULT_ANNOTATION_LOCATION_VERT_OFFSET,
    DEFAULT_ANNOTATION_LOCATION_Z_OFFSET,
    DEFAULT_ANNOTATION_SCALE
} from "../../client-data/clientOptions";

const DEFAULT_ANNOTATION_WIDTH = 700;
const DEFAULT_ANNOTATION_HEIGHT = 1000;

class SpriteAnnotation {

    _width;
    _height;
    _spriteWorldPos;

    constructor(mesh, sprite,  displayMesh = true,mediaRecord) {


        //cache the css3dObject pos for videos because we will destroy it and recreate each time we access it.
        // we do this because if the video player is playing then it will continue even if we hide it
        // couldn't find a way to access the video
        this.cachedCss3dPos = null;
        this.mediaRecord = mediaRecord;
        this.displayMesh = displayMesh;
        this.sprite = sprite;
        this._annotationScale = mediaRecord.annotationScale || DEFAULT_ANNOTATION_SCALE;
        this.sprite.scale.copy(this._annotationScale);

        this._spriteWorldPos = mediaRecord.annotationPos;
        this.mesh = mesh;
        this.spriteGroup = new THREE.Group();
        this._selected = false;
        this.painting_Id = mediaRecord.paintingId;
        this._css3dRotation = null;

        this.getAnnotationGroup = this.getAnnotationGroup.bind(this);

        if (mesh) {
            this.mesh.add(this.sprite);
            this.spriteGroup.add(mesh);
            if (this._spriteWorldPos) {
                this.calcAnnotationPos();
            }
            else {
                this.autoCalcSpritePos();
            }
        }
        else {
            this.displayMesh = false;
            this._spriteWorldPos = this._spriteWorldPos || DEFAULT_ANNOTATION_POS;
            this.calcAnnotationPos();
        }
    }

    static getSpriteDefaultPos(boxSize) {

        const defPos = DEFAULT_ANNOTATION_LOCATION || ANNOTATION_LOCATION.TOP_RIGHT;
        let offsetX = DEFAULT_ANNOTATION_LOCATION_HORIZ_OFFSET || 0;
        let offsetY = DEFAULT_ANNOTATION_LOCATION_VERT_OFFSET || 0;

        switch (defPos) {
            case ANNOTATION_LOCATION.TOP_RIGHT:
                offsetX = (offsetX + boxSize.x/2);
                offsetY = (offsetY + boxSize.y/2);
                break;

             case ANNOTATION_LOCATION.CENTER_RIGHT:
                 offsetX = (offsetX + boxSize.x/2);
                 break;

            case ANNOTATION_LOCATION.BOTTOM_RIGHT:
                offsetX = (offsetX + boxSize.x/2);
                offsetY = (offsetY + boxSize.y/2) * -1;
                break;

            case ANNOTATION_LOCATION.BOTTOM_CENTER:
                offsetY = (offsetY + boxSize.Y/2) * -1;
                break;

            case ANNOTATION_LOCATION.BOTTOM_LEFT:
                offsetX = (offsetX + boxSize.x/2) * -1;
                offsetY = (offsetY + boxSize.y/2) * -1;
                break;

            case ANNOTATION_LOCATION.CENTER_LEFT:
                offsetX = (offsetX + boxSize.x/2) * -1;
                break;

            case ANNOTATION_LOCATION.TOP_LEFT:
                offsetX = (offsetX + boxSize.x/2) * -1;
                offsetY = (offsetY + boxSize.y/2);
                break;

            case ANNOTATION_LOCATION.TOP_CENTER:
                offsetY = (offsetY + boxSize.y/2) ;
                break;

        }

        return (new THREE.Vector3(offsetX,offsetY,DEFAULT_ANNOTATION_LOCATION_Z_OFFSET || .1))

    }

    getAnnotationGroup() {
        return this.spriteGroup
    }

    /*set spritePosition(vec) {
        this.sprite.position.set(vec.x, vec.y, vec.z);
    }*/

    set height(height) {
        this._height = height;
    }

    get height() {
        return this._height || DEFAULT_ANNOTATION_HEIGHT;
    }


    set width(width) {
        this._width = width;
    }

    get width() {
        return this._width || DEFAULT_ANNOTATION_WIDTH;
    }

    autoCalcSpritePos =() => {
        // const box = new THREE.Box3().setFromObject(this.mesh);
        const boundingBox = this.mesh.geometry.boundingBox;
       /* const center = box.getCenter(new THREE.Vector3());
        const boxSize = box.getSize(new THREE.Vector3());
        const center1 = boundingBox.getCenter(new THREE.Vector3());*/
        const boxSize1 = boundingBox.getSize(new THREE.Vector3());

        //Rana comments: this is for positioning the annotation button in 3D world boxSize1.x / 2 everything comes from the center of the poster/painting
        // const spritePos = new THREE.Vector3(-boxSize1.x / 2 - 0.2, boxSize1.y / 4, 0.10);
        const spritePos = SpriteAnnotation.getSpriteDefaultPos(boxSize1);
        // const offset = new THREE.Vector3(.6, -0.5, 0);
        // spritePos.add(offset);
        this.sprite.position.copy(spritePos);


        let worldPos = new THREE.Vector3();
        this.sprite.getWorldPosition(worldPos);

        this.css3dRotation = this.mesh.quaternion.clone();

        this.cachedCss3dPos = new THREE.Vector3();
        this.cachedCss3dPos.copy(worldPos);
        //this.css3dAnnot = null;
        // spritePos.sub(offset);
        this.sprite.position.copy(spritePos);
        if (!this.displayMesh) {

            this.sprite.getWorldPosition(worldPos);
            this.mesh.remove(this.sprite);
            this.sprite.position.copy(worldPos);
            this.spriteGroup.add(this.sprite)
        }

        // const wp = new THREE.Vector3();
        // this.sprite.getWorldPosition(wp);
        // console.log("sprite world po=",wp, this.mediaRecord.paintingId);
    }

    calcAnnotationPos = () => {
        if (this.displayMesh) {
            this.sprite.position.set(0,0,0);
            this.sprite.updateMatrixWorld(true);
            const worldPos1 = this.spriteWorldPos.clone();
            const worldPos2 = this.spriteWorldPos.clone();
            const localPos1 = this.sprite.worldToLocal(worldPos1);
            const localPos2 = this.sprite.localToWorld(worldPos2);
            const scale = this.sprite.scale.clone();
            this.sprite.position.copy(localPos1.multiply(scale));
        }
        else {
            if (this.mesh) {
                this.mesh.remove(this.sprite);
            }
            this.sprite.position.copy(this.spriteWorldPos);
            this.spriteGroup.add(this.sprite)
        }

        // const wp = new THREE.Vector3();
        // this.sprite.getWorldPosition(wp);
        // console.log("sprite world po=",wp, this.mediaRecord.paintingId);
    }

    get spriteWorldPos() {
        return this._spriteWorldPos;
    }


    get css3dRotation() {
        return this._css3dRotation;
    }

    set css3dRotation(quat) {
        this._css3dRotation = quat;
    }


    get selected() {
        return this._selected;
    }

    set selected(state) {
        this._selected = state;
    }

    get id() {
        return this.sprite.id;
    }

    get paintingId() {
        return this.painting_Id;
    }

    get annotationWorldPos() {
        return this.cachedCss3dPos;
    }


}

export default SpriteAnnotation;
