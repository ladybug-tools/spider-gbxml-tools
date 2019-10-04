/* globals GBX, GBXinpIgnoreAirSurfaceType, GSA, FASDdet, FASDsumAdjacentSpaceDuplicate, FASDselSurface,
	FASDdivAdjacentSpaceDuplicateData, FASDdivSpaceDuplicate */
// jshint esversion: 6
// jshint loopfunc: true


const FASD = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-23",
		description: "Fix air, InteriorWall, InteriorFloor, or Ceiling surfaces where both adjacent space IDs point to the same space",
		helpFile: "../v-0-17-00/js-fixer/fasd-fix-adjacent-space-duplicate/fasd-fix-adjacent-space-duplicate.md",
		license: "MIT License",
		version: "0.17.00-0fasd"

	}

};



FASD.getFixAdjacentSpaceDuplicate = function() {

	const htm =
		`
			<details id=FASDdet ontoggle="FASDdivAdjacentSpaceDuplicate.innerHTML=FASD.getAdjacentSpaceDuplicate();" >

				<summary id=FASDsumAdjacentSpaceDuplicate >Fix surfaces with duplicate adjacent spaces</summary>

				${ GBXF.getHelpButton( "FASDbutHelp", FASD.script.helpFile ) }

				<div id=FASDdivAdjacentSpaceDuplicate ></div>

			</details>

		`;

	return htm;

};



FASD.getAdjacentSpaceDuplicate = function() {

	const timeStart = performance.now();
	const twoSpaces = [ "Air", "InteriorWall", "InteriorFloor", "Ceiling" ];
	FASD.duplicates = [];

	GBX.surfaces.forEach( ( surface, index ) => {

		const spaceIdRefs = surface.match( /spaceIdRef="(.*?)"/gi );

		if ( spaceIdRefs && spaceIdRefs.length && spaceIdRefs[ 0 ] === spaceIdRefs[ 1 ] ) {
			//console.log( 'spaceIdRef', spaceIdRef );

			const surfaceType = surface.match( /surfaceType="(.*?)"/i )[ 1 ];
			//console.log( 'surfaceType', surfaceType );

			if ( twoSpaces.includes( surfaceType ) ) {

				FASD.duplicates.push( index );

			}

		}

	} );
	//console.log( 'FASD.duplicates', FASD.duplicate );

	if ( GBXinpIgnoreAirSurfaceType.checked === true ) {

		FASD.duplicates = FASD.duplicates.filter( id => {

			const surfaceText = GBX.surfaces[ id ];
			//console.log( 'surfaceText', surfaceText );

			const surfaceType = surfaceText.match( /surfaceType="(.*?)"/)[ 1 ];
			//console.log( 'surfaceType', surfaceType );

			return surfaceType !== "Air";

		}) ;

	}

	const tag = FASD.duplicates.length === 0 ? "span" : "mark";

	FASDsumAdjacentSpaceDuplicate.innerHTML =
		`Fix surfaces with duplicate adjacent spaces
			~ <${ tag }>${ FASD.duplicates.length.toLocaleString() }</${ tag }> found
		`;

	const options = FASD.duplicates.map( index => {

		const surface = GBX.surfaces[ index ];
		//console.log( 'sf', surface );

		const id = surface.match( / id="(.*?)"/i )[ 1 ];
		//console.log( 'id', id );

		let name = surface.match( /<Name>(.*?)<\/Name>/gi );
		name = name? name.pop() : id;
		//console.log( 'name', name );

		return `<option value=${ index } title="${ id }" >${ name ? name : "no name" }</option>`;

	} );
	//console.log( 'options', options );

	const asdHtm =
		`
			<p><i>Air, InteriorWall, InteriorFloor, or Ceiling surfaces where both adjacent space IDs point to the same space</i></p>

			${ FASD.duplicates.length.toLocaleString() } found<br>

			<p>
				<select id=FASDselSurface onclick=FASD.setSpaceDuplicateData(this); size=5 style=min-width:8rem; >${ options }</select>
			</p>

			<p>
				<button onclick=FASD.fixAdjacentSpacesAll(); >fix all</button>

			</p>

			<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

			<hr>

			<div id=FASDdivCheckGbxml ></div>

		`;

	return asdHtm;

};



