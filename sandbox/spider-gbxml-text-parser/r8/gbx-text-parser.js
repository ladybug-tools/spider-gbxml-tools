// Copyright 2018 Ladybug Tools authors. MIT License
// jshint esversion: 6
/* globals THREE, THR, THRU, timeStart, divReports */

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



GBX.getStats = function() {

	const reSpaces = /<Space(.*?)<\/Space>/gi;
	GBX.spaces = GBX.text.match( reSpaces );
	//console.log( 'spaces', spaces );

	const reStoreys = /<BuildingStorey(.*?)<\/BuildingStorey>/gi;
	GBX.storeys = GBX.text.match( reStoreys );
	//console.log( 'GBX.storeys', GBX.storeys );

	const reZones = /<Zone(.*?)<\/Zone>/gi;
	GBX.zones = GBX.text.match( reZones );
	//console.log( 'GBX.zones', GBX.zones );

	const verticesCount = GBX.surfaces.map( surfaces => GBX.getVertices( surfaces ) );
	//console.log( 'vertices', vertices );

	const count = verticesCount.reduce( ( count, val, index ) => count + verticesCount[ index ].length, 0 );

	const timeToLoad = performance.now() - GBX.timeStart;

	const htm =
	`
			<div>time to parse: ${ parseInt( timeToLoad, 10 ).toLocaleString() } ms</div>
			<div>spaces: ${ GBX.spaces.length.toLocaleString() } </div>
			<div>storeys: ${ GBX.storeys.length.toLocaleString() } </div>
			<div>zones: ${ GBX.zones.length.toLocaleString() } </div>
			<div>surfaces: ${ GBX.surfaces.length.toLocaleString() } </div>
			<div>coordinates: ${ count.toLocaleString() } </div>
	`;

	return htm;

};



GBX.getReports = function() {

	const types = GBX.surfaceTypes.filter( type => GBX.surfaces.find( surface => surface.includes( type ) ) );

	let colors =  types.map( type => GBX.colorsDefault[ type ].toString( 16 ) );
	colors = colors.map( color => color.length > 4 ? color : '00' + color ); // otherwise greens no show
	//console.log( 'col', colors );

	buttonSurfaceTypes = types.map( ( type, index ) =>
		`<button selected=true class=butReport onclick=GBX.setSurfacesFiltered("${ type }",divReports,this);
			style="background-color:#${ colors[ index] };" > ${ type } </button>`
	);

	const htm =
	`
		<p>Show by surface type ${ buttonSurfaceTypes.join( '<br>' ) }</p>

		<p>
			<button id=butExterior onclick=GBX.toggleExteriorSurfaces(this);
				style= "background-color: pink; font-style: bold; "; >exterior surfaces</button>
			<button id=butExposed onclick=GBX.setSurfacesFiltered('exposedToSun="true"',divReports,this); >exposed to sun</button>
		</p>

		<p>
			<button onclick=GBX.setSurfacesFiltered(["Tilt&gt;0","Tilt&gt;180"],divReports,this); >horizontal</button>

			<button onclick=GBX.setSurfacesFiltered("Tilt&gt;90",divReports,this); >vertical</button>
		</p>

	`;

	return htm;

};



GBX.setSurfacesFiltered = function( filters, target, button) {

	const buttons = target.querySelectorAll( "button" );
	buttons.forEach( button => button.style.cssText = '' );

	if ( button ) button.style.cssText = "background-color: pink; font-style: bold; ";

	filters = Array.isArray( filters ) ? filters : [ filters ];
	//console.log( 'filters', filters );

	GBX.surfacesFiltered = [];

	filters.map( filter => {

		GBX.surfacesFiltered.push( ...GBX.surfaces.filter( surface => surface.includes( `${ filter }` ) ) );

	} );
	//console.log( 'GBX.surfacesFiltered',  GBX.surfacesFiltered );


	GBX.sendSurfacesToThreeJs( GBX.surfacesFiltered );

};



