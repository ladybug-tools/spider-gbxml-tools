// Copyright 2019 Ladybug Tools authors. MIT License
/* globals SGT, SGTinpIgnoreAirSurfaceType, FXASDsumSpaceDuplicate,
	FXASDdivAdjacentSpaceDuplicateData, FXASDdivSpaceDuplicate, FXASDdivCheckGbxml */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const FXASD = { "release": "1.2", "date": "2019-04-01" };


FXASD.description = `Fix air, InteriorWall, InteriorFloor, or Ceiling surfaces where both adjacent space IDs point to the same space`;

FXASD.currentStatus =
	`
		<h3>Fix surface with adjacent space duplicates (FXASD) R${ FXASD.release } ~ ${ FXASD.date }</h3>

		<p>
			${ FXASD.description }.
		</p>

		<details>
			<summary>Wish List / To do</summary>
			<ul>
				<li>2019-03-19 ~ Pre-select the correct adjacent spaces in the select type list box</li>
			</ul>
		</details>

		<details>
			<summary>Change log</summary>
			<ul>
				<li>2019-04-02 ~ B - Validate and fix with jsHint</li>
				<li>2019-04-01 ~ B - Fix surface and opening names being conjoined</li>
				<li>2019-03-25 ~ F - Adjacent space is updated as expected / Upon deletion, repeats check</li>
				<li>2019-03-25 ~ List errant surfaces by name with IDs as tool tips</li>
				<li>2019-03-23 ~ Add help pop-up. Fix 'run again'</li>
				<li>2019-03-19 ~ First commit</li>
			</ul>
		</details>
	`;



FXASD.getFixAdjacentSpaceDuplicate = function() {

	const timeStart = performance.now();
	const twoSpaces = [ "Air", "InteriorWall", "InteriorFloor", "Ceiling" ];
	let invalidAdjacentSpaceDuplicate = [];

	SGT.surfaces.forEach( ( surface, index ) => {

		const spaceIdRef = surface.match( /spaceIdRef="(.*?)"/gi );

		if ( spaceIdRef && spaceIdRef.length && spaceIdRef[ 0 ] === spaceIdRef[ 1 ] ) {
			//console.log( 'spaceIdRef', spaceIdRef );

			const surfaceType = surface.match( /surfaceType="(.*?)"/i )[ 1 ];
			//console.log( 'surfaceType', surfaceType );

			if ( twoSpaces.includes( surfaceType ) ) {

				invalidAdjacentSpaceDuplicate.push( index );

			}

		}

	} );
	//console.log( 'invalidAdjacentSpaceDuplicate', invalidAdjacentSpaceDuplicate );

	if ( SGTinpIgnoreAirSurfaceType.checked === true ) {

		invalidAdjacentSpaceDuplicate = invalidAdjacentSpaceDuplicate.filter( id => {

			const surfaceText = SGT.surfaces[ id ];
			//console.log( 'surfaceText', surfaceText );

			const surfaceType = surfaceText.match( /surfaceType="(.*?)"/)[ 1 ];
			//console.log( 'surfaceType', surfaceType );

			return surfaceType !== "Air";

		}) ;

	}

	const help = `<a id=fxasdHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(fxasdHelp,FXASD.currentStatus);" >&nbsp; ? &nbsp;</a>`;

	FXASDsumSpaceDuplicate.innerHTML =
	`Fix surfaces with duplicate adjacent spaces ~ ${ invalidAdjacentSpaceDuplicate.length.toLocaleString() } found ${ help }`;

	const options = invalidAdjacentSpaceDuplicate.map( index => {

		const surface = SGT.surfaces[ index ];
		//console.log( 'sf', surface );

		const id = surface.match( / id="(.*?)"/i )[ 1 ];
		//console.log( 'id', id );

		let name = surface.match( /<Name>(.*?)<\/Name>/gi );
		name = name? name.pop() : id;
		//console.log( 'name', name );

		return `<option value=${ index } title="${ id ? id[ 1 ] : 44 }" >${ name ? name : "no name" }</option>`;

	} );
	//console.log( 'options', options );

	const asdHtm =
		`
			<p><i>Air, InteriorWall, InteriorFloor, or Ceiling surfaces where both adjacent space IDs point to the same space</i></p>

			${ invalidAdjacentSpaceDuplicate.length.toLocaleString() } found<br>

			<p>
				<select onclick=FXASD.setSpaceDuplicateData(this); size=5 style=min-width:8rem; >${ options }</select>
			</p>

			<div id="FXASDdivAdjacentSpaceDuplicateData" >Click a surface name above to view its details and update its adjacent spaces</div>

			<div id=FXASDdivCheckGbxml ></div>

			<p>
				<button onclick=FXASDdivSpaceDuplicate.innerHTML=FXASD.getFixAdjacentSpaceDuplicate(); >Run check again</button>
			</p>

			<p>
				Click 'Save file' button in File menu to save changes to a file.
			</p>

			<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

		`;

	return asdHtm;

};



