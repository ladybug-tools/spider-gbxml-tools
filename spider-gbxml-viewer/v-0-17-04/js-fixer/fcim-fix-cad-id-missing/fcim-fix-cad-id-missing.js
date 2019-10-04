/* globals GBX, GSA, GBXinpIgnoreAirSurfaceType, FCIMsumCadIdMissing, FCIMdivIdMissingData, FCIMtxt, FCIMdet, FCIMdivCadIdMissing, FCIMselSurface */
// jshint esversion: 6
// jshint loopfunc: true


const FCIM = {

	script: {


		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-23",
		description: "Assign an ID to surfaces with a missing CAD object ID",
		helpFile: "../v-0-17-00/js-fixer/fcim-fix-cad-id-missing/fcim-fix-cad-id-missing.ms",
		license: "MIT License",
		version: "0.17.00-0fcim"

	}

};



FCIM.getCadIdMissing = function() {

	const htm =
		`
			<details id=FCIMdet ontoggle="FCIMdivCadIdMissing.innerHTML=FCIM.getFixCadIdMissing();" >

				<summary id=FCIMsumCadIdMissing >Fix Surfaces with CAD object ID missing</summary>

				${ GBXF.getHelpButton( "FCIMbutHelp", FCIM.script.helpFile ) }

				<div id=FCIMdivCadIdMissing ></div>

			</details>

		`;

	return htm;

};



FCIM.getFixCadIdMissing = function() {

	const timeStart = performance.now();

	FCIM.errors = [];

	GBX.surfaces.forEach( ( surface, index ) => {

		const id = surface.match( / id="(.*?)"/i )[ 1 ];
		const cadIdSource = surface.match( /<CADObjectId>(.*?)<\/CADObjectId>/);

		let cadId;

		if ( !cadIdSource ) {

			cadId = "no attribute";

		} else if ( cadIdSource[ 1 ] === "" ){

			cadId = "undefined";

		}
		//console.log( 'cadId', cadId );

		if ( [ "no attribute", "undefined" ].includes( cadId ) ){ FCIM.errors.push( { id, index, cadId } ); }

	} );
	//console.log( 'FCIM.errors', FCIM.errors );

	if ( GBXinpIgnoreAirSurfaceType.checked === true ) {

		FCIM.errors = FCIM.errors.filter( id => {

			const surfaceText = GBX.surfaces[ id ];
			//console.log( 'surfaceText', surfaceText );

			const surfaceType = surfaceText.match( /surfaceType="(.*?)"/)[ 1 ];
			//console.log( 'surfaceType', surfaceType );

			return surfaceType !== "Air";

		}) ;

	}

	const options = FCIM.errors.map( ( item, indexError ) => {

		const surface = GBX.surfaces[ item.index ];
		//console.log( 'sf', surface );

		const id = surface.match( / id="(.*?)"/i )[ 1 ];

		const names = surface.match( /<Name>(.*?)<\/Name>/gi );
		//console.log( 'name', name );

		const name = names ? names.pop() : id;

		return `<option value=${ indexError } title="${ id }" >${ name }</option>`;

	} );
	//console.log( 'options', options );

	const tag = FCIM.errors.length === 0 ? "span" : "mark";

	FCIMsumCadIdMissing.innerHTML =
		`Fix surfaces with missing CAD object ID ~ <${ tag }>${ FCIM.errors.length.toLocaleString() }</${ tag }> found`;


	const htm =
		`
			<p>The CADObjectId Element is used to map unique CAD object identifiers to gbXML elements</p>

			<p>When there are hundreds of surfaces to fix, this fix can take a long time to complete. Be patient.</p>

			<p>Surfaces with no CAD Object ID: ${ FCIM.errors.length.toLocaleString() }</p>

			<p>
				<select id=FCIMselSurface onclick=FCIM.setSurfaceData(this); size=5 style=min-width:8rem; >${ options }</select>
			</p>

			<p><button onclick=FCIM.fixAll(); >Fix all</button></p>

			<p>Click 'Save file' button in File menu to save changes to a file.</p>

			<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

			<hr>

			<div id="FCIMdivIdMissingData" >Click a surface name above to view its details and update its CAD object ID</div>

		`;

	return htm;

};



FCIM.setSurfaceData = function() {

	const error = FCIM.errors[ FCIMselSurface.selectedIndex ];
	// console.log( 'error', error );

	const invalidData = GSA.getSurfacesAttributesByIndex( error.index, error.id );

	const htm =
	`
		${ invalidData }
		<p>
			<button onclick=FCIM.fixCim(FCIMselSurface.selectedIndex); >Update CAD Object ID</button>

			<button onclick=FCIMdet.open=false;FCIMdivCadIdMissing.innerHTML=FCIM.getFixCadIdMissing(); >run check</button>
		</p>

		<p>
			<textarea id=FCIMtxt style="height:20rem; width:100%;" ></textarea>
		</p>

	`;

	//FCIMdivIdMissingData.innerHTML = htm;

};




//////////

FCIM.fixCim = function( indexError ) {
	//console.log( 'index', indexError );

	const error = FCIM.errors[ indexError ];
	//console.log( 'error', error );

	const surfaceTextCurrent = GBX.surfaces[ error.index ];
	//console.log( 'surfaceTextCurrent', surfaceTextCurrent );

	const type = surfaceTextCurrent.match( /surfaceType="(.*?)"/i )[ 1 ];


	const text = GBX.cadIdsDefault[ type ] + " - Spider Fix ";

	let surfaceTextNew;

	if ( error.cadId === "no attribute" ){

		surfaceTextNew = surfaceTextCurrent.replace( /<\/Surface>/i, `<CADObjectId>${ text }</CADObjectId> <\/Surface>` );

	} else {

		surfaceTextNew = surfaceTextCurrent.replace( /<CADObjectId>(.*?)<\/CADObjectId>/i, `<CADObjectId>${ text }</CADObjectId>` );

	}
	//console.log( 'surfaceTextNew', surfaceTextNew );

	GBX.text = GBX.text.replace( surfaceTextCurrent, surfaceTextNew );

	FCIMtxt.value = surfaceTextNew;

	GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );


};



FCIM.fixAll = function() {

	for ( let i = 0; i < FCIMselSurface.length; i++ ) {

		const error = FCIM.errors[ i ];

		const surfaceTextCurrent = GBX.surfaces[ error.index ];
		//console.log( 'surfaceTextCurrent', surfaceTextCurrent );

		const text = `place holder: ${ error.id }`;

		let surfaceTextNew;

		if ( error.cadId === "no attribute" ){

			surfaceTextNew = surfaceTextCurrent.replace( /<\/Surface>/i, `<CADObjectId>${ text }</CADObjectId> <\/Surface>` );

		} else {

			surfaceTextNew = surfaceTextCurrent.replace( /<CADObjectId>(.*?)<\/CADObjectId>/i, `<CADObjectId>${ text }</CADObjectId>` );

		}
		//console.log( 'surfaceTextNew', surfaceTextNew );

		GBX.text = GBX.text.replace( surfaceTextCurrent, surfaceTextNew );

		GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );

	}

	FCIMdet.open = false;

	FCIMdivCadIdMissing.innerHTML = FCIM.getFixCadIdMissing();

	//console.log( 'suf', GBX.surfaces[ error.index ] );

};
