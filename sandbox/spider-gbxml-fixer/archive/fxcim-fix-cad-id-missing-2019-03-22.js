
SGT.getFixCadIdMissing = function() {

	const timeStart = performance.now();
	let noId = [];

	SGT.surfaces.forEach( ( surface, index ) => {

		const cadId = surface.match( /<CADObjectId>(.*?)<\/CADObjectId>/);

		if ( !cadId ){ noId.push( index ) }

	} );


	htm = SGT.getSurfacesAttributesByIndex( noId ).map( item => {

		return `<br>${ item }
			CAD Object ID <input style=width:30rem; > <button onclick=alert("Coming-soon"); >update</button>`;

	} );

	/*
	cimHtm = SGT.getItemHtm( {
		open: noId.length > 0 ? "open" : "",
		summary: `Missing CAD Object ID - ${ noId.length} found`,
		description: `The CADObjectId Element is used to map unique CAD object identifiers to SGTML elements. Allows CAD/BIM tools to read results from a SGTML file and map them to their CAD objects.`,
		contents:
		`
			Surfaces with no CAD Object ID: ${ noId.length.toLocaleString() }<br>
				${ htm.join( "" ) }
		`,
		timeStart: timeStart
	} );

	*/

	cimHtm =
		`
			<p><i>The CADObjectId Element is used to map unique CAD object identifiers to gbXML elements</i></p>

			Surfaces with no CAD Object ID: ${ noId.length.toLocaleString() }<br>
			${ htm.join( "" ) }

			<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

		`;

	return cimHtm;

};



