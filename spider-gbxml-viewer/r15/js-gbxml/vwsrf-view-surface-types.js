// Copyright 2018 Ladybug Tools authors. MIT License
// jshint esversion: 6
/* globals THREE, THR, THRU, REPL, divReports */


const VWSRF = { "release": "R15.0", "date": "2019-01-31" };

VWSRF.filtersDefault = [ "Roof", "ExteriorWall", "ExposedFloor", "Air", "Shade" ];

VWSRF.getStats = function() {

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


VWSRF.onToggle = function() {

	if ( divReports.innerHTML === '' ) {

	divReports.innerHTML = VWSRF.getReportsMenu();

	//divReportByLevels.innerHTML=REPL.getReportByLevels();

	VWSRF.setSurfacesActiveByDefaults();

	}


};



VWSRF.getReportsMenu = function() {

	const types = GBX.surfaceTypes.filter( type => GBX.surfaces.find( surface => surface.includes( type ) ) );

	let colors =  types.map( type => GBX.colorsDefault[ type ].toString( 16 ) );
	colors = colors.map( color => color.length > 4 ? color : '00' + color ); // otherwise greens no show
	//console.log( 'col', colors );

	/// class=butSurfaceType
	const buttonSurfaceTypes = types.map( ( type, index ) =>
		`<button  onclick=VWSRF.toggleSurfaceFiltered(this); style="background-color:#${ colors[ index ] };" > ${ type } </button>`
	);

	const htm =
	`
		<div id=REPdivSurfaceType >
			Show by surface type
			${ buttonSurfaceTypes.join( '<br>' ) }
		</div>

		<div id = "divReportCurrentStatus" > ${ VWSRF.getReportCurrentStatus() } </div>

		<div id = "divReportByFilters" > ${ VWSRF.getReportByFilters() } </div>

	`;

	return htm;

};




VWSRF.getReportCurrentStatus = function() {

	const htm =
	`
		<details>

			<summary>${ VWSRF.date } ~ Reports ${ VWSRF.release }</summary>

			<p>To be updated soon</p>

			<p>Wish list: faster operations on very large files</p>

		</details>
	`;

	return htm;

};



VWSRF.getReportByFilters = function() {

	const htm =
	`
		<div id=REPdivReportByFilters >

			<p>
				<button id=butExterior onclick=VWSRF.setSurfacesActiveByDefaults(this); >exterior surfaces</button>

				<button id=butExposed onclick=VWSRF.setSurfacesFiltered(this,'exposedToSun="true"'); >exposed to sun</button>
			</p>

			<p>
				<button onclick=VWSRF.setSurfaceTypesVisible(["Ceiling","InteriorFloor","SlabOnGrade","Roof","UndergroundSlab"],this); >horizontal</button>

				<button onclick=VWSRF.setSurfaceTypesVisible(["ExteriorWall","InteriorWall","UndergroundWall"],this); >vertical</button>
			</p>

		</div>

	`;

	return htm;

};



VWSRF.toggleSurfaceFiltered = function( button ) {

	button.classList.toggle( "active" );

	const buttonsActive = REPdivSurfaceType.getElementsByClassName( "active" ); // collection

	const filterArray = Array.from( buttonsActive ).map( button => button.innerText );

	VWSRF.setSurfaceTypesVisible ( filterArray );

};



VWSRF.setSurfaceTypesVisible = function ( typesArray ) {
	//console.log( 'typesArray', typesArray );

	GBX.surfacesFiltered = typesArray.flatMap( filter =>

		GBX.surfacesIndexed.filter( surface => surface.includes( `"${ filter }"` ) )

	);

	divReportsLog.innerHTML = GBX.sendSurfacesToThreeJs( GBX.surfacesFiltered );

};



VWSRF.setSurfacesFiltered = function( button, filters ) {

	filters = Array.isArray( filters ) ? filters : [ filters ];
	console.log( 'filters', filters );

	GBX.surfacesFiltered = filters.flatMap( filter =>

		GBX.surfacesIndexed.filter( surface => surface.includes( `${ filter }` ) )

	);

	GBX.sendSurfacesToThreeJs( GBX.surfacesFiltered );

};



VWSRF.setSurfacesActiveByDefaults = function() {

	if ( REPdivSurfaceType ) {

		const buttons = REPdivSurfaceType.querySelectorAll( "button" );

		buttons.forEach( button => VWSRF.filtersDefault.includes( button.innerText ) ?
			button.classList.add( "active" ) : button.classList.remove( "active" )
		);

	}

	VWSRF.setSurfaceTypesVisible( VWSRF.filtersDefault );

};
