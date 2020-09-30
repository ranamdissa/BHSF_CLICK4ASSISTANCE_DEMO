import * as THREE from 'three';

class EnvironmentCube{
    constructor() {
    }


    static load = ()=> {
        let bgMesh;
        const loader = new THREE.TextureLoader();
        const texture = loader.load(
            //'https://threejsfundamentals.org/threejs/resources/images/equirectangularmaps/tears_of_steel_bridge_2k.jpg',
            process.env.PUBLIC_URL +'/assets/environment/tears_of_steel_bridge_2k.jpg'
        );
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;

        const shader = THREE.ShaderLib.equirect;
        const material = new THREE.ShaderMaterial({
            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            uniforms: shader.uniforms,
            depthWrite: false,
            side: THREE.BackSide,
        });
        material.uniforms.tEquirect.value = texture;

      /*  texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipMapLinearFilter;

        const shader = THREE.ShaderLib.equirect;
        const material = new THREE.ShaderMaterial({
            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            uniforms: shader.uniforms,
            depthWrite: false,
            side: THREE.BackSide,
        });
        material.uniforms.tEquirect.value = texture;
*/

        const plane = new THREE.BoxBufferGeometry(1, 1, 1);
        bgMesh = new THREE.Mesh(plane, material);
        // bgScene.add(bgMesh);
        return bgMesh;
    }

    static loadCube = ()=> {
        let bgMesh;

        const envMap = new THREE.CubeTextureLoader()
            .setPath( "/assets/environment/" )
            .load( [ 'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png' ],(texture)=> {
                console.log("loadCube texture=",texture);
            },null,(err)=> {
                console.log("CubeTextureLoader error",err)
            } );
       /* texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;*/

       /*const shader = THREE.ShaderLib.cube;
        const material = new THREE.ShaderMaterial({
            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            uniforms: shader.uniforms,
            depthWrite: false,
            side: THREE.BackSide,
        });

        Object.defineProperty( material, 'envMap', {

            get: function () {

                return this.uniforms.envMap.value;

            }

        } );

        material.uniforms.envMap.value = envMap;*/

        const material = new THREE.MeshBasicMaterial({side:THREE.BackSide});
        material.envMap = envMap;



        // const plane = new THREE.BoxBufferGeometry(999, 999, 999);
        const plane = new THREE.SphereGeometry(1, 20, 20);
        bgMesh = new THREE.Mesh(plane, material);
        // bgScene.add(bgMesh);

        return bgMesh;
    }
}

export default EnvironmentCube;


