/* globals GBX, GSA, GWVsumSurfaces, GWVdivSurfaceData, GWVdet, GWVtxt */
// jshint esversion: 6
// jshint loopfunc: true

const GWV = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-23",
		description: "Check for surfaces with vertices unconnected to other vertices. Ignore all \"Shade\" surface types.",
		helpFile: "../v-0-17-00/js-fixer/gwv-get-watertight-vertices/gwv-get-watertight-vertices.md",
		license: "MIT License",
		version: "0.17.00-0gwv"

	}

};


GWV.typesNoShade = [

	"InteriorWall", "ExteriorWall", "Roof", "InteriorFloor", "ExposedFloor", "UndergroundWall",
	"UndergroundSlab", "Ceiling", "Air", "UndergroundCeiling", "RaisedFloor", "SlabOnGrade",
	"FreestandingColumn", "EmbeddedColumn"
];



GWV.getMenuWatertightVertices = function() {


	const htm =
		`
			<details id=GWVdet ontoggle="GWVdivSurface.innerHTML=GWV.getSurfacesTight();" >

				<summary id=GWVsumSurfaces >Check for non-watertight vertices</summary>

				${ GBXF.getHelpButton( "GWVbutHelp", GWV.script.helpFile ) }

				<p>${ GWV.script.description } See ?/read me for more details.</p>

				<div id=GWVdivSurface ></div>

			</details>

		`;

	return htm;

};



GWV.getSurfacesTight = function() {

	const timeStart = performance.now();

	GWV.surfacesNoShade = GBX.surfaces.filter( ( surface, index ) => {

		const id = surface.match( / id="(.*?)"/i )[ 1 ];

		let typeSource = surface.match( /surfaceType="(.*?)"/i );
		typeSource = typeSource ? typeSource[ 1 ] : "";
		//console.log( '', typeSource );

		return GWV.typesNoShade.includes( typeSource ) === true;

	} );
	//console.log( 'GWV.surfacesNoShade', GWV.surfacesNoShade );

	GWV.cartesianPoints = [];

	GWV.surfacesNoShade.forEach ( surface => {

		planarGeometry = surface.match( /<PlanarGeometry(.*?)<\/PlanarGeometry>/gi )[ 0 ]; // [ 0] is for surface - others are openings
		//console.log( 'planarGeometry', planarGeometry );

		cartesianPoints = planarGeometry.match( /<CartesianPoint(.*?)<\/CartesianPoint>/gi );
		//console.log( 'cartesianPoints', cartesianPoints );

		GWV.cartesianPoints.push( ...cartesianPoints );

	}) ;
	//console.log( 'GWV.cartesianPoints', GWV.cartesianPoints );

	GWV.uniquePoints = [...new Set( GWV.cartesianPoints ) ];
	//console.log( "GWV.uniquePoints", GWV.uniquePoints);

	GWV.pointCount = Array.from( { length: GWV.uniquePoints.length }, () => 0 )
	//console.log( 'pointCount', pointCount );

	for ( let surface of GWV.surfacesNoShade ) {

		const cartesianPoints = surface.match( /<CartesianPoint(.*?)<\/CartesianPoint>/gi );
		//console.log( 'cartesianPoints', cartesianPoints.length );

		for ( let point of cartesianPoints ) {
			//console.log( 'point', point );

			const index = GWV.uniquePoints.indexOf( point );

			if ( index > -1 ) {

				GWV.pointCount[ index ]++;

			}

		}

	}
	//console.log( 'GWV.pointCount', GWV.pointCount );

	GWV.surfaceUniques = [];

	GWV.pointCount.forEach( ( point, index ) => {

		if ( point < 2 ) {
			//console.log( 'point', point, index );

			const surfaces = GWV.surfacesNoShade.filter( ( surface ) => surface.includes( GWV.uniquePoints[ index ] ) );
			//console.log( 'surfaces', surfaces );

			GWV.surfaceUniques.push( surfaces[ 0 ] );

		}

	} );

	const options = GWV.surfaceUniques.map( surface => {

		const id = surface.match( / id="(.*?)"/i )[ 1 ];

		const index = GBX.surfaces.indexOf( surface );

		return `<option value=${ index } title="${ id }" >${ id }</option>`;

	} );

	const tag = GWV.surfaceUniques.length === 0 ? "span" : "mark";

	GWVsumSurfaces.innerHTML =
		`Check for non-watertight vertices ~ <${ tag }>${ GWV.surfaceUniques.length.toLocaleString() }</${ tag }> found`;

	const htm =
	`

		<p>${ GWV.surfaceUniques.length.toLocaleString() } unconnected vertices found.</p>

		<p>
			<select id=GWVselSurfaces onclick=GWV.setSurfaceData(this); size=5 style=min-width:8rem; >
				${ options }
			</select>
		</p>
<!--

		<p><button onclick=GWV.fixAllSurfaces(); >Fix all</button></p>

		<p>Click 'Save file' button in File menu to save changes to a file.</p>
-->
		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

		<hr>

		<div id="GWVdivSurfaceData" >Click a surface name above to view its details and change its surface type. Tool tip shows the ID of the surface.</div>


	`;

	return htm;

};



GWV.setSurfaceData = function( select ) {

	//const surface = GWV.surfacesNoShade[ select.selectedIndex ];
	//console.log( 'surface', surface );

	const htm =
	`
		${ GSA.getSurfacesAttributesByIndex( select.value , select.selectedOptions[ 0 ].innerHTML ) }
<!--
		<p>
			<button onclick=GWV.fixSurface(${ select.value }); title="" >change surface type</button>
		</p>
-->
		<p>
			<textarea id=GWVtxt style="height:20rem; width:100%;" ></textarea>
		</p>
	`;

	GWVdivSurfaceData.innerHTML = htm;

};



GWV.fixSurface = function( index ) {

	const surfaceText = GBX.surfaces[ index ];

	const surfaceTextNew = surfaceText.replace( /<Surface(.*?)>/i,
		"<Surface $1 > <Description>Edited by Spider gbXML Fixer</Description> ");

	GWVtxt.value = surfaceTextNew;

};



GWV.fixAllSurfaces = function() {

	for ( let surfaceText of GBX.surfaces ) {

		const surfaceTextNew = surfaceText.replace( /<Surface(.*?)> /i,
			"<Surface $1> <Description>Edited by Spider gbXML Fixer</Description> ");

		GBX.text = GBX.text.replace( surfaceText, surfaceTextNew );

	}

	GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );

	GWVdet.open = false;

	console.log( 'GBX.surfaces[ 0 ]', GBX.surfaces[ 0 ] );

};