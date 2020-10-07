//const THREE = window.THREE = require('three');
// const Stats = require('../lib/stats.min');
// const dat = require('dat.gui');
// const environments = require('../assets/environment/index');
// const createVignetteBackground = require('three-vignette-background');

//require('three/examples/js/loaders/GLTFLoader');
// require('three/examples/js/loaders/DRACOLoader');
// require('three/examples/js/loaders/DDSLoader');
//require('three/examples/js/controls/OrbitControls');
// require('three/examples/js/loaders/RGBELoader');
// require('three/examples/js/loaders/HDRCubeTextureLoader');
// require('three/examples/js/pmrem/PMREMGenerator');
//require('three/examples/js/pmrem/PMREMCubeUVPacker'); //laith -couldn't find it

// import * as THREE from 'three/build/three.module.js';
// import * as THREE from 'three/build/three.min';
import * as THREE from 'three';
//import {OrbitControls} from "../../three-libs/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module.js";
import * as dat from "three/examples/jsm/libs/dat.gui.module";
import {environments} from "../../environment"
//import { createBackground } from "../../lib/three-vignette"
import {GLTFLoader} from "../../three-libs/GLTFLoader"
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader"
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader"
// import {PMREMGenerator} from "three/src/extras/PMREMGenerator.js"
// import SpriteAnnotation from '../annotations/SpriteAnnotation'
//import AnnotationContainer from '../annotations/AnnotationContainer'
import {CANVAS_ID} from '../../client-data/GlobalConstants';
import {CSS3DRenderer} from "three/examples/jsm/renderers/CSS3DRenderer";
import ColliderContainer from "../colliders/ColliderContainer";
import {Euler, Vector3} from "three";
import {FLOOR_NUMBER} from "../../client-data/CameraLocationsDB";
import CameraLocationsDataController from "../zones/CameraLocationsDataController";
import {CameraLocationsDB}  from "../../client-data/CameraLocationsDB";
import LightFactory from "./light/LightFactory";
import init from '../three-dat-gui/';
import {CAMERA_LOCATION_OFFSET} from "../../client-data/clientOptions";
// import BackgroundImage from '../../images/KahnGallery_UrbanMemories_ExhibitionBackgroundImage.png'


window.THREE = THREE;
const DEFAULT_CAMERA = '[default]';

const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;


// glTF texture types. `envMap` is deliberately omitted, as it's used internally
// by the loader but not part of the glTF format.
const MAP_NAMES = [
    'map',
    'aoMap',
    'emissiveMap',
    'glossinessMap',
    'metalnessMap',
    'normalMap',
    'roughnessMap',
    'specularMap',
];

const Preset = {ASSET_GENERATOR: 'assetgenerator'};

class Viewer {

    _colliderContainer = null;
    initCameraOrient = {
        position: new Vector3(0,  0, 0),
        rotation: new Euler(0,0,0,'XYZ')
    };
    gltfScene = null;
    _mediaController = null;
    _cameraLocations = [];
    _LightFactory = null
    textureEncodingMeshes = [];

