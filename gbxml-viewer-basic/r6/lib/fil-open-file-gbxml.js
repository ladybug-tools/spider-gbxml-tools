// Copyright 2018 Ladybug Tools authors. MIT License
/* globals THR, GBX, */
/* jshint esversion: 6 */

const FIL = {};



FIL.getFileOpen = function( target = undefined ) {  // called from main HTML file

	FIL.divFileData = target;

	FIL.timeStart = performance.now();

	window.addEventListener ( 'hashchange', FIL.onHashChange, false );

	divFileOpen.addEventListener( "dragover", function( event ){ event.preventDefault(); }, true );
	divFileOpen.addEventListener( 'drop', FIL.drop, false );

	const htm =
	`
		<p id=pFileOpen>
			Open gbXML files:
			<input type=file id=inpOpenFile onchange=FIL.inpOpenFiles(this); multiple accept=".xml" >
		</p>
	`;

	return htm;

};



// handle location.hash change events

FIL.onHashChange = function() {

	const url = !location.hash ? urlDefaultFile : location.hash.slice( 1 );
	const ulc = url.toLowerCase();

	FIL.timeStart = performance.now();

	 if ( ulc.endsWith( '.xml' ) ) {

		THRU.setSceneDispose( [ GBX.surfaceMeshes, GBX.surfaceEdges, GBX.surfaceOpenings, THRU.axesHelper, THRU.helperNormalsFaces ] );

		FIL.requestFile( url, FIL.callbackGbXML );

	} else {

		console.log( 'oops', url );

	}

};



FIL.requestFile = function( url, callback ) {

	const xhr = new XMLHttpRequest();
	xhr.crossOrigin = 'anonymous';
	xhr.open( 'GET', url, true );
	xhr.onerror = function( xhr ) { console.log( 'error:', xhr  ); };
	xhr.onprogress = onRequestFileProgress;
	xhr.onload = callback;
	xhr.send( null );


	function onRequestFileProgress( xhr ) {

		const fileAttributes = { name: xhr.target.responseURL.split( '/').pop() };

		divFileInfo.innerHTML =
		`
			${fileAttributes.name}<br>
			bytes loaded: ${xhr.loaded.toLocaleString()}<br>
		`;

	}

}



FIL.callbackGbXML = function( xhr ) {

	const gbxmlResponseXML =  xhr.target.responseXML;
	//const gbxml = xhr.target.responseXML.documentElement;
	const gbxml = xhr.target.response;

	const meshesArray = GBX.parseFileXML( gbxml );

	THR.scene.add( ...meshesArray );

	THRU.zoomObjectBoundingSphere( GBX.surfaceMeshes );

}



//////////

FIL.inpOpenFiles = function( files ) {

	//console.log( 'file', files.files[ 0 ] );

	FIL.timeStart = performance.now();

	THRU.setSceneDispose( [ GBX.surfaceMeshes, GBX.surfaceEdges, GBX.surfaceOpenings, THR.axesHelper, THRU.helperNormalsFaces ] );

	FIL.fileAttributes = files.files[ 0 ];

	const reader = new FileReader();

	reader.onprogress = onRequestFileProgress;

	reader.onload = function( event ) {

		meshesArray = GBX.parseFileXML( reader.result );
		//console.log( 'fil meshes', meshesArray );

		THR.scene.add( ...meshesArray );

		THRU.zoomObjectBoundingSphere( GBX.surfaceMeshes );

	};

	reader.readAsText( files.files[ 0 ] );

	function onRequestFileProgress( event ) {

		divFileInfo.innerHTML =
		`
			${FIL.fileAttributes.name}<br>
			bytes loaded: ${event.loaded.toLocaleString()}<br>
		`;

	}

};






////////// handle drag and drop events

FIL.drop = function( event ) {

	const dropUrl = event.dataTransfer.getData( 'URL' );
	//console.log( 'dropUrl', dropUrl );
	//console.log( 'event', event );

	if ( dropUrl ) {

		location.hash = dropUrl;

	} else {

		FIL.inpOpenFiles( event.dataTransfer );

	}

	event.preventDefault();

};
