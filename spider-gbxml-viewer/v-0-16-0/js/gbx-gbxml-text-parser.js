// Copyright 2018 Ladybug Tools authors. MIT License
// jshint esversion: 6
/* globals THREE, THR, THRU, FOB, GBXU */

var GBX = { "version": "0.16.0", "date": "2019-06-11" };

GBX.filtersDefault = [ "Roof", "ExteriorWall", "ExposedFloor", "Air", "Shade" ];

let step = 1000;
let count = 0;
let max = 5000;
let misses = 0;
let deltaLimit = 20;
let lastTimestamp = performance.now();

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

GBX.referenceObject = new THREE.Object3D();
GBX.triangle = new THREE.Triangle(); // used by GBX.getPlane


GBX.getDivMenuGbx = function() {

	//change to custom event with data passing via event details
	FOB.xhr.addEventListener( 'load', GBX.onXhrResponse, false );
	FOB.reader.addEventListener( 'load', GBX.onReaderResult, false );
	document.body.addEventListener( 'onZipFileParse', GBX.onFileZipLoad, false );

	GBXU.init();


};



GBX.onXhrResponse = function( event ) { GBX.parseFile( event.target.response  ); };

GBX.onReaderResult = function() { GBX.parseFile( FOB.reader.result ); };

GBX.onFileZipLoad = function() { GBX.parseFile( FOB.text ); };



GBX.parseFile = function( gbxml )  {

	if ( !gbxml || gbxml.includes( "xmlns" ) === false ) { return; }
	//console.log( 'gbxml', gbxml );

	//GBXdetStats.open = gbxml.length > 10000000 ? true : false;

	GBXdivStatsGbx.innerHTML = '';
	GBXdivStatsThr.innerHTML = '';


	THRU.setSceneDispose( [ GBX.surfaceMeshes, GBX.surfaceOpenings, GBX.surfaceEdgesThreejs, GBX.boundingBox, THRU.helperNormalsFaces, THRU.groundHelper ] );

	//THR.scene.remove( GBX.surfaceOpenings, GBX.surfaceEdgesThreejs );
	GBX.surfaceEdgesThreejs = [];
	GBX.surfaceOpenings = [];

	//THR.scene.remove( GBX.boundingBox );
	GBX.boundingBox = undefined;
	THRU.groundHelper = undefined;

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

	GBX.surfacesIndexed = GBX.surfaces.map( ( surface, index ) => `indexGbx="${ index }"` + surface );

	const meshes = GBX.getSurfaceMeshes( GBX.surfacesIndexed );

	GBX.surfaceGroup.add( ...meshes );

	GBX.setSurfaceTypesVisible( GBX.filtersDefault );

	SET.toggleOpenings();

	THR.controls.autoRotate = true;
	THRU.zoomObjectBoundingSphere( GBX.boundingBox );

	GBXU.toggleGroundHelper();
	THRU.groundHelper.visible = true;

	const event = new Event( 'onGbxParse' );
	document.body.dispatchEvent( event );
	//use this: document.body.addEventListener( 'onGbxParse', yourFunction, false );

	return GBX.surfaces.length;

};



GBX.setSurfaceTypesVisible = function ( typesArray ) {

	//console.log( 'typesArray', typesArray );

	//GBX.surfacesFiltered = typesArray.flatMap( filter =>

	//	GBX.surfacesIndexed.filter( surface => surface.includes( `"${ filter }"` ) )

	//);


	// polyfill for MS Edge
	GBX.surfacesFiltered = typesArray.reduce( ( acc, filter ) => acc.concat(

		GBX.surfacesIndexed.filter( surface => surface.includes( `"${ filter }"` ) )

	), [] );

	//divReportsLog.innerHTML =
	GBX.sendSurfacesToThreeJs( GBX.surfacesFiltered );

};



//////////