    constructor(el, useCss3Renderer,options,teleportEventReceiver) {

        this.teleportEventReceiver = teleportEventReceiver;
        if (options.initCameraOrient) {
            this.initCameraOrient = {
                ...options.initCameraOrient
            };
        }
        console.log("opthins=",options);
        this.el = el;
        this.options = options;

        this.lights = [];
        this.content = null;
        this.mixer = null;
        this.clips = [];
        this.gui = null;
        this.useCss3Renderer = useCss3Renderer || 'N';
        this.useGUI = options.useGUI || 'N';
        this.pmremGenerator = null;
        this.state = {

            environment: {

                colorMap: environments[options.envMap.colorMap || 0],
                backgroundMap: environments[options.envMap.backgroundMap || 0],
            },
            background: true,
            playbackSpeed: 1.0,
            actionStates: {},
            camera: DEFAULT_CAMERA,
            wireframe: false,
            skeleton: false,
            grid: false,
            physicallyCorrectLights: (this.options.physicallyCorrectLights || 'Y') === 'Y',
            gammaOutput: (this.options.gammaOutput || 'Y') === 'Y',
            gammaInput: (this.options.gammaInput || 'Y') === 'Y',
            usePaintingsIdForEncoding: (this.options.usePaintingsIdForEncoding || 'N') === 'Y',
            // Lights
            addLights: true,
            exposure: this.options.exposure || 0.51,
            textureEncoding:   this.options.textureEncoding || 'sRGB', //'Linear',
            paintingTextureEncoding:  this.options.paintingTextureEncoding || 'Linear', //'Linear', //'sRGB',
            allLightsIntensities:1,
            fov: this.options.fov || 0.8 * 180 / Math.PI,
            outputEncoding: (this.options.outputEncoding || 'sRGB') === 'sRGB' ? THREE.sRGBEncoding : THREE.LinearEncoding,
            envMapIntensity: options.hasOwnProperty("envMapIntensity") ? options.envMapIntensity : 1,

            bgColor1: '#ffffff',
            bgColor2: '#353535'
        };

        this._colliders = [];
        this._teleportPoints = [];
        this.prevTime = 0;

        this.stats = new Stats();
        this.stats.dom.height = '48px';
        [].forEach.call(this.stats.dom.children, (child) => (child.style.display = ''));

        window.scene = this.scene = new THREE.Scene();


        const fov = this.state.fov;
        const width =  el.clientWidth; //window.innerWidth;
        const height = el.clientHeight; //window.innerHeight;
        this.state.FOV = fov;
        this.defaultCamera = new THREE.PerspectiveCamera(fov, width / height, 0.01, 1000);
        console.log("Camera Aspect Ratio=",width/height);
        this.activeCamera = this.defaultCamera;
        this.scene.add(this.defaultCamera);

        this.renderer = window.renderer = new THREE.WebGLRenderer({antialias: true, alpha:true});
        const webglCanvas = this.renderer.domElement
        webglCanvas.style.top = '0px';
        webglCanvas.style.width = '100%';
        webglCanvas.style.height = '100%';
        this.renderer.physicallyCorrectLights = this.state.physicallyCorrectLights;
        this.renderer.outputEncoding = this.state.outputEncoding;
        /* this.renderer.gammaOutput = this.state.gammaOutput;
         this.renderer.gammaInput = this.state.gammaInput;*/

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(width, height);
        if (this.useCss3Renderer === 'Y') {
            this.css3Renderer = this.createCssRenderer(width, height);
            this.css3dScene = new THREE.Scene();

            webglCanvas.style.pointerEvents = 'none';
            el.appendChild(this.css3Renderer.domElement);
        }
        else {
            webglCanvas.id = CANVAS_ID;
            webglCanvas.style.position = 'absolute'
        }

        this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        this.pmremGenerator.compileEquirectangularShader();



        this.el.appendChild(this.renderer.domElement);

        this.cameraCtrl = null;
        this.cameraFolder = null;
        this.animFolder = null;
        this.animCtrls = [];
        this.morphFolder = null;
        this.morphCtrls = [];
        this.skeletonHelpers = [];
        this.gridHelper = null;
        this.axesHelper = null;

        this.addAxesHelper();
        if ( this.useGUI === 'Y' ) {
            init(dat);
            this.addGUI();
        }
        if (options.kiosk) this.gui.close();

        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
        window.addEventListener('resize', this.resize.bind(this), false);

        this.setJoystickUpdateLoop = this.setJoystickUpdateLoop.bind(this);
        this.joystickUpdateLoop = null;
        this.setFPSNavigation = this.setFPSNavigation.bind(this);
        this.FPSNavigation = null;
        this.savedCamera = null;
        this.restoreCamera = this.restoreCamera.bind(this);
        const geometry = new THREE.BoxGeometry(1, 1, 1);


        this.paintingMeshes = [];
        this.getSceneAndCamera = this.getSceneAndCamera.bind(this);
        this.addMedia = this.addMedia.bind(this);
        this.onLoadingProgress = this.onLoadingProgress.bind(this);

        this.onLoadProgress = null;

        this._LightFactory = new LightFactory(this.scene,this.useGUI === 'Y' ? this.gui : null);



    }

    get cameraLocations() {
        return this._cameraLocations;
    }

