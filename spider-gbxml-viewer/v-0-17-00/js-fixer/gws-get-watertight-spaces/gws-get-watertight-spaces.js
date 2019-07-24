/* globals GBX, GSA, GWSsumSurfaces, GWSdivSurfaceData, GWSdet, GWStxt */
// jshint esversion: 6
// jshint loopfunc: true


const GWS = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-23",
		description: "Checking for water-tight spaces",
		helpFile: "../v-0-17-00/js-fixer/gws-get-watertight-spaces/gws-get-watertight-spaces.md",
		license: "MIT License",
		version: "0.17.00-0gws"

	}

};


GWS.types = [

	"InteriorWall", "ExteriorWall", "Roof", "InteriorFloor", "ExposedFloor", "Shade", "UndergroundWall",
	"UndergroundSlab", "Ceiling", "Air", "UndergroundCeiling", "RaisedFloor", "SlabOnGrade",
	"FreestandingColumn", "EmbeddedColumn"
];



GWS.getMenuWatertightSpaces = function() {

	const htm =
		`
			<details id=GWSdet ontoggle="GWSdivSurface.innerHTML=GWS.getSurfaceData();" >

				<summary id=GWSsumSurfaces >Check for non-watertight spaces</summary>

				${ GBXF.getHelpButton( "GWSbutHelp", GWS.script.helpFile ) }

				<div id=GWSdivSurface ></div>

			</details>

		`;

	return htm;

};



GWS.getSurfaces = function() {

	const timeStart = performance.now();

	GWS.surfaces = [];

	GWS.surfaces = GBX.surfaces.map( ( surface, index ) => {

		const id = surface.match( / id="(.*?)"/i )[ 1 ];

		let name = surface.match( /<Name>(.*?)<\/Name>/i );
		name = name ? name[ 1 ] : id;

		let typeSource = surface.match( /surfaceType="(.*?)"/i );
		typeSource = typeSource ? typeSource[ 1 ] : "";
		//console.log( '', typeSource );

		let exposedToSun = surface.match( /exposedToSun="(.*?)"/i );
		//console.log( 'exposedToSun', exposedToSun );
		exposedToSun = exposedToSun ? exposedToSun[ 0 ] : "";
		//let exposedToSunBoolean = exposedToSun ? exposedToSun[ 1 ].toLowerCase() === "true" : "false";

		return( { index, id, name, typeSource, exposedToSun } );

	} );
	//console.log( 'GWS.surfaces', GWS.surfaces );

	const options = GWS.surfaces.map( surface => {

		return `<option value=${ surface.index } title="${ surface.id }" >${ surface.name }</option>`;

	} );


	const tag = GWS.surfaces.length === 0 ? "span" : "mark";

	GWSsumSurfaces.innerHTML =
		`Check for non-watertight spaceRefs ~ <${ tag }>${ GWS.surfaces.length.toLocaleString() }</${ tag }> found`;

	const htm =
	`
		<p><i>Surfaces</i></p>

		<p>${ GWS.surfaces.length.toLocaleString() } surface types found.</p>

		<p>
			<select id=GWSselSurfaces onclick=GWS.setSurfaceData(this); size=5 style=min-width:8rem; >
				${ options }
			</select>
		</p>

		<p><button onclick=GWS.fixAllSurfaces(); >Fix all</button></p>

		<p>Click 'Save file' button in File menu to save changes to a file.</p>

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

		<hr>

		<div id="GWSdivSurfaceData" >Click a surface name above to view its details. Tool tip shows the ID of the surface.</div>

	`;

	return htm;

};



