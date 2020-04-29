

THRU.toggleSurfaceNormals = function( obj = THR.scene ) {

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
					helperNormalsFace.userData.index = child.userData.index;

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



THRU.toggleSurfaceNormalsVisible = function( obj = THR.scene ) {

	let material = new THREE.MeshNormalMaterial();

	const types = [ 'BoxBufferGeometry', 'BufferGeometry', 'ConeBufferGeometry', 'CylinderBufferGeometry',
		'ShapeBufferGeometry', 'SphereBufferGeometry' ];

	if ( THR.scene.children.includes( THRU.helperNormalsFaces ) ) {

		THR.scene.remove( THRU.helperNormalsFaces );

	} else {

		THRU.helperNormalsFaces = new THREE.Group();

		THR.scene.traverse( function ( child ) {

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
					helperNormalsFace.userData.index = child.userData.index;

					THRU.helperNormalsFaces.add( helperNormalsFace );
					//THRU.helperNormalsFaces.visible = false;

				} else {

					//console.log( 'child.geometry.type', child.geometry.type );

				}

			}

		} );

		THRU.helperNormalsFaces.name = 'helperNormalsFaces';

		THR.scene.add( THRU.helperNormalsFaces );

	}

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

};



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


//////////

THRU.getMeshEdges = function( obj = THR.scene ) {

	const meshEdges = [];
	const lineMaterial = new THREE.LineBasicMaterial( { color: 0x888888 } );

	for ( let mesh of obj.children ) {

		if ( !mesh.geometry ) { continue; }

		const edgesGeometry = new THREE.EdgesGeometry( mesh.geometry );
		const surfaceEdge = new THREE.LineSegments( edgesGeometry, lineMaterial );
		//surfaceEdge.rotation.copy( mesh.rotation );
		//surfaceEdge.position.copy( mesh.position );
		mesh.add( surfaceEdge );

	}
	//console.log( 'meshEdges', meshEdges );

	return meshEdges;

};



THRU.toggleEdges = function( obj = THR.scene ) {

	obj.traverse( child => {

		if ( child instanceof THREE.Line ) {

			child.visible = !child.visible;

		}

	} );

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

	//THR.scene.add( THRU.getSomeBoxes() );

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