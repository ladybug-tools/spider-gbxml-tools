

function parseFile( gbxml )  {

	const text = gbxml.replace( /\r\n|\n/g, '' );

	const re = /<Surface(.*?)<\/surface>/gi;
	const surfaces = text.match( re );
	//console.log( 'surfaces', surfaces );

	const vertices = surfaces.map( surface => getVertices( surface ) );

	const count = vertices.reduce( ( count, val, index ) => count + vertices[ index ].length, 0 );

	const timeToLoad = performance.now() - timeStart;

	divGbxmlInfo.innerHTML =
	`
		<hr>
		<div>time to load: ${ parseInt( timeToLoad, 10 ).toLocaleString() } ms</div>
		<div>surfaces: ${ surfaces.length.toLocaleString() } </div>
		<div>vertex arrays: ${ vertices.length.toLocaleString() } </div>
		<div>vertex count: ${ count.toLocaleString() } </div>
	`;


};



function getVertices( surface ) {

	const re = /<coordinate(.*?)<\/coordinate>/gi;
	const coordinatesText = surface.match( re );
	const coordinates = coordinatesText.map( coordinate => coordinate.replace(/<\/?coordinate>/gi, '' ) )
		.map( txt => Number( txt ) );

	return coordinates

}

