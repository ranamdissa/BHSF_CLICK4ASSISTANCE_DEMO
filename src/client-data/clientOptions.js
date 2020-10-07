import * as THREE from "three";
import {Euler, Vector3} from "three";
import {ANNOTATION_LOCATION} from "./GlobalConstants";

export  const clientOptions = {
    useGUI: 'N',
    initCameraOrient: {
        position: new Vector3(7.368, -1, .348),
        rotation: new Euler(0, 1.449, 0, 'XYZ')
    },
    gammaOutput: 'N', //ignore for now
    gammaInput: 'Y', //ignore for now
    usePaintingsIdForEncoding: 'Y', //if 'Y', then apply  paintingTextureEncoding setting to each painting tagged with painting_id
    exposure: 0.51,
    textureEncoding: 'sRGB',  //'Linear', //'sRGB',
    paintingTextureEncoding: 'sRGB', //'Linear', //'sRGB',
    physicallyCorrectLights: 'Y', //if not presented in the Viewer.js then must be set to 'Y'
    fov: 40, //Camera field of view
    outputEncoding: 'sRGB', //'Linear' or 'sRGB',
    envMapIntensity: 1, // if envMap is not used (colorMap = 0) then this property has nos no effect
    envMap: {
        colorMap: 1, //envmap for light. Can be Cubemap or HDR - get it from the index of the array in /environment/index.js
        backgroundMap: 1, //envmap for background image. Can be Cubemap or HDR - get it from the index of the array in /environment/index.js
    },
    // modelName:'BSH_mainBuilding_024.glb',
    modelName:'BSH_mainBuilding_037.glb',
    // modelName:'MichaelHill02.glb',
};

export const DEFAULT_ANNOTATION_LOCATION = ANNOTATION_LOCATION.CENTER_RIGHT; // can be one of ANNOTATION_LOCATION. Default is TOP_LEFT

export const DEFAULT_ANNOTATION_LOCATION_VERT_OFFSET = 0 // in meters. vertical offset. default is 0.0

export const DEFAULT_ANNOTATION_LOCATION_HORIZ_OFFSET = .1 // in meters. Horizontal offset. default is 0.0

export const DEFAULT_ANNOTATION_LOCATION_Z_OFFSET = 0.1 // in meters. Z offset. default is 0.1

//Rana comments: this decides the size of the annotation buttons in 3D world. Don't change the z-axes
export const DEFAULT_ANNOTATION_SCALE = new THREE.Vector3(.075, .075, 1);// export const DEFAULT_SPRITE_IMAGE_URL = '/assets/sprites/AnnotationsI.svg'

export const DEFAULT_SPRITE_IMAGE_URL = '/assets/sprites/AnnotationsI_orange.svg'
export const SPRITE_TONEMAPPED = false; //will effect the custom sprite defined in AnnotationDB
export const SPRITE_COLOR = 0x999999;//0x999999; // RGB color - will effect the custom sprite defined in AnnotationDB
export const SPRITE_TEXTURE_ENCODING = THREE.LinearEncoding; //THREE.LinearEncoding;   //will effect the custom sprite defined in AnnotationDB

export const CAMERA_LOCATION_OFFSET = 4.5; //how far camera will offset when using camera hoping

export const ZONE_LINKS_LABEL = 'Teleport';
export const TELEPORTPOINT_DISTANCE_RATIO = 0.5;
export const COLLIDER_DISTANCE_RATIO = 0.5;

export const DISPLAY_ZONE_LINK = true; //show hoping icon in the menu

export const DEFAULT_VIDEO_PLAY_SPRITE_IMAGE_URL = '/assets/sprites/videoPlayButtonBlack.svg';
export const  DEFAULT_VIDEO_PAUSE_SPRITE_IMAGE_URL = '/assets/sprites/videoPauseButtonBlack.svg';
export const VIDEO_SPRITE_TONEMAPPED = false; //will effect the custom sprite defined in AnnotationDB
export const VIDEO_SPRITE_COLOR = 0xaaaaaa;//0x999999; // RGB color - will effect the custom sprite defined in AnnotationDB
export const VIDEO_SPRITE_TEXTURE_ENCODING = THREE.LinearEncoding; //THREE.LinearEncoding;   //will effect the custom sprite defined in AnnotationDB

export const DEFAULT_VIDEO_ANNOTATION_LOCATION = ANNOTATION_LOCATION.BOTTOM_CENTER; // can be one of ANNOTATION_LOCATION. Default is TOP_LEFT

export const DEFAULT_VIDEO_ANNOTATION_LOCATION_VERT_OFFSET = .15 // in meters. vertical offset. default is 0.0

export const DEFAULT_VIDEO_ANNOTATION_LOCATION_HORIZ_OFFSET = 0 // in meters. Horizontal offset. default is 0.0

export const DEFAULT_VIDEO_ANNOTATION_LOCATION_Z_OFFSET = 0.1 // in meters. Z offset. default is 0.1

//Rana comments: this decides the size of the annotation buttons in 3D world. Don't change the z-axes
export const DEFAULT_VIDEO_ANNOTATION_SCALE = new THREE.Vector3(.15, .15, 1);// export const DEFAULT_SPRITE_IMAGE_URL = '/assets/sprites/AnnotationsI.svg'


export const DEFAULT_AUDIO_PLAY_SPRITE_IMAGE_URL = '/assets/sprites/SoundIconYellow.svg';
export const  DEFAULT_AUDIO_PAUSE_SPRITE_IMAGE_URL = '/assets/sprites/videoPauseButton.svg';

export const DEFAULT_AUDIO_ANNOTATION_LOCATION = ANNOTATION_LOCATION.CENTER; // can be one of ANNOTATION_LOCATION. Default is TOP_LEFT

export const DEFAULT_AUDIO_ANNOTATION_LOCATION_VERT_OFFSET = 0 // in meters. vertical offset. default is 0.0

export const DEFAULT_AUDIO_ANNOTATION_LOCATION_HORIZ_OFFSET = 0 // in meters. Horizontal offset. default is 0.0

export const DEFAULT_AUDIO_ANNOTATION_LOCATION_Z_OFFSET = 0.25 // in meters. Z offset. default is 0.1

//Rana comments: this decides the size of the annotation buttons in 3D world. Don't change the z-axes
export const DEFAULT_AUDIO_ANNOTATION_SCALE = new THREE.Vector3(.15, .15, 1);// export const DEFAULT_SPRITE_IMAGE_URL = '/assets/sprites/AnnotationsI.svg'
