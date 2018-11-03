var GBX = GBX || {};

GBX.colorsDefault = {

	InteriorWall: 0x008000,
	ExteriorWall: 0xFFB400,
	Roof: 0x800000,
	InteriorFloor: 0x80FFFF,
	ExposedFloor: 0x40B4FF,
	Shade: 0xFFCE9D,
	UndergroundWall: 0xA55200,
	UndergroundSlab: 0x804000,
	Ceiling: 0xFF8080,
	Air: 0xFFFF00,
	UndergroundCeiling: 0x408080,
	RaisedFloor: 0x4B417D,
	SlabOnGrade: 0x804000,
	FreestandingColumn: 0x808080,
	EmbeddedColumn: 0x80806E,
	Undefined: 0x88888888

};

GBX.colors = Object.assign( {}, GBX.colorsDefault ); // working copy of default colors

GBX.surfaceTypes  = Object.keys( GBX.colors );

GBX.referenceObject = new THREE.Object3D();
GBX.triangle = new THREE.Triangle(); // used by GBX.getPlane



function parseFile( gbxml )  {

	const text = gbxml.replace( /\r\n|\n/g, '' );

	const reSpaces = /<space(.*?)<\/space>/gi;
	const spaces = text.match( reSpaces );
	//console.log( 'spaces', spaces );

	const re = /<Surface(.*?)<\/surface>/gi;
	const surfaces = text.match( re );
	//console.log( 'surfaces', surfaces );

	const verticesCount = surfaces.map( surfaces => getVertices( surfaces ) );
	//console.log( 'vertices', vertices );

	const count = verticesCount.reduce( ( count, val, index ) => count + verticesCount[ index ].length, 0 );

	//exposedToSun = surfaces.filter( surface => surface.includes( 'exposedToSun="true"' ) === true );
	//console.log( 'exposedToSun', exposedToSun );

	exteriors = surfaces.filter(
		surface => surface.includes( '"Roof"' ) ||
		surface.includes( '"ExteriorWall"' ) ||
		surface.includes( '"ExposedFloor"' ) ||
		surface.includes( '"Air"' ) ||
		surface.includes( '"Shade"' ));

	//console.log( 'exteriors', exteriors );

	const polyLoops = exteriors.map( surface => getPolyLoops( surface ) ).map( polyLoop => polyLoop[ 0 ] );
	//console.log( 'polyLoops', polyLoops );

	const vertices = polyLoops.map( polyLoops => getVertices( polyLoops ) );
	//console.log( 'vertices', vertices );


	const timeToLoad = performance.now() - timeStart;

	divGbxmlInfo.innerHTML =
	`
		<hr>
		<div>time to parse: ${ parseInt( timeToLoad, 10 ).toLocaleString() } ms</div>
		<div>spaces: ${ spaces.length.toLocaleString() } </div>
		<div>surfaces: ${ surfaces.length.toLocaleString() } </div>

		<div>coordinates: ${ count.toLocaleString() } </div>
	`;

	// <div>vertex arrays: ${ vertices.length.toLocaleString() } </div>
	THR.scene.remove( GBX.surfaceMeshes );
	THRU.setSceneDispose( GBX.surfaceMeshes );

	GBX.surfaceMeshes = new THREE.Group();
	GBX.surfaceMeshes.name = 'GBX.surfaceMeshes';

	vertices.forEach( arr => getSurfaceMeshes( arr ) );

	THR.scene.add( GBX.surfaceMeshes );

	THRU.zoomObjectBoundingSphere( GBX.surfaceMeshes )

};



function getPolyLoops( surface ) {

	const re = /<polyloop(.*?)<\/polyloop>/gi;
	const polyloopText = surface.match( re );
	const polyloops = polyloopText.map( polyloop => polyloop.replace(/<\/?polyloop>/gi, '' ) );

	return polyloops;

};



function getVertices( surface ) {

	const re = /<coordinate(.*?)<\/coordinate>/gi;
	const coordinatesText = surface.match( re );
	const coordinates = coordinatesText.map( coordinate => coordinate.replace(/<\/?coordinate>/gi, '' ) )
		.map( txt => Number( txt ) );

	return coordinates;

};