    populateCameraLocations = () => {
        console.log("populateCameraLocations begin")
        const newCameraLocations = [];
        this.cameraLocations.forEach((node) => {
            if (node.isMesh) {
                const wd1 = new THREE.Vector3();
                node.getWorldDirection(wd1);
                const cameraLocation = {
                    cameraLocationId: node.userData.cameraLocationId,
                    cameraPosition: node.position.clone().addScaledVector(node.getWorldDirection(wd1),CAMERA_LOCATION_OFFSET), // use THREE.Vector3
                    cameraRotation: node.rotation.clone(),  //use THREE.Euler
                };
                //cameraLocation.cameraPosition.z -= .5;
                //cameraLocation.cameraRotation.y = Math.PI;

                const res = CameraLocationsDataController.updateCameraLocationRecord(cameraLocation);
                newCameraLocations.push(res);
                /*const wd = new THREE.Vector3();
                node.getWorldDirection(wd);
                console.log("populateCameraLocations worldir=",wd);
                let vec = new Vector3();
                let vecUp = new Vector3(0,1,0);
                vec.setFromMatrixColumn( node.matrix, 0 );
                vec.crossVectors( vecUp, vec );
                console.log("populateCameraLocations xy-plane=",vec);
                console.log("node position==",node.position);
                console.log("populateCameraLocations:",res,cameraLocation);*/
                if (!res) {
                    console.log("Cannot  find cameraLocation:",cameraLocation.cameraLocationId);
                }
            }
        });
    }

    setCameraFOV =(fov) => {
        this.defaultCamera.fov = fov;
        this.defaultCamera.updateProjectionMatrix();

    }

    get colliderContianer() {
        return this._colliderContainer;
    }

    dispose = () => {

        this._colliders.length = 0;
        this._teleportPoints.length = 0;
        this.paintingMeshes.length = 0;
        this.textureEncodingMeshes.length = 0;
        if (this._mediaController) {
            this._mediaController.annotationContainer.dispose();
            this._mediaController.videoContainer.dispose();
        }
        if (this._colliderContainer) {
            this._colliderContainer.dispose()
        }

        console.log('dispose renderer!')

        this.content.traverse(object => {
            if (!object.isMesh) return

            console.log('dispose geometry!')
            object.geometry.dispose()

            if (object.material.isMaterial) {
                this.cleanMaterial(object.material)
            } else {
                // an array of materials
                for (const material of object.material) this.cleanMaterial(material)
            }
        })

    }

    cleanMaterial = material => {
        console.log('dispose material!')
        material.dispose()

        // dispose textures
        for (const key of Object.keys(material)) {
            const value = material[key]
            if (value && typeof value === 'object' && 'minFilter' in value) {
                console.log('dispose texture!')
                value.dispose()
            }
        }
    }

    get colliders() {
        return this._colliders;
    }

    get teleportPoints() {
        return this._teleportPoints;
    }

    addColliders = () => {
        this._colliderContainer = new ColliderContainer( this.content,this.defaultCamera ,this.colliders,this.teleportPoints, this.teleportEventReceiver);
    }

    resetColliders = ()=> {
        this._colliderContainer.resetScene(this.content);
        this._colliderContainer.init(this.colliders,this.teleportPoints);

    }

    saveCamera = () => {
        this.savedCamera = this.defaultCamera.clone();
    }

    setCameraOrient = (cameraOrient) => {
        this.defaultCamera.position.copy(cameraOrient.position);
        this.defaultCamera.rotation.copy(cameraOrient.rotation);
    }

    setInitCameraOrient = (cameraOrient) => {
        if (cameraOrient) {
            this.initCameraOrient = {
                ...cameraOrient
            };
        }
    }

    createCssRenderer(width, height) {

        let cssRenderer = new CSS3DRenderer();

        cssRenderer.setSize(width, height);

        const css3dElement = cssRenderer.domElement
        css3dElement.id = CANVAS_ID;
        css3dElement.style.position = 'absolute'
        return cssRenderer;
    }


    initialBackGround() {

    }

    addMedia(mediaController) {
        this._mediaController = mediaController;
        this.paintingMeshes.forEach(node => {
            mediaController.addMedia(node)
        });
        mediaController.addMediaWithNoParent();

    }

    getSceneAndCamera() {
        return {scene: this.scene, camera: this.defaultCamera, css3dScene:this.css3dScene};
    }

    restoreCamera() {
        this.defaultCamera.copy(this.savedCamera);
        this.state.FOV = this.defaultCamera.fov;
    }

    animate(time) {

        requestAnimationFrame(this.animate);

        const dt = (time - this.prevTime) / 1000;

        let isLockedByJoystick = false;

        if (this.joystickUpdateLoop) {
            isLockedByJoystick = this.joystickUpdateLoop(this.defaultCamera, dt,this._colliderContainer);
        }

        if (this.FPSNavigation) {
            this.FPSNavigation(this.defaultCamera, dt, !isLockedByJoystick,this._colliderContainer);
        }
        //this.controls.update();
        if ( this.useGUI === 'Y' ) {
            this.stats.update();
        }
        //todo remove mixer because not used
        this.mixer && this.mixer.update(dt);
        this.render();
        if (this.useCss3Renderer === 'Y') {
            this.css3Renderer.render(this.css3dScene, this.defaultCamera);
        }

        this.prevTime = time;

    }

