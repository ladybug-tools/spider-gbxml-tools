// Copyright 2019 Ladybug Tools authors. MIT License
// jshint esversion: 6
/* globals GBX, VST, THREE, VBZselZone, VBZdivReportsLog, VSTdivSurfaceType */


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

	document.body.addEventListener( 'onGbxParse', function(){ VBZdetMenu.open = false; }, false );

	const htm =
	`
		<details id=VBZdetMenu ontoggle=VBZ.getZonesOptions(); >

			<summary>Show/hide by zones
				<a id=VBZHelp class=helpItem href="JavaScript:POP.setPopupShowHide(VBZHelp,VBZ.currentStatus);" >&nbsp; ? &nbsp;</a>
			</summary>

			<p>Display surfaces by zone. Default is all zones visible.</p>

			<p><mark>Should be working properly soon</mark></p>

			<div id="VBZdivViewByZones" >
				<select id=VBZselZone onchange=VBZ.selZones(); multiple style=min-width:15rem; ></select
			</div>

			<div id="VBZdivReportsLog" ></div>

			<p><button onclick=VBZ.showAllZones(); >show all zones</button> </p>

			<p>Select multiple zones by pressing shift or control keys</p>

		</details>
	`;

	return htm;
};



VBZ.getZonesOptions = function() {

	VBZselZone.size = GBX.zones.length > 10 ? 10 : GBX.zones.length;

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

	VBZselZone.innerHTML = options;

};



VBZ.showAllZones = function() {

	VBZselZone.selectedIndex = -1;

	VBZ.selZones();

};



//////////

VBZ.selZones = function() {

	THR.controls.enableKeys = false;

	POPX.getToggleZoneVisible( VBZselZone, VBZselZone.value );
/*
	POP.intersected = null;

	POPdivPopupData.innerHTML = '';

	THR.scene.remove( POP.line, POP.particle );

	VBZ.surfacesFilteredByZone = VBZ.setSurfacesFilteredByZone();

	VBZdivReportsLog.innerHTML = GBX.sendSurfacesToThreeJs( VBZ.surfacesFilteredByZone );

	GBX.surfaceOpenings.traverse( function ( child ) {

		if ( child instanceof THREE.Line ) {

			child.visible = false;

		}

	} );
*/

	VBZ.getZoneAttributes( VBZselZone.value )

};



VBZ.setSurfacesFilteredByZone = function( surfaces ) {

	const zoneIds = VBZselZone.selectedOptions;
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


VBZ.getZoneAttributes = function( zoneIdRef ) {


	const zoneTxt = GBX.zones.find( item => item.includes( ` id="${ zoneIdRef }"` ) );

	const zoneXml = POPX.parser.parseFromString( zoneTxt, "application/xml").documentElement;
	//console.log( 'spaceXml ', spaceXml );

	const htmZone = GSA.getAttributesHtml( zoneXml );

	GBX.surfaceOpenings.traverse( function ( child ) {

		if ( child instanceof THREE.Line ) {

			child.visible = false;

		}

	} );

	const htm =
	`
		<b>Selected Zone Attributes</b>
		${ htmZone }
	`;

	POPdivPopupData.innerHTML = htm;



};