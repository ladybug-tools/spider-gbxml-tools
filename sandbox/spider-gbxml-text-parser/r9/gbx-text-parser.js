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

	THR.scene.remove( GBX.surfaceOpenings, GBX.surfaceEdgesThreejs );
	GBX.surfaceEdgesThreejs = [];
	GBX.surfaceOpenings = [];

	THR.scene.remove( GBX.boundingBox );
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


	GBX.surfaceGroup = new THREE.Group();
	GBX.surfaceGroup.name = 'GBX.surfaceGroup';
	THR.scene.add( GBX.surfaceGroup );

	GBX.materialType = THR.scene.getObjectByName( 'lightAmbient') ? THREE.MeshPhongMaterial : THREE.MeshBasicMaterial;
	//GBX.materialType = THREE.MeshBasicMaterial;

	GBX.text = gbxml.replace( /\r\n|\n/g, '' );
	//console.log( 'GBX.text', GBX.text );

	GBX.timeStart = performance.now();

	const reSurface = /<Surface(.*?)<\/surface>/gi;
	GBX.surfaces = GBX.text.match( reSurface );
	//console.log( 'GBX.surfaces', GBX.surfaces );

	GBX.surfacesIndexed= GBX.surfaces.map( ( surface, index ) => `indexGbx="${ index }"` + surface );

	const meshes = GBX.getSurfaceMeshes( GBX.surfacesIndexed );

	GBX.surfaceGroup.add( ...meshes );

	return GBX.surfaces.length;

};



//////////

GBX.sendSurfacesToThreeJs = function( surfacesText ) {
	//console.log( 'surfacesText', surfacesText );

	if ( !surfacesText.length ) { return "<span class='highlight' >No surfaces would be visible</spab>"; }

	GBX.surfaceGroup.children.forEach( ( surface, index ) => {
		surface.visible = false;
	} );

	surfacesText.forEach( surface => {

		const index = surface.match( 'indexGbx="(.*?)"' )[ 1 ];
		GBX.surfaceGroup.children[ index ].visible = true;

	} );

	if ( !GBX.boundingBox ) {

		const bbox = new THREE.Box3().setFromObject( GBX.surfaceGroup );
		GBX.boundingBox = new THREE.Box3Helper( bbox, 0xffff00 );
		THR.scene.add( GBX.boundingBox );

	}

	THRU.zoomObjectBoundingSphere( GBX.boundingBox );

	return surfacesText.length.toLocaleString() + ' surfaces visible';

};



GBX.getSurfaceMeshes = function( surfaces ) {

	const meshes = surfaces.map( ( surface ) => {

		const polyLoops = GBX.getPolyLoops( surface );
		//console.log( 'polyLoops', polyLoops );

		const vertices = GBX.getVertices( polyLoops[ 0 ] );
		//console.log( 'vertices', vertices );

		const index = surface.match( 'indexGbx="(.*?)"' )[ 1 ];

		const mesh = GBX.getSurfaceMesh( vertices, index );
		mesh.castShadow = mesh.receiveShadow = true;
		mesh.userData.index = index;

		return mesh;

	} );

	return meshes;

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
	//console.log( 'array', arr, 'index', index );

	const string = GBX.surfaces[ index ].match( 'surfaceType="(.*?)"')[ 1 ];
	const color = new THREE.Color( GBX.colorsDefault[ string ] );
	//console.log( 'color', color );

	const v = ( arr ) => new THREE.Vector3().fromArray( arr );

	let vertices, mesh;

	if ( arr.length < 6 ) {

		console.log( 'mesh', mesh );
		return;

	} else if ( arr.length < 9 ) {

		// draw a line?

		vertices = [ v( arr.slice( 0, 3 ) ), v( arr.slice( 3, 6 ) ) ];

		console.log( 'mesh', mesh );

		return;

	} else if ( arr.length === 9 ) {

		vertices = [ v( arr.slice( 0, 3 ) ), v( arr.slice( 3, 6 ) ), v( arr.slice( 6 ) ) ];

		mesh = GBX.getBufferGeometry( vertices, color );

	} else if ( arr.length === 12 ) {

		vertices = [

			v( arr.slice( 0, 3 ) ), v( arr.slice( 3, 6 ) ), v( arr.slice( 6, 9 ) ),
			v( arr.slice( 9, 12 ) ), v( arr.slice( 6, 9 ) ), v( arr.slice( 0, 3 ) )

		];

		mesh = GBX.getBufferGeometry( vertices, color );

	} else {

		vertices = [];

		for ( let i = 0; i < ( arr.length / 3 ); i ++ ) {

			vertices.push( v( arr.slice( 3 * i, 3 * i + 3 ) ) );

		}

		mesh = GBX.setPolygon( vertices, color );

	}

	return mesh;

};



