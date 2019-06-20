/* globals GBX, GSA, OCSsumSurfaces, OCSdivSurfaceData, OCSdet, OCStxt */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const OCS = {

	"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
	"date": "2019-06-12",
	"description": "check for openings with area greater than enclosing surface are",
	"helpFile": "https://www.ladybug.tools/spider-gbxml-fixer/r0-4-0/ocs-openings-check-size/README.md",
	"version": "0.4.0-0"

};


OCS.types = [

	"InteriorWall", "ExteriorWall", "Roof", "InteriorFloor", "ExposedFloor", "Shade", "UndergroundWall",
	"UndergroundSlab", "Ceiling", "Air", "UndergroundCeiling", "RaisedFloor", "SlabOnGrade",
	"FreestandingColumn", "EmbeddedColumn"
];



OCS.getMenuOpeningsCheckSize= function() {

	OCS.help = `<button id=butOCS class=butHelp onclick="POP.setPopupShowHide(butOCS,OCS.helpFile);" >?</button>`;

	const htm =
		`
			<details id=OCSdet ontoggle="OCSdivSurface.innerHTML=OCS.getSurfaces();" >

				<summary id=OCSsumSurfaces >Check for openings too large
					${ OCS.help }
				</summary>

				<div id=OCSdivSurface ></div>

			</details>

		`;

	return htm;

};



OCS.getSurfaces = function() {

	const timeStart = performance.now();

	OCS.surfaces = [];

	OCS.surfaceOpenings = GBX.surfaces.filter( surface => surface.match( /<Opening/g ) );
	//console.log( 'OCS.surfaceOpenings', OCS.surfaceOpenings );

	OCS.openingsTooLarge = OCS.surfaceOpenings.filter( surface => {

		const widths = surface.match (/<Width>(.*?)<\/Width>/gi );

		const heights = surface.match (/<Height>(.*?)<\/Height>/gi );

		const width = widths.shift().match( /<Width>(.*?)<\/Width>/i )[ 1 ];

		const height = heights.shift().match( /<Height>(.*?)<\/Height>/i )[ 1 ];
		const surfaceArea = Number( width ) * Number( height );
		//console.log( 'surfaceArea', surfaceArea );

		let openingAreas = 0;

		for ( let i = 0; i < widths.length; i++ ) {

			const width = widths[ i ].match( /<Width>(.*?)<\/Width>/i )[ 1 ];
			const height = heights[ i ].match( /<Height>(.*?)<\/Height>/i )[ 1 ];

			openingAreas += Number( width ) * Number( height );


		}

		//console.log( 'openingAreas', openingAreas );

		return openingAreas >= surfaceArea;

	} )

	//console.log( 'OCS.openingsTooLarge', OCS.openingsTooLarge );

	OCS.surfacesTooSmall = OCS.openingsTooLarge.map( ( opening ) => {

		const index = GBX.surfaces.indexOf( opening );
		//console.log( 'index', index );

		const surface = GBX.surfaces[ index ];

		const id = surface.match( / id="(.*?)"/i )[ 1 ];

		let name = surface.match( /<Name>(.*?)<\/Name>/i );
		name = name ? name[ 1 ] : id;

		return { index, id, name }

	} );


	const options = OCS.surfacesTooSmall.map( surface => {

		return `<option value=${ surface.index } title="${ surface.id }" >${ surface.name }</option>`;

	} );


	const tag = OCS.surfacesTooSmall.length === 0 ? "span" : "mark";

	OCSsumSurfaces.innerHTML =
		`Check for openings too large ~ <${ tag }>${ OCS.surfacesTooSmall.length.toLocaleString() }</${ tag }> found ${ OCS.help }`;

	const htm =
	`
		<p><i>Surfaces</i></p>

		<p>${ OCS.surfaces.length.toLocaleString() } surface types found.</p>

		<p>
			<select id=OCSselSurfaces onclick=OCS.setSurfaceData(this); size=5 style=min-width:8rem; >
				${ options }
			</select>
		</p>

		<!--
		<p><button onclick=OCS.fixAllSurfaces(); >Fix all</button></p>

		<p>Click 'Save file' button in File menu to save changes to a file.</p>

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

		-->
		<hr>

		<div id="OCSdivSurfaceData" >Click a surface name above to view its details. Tool tip shows the ID of the surface.</div>

	`;

	return htm;

};



OCS.setSurfaceData = function( select ) {

	//const surface = OCS.surfaces[ select.selectedIndex ];
	//console.log( 'surface', surface );

	const htm =
	`
		${ GSA.getSurfacesAttributesByIndex( select.value, select.selectedOptions[ 0 ].innerHTML ) }

		<p>
			<button onclick=OCS.fixSurface(${ select.value }); title="" >change surface type</button>
		</p>

		<p>
			<textarea id=OCStxt style="height:20rem; width:100%;" ></textarea>
		</p>
	`;

	OCSdivSurfaceData.innerHTML = htm;

};



OCS.fixSurface = function( index ) {

	const surfaceText = GBX.surfaces[ index ];

	const surfaceTextNew = surfaceText.replace( /<Surface(.*?)>/i,
		"<Surface $1 > <Description>Edited by Spider gbXML Fixer</Description> ");

	OCStxt.value = surfaceTextNew;

};



OCS.fixAllSurfaces = function() {

	for ( let surfaceText of GBX.surfaces ) {

		const surfaceTextNew = surfaceText.replace( /<Surface(.*?)> /i,
			"<Surface $1> <Description>Edited by Spider gbXML Fixer</Description> ");

		GBX.text = GBX.text.replace( surfaceText, surfaceTextNew );

	}

	GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );

	OCSdet.open = false;

	console.log( 'GBX.surfaces[ 0 ]', GBX.surfaces[ 0 ] );

};