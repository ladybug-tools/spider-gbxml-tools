// Copyright 2019 Ladybug Tools authors. MIT License
// jshint esversion: 6
/* globals THREE, THR, THRU, timeStart, divLog2 */

/* globals THREE, THR, THRU, FOB, GBXU */

var GBXU = {

	"script": {

		"date": "2019-06-27",
		"version": "0.16.01-1gbxu"
	}
};


/*

Change Log

2019-06-27 ~ F- GBXU.js: Add event to turn off ground on load

2019-02-14 ~ Lowered elevation of ground helper to reduce Moire effect

*/

GBXU.init = function() {

	//FIL.reader.addEventListener( 'load', GBXU.setStats, false );
	//GBXdivStats.addEventListener( 'click', GBXU.setStats, false );

	document.body.addEventListener( 'onGbxParse', GBXU.setStats, false );

};


GBXU.toggleGroundHelper = function() {

	if ( !THRU.groundHelper ) {

		//const reElevation = /<Elevation>(.*?)<\/Elevation>/i;
		//GBX.elevation = GBX.text.match( reElevation )[ 1 ];
		//console.log( 'elevation', GBX.elevation );

		elevation = GBX.boundingBox.box.min.z - 0.001 * THRU.radius;

		const geometry = new THREE.PlaneGeometry( 2 * THRU.radius, 2 * THRU.radius);
		const material = new THREE.MeshPhongMaterial( { color: 0x888888, opacity: 0.5, side: 2 } );
		THRU.groundHelper = new THREE.Mesh( geometry, material );
		THRU.groundHelper.receiveShadow = true;

		THRU.groundHelper.position.set( GBX.boundingBox.position.x, GBX.boundingBox.position.y, parseFloat( elevation ) );

		THRU.groundHelper.name = "groundHelper";

		THR.scene.add( THRU.groundHelper );

		THRU.groundHelper.visible = false;

		window.addEventListener( 'keyup', GBXU.onLoad, false );
		THR.renderer.domElement.addEventListener( 'click', GBXU.onLoad, false );
		THR.renderer.domElement.addEventListener( 'touchstart', GBXU.onLoad, false );


		return;

	}

	THRU.groundHelper.visible = !THRU.groundHelper.visible;

};


GBXU.onLoad = function() {


	THRU.groundHelper.visible = false;

	window.removeEventListener( 'keyup', GBXU.onLoad );
	THR.renderer.domElement.removeEventListener( 'click', GBXU.onLoad );
	THR.renderer.domElement.removeEventListener( 'touchstart', GBXU.onLoad );

}


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

	const verticesCount = GBX.surfaces.map( surfaces => GBX.getVertices( surfaces ) );
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
		const openings = surfaceText.match( reSurface );

		//console.log( 'o', openings );

		if ( !openings ) { continue; }

		for ( let opening of openings ) {

			const polyloops = GBX.getPolyLoops( opening );

			//console.log( 'bb', polyloops );

			for ( let polyloop of polyloops ) {

				const coordinates = GBX.getVertices( polyloop );

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




GBX.toggleOpenings = function() {
	//console.log( '', 22 );

	if ( GBX.surfaceOpenings && GBX.surfaceOpenings.length === 0 ) {

		GBX.surfaceOpenings= new THREE.Group();
		GBX.surfaceOpenings.name = 'GBX.surfaceOpenings';
		surfaceOpenings = GBX.getSurfaceOpenings();
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


GBX.setOpeningsVisible = function( visible = true ) {

	GBX.surfaceOpenings.traverse( function ( child ) {

		if ( child instanceof THREE.Line ) {

			child.visible = visible;

		}

	} );

}


//////////

GBX.toggleEdgesThreejs = function() {

	if ( GBX.surfaceEdgesThreejs && GBX.surfaceEdgesThreejs.length === 0 ) {

		GBX.surfaceEdgesThreejs = new THREE.Group();
		GBX.surfaceEdgesThreejs.name = 'GBX.surfaceEdgesThreejs';
		const surfaceEdgesThreejs = GBX.getSurfaceEdgesThreejs();
		//console.log( 'surfaceEdgesThreejs', surfaceEdgesThreejs );

		GBX.surfaceEdgesThreejs.add( ...surfaceEdgesThreejs );

		THR.scene.add( GBX.surfaceEdgesThreejs );

		return;

	}


	GBX.surfaceEdgesThreejs.traverse( function ( child ) {

		if ( child instanceof THREE.Line ) {

			child.visible = !child.visible;

		}

	} );

};

