// Copyright 2018 Ladybug Tools authors. MIT License
// jshint esversion: 6
/* globals THREE, THR, THRU, timeStart, divReports */


const REP = {};



REP.getStats = function() {

	const reSpaces = /<Space(.*?)<\/Space>/gi;
	GBX.spaces = GBX.text.match( reSpaces );
	//console.log( 'spaces', spaces );

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


REP.getReports = function() {

	const types = GBX.surfaceTypes.filter( type => GBX.surfaces.find( surface => surface.includes( type ) ) );

	let colors =  types.map( type => GBX.colorsDefault[ type ].toString( 16 ) );
	colors = colors.map( color => color.length > 4 ? color : '00' + color ); // otherwise greens no show
	//console.log( 'col', colors );

	const buttonSurfaceTypes = types.map( ( type, index ) =>
		`<button class=butSurfaceType onclick=REP.toggleSurfaceFiltered(this); style="background-color:#${ colors[ index ] };" > ${ type } </button>`
	);

	optionsStorey = REP.getStoreys();

	size = GBX.storeys.length > 10 ? 10 : GBX.storeys.length;

	const htm =
	`
		<p>${ buttonSurfaceTypes.join( '<br>' ) }</p>

		<p><select id=selStorey onClick=REP.selStoreys(); multiple size=${ size } style=min-width:15rem; > ${ optionsStorey } </select></p>

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

		GBX.surfacesIndexed.filter( surface => surface.includes( `"${ filter }"` ) )

	);
	//console.log( 'GBX.surfacesFiltered',  GBX.surfacesFiltered );

	divReportsLog.innerHTML = GBX.sendSurfacesToThreeJs( GBX.surfacesFiltered );

};



REP.setSurfacesFiltered = function( filters, button ) {

	buttons = divReports.querySelectorAll( "button" );

	Array.from( buttons ).forEach( button => button.classList.remove( "active" ) );

	Array.from( buttons ).forEach( button => filters.includes( button.innerText ) ?
	button.classList.add( "active" ) : button.classList.remove( "active" ));

	button.classList.toggle( "active" );

	filters = Array.isArray( filters ) ? filters : [ filters ];
	//console.log( 'filters', filters );

	GBX.surfacesFiltered = filters.flatMap( filter =>

		GBX.surfacesIndexed.filter( surface => surface.includes( `\"${ filter }\"` ) )

	);

	GBX.sendSurfacesToThreeJs( GBX.surfacesFiltered );

};



REP.toggleExteriorSurfaces = function() {

	const filters = [ "Roof", "ExteriorWall", "ExposedFloor", "Air", "Shade" ];
	const buttons = divReports.querySelectorAll( "button" );
	Array.from( buttons ).forEach( button => filters.includes( button.innerText ) ?
		button.classList.add( "active" ) : button.classList.remove( "active" )
	);

	REP.setSurfaceTypesVisible( filters );

};



//////////

REP.selStoreys = function() {

	if ( !GBX.spaces ) {

		const reSpaces = /<Space(.*?)<\/Space>/gi;
		GBX.spaces = GBX.text.match( reSpaces );

	}
	//console.log( 'spaces', GBX.spaces );

	const storeyId = selStorey.value;
	//console.log( 'storeyId', storeyId );

	spacesInStorey = GBX.spaces.filter ( space => space.includes( storeyId ) );
	//console.log( 'spacesInStorey', spacesInStorey );
	spacesInStoreyTxt = spacesInStorey.map( space => space.match( '<Name>(.*?)</Name>')[ 1 ] );
	//console.log( 'spacesInStoreyTxt', spacesInStoreyTxt );

	const spacesInStoreyIds = spacesInStorey.map( space => space.match( 'id="(.*?)"')[ 1 ] );
	//console.log( 'spacesInStoreyIds', spacesInStoreyIds );

	const surfacesVisibleBySpace = spacesInStoreyIds.flatMap( spaceId =>
		GBX.surfacesIndexed.filter( surface => surface.includes( spaceId ) )
	).sort();
	//console.log( 'surfacesVisibleBySpace', surfacesVisibleBySpace );

	//surfacesVisibleBySpaceTxt = surfacesVisibleBySpace.map( surface => surface.match( '<Name>(.*?)</Name>')[ 1 ] );
	//console.log( 'surfacesVisibleBySpaceTxt', surfacesVisibleBySpaceTxt.sort() );


	const current = document.getElementsByClassName( "active" );

	const filterArr = Array.from( current ).map ( current => current.innerText );

	GBX.surfacesFiltered = filterArr.flatMap( filter =>

		surfacesVisibleBySpace.filter( surface => surface.includes( `${ filter }` ) )

	);
	//console.log( 'GBX.surfacesFiltered',  GBX.surfacesFiltered );

	divReportsLog.innerHTML = GBX.sendSurfacesToThreeJs( GBX.surfacesFiltered );

	//GBX.surfacesFiltered = surfacesVisibleBySpace; // surfacesFiltered.slice();
	GBX.sendSurfacesToThreeJs( GBX.surfacesFiltered );

};



REP.getStoreys = function() {

	if ( !GBX.storeys ) {

		const reStoreys = /<BuildingStorey(.*?)<\/BuildingStorey>/gi;
		GBX.storeys = GBX.text.match( reStoreys );
		//console.log( 'GBX.storeys', GBX.storeys );

	}

	storeyNames = GBX.storeys.map( storey => storey.match( '<Name>(.*?)</Name>')[ 1 ] );
	//console.log( 'storeyNames', storeyNames);
	storeyIds = GBX.storeys.map( storey => storey.match( 'id="(.*?)">')[ 1 ] );
	//console.log( 'storeyIds', storeyIds );

	options = storeyNames.map( ( name, index ) => `<option value=${ storeyIds[ index ] }>${ name }</option>` );

	return options;

};