GWS.getSurfaceData = function() {

	const timeStart = performance.now();

	GWS.surfacesTight = [];

	GWS.surfacesTight = GBX.surfaces.filter( ( surface, index ) => {

		const id = surface.match( / id="(.*?)"/i )[ 1 ];

		let typeSource = surface.match( /surfaceType="(.*?)"/i );
		typeSource = typeSource ? typeSource[ 1 ] : "";
		//console.log( '', typeSource );

		return typeSource !== "Shade";

	} );
	//console.log( 'GWS.surfacesTight', GWS.surfacesTight );

	GWS.cartesianPoints = [];

	GWS.surfacesTight.forEach ( surface => {

		planarGeometry = surface.match( /<PlanarGeometry(.*?)<\/PlanarGeometry>/gi )[ 0 ];
		//console.log( 'planarGeometry', planarGeometry );

		cartesianPoints = planarGeometry.match( /<CartesianPoint(.*?)<\/CartesianPoint>/gi );
		//console.log( 'cartesianPoints', cartesianPoints );

		GWS.cartesianPoints.push( ...cartesianPoints );

	}) ;
	//console.log( 'GWS.cartesianPoints', GWS.cartesianPoints );

	GWS.uniquePoints = [...new Set( GWS.cartesianPoints ) ];
	//console.log( "GWS.uniquePoints", GWS.uniquePoints);

	GWS.pointCount = Array.from( { length: GWS.uniquePoints.length }, () => 0 )
	//console.log( 'pointCount', pointCount );

	for ( let surface of GWS.surfacesTight ) {

		const cartesianPoints = surface.match( /<CartesianPoint(.*?)<\/CartesianPoint>/gi );
		//console.log( 'cartesianPoints', cartesianPoints.length );

		for ( let point of cartesianPoints ) {
			//console.log( 'point', point );

			const index = GWS.uniquePoints.indexOf( point );

			if ( index > -1 ) {

				GWS.pointCount[ index ]++;

			}

		}

	}
	//console.log( 'GWS.pointCount', GWS.pointCount );

	GWS.surfaceDoubles = [];

	GWS.pointCount.forEach( ( point, index ) => {

		if ( point === 2 ) {
			//console.log( 'point', point, index );

			const surfaces = GWS.surfacesTight.filter( ( surface ) => surface.includes( GWS.uniquePoints[ index ] ) );
			//console.log( 'surfaces', surfaces );

			GWS.surfaceDoubles.push( surfaces[ 0 ] );

		}

	} );

	GWS.spaceRefs = []

	GWS.surfaceDoubles.forEach( surface => {

		const spaceref = surface.match( /spaceIdRef="(.*?)"/i )[ 1 ];

		//console.log( 'spaceref', spaceref );

		if ( GWS.spaceRefs.indexOf( spaceref ) === -1 ){

			GWS.spaceRefs.push( spaceref )
		}
	})
	//console.log( 'GWS.spaceRefs', GWS.spaceRefs );


	const options = GWS.spaceRefs.map( ( spaceref, index ) => {

		space = GBX.spaces.find( space => space.includes( spaceref ) )

		//console.log( 'space', space );

		//const id = surface.match( / id="(.*?)"/i )[ 1 ];

		//const index = GBX.surfaces.indexOf( surface );

		let name = space.match( /<Name>(.*?)<\/Name>/i );
		name = name ? name[ 1 ] : id;

		return `<option value=${ index } title="${ spaceref }" >${ name }</option>`;

	} );

	const tag = GWS.spaceRefs.length === 0 ? "span" : "mark";

	GWSsumSurfaces.innerHTML =
		`Check for non-watertight spaceRefs ~ <${ tag }>${ GWS.spaceRefs.length.toLocaleString() }</${ tag }> found ${ GWS.help }`;

	const htm =
	`
		<p>
			${ GWS.spaceRefs.length.toLocaleString() } spaces with possible manifold issues found.
			This is a work-in-progress. A number of false positives are likely to be found.
			<mark>Space in 3D view is not being displayed.</mark>
		</p>

		<p>
			<select id=GWSselSurfaces onclick=GWS.setSurfaceData(this); size=5 style=min-width:8rem; >
				${ options }
			</select>
		</p>
<!--

		<p><button onclick=GWS.fixAllSurfaces(); >Fix all</button></p>

		<p>Click 'Save file' button in File menu to save changes to a file.</p>
-->
		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

		<hr>

		<div id="GWSdivSurfaceData" >Click a surface name above to view its details and change its surface type. Tool tip shows the ID of the surface.</div>


	`;

	return htm;


};



GWS.setSurfaceData = function( select ) {

	//const surface = GWV.surfacesTight[ select.selectedIndex ];
	//console.log( 'surface', surface );


	let htm =
	`
		${ GSA.getSurfacesAttributesByIndex( select.value , select.selectedOptions[ 0 ].innerHTML ) }

		<p>
			<button onclick=GWV.fixSurface(${ select.value }); title="" >change surface type</button>
		</p>

		<p>
			<textarea id=GWVtxt style="height:20rem; width:100%;" ></textarea>
		</p>
	`;

	GWSdivSurfaceData.innerHTML = "<p>not working yet</p>";

};



GWS.fixSurface = function( index ) {

	const surfaceText = GBX.surfaces[ index ];

	const surfaceTextNew = surfaceText.replace( /<Surface(.*?)>/i,
		"<Surface $1 > <Description>Edited by Spider gbXML Fixer</Description> ");

	GWStxt.value = surfaceTextNew;

};



GWS.fixAllSurfaces = function() {

	for ( let surfaceText of GBX.surfaces ) {

		const surfaceTextNew = surfaceText.replace( /<Surface(.*?)> /i,
			"<Surface $1> <Description>Edited by Spider gbXML Fixer</Description> ");

		GBX.text = GBX.text.replace( surfaceText, surfaceTextNew );

	}

	GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );

	GWSdet.open = false;

	console.log( 'GBX.surfaces[ 0 ]', GBX.surfaces[ 0 ] );

};