// Copyright 2018 Ladybug Tools authors. MIT License
/* globals THREE */
/* jshint esversion: 6 */


var GBX = { release: "2018-10-05"};

GBX.gbxml = null;
GBX.gbjson = null; // xml converted to json
GBX.surfacesJson = null; // useful subset of GBX.gbjson

GBX.surfaceMeshes= null; // Three.js Shapes as Meshes created from GBX.surfaceJson
GBX.surfaceEdges= null; // Three.js edges helper created from GBX.surfaceMeshes
GBX.surfaceOpenings= null; // Three.js Three.js Shapes as Meshes created created from GBX.surfaceJson with Openings

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


// loads any xml file - from AJAX, file reader or location hash or wherever

GBX.parseFileXML = function( text ) { // called by main HTML file
	//console.log( 'text', text );

	const parser = new window.DOMParser();

	GBX.materialType = THR.scene.getObjectByName( 'lightAmbient') ?
		THREE.MeshPhongMaterial
		:
		THREE.MeshBasicMaterial
	;

	GBX.triangleVertices = [];
	GBX.triangleColors = [];
	GBX.triangleParent = [];

	GBX.openingVertices = [];
	GBX.openingColors = [];

	GBX.count3 = 0;
	GBX.count4 = 0;
	GBX.count5plus = 0;
	GBX.countOpenings = 0;
	GBX.gbxml = parser.parseFromString( text, 'text/xml' );
	//console.log( 'GBX.gbxml', GBX.gbxml );

	GBX.gbjson = GBX.getXML2jsobj( GBX.gbxml.documentElement );
	//console.log( 'GBX.gbjson', GBX.gbjson );

	GBX.surfacesJson = GBX.gbjson.Campus.Surface; // useful subset

	GBX.surfaceMeshes = new THREE.Group();
	GBX.surfaceMeshes.name = 'GBX.surfaceMeshes';
	GBX.getSurfaceMeshes();

	GBX.surfaceEdges = new THREE.Group();
	GBX.surfaceEdges.name = 'GBX.surfaceEdges';
	//GBX.surfaceEdges.add( ...GBX.getSurfaceEdges() );

	GBX.surfaceOpenings = new THREE.Group();
	GBX.surfaceOpenings.name = 'GBX.surfaceOpenings';
	//GBX.surfaceOpenings.add( ...GBX.getOpenings() );

	return [ GBX.surfaceMeshes, GBX.surfaceEdges, GBX.surfaceOpenings ];
	//return [ GBX.surfaceOpenings ];

};



GBX.getStringFromXml = function( xml ){ // used by??
	// test in console : GBX.getStringFromXml( GBX.gbxml );

	const string = new XMLSerializer().serializeToString( xml );
	console.log( 'string', string );

	return string;

};



// https://www.sitepoint.com/how-to-convert-xml-to-a-javascript-object/
// http://blogs.sitepointstatic.com/examples/tech/xml2json/index.html
// Theo: I have difficulty understanding how this function actually functions

GBX.getXML2jsobj = function( node ) {

	let data = {};

	function Add( name, value ) {

		if ( data[ name ] ) {

			if ( data[ name ].constructor !== Array ) {

				data[ name ] = [ data[ name ] ];

			}

			data[ name ][ data[ name ].length ] = value;

		} else {

			data[ name ] = value;

		}

	}

	let child, childNode;

	for ( child = 0; childNode = node.attributes[ child ]; child++ ) {

		Add( childNode.name, childNode.value );

	}

	for ( child = 0; childNode = node.childNodes[ child ]; child++ ) {

		if ( childNode.nodeType === 1 ) {

			if ( childNode.childNodes.length === 1 && childNode.firstChild.nodeType === 3 ) { // text value

				Add( childNode.nodeName, childNode.firstChild.nodeValue );

			} else { // sub-object

				Add( childNode.nodeName, GBX.getXML2jsobj( childNode ) );

			}

		}

	}

	return data;

};



