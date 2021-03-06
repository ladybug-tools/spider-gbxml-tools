/* globals THREE, THR, THRU, GBX */
// jshint esversion: 6

var GBXU = {

	copyright: "Copyright 2019 Ladybug Tools authors. MIT License",
	date: "2019-07-16",
	description: "GbXML utilities: all this is a bit idiosyncratic / a random collection of stuff",
	helpFile: "../js-view-gbxml/gbxu-gbxml-utilities.md",
	license: "MIT License",
	urlSourceCode: "https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/spider-gbxml-viewer/v-0-17-00/js-core-gbxml",
	version: "0.17.00-5gbxu"

};


GBXU.filtersDefault = [ "Air", "ExposedFloor", "ExteriorWall", "RaisedFloor", "Roof",  "Shade" ];



////////// inits & info


GBXU.onGbxParse = function() { // see GBX.parseFile

	GBXU.setSurfaceTypesVisible( GBXU.filtersDefault );

	THRU.toggleBoundingBoxHelper( GBXU.surfaceGroup );

	GBXU.toggleOpenings();

	THRU.zoomObjectBoundingSphere( );

	THRU.toggleAxesHelper();

	//THRU.toggleEdges( GBX.surfaceGroup );

	// needs work
	GBXU.surfaceGroupVisible = new THREE.Object3D();
	const arr = GBX.surfacesFiltered.flatMap( ( surface, index ) => GBX.surfaceGroup.children[ index ].clone() );
	GBXU.surfaceGroupVisible.add( ...arr );
	//console.log( 'GBXU.surfaceGroupVisible', GBXU.surfaceGroupVisible );

	const bbox = new THREE.Box3().setFromObject( GBX.surfaceGroup );
	GBXU.boundingBox = new THREE.Box3Helper( bbox, 0xdddd00 );
	//THR.scene.add( GBXU.boundingBox );

	GBX.elevation = GBXU.boundingBox.box.min.z - 0.001 * THRU.radius;

	THRU.toggleGroundHelper( THRU.center, GBX.elevation );

	THR.controls.autoRotate = true;

	GBXU.setStats();

	window.addEventListener( 'keyup', GBXU.onFirstTouch , false );
	window.addEventListener( 'click', GBXU.onFirstTouch, false );
	window.addEventListener( 'touchstart', GBXU.onFirstTouch, false );

	divMessage.innerHTML = FOB.fileInfo + GBXU.stats;

};



GBXU.onFirstTouch = function() {

	divMessage.innerHTML = "";

	GBXU.sendSurfacesToThreeJs( GBX.surfaces );

	THRU.toggleBoundingBoxHelper();

	GBXU.toggleOpenings();

	THRU.toggleGroundHelper();

	THRU.toggleEdges( GBX.surfaceGroup );

	window.removeEventListener( 'keyup', GBXU.onFirstTouch );
	window.removeEventListener( 'click', GBXU.onFirstTouch );
	window.removeEventListener( 'touchstart', GBXU.onFirstTouch );

};



GBXU.setStats = function( target = "#FOBdivAppStats" ) {

	GBX.openings = [];

	GBX.surfaces.forEach( surface => {

		const openings = surface.match( /<Opening(.*?)<\/Opening>/gi ) || [];

		openings.forEach( opening  => GBX.openings.push(  opening ) );

	} );

	const reSpaces = /<Space(.*?)<\/Space>/gi;
	GBX.spaces = GBX.text.match( reSpaces );
	//console.log( 'spaces', GBX.spaces );

	const reStoreys = /<BuildingStorey(.*?)<\/BuildingStorey>/gi;
	GBX.storeys = GBX.text.match( reStoreys );
	GBX.storeys = Array.isArray( GBX.storeys ) ? GBX.storeys : [];
	//console.log( 'GBX.storeys', GBX.storeys );

	const reZones = /<Zone(.*?)<\/Zone>/gi;
	GBX.zones = GBX.text.match( reZones );
	GBX.zones = Array.isArray( GBX.zones ) ? GBX.zones : [];
	//console.log( 'GBX.zones', GBX.zones );

	//const verticesCount = GBX.surfaces.map( surfaces => GBX.getCoordinates( surfaces ) );
	//console.log( 'vertices', vertices );

	GBX.constructions = GBX.text.match( /<Construction(.*?)<\/Construction>/gi ) || [];

	GBX.layers = GBX.text.match( /<Layer (.*?)<\/Layer>/gi ) || [];

	GBX.materials = GBX.text.match( /<Material (.*?)<\/Material>/gi ) || [];

	GBX.windowTypes = GBX.text.match( /<WindowType (.*?)<\/WindowType>/gi ) || [];

	//const timeToLoad = performance.now() - GBX.timeStart;

	const tag = document.body.querySelectorAll( target );

	if ( tag.length === 0 ) { return; }

	const items = {
		"Surfaces": GBX.surfaces.length,
		"Spaces:": GBX.spaces.length,
		"Storeys": GBX.storeys.length,
		"Zones": GBX.zones.length,
		"Openings": GBX.openings.length,
		//GBX.openingGroup
		"Constructions": GBX.constructions.length,
		"Materials": GBX.materials.length,
		"Layers": GBX.layers.length,
		"Window Types": GBX.windowTypes.length
	};

	const keys = Object.keys( items );
	//console.log( 'keys', keys );

	GBXU.stats =
		`<b>gbXML Statistics</b>` +
		keys.map( key =>
		`<div>
			<span class=attributeTitle >${ key }</span>:
			<span class=attributeValue > ${ items[ key ].toLocaleString() }</span>
		</div>`
	).join( "");

	if ( tag.length > 0 ) { tag[ 0 ].innerHTML = GBXU.stats; }

};