    render() {

        this.renderer.render(this.scene, this.activeCamera);
        if (this.state.grid) {
            this.axesCamera.position.copy(this.defaultCamera.position)
            this.axesCamera.lookAt(this.axesScene.position)
            this.axesRenderer.render(this.axesScene, this.axesCamera);
        }

    }

    resize() {

        const {clientHeight, clientWidth} = this.el;

        this.defaultCamera.aspect = clientWidth / clientHeight;
        this.defaultCamera.updateProjectionMatrix();
        if (this.useCss3Renderer === 'Y') {
            this.css3Renderer.setSize(clientWidth, clientHeight);
        }
        this.renderer.setSize(clientWidth, clientHeight);

    }

    onLoadingProgress(url, itemsLoaded, itemsTotal) {
        if (this.onLoadProgress) {
            this.onLoadProgress(Math.round(itemsLoaded / itemsTotal * 100));
        }

    };

    load(url, rootPath) {

        const baseURL = THREE.LoaderUtils.extractUrlBase(url);

        // Load.
        return new Promise((resolve, reject) => {

            const manager = new THREE.LoadingManager();
            manager.onProgress = this.onLoadingProgress;

            // Intercept and override relative URLs.
            manager.setURLModifier((url, path) => {

                return (path || '') + url;

            });

            const loader = new GLTFLoader(manager);
            loader.setCrossOrigin('anonymous');

            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('lib/draco/');
            loader.setDRACOLoader(dracoLoader);

            const blobURLs = [];

            loader.load(url, (gltf) => {

                const scene = gltf.scene || gltf.scenes[0];
                const clips = gltf.animations || [];

                if (!scene) {
                    // Valid, but not supported by this viewer.
                    throw new Error(
                        'This model contains no scene, and cannot be viewed here. However,'
                        + ' it may contain individual 3D resources.'
                    );
                }
                this.gltfScene = scene;
                this.setContent(scene, clips);


                blobURLs.forEach(URL.revokeObjectURL);

                // See: https://github.com/google/draco/issues/349
                // THREE.DRACOLoader.releaseDecoderModule();
                const resolveObj = {
                    gltf: gltf,
                    scene: scene,
                    camera: this.defaultCamera,
                    css3dScene: this.css3dScene,
                    gltfScene:  this.gltfScene,
                };
                resolve(resolveObj);

            }, undefined, reject);

        });

    }

    /**
     * @param {THREE.Object3D} object
     * @param {Array<THREE.AnimationClip} clips
     */
    setContent(object, clips) {

        this.clear();

        const box = new THREE.Box3().setFromObject(object);
        const boxSize = box.getSize(new THREE.Vector3());
        const size = boxSize.length();
        const center = box.getCenter(new THREE.Vector3());
        const panOffset = 1.5;

        this.setCameraOrient(this.initCameraOrient);

        if ( this.useGUI === 'Y' ) {
            this.gui.addCamera('Camera',   this.defaultCamera);
        }

        this.defaultCamera.near = size / 1000;
        this.defaultCamera.far = size * 100;
        this.defaultCamera.updateProjectionMatrix();

        this.setCamera(DEFAULT_CAMERA);

        this.axesCamera.position.copy(this.defaultCamera.position)
        this.axesCamera.lookAt(this.axesScene.position)
        this.axesCamera.near = size / 100;
        this.axesCamera.far = size * 100;
        this.axesCamera.updateProjectionMatrix();
        this.axesCorner.scale.set(size, size, size);

        this.scene.add(object);
        this.content = object;


        this.printGraph(this.content);
        this.setClips(clips);
        this._LightFactory.createLights();
        this._LightFactory.generate6XSideLights(this.content);
        this._LightFactory.addToScene();


        this.updateLights();
        this.updateEnvironment();
        this.updateTextureEncoding();
        this.updateTextureEncodingForPaintings();
        this.updateDisplay();

        window.content = this.content;
        console.info('[glTF Viewer] THREE.Scene exported as `window.content`.');
    }

