/* globals THREE, divTitle, divMenu, hamburger  */
// jshint esversion: 6

const MAP = {}

MAP.rows = 4;
MAP.cols = 4;

MAP.imagesCount = MAP.rows * MAP.cols;
MAP.imagesLoaded = 0;
MAP.pixelsPerImage = 256;

MAP.zoom = 18;

MAP.canvas;
MAP.context;



MAP.getGbxData = function () {

	parser = new DOMParser();
	const campusXml = parser.parseFromString( GBX.text, "application/xml").documentElement;

	const latitude = campusXml.getElementsByTagName( 'Latitude' )[ 0 ].innerHTML;
	const longitude = campusXml.getElementsByTagName( 'Longitude' )[ 0 ].innerHTML;

	inpLat.value = latitude;
	inpLon.value = longitude;

}


MAP.getTiles = function () {

	MAP.tileX = MAP.lon2tile( parseFloat( inpLon.value ), MAP.zoom );

	MAP.tileY = MAP.lat2tile( parseFloat( inpLat.value ), MAP.zoom );

	MAP.getMapTiles();

}


MAP.lon2tile = function ( lon, zoom ) {

	return Math.floor( ( lon + 180 ) / 360 * Math.pow( 2, zoom ) );

};



MAP.lat2tile = function( lat, zoom ) {

	const pi = Math.PI;

	return Math.floor( ( 1 - Math.log( Math.tan( lat * pi / 180 ) + 1 / Math.cos( lat * pi / 180 ) ) / pi ) / 2 * Math.pow( 2, zoom ) );

}


MAP.getMapTiles = function( tileX = 10486, tileY = 25326 ) {

	MAP.canvas = document.createElement( 'canvas' );
	MAP.canvas.width = MAP.cols * MAP.pixelsPerImage;
	MAP.canvas.height = MAP.rows * MAP.pixelsPerImage;

	MAP.context = MAP.canvas.getContext( '2d' );

	//document.body.appendChild( canvas );
	//canvas.style.cssText = 'border: 1px solid gray; margin: 10px auto; position: absolute; right: 0; z-index:10;';

	for ( let i = 0; i < MAP.cols; i++ ) {

		for ( let j = 0; j < MAP.rows; j ++ ) {

			const url = 'https://mt1.google.com/vt/x=' + ( MAP.tileX + i ) + '&y=' + ( MAP.tileY + j ) + '&z=' + MAP.zoom;

			MAP.fetchMapTile( url, i, j );

		}

	}

}


MAP.fetchMapTile = function( url, col, row ){

	const img = document.createElement( 'img' );  // new Image();

	img.onload = () => {

		MAP.context.drawImage( img, 0, 0, MAP.pixelsPerImage, MAP.pixelsPerImage, col * MAP.pixelsPerImage, row * MAP.pixelsPerImage, MAP.pixelsPerImage, MAP.pixelsPerImage );

		if ( ++MAP.imagesLoaded >= MAP.imagesCount ) { MAP.onImagesLoaded( MAP.canvas ); }

	}

	fetch( new Request( url ) )
	.then( response => response.blob() )
	.then( blob => img.src = URL.createObjectURL( blob ) );

}



MAP.onImagesLoaded = function ( canvas ) {

	THR.scene.remove( MAP.mesh )
	const texture = new THREE.Texture( canvas );
	texture.minFilter = texture.magFilter = THREE.NearestFilter;
	texture.needsUpdate = true;

	const geometry = new THREE.PlaneBufferGeometry( MAP.cols * MAP.pixelsPerImage, MAP.rows * MAP.pixelsPerImage );
	const material = new THREE.MeshBasicMaterial( { map: texture, side: 2 } );
	const mesh = new THREE.Mesh( geometry, material );
	mesh.position.set( THRU.center.x, THRU.center.y, GBX.elevation );
	scl = 0.4;
	mesh.scale.set( scl, scl, scl )
	THR.scene.add( mesh );

	MAP.mesh = mesh;

};
