/* globals GBX, GSA, FETSdet, FETStxt, FETSdivSurfaceData, FETSsumSurfaces */
// jshint esversion: 6
// jshint loopfunc: true


const FETS = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-23",
		description: "Checks for surface with invalid exposedToSun values",
		helpFile: "../v-0-17-00/js-fixer/fets-fix-exposed-to-sun/fets-fix-exposed-to-sun.md",
		license: "MIT License",
		version: "0.17.00-0fets"

	}

};


FETS.types = [
	"InteriorWall", "ExteriorWall", "Roof", "InteriorFloor", "ExposedFloor", "Shade", "UndergroundWall",
	"UndergroundSlab", "Ceiling", "Air", "UndergroundCeiling", "RaisedFloor", "SlabOnGrade",
	"FreestandingColumn", "EmbeddedColumn"
];


FETS.exposedTypes = [ "ExteriorWall", "Roof", "ExposedFloor", "Shade", "RaisedFloor" ];



//////////

FETS.getMenuSurfaceExposedToSun = function() {

	const htm =
	`
		<details id=FETSdet ontoggle="FETSdivSurfaces.innerHTML=FETS.getSurfaceExposedToSunErrors();" >

			<summary id=FETSsumSurfaces >Fix surfaces with invalid ExposedToSun</summary>

			${ GBXF.getHelpButton( "FETSbutHelp", FETS.script.helpFile ) }

			<div id=FETSdivSurfaces ></div>

			<div id=FETSdivSurfaceData ></div>

		</details>

	`;

	return htm;

};



FETS.getSurfaceExposedToSunErrors = function() {

	const timeStart = performance.now();

	FETSdivSurfaceData.innerHTML = "";

	FETS.errors = [];
	FETS.errorsByType = [];
	FETS.errorsByValue = [];
	FETS.errorsByAttribute = [];

	FETS.surfaceTypes = GBX.surfaces.map( ( surface, index ) => {

		const id = surface.match( / id="(.*?)"/i )[ 1 ];

		let name = surface.match( /<Name>(.*?)<\/Name>/i );
		name = name ? name[ 1 ] : id;

		let typeSource = surface.match( /surfaceType="(.*?)"/i );
		typeSource = typeSource ? typeSource[ 1 ] : "";

		let exposedToSun = surface.match( /exposedToSun="(.*?)"/i );
		//console.log( 'exposedToSun', exposedToSun );

		let exposedToSunBoolean = exposedToSun ? exposedToSun[ 1 ].toLowerCase() === "true" : false;

		/*
		if ( exposedToSunBoolean === true && FETS.exposedTypes.includes( typeSource ) === false ) {
			//console.log( 'exposedToSun', exposedToSun );

			if ( exposedToSun[ 1 ] === "true" ) {

				FETS.errorsByType.push( { id, index, name, typeSource, exposedToSunBoolean, exposedToSun } );

			}

		} else if ( exposedToSunBoolean === false && FETS.exposedTypes.includes( typeSource ) === true  ) {

			if ( exposedToSun && exposedToSun.length ) {

				FETS.errorsByValue.push( {id, index, name, typeSource, exposedToSunBoolean, exposedToSun } );

			} else {

				FETS.errorsByAttribute.push( {id, index, name, typeSource, exposedToSunBoolean, exposedToSun } );

			}

		}

		*/


		if ( exposedToSunBoolean === true && FETS.exposedTypes.includes( typeSource ) === false ) {
			//console.log( 'exposedToSun', exposedToSun );

			if ( exposedToSun[ 1 ] === "true" ) {

				const fix = `exposedToSun="True"`;
				FETS.errors.push( { id, index, name, typeSource, exposedToSunBoolean, exposedToSun, fix } );

			}

		} else if ( exposedToSunBoolean === false && FETS.exposedTypes.includes( typeSource ) === true  ) {

			if ( exposedToSun && exposedToSun.length ) {

				const fix = `exposedToSun="True"`;
				FETS.errors.push( {id, index, name, typeSource, exposedToSunBoolean, exposedToSun, fix } );

			} else {

				const fix = `exposedToSun="False"`;
				FETS.errors.push( {id, index, name, typeSource, exposedToSunBoolean, exposedToSun, fix } );

			}

		}

	} );


	const tag = FETS.errors.length === 0 ? "span" : "mark";

	FETSsumSurfaces.innerHTML =
	`Fix surfaces with invalid ExposedToSun
		~ <${ tag }>${ ( FETS.errors.length ).toLocaleString() }</${ tag }> errors`;

	const options = FETS.errors.map( surface => {

		return `<option value=${ surface.index } title="${ surface.id }" >${ surface.name }</option>`;

	} );

	const htm =
	`
		<p><i>${ FETS.errors.length.toLocaleString() } surface(s) with exposedToSun issues</i></p>

		<p>
			<select id=FETSselSurfaces onclick=FETS.setSurfaceData(this.selectedIndex); size=5 style=min-width:8rem; >
				${ options }
			</select>
		</p>

		<p><button onclick=FETS.fixAllSurfaces(); >Fix all</button></p>

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

	`;

	return htm;

};



FETS.setSurfaceData = function( index ) {

	//if ( !index ) { return; }

	const item = FETS.errors[ index ];
	//console.log( 'item', item );

	const htm =
	`
		${ GSA.getSurfacesAttributesByIndex( item.index, item.name ) }

		<p>
			<button onclick="FETS.fixSurface(${index});" title="" >update exposedToSun</button>
		</p>

		<p>
			<textarea id=FETStxt style="height:20rem; width:100%;" ></textarea>
		</p>
	`;

	//FETSdivSurfaceData.innerHTML = htm;

};



FETS.fixSurface = function( index ) {
	//console.log( 'index', index );

	const item = FETS.errors[ index ];
	//console.log( '', item );

	const surfaceCurrent = GBX.surfaces[ item.index ];
	let surfaceNew;

	if ( surfaceCurrent.includes( "exposedToSun" ) ) {

		surfaceNew = surfaceCurrent.replace( /exposedToSun="(.*?)"/i, `${ item.fix }` );

	} else {

		surfaceNew = surfaceCurrent.replace( / id="(.*?)"/i, `${ item.fix } id="` );

	}

	GBX.text = GBX.text.replace( surfaceCurrent, surfaceNew );
	GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );

	FETStxt.value = surfaceNew;

};



FETS.fixAllSurfaces = function() {
	//console.log( 'index', index );

	//let surfaceNew;


	for ( let err of FETS.errors ) {

		let surfaceCurrent = GBX.surfaces[ err.index ];

		if ( surfaceCurrent.includes( "exposedToSun" ) ) {

			const surfaceNew = surfaceCurrent.replace( /exposedToSun="(.*?)"/i, `${ err.fix }` );
			GBX.text = GBX.text.replace( surfaceCurrent, surfaceNew );
			GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );

		} else {

			const surfaceNew = surfaceCurrent.replace( / id="(.*?)"/i, `${ err.fix } id="` );
			GBX.text = GBX.text.replace( surfaceCurrent, surfaceNew );
			GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );

		}

	}

	FETSdet.open = false;

};