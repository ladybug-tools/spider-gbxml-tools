/* globals THREE, THR, THRU, GBX */
// jshint esversion: 6
//@ts-check

"use strict";

var GBXU = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-08-23",
		description: "GbXML utilities: all this is a bit idiosyncratic / a random collection of stuff",
		helpFile: "../js-core-gbxml/gbxu-gbxml-utilities.md",
		license: "MIT License",
		urlSourceCode: "js-core-gbxml/gbxu-gbxml-utilities.js",
		version: "0.17.03-0gbxu"

	}

};


GBXU.filtersDefault = [ "Air", "ExposedFloor", "ExteriorWall", "RaisedFloor",
	"Roof", "Shade" ];



////////// inits & info


GBXU.onGbxParse = function() { // see GBX.parseFile

	//if ( PIN.line ) THR.scene.remove( PIN.line, PIN.particle );

	if ( window.navDragMove ) POP.setPopupShowHide( butPopupClose, POP.popup );

	THRU.zoomObjectBoundingSphere();

	GBXU.setSurfaceTypesVisible( GBXU.filtersDefault );

	const meshes = GBX.meshGroup.children.filter( mesh =>
		GBXU.filtersDefault.includes( mesh.userData.surfaceType) )
		.map( mesh => mesh.clone() );

	GBX.meshesVisible = new THREE.Group();
	GBX.meshesVisible.add( ...meshes );

	THRU.toggleBoundingBoxHelper( GBX.meshesVisible );

	GBX.elevation = THRU.boundingBoxHelper.box.min.z - 0.001 * THRU.radius;

	THRU.toggleGroundHelper( THRU.center, GBX.elevation );

	GBXU.toggleOpenings();

	THRU.toggleAxesHelper();

	THR.controls.autoRotate = true;

	GBXU.setElementsJson();

	GBX.getStoreysJson();

	if ( window.PFO ) {

		PFO.surfaceTypesInUse = GBX.surfaceTypes.filter( type => GBX.surfaces.find( surface => surface.includes( `"${ type }"` ) ) );

		PFO.surfaceTypesActive = !PFO.surfaceTypesActive ? PFO.surfaceTypesInUse.slice() : PFO.surfaceTypesActive;

		PFO.storeyIdsInUse = GBX.storeysJson.map( storey => storey.id );

		PFO.storeyIdsActive = !PFO.storeyIdsActive ? PFO.storeyIdsInUse.slice() : PFO.storeyIdsActive;

	}

	if ( window.detMenuViewGbxml ) MNU.toggleDetailsOpen( detMenuViewGbxml );

	window.addEventListener( 'keyup', GBXU.onFirstTouch , false );
	window.addEventListener( 'click', GBXU.onFirstTouch, false );
	window.addEventListener( 'touchstart', GBXU.onFirstTouch, false );

};



GBXU.onFirstTouch = function() {

	if ( GBX.messageDiv) { GBX.messageDiv.innerHTML = ""; }

	GBXU.sendSurfacesToThreeJs( GBX.surfaces );

	THRU.toggleBoundingBoxHelper();

	GBXU.toggleOpenings();

	THRU.toggleGroundHelper();

	//THRU.toggleEdges( GBX.meshGroup );

	THRU.getMeshEdges( GBX.meshGroup );

	window.removeEventListener( 'keyup', GBXU.onFirstTouch );
	window.removeEventListener( 'click', GBXU.onFirstTouch );
	window.removeEventListener( 'touchstart', GBXU.onFirstTouch );

};



GBXU.setElementsJson = function() {

	GBX.openings = [];

	GBX.surfaces.forEach( surface => {

		const openings = surface.match( /<Opening(.*?)<\/Opening>/gi ) || [];

		openings.forEach( opening => GBX.openings.push(  opening ) );

	} );


	//const verticesCount = GBX.surfaces.map( surfaces => GBX.getCoordinates( surfaces ) );
	//console.log( 'vertices', vertices );

	GBX.constructions = GBX.text.match( /<Construction(.*?)<\/Construction>/gi ) || [];

	GBX.layers = GBX.text.match( /<Layer (.*?)<\/Layer>/gi ) || [];

	GBX.materials = GBX.text.match( /<Material (.*?)<\/Material>/gi ) || [];

	GBX.windowTypes = GBX.text.match( /<WindowType (.*?)<\/WindowType>/gi ) || [];


	if ( !GBX.messageDiv ) { return; }

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

	FOB.fileInfo = FOB.fileInfo ? FOB.fileInfo : "";

	GBX.messageDiv.innerHTML = GBXU.stats + "<br><b>File Statistics</b>" + FOB.fileInfo;

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

	GBX.meshGroup.children.forEach( surface=> surface.visible = false );
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
				GBX.meshGroup.children[ index ].visible = true;

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

		THRU.getMeshesVisible( GBX.meshGroup );

	}

};