// Copyright 2018 ZZZZZ authors. MIT License
/* global THREE, THR, rngOpacity, outOpacity */
// jshint esversion: 6


let THRU = { release: "2018-09-26" };

THRU.radius = 100;



THRU.getSettings = function() {


	let htm =
	`
		<p>
			<button onclick="THR.controls.autoRotate = !THR.controls.autoRotate;" >toggle rotation</button>
		</p>

		<p>
			<button onclick=THRU.toggleWireframe(); >toggle wireframe</button>

			<button onclick=THRU.toggleEdges(); >toggle edges</button>
		</p>


		<p>
			<button onclick=THRU.toggleSurfaceNormals(); title="All Three.js triangles have a normal. See them here." > toggle surface normals </button>

			<button onclick=THRU.toggleAxesHelper(); >toggle axes</button>

		</p>

		<div title="opacity: 0 to 100%" >opacity
			<output id=outOpacity class=floatRight >85%</output><br>
			<input type="range" id="rngOpacity" min=0 max=100 step=1 value=85 oninput=THRU.updateOpacity(); >
		</div>

		<p><button onclick=THRU.zoomObjectBoundingSphere(THRU.cubes);>zoom all</button></p>

	`;

	return htm;

};



THRU.setHelpers = function() {

	THRU.toggleAxesHelper();

	window.addEventListener( 'keyup', () => THRU.sceneRotation = 0, false );
	THR.renderer.domElement.addEventListener( 'click', () => THR.controls.autoRotate=false, false );

	THR.controls.autoRotate = true;

};



THRU.getGeometry = function() {

	// useful debug snippet
	const geometry = new THREE.BoxGeometry( 50, 50, 50 );
	const material = new THREE.MeshNormalMaterial();
	const mesh = new THREE.Mesh( geometry, material );

	const edgesGeometry = new THREE.EdgesGeometry( geometry );
	const edgesMaterial = new THREE.LineBasicMaterial( { color: 0x000000 } );
	const surfaceEdge = new THREE.LineSegments( edgesGeometry, edgesMaterial );

	mesh.add( surfaceEdge );

	return mesh;

};



THRU.toggleWireframe = function() {

	THR.scene.traverse( function ( child ) {

		if ( child instanceof THREE.Mesh ) {

			child.material.wireframe = !child.material.wireframe;

		}

	} );

};



THRU.toggleEdges = function() {

	THR.scene.traverse( function ( child ) {

		if ( child instanceof THREE.Line ) {

			child.visible = !child.visible;

		}

	} );

};



THRU.toggleSurfaceNormals = function() {

	let material = new THREE.MeshNormalMaterial();

	const types = [ 'BoxBufferGeometry', 'BufferGeometry', 'ConeBufferGeometry', 'CylinderBufferGeometry',
		'ShapeBufferGeometry', 'SphereBufferGeometry' ];

	if ( THRU.helperNormalsFaces === undefined ) {

		THRU.helperNormalsFaces = new THREE.Group();

		THR.scene.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh && child.visible ) {

				if ( child.geometry.type === 'Geometry' ) {

					child.geometry.computeFaceNormals();

					const helperNormalsFace = new THREE.FaceNormalsHelper( child, 2, 0xff00ff, 3 );
					THRU.helperNormalsFaces.add( helperNormalsFace );
					THRU.helperNormalsFaces.visible = false;
					//console.log( 'helperNormalsFace', helperNormalsFace );

				} else if ( types.includes( child.geometry.type ) === true ) {

					//console.log( 'child', child.position, child.rotation );

					const geometry = new THREE.Geometry();
					const geo = geometry.fromBufferGeometry( child.geometry );
					const mesh = new THREE.Mesh( geo, material );
					mesh.rotation.copy( child.rotation );
					mesh.position.copy( child.position );
					const helperNormalsFace = new THREE.FaceNormalsHelper( mesh, 0.05 * THRU.radius, 0xff00ff, 3 );

					THRU.helperNormalsFaces.add( helperNormalsFace );
					THRU.helperNormalsFaces.visible = false;

				} else {

					console.log( 'child.geometry.type', child.geometry.type );

				}

			}

		} );

		THRU.helperNormalsFaces.name = 'helperNormalsFaces';
		THR.scene.add( THRU.helperNormalsFaces );
		THRU.helperNormalsFaces.visible = false;

	}

	THRU.helperNormalsFaces.visible = !THRU.helperNormalsFaces.visible;

};



