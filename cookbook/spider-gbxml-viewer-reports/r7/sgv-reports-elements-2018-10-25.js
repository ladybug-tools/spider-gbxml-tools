// Copyright 2018 Ladybug Tools authors. MIT License
/* globals THR, GBX, POP, REPinpOptionType, REPselReportResults, REPselReport, REPdivReportTitle, REPselReportType */
/* jshint esversion: 6 */


const REPE = { "release": "SGV Reports Element by Type R7.1"};


REPE.getElementsMenuItems = function() {

	const htm  =
	`
	<i>View by surface, space, storey, zone or opening</i>

	<details ontoggle=REPE.setOptions(); >

		<summary>Select Reports by Elements</summary>

		<p></p>

		<div>
			<select id=REPselReport onchange=REPE.setPanelReportResults(); size=6 >

				<option selected >Surface</option>
				<option>Space</option>
				<option>Storey</option>
				<option>Zone</option>
				<option>Opening</option>

			</select>
		</div>

		<div>
			View by<br>
			<select id=REPselReportType size=1; onchange=REPE.setPanelReportResults() >
				<option value="id" selected>ID</option>
				<option>Name</option>
				<option value="CADObjectId" >CAD Object ID</option>
			</select>
		</div>

		<div id=REPdivReportTitle ></div>

		Use shift and control/command keys to select multiple items

		<p>
			<input id=REPinpOptionType oninput=REPE.setSelectedOptionType(); placeholder="search for a value" >
		</p>

		<div>
			<select id=REPselReportResults onchange=REPE.setElementVisible(); size=10; style=width:100%; multiple></select>
		</div>

		<div id=REPdivInteract ></div>

	</details>

	<hr>`;

	return htm;

};


REPE.setSelectedOptionType = function() {

	const str = REPinpOptionType.value.toLowerCase();

	REPselReportResults.value = Array.from( REPselReportResults.options ).find( item => item.value.toLowerCase().includes( str ) ).value;

	REPE.setElementVisible();

};


REPE.setOptions = function(){

	REPE.setElementPanelSelectSurface();

};



REPE.setPanelReportResults = function() {

	const item = REPselReport.value;
	//console.log( 'item', item );

	REPinpOptionType.value = '';

	if ( item === 'Surface' ) {

		REPE.setElementPanelSelectSurface();

	} else if ( item === 'Space' ) {

		REPE.setElementPanelSelectSpace();

	} else if ( item === 'Storey' ) {

		REPE.setElementPanelSelectStorey();

	} else if ( item === 'Zone' ) {

		REPE.setElementPanelSelectZone();

	} else if ( item === 'Opening' ) {

		//REPE.setElementPanelSelectSpace();

		REPdivReportTitle.innerHTML = 'coming soon';
		REPselReportResults.innerHTML = '';

	}


};



REPE.getArray = function( item ) { return Array.isArray( item ) ? item : [ item ]; };



//////////

REPE.setElementPanelSelectSurface = function(){

	const surfaces = REPE.getArray( GBX.gbjson.Campus.Surface );
	const attribute = REPselReportType.value;
	const options = surfaces.map( surface => `<option value="${ surface.id }" >${ surface[ attribute ] }</option>` );

	REPdivReportTitle.innerHTML = `<h4>Type: Surface - Items: ${ options.length } </h4>`;

	REPselReportResults.innerHTML = options.join( ',' );

};



REPE.setElementPanelSelectSpace = function() {

	const spaces = REPE.getArray( GBX.gbjson.Campus.Building.Space );
	const attribute = REPselReportType.value;
	//console.log( 'space[ attribute ]', space[ attribute ] );

	const options = spaces.map( space => `<option value="${ space.id }" >${ space[ attribute ] }</<option>` );

	REPdivReportTitle.innerHTML = `<h4>Type: Space - Items: ${ options.length } </h4>`;

	REPselReportResults.innerHTML = options.join( ',' );

};



REPE.setElementPanelSelectStorey = function() {

	const stories = REPE.getArray( GBX.gbjson.Campus.Building.BuildingStorey );
	const attribute = REPselReportType.value;
	const options = stories.map( storey => `<option value="${ storey.id }">${ storey[ attribute ] }</<option>` );

	REPdivReportTitle.innerHTML = `<h4>Type: Storey - Items: ${ options.length } </h4>`;

	REPselReportResults.innerHTML = options.join( ',' );

};



