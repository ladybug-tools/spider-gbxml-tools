// Copyright 2018 Ladybug Tools authors. MIT License
// jshint esversion: 6
/* globals THREE, THR, THRU */

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



GBX.parseFile = function( gbxml )  {
	//console.log( 'gbxml', gbxml );

	//GBX.materialType = THR.scene.getObjectByName( 'lightAmbient') ? THREE.MeshPhongMaterial : THREE.MeshBasicMaterial;
	GBX.materialType = THREE.MeshBasicMaterial;

	GBX.text = gbxml.replace( /\r\n|\n/g, '' );
	//console.log( 'GBX.text', GBX.text );

	GBX.timeStart = performance.now();

	const reSurface = /<Surface(.*?)<\/surface>/gi;
	GBX.surfaces = GBX.text.match( reSurface );
	//console.log( 'GBX.surfaces', GBX.surfaces );

	//GBX.setSurfacesFiltered( 'exposedToSun="true"' );

	return GBX.surfaces.length;

};



//////////

GBX.sendSurfacesToThreeJs = function( surfaces ) {
	//console.log( 'surfaces', surfaces );

	if ( !surfaces.length ) { return "no surfaces"; }

	THR.scene.remove( GBX.surfaceMeshes );
	THRU.setSceneDispose( GBX.surfaceMeshes );

	//THRU.setHelpers();

	//THRU.addSomeLights();

	GBX.surfaceMeshes = new THREE.Group();
	GBX.surfaceMeshes.name = 'GBX.surfaceMeshes';

	const polyLoops = surfaces.map( surface => GBX.getPolyLoops( surface ) ).map( polyLoop => polyLoop[ 0 ] );
	//console.log( 'polyLoops', polyLoops );

	const vertices = polyLoops.map( polyLoops => GBX.getVertices( polyLoops ) );
	//console.log( 'vertices', vertices );

	const meshes = vertices.map( ( arr, index ) => GBX.getSurfaceMesh( arr, index ) )
	GBX.surfaceMeshes.add( ...meshes );

	THR.scene.add( GBX.surfaceMeshes );

	THRU.zoomObjectBoundingSphere( GBX.surfaceMeshes );

	return surfaces.length + ' surfaces';

};



GBX.getPolyLoops = function( surface ) {

	const re = /<polyloop(.*?)<\/polyloop>/gi;
	const polyloopText = surface.match( re );
	const polyloops = polyloopText.map( polyloop => polyloop.replace(/<\/?polyloop>/gi, '' ) );

	return polyloops;

};



GBX.getVertices = function( surface ) {

	const re = /<coordinate(.*?)<\/coordinate>/gi;
	const coordinatesText = surface.match( re );
	const coordinates = coordinatesText.map( coordinate => coordinate.replace(/<\/?coordinate>/gi, '' ) )
		.map( txt => Number( txt ) );

	return coordinates;

};



GBX.getSurfaceMesh = function( arr, index ) {
	//console.log( 'array', arr, index );

	const string = GBX.surfacesFiltered[ index ].match( 'surfaceType="(.*?)"')[ 1 ];
	const color = new THREE.Color( GBX.colorsDefault[ string ] );
	//console.log( 'color', color );

	const v = ( arr ) => new THREE.Vector3().fromArray( arr );

	let vertices, mesh;

	if ( arr.length < 6 ) {

		console.log( 'mesh', mesh );
		return;

	} else if ( arr.length === 6 ) {

		// draw a line?

		vertices = [ v( arr.slice( 0, 3 ) ), v( arr.slice( 3, 6 ) ) ];

		//mesh = GBX.BufferGeometry( vertices, color );

		geometry = new THREE.Geometry();
		geometry.vertices = vertices;
		material = new THREE.LineBasicMaterial( { color: 0x000000 } );
		//mesh = new THREE.Line( geometry, material );

		console.log( 'mesh', mesh );

		return;

	} else if ( arr.length === 9 ) {

		vertices = [ v( arr.slice( 0, 3 ) ), v( arr.slice( 3, 6 ) ), v( arr.slice( 6 ) ) ];

		mesh = GBX.BufferGeometry( vertices, color );

	} else if ( arr.length === 12 ) {

		vertices = [

			v( arr.slice( 0, 3 ) ), v( arr.slice( 3, 6 ) ), v( arr.slice( 6, 9 ) ),
			v( arr.slice( 9, 12 ) ), v( arr.slice( 6, 9 ) ), v( arr.slice( 0, 3 ) )

		];

		mesh = GBX.BufferGeometry( vertices, color );

	} else {

		vertices = [];

		for ( let i = 0; i < ( arr.length / 3 ); i ++ ) {

			vertices.push( v( arr.slice( 3 * i, 3 * i + 3 ) ) );

		}

		mesh = GBX.setPolygon( vertices, color );

	}

	//GBX.surfaceMeshes.add( mesh );

	return mesh;

	//console.log( 'GBX.surfaceMeshes', GBX.surfaceMeshes );

};



GBX.BufferGeometry = function( vertices, color ) {
	//console.log( 'vertices', vertices, color );

	const geometry = new THREE.BufferGeometry();
	geometry.setFromPoints( vertices );

	geometry.computeVertexNormals();
	const material = new GBX.materialType( { color: color, opacity: 0.85, side: 2, transparent: true });

	const mesh = new THREE.Mesh( geometry, material );

	return mesh;

};



GBX.setPolygon = function( vertices, color, holes = [] ) {
	//console.log( { vertices } );

	//assume vertices are coplanar but at an arbitrary rotation and position in space
	const plane = GBX.getPlane( vertices );

	// rotate vertices to lie on XY plane
	GBX.referenceObject.lookAt( plane.normal ); // copy the rotation of the plane
	GBX.referenceObject.quaternion.conjugate(); // figure out the angle it takes to rotate the vertices so they lie on the XY plane
	GBX.referenceObject.updateMatrixWorld();

	const verticesFlat = vertices.map( vertex => GBX.referenceObject.localToWorld( vertex ) );
	//console.log( { verticesFlat } );

	/*for ( let verticesHoles of holes ) {

		verticesHoles.forEach( vertex => GBX.referenceObject.localToWorld( vertex ) );

	} */

	//holes.forEach( verticesHoles => verticesHoles.forEach( vertex => GBX.referenceObject.localToWorld( vertex ) ) );

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

	const material = new GBX.materialType( { color: color, opacity: 0.85, side: 2, transparent: true } );

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