THRU.toggleAxesHelper = function() {

	if ( !THRU.axesHelper ) {

		THRU.axesHelper = new THREE.AxesHelper( THRU.radius );
		THR.scene.add( THRU.axesHelper );
		return;

	 }

	THRU.axesHelper.visible = !THRU.axesHelper.visible;

};



THRU.updateOpacity = function() {

	const opacity = parseInt( rngOpacity.value, 10 );
	outOpacity.value = opacity + '%';

	THR.scene.traverse( function ( child ) {

		if ( child instanceof THREE.Mesh ) {

			child.material.opacity = opacity / 100;

		}

	} );

};



THRU.zoomObjectBoundingSphere = function( obj = undefined ) {
	//console.log( 'obj', obj );

	const bbox = new THREE.Box3().setFromObject( obj );
	//console.log( 'bbox', bbox );

	if ( bbox.isEmpty() === true ) { return; }

	//if ( isNaN( bbox.max.x - bbox.min.x ) ) { console.log( 'zoom fail', {obj},{bbox} ); return; } // is there a better way of seeing if we have a good bbox?

	const sphere = bbox.getBoundingSphere( new THREE.Sphere() );
	const center = sphere.center;
	const radius = sphere.radius;

	THR.controls.reset();
	THR.controls.target.copy( center ); // needed because model may be far from origin
	THR.controls.maxDistance = 5 * radius;

	THR.camera.position.copy( center.clone().add( new THREE.Vector3( 1.5 * radius, 1.5 * radius, 1.5 * radius ) ) );
	THR.camera.near = 0.1 * radius; //2 * camera.position.length();
	THR.camera.far = 10 * radius; //2 * camera.position.length();
	THR.camera.updateProjectionMatrix();

	//lightDirectional.position.copy( center.clone().add( new THREE.Vector3( -1.5 * radius, -1.5 * radius, 1.5 * radius ) ) );
	//lightDirectional.shadow.camera.scale.set( 0.2 * radius, 0.2 * radius, 0.01 * radius );
	//lightDirectional.target = axesHelper;

	if ( THRU.axesHelper ) {

		THRU.axesHelper.scale.set( radius, radius, radius );
		THRU.axesHelper.position.copy( center );

	}

	//obj.userData.center = center;
	//obj.userData.radius = radius;

	THRU.center = center;
	THRU.radius = radius;

	THRU.onThreejsSceneLoaded();

};



THRU.onThreejsSceneLoaded = function() { return THR.scene; };




THRU.setSceneDispose = function( objArray = [] ) {

	//console.log( 'THR.scene', THR.scene );

	THR.scene.traverse( function ( child ) {

		if ( child instanceof THREE.Mesh ) {

			child.geometry.dispose();
			child.material.dispose();

			THR.scene.remove( child );

		} else if( child instanceof THREE.LineSegments ) {

			child.geometry.dispose();
			child.material.dispose();

		}

	} );


	THR.scene.remove( ...objArray );

	THR.axesHelper = undefined;

	THRU.getRenderInfo();

};



THRU.getRenderInfo = function() {

	//console.log( 'renderer.info.memory.geometries', THR.renderer.info.memory.geometries );
	//console.log( 'renderer.info', THR.renderer.info );

	target = divRendererInfo
	const htm =
	`
	<p>
		memory:<br>
		geometries: ${ THR.renderer.info.memory.geometries.toLocaleString() }
	</p>
	<p>
		renderer:<br>
		triangles: ${ THR.renderer.info.render.triangles.toLocaleString() } <br>
		lines: ${ THR.renderer.info.render.lines.toLocaleString() } <br>
	</p>
	<p>
		<button onclick=target.innerHTML=THRU.getRenderInfo(); >update info</button>

	</p>
		`;

	//<button onclick=THRU.setSceneDispose() >dispose geometry not </button>
	return htm;

};



