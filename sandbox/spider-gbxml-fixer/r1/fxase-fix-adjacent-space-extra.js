


SGT.getFixAdjacentSpaceExtra = function() {

	const timeStart = performance.now();
	const oneSpace = [ 'ExteriorWall', 'Roof', 'ExposedFloor', 'UndergroundCeiling', 'UndergroundWall',
		'UndergroundSlab', 'RaisedFloor', 'SlabOnGrade', 'FreestandingColumn', 'EmbeddedColumn' ];

	const invalidAdjacentSpaceExtra = [];

	const surfaces = SGT.surfaces;

	// refactor to a reduce??
	for ( let i = 0; i < surfaces.length; i++ ) {

		const surface = surfaces[ i ];
		const surfaceType = surface.match ( /surfaceType="(.*?)"/ )[ 1 ];
		const adjacentSpaceArr = surface.match( /spaceIdRef="(.*?)"/gi );

		if ( oneSpace.includes( surfaceType ) && adjacentSpaceArr && adjacentSpaceArr.length > 1 ) {

			//const spaces = adjacentSpaceArr.map( item => item.match( /spaceIdRef="(.*?)"/ )[ 1 ] );
			//console.log( 'spaces', spaces );

			invalidAdjacentSpaceExtra.push( i );

		} else if ( surfaceType === "Shade" && adjacentSpaceArr > 0 ) {

			//console.log( 'Shade with adjacent space found', 23 );

			invalidAdjacentSpaceExtra.push( i );

		}

	}

	const options = invalidAdjacentSpaceExtra.map( index =>
		`<option value=${index } >${ SGT.surfaces[ index ].match( / id="(.*?)"/i )[ 1 ] }</option>` );
	//console.log( 'options', options );


	const aseHtm = SGT.getItemHtm( {
		open: invalidAdjacentSpaceExtra.length > 0 ? "open" : "",
		summary: `Surfaces with a Extra Adjacent Space - ${ invalidAdjacentSpaceExtra.length } found`,
		description: `Exterior surfaces that normally take a single adjacent space that are found to have two`,
		contents:
			`
				<p>
					${ invalidAdjacentSpaceExtra.length.toLocaleString() } found
				</p>

				<p>
					<select onclick=SGT.setSpaceExtraData(this); size=5 >${ options }</select>
				</p>

				<div id="FXASEdivSpaceExtraData" >Click a surface ID above to view its details and update its surface type</div>

				<p>
					<button onclick=FXASEdivSpaceExtra.innerHTML=SGT.getFixAdjacentSpaceExtra(); >Run check again</button>
				</p>

				<p>
					Click 'Save file' button in File menu to save changes to a file.
				</p>
			`,
		timeStart: timeStart

	} );


	/*
	const htm = SGT.getSurfacesAttributesByIndex( invalidAdjacentSpaceExtra ).map( item => {

		return item + `<button onclick=confirm("coming-soon"); >delete extra adjacent space</button><hr>`;

	} ).join( "" );

	const aseHtm = SGT.getItemHtm( {
		open: invalidAdjacentSpaceExtra.length > 0 ? "open" : "",
		summary: `Surfaces with a Extra Adjacent Space - ${ invalidAdjacentSpaceExtra.length } found`,
		description: `Exterior surfaces that normally take a single adjacent space that are found to have two`,
		contents:
			`
			${ invalidAdjacentSpaceExtra.length.toLocaleString() } found
			${ htm }
			`,
		timeStart: timeStart

	} );

	*/

	return aseHtm;

};