GBX.getSurfaceMeshes = function() {

	const surfaces = GBX.surfacesJson; // gbjson.Campus.Surface;
	//const surfaceMeshes = [];

	for ( let surface of surfaces ) {

		const holes = [];
		let openings = surface.Opening;

		if ( openings ) {

			openings = Array.isArray( openings ) ? openings : [ openings ];

			for ( let opening of openings ) {

				const polyloop = opening.PlanarGeometry.PolyLoop;
				const vertices = GBX.getVertices( polyloop );
				holes.push( vertices );
				GBX.countOpenings++;

			}

		}

		const polyloop = surface.PlanarGeometry.PolyLoop;
		const vertices = GBX.getVertices( polyloop );

		const len = vertices.length;
		const col = GBX.colors[ surface.surfaceType ] || GBX.colors.Undefined;
		const color = new THREE.Color( col );

		if ( len <= 3 ) {
			//console.log( 'vertices', vertices );

			GBX.count3++;
			GBX.setTriangle( vertices, color );

		} else if ( len === 4 && !openings ) {

			GBX.count4++;
			GBX.setQuad( vertices, color );

		} else {

			GBX.count5plus ++;
			GBX.setPolygon( vertices, color, holes );

		}

	}

};



GBX.getVertices = function( polyloop ) {

	const points = polyloop.CartesianPoint.map( CartesianPoint => new THREE.Vector3().fromArray( CartesianPoint.Coordinate ) );
	return points;

};



GBX.setTriangle = function( vertices, color ) {
	//console.log( 'vertices', vertices );
	//console.log( 'color', color );

	const geometry = new THREE.BufferGeometry();
	geometry.setFromPoints( vertices );
	geometry.computeVertexNormals();

	const material = new GBX.materialType( { color: color, side: 2, opacity: 0.85, transparent: true } );

	const mesh = new THREE.Mesh( geometry, material );
	mesh.castShadow = mesh.receiveShadow = true;

	GBX.surfaceMeshes.add( mesh );

};



GBX.setQuad = function( vertices, color ){

	const verticesRemix = vertices.slice( 0, 3 ).concat( [ vertices[ 3 ], vertices[ 2 ], vertices[ 0 ] ] );
	GBX.setTriangle( verticesRemix, color );
	// or how about a PlaneBufferGeometry??

};



GBX.setPolygon = function( vertices, color, holes = [] ) {
	//console.log( { holes } );

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

	const material = new GBX.materialType( { color: color, opacity: 0.85, side: 2, transparent: true } );

	const mesh = new THREE.Mesh( geometry, material );
	mesh.castShadow = mesh.receiveShadow = true;
	mesh.lookAt( plane.normal );

	GBX.surfaceMeshes.add( mesh );

};



GBX.getPlane = function( points, start = 0 ) {

	GBX.triangle.set( points[ start ], points[ start + 1 ], points[ start + 2 ] );

	if ( GBX.triangle.getArea() === 0 ) { // looks like points are colinear and do not form a plane therefore try next set of points

		GBX.getPlane( points, ++start );

	}


	return GBX.triangle.getPlane( new THREE.Plane() );

};



//////////

GBX.getSurfaceEdges = function() {

	const surfaceEdges = [];
	const lineMaterial = new THREE.LineBasicMaterial( { color: 0x888888 } );

	for ( let mesh of GBX.surfaceMeshes.children ) {

		mesh.userData.edges = mesh;
		const edgesGeometry = new THREE.EdgesGeometry( mesh.geometry );
		const surfaceEdge = new THREE.LineSegments( edgesGeometry, lineMaterial );
		surfaceEdge.rotation.copy( mesh.rotation );
		surfaceEdge.position.copy( mesh.position );
		surfaceEdges.push( surfaceEdge );

	}

	THR.scene.add( ...surfaceEdges );

	return surfaceEdges;

};