REPE.setElementPanelSelectZone = function() {

	const zones = Array.isArray( GBX.gbjson.Zone ) ? GBX.gbjson.Zone : [ GBX.gbjson.Zone ];
	const attribute = REPselReportType.value;
	const options = zones.map( zone => `<option value="${ zone.id }" >${ zone[ attribute ] }</<option>` );

	REPdivReportTitle.innerHTML = `<h4>Type: Zone - Items: ${ options.length } </h4>`;

	REPselReportResults.innerHTML = options.join( ',' );

};




REPE.setElementVisible = function() {
	//console.log( 'id', id );
	//console.log( 'item', item ); // use REPE.item??

	THR.scene.remove( POP.line, POP.particle );  // POP must be loaded

	const element = REPselReport.value;

	if ( element === 'Surface') {

		REPE.setSurfaceVisible();

	} else if ( element === 'Space') {

		REPE.setSpaceVisible();

	} else if ( element === 'Storey') {

		REPE.setStoreyVisible();

	} else if ( element === 'Zone') {

		REPE.setZoneVisible();

	} else if ( element === 'Opening') {

		REPE.setOpeningVisible();

	}

};



REPE.setSurfaceVisible = function() {

	const children =  GBX.surfaceMeshes.children;

	children.forEach( child => child.visible = false );

	for ( let id of REPselReportResults.selectedOptions ) {

		for ( let child of children ) {

			if ( id.value === child.userData.gbjson.id ) { child.visible = true; }

		}

	}

};



REPE.setSpaceVisible = function() {

	const children =  GBX.surfaceMeshes.children;

	children.forEach( child => child.visible = false );

	for ( let option of REPselReportResults.selectedOptions ) {

		const spaceId = option.value;

		for ( let child of children ) {

			const adjacentSpaceId = child.userData.gbjson.AdjacentSpaceId;
			//console.log( 'adjacentSpaceId', adjacentSpaceId );

			if ( adjacentSpaceId && adjacentSpaceId.spaceIdRef && spaceId === adjacentSpaceId.spaceIdRef ) {

				child.visible = true;

			} else if ( Array.isArray( adjacentSpaceId ) === true ) {

				if ( spaceId === adjacentSpaceId[ 0 ].spaceIdRef || spaceId === adjacentSpaceId[ 1 ].spaceIdRef ) {

					child.visible = true;

				}

			}

		}

	}

};



REPE.setStoreyVisible = function() {

	const spaces = GBX.gbjson.Campus.Building.Space;

	GBX.surfaceMeshes.children.forEach( element => element.visible = false );

	for ( let option of REPselReportResults.selectedOptions ) {

		const storeyId = option.value;

		for ( let child of GBX.surfaceMeshes.children ) {

			const adjacentSpaceId = child.userData.gbjson.AdjacentSpaceId;

			if ( !adjacentSpaceId ) { continue; }

			const spaceIdRef = Array.isArray( adjacentSpaceId ) ? adjacentSpaceId[ 1 ].spaceIdRef : adjacentSpaceId.spaceIdRef;

			spaces.forEach( element => child.visible = element.id === spaceIdRef && element.buildingStoreyIdRef === storeyId ? true : child.visible );

		}

	}

};



REPE.setZoneVisible = function () {

	const spaces = GBX.gbjson.Campus.Building.Space;

	GBX.surfaceMeshes.children.forEach( element => element.visible = false );

	for ( let option of REPselReportResults.selectedOptions ) {

		const zoneIdRef = option.value;

		for ( let child of GBX.surfaceMeshes.children ) {

			const adjacentSpaceId = child.userData.gbjson.AdjacentSpaceId;
			//console.log( 'adjacentSpaceId', adjacentSpaceId );

			if ( !adjacentSpaceId ) { continue; }

			const spaceIdRef = Array.isArray( adjacentSpaceId ) ? adjacentSpaceId[ 1 ].spaceIdRef : adjacentSpaceId.spaceIdRef;

			spaces.forEach( element => child.visible = element.id === spaceIdRef && element.zoneIdRef === zoneIdRef ? true : child.visible );

		}

		let zone;

		if ( Array.isArray( GBX.gbjson.Zone ) ) {

			zone = GBX.gbjson.Zone.find( function( item ) { return item.id === zoneIdRef; } );

		} else {

			zone = GBX.gbjson.Zone;

		}

	}

};

