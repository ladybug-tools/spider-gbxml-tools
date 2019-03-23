


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


	FXASEsumSpaceExtra.innerHTML = `Fix surfaces with an extra adjacent space ~ ${ invalidAdjacentSpaceExtra.length.toLocaleString() } found`;

	const aseHtm =
		`

			<p><i>Exterior surfaces that normally take a single adjacent space that are found to have two</i></p>

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

			<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

		`;

	return aseHtm;

};
