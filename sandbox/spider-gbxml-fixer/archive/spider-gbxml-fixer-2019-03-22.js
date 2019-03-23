// Copyright 2019 Ladybug Tools authors. MIT License
/* globals */
/* jshint esversion: 6 */
/* jshint loopfunc:true */



SGT.getStats = function() {

	const timeStart = performance.now();

	const reSpaces = /<Space(.*?)<\/Space>/gi;
	SGT.spaces = SGT.text.match( reSpaces );
	//console.log( 'spaces', SGT.spaces );

	const reStoreys = /<BuildingStorey(.*?)<\/BuildingStorey>/gi;
	SGT.storeys = SGT.text.match( reStoreys );
	SGT.storeys = Array.isArray( SGT.storeys ) ? SGT.storeys : [];
	//console.log( 'SGT.storeys', SGT.storeys );

	const reZones = /<Zone(.*?)<\/Zone>/gi;
	SGT.zones = SGT.text.match( reZones );
	SGT.zones = Array.isArray( SGT.zones ) ? SGT.zones : [];
	//console.log( 'SGT.zones', SGT.zones );

	const verticesCount = SGT.surfaces.map( surfaces => getVertices( surfaces ) );
	//console.log( 'vertices', vertices );

	const count = verticesCount.reduce( ( count, val, index ) => count + verticesCount[ index ].length, 0 );

	const htm =
	`
		<p><i>gbXML elements statistics</i></p>
		<p>Spaces: ${ SGT.spaces.length.toLocaleString() } </p>
		<p>Storeys: ${ SGT.storeys.length.toLocaleString() } </p>
		<p>Zones: ${ SGT.zones.length.toLocaleString() } </p>
		<p>Surfaces: ${ SGT.surfaces.length.toLocaleString() } </p>
		<p>Coordinates in surfaces: ${ count.toLocaleString() } </p>

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>
	`;


	statsHtm = SGT.getItemHtm( {
		summary: `File Statistics`,
		description: `gbXML elements statistics`,
		contents: `${ htm }`,
		timeStart: timeStart
	} );


	function getVertices( surface ) {

		const re = /<coordinate(.*?)<\/coordinate>/gi;
		const coordinatesText = surface.match( re );
		const coordinates = coordinatesText.map( coordinate => coordinate.replace(/<\/?coordinate>/gi, '' ) )
			.map( txt => Number( txt ) );

		return coordinates;

	};

	return htm;

};



SGT.getCheckGeneral = function() {

	const timeStart = performance.now();
	let htm = "";

	if ( SGT.text.includes( 'utf-16' ) ) {

		htm +=
		`
			<p>
				File is utf-16 and supports double byte characters.
				The file is twice the size of a utf-8 file. This may be unnecessary.
			</p>

		`;
	}

	let area =  SGT.text.match( /<Area(> <|><|>0<?)\/Area>/gi );
	area ? area.length : 0;
	//console.log( 'area', area );

	htm +=
	`
		<p>
			Area = 0: ${ area } found
		</p>
	`;


	let vol = SGT.text.match( /<volume(> <|><|>0<?)\/volume>/gi );
	vol = vol ? vol.length : 0;

	htm  +=
	`
		<p>
			Volume = 0: ${ vol } found
		</p>
	`;

	let string = SGT.text.match( /""/gi );
	string = string ? string.length : 0;

	htm  +=
	`
		<p>
			String = "": ${ string } found
		</p>
	`;

	//divContents.innerHTML += htm;

	const errors = area + vol + string;

	generalHtm = SGT.getItemHtm( {
		open: errors > 0 ? "open" : "",
		summary: `General Check - ${ errors } found`,
		description: `check for elements with no values`,
		contents: `${ htm }`,
		timeStart: timeStart
	} );


	generalHtm =
	`
		<p><i>check for elements with no values</i></p>
		<p>General Check - ${ errors } found</p>

		<p>${ htm }</p>

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>
	`;

	return generalHtm;

};



SGT.getCheckOffsetMenu = function() {

	htm =
	`
		<details ontoggle=SGT.setCheckOffset();>

			<summary class=sumHeader title="Click to run" >Maximum offset distance from Origin </summary>

		</details>
	`;

	return htm;

};



SGT.getCheckOffset = function() {

	const timeStart = performance.now();
	let max = 0;

	FIL.text.match( /<Coordinate>(.*?)<\/Coordinate>/gi )
		.forEach ( coordinate => {

			const numb = Number( coordinate.match( /<Coordinate>(.*?)<\/Coordinate>/i )[ 1 ] );
			max = numb > max ? numb : max;

		} );

	const ccoffsetHtm = SGT.getItemHtm( {
		open: "open", // max > 100000 ? "open" : "",
		summary: `Maximum offset distance from Origin - ${ max.toLocaleString() }`,
		 description: "Largest distance - x, y, or z - from the origin at 0, 0, 0",
		contents: `Largest coordinate found: ${ max.toLocaleString() }`,
		timeStart: timeStart
	} );

	const offsetHtm =

	`
		<p><i>Largest distance - x, y, or z - from the origin at 0, 0, 0</i></p>

		<p>Maximum offset distance from Origin - ${ max.toLocaleString() }</p>

		<p>Largest coordinate found: ${ max.toLocaleString() }</p>

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>
		
	`;

	return offsetHtm;

};
