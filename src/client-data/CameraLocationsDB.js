import {Euler, Vector3, Scene} from "three";

const FLOOR_NUMBER = {
    BOTTOM_FLOOR: 1,
    TOP_FLOOR: 2,
};
// Here we split by Artists Names
const CameraLocationsDB = [

    {
        cameraLocationId: 'W01T01',
        floorNumber: FLOOR_NUMBER.BOTTOM_FLOOR,
        locationName: 'Exhibition Profile',
        cameraPosition: new Vector3(-3.884, 1.434, 1.877), // use THREE.Vector3
        cameraRotation: new Euler(0, 0.0, 0),  //use THREE.Euler


    },
    {
        cameraLocationId: 'photo01',
        floorNumber: FLOOR_NUMBER.BOTTOM_FLOOR,
        locationName: 'photo01',
        cameraPosition: new Vector3(6.086, 1.488, 14.720),
        cameraRotation: new Euler(-0.010, 0.712, 0.006),
    },

    {
        cameraLocationId: 'photo02',
        floorNumber: FLOOR_NUMBER.BOTTOM_FLOOR,
        locationName: 'photo02',
        cameraPosition: new Vector3(5.160, 1.488, 1.091),
        cameraRotation: new Euler(-3.133, 0.560, 3.137 ),
    },

    {
        cameraLocationId: 'photo03',
        floorNumber: FLOOR_NUMBER.BOTTOM_FLOOR,
        locationName: 'photo03',
        cameraPosition: new Vector3(-7.954, 1.488, 1.068),
        cameraRotation: new Euler(-3.127, -1.040, -3.129),
    },

    {
        cameraLocationId: 'photo04',
        floorNumber: FLOOR_NUMBER.BOTTOM_FLOOR,
        locationName: 'photo04',
        cameraPosition: new Vector3(-7.707, 1.488, 14.755),
        cameraRotation: new Euler(-0.011, -0.826, -0.008),
    },

    {
        cameraLocationId: 'photo05',
        floorNumber: FLOOR_NUMBER.BOTTOM_FLOOR,
        locationName: 'photo05',
        cameraPosition: new Vector3(0.087, 1.488, 8.987),
        cameraRotation: new Euler(-3.131, -0.749, -3.135),
    },

    {
        cameraLocationId: 'photo06',
        floorNumber: FLOOR_NUMBER.BOTTOM_FLOOR,
        locationName: 'photo06',
        cameraPosition: new Vector3(-5.801, 1.488, 5.392),
        cameraRotation: new Euler(-0.740, 1.560, 0.740),
    },
    {

        cameraLocationId: 'photo07',
        floorNumber: FLOOR_NUMBER.BOTTOM_FLOOR,
        locationName: 'photo07',
        cameraPosition: new Vector3(-5.233, 1.488, 6.703),
        cameraRotation: new Euler(-0.013, 0.008, 0.000),
    },


];

export {CameraLocationsDB, FLOOR_NUMBER};
