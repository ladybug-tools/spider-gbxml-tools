// Copyright 2019 Ladybug Tools authors. MIT License
// jshint esversion: 6
/* globals GBX, VST, THREE, VBSPselZone, VBSPdivReportsLog, VSTdivSurfaceType */


const VBZ = {"release": "R15.0.0", "date": "2019-04-15" };

VBZ.description =
	`
		View the surfaces in a gbXML file by selecting one or more zones from a list of all zones
	`;


VBZ.currentStatus =
	`
		<h3>View by Zones (VBZ) ${ VBZ.release } ~ ${ VBZ.date }</h3>

		<p>
			${ VBZ.description }
		</p>

		<p>Notes
			<ul>
				<li>Select multiple Zones by pressing shift or control keys</li>
			</ul>
		</p>
		<p>
			<a href="https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/spider-gbxml-viewer/r15/js-gbxml/vbsP-view-by-zones" target="_blank" >
				VBZ View by Zones Source
			</a>
		</p>

		<details>
			<summary>Wish list</summary>
			<ul>
			</ul>
		</details>

		<details>
			<summary>Change log</summary>
			<ul>
				<li>2019-04-15 ~ F ~ R15.0.0 - first commit</li>
			</ul>
		</details>
	`;




VBZ.getMenuViewByZones = function() {

	document.body.addEventListener( 'onGbxParse', function(){ VBSPdetMenu.open = false; }, false );

	const htm =
	`
		<details id=VBSPdetMenu ontoggle=VBZ.getZonesOptions(); >

			<summary>Show/hide by zones
				<a id=VBZHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(VBZHelp,VBZ.currentStatus);" >&nbsp; ? &nbsp;</a>
			</summary>

			<p>Display surfaces by zone. Default is all zones visible.</p>

			<p><mark>Should be working properly soon</mark></p>

			<div id="VBSPdivViewByZones" >
				<select id=VBSPselZone onchange=VBZ.selZones(); multiple style=min-width:15rem; ></select
			</div>

			<div id="VBSPdivReportsLog" ></div>

			<p><button onclick=VBZ.showAllZones(); >show all zones</button> </p>

			<p>Select multiple zones by pressing shift or control keys</p>

		</details>
	`;

	return htm;
};



VBZ.getZonesOptions = function() {

	VBSPselZone.size = GBX.zones.length > 10 ? 10 : GBX.zones.length;

	const zoneIds = GBX.zones.map( zone => zone.match( 'id="(.*?)">')[ 1 ] );
	//console.log( 'zoneIds', zoneIds );

	const zoneNames = GBX.zones.map( zone => {

		const zoneArr = zone.match( '<Name>(.*?)</Name>' );

		return zoneName = zoneArr ? zoneArr[ 1 ] : "no zone name in file";

	} );
	//console.log( 'zoneNames', zoneNames);

	const zonesSorted = zoneNames.slice().sort( (a, b) => b - a );
	//console.log( 'zonesSorted', zonesSorted );

	const options = zonesSorted.map( zone => {
		//console.log( 'level', level );

		const index = zoneNames.indexOf( zone );
		//console.log( 'indexUnsorted', indexUnsorted );

		return `<option value=${ zoneIds[ index ] }>${ zoneNames[ index ] }</option>`

	} );

	VBSPselZone.innerHTML = options;

};



VBZ.showAllZones = function() {

	VBSPselZone.selectedIndex = -1;

	VBZ.selZones();

};



//////////

VBZ.selZones = function() {

	THR.controls.enableKeys = false;

	POP.getToggleZoneVisible( VBSPselZone, VBSPselZone.value );
/*
	POP.intersected = null;

	MNUdivPopupData.innerHTML = '';

	THR.scene.remove( POP.line, POP.particle );

	VBZ.surfacesFilteredByZone = VBZ.setSurfacesFilteredByZone();

	VBSPdivReportsLog.innerHTML = GBX.sendSurfacesToThreeJs( VBZ.surfacesFilteredByZone );

	GBX.surfaceOpenings.traverse( function ( child ) {

		if ( child instanceof THREE.Line ) {

			child.visible = false;

		}

	} );
*/

};



VBZ.setSurfacesFilteredByZone = function( surfaces ) {

	const zoneIds = VBSPselZone.selectedOptions;
	//console.log( 'zoneIds', zoneIds );

	if ( zoneIds.length === 0 ) {

		const buttonsActive = VSTdivSurfaceType.getElementsByClassName( "active" ); // collection

		let filterArray = Array.from( buttonsActive ).map( button => button.innerText );

		filterArray = filterArray.length > 0 ? filterArray : VST.filtersDefault;
		//console.log( 'filterArray', filterArray );

		surfaces = filterArray.flatMap( filter =>

			GBX.surfacesIndexed.filter( surface => surface.includes( `"${ filter }"` ) )

		);

	}

	const surfacesFilteredByZone = surfaces ? surfaces : [];

	for ( let zoneId of zoneIds ) {

		const zonesFiltered = GBX.zones.filter( zone => zone.includes( ` id="${ zoneId.value }"` ) );
		//console.log( 'zonesFiltered', zonesFiltered );

		const zonesInZoneIds = zonesFiltered.map( zone => zone.match( ' id="(.*?)"' )[ 1 ] );
		//console.log( 'zonesInZoneIds', zonesInZoneIds );

		const surfacesVisibleByZone = zonesInZoneIds.flatMap( zoneId =>
			GBX.surfacesIndexed.filter( surface => surface.includes( `zoneIdRef="${ zoneId }"`  ) )
		);
		//console.log( 'surfacesVisibleByZone', surfacesVisibleByZone );
/*
		const buttonsActive = VSTdivSurfaceType.getElementsByClassName( "active" ); // collection

		let filterArr = Array.from( buttonsActive ).map( button => button.innerText );

		filterArr = filterArr.length > 0 ? filterArr : VST.filtersDefault;

		const surfacesFiltered = filterArr.flatMap( filter =>

			surfacesVisibleByZone.filter( surface => surface.includes( `"${ filter }"` ) )

		);
*/
		surfacesFilteredByZone.push( ...surfacesVisibleByZone );
		console.log( 'GBX.surfacesFiltered',  GBX.surfacesFiltered );

	}

	return surfacesFilteredByZone;

};