    printGraph(node) {

        if (node.userData.painting_id) {
            this.paintingMeshes.push(node);
            if (this.state.usePaintingsIdForEncoding) {
                this.textureEncodingMeshes.push(node);
            }
        }

        if (node.userData.collider) {
            this._colliders.push(node);
        }
        if (node.userData.teleportPoint) {
            this._teleportPoints.push(node);
        }

        if (node.userData.cameraLocationId) {
            this._cameraLocations.push(node);
        }

        if (node.userData.textureEncoding) {
            if (!this.state.usePaintingsIdForEncoding) {
                this.textureEncodingMeshes.push(node);
            }
        }

        node.children.forEach((child) => this.printGraph(child));

    }

    /**
     * @param {Array<THREE.AnimationClip} clips
     */
    setClips(clips) {
        if (this.mixer) {
            this.mixer.stopAllAction();
            this.mixer.uncacheRoot(this.mixer.getRoot());
            this.mixer = null;
        }

        this.clips = clips;
        if (!clips.length) return;

        this.mixer = new THREE.AnimationMixer(this.content);
    }

    playAllClips() {
        this.clips.forEach((clip) => {
            this.mixer.clipAction(clip).reset().play();
            this.state.actionStates[clip.name] = true;
        });
    }

    /**
     * @param {string} name
     */
    setCamera(name) {
        if (name === DEFAULT_CAMERA) {
            this.activeCamera = this.defaultCamera;
        } else {
            this.content.traverse((node) => {
                if (node.isCamera && node.name === name) {
                    this.activeCamera = node;
                }
            });
        }
    }

    updateTextureEncoding() {
        const encoding = this.state.textureEncoding === 'sRGB'
            ? THREE.sRGBEncoding
            : THREE.LinearEncoding;
        traverseMaterials(this.content, (material) => {
                if (material.map) material.map.encoding = encoding;
                if (material.emissiveMap) material.emissiveMap.encoding = encoding;
                if (material.hasOwnProperty("envMapIntensity")) material.envMapIntensity = this.state.envMapIntensity;
                if (material.map || material.emissiveMap || material.hasOwnProperty("envMapIntensity")) material.needsUpdate = true;
            },
            (node => {

                for (let ind = 0; ind < this.textureEncodingMeshes.length; ind++) {
                    if (node ===  this.textureEncodingMeshes[ind]) {
                        return false;
                    }
                }

                return true;
            }));
    }

    updateTextureEncodingForPaintings() {
        const encoding = this.state.paintingTextureEncoding === 'sRGB'
            ? THREE.sRGBEncoding
            : THREE.LinearEncoding;
        this.updateTextureEncodingFromArray(this.textureEncodingMeshes,encoding);
    }

    updateTextureEncodingFromArray(arr,encoding ) {
        traverseArrayOfMaterials(arr, (material) => {
            if (material.map) material.map.encoding = encoding;
            if (material.emissiveMap) material.emissiveMap.encoding = encoding;
            if (material.hasOwnProperty("envMapIntensity") ) material.envMapIntensity = this.state.envMapIntensity;
            if (material.map || material.emissiveMap || material.hasOwnProperty("envMapIntensity")) material.needsUpdate = true;
        })
    }

    updateLights() {
        const state = this.state;
        const lights = this.lights;

        if (state.addLights && !lights.length) {
            this.addLights();
        } else if (!state.addLights && lights.length) {
            this.removeLights();
        }
        this.renderer.toneMappingExposure = state.exposure;
    }

    addLights() {
    }

    removeLights() {

    }

    updateEnvironment() {

        const environments = this.state.environment;
        console.log("updateEnvironment environment=",environments);

        this.getSingleMap(environments.colorMap,true,(envMap) => {

            console.log("colormap=",envMap);
            this.scene.environment = envMap;
            if (environments.colorMap.id === environments.backgroundMap.id) {
                this.scene.background = envMap;
            } else {
                this.getSingleMap(environments.backgroundMap,false,(backMap) => {

                    this.scene.background = backMap;
                    console.log("backgroundmap=",backMap);
                });

            }
        } );




    }

    getSingleMap = (environment,env,callBack) => {
        if (environment.format === 'none') {
            callBack(null);
        } else if (environment.format === 'cubemap') {

            this.getCubeMapTexture(environment,env).then(({envMap}) => {
                callBack(envMap);
            });
        } else if (environment.format === 'hdr') {

            this.getCubeMapHDRI(environment,env).then(({envMap}) => {
                callBack(envMap);
            });
        }

    }

