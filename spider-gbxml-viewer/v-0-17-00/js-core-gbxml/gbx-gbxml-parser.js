// Copyright 2018 Ladybug Tools authors. MIT License
// jshint esversion: 6
/* globals THREE, THR, THRU, FOB, GBXU */

var GBX = {
	copyright: "Copyright 2019 Ladybug Tools authors. MIT License",
	date: "2019-07-11",
	description: "Does all the heavy lifting",
	helpFile: "../js-core-gbxml/gbx-gbxml-parser.md",
	license: "MIT License",
	urlSourceCode: "https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/spider-gbxml-viewer/v-0-17-00/js-core-gbxml",
	version: "0.17.00-2gbx"
};

GBX.filtersDefault = [ "Air", "ExposedFloor", "ExteriorWall", "RaisedFloor", "Roof",  "Shade",
	"SlabOnGrade", "UndergroundWall", "UndergroundSlab" ];



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

GBX.colors = Object.assign( {}, GBX.colorsDefault ); // create working copy of default colors
GBX.surfaceTypes = Object.keys( GBX.colors );

GBX.opacity = 0.85;

GBX.referenceObject = new THREE.Object3D();
GBX.triangle = new THREE.Triangle(); // used by GBX.getPlane


GBX.init = function() {

	//change to custom event with data passing via event details??

	FOB.xhr.addEventListener( 'load', GBX.onXhrResponse, false );
	FOB.reader.addEventListener( 'load', GBX.onReaderResult, false );
	document.body.addEventListener( 'FOBonZipFileLoad', GBX.onFileZipLoad, false );
	document.body.addEventListener( 'onZipFileParse', GBX.onFileZipLoad, false );

	document.body.addEventListener( 'onGbxParse', GBXU.onGbxParse, false );

};



GBX.onXhrResponse = function( event ) { GBX.parseFile( event.target.response ); };

GBX.onReaderResult = function() { GBX.parseFile( FOB.reader.result ); };

GBX.onFileZipLoad = function() { GBX.parseFile( FOB.text ); };



GBX.parseFile = function( gbxml )  {

	if ( !gbxml || gbxml.includes( "xmlns" ) === false ) { return; }
	//console.log( 'gbxml', gbxml );

	GBX.timeStart = performance.now();

	// Fix this mess
	THRU.setSceneDispose( [ GBX.surfaceMeshes, GBX.surfaceOpenings, GBX.surfaceEdgesThreejs, GBX.boundingBox, THRU.helperNormalsFaces, THRU.groundHelper ] );

	//THR.scene.remove( GBX.surfaceOpenings, GBX.surfaceEdgesThreejs );
	GBX.surfaceEdgesThreejs = [];
	GBX.surfaceOpenings = [];
	GBX.boundingBox = undefined;

	if ( GBX.surfaceGroup ) {

		THR.scene.remove( GBX.surfaceGroup );

		GBX.surfaceGroup.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh ) {

				child.geometry.dispose();
				child.material.dispose();

				//THR.scene.remove( child );

			} else if ( ( child instanceof THREE.LineSegments )  ) {

				child.geometry.dispose();
				child.material.dispose();

			}

		} );

	}


	GBX.text = gbxml.replace( /\r\n|\n/g, '' );
	//console.log( 'GBX.text', GBX.text );

	const reSurface = /<Surface(.*?)<\/surface>/gi;
	GBX.surfaces = GBX.text.match( reSurface );
	//console.log( 'GBX.surfaces', GBX.surfaces );

	//GBX.surfacesIndexed = GBX.surfaces.map( ( surface, index ) => `indexGbx="${ index }"` + surface );

	const meshes = GBX.getSurfaceMeshes( GBX.surfaces );

	GBX.surfaceGroup = new THREE.Group();
	GBX.surfaceGroup.name = 'GBX.surfaceGroup';
	GBX.surfaceGroup.add( ...meshes );

	THR.scene.add( GBX.surfaceGroup );

	const event = new Event( 'onGbxParse' );
	document.body.dispatchEvent( event );
	//use this: document.body.addEventListener( 'onGbxParse', yourFunction, false );

	return GBX.surfaces.length;

};



GBX.getSurfaceMeshes = function( surfaces ) {
	// console.log( 'surfaces', surfaces );

	GBX.materialType = THR.scene.getObjectByName( 'lightAmbient') ? THREE.MeshPhongMaterial : THREE.MeshBasicMaterial;
	//GBX.materialType = THREE.MeshBasicMaterial;

	const meshes = surfaces.map( ( surface ) => {

		const polyLoops = GBX.getPolyLoops( surface );
		//console.log( 'polyLoops', polyLoops );

		const coordinates = GBX.getCoordinates( polyLoops[ 0 ] );

/*		// Never?? happens
 		if ( coordinates.length < 9 ) { // for testing

			console.log( 'polyLoops[ 0 ]', polyLoops[ 0 ] );
			console.log( 'coordinates', coordinates );

		}
*/

		const index = GBX.surfaces.indexOf( surface );
		//console.log( 'index', index );

		const openings =  polyLoops.slice( 1 ).map( polyLoop => GBX.getCoordinates( polyLoop ) );

		const mesh = GBX.getSurfaceMesh( coordinates, index, openings );

		return mesh;

	} );

	return meshes;

};