THRU.addSomeLights = function() {

	THR.lightAmbient = new THREE.AmbientLight( 0x888888 );
	THR.lightAmbient.name = 'lightAmbient';
	THR.scene.add( THR.lightAmbient );

	THRU.light1 = new THREE.DirectionalLight( 0xffffff, 2 );
	THRU.light1.position.set( 1, 1, 1 );
	THR.scene.add( THRU.light1 );

	THRU.light2 = new THREE.DirectionalLight( 0xffffff, 0.5 );
	THRU.light2.position.set( 0, 0, -1 );
	THR.scene.add( THRU.light2 );

};



THRU.getSomeBoxes = function( count = 50, size = 10, material = new THREE.MeshNormalMaterial() ) {

	//const geometry = new THREE.BoxGeometry( size, size, size );
	const geometry = new THREE.BoxBufferGeometry( size, size, size );
	//const material = new THREE.MeshBasicMaterial();

	const boxes = new THREE.Group();

	for ( let i = 0; i < count; i++ ) {

		const mesh = new THREE.Mesh( geometry, material );
		mesh.position.set( 100 * Math.random() - 50, 100 * Math.random() - 50, 100 * Math.random() - 50 );
		mesh.rotation.set( 2 * Math.random(), 2 * Math.random(), 2 * Math.random() );

		const edgesGeometry = new THREE.EdgesGeometry( mesh.geometry );
		const edgesMaterial = new THREE.LineBasicMaterial( { color: 0x000000 } );
		const surfaceEdge = new THREE.LineSegments( edgesGeometry, edgesMaterial );

		mesh.add( surfaceEdge );
		boxes.add( mesh );

	}

	return boxes;

};



THRU.drawPlacard = function( text, scale, color, x, y, z ) {

	// add update
	// 2016-02-27 ~ https://github.com/jaanga/jaanga.github.io/tree/master/cookbook-threejs/examples/placards

	var placard = new THREE.Object3D();
	var v = function( x, y, z ){ return new THREE.Vector3( x, y, z ); };

	var texture = canvasMultilineText( text, { backgroundColor: color }   );
	var spriteMaterial = new THREE.SpriteMaterial( { map: texture, opacity: 0.9, transparent: true } );
	var sprite = new THREE.Sprite( spriteMaterial );
	sprite.position.set( x, y, z ) ;
	sprite.scale.set( scale * texture.image.width, scale * texture.image.height );

	var geometry = new THREE.Geometry();
	geometry.vertices = [ v( 0, 0, 0 ),  v( x, y, z ) ];
	var material = new THREE.LineBasicMaterial( { color: 0xaaaaaa } );
	var line = new THREE.Line( geometry, material );

	//placard.add( sprite, line );
	placard.add( sprite );
	return placard;


	function canvasMultilineText( textArray, parameters ) {

		parameters = parameters || {} ;

		var canvas = document.createElement( 'canvas' );
		var context = canvas.getContext( '2d' );
		var width = parameters.width ? parameters.width : 0;
		var font = parameters.font ? parameters.font : '48px monospace';
		var color = parameters.backgroundColor ? parameters.backgroundColor : 120 ;

		if ( typeof textArray === 'string' ) textArray = [ textArray ];

		context.font = font;

		for ( var i = 0; i < textArray.length; i++) {

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

		for ( i = 0; i < textArray.length; i++) {

			context.fillText( textArray[ i ], 10, 48  + i * 60 );

		}

		var texture = new THREE.Texture( canvas );
		texture.minFilter = texture.magFilter = THREE.NearestFilter;
		texture.needsUpdate = true;

		return texture;

	}

};