    getCubeMapTexture(environment,env) {
        if (!environment) return Promise.resolve({envMap: null});

        return new Promise((resolve, reject) => {
            const envMap = new THREE.CubeTextureLoader()
                .setPath( environment.path )
                // .setPath( "/assets/environment/canary_wharf/" )
                .load( environment.images,(texture => {if (env){this._LightFactory.addLightProbe(texture)}}),null,(err)=> {
                    console.log("CubeTextureLoader error",err)
                } );

            resolve({envMap});
        });
    }

    getCubeMapHDRI(environment,env) {
        // no envmap
        if (!environment) return Promise.resolve({envMap: null});

        return new Promise((resolve, reject) => {
            new RGBELoader()
                .setDataType(THREE.UnsignedByteType)
                .load(environment.path, (texture) => {
                    const envMap = this.pmremGenerator.fromEquirectangular(texture).texture;
                    this.pmremGenerator.dispose();

                    resolve({envMap});

                }, undefined, reject);

        });
    }

    updateDisplay() {
        if (this.skeletonHelpers.length) {
            this.skeletonHelpers.forEach((helper) => this.scene.remove(helper));
        }

        traverseMaterials(this.content, (material) => {
            material.wireframe = this.state.wireframe;
        });

        this.content.traverse((node) => {
            if (node.isMesh && node.skeleton && this.state.skeleton) {
                const helper = new THREE.SkeletonHelper(node.skeleton.bones[0].parent);
                helper.material.linewidth = 3;
                this.scene.add(helper);
                this.skeletonHelpers.push(helper);
            }
        });

        if (this.state.grid !== Boolean(this.gridHelper)) {
            if (this.state.grid) {
                this.gridHelper = new THREE.GridHelper();
                this.axesHelper = new THREE.AxesHelper();
                this.axesHelper.renderOrder = 999;
                this.axesHelper.onBeforeRender = (renderer) => renderer.clearDepth();
                this.scene.add(this.gridHelper);
                this.scene.add(this.axesHelper);
            } else {
                this.scene.remove(this.gridHelper);
                this.scene.remove(this.axesHelper);
                this.gridHelper = null;
                this.axesHelper = null;
            }
        }
    }

    updateBackground() {
    }

    /**
     * Adds AxesHelper.
     *
     * See: https://stackoverflow.com/q/16226693/1314762
     */
    addAxesHelper() {
        this.axesDiv = document.createElement('div');
        this.el.appendChild(this.axesDiv);
        this.axesDiv.classList.add('axes');

        const {clientWidth, clientHeight} = this.axesDiv;

        this.axesScene = new THREE.Scene();
        this.axesCamera = new THREE.PerspectiveCamera(50, clientWidth / clientHeight, 0.1, 10);
        this.axesScene.add(this.axesCamera);

        this.axesRenderer = new THREE.WebGLRenderer({alpha: true});
        this.axesRenderer.setPixelRatio(window.devicePixelRatio);
        this.axesRenderer.setSize(this.axesDiv.clientWidth, this.axesDiv.clientHeight);

        this.axesCamera.up = this.defaultCamera.up;

        this.axesCorner = new THREE.AxesHelper(5);
        this.axesScene.add(this.axesCorner);
        this.axesDiv.appendChild(this.axesRenderer.domElement);
    }