GBX.getBufferGeometry = function( vertices, color ) {
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

	/*
	for ( let verticesHoles of holes ) {

		verticesHoles.forEach( vertex => GBX.referenceObject.localToWorld( vertex ) );

	}

	holes.forEach( verticesHoles => verticesHoles.forEach( vertex => GBX.referenceObject.localToWorld( vertex ) ) );
	*/

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

	const material = new GBX.materialType( { color: color, opacity: 0.85, side: 2, transparent: true } );

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



GBX.getSurfaceEdgesThreejs = function() {

	const surfaceEdges = [];
	const lineMaterial = new THREE.LineBasicMaterial( { color: 0x888888 } );

	for ( let mesh of GBX.surfaceGroup.children ) {

		mesh.userData.edges = mesh;
		const edgesGeometry = new THREE.EdgesGeometry( mesh.geometry );
		const surfaceEdge = new THREE.LineSegments( edgesGeometry, lineMaterial );
		surfaceEdge.rotation.copy( mesh.rotation );
		surfaceEdge.position.copy( mesh.position );
		surfaceEdges.push( surfaceEdge );

	}

	//console.log( 'surfaceEdges', surfaceEdges );
	//THR.scene.add( ...surfaceEdges );

	return surfaceEdges;

};



GBX.getSurfaceOpenings = function() {

	const v = ( arr ) => new THREE.Vector3().fromArray( arr );

	const material = new THREE.LineBasicMaterial( { color: 0x444444, linewidth: 2, transparent: true } );
	const surfaceOpenings = [];

	for ( let surfaceText of GBX.surfaces ) {

		const reSurface = /<Opening(.*?)<\/Opening>/g;
		openings = surfaceText.match( reSurface );

		//console.log( 'o', openings );

		if ( !openings ) { continue; }

		for ( let opening of openings ) {

			polyloops = GBX.getPolyLoops( opening );

			//console.log( 'bb', polyloops );

			for ( let polyloop of polyloops ) {

				coordinates = GBX.getVertices( polyloop );

				//console.log( 'coordinates', coordinates );

				vertices = [];

				for ( let i = 0; i < ( coordinates.length / 3 ); i ++ ) {

					vertices.push( v( coordinates.slice( 3 * i, 3 * i + 3 ) ) );

				}

				//console.log( 'vertices', vertices );

				const geometry = new THREE.Geometry().setFromPoints( vertices )
				//console.log( 'geometry', geometry );

				const line = new THREE.LineLoop( geometry, material );
				surfaceOpenings.push( line );

			}
		}

	}

	//THR.scene.add( surfaceOpenings );

	return surfaceOpenings;

};



GBX.xxxgetSurfaceEdges = function( surfaces ) {

	const meshes = surfaces.map( ( surface ) => {

		const polyLoops = GBX.getPolyLoops( surface );
		//console.log( 'polyLoops', polyLoops );

		const vertices = GBX.getVertices( polyLoops[ 0 ] );
		//console.log( 'vertices', vertices );

		const index = surface.match( 'indexGbx="(.*?)"' )[ 1 ];

		const mesh = GBX.getSurfaceMesh( vertices, index );
		mesh.castShadow = mesh.receiveShadow = true;
		mesh.userData.index = index;

		return mesh;

	} );

	return meshes;

};