GBXU.getSceneInfo = function() {


	GBXU.sceneInfo = GBX.count3 ?

		`<p>
		<div>triangles: ${ GBX.count3.toLocaleString() }</div>
		<div>quads: ${ GBX.count4.toLocaleString() }</div>
		<div>five+: ${ GBX.count5plus.toLocaleString() }</div>
		<div>openings: ${ GBX.countOpenings.toLocaleString() }</div>
		</p>`
	:
	`
		To be added
	`;

	return GBXU.sceneInfo;

};



////////// Openings

GBXU.getSurfaceOpenings = function() {

	const v = ( arr ) => new THREE.Vector3().fromArray( arr );

	const material = new THREE.LineBasicMaterial( { color: 0x444444, linewidth: 2, transparent: true } );
	const openingGroup = [];

	for ( let surfaceText of GBX.surfaces ) {

		const reSurface = /<Opening(.*?)<\/Opening>/g;
		const openings = surfaceText.match( reSurface );

		//console.log( 'o', openings );

		if ( !openings ) { continue; }

		for ( let opening of openings ) {

			const polyloops = GBX.getPolyLoops( opening );

			//console.log( 'bb', polyloops );

			for ( let polyloop of polyloops ) {

				const coordinates = GBX.getCoordinates( polyloop );

				//console.log( 'coordinates', coordinates );

				const vertices = [];

				for ( let i = 0; i < ( coordinates.length / 3 ); i ++ ) {

					vertices.push( v( coordinates.slice( 3 * i, 3 * i + 3 ) ) );

				}

				//console.log( 'vertices', vertices );

				const geometry = new THREE.Geometry().setFromPoints( vertices );
				//console.log( 'geometry', geometry );

				const line = new THREE.LineLoop( geometry, material );
				openingGroup.push( line );

			}
		}

	}

	//THR.scene.add( openingGroup );

	return openingGroup;

};



GBXU.toggleOpenings = function() {
	//console.log( '', 22 );

	if ( GBX.openingGroup && GBX.openingGroup.length === 0 ) {

		GBX.openingGroup = new THREE.Group();
		GBX.openingGroup.name = 'GBX.openingGroup';
		const openingGroup = GBXU.getSurfaceOpenings();
		//console.log( 'openingGroup', openingGroup );

		if ( !openingGroup.length ) { return; }

		GBX.openingGroup.add( ...openingGroup );

		THR.scene.add( GBX.openingGroup );

		return;

	}

	GBX.openingGroup.traverse( function ( child ) {

		if ( child instanceof THREE.Line ) {

			child.visible = !child.visible;

		}

	} );

};



GBXU.setOpeningsVisible = function( visible = true ) {

	GBX.openingGroup.traverse( child  => {

		//if ( child instanceof THREE.Line ) {

			child.visible = visible;

		//}

	} );

};



//////////


GBXU.setSurfaceTypesVisible = function ( typesArray ) {

	// polyfill for MS Edge
	GBX.surfacesFiltered = typesArray.reduce( ( acc, filter ) => acc.concat(

		GBX.surfaces.filter( surface => surface.includes( `"${ filter }"` ) )

	), [] );

	GBXU.sendSurfacesToThreeJs( GBX.surfacesFiltered );

};



GBXU.sendSurfacesToThreeJs = function( surfacesText = [] ) {
	//console.log( 'surfacesText', surfacesText );

	GBX.surfaceGroup.children.forEach( surface=> surface.visible = false );
	//const timeStart = performance.now();

	THR.controls.autoRotate = false;

	GBX.surfacesTmp = surfacesText;

	// render only surfaces easily doable in the time to render one frame
	GBX.step = 1000;
	GBX.count = 0;
	GBX.misses = 0;
	GBX.deltaLimit = 20;
	GBX.lastTimestamp = performance.now();

	if ( surfacesText.length ) { GBXU.addMeshes(); }

	const txt = !surfacesText.length ? "<span class='highlight' >No surfaces are visible</span>" : surfacesText.length.toLocaleString() + ' surfaces visible';

	return txt;

};



GBXU.addMeshes = function( timestamp ) {

	if ( GBX.count < GBX.surfacesTmp.length ) {
		//console.log( 'GBX.count', GBX.count );

		const delta = timestamp - GBX.lastTimestamp;
		GBX.lastTimestamp = timestamp;

		if ( delta < GBX.deltaLimit ) {

			GBX.surfacesTmp.slice( GBX.count, GBX.count + GBX.step ).forEach( surface => {

				const index = GBX.surfaces.indexOf( surface );
				GBX.surfaceGroup.children[ index ].visible = true;

			} );

			GBX.count += GBX.step;

			GBX.count = GBX.count > GBX.surfacesTmp.length ? GBX.surfacesTmp.length : GBX.count;

		} else {

			if ( GBX.misses > 3 ) {

				GBX.deltaLimit += 20;
				GBX.misses = 0;

			}

			GBX.misses ++;

		}


/*
 		GBXdivStatsThr.innerHTML =
		`
			<hr>
			<b>Current scene rendering data</b><br>
			surfaces rendered: ${ GBX.count.toLocaleString() } of ${ GBX.surfacesTmp.length.toLocaleString() } <br>
			time to render: ${ delta.toLocaleString() } ms<br>
			took too long: ${ GBX.misses }<br>
			time allocated frame: ${ GBX.deltaLimit } ms<br>
			total time elapsed: ${ ( performance.now() - FOB.timeStart ).toLocaleString() } ms
		`;
*/

		requestAnimationFrame( GBXU.addMeshes );

	} else {

		//THR.controls.autoRotate = true;

		THRU.getMeshesVisible( GBX.surfaceGroup );

	}

};