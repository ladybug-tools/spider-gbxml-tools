// Copyright 2018 Ladybug Tools authors. MIT License
// jshint esversion: 6
/* globals THREE, THR, THRU, timeStart, divReports */


const REPL = {"release": "R9.2", "date": "2018-11-12" };


REPL.getReportByLevels = function() {

	optionsStorey = REPL.getStoreys();

	size = GBX.storeys.length > 10 ? 10 : GBX.storeys.length;

	const htm =
	`
		<p><select id=selStorey onClick=REPL.selStoreys(); multiple size=${ size } style=min-width:15rem; > ${ optionsStorey } </select></p>
	`;

	return htm;

};



REPL.getReportCurrentStatus = function() {

	let htm =
	`
		<details>

		<summary>${ REPL.date } ~ Reports ${ REPL.release }</summary>

		<p>Making good progress. All levels appearing as expected. All buttons working but interaction between surface types and level selection needs work.</p>

		<p>Wish list: faster operations on very large files</p>

		</details>
	`;

	return htm;
}


//////////

REPL.selStoreys = function() {

	//console.log( 'spaces', GBX.spaces );

	const storeyId = selStorey.value;
	//console.log( 'storeyId', storeyId );

	spacesInStorey = GBX.spaces.filter ( space => space.includes( `buildingStoreyIdRef="${ storeyId }"` ) );
	//console.log( 'spacesInStorey', spacesInStorey );

	//spacesInStoreyTxt = spacesInStorey.map( space => space.match( '<Name>(.*?)</Name>')[ 1 ] );
	//console.log( 'spacesInStoreyTxt', spacesInStoreyTxt );

	const spacesInStoreyIds = spacesInStorey.map( space => space.match( ' id="(.*?)"' )[ 1 ] );
	//console.log( 'spacesInStoreyIds', spacesInStoreyIds );

	const surfacesVisibleBySpace = spacesInStoreyIds.flatMap( spaceId =>
		GBX.surfacesIndexed.filter( surface => surface.includes( `spaceIdRef="${ spaceId }"`  ) )
	);

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
	//GBX.sendSurfacesToThreeJs( GBX.surfacesFiltered );

};



REPL.getStoreys = function() {
	//console.log( 'GBX.storeys', GBX.storeys );

	const storeyNames = GBX.storeys.map( storey => storey.match( '<Name>(.*?)</Name>' )[ 1 ] );
	//console.log( 'storeyNames', storeyNames);

	const storeyIds = GBX.storeys.map( storey => storey.match( 'id="(.*?)">')[ 1 ] );
	//console.log( 'storeyIds', storeyIds );

	const options = storeyNames.map( ( name, index ) => `<option value=${ storeyIds[ index ] }>${ name }</option>` );

	return options;

};