GBX.toggleExteriorSurfaces = function( target, button ) {

	buttons = Array.from( target.querySelectorAll( "button" ) );
	buttons.forEach( button => button.style.cssText = '' );
	//console.log( 'buttons', buttons );

	if ( button ) {

		button.style.cssText = "background-color: pink; font-style: bold; ";

	}

	GBX.surfacesFiltered = GBX.surfaces.filter(
		surface => surface.includes( '"Roof"' ) ||
		surface.includes( '"ExteriorWall"' ) ||
		surface.includes( '"ExposedFloor"' ) ||
		surface.includes( '"Air"' ) ||
		surface.includes( '"Shade"' )
	);
	//console.log( 'GBX.surfacesFiltered', GBX.surfacesFiltered );


	GBX.sendSurfacesToThreeJs( GBX.surfacesFiltered );


};



//////////

GBX.sendSurfacesToThreeJs = function( surfaces ) {
	//console.log( 'surfaces', surfaces );

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

	vertices.forEach( ( arr, index ) => GBX.getSurfaceMeshes( arr, index ) );

	THR.scene.add( GBX.surfaceMeshes );

	THRU.zoomObjectBoundingSphere( GBX.surfaceMeshes );

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



GBX.getSurfaceMeshes = function( arr, index ) {
	//console.log( 'array', arr, index );

	const v = ( arr ) => new THREE.Vector3().fromArray( arr );

	let vertices, mesh;

	if ( arr.length === 6 ) {

		// draw a line?

		vertices = [ v( arr.slice( 0, 3 ) ), v( arr.slice( 3, 6 ) ) ];

		mesh = GBX.BufferGeometry( vertices, index );

		console.log( 'mesh', mesh );

	} else if ( arr.length === 9 ) {

		vertices = [ v( arr.slice( 0, 3 ) ), v( arr.slice( 3, 6 ) ), v( arr.slice( 6 ) ) ];

		mesh = GBX.BufferGeometry( vertices, index );

	} else if ( arr.length === 12 ) {

		vertices = [

			v( arr.slice( 0, 3 ) ), v( arr.slice( 3, 6 ) ), v( arr.slice( 6, 9 ) ),
			v( arr.slice( 9, 12 ) ), v( arr.slice( 6, 9 ) ), v( arr.slice( 0, 3 ) )

		];

		mesh = GBX.BufferGeometry( vertices, index );

	} else {

		vertices = [];

		for ( let i = 0; i < ( arr.length / 3 ); i ++ ) {

			vertices.push( v( arr.slice( 3 * i, 3 * i + 3 ) ) );

		}

		mesh = GBX.setPolygon( vertices, index );

	}

	GBX.surfaceMeshes.add( mesh );

	//console.log( 'GBX.surfaceMeshes', GBX.surfaceMeshes );

};



GBX.BufferGeometry = function( vertices, index ) {
	//console.log( 'vertices', vertices );

	//color = GBX.surfacesFiltered[ index ].match( /surfaceType="(.*)" / );

	//str1 = GBX.surfacesFiltered[ index ].slice( 22 );
	//str2 = str1.slice( 0, str1.indexOf( '"' ) );

	str2 = GBX.surfacesFiltered[ index ].match( 'surfaceType="(.*?)"')[  1 ];
	const color = new THREE.Color( GBX.colorsDefault[ str2 ] );

	//console.log( 'color', color );

	const geometry = new THREE.BufferGeometry();
	geometry.setFromPoints( vertices );

	geometry.computeVertexNormals();
	const material = new GBX.materialType( { color: color, opacity: 0.85, side: 2, transparent: true });

	const mesh = new THREE.Mesh( geometry, material );

	return mesh;

};



GBX.setPolygon = function( vertices, index, holes = [] ) {
	//console.log( { vertices } );

	//assume vertices are coplanar but at an arbitrary rotation and position in space
	const plane = GBX.getPlane( vertices );

	// rotate vertices to lie on XY plane
	GBX.referenceObject.lookAt( plane.normal ); // copy the rotation of the plane
	GBX.referenceObject.quaternion.conjugate(); // figure out the angle it takes to rotate the vertices so they lie on the XY plane
	GBX.referenceObject.updateMatrixWorld();

	const verticesFlat = vertices.map( vertex => GBX.referenceObject.localToWorld( vertex ) );
	//console.log( { verticesFlat } );

/* 	for ( let verticesHoles of holes ) {

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

	str1 = GBX.surfacesFiltered[ index ].slice( 22 );
	str2 = str1.slice( 0, str1.indexOf( '"' ) );
	const color = new THREE.Color( GBX.colorsDefault[ str2 ] );

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


