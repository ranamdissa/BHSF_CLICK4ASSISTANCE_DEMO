import * as THREE from "three";
import {CSS3DRenderer, CSS3DObject} from "three/examples/jsm/renderers/CSS3DRenderer";
import FPSNavigationControl from "../navigation/fps-navigation-control";
import {CANVAS_ID} from '../../client-data/GlobalConstants';

class CubeSampleCore {
    constructor(el, joystickLoopFuck) {
        this.div = null;

        this.scene = new THREE.Scene();
        this.css3dScene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, el.clientWidth / el.clientHeight, 0.1, 1000);
        this.css3Renderer = this.createCssRenderer(el.clientWidth, el.clientHeight);
        // this.renderer = new THREE.WebGLRenderer({alpha: true});
        this.renderer = this.createWebglRenderer(el.clientWidth, el.clientHeight) //new THREE.WebGLRenderer({alpha:true});
        this.renderer.setSize(el.clientWidth, el.clientHeight);
        // document.body.appendChild( renderer.domElement );
        // use ref as a mount point of the Three.js scene instead of the document.body
        el.appendChild(this.renderer.domElement);
        el.appendChild(this.css3Renderer.domElement);
        this.css3Renderer.domElement.appendChild(this.renderer.domElement);

        // let controls = new OrbitControls(this.camera, this.renderer.domElement);
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);

        let ambientLight = new THREE.AmbientLight(0x555555);
        this.scene.add(ambientLight);

        let directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(-.5, .5, -1.5).normalize();
        this.scene.add(directionalLight);

        this.camera.position.z = 10;
        this.camera.position.y = 1;
        this.camera.position.x = 0;

        // this.camera.position.set(200, 100, 2000);
        this.joystickLoopFuck = joystickLoopFuck;

        this.animate = this.animate.bind(this);

        this.fpsController = new FPSNavigationControl(document);


        this.create3dPage(
            100, 100,
            // new THREE.Vector3(0, 0, 240),
            new THREE.Vector3(-5, 5, -20),
            // new THREE.Vector3(0, 45 * Math.PI / 180, 0),
            new THREE.Vector3(0, 0, 0),
            'https://www.youtube.com/embed/Eq2ONmBX9yo');


        this.prevTime = 0;
        this.nowTime = 0;


        requestAnimationFrame(this.animate);
    }


    createCssRenderer(width, height) {

        let cssRenderer = new CSS3DRenderer();

        cssRenderer.setSize(width, height);

        const css3dElement = cssRenderer.domElement
        css3dElement.id = CANVAS_ID;
        css3dElement.style.position = 'absolute'
        css3dElement.style.top = '0px'
        css3dElement.style.width = '100%'
        css3dElement.style.height = '100%'

        /*cssRenderer.domElement.style.position = 'absolute';
        glRenderer.domElement.style.zIndex = 0;
        cssRenderer.domElement.style.top = 0;*/

        return cssRenderer;
    }

    createWebglRenderer(width, height) {

        const webGlrenderer = new THREE.WebGLRenderer({alpha: true});
        const webglCanvas = webGlrenderer.domElement
        webglCanvas.id = 'ThreeWebgl'
        webglCanvas.style.position = 'absolute'
        webglCanvas.style.top = '0px'
        webglCanvas.style.width = '100%'
        webglCanvas.style.height = '100%'
        webglCanvas.style.pointerEvents = 'none'

        webGlrenderer.setSize(width, height);

        return webGlrenderer;
    }


    createPlane(w, h, position, rotation) {

        const material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            opacity: 0.0,
            side: THREE.DoubleSide
        });

        const geometry = new THREE.PlaneGeometry(w, h);

        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.x = position.x;
        mesh.position.y = position.y;
        mesh.position.z = position.z;

        mesh.rotation.x = rotation.x;
        mesh.rotation.y = rotation.y;
        mesh.rotation.z = rotation.z;

        return mesh;
    }

    createCssObject(w, h, position, rotation, url) {

        const html = [

            '<div  style="width:' + w + 'px; height:' + h + 'px;">',
            '<iframe src="' + url + '" width="' + w + '" height="' + h + '">',
            '</iframe>',
            '</div>'

        ].join('\n');
        const imageUrl = process.env.PUBLIC_URL + "/images/01_PreloadBackground.png";
        const headText = 'Sara Mohr-Pietsch with an adventurous';
        const bodyText = `This text is the content of the box. We have added a 50px padding, 20px margin and a 15px green border. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
        const moreText = 'Some more text';

        // const html1 = `<div style="background-color: #cfc ; padding: 10px; border: 1px solid green; width:${w}px; height: ${h}px;">Hello, Laith, this is annotation test</div>>`;
        const html1 = `<div class="embedded-annotation" style="padding: 10px; border: 1px solid green; width:${w}px; height: ${h}px;">Hello, Laith, this is annotation test</div>>`;

        const html2 = `<div class="css3d-annotaion-container">
    <div id="css3dTextAnnotation" class="css3d-annotaion-sub-container">
        <div class="css3d-media-container">
            <div class="css3d-media-sub"><img src=${imageUrl} height="100%" width="100%"></div>
        </div>
        <div class="css3d-text-container">
            <div class="css3d-text-sub">
                <h1 class="css3d-text-head">${headText}</h1>
                <h2 class="text-left css3d-text-body">${bodyText}</h2>
            </div>
        </div>
        <div class="css3d-more-container">
            <div class="css3d-more-sub">
                <h1 class="text-center">${moreText}</h1>
            </div>
        </div>
    </div>
</div>`


        const div = document.createElement('div');
        this.div = div;

        //$(div).html(html);
        div.innerHTML = html2;


        /*  div.style.width = '100px';
          div.style.height = '100px';
          div.style.backgroundColor = '#000';
          div.style.opacity = '.5';

          const iframe = document.createElement('iframe');
          iframe.style.width = '100px';
          iframe.style.height = '100px';
          iframe.style.border = '0px';
          iframe.src = `https://www.youtube.com/embed/Eq2ONmBX9yo`
          div.appendChild(iframe)*/
        ;

        const cssObject = new CSS3DObject(div);

        /*cssObject.position.x = position.x;
        cssObject.position.y = position.y;
        cssObject.position.z = position.z;*/

        cssObject.position.x = 0;
        cssObject.position.y = 0;
        cssObject.position.z = 0;

        cssObject.rotation.x = rotation.x;
        cssObject.rotation.y = rotation.y;
        cssObject.rotation.z = rotation.z;

        cssObject.scale.set(.01, .01, .01);


        let group = new THREE.Group();
        group.position.x = position.x;
        group.position.y = position.y;
        group.position.z = position.z;

        // this.div = cssObject;
        group.add(cssObject);

        return group;
    }


    create3dPage(w, h, position, rotation, url) {

        /* const plane = this.createPlane(
             w, h,
             position,
             rotation);

         this.scene.add(plane);*/

        const cssObject = this.createCssObject(
            w, h,
            position,
            rotation,
            url);

        //  this.div = cssObject;
        this.css3dScene.add(cssObject);
    }


    animate(time) {

        requestAnimationFrame(this.animate);

        let dt = (time - this.prevTime);
        this.nowTime += dt;

        //console.log("ThreeCubeSample dt=",dt)
        /* if (this.nowTime > 10000 && this.nowTime < 10020 ) {
             this.div.style.display = 'none';
             //this.nowTime = 0;
             console.log("time passed 10 sec",dt,this.nowTime);

         }

         if (this.nowTime > 20000  && this.nowTime < 20020) {
             this.div.style.display = 'block';
             //this.nowTime = 0;
             console.log("time passed 20 sec",dt,this.nowTime);

         }*/

        let isLockedByJoystick = false;
        if (this.joystickLoopFuck) {
            isLockedByJoystick = this.joystickLoopFuck(this.camera, dt / 1000);
        }

        this.fpsController.update(this.camera, dt / 1000, true);
        // this.cube.rotation.x += 0.01;
        // this.cube.rotation.y += 0.01;
        //console.log("rotation=",this.cube.matrix);
        this.renderer.render(this.scene, this.camera);

        this.css3Renderer.render(this.css3dScene, this.camera);
        this.prevTime = time;
    }
}

export default CubeSampleCore;
