// Copyright 2018 Ladybug Tools authors. MIT License
// jshint esversion: 6
/* globals THREE, THR, THRU, timeStart, divReports */

var REP = REP || {};



REP.getStats = function() {

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



REP.getReports = function() {

	const types = GBX.surfaceTypes.filter( type => GBX.surfaces.find( surface => surface.includes( type ) ) );

	let colors =  types.map( type => GBX.colorsDefault[ type ].toString( 16 ) );
	colors = colors.map( color => color.length > 4 ? color : '00' + color ); // otherwise greens no show
	//console.log( 'col', colors );

	buttonSurfaceTypes = types.map( ( type, index ) =>
		`<button class=butSurfaceType onclick=REP.toggleSurfaceFiltered(this); style="background-color:#${ colors[ index ] };" > ${ type } </button>`
	);

	const htm =
	`
		<div id=REPdivSurfaceType >Show by surface type
			${ buttonSurfaceTypes.join( '<br>' ) }
		</div>

		<p>
			<button id=butExterior onclick=REP.toggleExteriorSurfaces(this);
				style= "background-color: pink; font-style: bold; "; >exterior surfaces</button>
			<button id=butExposed onclick=REP.setSurfacesFiltered('exposedToSun="true"',this); >exposed to sun</button>
		</p>

		<p>
			<button onclick=REP.setSurfacesFiltered(["Ceiling","InteriorFloor","SlabOnGrade","UndergroundSlab"],this); >horizontal</button>

			<button onclick=REP.setSurfacesFiltered(["ExteriorWall","InteriorWall","UndergroundWall"],this); >vertical</button>
		</p>

	`;

	return htm;

};



REP.toggleSurfaceFiltered = function( button ) {

	button.classList.toggle( "active" );

	const current = document.getElementsByClassName( "active" );

	const filterArr = Array.from( current ).map ( current => current.innerText );

	REP.setSurfaceTypesVisible ( filterArr );

};



REP.setSurfaceTypesVisible = function ( typesArray ) {

	GBX.surfacesFiltered = typesArray.flatMap( filter =>

		GBX.surfacesIndexed.filter( surface => surface.includes( `${ filter }` ) )

	);
	//console.log( 'GBX.surfacesFiltered',  GBX.surfacesFiltered );

	divReportsLog.innerHTML = GBX.sendSurfacesToThreeJs( GBX.surfacesFiltered );

}


REP.toggleExteriorSurfaces = function() {

	const filters = [ "Roof", "ExteriorWall", "ExposedFloor", "Air", "Shade" ];
	const buttons = divReports.querySelectorAll( "button" );
	Array.from( buttons ).forEach( button => filters.includes( button.innerText ) ?
		button.classList.add( "active" ) : button.classList.remove( "active" )
	);

	REP.setSurfaceTypesVisible( filters );

};



REP.setSurfacesFiltered = function( filters, button) {

	buttons = divReports.querySelectorAll( "button" );

	Array.from( buttons ).forEach( button => button.classList.remove( "active" ) );

	Array.from( buttons ).forEach( button => filters.includes( button.innerText ) ?
	button.classList.add( "active" ) : button.classList.remove( "active" ));

	button.classList.toggle( "active" );

	filters = Array.isArray( filters ) ? filters : [ filters ];
	//console.log( 'filters', filters );

	GBX.surfacesFiltered = filters.flatMap( filter =>

		GBX.surfacesIndexed.filter( surface => surface.includes( `${ filter }` ) )

	);

	GBX.sendSurfacesToThreeJs( GBX.surfacesFiltered );

};