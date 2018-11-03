

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

