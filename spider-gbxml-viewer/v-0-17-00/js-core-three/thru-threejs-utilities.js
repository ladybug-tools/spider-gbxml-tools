/* global THREE, THR, Stats, rngOpacity, outOpacity */
// jshint esversion: 6
// jshint loopfunc: true


let THRU = {

	copyright: "Copyright 2019 Ladybug Tools authors. MIT License",
	date: "2019-07-15",
	description: "Three.js Utilities: all this is a bit idiosyncratic / a random collection of stuff",
	helpFile: "../js-core/thru-threejs-utilities.md",
	license: "MIT License",
	urlSourceCode: "https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/spider-gbxml-viewer/v-0-17-00/js-core",
	version: "0.17.00-4thru"

};



THRU.init= function( radius = 50 ) {

	//console.log( '', THRU );

	// called from main html / assumes three.js is loaded

	THRU.radius = radius;

	//THRU.toggleAxesHelper();

	//THRU.toggleGroundHelper();

	//THRU.toggleEdges();

	THRU.addSomeLights2();

	window.addEventListener( 'keyup', THRU.onSetRotate , false );
	THR.renderer.domElement.addEventListener( 'click', THRU.onSetRotate, false );
	THR.renderer.domElement.addEventListener( 'touchstart', THRU.onSetRotate, false );

};



THRU.onSetRotate = function() {

	THR.controls.autoRotate = false;

	window.removeEventListener( 'keyup', THRU.onSetRotate );
	THR.renderer.domElement.removeEventListener( 'click', THRU.onSetRotate );
	THR.renderer.domElement.removeEventListener( 'touchstart', THRU.onSetRotate );

};



////////// Scene

THRU.setSceneDispose = function( objArr = [] ) {
	// console.log( 'THR.scene', THR.scene );

	THR.scene.traverse( child => {

		if ( child.isMesh || child.isLine || child.isSprite ) {

			child.geometry.dispose();
			child.material.dispose();

		}

	} );

	objArr = Array.isArray( objArr ) ? objArr : [ objArr ];

	THR.scene.remove( ...objArr );

	objArr.forEach( obj => obj = undefined );

	//divRendererInfo.innerHTML = THRU.getRendererInfo();

};



////////// Info / move to a view menu??


THRU.getRendererInfo = function() {
	//console.log( 'THR.renderer.info', THR.renderer.info );

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

	const script = document.createElement('script');

	script.onload = function() {

		const stats = new Stats();

		document.body.appendChild( stats.dom );

		requestAnimationFrame( function loop() {

			stats.update();

			requestAnimationFrame( loop );

		} );

	};

	script.src = 'https://rawgit.com/mrdoob/stats.js/master/build/stats.min.js';

	document.head.appendChild( script );

};



////////// Camera and Controls

THRU.zoomObjectBoundingSphere = function( obj = THR.scene ) {
	//console.log( 'obj', obj );

	const bbox = new THREE.Box3().setFromObject( obj );
	// console.log( 'bbox', bbox )

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


THRU.getMeshesVisible = function ( objThree = THR.scene ) { // not??
	//console.log( '', objThree );

	THRU.meshGroupVisible = new THREE.Object3D();

	const arr = objThree.children.filter( mesh => mesh.visible ).map ( mesh => mesh.clone() );
	THRU.meshGroupVisible.add( ...arr );

	//console.log( 'THRU.meshGroupVisible', THRU.meshGroupVisible );


	return THRU.meshGroupVisible;

};




THRU.toggleSurfaces = function( obj = THR.scene ) {

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



THRU.toggleSurfaceNormals = function( obj = THR.scene ) {
	//

	let material = new THREE.MeshNormalMaterial();

	const types = [ 'BoxBufferGeometry', 'BufferGeometry', 'ConeBufferGeometry', 'CylinderBufferGeometry',
		'ShapeBufferGeometry', 'SphereBufferGeometry' ];

	if ( THRU.helperNormalsFaces === undefined ) {

		THRU.helperNormalsFaces = new THREE.Group();

		obj.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh && child.visible ) {

				if ( child.geometry.type === 'Geometry' ) {

					child.geometry.computeFaceNormals();

					const helperNormalsFace = new THREE.FaceNormalsHelper( child, 2, 0xff00ff, 3 );
					THRU.helperNormalsFaces.add( helperNormalsFace );
					//THRU.helperNormalsFaces.visible = false;
					//console.log( 'helperNormalsFace', helperNormalsFace );

				} else if ( types.includes( child.geometry.type ) === true ) {

					const geometry = new THREE.Geometry();
					const geo = geometry.fromBufferGeometry( child.geometry );
					const mesh = new THREE.Mesh( geo, material );
					mesh.rotation.copy( child.rotation );
					mesh.position.copy( child.position );
					const helperNormalsFace = new THREE.FaceNormalsHelper( mesh, 0.05 * THRU.radius, 0xff00ff, 3 );

					THRU.helperNormalsFaces.add( helperNormalsFace );
					//THRU.helperNormalsFaces.visible = false;

				} else {

					//console.log( 'child.geometry.type', child.geometry.type );

				}

			}

		} );

		THRU.helperNormalsFaces.name = 'helperNormalsFaces';
		obj.add( THRU.helperNormalsFaces );

		THRU.helperNormalsFaces.visible = false;

	}

	THRU.helperNormalsFaces.visible = !THRU.helperNormalsFaces.visible;

};



