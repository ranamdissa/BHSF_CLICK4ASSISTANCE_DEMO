import React, {Component} from 'react';
// import * as THREE from 'three/build/three.module.js';
// import * as THREE from 'three/build/three.min';
import * as THREE from 'three';
//import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import CircleJoystick from '../joystick/CircleJoystick'
import NavigationCore from '../navigation/navigation-core'
import {THUMB_MOVE_TYPE, THUMB_CROSS_ORIENTATION} from '../../client-data/CircleJoystickConstants'

class ThreeBuildingSample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            element: "How are you"
        };

        this.animate = this.animate.bind(this);
        this.setJoystickUpdateLoop = this.setJoystickUpdateLoop.bind(this);
        this.joystickEventReceiverMoving = this.joystickEventReceiverMoving.bind(this);
        this.joystickEventReceiverEnd = this.joystickEventReceiverEnd.bind(this);
        this.joystickUpdateLoop = null;
        this.objects = [];
        this.rotateCameraY = 0;
        this.rotateCameraX = 0;
        this.forwardCamera = 0;
        this.panCameraX = 0;
        this.panCameraUp = 0;


    }

    componentDidMount() {

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // document.body.appendChild( renderer.domElement );
        // use ref as a mount point of the Three.js scene instead of the document.body
        this.mount.appendChild(this.renderer.domElement);
        // this.setState({element : renderer.domElement});
        this.setState({element: this.renderer.domElement});
        this.navigationCore = new NavigationCore(this.camera);
        // let controls = new OrbitControls(this.camera, this.renderer.domElement);
        /* const geometry = new THREE.BoxGeometry(1, 1, 1);
         const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
         this.cube = new THREE.Mesh(geometry, material);
         this.scene.add(this.cube);*/

        this.scene.background = new THREE.Color(0xffffff);
        this.scene.fog = new THREE.Fog(0xffffff, 0, 750);

        let light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
        light.position.set(0.5, 1, 0.75);
        this.scene.add(light);
        this.createBuildings();
        this.camera.position.y = 10;

        this.animate();
    }


    setJoystickUpdateLoop(call) {
        this.joystickUpdateLoop = call;
    }

    animate() {
        requestAnimationFrame(this.animate);
        if (this.joystickUpdateLoop) {
            this.joystickUpdateLoop(this.camera,.05);
        }
      /*  this.navigationCore.rotateCameraXY(this.rotateCameraX, this.rotateCameraY);
        this.navigationCore.moveForward(this.forwardCamera);
        this.navigationCore.moveRight( this.panCameraX);
        this.navigationCore.moveUp( this.panCameraUp);*/

        this.renderer.render(this.scene, this.camera);
    }


    joystickEventReceiverMoving(event) {
        let {eventType, newXPos, newYPos, radius, centerX, centerY, thumbCrossOrientation} = event;
        if (eventType === THUMB_MOVE_TYPE.free) {
            let deltaX = newXPos - centerX;
            let deltaY = newYPos - centerY;

            if (deltaX !== 0) {
                this.rotateCameraY = -deltaX / (radius * 20);
            }

            if (deltaY !== 0) {
                this.forwardCamera = deltaY / (radius);
            }
        } else if (eventType === THUMB_MOVE_TYPE.cross2) {
            if (thumbCrossOrientation === THUMB_CROSS_ORIENTATION.vert) {
                let deltaY = newYPos - centerY;
                if (deltaY !== 0) {
                    this.rotateCameraX = -deltaY / (radius * 20);
                }
            }
            else if (thumbCrossOrientation === THUMB_CROSS_ORIENTATION.horiz) {
                let deltaX = newXPos - centerX;
                if (deltaX !== 0) {
                    this.panCameraX = deltaX / (radius);
                }
            }
        }
        else if (eventType === THUMB_MOVE_TYPE.cross) {
            if (thumbCrossOrientation === THUMB_CROSS_ORIENTATION.vert) {

                console.log("panup")
                let deltaY = newYPos - centerY;
                if (deltaY !== 0) {
                    this.panCameraUp = deltaY / (radius);
                }
            }
        }


    }

    joystickEventReceiverEnd(event) {
        this.rotateCameraY = 0;
        this.rotateCameraX = 0;
        this.forwardCamera = 0;
        this.panCameraX = 0;
        this.panCameraUp = 0;
    }

    createBuildings() {
        let vertex = new THREE.Vector3();
        let color = new THREE.Color();

        let floorGeometry = new THREE.PlaneBufferGeometry(2000, 2000, 100, 100);
        floorGeometry.rotateX(-Math.PI / 2);

        // vertex displacement

        let position = floorGeometry.attributes.position;

        for (let i = 0, l = position.count; i < l; i++) {

            vertex.fromBufferAttribute(position, i);

            vertex.x += Math.random() * 20 - 10;
            vertex.y += Math.random() * 2;
            vertex.z += Math.random() * 20 - 10;

            position.setXYZ(i, vertex.x, vertex.y, vertex.z);

        }

        floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

        position = floorGeometry.attributes.position;
        let colors = [];

        for (let i = 0, l = position.count; i < l; i++) {

            color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
            colors.push(color.r, color.g, color.b);

        }

        floorGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        let floorMaterial = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors});

        let floor = new THREE.Mesh(floorGeometry, floorMaterial);
        this.scene.add(floor);

        // objects

        let boxGeometry = new THREE.BoxBufferGeometry(20, 20, 20);
        boxGeometry = boxGeometry.toNonIndexed(); // ensure each face has unique vertices

        position = boxGeometry.attributes.position;
        colors = [];

        for (let i = 0, l = position.count; i < l; i++) {

            color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
            colors.push(color.r, color.g, color.b);

        }

        boxGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        for (let i = 0; i < 500; i++) {

            let boxMaterial = new THREE.MeshPhongMaterial({
                specular: 0xffffff,
                flatShading: true,
                vertexColors: THREE.VertexColors
            });
            boxMaterial.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);

            let box = new THREE.Mesh(boxGeometry, boxMaterial);
            box.position.x = Math.floor(Math.random() * 20 - 10) * 20;
            box.position.y = Math.floor(Math.random() * 20) * 20 + 10;
            box.position.z = Math.floor(Math.random() * 20 - 10) * 20;

            this.scene.add(box);
            this.objects.push(box);

        }
    }


    render() {
        return (
            <div ref={ref => (this.mount = ref)}>
                <CircleJoystick update={this.setJoystickUpdateLoop} eventDispatcherMoving={this.joystickEventReceiverMoving}
                                eventDispatcherEnd={this.joystickEventReceiverEnd}
                                movingEventDispatchDelay={0}/>
            </div>
        )
    }
}

// export  {ThreeCubeSample};
export default ThreeBuildingSample;
