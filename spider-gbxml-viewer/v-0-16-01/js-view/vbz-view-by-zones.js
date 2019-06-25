/* globals GBX, VST, THREE, VBZselZone, VBZdivReportsLog, VSTdivSurfaceType */
// jshint esversion: 6
/* jshint loopfunc: true */


const VBZ = {

	"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
	"date": "2019-06-24",
	"description": "View the surfaces in a gbXML file by selecting one or more zones from a list of all zones",
	"helpFile": "../js-view/vbz-view-by-zones.md",
	"version": "0.16-01-1vbz",
	"urlSourceCode": "https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/v-0-16-01/js-view/vbz-view-by-zones.js",

};



VBZ.getMenuViewByZones = function() {

	document.body.addEventListener( 'onGbxParse', function(){ VBZdetMenu.open = false; }, false );

	const foot = `v${ VBO.version} - ${ VBO.date }`;

	const help = `<button id="butVBZsum" class="butHelp" onclick="POP.setPopupShowHide(butVBZsum,VBZ.helpFile,'${foot}');" >?</button>`;


	const htm =
	`
		<details id=VBZdetMenu ontoggle=VBZ.getZonesOptions(); >

			<summary>Show/hide by zones <span id="VBZspnCount" ></span> ${ help }</summary>

			<p>Display surfaces by zone. Default is all zones visible.</p>

			<div id="VBZdivViewByZones" >
				<select id=VBZselZone onchange=VBZ.selectZoneFocus(this); multiple style=min-width:100%; ></select
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

	//const zoneIds = GBX.zones.map( zone => zone.match( 'id="(.*?)">')[ 1 ] );
	//console.log( 'zoneIds', zoneIds );

	const zoneNameArray = GBX.zones.map( zone => {

		const zoneArr = zone.match( '<Name>(.*?)</Name>' );

		return zoneArr ? zoneArr[ 1 ] : "no zone name in file";

	} );
	//console.log( 'zoneNames', zoneNames);

	zoneNames = zoneNameArray.sort( (a, b) => b - a );
	//console.log( 'zoneNames', zoneNames );

	VBZ.zones = zoneNames.map( zoneName => {

		zone = GBX.zones.find( zone => zone.includes( zoneName ) );

		zoneId = zone.match( 'id="(.*?)">')[ 1 ];

		return { zoneName, zoneId };

	} )
	//console.log( 'VBZ.zones', VBZ.zones );

	const options = VBZ.zones.map( ( zone, index ) =>

		`<option value=${ index } title="${ zone.zoneId }"; >${ zone.zoneId } / ${ zone.zoneName }</option>`

	);

	VBZselZone.innerHTML = options;

	VBZspnCount.innerHTML = `: ${ VBZ.zones.length } found`;

};



VBZ.selectZoneFocus = function( select ) {

	THR.controls.enableKeys = false;

	const zone = VBZ.zones[ select.value ];
	//console.log( 'zone', zone );


	POPdivPopupData.innerHTML = VBZ.getAttributes( zone.zoneId );

	const options = select.selectedOptions
	console.log( 'options', options );

	GBX.surfaceGroup.children.forEach( element => element.visible = false );

	Array.from( options ).forEach( option =>

		VBZ.setZoneVisible( option.title )

	);

}


VBZ.getAttributes = function( zoneIdRef ) {

	const zoneTxt = GBX.zones.find( item => item.includes( ` id="${ zoneIdRef }"` ) );

	const zoneXml = POPX.parser.parseFromString( zoneTxt, "application/xml").documentElement;
	//console.log( 'spaceXml ', spaceXml );

	const htmZone = GSA.getAttributesHtml( zoneXml );

	const htm =
	`
		<b>${ zoneIdRef } Attributes</b>

		<p>${ htmZone }</p>

		<details>

			<summary>gbXML data</summary>

			<textarea style=width:100%; >${ zoneTxt }</textarea>

		</details>

		<hr>
	`;

	return htm;

};



VBZ.setZoneVisible = function ( zoneIdRef ) {

	const children = GBX.surfaceGroup.children;

	const spaces = GBX.spaces;

	//const spaceIdRef = GSA.adjacentSpaceIds.length === 1 ? GSA.adjacentSpaceIds[ 0 ] : GSA.adjacentSpaceIds[ 1 ];

	const spaceIdsInZone = [];

	for ( let space of spaces ) {

		const spaceZoneId = space.match( /zoneIdRef="(.*?)"/ );

		if ( spaceZoneId && spaceZoneId[ 1 ] === zoneIdRef ) {
			//console.log( 'spaceZoneId', spaceZoneId[ 1 ] );

			const spaceId = space.match( ` id="(.*?)"` )[ 1 ];
			//console.log( 'spaceId', spaceId );

			spaceIdsInZone.push( spaceId );

		}

	}
	//console.log( 'spaceIdsInZone', spaceIdsInZone );


	for ( let child of children ) {

		const id = child.userData.index;
		const surface = GBX.surfaces[ id ];
		const spacesArr = surface.match( / spaceIdRef="(.*?)"/g );
		//console.log( 'spacesArr', spacesArr );

		if ( spacesArr ) {

			const spacesIdsArr = spacesArr.map( space => space.match( `="(.*?)"` )[ 1 ] );
			//console.log( 'spacesIdsArr', spacesIdsArr );

			for ( let spaceId of spaceIdsInZone ) {

				child.visible = spacesIdsArr.includes( spaceId ) ? true : child.visible;

			}

		}

	}

};



VBZ.showAllZones = function() {

	VBZselZone.selectedIndex = -1;

	VBZ.selZones();

};



VBZ.setViewByZoneShowHide = function( button, surfaceArray ) {
	//console.log( 'surfaceArray', surfaceArray );

	button.classList.toggle( "active" );

	if ( button.classList.contains( 'active' ) && surfaceArray.length ) {

		GBX.sendSurfacesToThreeJs( surfaceArray );

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	}

};


//////////

VBZ.selZones = function() {

	THR.controls.enableKeys = false;

	POPdivPopupData.innerHTML = POPX.getToggleZoneVisible( VBZselZone, VBZselZone.value );

/*
	POP.intersected = null;

	POPdivPopupData.innerHTML = '';

	THR.scene.remove( POP.line, POP.particle );

	VBZ.surfacesFilteredByZone = VBZ.setSurfacesFilteredByZone();

	VBZdivReportsLog.innerHTML = GBX.sendSurfacesToThreeJs( VBZ.surfacesFilteredByZone );


	*/

	//GBX.setOpeningsVisible( false );
	//VBZ.getZoneAttributes( VBZselZone.value )

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



	const htm =
	`
		<b>${ zoneIdRef } Attributes</b>

		<p>${ htmZone }</p>

		<details>

			<summary>gbXML data</summary>

			<textarea>${ zoneTxt }</textarea>

			</details>
	`;

	POPdivPopupData.innerHTML = htm;

};