THRU.setObjectOpacity = function( obj = THR.scene, range = rngOpacity ) {

	const opacity = parseInt( range.value, 10 );
	outOpacity.value = opacity + '%';

	obj.traverse( function ( child ) {

		if ( child instanceof THREE.Mesh ) {

			child.material.opacity = opacity / 100;

		}

	} );

};


////////// Helpers in the scene

THRU.toggleAxesHelper = function() {

	if ( !THRU.axesHelper ) {

		THRU.axesHelper = new THREE.AxesHelper();
		THR.scene.add( THRU.axesHelper );

	 } else {

		THRU.axesHelper.visible = !THRU.axesHelper.visible;

	}

	THRU.axesHelper.scale.set( THRU.radius, THRU.radius, THRU.radius );
	THRU.axesHelper.name = "axesHelper";
	THRU.axesHelper.position.copy( THRU.center );

};



THRU.toggleBoundingBoxHelper = function( objThree = THR.scene ){

	if ( !THRU.boundingBoxHelper ) {

		const bbox = new THREE.Box3().setFromObject( objThree );


		THRU.boundingBoxHelper = new THREE.Box3Helper( bbox, 0xff0000 );
		THRU.boundingBoxHelper.geometry.computeBoundingBox();
		THRU.boundingBoxHelper.name = "boundingBoxHelper";
		THR.scene.add( THRU.boundingBoxHelper );

	 } else {

		THRU.boundingBoxHelper.visible = !THRU.boundingBoxHelper.visible;

	}

}



THRU.toggleGroundHelper = function( position = THR.scene.position.clone(), elevation = 0 ) {

	// move to THRU but z min should be zero

	if ( !THRU.groundHelper ) {

		//const reElevation = /<Elevation>(.*?)<\/Elevation>/i;
		//GBX.elevation = GBX.text.match( reElevation )[ 1 ];
		//console.log( 'elevation', GBX.elevation );

		//elevation = GBX.boundingBox.box.min.z - 0.001 * THRU.radius;
		//elevation = 0;

		const geometry = new THREE.PlaneGeometry( 2 * THRU.radius, 2 * THRU.radius);
		const material = new THREE.MeshPhongMaterial( { color: 0x888888, opacity: 0.5, side: 2 } );
		THRU.groundHelper = new THREE.Mesh( geometry, material );
		THRU.groundHelper.receiveShadow = true;

		THRU.groundHelper.position.set( position.x, position.y, parseFloat( elevation ) );
		THRU.groundHelper.name = "groundHelper";

		THR.scene.add( THRU.groundHelper );

		return;

	}

	THRU.groundHelper.visible = !THRU.groundHelper.visible;

};



THRU.getMeshEdges = function( obj = THR.scene ) {

	const meshEdges = [];
	const lineMaterial = new THREE.LineBasicMaterial( { color: 0x888888 } );

	for ( let mesh of obj.children ) {

		if ( !mesh.geometry ) { continue; }

		const edgesGeometry = new THREE.EdgesGeometry( mesh.geometry );
		const surfaceEdge = new THREE.LineSegments( edgesGeometry, lineMaterial );
		surfaceEdge.rotation.copy( mesh.rotation );
		surfaceEdge.position.copy( mesh.position );
		meshEdges.push( surfaceEdge );

	}
	//console.log( 'meshEdges', meshEdges );

	return meshEdges;

};



THRU.toggleEdges = function( obj = THR.scene ) {

	if ( THRU.edgeGroup && THRU.edgeGroup.length === 0 ) {

		THRU.edgeGroup = new THREE.Group();
		THRU.edgeGroup.name = "edgeGroup";

		const edgeGroup = THRU.getMeshEdges( obj );
		//console.log( 'edgeGroup', edgeGroup );

		THRU.edgeGroup.add( ...edgeGroup );

		THR.scene.add( THRU.edgeGroup );

		return;

	}


	THRU.edgeGroup.traverse( child => {

		//if ( child instanceof THREE.Line ) {

			child.visible = !child.visible;

		//}

	} );

};


////////// Lights

THRU.addSomeLights = function() {

	THR.renderer.shadowMap.enabled = true;
	THR.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	THRU.lightAmbient = new THREE.AmbientLight( 0x888888 );
	THRU.lightAmbient.name = 'lightAmbient';
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
	THRU.lightAmbient.name = 'lightAmbient';
	THR.scene.add( THRU.lightAmbient );

	THRU.lightDirectional = new THREE.DirectionalLight( 0xffffff, 1 );
	THRU.lightDirectional.shadow.mapSize.width = 2048;  // default 512
	THRU.lightDirectional.shadow.mapSize.height = 2048;
	THRU.lightDirectional.castShadow = true;
	THR.scene.add( THRU.lightDirectional );

	THRU.targetObject = new THREE.Object3D();
	THR.scene.add( THRU.targetObject );

	THRU.lightDirectional.target = THRU.targetObject;

	THRU.lightPoint = new THREE.PointLight( 0xffffff, 0.5 );
	THRU.lightPoint.position = new THREE.Vector3( 0, 0, 1 );
	THR.camera.add( THRU.lightPoint );
	THR.scene.add( THR.camera );

};