GBX.sendSurfacesToThreeJs = function( surfacesText ) {
	//console.log( 'surfacesText', surfacesText );

	GBX.surfaceGroup.children.forEach( ( surface, index ) => {

		surface.visible = false;

	} );
	//const timeStart = performance.now();

	THR.controls.autoRotate = false;

	GBX.surfacesTmp = surfacesText;

	step = 1000;
	count = 0;
	max = 5000;
	misses = 0;
	deltaLimit = 20;
	lastTimestamp = performance.now();

	GBX.addMeshes( performance.now() );

	//console.log( 'ttt', ( performance.now() - timeStart) );

	if ( !GBX.boundingBox ) {

		const bbox = new THREE.Box3().setFromObject( GBX.surfaceGroup );
		GBX.boundingBox = new THREE.Box3Helper( bbox, 0xffff00 );
		THR.scene.add( GBX.boundingBox );

	}

	//THRU.zoomObjectBoundingSphere( GBX.boundingBox );

	//GBXU.toggleGroundHelper();

	const txt = !surfacesText.length ? "<span class='highlight' >No surfaces are visible</span>" : surfacesText.length.toLocaleString() + ' surfaces visible';

	return txt;

};



 GBX.addMeshes = function( timestamp ) {

	if ( count < GBX.surfacesTmp.length ) {
		//console.log( 'count', count );

		const delta = timestamp - lastTimestamp;
		lastTimestamp = timestamp;

		if ( delta < deltaLimit ) {

			GBX.surfacesTmp.slice( count, count + step ).forEach( surface => {

				const index = surface.match( 'indexGbx="(.*?)"' )[ 1 ];
				GBX.surfaceGroup.children[ index ].visible = true;

			} );

			count += step;

			count = count > GBX.surfacesTmp.length ? GBX.surfacesTmp.length : count;

		} else {

			if ( misses > 3 ) {

				deltaLimit += 20;
				misses = 0;

			}

			misses ++;

		}


		GBXdivStatsThr.innerHTML =
		`
			<hr>
			<b>Current scene rendering data</b><br>
			surfaces rendered: ${ count.toLocaleString() } of ${ GBX.surfacesTmp.length.toLocaleString() } <br>
			time to render: ${ delta.toLocaleString() } ms<br>
			took too long: ${ misses }<br>
			time allocated frame: ${ deltaLimit } ms<br>
			total time elapsed: ${ ( performance.now() - FOB.timeStart ).toLocaleString() } ms
		`;

		requestAnimationFrame( GBX.addMeshes );

	} else {

		//THR.controls.autoRotate = true;

	}

};



GBX.getSurfaceMeshes = function( surfaces ) {
	// console.log( 'surfaces', surfaces );

	const meshes = surfaces.map( ( surface ) => {

		const polyLoops = GBX.getPolyLoops( surface );
		//console.log( 'polyLoops', polyLoops );

		const vertices = GBX.getVertices( polyLoops[ 0 ] );

		if ( vertices.length < 9 ) {

			console.log( 'polyLoops[ 0 ]', polyLoops[ 0 ] );
			console.log( 'vertices', vertices );

		}

		const index = surface.match( 'indexGbx="(.*?)"' )[ 1 ];

		const mesh = GBX.getSurfaceMesh( vertices, index );

		if ( mesh ) {

			mesh.castShadow = mesh.receiveShadow = true;
			mesh.userData.index = index;

		}

		return mesh;

	} );

	return meshes;

};



GBX.getPolyLoops = function( surface ) {
	//console.log( 'surface', surface );

	const re = /<PlanarGeometry(.*?)<polyloop(.*?)<\/polyloop>/gi;
	const polyloopText = surface.match( re );

	if ( !polyloopText ) { console.log( 'polyloopText', polyloopText, surface ) }
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

		console.log( 'arr', arr );
		return;

	} else if ( arr.length < 9 ) {
		//console.log( 'arr', arr );

		// draw a line?
		vertices = [ v( arr.slice( 0, 3 ) ), v( arr.slice( 3, 6 ) ), v( arr.slice( 0, 3 ) ) ];
		//console.log( 'vertices', vertices );

		mesh = GBX.getBufferGeometry( vertices, color );

		return;

	} else if ( arr.length === 9 ) {

		vertices = [ v( arr.slice( 0, 3 ) ), v( arr.slice( 3, 6 ) ), v( arr.slice( 6 ) ) ];

		mesh = GBX.getBufferGeometry( vertices, color );

	} else if ( arr.length === 12 ) {

		vertices = [

			v( arr.slice( 0, 3 ) ), v( arr.slice( 3, 6 ) ), v( arr.slice( 6, 9 ) ),
			v( arr.slice( 0, 3 ) ),  v( arr.slice( 6, 9 ) ), v( arr.slice( 9, 12 ) )

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



