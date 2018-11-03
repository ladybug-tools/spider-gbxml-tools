

function parseFile( gbxml )  {

	const text = gbxml.replace( /\r\n|\n/g, '' );

	const re = /<Surface(.*?)<\/surface>/gi;
	const surfaces = text.match( re );
	//console.log( 'surfaces', surfaces );

	const vertices = surfaces.map( surface => getVertices( surface ) );

	const count = vertices.reduce( ( count, val, index ) => count + vertices[ index ].length, 0 );

	const timeToLoad = performance.now() - timeStart;

	divGbxmlInfo.innerHTML =
	`
		<hr>
		<div>time to load: ${ parseInt( timeToLoad, 10 ).toLocaleString() } ms</div>
		<div>surfaces: ${ surfaces.length.toLocaleString() } </div>
		<div>vertex arrays: ${ vertices.length.toLocaleString() } </div>
		<div>vertex count: ${ count.toLocaleString() } </div>
	`;

	GBX.surfaceMeshes = new THREE.Group();
	GBX.surfaceMeshes.name = 'GBX.surfaceMeshes';

	vertices.forEach( arr => getSurfaceMeshes( arr.slice( 0, -3 ) ) );

	THR.scene.add( GBX.surfaceMeshes );

	THRU.zoomObjectBoundingSphere( GBX.surfaceMeshes )

};



function getVertices( surface ) {

	const re = /<coordinate(.*?)<\/coordinate>/gi;
	const coordinatesText = surface.match( re );
	const coordinates = coordinatesText.map( coordinate => coordinate.replace(/<\/?coordinate>/gi, '' ) )
		.map( txt => Number( txt ) );

	return coordinates

}



function getSurfaceMeshes( arr ) {

	let v = function() { return new THREE.Vector3() };

	//console.log( 'array', arr );
	if ( arr.length === 9 ) {

		//vertices = [ v( arr[ 0 ], arr[ 1 ], arr[ 2 ] ), v( arr[ 3 ], arr[ 4 ], arr[ 5 ] ), v( arr[ 6 ], arr[ 7 ], arr[ 8 ] )
		vertices = [
		new THREE.Vector3().fromArray( arr.slice( 0, 3 ) ),
		new THREE.Vector3().fromArray( arr.slice( 3, 6 ) ),
		new THREE.Vector3().fromArray( arr.slice( 6 ) )]

		//mesh = GBX.BufferGeometry( vertices );
		//GBX.surfaceMeshes.add( mesh );

	} else { //if ( arr.length === 12 ) {

		vertices = [

			new THREE.Vector3().fromArray( arr.slice( 0, 3 ) ),
			new THREE.Vector3().fromArray( arr.slice( 3, 6 ) ),
			new THREE.Vector3().fromArray( arr.slice( 6, 9 ) ),

			new THREE.Vector3().fromArray( arr.slice( 9, 12 ) ),
			new THREE.Vector3().fromArray( arr.slice( 6, 9 ) ),
			new THREE.Vector3().fromArray( arr.slice( 0, 3 ) )

		]

		//const verticesRemix = vertices.slice( 0, 3 ).concat( [ vertices[ 3 ], vertices[ 2 ], vertices[ 0 ] ] );

	}

	mesh = GBX.BufferGeometry( vertices );
	GBX.surfaceMeshes.add( mesh );
	//console.log( 'GBX.surfaceMeshes', GBX.surfaceMeshes );


}


GBX.BufferGeometry = function( vertices ) {
	//console.log( 'vertices', vertices );

	const geometry = new THREE.BufferGeometry();
	geometry.setFromPoints( vertices );

	geometry.computeVertexNormals();
	const material = new THREE.MeshNormalMaterial( { side: 2 });

	const mesh = new THREE.Mesh( geometry, material );

	return mesh

};


THRU.zoomObjectBoundingSphere = function( obj = THR.scene ) {
	//console.log( 'obj', obj );

	const bbox = new THREE.Box3().setFromObject( obj );
	console.log( 'bbox', bbox );

	if ( bbox.isEmpty() === true ) { return; }

	//if ( isNaN( bbox.max.x - bbox.min.x ) ) { console.log( 'zoom fail', {obj},{bbox} ); return; } // is there a better way of seeing if we have a good bbox?

	const sphere = bbox.getBoundingSphere( new THREE.Sphere() );
	const center = sphere.center;
	const radius = sphere.radius;

	//THR.controls.reset();
	THR.controls.target.copy( center ); // needed because model may be far from origin
	THR.controls.maxDistance = 5 * radius;

	THR.camera.position.copy( center.clone().add( new THREE.Vector3( 1.5 * radius, 1.5 * radius, 1.5 * radius ) ) );
	THR.camera.near = 0.1 * radius; //2 * camera.position.length();
	THR.camera.far = 10 * radius; //2 * camera.position.length();
	THR.camera.updateProjectionMatrix();

	if ( THRU.axesHelper ) {

		THRU.axesHelper.scale.set( radius, radius, radius );
		THRU.axesHelper.position.copy( center);

	}

	if ( THRU.lightDirectional ) {

		THRU.lightDirectional.position.copy( center.clone().add( new THREE.Vector3( 1.5 * radius, -1.5 * radius, 1.5 * radius ) ) );
		THRU.lightDirectional.shadow.camera.scale.set( 0.2 * radius, 0.2 * radius, 0.01 * radius );

		THRU.targetObject.position.copy( center );

		//THR.scene.remove( THRU.cameraHelper );
		//THRU.cameraHelper = new THREE.CameraHelper( THRU.lightDirectional.shadow.camera );
		//THR.scene.add( THRU.cameraHelper );

	}

	THRU.center = center;
	THRU.radius = radius;

	THRU.onThreejsSceneLoaded();

};