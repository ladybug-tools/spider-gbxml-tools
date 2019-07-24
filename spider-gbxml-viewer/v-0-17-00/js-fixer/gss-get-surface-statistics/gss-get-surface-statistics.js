/* globals GBX, GSA, GSSdivSurfaceData */
// jshint esversion: 6
// jshint loopfunc: true


const GSS = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-23",
		description: "Display all referenced gbXML surface types and CAD object IDs",
		helpFile: "../v-0-17-00/js-fixer/gss-get-surface-statistics/gss-get-surface-statistics.md",
		license: "MIT License",
		version: "0.17.00-0gss"

	}

};


GSS.types = [

	"InteriorWall", "ExteriorWall", "Roof", "InteriorFloor", "ExposedFloor", "Shade", "UndergroundWall",
	"UndergroundSlab", "Ceiling", "Air", "UndergroundCeiling", "RaisedFloor", "SlabOnGrade",
	"FreestandingColumn", "EmbeddedColumn"

];



GSS.getMenuSurfaceStatistics = function() {

	const htm =
		`
			<details ontoggle="GSSdivSurface.innerHTML=GSS.getSurfaces();" >

				<summary id=GSSsumSurfaces >Show surfaces statistics</summary>

				${ GBXF.getHelpButton( "GSSbutHelp", GSS.script.helpFile ) }

				<div id=GSSdivSurface ></div>

				<div id=GSSdivSurfaceAttributeData ></div>

			</details>

		`;

	return htm;

};



GSS.getSurfaces = function() {

	const timeStart = performance.now();

	const matches = GBX.text.match( /surfaceType="(.*?)"/gi );
	//console.log( 'matches', matches );

	const items = matches.map( item => item.slice( 13, -1 ) );
	//console.log( 'items', items );

	const types = [...new Set( items )];
	//console.log( 'types', types );

	const matchesId = GBX.text.match( /<CADObjectId>(.*?)\[/gi );
	//console.log( 'matchesId', matchesId );

	let cadIds = [];

	if ( matchesId && matchesId.length ) {

		const itemsId = matchesId.slice( 1 ).map( item => item.slice( 13, -2 ) );
		//console.log( 'itemsId', itemsId );

		cadIds = [...new Set( itemsId ) ].sort();
		//console.log( 'cadIds', cadIds );

	}

	const htm =
	`
		<p><i>Surfaces</i></p>

		<p>${ types.length } surface types found: <br><br> ${ types.join( "<br>" ) } </p>

		<p>${ cadIds.length } CAD Object IDs found: <br><br> ${ cadIds.join( "<br>" ) } </p>

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

	`;

	return htm;


};



GSS.setSurfaceData = function( select ) {

	const surface = GSS.surfaces[ select.selectedIndex ];
	//console.log( 'surface', surface );

	const htm = GSA.getSurfacesAttributesByIndex( select.selectedIndex, surface.name );

	GSSdivSurfaceData.innerHTML = htm;

};



GSS.changeAllSurfaces = function() {

	console.log( 'GBX.surfaces', GBX.surfaces );

};