FASD.setSpaceDuplicateData = function( select ) {
	//console.log( 'iv', select.value );

	const surfaceText = GBX.surfaces[ select.value ];
	//console.log( 'surface', surface );

	const adjacentSpaces = surfaceText.match( /<AdjacentSpaceId (.*?)\/>/gi );
	//console.log( 'adjSpaces', adjSpaces );

	const spaceIds = adjacentSpaces.map( item => item.match( /spaceIdRef="(.*?)"/ )[ 1 ] );
	//console.log( 'spaceId', spaceId );

	const spaceText = GBX.spaces.find( item => item.includes( spaceIds[ 0 ] ) );
	//console.log( 'spaceText1', spaceText1 );
	const spaceName = spaceText.match( /<Name>(.*?)<\/Name>/i )[ 1 ];


	const options = GBX.spaces.map( (space, index ) => {

		const id = space.match( / id="(.*?)"/i )[ 1 ];
		//console.log( 'id', id );

		const selected = id === spaceIds[ 0 ] ? "selected" : "";

		return `<option value=${ id } title="${ id }" ${ selected } >${ id } // ${ space.match( /<Name>(.*?)<\/Name>/i )[ 1 ] }</option>`;

	} );
	//console.log( 'options', options );

	const htm = spaceIds.reduce( ( text, spaceId, index ) => text +
		`
			<p>
				spaceIdRef ${ index + 1 }: from <span class=attributeValue >
					${ spaceId } / ${ spaceName }</span> to
				<select id=FASDselSpaceIdNew${ index } >${ options }</select>
				<button onclick=FASD.adjacentSpaceUpdate(${ index },${ select.value }); value=${ index } >
					update reference</button>
			</p>
		`,
	"" );

	const attributes = GSA.getSurfacesAttributesByIndex( select.value, select.options[ select.selectedIndex ].innerText );

	// FASDdivAdjacentSpaceDuplicateData.innerHTML =
	// 	`
	// 		${ attributes }

	// 		${ htm }

	// 	`;

	// 	FASDdivAdjacentSpaceDuplicateData.querySelectorAll( "details" )[ 0 ].open = true;

};



FASD.adjacentSpaceUpdate = function( index, surfaceId ) {
	//console.log( 'index/id', index,  surfaceId );

	const spaceIdNew = document.body.querySelector( `#FASDselSpaceIdNew${ index }` ).value;
	//console.log( 'spaceIdNew', spaceIdNew );

	const surfaceTextCurrent = GBX.surfaces[ surfaceId ];

	const adjacentSpacesTextCurrent = surfaceTextCurrent.match( /<AdjacentSpaceId (.*?)\/>(.*?)<AdjacentSpaceId (.*?)\/>/ );

	const adjacentSpaces = surfaceTextCurrent.match( /<AdjacentSpaceId (.*?)\/>/gi );
	//console.log( 'adjacentSpaces', adjacentSpaces );

	let spaceIdCurrent = adjacentSpaces[ index ].match( /<AdjacentSpaceId spaceIdRef="(.*?)"(.*?)\/>/i );
	//console.log( 'spaceIdCurrent', spaceIdCurrent );
	spaceIdCurrent = spaceIdCurrent ? spaceIdCurrent[ 1 ] : spaceIdCurrent;

	const newText = adjacentSpaces[ index ].replace( spaceIdCurrent, spaceIdNew );

	adjacentSpaces[ index ] = newText;

	const adjacentSpacesTextNew = adjacentSpaces.join( adjacentSpacesTextCurrent[ 2 ] );
	//console.log( 'adjacentSpacesTextNew', adjacentSpacesTextNew );

	const surfaceTextNew = surfaceTextCurrent.replace( adjacentSpacesTextCurrent[ 0 ], adjacentSpacesTextNew );
	//console.log( 'surfaceTextNew', surfaceTextNew );

	GBX.text =  GBX.text.replace( surfaceTextCurrent, surfaceTextNew );

	GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );

	FASDdivSpaceDuplicate.innerHTML = FASD.getFixAdjacentSpaceDuplicate();

};



FASD.fixAdjacentSpacesAll = function() {

	const length = FASDselSurface.length;

	for ( let i = 0; i < length; i++ ) {

		FASD.fixAdjacentSpaces( i );

	}

};

