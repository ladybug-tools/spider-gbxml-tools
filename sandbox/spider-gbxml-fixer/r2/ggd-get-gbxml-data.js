//Copyright 2019 Ladybug Tools authors. MIT License
/* globals SGF, FIL */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const GGD = { release: "2.1.0", date: "2019-04-05" };

GGD.description = `Gather data to be used by other modules and report statistics`;


GGD.currentStatus =
	`
		<h3>Get gbXML Data (GGD) ${ GGD.release } status ${ GGD.date }</h3>

		<p>${ GGD.description }</p>
		<p>
			<a href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/sandbox/spider-gbxml-fixer/r2/ggd-get-gbxml-data.js" target="_blank">
			ggd-get-gbxml-data.js source code</a>
		</p>
		<details>
			<summary>Wish List / To Do</summary>
			<ul>
				<li>2019-03-23 ~ Handle more file types</li>
			</ul>
		</details>
		<details>
			<summary>Change log</summary>
			<ul>
				<li>2019-04-05 ~ r ~ make cookbook compatible </li>
  				<li>2019-04-03 ~ F - First commit</li>
			</ul>
		</details>
	`;



GGD.getGbxmlData = function() {

	const htm =
		`
			<details ontoggle="GGDdivGbxmlData.innerHTML=GGD.getData(SGF.text);" >

				<summary id=GGDsumGetGbxmlData class=sumHeader >Show gbXML file statistics
					<a id=ggdSum class=helpItem href="JavaScript:MNU.setPopupShowHide(ggdSum,GGD.currentStatus);" >&nbsp; ? &nbsp;</a>
				</summary>

				<div id=GGDdivGbxmlData ></div>

			</details>

		`;

	return htm;

};


GGD.getData = function( dataFile ) {

	const timeStart = performance.now();

	SGF.text = dataFile.replace( /\r\n|\n/g, '' );
	SGF.surfaces = SGF.text.match( /<Surface(.*?)<\/Surface>/gi );
	//console.log( 'SGF.surfaces', SGF.surfaces );

	const reSpaces = /<Space(.*?)<\/Space>/gi;
	SGF.spaces = SGF.text.match( reSpaces );
	//console.log( 'spaces', SGF.spaces );

	const reStoreys = /<BuildingStorey(.*?)<\/BuildingStorey>/gi;
	SGF.storeys = SGF.text.match( reStoreys );
	SGF.storeys = Array.isArray( SGF.storeys ) ? SGF.storeys : [];
	//console.log( 'SGF.storeys', SGF.storeys );

	const reZones = /<Zone(.*?)<\/Zone>/gi;
	SGF.zones = SGF.text.match( reZones );
	SGF.zones = Array.isArray( SGF.zones ) ? SGF.zones : [];
	//console.log( 'SGF.zones', SGF.zones );

	const verticesCount = SGF.surfaces.map( surfaces => getVertices( surfaces ) );
	//console.log( 'vertices', vertices );

	const count = verticesCount.reduce( ( count, val, index ) => count + verticesCount[ index ].length, 0 );

	const openings = SGF.text.match( /<Opening(.*?)<\/Opening>/gi );
	SGF.openings = openings || [];

	const constructions = SGF.text.match( /<Construction(.*?)<\/Construction>/gi );
	SGF.constructions = constructions || [];

	const materials = SGF.text.match( /<material(.*?)<\/material>/gi );
	SGF.materials = materials || [];

	const htm =
	`
		<p><i>gbXML elements statistics</i></p>
		<p>Surfaces: ${ SGF.surfaces.length.toLocaleString() } </p>
		<p>Spaces: ${ SGF.spaces.length.toLocaleString() } </p>
		<p>Storeys: ${ SGF.storeys.length.toLocaleString() } </p>
		<p>Zones: ${ SGF.zones.length.toLocaleString() } </p>
		<p>Openings in surfaces: ${ SGF.openings.length.toLocaleString() }</p>
		<p>Coordinates in surfaces: ${ count.toLocaleString() } </p>
		<p>Construction types: ${ SGF.constructions.length.toLocaleString() } </p>
		<p>Materials: ${ SGF.materials.length.toLocaleString() } </p>

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>
	`;

	return htm;


		function getVertices( surface ) {

			const re = /<coordinate(.*?)<\/coordinate>/gi;
			const coordinatesText = surface.match( re );
			const coordinates = coordinatesText.map( coordinate => coordinate.replace(/<\/?coordinate>/gi, '' ) )
				.map( txt => Number( txt ) );

			return coordinates;

		}

};
