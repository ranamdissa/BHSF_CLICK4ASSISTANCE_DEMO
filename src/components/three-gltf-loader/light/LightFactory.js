import * as THREE from 'three';
import {LIGHTS,SIDES_LIGHT_CONFIG,LIGHTPROBE_CONFIG} from "../../../client-data/LightDB";
import {AmbientLight, Color, DirectionalLight} from "three";
import { LightProbeGenerator } from "three/examples/jsm/lights/LightProbeGenerator";

class LightFactory {
    _lights = [];
    _scene;
    _gui;
    _lightProbe;
    _lightFolder;

    constructor(scene, gui) {
        this._scene = scene;
        this._gui = gui;
        if (gui) {
            this._lightFolder = gui.addFolder('Lights');
        }
    }


    createLights = () => {
        let index = this._lights.length;
        LIGHTS.forEach(item => {
            const light = item.light;
            if (item.light instanceof THREE.SpotLight) {
                console.log("SpotLight is added -", item.name);
                light.position.copy(item.position);
                light.target.position.copy(item.target);
                light.angle = item.angle;
                light.penumbra = item.penumbra;
                light.decay = item.decay;
                light.distance = item.distance;
                light.intensity = item.intensity;
                light.color = item.color;
                //light.power = item.intensity * Math.PI;
                light.name = item.name;
                this._lights[index++] = light;

            } else if (item.light instanceof THREE.PointLight) {
                console.log("PointLight is added -", item.name);
                light.position.copy(item.position);
                light.decay = item.decay;
                light.distance = item.distance;
                light.intensity = item.intensity;
                light.color = item.color;
                light.name = item.name;
                this._lights[index++] = light;

            } else if(item.light instanceof DirectionalLight) {

                console.log("Directional is added -", item.name);
                light.position.copy(item.position);
                light.target.position.copy(item.target);
                light.intensity = item.intensity;
                light.name = item.name;
                light.color = item.color;
                light.position.multiplyScalar( 30 );
                this._lights[index++] = light;
            }
            else if (item.light instanceof AmbientLight) {
                console.log("Ambient is added -", item.name);
                light.intensity = item.intensity;
                light.name = item.name;
                light.color = item.color;
                this._lights[index++] = light;
            }


        })
    }

    addToScene = () => {

        this._lights.forEach(item => {
            this._scene.add(item);
            if (item.target) this._scene.add(item.target);
            if (this._lightFolder) {
                this._lightFolder.addLight(item.name, item);
            }

        })
    }

    generate6XSideLights =(content) => {

        if (SIDES_LIGHT_CONFIG.generateSidesLights) {

            let index = this._lights.length;


            const box = new THREE.Box3().setFromObject(content);
            const boxSize = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());

            const targetPos = new THREE.Vector3(center.x,center.y - (boxSize.y/2),center.z);

            const color = SIDES_LIGHT_CONFIG.unifiedColor || new Color(0xFFFFFF);

            const XPosIntensity = SIDES_LIGHT_CONFIG.XPosIntensity;
            if (XPosIntensity) {
                const directXPos = new DirectionalLight(SIDES_LIGHT_CONFIG.XPosColor || color, XPosIntensity);
                directXPos.position.copy(new THREE.Vector3(center.x + (5 * boxSize.x), center.y * 5, center.z));
                directXPos.target.position.copy(targetPos);
                directXPos.name = "directXPos";
                this._lights[index++] = directXPos;
            }

            const XNegIntensity = SIDES_LIGHT_CONFIG.XNegIntensity;
            if (XNegIntensity) {
                const directXNeg = new DirectionalLight(SIDES_LIGHT_CONFIG.XNegColor || color, XNegIntensity);
                directXNeg.position.copy(new THREE.Vector3(center.x - (5 * boxSize.x), center.y * 5, center.z));
                directXNeg.target.position.copy(targetPos);
                directXNeg.name = "directXNeg";
                this._lights[index++] = directXNeg;
            }


            const ZPosIntensity = SIDES_LIGHT_CONFIG.ZPosIntensity;
            if (ZPosIntensity) {
                const directZPos = new DirectionalLight(SIDES_LIGHT_CONFIG.ZPosColor || color, ZPosIntensity);
                directZPos.position.copy(new THREE.Vector3(center.x, center.y * 5, center.z + (5 * boxSize.z)));
                directZPos.target.position.copy(targetPos);
                directZPos.name = "directZPos";
                this._lights[index++] = directZPos;
            }

            const ZNegIntensity = SIDES_LIGHT_CONFIG.ZNegIntensity;
            if (ZNegIntensity) {
                const directZNeg = new DirectionalLight(SIDES_LIGHT_CONFIG.ZNegColor || color, ZNegIntensity);
                directZNeg.position.copy(new THREE.Vector3(center.x, center.y * 5, center.z - (5 * boxSize.z)));
                directZNeg.target.position.copy(targetPos);
                directZNeg.name = "directZNeg";
                this._lights[index++] = directZNeg;
            }


            const BottomIntensity = SIDES_LIGHT_CONFIG.BottomIntensity;
            if (BottomIntensity) {
                const directBottom = new DirectionalLight(SIDES_LIGHT_CONFIG.BottomColor || color, BottomIntensity );
                directBottom.position.copy(new THREE.Vector3(center.x, -center.y * 5, center.z));
                directBottom.target.position.copy(targetPos);
                directBottom.name = "directBottom";
                this._lights[index++] = directBottom;
            }

            const TopIntensity = SIDES_LIGHT_CONFIG.TopIntensity;
            if (TopIntensity) {
                const directBottom = new DirectionalLight(SIDES_LIGHT_CONFIG.TopColor || color, TopIntensity );
                directBottom.position.copy(new THREE.Vector3(center.x, center.y * 5, center.z));
                directBottom.target.position.copy(targetPos);
                directBottom.name = "directTop";
                this._lights[index++] = directBottom;
            }

        }


    }
    changeAllIntensities = (intensity)=> {
        this._lights.forEach(item => {
            item.intensity = intensity;

        })
    }

    addLightProbe = (envTexture) => {
        if (LIGHTPROBE_CONFIG.useProbe) {

            if (this._lightProbe) {
                this._lightProbe.copy(LightProbeGenerator.fromCubeTexture(envTexture));


            }
            else {
                this._lightProbe = new THREE.LightProbe();
                this._scene.add(this._lightProbe);
                this._lightProbe.copy(LightProbeGenerator.fromCubeTexture(envTexture));
                this._lightProbe.intensity = LIGHTPROBE_CONFIG.intensity;
                this._lightProbe.name = LIGHTPROBE_CONFIG.name || "lightProbe-01"
                if (this._lightFolder) {
                    this._lightFolder.addLight(this._lightProbe.name, this._lightProbe);
                }
            }
        }

    }
}

export default LightFactory;


