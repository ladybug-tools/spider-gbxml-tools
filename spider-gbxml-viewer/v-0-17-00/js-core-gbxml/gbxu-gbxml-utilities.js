/* globals THREE, THR, THRU, FOB, GBXU */
// jshint esversion: 6

var GBXU = {

	copyright: "Copyright 2019 Ladybug Tools authors. MIT License",
	date: "2019-07-11",
	description: "GbXML utilities: all this is a bit idiosyncratic / a random collection of stuff",
	helpFile: "../js-view-gbxml/gbxu-gbxml-utilities.md",
	license: "MIT License",
	urlSourceCode: "https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/spider-gbxml-viewer/v-0-17-00/js-core-gbxml",
	version: "0.17.00-2gbxu"

};


////////// inits & info


GBXU.onGbxParse = function() {

	GBXU.setSurfaceTypesVisible( GBX.filtersDefault );

	GBXU.toggleOpenings();

	THR.controls.autoRotate = true;
	THRU.zoomObjectBoundingSphere( GBX.boundingBox );

	THRU.toggleGroundHelper();
	THRU.groundHelper.visible = true;

	GBXU.setStats();

	window.removeEventListener( 'keyup', GBXU.onGbxParse );
	THR.renderer.domElement.removeEventListener( 'click', GBXU.onGbxParse );
	THR.renderer.domElement.removeEventListener( 'touchstart', GBXU.onGbxParse );

};



GBXU.getSceneInfo = function() {

	let htm

	htm = GBX.count3 ?

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

	return htm;

};



GBXU.setStats = function() {

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

	const verticesCount = GBX.surfaces.map( surfaces => GBX.getCoordinates( surfaces ) );
	//console.log( 'vertices', vertices );

	const count = verticesCount.reduce( ( count, val, index ) => count + verticesCount[ index ].length, 0 );

	GBX.constructions = GBX.text.match( /<Construction(.*?)<\/Construction>/gi ) || [];

	GBX.layers = GBX.text.match( /<Layer (.*?)<\/Layer>/gi ) || [];

	GBX.materials = GBX.text.match( /<Material (.*?)<\/Material>/gi ) || [];

	GBX.windowTypes = GBX.text.match( /<WindowType (.*?)<\/WindowType>/gi ) || [];

	const timeToLoad = performance.now() - GBX.timeStart;

	items = {
		"Space:": GBX.spaces.length,
		"Storeys": GBX.storeys.length,
		"Zones": GBX.zones.length,
		"Surfaces": GBX.surfaces.length,
		"Openings": GBX.openings.length,
		"count": GBX.constructions.length,
		"Materials": GBX.materials.length,
		"Layers": GBX.layers.length,
		"Window Types": GBX.windowTypes.length
	}

	keys = Object.keys( items )
	//console.log( 'keys', keys );

	GBXU.stats =
		`<b>gbXML Statistics</b>` +
		keys.map( key =>
		`<div>
			<span class=attributeTitle >${ key }</span>:
			<span class=attributeValue > ${ items[ key ].toLocaleString() }</span>
		</div>`
	).join( "");

	tag = document.body.querySelectorAll( "#FOBdivAppStats" );

	if ( tag.length > 0 ) { tag[ 0 ].innerHTML = GBXU.stats; }

};



////////// Openings

GBXU.getSurfaceOpenings = function() {

	const v = ( arr ) => new THREE.Vector3().fromArray( arr );

	const material = new THREE.LineBasicMaterial( { color: 0x444444, linewidth: 2, transparent: true } );
	const surfaceOpenings = [];

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
				surfaceOpenings.push( line );

			}
		}

	}

	//THR.scene.add( surfaceOpenings );

	return surfaceOpenings;

};



GBXU.toggleOpenings = function() {
	//console.log( '', 22 );

	if ( GBX.surfaceOpenings && GBX.surfaceOpenings.length === 0 ) {

		GBX.surfaceOpenings= new THREE.Group();
		GBX.surfaceOpenings.name = 'GBX.surfaceOpenings';
		surfaceOpenings = GBXU.getSurfaceOpenings();
		//console.log( 'surfaceOpenings', surfaceOpenings );

		if ( !surfaceOpenings.length ) { return; }

		GBX.surfaceOpenings.add( ...surfaceOpenings );

		THR.scene.add( GBX.surfaceOpenings );

		return;

	}

	GBX.surfaceOpenings.traverse( function ( child ) {

		if ( child instanceof THREE.Line ) {

			child.visible = !child.visible;

		}

	} );

};



GBXU.setOpeningsVisible = function( visible = true ) {

	GBX.surfaceOpenings.traverse( function ( child ) {

		if ( child instanceof THREE.Line ) {

			child.visible = visible;

		}

	} );

}



//////////

GBXU.setSurfaceTypesVisible = function ( typesArray ) {

	// polyfill for MS Edge
	GBX.surfacesFiltered = typesArray.reduce( ( acc, filter ) => acc.concat(

		GBX.surfaces.filter( surface => surface.includes( `"${ filter }"` ) )

	), [] );

	//divReportsLog.innerHTML =
	GBXU.sendSurfacesToThreeJs( GBX.surfacesFiltered );

};



GBXU.sendSurfacesToThreeJs = function( surfacesText ) {
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

	GBXU.addMeshes();

	if ( !GBX.boundingBox ) {

		const bbox = new THREE.Box3().setFromObject( GBX.surfaceGroup );
		GBX.boundingBox = new THREE.Box3Helper( bbox, 0xffff00 );
		THR.scene.add( GBX.boundingBox );

	}

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


/* 		GBXdivStatsThr.innerHTML =
		`
			<hr>
			<b>Current scene rendering data</b><br>
			surfaces rendered: ${ GBX.count.toLocaleString() } of ${ GBX.surfacesTmp.length.toLocaleString() } <br>
			time to render: ${ delta.toLocaleString() } ms<br>
			took too long: ${ GBX.misses }<br>
			time allocated frame: ${ GBX.deltaLimit } ms<br>
			total time elapsed: ${ ( performance.now() - FOB.timeStart ).toLocaleString() } ms
		`; */

		requestAnimationFrame( GBXU.addMeshes );

	} else {

		//THR.controls.autoRotate = true;

	}

};