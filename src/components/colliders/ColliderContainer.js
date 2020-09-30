import * as THREE from 'three'
import {COLLIDER_LAYER_CHANEL, TELEPORTPOINT_LAYER_CHANEL} from '../../client-data/GlobalConstants'
import ColliderDataController from "./ColliderDataController";
import TeleportDataController from "./TeleportDataController";

class ColliderContainer {
    constructor(scene, camera, colliders,teleportPoints,teleportEventReceiver) {
        this._teleportEventReceiver = teleportEventReceiver;
        this.scene = scene;
        this._colliders = colliders;
        this._teleportPoints = teleportPoints;
        this.camera = camera;
        this._colliderGroup = new THREE.Group();
        this._teleportPointsGroup = new THREE.Group();
        this.scene.add(this._colliderGroup);
        this.scene.add(this._teleportPointsGroup);
        this.init();
    }

    resetScene = (scene)=> {
        this.scene = scene;
        this.scene.add(this._colliderGroup);
        this.scene.add(this._teleportPointsGroup);
    }

    init(colliders,teleportPoints) {

        const coll = colliders || this._colliders
        coll.forEach((node) => {
            node.layers.set(COLLIDER_LAYER_CHANEL);
            this._colliderGroup.add(node);
            if (node.userData.collider) {
                const rec = ColliderDataController.getColliderDataById(node.userData.collider);
                if (rec) {
                    node.visible = rec.displayCollider === "Y";
                }
            }
            //console.log("colliderContainer init node=",node.name);
        });
        this.camera.layers.enable(COLLIDER_LAYER_CHANEL);

        const telep = teleportPoints || this._teleportPoints;

        telep.forEach((node) => {
            node.layers.set(TELEPORTPOINT_LAYER_CHANEL);
            this._teleportPointsGroup.add(node);
            if (node.userData.teleportPoint) {
                const rec = TeleportDataController.getTeleportPointsDataById(node.userData.teleportPoint);
                console.log("*********ColliderContainer=",node.userData.teleportPoint,rec);
                if (rec) {
                    node.visible = rec.displayTeleportPoint === "Y";
                }
            }
            //console.log("colliderContainer init node=",node.name);
        });

        this.camera.layers.enable(TELEPORTPOINT_LAYER_CHANEL);

    }

    triggerTeleportEvent = (teleportId)=> {

        this._teleportEventReceiver(teleportId);
    }

    get colliderGroup() {
        return this._colliderGroup;
    }
    get teleportPointsGroup() {
        return this._teleportPointsGroup;
    }

    dispose = ()=> {
        // this._colliderGroup.remove(...this._colliderGroup.children);
        //  this._teleportPointsGroup.remove(...this._teleportPointsGroup.children);
        this._colliderGroup.traverse((object) => {
            object.remove(...object.children);
        });

        this._teleportPointsGroup.traverse((object) => {
            object.remove(...object.children);
        });
    }
}

export default ColliderContainer;
