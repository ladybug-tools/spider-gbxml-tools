// Copyright 2018 Ladybug Tools authors. MIT License
// jshint esversion: 6
/* globals THREE, THR, THRU, timeStart, divLog2 */

var GBXU = { "release": "R10.0", "date": "2018-12-12" };


GBXU.init = function() {

	FIL.reader.addEventListener( 'load', GBXU.setStats, false );
	GBXdivStats.addEventListener( 'click', GBXU.setStats, false );

	htm =
	`
		<b>Text parser statistics</b><br>
		<p>Render statistics will appear here.</p>
		<p>On very large files it may take some time before rendering begins.</p>

	`;

	return htm;

}



GBXU.setStats = function() {

	const reSpaces = /<Space(.*?)<\/Space>/gi;
	GBX.spaces = GBX.text.match( reSpaces );
	//console.log( 'spaces', GBX.spaces );

	const reStoreys = /<BuildingStorey(.*?)<\/BuildingStorey>/gi;
	GBX.storeys = GBX.text.match( reStoreys );
	GBX.storeys = Array.isArray( GBX.storeys ) ? GBX.storeys : [];
	//console.log( 'GBX.storeys', GBX.storeys );

	const reZones = /<Zone(.*?)<\/Zone>/gi;
	GBX.zones = GBX.text.match( reZones );
	GBX.zones = Array.isArray( GBX.zones ) ? GBX.zones : [];
	//console.log( 'GBX.zones', GBX.zones );

	const verticesCount = GBX.surfaces.map( surfaces => GBX.getVertices( surfaces ) );
	//console.log( 'vertices', vertices );

	const count = verticesCount.reduce( ( count, val, index ) => count + verticesCount[ index ].length, 0 );
	const timeToLoad = performance.now() - GBX.timeStart;

	const htm =
	`
			<div>time to parse: ${ parseInt( timeToLoad, 10 ).toLocaleString() } ms</div>
			<div>spaces: ${ GBX.spaces.length.toLocaleString() } </div>
			<div>storeys: ${ GBX.storeys.length.toLocaleString() } </div>
			<div>zones: ${ GBX.zones.length.toLocaleString() } </div>
			<div>surfaces: ${ GBX.surfaces.length.toLocaleString() } </div>
			<div>coordinates: ${ count.toLocaleString() } </div>
	`;

	GBXdivStats.innerHTML = htm;

};



GBX.getSurfaceEdgesThreejs = function() {

	const surfaceEdges = [];
	const lineMaterial = new THREE.LineBasicMaterial( { color: 0x888888 } );

	for ( let mesh of GBX.surfaceGroup.children ) {

		mesh.userData.edges = mesh;
		const edgesGeometry = new THREE.EdgesGeometry( mesh.geometry );
		const surfaceEdge = new THREE.LineSegments( edgesGeometry, lineMaterial );
		surfaceEdge.rotation.copy( mesh.rotation );
		surfaceEdge.position.copy( mesh.position );
		surfaceEdges.push( surfaceEdge );

	}

	//console.log( 'surfaceEdges', surfaceEdges );
	//THR.scene.add( ...surfaceEdges );

	return surfaceEdges;

};



GBX.getSurfaceOpenings = function() {

	const v = ( arr ) => new THREE.Vector3().fromArray( arr );

	const material = new THREE.LineBasicMaterial( { color: 0x444444, linewidth: 2, transparent: true } );
	const surfaceOpenings = [];

	for ( let surfaceText of GBX.surfaces ) {

		const reSurface = /<Opening(.*?)<\/Opening>/g;
		const openings = surfaceText.match( reSurface );

		//console.log( 'o', openings );

		if ( !openings ) { continue; }

		for ( let opening of openings ) {

			const polyloops = GBX.getPolyLoops( opening );

			//console.log( 'bb', polyloops );

			for ( let polyloop of polyloops ) {

				const coordinates = GBX.getVertices( polyloop );

				//console.log( 'coordinates', coordinates );

				const vertices = [];

				for ( let i = 0; i < ( coordinates.length / 3 ); i ++ ) {

					vertices.push( v( coordinates.slice( 3 * i, 3 * i + 3 ) ) );

				}

				//console.log( 'vertices', vertices );

				const geometry = new THREE.Geometry().setFromPoints( vertices );
				//console.log( 'geometry', geometry );

				const line = new THREE.LineLoop( geometry, material );
				surfaceOpenings.push( line );

			}
		}

	}

	//THR.scene.add( surfaceOpenings );

	return surfaceOpenings;

};
