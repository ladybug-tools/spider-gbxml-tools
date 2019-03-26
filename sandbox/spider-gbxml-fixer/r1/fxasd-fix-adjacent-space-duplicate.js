// Copyright 2019 Ladybug Tools authors. MIT License
/* globals */
/* jshint esversion: 6 */
/* jshint loopfunc:true */


const FXASD = { "release": "1.0", "date": "2019-03-25" };


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
				<li>2019-03-25 ~ Add select and update multiple surfaces at once</li>
				<li>2019-03-19 ~ Pre-select the correct surface type in the select type list box</li>
			</ul>
		</details>

		<details>
			<summary>Change log</summary>
			<ul>
				<li>2019-03-25 ~ F - Adjacent space is deleted as expected / Upon deletion, repeats check</li>
				<li>2019-03-25 ~ List errant surfaces by name with IDs as tool tips</li>
				<li>2019-03-23 ~ Add help pop-up. Fix 'run again'</li>
				<li>2019-03-19 ~ First commit</li>
			</ul>
		</details>
	`;



FXASD.getFixAdjacentSpaceDuplicate = function() {

	const timeStart = performance.now();
	const twoSpaces = [ "Air", "InteriorWall", "InteriorFloor", "Ceiling" ];
	const invalidAdjacentSpaceDuplicate = [];

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

	const help = `<a id=fxasdHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(fxasdHelp,FXASD.currentStatus);" >&nbsp; ? &nbsp;</a>`;

	FXASDsumSpaceDuplicate.innerHTML =
	`Fix surfaces with duplicate adjacent spaces ~ ${ invalidAdjacentSpaceDuplicate.length.toLocaleString() } found ${ help }`;

	const options = invalidAdjacentSpaceDuplicate.map( index => {

		const surface = SGT.surfaces[ index ];
		//console.log( 'sf', surface );
		return `<option value=${index } title="${ surface.match( / id="(.*?)"/i )[ 1 ] }" >${ surface.match( /<Name>(.*?)<\/Name>/i )[ 1 ] }</option>`;

	} );
	//console.log( 'options', options );

	const asdHtm =
		`
			<p><i>Air, InteriorWall, InteriorFloor, or Ceiling surfaces where both adjacent space IDs point to the same space</i></p>

			${ invalidAdjacentSpaceDuplicate.length.toLocaleString() } found<br>

			<p>
				<select onclick=FXASD.setSpaceDuplicateData(this); size=5 style=min-width:8rem; >${ options }</select>
			</p>

			<div id="FXASDdivAdjacentSpaceDuplicateData" >Click a surface ID above to view its details and update its surface type</div>

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

	const options = SGT.spaces.map( (space, index ) => {

		return `<option value=${index } title="${ space.match( / id="(.*?)"/i )[ 1 ] }" >${ space.match( /<Name>(.*?)<\/Name>/i )[ 1 ] }</option>`;

	} );
	//console.log( 'options', options );

	surface = SGT.surfaces[ select.value ];
	//console.log( 'surface', surface );

	adjacentSpaces = surface.match( /<AdjacentSpaceId (.*?)\/>/gi );
	//console.log( 'adjSpaces', adjSpaces );

	const spaceIds = adjacentSpaces.map( item => item.match( /spaceIdRef="(.*?)"/ )[ 1 ] );
	//console.log( 'spaceId', spaceId );

	spaceText = SGT.spaces.find( item => item.includes( spaceIds[ 0 ] ) )
	//console.log( 'spaceText1', spaceText1 );
	spaceName = spaceText.match( /<Name>(.*?)<\/Name>/i )[ 1 ];

	const htm = spaceIds.reduce( ( text, id, index ) => text +
		`
			<p>
				spaceIdRef ${ index + 1 }: from <span class=attributeValue >${ id } / ${ spaceName }</span> to <select>${ options }</select>
				<button onclick=FXASD.adjacentSpaceUpdate("${ id }"); value=${ index } >update reference</button>
			</p>
		`,
	"" );

	const attributes = SGT.getSurfacesAttributesByIndex( select.value );

	FXASDdivAdjacentSpaceDuplicateData.innerHTML =
		`
			${ attributes }

			${ htm }
		`;

		detAdjSpace = FXASDdivAdjacentSpaceDuplicateData.querySelectorAll( "details" )[ 0 ].open = true;
		//console.log( 'detAdjSpace', detAdjSpace );
}



FXASD.adjacentSpaceUpdate = function() {



};
