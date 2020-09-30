import * as THREE from 'three';
import {isMobile} from "react-device-detect";

export const CANVAS_ID = 'main_rendering_id';

export const ANNOTATION_LAYER_CHANEL = 1;
export const VIDEO_LAYER_CHANEL = 2;
export const COLLIDER_LAYER_CHANEL = 3;
export const TELEPORTPOINT_LAYER_CHANEL = 4;
export const CSS3D_LAYER_CHANEL = 5;

export const ANNOTATION_LOCATION = {
    TOP_RIGHT: 1,
    CENTER_RIGHT: 2,
    BOTTOM_RIGHT: 3,
    BOTTOM_CENTER: 4,
    BOTTOM_LEFT: 5,
    CENTER_LEFT: 6,
    TOP_LEFT: 7,
    TOP_CENTER: 8
};



export const DEFAULT_ANNOTATION_POS = new THREE.Vector3();
export const ANNOTATION_PARENT = {
    PARENT_MESH:1, //3D Object
    PARENT_NONE:2
}

export const ANNOTATION_VIDEO_DISPLAY = {
    ANNOTATION_TEXT:1,
    ANNOTATION_VIDEO:2,
    VIDEO_STANDALONE:4,
    CSS3D_OBJECT:8,
    AUDIO_PLAYER:16,
}

export const MOBILE_TOOLTIP_TIMEOUT = 1500;

export const V21_ARTSPACE_WEBSITE = "https://v21artspace.com/";

export const thisIsMobile = isMobile;

export const VIDEO_PLAYING_MODE = {
    VIDEO_NOT_AUTO_PLAY:'N', //default video creation with buttons
    VIDEO_AUTO_PLAY_NO_BUTTONS:'Y', //used cgar e.g. 'Y' just for back compatibility
    VIDEO_AUTO_PLAY_WITH_BUTTONS:'B', //Auto play with buttons to pause and replay
}

