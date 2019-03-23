// Copyright 2019 Ladybug Tools authors. MIT License
/* globals */
/* jshint esversion: 6 */
/* jshint loopfunc:true */



const FXASD = { "release": "R1.0", "date": "2019-03-22" };


FXASD.description = ``;

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

	FXASDsumSpaceDuplicate.innerHTML = `Fix surfaces with duplicate adjacent spaces ~ ${ invalidAdjacentSpaceDuplicate.length.toLocaleString() } found`;


	const options = invalidAdjacentSpaceDuplicate.map( index =>
		`<option value=${index } >${ SGT.surfaces[ index ].match( / id="(.*?)"/i )[ 1 ] }</option>` );
	//console.log( 'options', options );

/*
	const htm = SGT.getSurfacesAttributesByIndex( invalidAdjacentSpaceDuplicate ).map( item => {

		return item + `<button onclick=confirm("coming-soon"); >fix adjacent space</button><hr>`;

	} ).join( "" );
*/

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


FXASD.setSpaceDuplicateData = function( item ) {

	attributes = SGT.getSurfacesAttributesByIndex( item.value )

	FXASDdivAdjacentSpaceDuplicateData.innerHTML =

	`
	${ attributes }

	<button onclick=confirm("coming-soon"); >fix adjacent space</button><hr>
	`;

}