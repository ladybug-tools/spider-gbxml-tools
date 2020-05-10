/* global THREE, THR, GBX, Stats, rngOpacity, outOpacity */
// jshint esversion: 6
// jshint loopfunc: true

"use strict";

var THRU = {

	copyright: "Copyright 2019 Ladybug Tools authors. MIT License",
	date: "2019-10-18",
	description: "Three.js utilities",
	helpFile: "../core-thr-three/thru-threejs-utilities.md",
	license: "MIT License",
	version: "0.17.07-0thru"

};



THRU.init = function ( radius = 50 ) {

	// called from main html / assumes three.js is loaded

	THRU.radius = radius;

	THRU.addSomeLights2();

	// Do the following after the model is loaded

	//THRU.toggleAxesHelper();
	//THRU.toggleGroundHelper();
	//THRU.toggleEdges();
	//THRU.toggleBoundingBoxHelper();

	window.addEventListener( "keyup", THRU.onSetRotate , false );
	THR.renderer.domElement.addEventListener( "click", THRU.onSetRotate, false );
	THR.renderer.domElement.addEventListener( "touchstart", THRU.onSetRotate, false );

};



THRU.onSetRotate = function() {

	THR.controls.autoRotate = false;

	window.removeEventListener( "keyup", THRU.onSetRotate );
	THR.renderer.domElement.removeEventListener( "click", THRU.onSetRotate );
	THR.renderer.domElement.removeEventListener( "touchstart", THRU.onSetRotate );

};



////////// Scene

THRU.setSceneDispose = function( objArr = [] ) {
	// console.log( "THR.scene", THR.scene );

	THR.scene.traverse( child => {

		if ( child.isMesh || child.isLine || child.isSprite ) {

			child.geometry.dispose();
			child.material.dispose();

		}

	} );

	objArr = Array.isArray( objArr ) ? objArr : [ objArr ];

	THR.scene.remove( ...objArr );

	objArr.forEach( obj => obj = undefined );

	//THR.scene.dispose();

	// for testing
	//divRendererInfo.innerHTML = THRU.getRendererInfo();

};



////////// Camera and Controls

THRU.zoomObjectBoundingSphere = function( obj = GBX.meshGroup ) {
	//console.log( "obj", obj );

	const bbox = new THREE.Box3().setFromObject( obj );
	//console.log( "bbox", bbox )

	if ( bbox.isEmpty() === true ) { return; }

	const sphere = bbox.getBoundingSphere( new THREE.Sphere() );
	THRU.center = sphere.center;
	THRU.radius = sphere.radius;

	THR.controls.target.copy( THRU.center ); // needed because model may be far from origin
	THR.controls.maxDistance = 5 * THRU.radius;

	THR.camera.position.copy( THRU.center.clone().add( new THREE.Vector3( 1.5 * THRU.radius, 1.5 * THRU.radius, 1.5 * THRU.radius ) ) );
	THR.camera.near = 0.001 * THRU.radius; //2 * camera.position.length();
	THR.camera.far = 10 * THRU.radius; //2 * camera.position.length();
	THR.camera.updateProjectionMatrix();

	if ( THRU.lightDirectional ) {

		THRU.lightDirectional.position.copy( THRU.center.clone().add( new THREE.Vector3( 1.5 * THRU.radius, -1.5 * THRU.radius, 1.5 * THRU.radius ) ) );
		THRU.lightDirectional.shadow.camera.scale.set( 0.2 * THRU.radius, 0.2 * THRU.radius, 0.01 * THRU.radius );

		THRU.targetObject.position.copy( THRU.center );

		//THR.scene.remove( THRU.cameraHelper );
		//THRU.cameraHelper = new THREE.CameraHelper( THRU.lightDirectional.shadow.camera );
		//THR.scene.add( THRU.cameraHelper );

	}

};



////////// Visibility

THRU.getMeshesVisible = function ( objThree = THR.scene ) { // used by??
	//console.log( "", objThree );

	THRU.meshGroupVisible = new THREE.Object3D();

	const arr = objThree.children.filter( mesh => mesh.visible ).map ( mesh => mesh.clone() );
	THRU.meshGroupVisible.add( ...arr );

	//console.log( "THRU.meshGroupVisible", THRU.meshGroupVisible );

	return THRU.meshGroupVisible;

};




