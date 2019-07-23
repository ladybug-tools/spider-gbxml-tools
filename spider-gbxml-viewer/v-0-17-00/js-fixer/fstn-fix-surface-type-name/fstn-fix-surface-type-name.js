/* globals GBX, GBXF, GSA, FSTNsumSurfaceType, FSTNdivSurfaceType, FSTNdet, FSTNtxt, FSTNdivSurfaceAttributeData */
// jshint esversion: 6
// jshint loopfunc: true


const FSTN = {

	script: {


		copyright: "Copyright 2019 Ladybug Tools authors. MIT License",
		date: "2019-07-23",
		description: "Checks for a surface type name that is not one of the 15 valid gbXML surface type names",
		helpFile: "../v-0-17-00/js-fixer/fstn-fix-surface-type-name/fstn-fix-surface-type-name.md",
		version: "0.17.00-0fstn"

	}

};


FSTN.types = [

	"InteriorWall", "ExteriorWall", "Roof", "InteriorFloor", "ExposedFloor", "Shade", "UndergroundWall",
	"UndergroundSlab", "Ceiling", "Air", "UndergroundCeiling", "RaisedFloor", "SlabOnGrade",
	"FreestandingColumn", "EmbeddedColumn"

];



FSTN.getMenuSurfaceTypeName = function() {

	const help = GBXF.getHelpButton( "FSTNbutHelp", FSTN.script.helpFile );

	const htm =
		`
			<details id=FSTNdet ontoggle="FSTNdivSurfaceType.innerHTML=FSTN.getSurfaceTypeErrors();" >

				<summary id=FSTNsumSurfaceType >Fix surfaces with invalid surface type name</summary>

				${ help }

				<div id=FSTNdivSurfaceType ></div>

				<div id=FSTNdivSurfaceAttributeData ></div>

			</details>

		`;

	return htm;

};



FSTN.getSurfaceTypeErrors = function() {

	const timeStart = performance.now();

	FSTN.errors = GBX.surfaces.reduce( function( errors, surface, index ) {

		const typeSource0 = surface.match( /surfaceType="(.*?)"/i );
		const typeSource1 = typeSource0 === null ?  ["", "no attribute" ] : typeSource0 ;
		const typeSource = typeSource1[ 1 ] ? typeSource1[ 1 ] : "undefined";

		if ( FSTN.types.includes( typeSource ) === false ) {
			//console.log( '', typeSource1 );

			const id = surface.match( / id="(.*?)"/i )[ 1 ];
			const name = surface.match( /<Name>(.*?)<\/Name>/i )[ 1 ];

			errors.push( { id, name, index, typeSource  } );

		}

		return errors;

	}, [] );
	//console.log( 'FSTN.errors', FSTN.errors );

	const options = FSTN.errors.map( error => {

		return `<option value=${ error.index } title="${ error.id }" >${ error.name }</option>`;

	} );

	const tag = FSTN.errors.length === 0 ? "span" : "mark";

	FSTNsumSurfaceType.innerHTML =
		`
		Fix surfaces with invalid surface type name
			~ <${ tag }>${ FSTN.errors.length.toLocaleString() }</${ tag }> errors
		`;

	const htm =
	`
		<p><i>A surface type was supplied that is not one of the following: ${ GBX.surfaceTypes.join( ', ' ) }</i></p>

		<p>${ FSTN.errors.length.toLocaleString() } surface with type issues found.</p>

		<p>
			<select id=FSTNselSurfaces onclick=FSTN.setSurfaceData(this); size=5 style=width:100%; >
				${ options }
			</select>
		</p>

		<p><button onclick=FSTN.fixAll(); >Fix all</button></p>

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

	`;

	return htm;

};



FSTN.setSurfaceData = function( select ) {

	const error = FSTN.errors[ select.selectedIndex ];

	const htm =
	`
		<p>Surface type: ${ error.typeSource }</p>
		<p>
			Reasons: <i>${ error.reasons }</i><br>
			Error: ${ error.error }
		</p>

		<p>
			${ GSA.getSurfacesAttributesByIndex( error.index, error.id ) }
		</p>

		<p>
			<button onclick="FSTN.update(${ select.selectedIndex });" title="" >update exposedToSun</button>
		</p>

		<p>
			<textarea id=FSTNtxt style="height:20rem; width:100%;" >currently broken</textarea>
		</p>
	`;

	//FSTNdivSurfaceAttributeData.innerHTML = htm;

};



