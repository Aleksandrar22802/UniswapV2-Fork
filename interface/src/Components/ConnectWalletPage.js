import { useEffect, useRef } from "react";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function ConnectWalletPage() {
    const refContainer = useRef(null);

    var camera = null;
    var scene = null;
    var renderer = null;
    var controls = null;
    var bulbLight = null;
    var bulbMat = null;
    var hemiLight = null;
    var ballMat = null;
    var cubeMat = null;
    var floorMat = null;
    var previousShadowMap = false;

    const bulbLuminousPowers = {
        '110000 lm (1000W)': 110000,
        '3500 lm (300W)': 3500,
        '1700 lm (100W)': 1700,
        '800 lm (60W)': 800,
        '400 lm (40W)': 400,
        '180 lm (25W)': 180,
        '20 lm (4W)': 20,
        'Off': 0
    };

    const hemiLuminousIrradiances = {
        '0.0001 lx (Moonless Night)': 0.0001,
        '0.002 lx (Night Airglow)': 0.002,
        '0.5 lx (Full Moon)': 0.5,
        '3.4 lx (City Twilight)': 3.4,
        '50 lx (Living Room)': 50,
        '100 lx (Very Overcast)': 100,
        '350 lx (Office Room)': 350,
        '400 lx (Sunrise/Sunset)': 400,
        '1000 lx (Overcast)': 1000,
        '18000 lx (Daylight)': 18000,
        '50000 lx (Direct Sun)': 50000
    };

    const params = {
        shadows: true,
        exposure: 0.68,
        bulbPower: Object.keys( bulbLuminousPowers )[ 4 ],
        hemiIrradiance: Object.keys( hemiLuminousIrradiances )[ 0 ]
    };

    const onWindowResize = () => {
        if (camera == null || renderer == null) {
            return;
        }
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight - 100);
    }

    useEffect(() => {
        camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 100 );
        camera.position.x = - 4;
        camera.position.z = 4;
        camera.position.y = 2;

        scene = new THREE.Scene();

        const bulbGeometry = new THREE.SphereGeometry( 0.02, 16, 8 );
        bulbLight = new THREE.PointLight( 0xffee88, 1, 100, 2 );

        bulbMat = new THREE.MeshStandardMaterial( {
            emissive: 0xffffee,
            emissiveIntensity: 1,
            color: 0x000000
        } );
        bulbLight.add( new THREE.Mesh( bulbGeometry, bulbMat ) );
        bulbLight.position.set( 0, 2, 0 );
        bulbLight.castShadow = true;
        scene.add( bulbLight );

        hemiLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 0.02 );
        scene.add( hemiLight );

        floorMat = new THREE.MeshStandardMaterial( {
            roughness: 0.8,
            color: 0xffffff,
            metalness: 0.2,
            bumpScale: 1
        } );
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load( 'textures/hardwood2_diffuse.jpg', function ( map ) {
            map.wrapS = THREE.RepeatWrapping;
            map.wrapT = THREE.RepeatWrapping;
            map.anisotropy = 4;
            map.repeat.set( 10, 24 );
            map.colorSpace = THREE.SRGBColorSpace;
            floorMat.map = map;
            floorMat.needsUpdate = true;
        } );
        textureLoader.load( 'textures/hardwood2_bump.jpg', function ( map ) {
            map.wrapS = THREE.RepeatWrapping;
            map.wrapT = THREE.RepeatWrapping;
            map.anisotropy = 4;
            map.repeat.set( 10, 24 );
            floorMat.bumpMap = map;
            floorMat.needsUpdate = true;
        } );
        textureLoader.load( 'textures/hardwood2_roughness.jpg', function ( map ) {
            map.wrapS = THREE.RepeatWrapping;
            map.wrapT = THREE.RepeatWrapping;
            map.anisotropy = 4;
            map.repeat.set( 10, 24 );
            floorMat.roughnessMap = map;
            floorMat.needsUpdate = true;
        } );

        cubeMat = new THREE.MeshStandardMaterial( {
            roughness: 0.7,
            color: 0xffffff,
            bumpScale: 1,
            metalness: 0.2
        } );
        textureLoader.load( 'textures/brick_diffuse.jpg', function ( map ) {
            map.wrapS = THREE.RepeatWrapping;
            map.wrapT = THREE.RepeatWrapping;
            map.anisotropy = 4;
            map.repeat.set( 1, 1 );
            map.colorSpace = THREE.SRGBColorSpace;
            cubeMat.map = map;
            cubeMat.needsUpdate = true;
        } );
        textureLoader.load( 'textures/brick_bump.jpg', function ( map ) {
            map.wrapS = THREE.RepeatWrapping;
            map.wrapT = THREE.RepeatWrapping;
            map.anisotropy = 4;
            map.repeat.set( 1, 1 );
            cubeMat.bumpMap = map;
            cubeMat.needsUpdate = true;
        } );

        ballMat = new THREE.MeshStandardMaterial( {
            color: 0xffffff,
            roughness: 0.5,
            metalness: 1.0
        } );
        textureLoader.load( 'textures/planets/earth_atmos_2048.jpg', function ( map ) {
            map.anisotropy = 4;
            map.colorSpace = THREE.SRGBColorSpace;
            ballMat.map = map;
            ballMat.needsUpdate = true;
        } );
        textureLoader.load( 'textures/planets/earth_specular_2048.jpg', function ( map ) {
            map.anisotropy = 4;
            map.colorSpace = THREE.SRGBColorSpace;
            ballMat.metalnessMap = map;
            ballMat.needsUpdate = true;
        } );

        const floorGeometry = new THREE.PlaneGeometry( 20, 20 );
        const floorMesh = new THREE.Mesh( floorGeometry, floorMat );
        floorMesh.receiveShadow = true;
        floorMesh.rotation.x = - Math.PI / 2.0;
        scene.add( floorMesh );

        const ballGeometry = new THREE.SphereGeometry( 0.25, 32, 32 );
        const ballMesh = new THREE.Mesh( ballGeometry, ballMat );
        ballMesh.position.set( 1, 0.25, 1 );
        ballMesh.rotation.y = Math.PI;
        ballMesh.castShadow = true;
        scene.add( ballMesh );

        const boxGeometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
        const boxMesh = new THREE.Mesh( boxGeometry, cubeMat );
        boxMesh.position.set( - 0.5, 0.25, - 1 );
        boxMesh.castShadow = true;
        scene.add( boxMesh );

        const boxMesh2 = new THREE.Mesh( boxGeometry, cubeMat );
        boxMesh2.position.set( 0, 0.25, - 5 );
        boxMesh2.castShadow = true;
        scene.add( boxMesh2 );

        const boxMesh3 = new THREE.Mesh( boxGeometry, cubeMat );
        boxMesh3.position.set( 7, 0.25, 0 );
        boxMesh3.castShadow = true;
        scene.add( boxMesh3 );

        renderer = new THREE.WebGLRenderer({
            canvas: refContainer.current,
        });
        renderer.setSize(window.innerWidth, window.innerHeight - 100);
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.shadowMap.enabled = true;
        renderer.toneMapping = THREE.ReinhardToneMapping;

        controls = new OrbitControls( camera, renderer.domElement );
        controls.enableDamping = true;
        controls.minDistance = 0.1;
        controls.maxDistance = 50;

        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        var cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // camera.position.z = 5;
        var animate = function () {
            requestAnimationFrame(animate);

            renderer.toneMappingExposure = Math.pow( params.exposure, 5.0 ); // to allow for very bright scenes.
            renderer.shadowMap.enabled = params.shadows;
            bulbLight.castShadow = params.shadows;

            if ( params.shadows !== previousShadowMap ) {
                ballMat.needsUpdate = true;
                cubeMat.needsUpdate = true;
                floorMat.needsUpdate = true;
                previousShadowMap = params.shadows;
            }

            bulbLight.power = bulbLuminousPowers[ params.bulbPower ];
            bulbMat.emissiveIntensity = bulbLight.intensity / Math.pow( 0.02, 2.0 ); // convert from intensity to irradiance at bulb surface

            hemiLight.intensity = hemiLuminousIrradiances[ params.hemiIrradiance ];
            const time = Date.now() * 0.0005;

            bulbLight.position.y = Math.cos( time ) * 0.75 + 1.25;

            renderer.render( scene, camera );
        };

        animate();

        window.addEventListener( 'resize', onWindowResize );
    }, []);

    return (
        <div
            className="sub-page-connect"
        >
            <div className="nav-bar-title">
                <h1 className="navbar-logo">
                    My UniswapV2
                </h1>
            </div>
            <div
                className="desc-connect"
            >
                <span>
                    Welcome!, Please connect Metamask wallet.
                </span>
            </div>
            <canvas
                className="canvas-connect"
                ref={refContainer}
            >
            </canvas>
        </div>
    );
}

export default ConnectWalletPage;