THRU.toggleMeshesVisible = function( obj = THR.scene ) {

	obj.traverse( function ( child ) {

		if ( child instanceof THREE.Mesh ) {

			child.visible = !child.visible;

		}

	} );

};



THRU.toggleWireframe = function( obj = THR.scene ) {

	obj.traverse( function ( child ) {

		if ( child instanceof THREE.Mesh ) {

			child.material.wireframe = !child.material.wireframe;

		}

	} );

};



////////// Material handling

THRU.setObjectOpacity = function( obj = THR.scene, range = rngOpacity ) {

	const opacity = parseInt( range.value, 10 );
	outOpacity.value = opacity + "%";

	obj.traverse( function ( child ) {

		if ( child instanceof THREE.Mesh ) {

			child.material.opacity = opacity / 100;

		}

	} );

};


////////// Lights


THRU.addSomeLights = function() {

	THR.renderer.shadowMap.enabled = true;
	THR.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	THRU.lightAmbient = new THREE.AmbientLight( 0x888888 );
	THRU.lightAmbient.name = "lightAmbient";
	THR.scene.add( THRU.lightAmbient );

	THRU.light1 = new THREE.DirectionalLight( 0xffffff, 0.75 );
	THRU.light1.position.set( 1, 1, 1 ).normalize();
	THRU.light1.castShadow = true;
	THR.scene.add( THRU.light1 );

	THRU.light2 = new THREE.DirectionalLight( 0xffffff, 0.5 );
	THRU.light2.position.set( 0, 0, -1 ).normalize();
	THR.scene.add( THRU.light2 );

};



THRU.addSomeLights2 = function() {

	THR.renderer.shadowMap.enabled = true;
	THR.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	THRU.lightAmbient = new THREE.AmbientLight( 0x444444 );
	THRU.lightAmbient.name = "lightAmbient";
	THR.scene.add( THRU.lightAmbient );

	THRU.lightDirectional = new THREE.DirectionalLight( 0xffffff, 1 );
	THRU.lightDirectional.shadow.mapSize.width = 2048;  // default 512
	THRU.lightDirectional.shadow.mapSize.height = 2048;
	THRU.lightDirectional.castShadow = true;
	THR.scene.add( THRU.lightDirectional );

	THRU.targetObject = new THREE.Object3D();
	THR.scene.add( THRU.targetObject );

	THRU.lightDirectional.target = THRU.targetObject;

	const position = new THREE.Vector3( 0, 0, 1 );
	THRU.lightPoint = ( new THREE.PointLight( 0xffffff, 0.5, { position } ) );

	THR.camera.add( THRU.lightPoint );
	THR.scene.add( THR.camera );

};


////////// Info / move to a view menu??

THRU.getRendererInfo = function() {
	//console.log( "THR.renderer.info", THR.renderer.info );

	const htm =
	`
		<p>
			<b>memory</b><br>
			geometries: ${ THR.renderer.info.memory.geometries.toLocaleString() }
		</p>
		<p>
			<b>renderer</b><br>
			triangles: ${ THR.renderer.info.render.triangles.toLocaleString() } <br>
			lines: ${ THR.renderer.info.render.lines.toLocaleString() } <br>
		</p>
		<p>
			<button onclick=divRendererInfo.innerHTML=THRU.getRendererInfo(); >update info</button>

			<a href="https://threejs.org/docs/#api/en/renderers/WebGLRenderer.info" target="_blank">?</a>

			<button onclick=THRU.setStats(); >stats</button>

			<a href="https://github.com/mrdoob/stats.js/" target="_blank">?</a>

		</p>
	`;

	return htm;

};



THRU.setStats = function() {

	const script = document.createElement("script");

	script.onload = function() {

		const stats = new Stats();

		document.body.appendChild( stats.dom );

		requestAnimationFrame( function loop() {

			stats.update();

			requestAnimationFrame( loop );

		} );

	};

	script.src = "https://cdn.jsdelivr.net/gh/mrdoob/stats.js@master/build/stats.min.js";

	document.head.appendChild( script );

};
