// Copyright 2019 Ladybug Tools authors. MIT License
/* globals */
/* jshint esversion: 6 */
/* jshint loopfunc:true */


SGT.getFixAdjacentSpaceDuplicate = function() {

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


	const htm = SGT.getSurfacesAttributesByIndex( invalidAdjacentSpaceDuplicate ).map( item => {

		return item + `<button onclick=confirm("coming-soon"); >fix adjacent space</button><hr>`;

	} ).join( "" );

	/*
	const asdHtm = SGT.addItem( {
		open: invalidAdjacentSpaceDuplicate.length > 0 ? "open" : "",
		summary: `Surfaces with Duplicate Adjacent Spaces - ${ invalidAdjacentSpaceDuplicate.length} found`,
		description: `Air, InteriorWall, InteriorFloor, or Ceiling surfaces where both adjacent space IDs point to the same space`,
		contents:
		`
			${ invalidAdjacentSpaceDuplicate.length.toLocaleString() } found<br>
			${ htm }
		`,
		timeStart: timeStart

	} );

	*/

	const asdHtm =

	`
		<p><i>Air, InteriorWall, InteriorFloor, or Ceiling surfaces where both adjacent space IDs point to the same space</i></p>

		${ invalidAdjacentSpaceDuplicate.length.toLocaleString() } found<br>
		${ htm }

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>
	`;

	return asdHtm;

};