FSTN.update = function( index ) {

	const error = FSTN.errors[ index ];
	//console.log( 'error', error );

	const fix = FSTN.getSurfaceFix( index );
	//console.log( 'fix', fix );

	const surfaceCurrent = GBX.surfaces[ error.index ];
	let surfaceNew;

	if ( error.typeSource === "no attribute" ) {

		surfaceNew = surfaceCurrent.replace( / id="/i, `surfaceType="${ fix.typeNew }" id="` );

	} else {

		surfaceNew = surfaceCurrent.replace( /surfaceType="(.*?)"/i, `surfaceType="${ fix.typeNew }"` );

	}

	GBX.text = GBX.text.replace( surfaceCurrent, surfaceNew );
	GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );

	FSTNtxt.value = surfaceNew;

	FSTNdet.open = false;
	FSTNdet.open = true;

};



FSTN.fixAll = function() {

	FSTN.errors.forEach( ( error, index ) => {
		//console.log( 'error', error );

		const fix = FSTN.getSurfaceFix( index );
		//console.log( 'fix', fix );

		const surfaceCurrent = GBX.surfaces[ error.index ];


		let surfaceNew;

		if ( error.typeSource === "no attribute" ) {

			surfaceNew = surfaceCurrent.replace( / id="/i, `surfaceType="${ fix.typeNew }" id="` );

		} else {

			surfaceNew = surfaceCurrent.replace( /surfaceType="(.*?)"/i, `surfaceType="${ fix.typeNew }"` );

		}

		GBX.text = GBX.text.replace( surfaceCurrent, surfaceNew );
		GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );

	} );

	FSTNdet.open = false;

};