    addGUI() {

        const gui = this.gui = new dat.GUI({autoPlace: true, width: 260, hideable: true});

        // Display controls.
        const dispFolder = gui.addFolder('Display');
        const envBackgroundCtrl = dispFolder.add(this.state, 'background');
        envBackgroundCtrl.onChange(() => this.updateEnvironment());
        const wireframeCtrl = dispFolder.add(this.state, 'wireframe');
        wireframeCtrl.onChange(() => this.updateDisplay());
        const skeletonCtrl = dispFolder.add(this.state, 'skeleton');
        skeletonCtrl.onChange(() => this.updateDisplay());
        const gridCtrl = dispFolder.add(this.state, 'grid');
        gridCtrl.onChange(() => this.updateDisplay());

        const bgColor1Ctrl = dispFolder.addColor(this.state, 'bgColor1');
        const bgColor2Ctrl = dispFolder.addColor(this.state, 'bgColor2');
        bgColor1Ctrl.onChange(() => this.updateBackground());
        bgColor2Ctrl.onChange(() => this.updateBackground());

        // Lighting controls.
        const lightFolder = gui.addFolder('Lighting config');
        const encodingCtrl = lightFolder.add(this.state, 'textureEncoding', ['sRGB', 'Linear']);
        encodingCtrl.onChange(() => this.updateTextureEncoding());
        const paintingsEncodingCtrl = lightFolder.add(this.state, 'paintingTextureEncoding', ['sRGB', 'Linear']);
        paintingsEncodingCtrl.onChange(() => this.updateTextureEncodingForPaintings());
        lightFolder.add(this.renderer, 'outputEncoding', {sRGB: THREE.sRGBEncoding, Linear: THREE.LinearEncoding})
            .onChange(() => {
                this.renderer.outputEncoding = Number(this.renderer.outputEncoding);
                traverseMaterials(this.scene, (material) => {
                    material.needsUpdate = true;
                });
            });
        const envMapCtrl = lightFolder.add(this.state.environment.colorMap, "name", environments.map((env) => env.name));
        envMapCtrl.onChange((a) => {
            console.log("envMapCtrl.onChange",a);
            this.state.environment.colorMap = environments.find(item => item.name === a);
            this.updateEnvironment();
        });

        const backgMapCtrl = lightFolder.add(this.state.environment.backgroundMap, "name", environments.map((env) => env.name));
        backgMapCtrl.onChange((a) => {
            this.state.environment.backgroundMap = environments.find(item => item.name === a);
            this.updateEnvironment();
        });
        [
            lightFolder.add(this.state, 'exposure', 0, 2),

        ].forEach((ctrl) => ctrl.onChange(() => this.updateLights()));
        const physicallyCorrectLights = lightFolder.add(this.state,"physicallyCorrectLights");
        physicallyCorrectLights.onChange(()=> {
            this.renderer.physicallyCorrectLights = this.state.physicallyCorrectLights;
            this.updateTextureEncoding();
            this.updateTextureEncodingForPaintings();
        })
        const gammaOutput = lightFolder.add(this.state,"gammaOutput");
        gammaOutput.onChange(()=> { this.renderer.gammaOutput = this.state.gammaOutput});

        const gammaInput = lightFolder.add(this.state,"gammaInput");
        gammaInput.onChange(()=> { this.renderer.gammaInput = this.state.gammaInput});

        const allLightsIntensities = lightFolder.add(this.state,'allLightsIntensities',0,10);
        allLightsIntensities.onChange(() => {
            this._LightFactory.changeAllIntensities(this.state.allLightsIntensities);
        });
        const  envMapIntensity = lightFolder.add(this.state,'envMapIntensity',0,1);
        envMapIntensity.onChange(()=> {
            this.updateTextureEncoding();
            this.updateTextureEncodingForPaintings();
        })

        // Animation controls.
        this.animFolder = gui.addFolder('Animation');
        this.animFolder.domElement.style.display = 'none';
        const playbackSpeedCtrl = this.animFolder.add(this.state, 'playbackSpeed', 0, 1);
        playbackSpeedCtrl.onChange((speed) => {
            if (this.mixer) this.mixer.timeScale = speed;
        });
        this.animFolder.add({playAll: () => this.playAllClips()}, 'playAll');

        // Morph target controls.
        this.morphFolder = gui.addFolder('Morph Targets');
        this.morphFolder.domElement.style.display = 'none';

        // Camera controls.
        this.cameraFolder = gui.addFolder('Cameras');
        this.cameraFolder.domElement.style.display = 'none';

        // Stats.
        const perfFolder = gui.addFolder('Performance');
        const perfLi = document.createElement('li');
        this.stats.dom.style.position = 'static';
        perfLi.appendChild(this.stats.dom);
        perfLi.classList.add('gui-stats');
        perfFolder.__ul.appendChild(perfLi);
        let self = this;
        let resetCameraTest = {
            add: function () {
                //self.restoreCamera();
                let cameraPos = self.defaultCamera.position;
                let cameraRotY = self.defaultCamera.rotation;
                console.log("cameraPos=",cameraPos,cameraRotY);
            }
        };
        gui.add(resetCameraTest, "add").name("Reset Camera");


        gui.open();

    }

