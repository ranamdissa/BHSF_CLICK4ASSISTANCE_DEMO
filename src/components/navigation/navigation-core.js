import {Euler, Raycaster, Vector3} from "three";
import {
    COLLIDER_LAYER_CHANEL,
    TELEPORTPOINT_LAYER_CHANEL
} from "../../client-data/GlobalConstants";
import {COLLIDER_DISTANCE_RATIO, TELEPORTPOINT_DISTANCE_RATIO} from "../../client-data/clientOptions";

/*as THREE from 'three/build/three.module.js';*/
const PI_2 = Math.PI/2;
const xEast = -9;
const xWest= 9;
const zNorth = 12.4;
const zSouth = 0;
const yFloor = 2.29;
const yCeiling = 4.7;


class NavigationCore {
    constructor(camera) {
        this.camera = camera;
        this.rotateCameraXY = this.rotateCameraXY.bind(this);
        this.moveForward = this.moveForward.bind(this);
        this.moveRight = this.moveRight.bind(this);
        this.moveUp = this.moveUp.bind(this);
    }

    static colliderRaycast = new Raycaster();
    // static rayCast = new Raycaster(new Vector3(), new Vector3(),0,1).layers.set(COLLIDER_LAYER_CHANEL);

    static canMove(origin,direction,far,object) {
        // return true;
       /* const rayCast = new Raycaster(origin, direction.multiplyScalar(Math.sign(far)),0,Math.abs(far * COLLIDER_DISTANCE_RATIO));
        rayCast.layers.set(COLLIDER_LAYER_CHANEL);*/
        NavigationCore.colliderRaycast.set(origin,direction.multiplyScalar(Math.sign(far)));
        NavigationCore.colliderRaycast.near = 0;
        NavigationCore.colliderRaycast.far = Math.abs(far * COLLIDER_DISTANCE_RATIO);
        NavigationCore.colliderRaycast.layers.set(COLLIDER_LAYER_CHANEL);

        // rayCast.far = far;
        // rayCast.set(origin,direction);
        //console.log("Raycast=",origin,direction,far);
        // const intersect = rayCast.intersectObjects([object],true)
        const intersect =  NavigationCore.colliderRaycast.intersectObjects([object],true)
        if (intersect && intersect.length > 0) {
            return false;
        }

        return true;


    }

    static hitTeleportPoint(origin,direction,far,object) {

        const rayCast = new Raycaster(origin, direction.multiplyScalar(Math.sign(far)),0,Math.abs(far * TELEPORTPOINT_DISTANCE_RATIO));
        rayCast.layers.set(TELEPORTPOINT_LAYER_CHANEL);

        const intersect = rayCast.intersectObjects([object],true)
        if (intersect && intersect.length > 0) {
            return intersect[0];
        }

        return null;


    }

    static rotateCameraXY2( camera,deltaX , deltaY ) {

        if (deltaX === 0 && deltaY === 0) return;

        let euler = new Euler( 0, 0, 0, 'YXZ' );

        euler.setFromQuaternion( camera.quaternion );

        euler.y += deltaY;
        euler.x += deltaX;

        euler.x = Math.max( - PI_2, Math.min( PI_2, euler.x ) );

        camera.quaternion.setFromEuler( euler );

    }

    rotateCameraXY( deltaX , deltaY ) {

        NavigationCore.rotateCameraXY2(this.camera,deltaX,deltaY)


    }

    static moveForward2( camera,distance,colliderContainer ) {

        if (distance === 0) return;

        let vec = new Vector3();
        let vecUp = new Vector3(0,1,0);
        // move forward parallel to the xz-plane
        vec.setFromMatrixColumn( camera.matrix, 0 );
        // vecUp.setFromMatrixColumn( camera.matrix, 1 );

        // vec.crossVectors( camera.up, vec );
        vec.crossVectors( vecUp, vec );

        if (!NavigationCore.canMove(camera.position,vec.clone(),Math.sign(distance),colliderContainer.colliderGroup)) {
            return;
        }
        const teleportNode = NavigationCore.hitTeleportPoint(camera.position,vec.clone(),Math.sign(distance),colliderContainer.teleportPointsGroup);
        if (teleportNode) {
            colliderContainer.triggerTeleportEvent(teleportNode.object.userData.teleportPoint);
        }

        camera.position.addScaledVector( vec, distance );

    };

    moveForward( distance ) {

        NavigationCore.moveForward2(this.camera,distance);

    };

    static moveRight2 ( camera,distance,colliderContainer ) {

        if (distance === 0) return;

        let vec = new Vector3();

        vec.setFromMatrixColumn( camera.matrix, 0 );

        if (!NavigationCore.canMove(camera.position,vec.clone(),Math.sign(distance),colliderContainer.colliderGroup)){
            return;
        }

        camera.position.addScaledVector( vec, distance );

    };

    moveRight ( distance ) {

        NavigationCore.moveRight2(this.camera,distance);

    };

    static moveUp2 ( camera, distance,colliderContainer ) {

        if (distance === 0) return;

        let vec = new Vector3();

        vec.setFromMatrixColumn( camera.matrix, 1 );

        if (!NavigationCore.canMove(camera.position,vec.clone(),.1 * Math.sign(distance),colliderContainer.colliderGroup)){
            return;
        }

        camera.position.addScaledVector( vec, distance );

    };

    moveUp ( distance ) {

        NavigationCore.moveUp2(this.camera,distance);

    };

}

export default NavigationCore;