FSTN.getSurfaceFix = function( index ) {

	const error = FSTN.errors[ index ];
	//console.log( 'error', error );

	const surface = GBX.surfaces[ error.index ];

	const tilt = surface.match( /<Tilt>(.*?)<\/Tilt>/i )[ 1 ];

	let spaces = surface.match( /<AdjacentSpaceId(.*?)\/>/gi );
	spaces = spaces ? spaces : [];
	//console.log( '', spaces );

	const exposedToSun0 = surface.match( /exposedToSun="(.*?)"/i );
	const exposedToSun1 = exposedToSun0 === null ?  ["", "no attribute" ] : exposedToSun0 ;
	const exposedToSun = exposedToSun1[ 1 ] ? exposedToSun1[ 1 ] : "undefined";
	//console.log( 'exposedToSun', exposedToSun );
	const typeSource = error.typeSource; //typeSource1[ 1 ] ? typeSource1[ 1 ] : "undefined";

	let typeNew = "Shade";
	let reasons = "Invalid surface type name. ";
	let errorText = "";

	if ( spaces.length === 0 ) {

		typeNew = "Shade";
		reasons += "No adjacent spaces. ";

	} else if ( spaces.length ===  1 ) {

		reasons += "Single adjacent space ID. ";

		if ( Number( tilt ) === 90 ) {

			reasons += `Tilt = ${ tilt }. `;

			if ( exposedToSun === "true" ) {

				typeNew = "ExteriorWall";
				reasons += `ExposedToSun set to ${ exposedToSun }. `;

			} else {

				reasons += `ExposedToSun attribute is unknown. `;
				reasons += `Type = ${ typeSource }. `;

				if ( [ "ExteriorWall", "UndergroundWall" ].includes( typeSource ) ) {

					typeNew = typeSource;

				} else {

					typeNew = "ExteriorWall";
					errorText = "Need exterior or underground wall. ";

				}

			}

		} else if ( Number( tilt ) === 0 ) {

			reasons += `Tilt = ${ tilt }. `;

			if ( exposedToSun === "true" ) {

				reasons += `ExposedToSun set to ${ exposedToSun }. `;

				if ( [ "ExposedFloor", "RaisedFloor", "Roof" ].includes( typeSource ) ) {

					typeNew = typeSource;

				} else {

					typeNew = "Roof";
					errorText = "Need floor or roof";

				}

			} else {

				reasons += `ExposedToSun attribute is unknown. `;
				reasons += `Type = ${ typeSource }. `;

				if ( [ "ExposedFloor", "RaisedFloor", "Roof", "SlabOnGrade", "UndergroundCeiling",
					"UndergroundSlab" ].includes( typeSource ) ) {

					typeNew = typeSource;

				} else {

					typeNew = "SlabOnGrade";
					errorText = "Need horizontal surface ";

				}

			}

		} else if ( Number( tilt ) === 180 ){

			reasons += `Tilt = ${ tilt }. `;

			if ( exposedToSun === "true" ) {

				reasons += `ExposedToSun set to ${ exposedToSun }. `;

				if ( [ "ExposedFloor", "RaisedFloor", "Roof", "UndergroundCeiling" ].includes( typeSource ) ) {

					typeNew = typeSource;

				} else {

					typeNew = "Roof";
					errorText = "ExposedToSun true";

				}

			} else {

				reasons += `ExposedToSun attribute is unknown. `;

				if ( [ "ExposedFloor", "RaisedFloor", "Roof", "SlabOnGrade", "UndergroundSlab" ].includes( typeSource ) ) {

					typeNew = typeSource;

				} else {

					typeNew = "SlabOnGrade";
					errorText = "incorrect surface type ";

				}

			}

		}

	} else if ( spaces.length ===  2 ) {

		reasons += "Two adjacent space IDs. ";

		let id1 = spaces[ 0 ].match( /spaceIdRef="(.*?)"/i );
		id1 = id1 ? id1[ 1 ] : id1;
		let id2 = spaces[ 1 ].match( /spaceIdRef="(.*?)"/i );
		id2 = id2 ? id2[ 1 ] : id2;
		//console.log( '', id1, id2 );

		if ( Number( tilt ) === 90 ) {

			reasons += `Tilt = ${ tilt }. `;

			if ( id1 !== id2) {

				reasons += "Different adjacent space IDs. ";
				typeNew = "InteriorWall";

			} else {

				reasons += "Identical IDs. ";

				if ( typeSource === "InteriorWall" ) {

					reasons += "Interior wall with identical adjacent IDs. ";
					typeNew = "InteriorWall";

				} else {

					typeNew = "Air";

				}

			}

		} else if ( Number( tilt ) === 0 ) {

			reasons += `Tilt = ${ tilt }. `;

			if ( exposedToSun === "true" ) {

				reasons += `ExposedToSun set to ${ exposedToSun }. `;

				if ( [ "Air", "Ceiling", "InteriorFloor" ].includes( typeSource ) ) {

					typeNew = typeSource;

				} else { // pick a likely candidate

					typeNew = "InteriorFloor";
					errorText = "Need horizontal surface";

				}

			}

		} else if ( Number( tilt ) === 180 ){

			reasons += `Tilt = ${ tilt }. `;

			if ( [ "Air", "InteriorFloor", "Ceiling" ].includes( typeSource ) ) {

				typeNew = typeSource;

			} else {

				typeNew = "InteriorFloor";

			}

		}


	} else {

		console.log( 'no spaces', surface );

	}
	//console.log( '',  { typeNew, reasons } );

	return { typeNew, reasons, errorText };

};



FSTN.fixAllChecked = function() {

	const boxesChecked = Array.from( FSTNdivSurfaceType.querySelectorAll( 'input:checked' ) ).map( item => item.value );

	for ( let error of FSTN.errors ) {

		if ( boxesChecked.includes( error.id ) ) {

			//console.log( 'error', error);

			const surfaceCurrent = GBX.surfaces[ error.index ];

			let surfaceNew;

			if ( error.typeSource === "no attribute" ) {

				surfaceNew = surfaceCurrent.replace( / id="/i, `surfaceType="${ error.typeNew }" id="` );

			} else {

				surfaceNew = surfaceCurrent.replace( /surfaceType="(.*?)"/i, `surfaceType="${ error.typeNew }"` );

			}

			GBX.text = GBX.text.replace( surfaceCurrent, surfaceNew );
			GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );

		}

	}

	FSTNdet.open = false;

};