FXASD.setSpaceDuplicateData = function( select ) {
	//console.log( 'iv', select.value );

	const surfaceText = SGT.surfaces[ select.value ];
	//console.log( 'surface', surface );

	const adjacentSpaces = surfaceText.match( /<AdjacentSpaceId (.*?)\/>/gi );
	//console.log( 'adjSpaces', adjSpaces );

	const spaceIds = adjacentSpaces.map( item => item.match( /spaceIdRef="(.*?)"/ )[ 1 ] );
	//console.log( 'spaceId', spaceId );

	const spaceText = SGT.spaces.find( item => item.includes( spaceIds[ 0 ] ) );
	//console.log( 'spaceText1', spaceText1 );
	const spaceName = spaceText.match( /<Name>(.*?)<\/Name>/i )[ 1 ];


	const options = SGT.spaces.map( (space, index ) => {

		const id = space.match( / id="(.*?)"/i )[ 1 ];

		const selected = id === spaceIds[ 0 ] ? "selected" : "";

		return `<option value=${ id } title="${ id }" ${ selected } >${ id } // ${ space.match( /<Name>(.*?)<\/Name>/i )[ 1 ] }</option>`;

	} );
	//console.log( 'options', options );

	const htm = spaceIds.reduce( ( text, spaceId, index ) => text +
		`
			<p>
				spaceIdRef ${ index + 1 }: from <span class=attributeValue >${ spaceId } / ${ spaceName }</span> to
				<select id=FXASDselSpaceIdNew${ index } >${ options }</select>
				<button onclick=FXASD.adjacentSpaceUpdate(${ index },${ select.value }); value=${ index } >update reference</button>
			</p>
		`,
	"" );

	const attributes = SGT.getSurfacesAttributesByIndex( select.value,  select.options[ select.selectedIndex ].innerText );

	FXASDdivAdjacentSpaceDuplicateData.innerHTML =
		`
			${ attributes }

			${ htm }

			<p>
				<button onclick=FXASD.showSurfaceGbxml(${ select.value }); >view gbXML text</button>
			</p>

		`;

		FXASDdivAdjacentSpaceDuplicateData.querySelectorAll( "details" )[ 0 ].open = true;

};



FXASD.adjacentSpaceUpdate = function( index, surfaceId ) {

	const spaceIdNew = document.body.querySelector( `#FXASDselSpaceIdNew${ index }` ).value;

	//console.log( 'spaceIdNew', spaceIdNew );

	//console.log( 'index/id',index,  surfaceId );

	const surfaceTextCurrent = SGT.surfaces[ surfaceId ];

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

	SGT.text =  SGT.text.replace( surfaceTextCurrent, surfaceTextNew );

	SGT.surfaces = SGT.text.match( /<Surface(.*?)<\/Surface>/gi );

	FXASDdivSpaceDuplicate.innerHTML = FXASD.getFixAdjacentSpaceDuplicate();

};



FXASD.showSurfaceGbxml = function( id ) {

	const surfaceText = SGT.surfaces[ id ];

	FXASDdivCheckGbxml.innerText = surfaceText;

};