FASD.fixAdjacentSpacesSelected = function( select) {

	const index = FASDselSurface.selectedIndex;
	//console.log( 'index', FASDselSurface.selectedIndex );

	FASD.fixAdjacentSpaces( index );

};


FASD.fixAdjacentSpaces = function( index) {

	const surfaceIndex = FASD.duplicates[ index ];
	//console.log( 'surfaceIndex', surfaceIndex );

	const surfaceText = GBX.surfaces[ surfaceIndex ];
	//console.log( '', surfaceText );

	const surfacePlanar = surfaceText.match( /<PlanarGeometry(.*?)<\/PlanarGeometry>/i );
	//console.log( 'surfacePlanar', surfacePlanar );

	const surfaceCoordinates = surfacePlanar[ 1 ].match( /<Coordinate>(.*?)<\/Coordinate>/gi );
	//console.log( 'surfaceCoordinates', surfaceCoordinates );


	const matches = [];

	for ( let spaceText of GBX.spaces ) {

		const coordinatesSpace = spaceText.match( /<Coordinate>(.*?)<\/Coordinate>/gi );
		//console.log( 'coordinatesSpace', coordinatesSpace );

		let count = 0;

		for ( let coordinate of surfaceCoordinates ) {

			if ( coordinatesSpace.includes( coordinate ) ) {
				//console.log( 'match', 23 );
				count ++;

			}

		}

		matches.push( count );

	}

	const matchExact = getMatches( 0 );
	const match2 = getMatches( 2 );
	const match4 = getMatches( 4 );
	const match6 = getMatches( 6 );
	const match8 = getMatches( 8 );

	if ( matchExact.length >= 2 ) {

		getDataExact( matchExact );

	} else if ( match2.length >= 2 ) {

		getDataExact( match2 );

	} else if ( match4.length >= 2 ) {

		getData( match4 );

	} else if ( match6.length >= 2 ) {

		getData( match6 );

	} else if ( match8.length >= 2 ) {

		getData( match8 );

	}


	function getMatches( limit = 0 ) {

		const arr = [];

		matches.forEach( ( count, spaceIndex ) => {

			const surfacesCount = surfaceCoordinates.length;

			if ( surfacesCount - count <= limit ) {

				arr.push( { count, spaceIndex, surfaceIndex, surfacesCount } );

			}
		});

		return arr;

	}


	function getDataExact( matches ) {

		matches.forEach( match => {
			//console.log( '', match );

			const surfaceTextCurrent = GBX.surfaces[ match.surfaceIndex ];
			const surfaceSpaceIds = surfaceTextCurrent.match( / spaceIdRef="(.*?)"/gi );
			const surfaceSpaceId = surfaceSpaceIds[ 1 ].match( / spaceIdRef="(.*?)"/i )[ 1 ];
			//console.log( 'surfaceSpaceId', surfaceSpaceId );
			const space = GBX.spaces[ match.spaceIndex ];

			const spaceId = space.match( / id="(.*?)"/i )[ 1 ];
			//console.log( 'spaceId', spaceId );

			if ( surfaceSpaceId !== spaceId ) {
				//console.log( 'spaceId', spaceId );

				//let name = space.match( /<Name>(.*?)<\/Name>/i )[ 1 ];
				//console.log( 'name', name );

				const surfaceTextNew = surfaceTextCurrent.replace( / spaceIdRef="(.*?)"/i, ` spaceIdRef="${ spaceId }"` );
				//console.log( 'surfaceTextNew', surfaceTextNew );

				GBX.text = GBX.text.replace( surfaceTextCurrent, surfaceTextNew );

				GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );

				FASDdet.open = false;

				FASDdivSpaceDuplicate.innerHTML = FASD.getFixAdjacentSpaceDuplicate();


			} else {

				//console.log( 'same spaceId', spaceId, surfaceSpaceId );
			}

		} );

		//console.log( 'matches', matches  );

	}



	function getData( matches ) {

		const surfaceTextCurrent = GBX.surfaces[ matches[ 0 ].surfaceIndex ];
		const surfaceType = surfaceTextCurrent.match( / surfaceType="(.*?)"/i )[ 1 ];
		//console.log( 'surfaceType', surfaceType );

		const spaceId0 = surfaceTextCurrent.match( / spaceIdRef="(.*?)"/i )[ 1 ];
		//console.log( 'spaceId0', spaceId0 );

		const space0 = GBX.spaces.find( space => space.includes( spaceId0 ) );
		const storeyId0 = space0.match( /buildingStoreyIdRef="(.*?)"/i )[ 1 ];
		const storeyText0 = GBX.storeys.find( storey => storey.includes( storeyId0 ) );
		//console.log( 'storeyText0', storeyText0 );
		const storeyLevel0 = storeyText0.match( /<Level>(.*?)<\/Level>/i )[ 1 ];

		matches.forEach( match => {
			//console.log( '', match );

			if ( match.count === match.surfacesCount ) {

			} else {

				const spaceTry = GBX.spaces[ match.spaceIndex ];
				const storeyIdTry = spaceTry.match( /buildingStoreyIdRef="(.*?)"/i )[ 1 ];
				//console.log( 'storeyIdTry', storeyIdTry );
				const storeyTextTry= GBX.storeys.find( storey => storey.includes( storeyIdTry ) );
				const storeyLevelTry = storeyTextTry.match( /<Level>(.*?)<\/Level>/i )[ 1 ];
				//console.log( 'storeyLevelTry', storeyLevelTry );

				if ( [ "Ceiling" ].includes( surfaceType )  ) {

					if ( storeyLevelTry > storeyLevel0 ) {

						const spaceTryId = spaceTry.match( / id="(.*?)"/i )[ 1 ];
						const surfaceTextNew = surfaceTextCurrent.replace( / spaceIdRef="(.*?)"/i, ` spaceIdRef="${ spaceTryId }"` );
						//console.log( 'surfaceTextNew', surfaceTextNew );

						GBX.text = GBX.text.replace( surfaceTextCurrent, surfaceTextNew );

						GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );

						FASDdet.open = false;

						FASDdivSpaceDuplicate.innerHTML = FASD.getFixAdjacentSpaceDuplicate();

					}

				} else if ( [ "InteriorFloor" ].includes( surfaceType ) ) {
					//console.log( 'InteriorFloor match', match );
					//console.log( 'storeyLevel0', storeyLevel0 );
					//console.log( 'storeyLevelTry', storeyLevelTry );

					if ( storeyLevelTry < storeyLevel0 ) {

						const spaceTryId = spaceTry.match( / id="(.*?)"/i )[ 1 ];
						//console.log( 'spaceTryId', spaceTryId );

						const surfaceTextNew = surfaceTextCurrent.replace( / spaceIdRef="(.*?)"/i, ` spaceIdRef="${ spaceTryId }"` );
						//console.log( 'surfaceTextNew', surfaceTextNew );

						GBX.text = GBX.text.replace( surfaceTextCurrent, surfaceTextNew );

						GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );

						FASDdet.open = false;

						FASDdivSpaceDuplicate.innerHTML = FASD.getFixAdjacentSpaceDuplicate();

					}

				} else if ( [ "InteriorWall" ].includes( surfaceType ) ) {

					if ( storeyLevelTry === storeyLevel0 ) {

						console.log( 'IW match', match );
						//const spaceTry = GBX.spaces[ match.spaceIndex ];
						//console.log( 'spaceTry', spaceTry );

					} else {

						console.log( 'IW match levels differe',  );

					}

				} else if ( [ "Air" ].includes( surfaceType ) ) {

					console.log( 'Air match', match );

				} else {

					console.log( 'oops match', match );
					console.log( 'surfaceType', surfaceType );
					//console.log( 'storeyLevel0', storeyLevel0 );
					//console.log( 'storeyLevelTry', storeyLevelTry );

				}

			}

			//surfaceSpaceId = surfaceSpaceIds[ 1 ].match( / spaceIdRef="(.*?)"/i )[ 1 ];
			//spaceId = space.match( / id="(.*?)"/i )[ 1 ];
			//name = space.match( /<Name>(.*?)<\/Name>/i )[ 1 ];
			//console.log( 'name', match.count, storey, name );
			//console.log( 'spaceId', spaceId, surfaceSpaceId );

		} );

		//console.log( 'matches', matches  );

	}

};