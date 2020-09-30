import React, {Component} from 'react';
// import * as THREE from 'three/build/three.module.js';
// import * as THREE from 'three/build/three.min';
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import CircleJoystick from '../joystick/CircleJoystick'
import CubeSampleCore from "./CubeSampleCore";
import  './three-cub-sample.css';

class ThreeCubeSample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            element:"How are you"
        };

        this.animate = this.animate.bind(this);
        this.setGameLoop = this.setGameLoop.bind(this);
        this.gameLoop = null;
        this.prevTime = 0;
    }
    componentDidMount() {
        this.cubeSampleCore = new CubeSampleCore(this.mount,this.gameLoop);

       /* this.scene = new THREE.Scene();
        this. camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this. renderer = new THREE.WebGLRenderer({alpha:false});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.mount.appendChild(this.renderer.domElement);
        this.setState({element : this.renderer.domElement});
       // let controls = new OrbitControls(this.camera, this.renderer.domElement);
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
        this.camera.position.z = 3;
        this.camera.position.y = 2;
        this.camera.position.x = -5;

        requestAnimationFrame(this.animate);*/
    }


    setGameLoop(call) {
        this.gameLoop = call;
    }

    animate(time) {

        requestAnimationFrame(this.animate);

        let dt = (time - this.prevTime) / 1000;
        //console.log("ThreeCubeSample dt=",dt)

        let isLockedByJoystick = false;
        if (this.gameLoop) {
            isLockedByJoystick = this.gameLoop(this.camera,dt);
        }
       // this.cube.rotation.x += 0.01;
       // this.cube.rotation.y += 0.01;
        //console.log("rotation=",this.cube.matrix);
        this.renderer.render(this.scene, this.camera);
        this.prevTime = time;
    }

    render() {
        return (
            <div>
                <div  className="threeCubeSample" ref = {ref => (this.mount = ref)}>

                </div>
                <CircleJoystick update={this.setGameLoop} movingEventDispatchDelay={0}/>
            </div>
        )
    }
}

// export  {ThreeCubeSample};
export   default ThreeCubeSample;
