

const EVG = {};

EVG.getStats = function() {

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


EVG.getReports = function() {

	const types = GBX.surfaceTypes.filter( type => GBX.surfaces.find( surface => surface.includes( type ) ) );

	let colors =  types.map( type => GBX.colorsDefault[ type ].toString( 16 ) );
	colors = colors.map( color => color.length > 4 ? color : '00' + color ); // otherwise greens no show
	//console.log( 'col', colors );

	buttonSurfaceTypes = types.map( ( type, index ) =>
		`<button class=butSurfaceType onclick=EVG.toggleSurfaceFiltered(this); style="background-color:#${ colors[ index ] };" > ${ type } </button>`
	);

	optionsStorey = EVG.getStoreys();

	size = GBX.storeys.length > 10 ? 10 : GBX.storeys.length;

	const htm =
	`
		<p>${ buttonSurfaceTypes.join( '<br>' ) }</p>

		<p><select id=selStorey onClick=EVG.selStoreys(); multiple size=${ size } style=min-width:15rem; > ${ optionsStorey } </select></p>

	`;

	return htm;

};



EVG.selStoreys = function() {

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
		GBX.surfaces.filter( surface => surface.includes( spaceId ) )
	).sort();
	//console.log( 'surfacesVisibleBySpace', surfacesVisibleBySpace );
	surfacesVisibleBySpaceTxt = surfacesVisibleBySpace.map( surface => surface.match( '<Name>(.*?)</Name>')[ 1 ] );
	//console.log( 'surfacesVisibleBySpaceTxt', surfacesVisibleBySpaceTxt.sort() );

	//button.classList.toggle( "active" );

	const current = document.getElementsByClassName( "active" );

	const filterArr = Array.from( current ).map ( current => current.innerText );


	//const buttons = Array.from( detReports.querySelectorAll( "button" ) );
	//buttonsSelected = buttons.filter( button => button.style.color !== '' ).map( button => button.innerText);
	//console.log( 'buttonsSelected', buttonsSelected );

	//const surfacesFiltered = buttonsSelected.flatMap( button =>
	//	surfacesVisibleBySpace.filter( surface => surface.includes( button ) )
	//);


	GBX.surfacesFiltered = filterArr.flatMap( filter =>

		surfacesVisibleBySpace.filter( surface => surface.includes( `${ filter }` ) )

	);
	//console.log( 'GBX.surfacesFiltered',  GBX.surfacesFiltered );

	divReportsLog.innerHTML = GBX.sendSurfacesToThreeJs( GBX.surfacesFiltered );

	//GBX.surfacesFiltered = surfacesVisibleBySpace; // surfacesFiltered.slice();
	GBX.sendSurfacesToThreeJs( GBX.surfacesFiltered );

};



EVG.getStoreys = function() {

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



//////////

EVG.toggleSurfaceFiltered = function( button ) {

	button.classList.toggle( "active" );

	const current = document.getElementsByClassName( "active" );

	const filterArr = Array.from( current ).map ( current => current.innerText );

	EVG.setSurfaceTypesVisible ( filterArr );

};




EVG.setSurfacesFiltered = function( filters, target, button) {

	backColor = button.style.backgroundColor;

	button.style.cssText = button.style.color === "" ? `; color:  ${ backColor }; font-style: bold; ` : `background-color: ${ backColor };`;

	const buttons = Array.from( target.querySelectorAll( "button" ) );

	buttonsSelected = buttons.filter( button => button.style.color !== '' );

	filters = buttonsSelected.map( button => button.innerText );

	console.log( 'filters', filters );

	GBX.surfacesFiltered = [];

	filters.map( filter => {

		GBX.surfacesFiltered.push( ...GBX.surfaces.filter( surface => surface.includes( `${ filter }` ) ) );

	} );
	//console.log( 'GBX.surfacesFiltered',  GBX.surfacesFiltered );

	GBX.sendSurfacesToThreeJs( GBX.surfacesFiltered );

};

EVG.toggleExteriorSurfaces = function() {

	const filters = [ "Roof", "ExteriorWall", "ExposedFloor", "Air", "Shade" ];
	const buttons = divReports.querySelectorAll( "button" );
	Array.from( buttons ).forEach( button => filters.includes( button.innerText ) ?
		button.classList.add( "active" ) : button.classList.remove( "active" )
	);

	EVG.setSurfaceTypesVisible( filters );

};



EVG.setSurfaceTypesVisible = function ( typesArray ) {

	GBX.surfacesFiltered = typesArray.flatMap( filter =>

		GBX.surfaces.filter( surface => surface.includes( `${ filter }` ) )

	);
	//console.log( 'GBX.surfacesFiltered',  GBX.surfacesFiltered );

	divReportsLog.innerHTML = GBX.sendSurfacesToThreeJs( GBX.surfacesFiltered );

}