    updateGUI() {
        this.cameraFolder.domElement.style.display = 'none';

        this.morphCtrls.forEach((ctrl) => ctrl.remove());
        this.morphCtrls.length = 0;
        this.morphFolder.domElement.style.display = 'none';

        this.animCtrls.forEach((ctrl) => ctrl.remove());
        this.animCtrls.length = 0;
        this.animFolder.domElement.style.display = 'none';

        const cameraNames = [];
        const morphMeshes = [];
        this.content.traverse((node) => {
            if (node.isMesh && node.morphTargetInfluences) {
                morphMeshes.push(node);
            }
            if (node.isCamera) {
                node.name = node.name || `VIEWER__camera_${cameraNames.length + 1}`;
                cameraNames.push(node.name);
            }
        });

        if (cameraNames.length) {
            this.cameraFolder.domElement.style.display = '';
            if (this.cameraCtrl) this.cameraCtrl.remove();
            const cameraOptions = [DEFAULT_CAMERA].concat(cameraNames);
            this.cameraCtrl = this.cameraFolder.add(this.state, 'camera', cameraOptions);
            this.cameraCtrl.onChange((name) => this.setCamera(name));
        }

        if (morphMeshes.length) {
            this.morphFolder.domElement.style.display = '';
            morphMeshes.forEach((mesh) => {
                if (mesh.morphTargetInfluences.length) {
                    const nameCtrl = this.morphFolder.add({name: mesh.name || 'Untitled'}, 'name');
                    this.morphCtrls.push(nameCtrl);
                }
                for (let i = 0; i < mesh.morphTargetInfluences.length; i++) {
                    const ctrl = this.morphFolder.add(mesh.morphTargetInfluences, i, 0, 1, 0.01).listen();
                    Object.keys(mesh.morphTargetDictionary).forEach((key) => {
                        if (key && mesh.morphTargetDictionary[key] === i) ctrl.name(key);
                    });
                    this.morphCtrls.push(ctrl);
                }
            });
        }

        if (this.clips.length) {
            this.animFolder.domElement.style.display = '';
            const actionStates = this.state.actionStates = {};
            this.clips.forEach((clip, clipIndex) => {
                // Autoplay the first clip.
                let action;
                if (clipIndex === 0) {
                    actionStates[clip.name] = true;
                    action = this.mixer.clipAction(clip);
                    action.play();
                } else {
                    actionStates[clip.name] = false;
                }

                // Play other clips when enabled.
                const ctrl = this.animFolder.add(actionStates, clip.name).listen();
                ctrl.onChange((playAnimation) => {
                    action = action || this.mixer.clipAction(clip);
                    action.setEffectiveTimeScale(1);
                    playAnimation ? action.play() : action.stop();
                });
                this.animCtrls.push(ctrl);
            });
        }
    }

    clear() {
        this._colliders.length = 0;
        this._teleportPoints.length = 0;
        this.paintingMeshes.length = 0;
        this.textureEncodingMeshes.length = 0;
        if (this._mediaController) {
            this._mediaController.annotationContainer.dispose();
            this._mediaController.videoContainer.dispose();
        }
        if (this._colliderContainer) {
            this._colliderContainer.dispose()
        }

        if (!this.content) return;

        this.scene.remove(this.content);

        // dispose geometry
        this.content.traverse((node) => {

            if (!node.isMesh) return;

            node.geometry.dispose();

        });

        // dispose textures
        traverseMaterials(this.content, (material) => {

            MAP_NAMES.forEach((map) => {

                if (material[map]) material[map].dispose();

            });

        });

    }

    setJoystickUpdateLoop(call) {
        this.joystickUpdateLoop = call;
    }

    setFPSNavigation(call) {
        this.FPSNavigation = call;
    }

    dumpObject(obj, lines = [], isLast = true, prefix = '') {

        const localPrefix = isLast ? '└─' : '├─';
        lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]['x='${obj.position.x}]['y='${obj.position.y}]['z='${obj.position.z}] [obj=]${obj.toJSON()}`);
        const newPrefix = prefix + (isLast ? '  ' : '│ ');
        const lastNdx = obj.children.length - 1;
        obj.children.forEach((child, ndx) => {

            const isLast = ndx === lastNdx;
            this.dumpObject(child, lines, isLast, newPrefix);

        });
        return lines;

    }


};

function traverseMaterials(object, callback, ignoreNodesCallback = (node) => {return true}) {
    object.traverse((node) => {
        if (!node.isMesh) return;
        if (!ignoreNodesCallback(node)) {
            return;
        }
        const materials = Array.isArray(node.material)
            ? node.material
            : [node.material];
        materials.forEach(callback);
    });
}

function traverseArrayOfMaterials(arr, callback) {
    arr.forEach((node) => {
        if (!node.isMesh) return;
        const materials = Array.isArray(node.material)
            ? node.material
            : [node.material];
        materials.forEach(callback);
    })
}

export {Viewer};