function getSurfaceMeshes( arr ) {
	//console.log( 'array', arr );

	const v = ( arr ) => new THREE.Vector3().fromArray( arr );

	let vertices, mesh;

	if ( arr.length === 6 ) {

		// draw a line?

		vertices = [ v( arr.slice( 0, 3 ) ), v( arr.slice( 3, 6 ) ) ];

		mesh = GBX.BufferGeometry( vertices );

		console.log( 'mesh', mesh );


	} else if ( arr.length === 9 ) {

		vertices = [ v( arr.slice( 0, 3 ) ), v( arr.slice( 3, 6 ) ), v( arr.slice( 6 ) ) ];

		mesh = GBX.BufferGeometry( vertices );

	} else if ( arr.length === 12 ) {

		vertices = [

			v( arr.slice( 0, 3 ) ), v( arr.slice( 3, 6 ) ), v( arr.slice( 6, 9 ) ),
			v( arr.slice( 9, 12 ) ), v( arr.slice( 6, 9 ) ),	v( arr.slice( 0, 3 ) )

		]

		mesh = GBX.BufferGeometry( vertices );

	} else {

		vertices = [];

		//console.log( 'arr.length', arr.length );

		for ( let i = 0; i < ( arr.length / 3 ); i ++ ) {

			vertices.push( v( arr.slice( 3 * i, 3 * i + 3 ) ) );

		}

		mesh = GBX.setPolygon( vertices );


	}

	GBX.surfaceMeshes.add( mesh );
	//console.log( 'GBX.surfaceMeshes', GBX.surfaceMeshes );

};



GBX.BufferGeometry = function( vertices ) {
	//console.log( 'vertices', vertices );

	const geometry = new THREE.BufferGeometry();
	geometry.setFromPoints( vertices );

	geometry.computeVertexNormals();
	const material = new THREE.MeshNormalMaterial( { opacity: 0.85, side: 2, transparent: true });

	const mesh = new THREE.Mesh( geometry, material );

	return mesh;

};



GBX.setPolygon = function( vertices, holes = [] ) {
	//console.log( { vertices } );

	//assume vertices are coplanar but at an arbitrary rotation and position in space
	const plane = GBX.getPlane( vertices );

	// rotate vertices to lie on XY plane
	GBX.referenceObject.lookAt( plane.normal ); // copy the rotation of the plane
	GBX.referenceObject.quaternion.conjugate(); // figure out the angle it takes to rotate the vertices so they lie on the XY plane
	GBX.referenceObject.updateMatrixWorld();

	const verticesFlat = vertices.map( vertex => GBX.referenceObject.localToWorld( vertex ) );
	//console.log( { verticesFlat } );

	for ( let verticesHoles of holes ) {

		verticesHoles.forEach( vertex => GBX.referenceObject.localToWorld( vertex ) );

	}

	// vertices must be coplanar with the XY plane for Earcut.js to work
	const triangles = THREE.ShapeUtils.triangulateShape( verticesFlat, holes );
	//console.log( { triangles } );

	const verticesAll = vertices.slice( 0 ).concat( ...holes );
	//console.log( 'verticesAll', verticesAll );

	const verticesTriangles = [];

	for ( let triangle of triangles ) {

		for ( let j = 0; j < 3; j++ ) {

			const vertex = verticesAll[ triangle[ j ] ];

			verticesTriangles.push( vertex );

		}

	}
	//console.log( { verticesTriangles } );

	const geometry = new THREE.BufferGeometry();
	geometry.setFromPoints( verticesTriangles );
	geometry.computeVertexNormals();

	const material = new THREE.MeshNormalMaterial( { opacity: 0.85, side: 2, transparent: true } );

	const mesh = new THREE.Mesh( geometry, material );


	mesh.lookAt( plane.normal );

	return mesh;

};



GBX.getPlane = function( points, start = 0 ) {


	GBX.triangle.set( points[ start ], points[ start + 1 ], points[ start + 2 ] );

	if ( GBX.triangle.getArea() === 0 ) { // looks like points are colinear and do not form a plane therefore try next set of points

		GBX.getPlane( points, ++start );

	}

	return GBX.triangle.getPlane( new THREE.Plane() );

};