////////// Get some meshes and stuff for testing or annotating

THRU.getGeometry = function() {

	// useful debug snippet
	const geometry = new THREE.TorusKnotBufferGeometry( 10, 3, 100, 16 );
	//const geometry = new THREE.BoxBufferGeometry( 20, 20, 20 );

	const material = new THREE.MeshNormalMaterial();
	const mesh = new THREE.Mesh( geometry, material );

	const edgesGeometry = new THREE.EdgesGeometry( geometry );
	const edgesMaterial = new THREE.LineBasicMaterial( { color: 0x000000 } );
	const surfaceEdge = new THREE.LineSegments( edgesGeometry, edgesMaterial );

	mesh.add( surfaceEdge );

	return mesh;

	// add to HTML file:
	// mesh = THRU.getGeometry();
	// THR.scene.add( mesh );

};



THRU.getSomeBoxes = function( count = 500, size = 10, material = new THREE.MeshNormalMaterial() ) {

	const geometry = new THREE.BoxBufferGeometry( size, size, size );

	const boxes = new THREE.Group();

	for ( let i = 0; i < count; i++ ) {

		const mesh = new THREE.Mesh( geometry, material );
		mesh.position.set( 100 * Math.random() - 50, 100 * Math.random() - 50, 100 * Math.random() - 50 );
		mesh.rotation.set( 2 * Math.random(), 2 * Math.random(), 2 * Math.random() );

		const edgesGeometry = new THREE.EdgesGeometry( mesh.geometry );
		const edgesMaterial = new THREE.LineBasicMaterial( { color: 0x000000 } );
		const surfaceEdge = new THREE.LineSegments( edgesGeometry, edgesMaterial );

		const placard = THRU.drawPlacard( 'box ' + i );

		mesh.add( surfaceEdge, placard );

		boxes.add( mesh );

	}

	return boxes;

};



THRU.drawPlacard = function( text = 'abc', scale = 0.05, color = Math.floor( Math.random() * 255 ), x = 0, y = 0, z = 10 ) {

	// add update
	// 2019-07-12 ~ https://github.com/jaanga/jaanga.github.io/tree/master/cookbook-threejs/examples/placards

	const placard = new THREE.Object3D();

	const texture = canvasMultilineText( text, { backgroundColor: color }   );
	const spriteMaterial = new THREE.SpriteMaterial( { map: texture, opacity: 0.9, transparent: true } );
	const sprite = new THREE.Sprite( spriteMaterial );
	sprite.position.set( x, y, z ) ;
	sprite.scale.set( scale * texture.image.width, scale * texture.image.height );

	//const geometry = new THREE.Geometry();
	//const v = function( x, y, z ){ return new THREE.Vector3( x, y, z ); };
	//geometry.vertices = [ v( 0, 0, 0 ),  v( x, y, z ) ];
	//const material = new THREE.LineBasicMaterial( { color: 0xaaaaaa } );
	//const line = new THREE.Line( geometry, material );
	//placard.add( sprite, line );

	placard.add( sprite );

	return placard;


	function canvasMultilineText( textArray, parameters ) {

		parameters = parameters || {} ;

		const canvas = document.createElement( 'canvas' );
		const context = canvas.getContext( '2d' );
		let width = parameters.width ? parameters.width : 0;
		const font = parameters.font ? parameters.font : '48px monospace';
		const color = parameters.backgroundColor ? parameters.backgroundColor : 120 ;

		if ( typeof textArray === 'string' ) textArray = [ textArray ];

		context.font = font;

		for ( let i = 0; i < textArray.length; i++) {

			width = context.measureText( textArray[ i ] ).width > width ? context.measureText( textArray[ i ] ).width : width;

		}

		canvas.width = width + 20;
		canvas.height =  parameters.height ? parameters.height : textArray.length * 60;

		context.fillStyle = 'hsl( ' + color + ', 80%, 50% )' ;
		context.fillRect( 0, 0, canvas.width, canvas.height);

		context.lineWidth = 1 ;
		context.strokeStyle = '#000';
		context.strokeRect( 0, 0, canvas.width, canvas.height );

		context.fillStyle = '#000' ;
		context.font = font;

		for ( let i = 0; i < textArray.length; i++) {

			context.fillText( textArray[ i ], 10, 48  + i * 60 );

		}

		const texture = new THREE.Texture( canvas );
		texture.minFilter = texture.magFilter = THREE.NearestFilter;
		texture.needsUpdate = true;

		return texture;

	}

};