GBX.getPolyLoops = function( surface ) {
	//console.log( 'surface', surface );

	const re = /<PlanarGeometry(.*?)<polyloop(.*?)<\/polyloop>/gi;
	const polyloopText = surface.match( re );

	//if ( !polyloopText ) { console.log( 'polyloopText', polyloopText, surface ) }

	const polyloops = polyloopText.map( polyloop => polyloop.replace(/<\/?polyloop>/gi, '' ) );

	return polyloops;

};



GBX.getCoordinates = function( surface ) {

	const re = /<coordinate(.*?)<\/coordinate>/gi;
	const coordinatesText = surface.match( re );
	const coordinates = coordinatesText.map( coordinate => coordinate.replace(/<\/?coordinate>/gi, '' ) )
		.map( txt => Number( txt ) );

	return coordinates;

};



GBX.getSurfaceMesh = function( arr, index, holes ) {
	//console.log( 'array', arr, 'index', index );

	const string = GBX.surfaces[ index ].match( 'surfaceType="(.*?)"')[ 1 ];
	const color = new THREE.Color( GBX.colorsDefault[ string ] );
	//console.log( 'color', color );

	const v = ( arr ) => new THREE.Vector3().fromArray( arr );

	let vertices, mesh;

	if ( arr.length < 6 ) {

		console.log( 'not enough to draw a line', arr );
		return;

	} else if ( arr.length < 9 ) {
		//console.log( 'Try to draw a line', arr );

		vertices = [ v( arr.slice( 0, 3 ) ), v( arr.slice( 3, 6 ) ), v( arr.slice( 0, 3 ) ) ];
		//console.log( 'vertices', vertices );

		mesh = GBX.getBufferGeometry( vertices, color );

		return;

	} else if ( arr.length === 9 ) {

		vertices = [ v( arr.slice( 0, 3 ) ), v( arr.slice( 3, 6 ) ), v( arr.slice( 6 ) ) ];

		mesh = GBX.getBufferGeometry( vertices, color );

	} else if ( arr.length === 12 && holes.length === 0 ) {

			vertices = [

				v( arr.slice( 0, 3 ) ), v( arr.slice( 3, 6 ) ), v( arr.slice( 6, 9 ) ),
				v( arr.slice( 0, 3 ) ),  v( arr.slice( 6, 9 ) ), v( arr.slice( 9, 12 ) )

			];

			mesh = GBX.getBufferGeometry( vertices, color );

	} else {

		const vertices = [];

		for ( let i = 0; i < ( arr.length / 3 ); i ++ ) {

			vertices.push( v( arr.slice( 3 * i, 3 * i + 3 ) )  );

		}
		//console.log( 'vertices', vertices );

		const verticesHoles = [];

		for ( let i = 0; i < holes.length; i ++ ) {

			const hole = holes[ i ];
			const vertices= [];

			for ( let j = 0; j < ( hole.length / 3 ); j ++ ) {

				vertices.push( v( hole.slice( 3 * j, 3 * j + 3 ) ) );

			}

			verticesHoles.push( vertices );
			//console.log( '', vertices, verticesHoles );

		}

		mesh = GBX.setPolygon( vertices, color, verticesHoles );

	}

	mesh.visible = false;
	mesh.castShadow = mesh.receiveShadow = true;
	mesh.userData.index = index;

	return mesh;

};



GBX.getBufferGeometry = function( vertices, color ) {
	//console.log( 'vertices', vertices, color );

	const geometry = new THREE.BufferGeometry();
	geometry.setFromPoints( vertices );
	geometry.computeVertexNormals();

	const material = new GBX.materialType( { color: color, opacity: GBX.opacity, side: 2, transparent: true });

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

	holes.forEach( verticesHoles => verticesHoles.forEach( vertex => GBX.referenceObject.localToWorld( vertex ) ) );

	// vertices must be coplanar with the XY plane for Earcut.js to triangulate a set of points
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

	const material = new GBX.materialType( { color: color, opacity: GBX.opacity, side: 2, transparent: true } );

	const mesh = new THREE.Mesh( geometry, material );
	mesh.lookAt( plane.normal );

	return mesh;

};



GBX.getPlane = function( points, start = 0 ) {
	//console.log( 'points', points, start );

	GBX.triangle.set( points[ start ], points[ start + 1 ], points[ start + 2 ] );

	if ( GBX.triangle.getArea() === 0 && ( ++start < points.length - 2 ) ) { // looks like points are colinear and do not form a plane therefore try next set of points

		GBX.getPlane( points, start );

	}

	return GBX.triangle.getPlane( new THREE.Plane() );

};