import {Euler, Vector3, Scene, SpotLight, PointLight, DirectionalLight, AmbientLight, Color} from "three";
import {thisIsMobile} from "./GlobalConstants";


export const LIGHTPROBE_CONFIG = {
    useProbe:true, //only used if Cubemap is available
    intensity:0.2,
    name:'lightprobe-01'
};
//6 sides  direct light around the object. 0 intensity will disable the light
export const SIDES_LIGHT_CONFIG = {

    generateSidesLights:true,
    XPosIntensity:2.7, // set to zero to be ignored
    XPosColor:new Color(0xFFFFFF),
    XNegIntensity:2.7,
    XNegColor:new Color(0xFFFFFF),
    ZPosIntensity:2.7,
    ZPosColor:new Color(0xFFFFFF),
    ZNegIntensity:2.7,
    ZNegColor:new Color(0xFFFFFF),
    BottomIntensity:2.7,
    BottomColor:new Color(0xFFFFFF),
    TopIntensity:2.7,
    TopColor:new Color(0xFFFFFF),

    unifiedColor: new Color(0xFFFFFF), //if above individual color not specified then set color of light to this
}

export const LIGHTS = [

    {
        name: 'Ambient',
        light: new AmbientLight(),
        color: new Color(0xFFFFFF),
        intensity:4.5,

    },
   /* {
        name: 'PointLightCenter',
        light: new PointLight(),
        position: new Vector3(-2, 3.5, 7.6),
        color: new Color(0xffffff),
        intensity: 10,
        decay: .65,
        distance: 15,
    }*/
    /*  {
          name: 'Direct-1',
          light: new DirectionalLight(),
          position: new Vector3(5.4, 10, 24.8),
          target: new Vector3(-2, 2.3, 7.6),
          color: new Color(0xffffff),
          intensity: 0.8 * Math.PI,

      },
      {
          name: 'Direct-2',
          light: new DirectionalLight(),
          position: new Vector3(5.4, 10, -28.6),
          target: new Vector3(-2, 2.3, 7.6),
          color: new Color(0xffffff),
          intensity: 0.8 * Math.PI,

      },
      {
          name: 'Direct-3',
          light: new DirectionalLight(),
          position: new Vector3(-27.76, 10, -6.7),
          target: new Vector3(-2, 2.3, 7.6),
          color: new Color(0xffffff),
          intensity: 0.8 * Math.PI,

      },
      {
          name: 'Direct-4',
          light: new DirectionalLight(),
          position: new Vector3(27.76, 10, -4),
          target: new Vector3(-2, 2.3, 7.6),
          color: new Color(0xffffff),
          intensity: 0.8 * Math.PI,

      },
      {
          name: 'PointLightCenter',
          light: new PointLight(),
          position: new Vector3(-2, 2.3, 7.6),
          color: new Color(0xffffff),
          intensity: 10,
          decay: .65,
          distance: 15,
      },*/
]




