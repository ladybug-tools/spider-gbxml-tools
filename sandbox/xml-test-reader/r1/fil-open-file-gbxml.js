// Copyright 2018 Ladybug Tools authors. MIT License
/* globals THR, GBX, */
/* jshint esversion: 6 */

const FIL = {};

FIL.divFileInfo = ''; // set to a div in main HTML file or nothing happens



FIL.getFileOpen = function() {  // called from main HTML file

	FIL.timeStart = performance.now();

	window.addEventListener ( 'hashchange', FIL.onHashChange, false );

	divFileOpen.addEventListener( "dragover", function( event ){ event.preventDefault(); }, true );
	divFileOpen.addEventListener( 'drop', FIL.drop, false );

	const htm =
	`
		<p id=pFileOpen>
			Open gbXML files:
			<input type=file id=inpOpenFile onchange=FIL.inpOpenFiles(this); multiple accept=".xml" >
			or drag & drop files here
			or enter a default file path &nbsp;<a href=#../assets/file-open.md title="Learn how to speed up your testing" >?</a>
			<!--  try this: 	https://www.ladybug.tools/spider/gbxml-sample-files/bristol-clifton-downs-fixed.xml -->
			<input id=FILinpFilePath onchange=FIL.updateDefaultFilePath(); style=width:95%; title='paste a file path or URL here then press Enter' >

		</p>
	`;

	return htm;

};



// handle location.hash change events

FIL.onHashChange = function() {

	FIL.timeStart = performance.now();

	const url = !location.hash ? FIL.urlDefaultFile : location.hash.slice( 1 );

	if ( url.toLowerCase().endsWith( '.xml' ) ) {

		//THRU.setSceneDispose( [ GBX.surfaceMeshes, GBX.surfaceEdges, GBX.surfaceOpenings, THRU.helperNormalsFaces ] );

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

			FIL.name = xhr.target.responseURL.split( '/').pop();

			FIL.timeToLoad = performance.now() - FIL.timeStart;

			FIL.divFileInfo.innerHTML =
			`
				<div>${ FIL.name}</div>
				<div>bytes loaded: ${xhr.loaded.toLocaleString()}</div>
				<div>time to load: ${ parseInt( FIL.timeToLoad, 10 ).toLocaleString() } ms</div>

			`;

		}

};



FIL.callbackGbXML = function( xhr ) {

	const time = performance.now();
	const gbxmlResponseXML =  xhr.target.responseXML;

	//const gbxml = xhr.target.responseXML.documentElement;
	const string = xhr.target.response;


	FIL.onParseString( string );

	surfaces = [];

	//const meshesArray = GBX.parseFileXML( gbxml );

	//THR.scene.add( ...meshesArray );

	//THRU.zoomObjectBoundingSphere( GBX.surfaceMeshes );

	FIL.timeToLoad = performance.now() - FIL.timeStart;
	FIL.timeToParse = performance.now() - time;
	FIL.divFileInfo.innerHTML =
	`
		<div>${ FIL.name }</div>
		<div>bytes loaded: ${xhr.loaded.toLocaleString()}</div>
		<div>surfaces: ${ surfaces.length.toLocaleString()}</div>
		<div>time to load: ${ parseInt( FIL.timeToLoad, 10 ).toLocaleString() } ms</div>
		<div>time to parse: ${ parseInt( FIL.timeToParse, 10 ).toLocaleString() } ms</div>

	`;

};



//////////

FIL.inpOpenFiles = function( files ) {

	//console.log( 'file', files.files[ 0 ] );

	FIL.timeStart = performance.now();

	//THRU.setSceneDispose( [ GBX.surfaceMeshes, GBX.surfaceEdges, GBX.surfaceOpenings, THRU.helperNormalsFaces ] );

	FIL.fileAttributes = files.files[ 0 ];

	const reader = new FileReader();

	reader.onprogress = onRequestFileProgress;

	reader.onload = function( event ) {

		const string = reader.result;

		FIL.onParseString( string );

		surfaces = [];

		FIL.timeToLoad = performance.now() - FIL.timeStart;

		FIL.divFileInfo.innerHTML =
		`
			<div>${ FIL.fileAttributes.name }</div>
			<div>bytes loaded: ${event.loaded.toLocaleString()}</div>
			<div>surfaces: ${ surfaces.length.toLocaleString()}</div>
			<div>time to load: ${ parseInt( FIL.timeToLoad, 10 ).toLocaleString() } ms</div>

		`;

	};

	reader.readAsText( files.files[ 0 ] );


		function onRequestFileProgress( event ) {

			FIL.timeToLoad = performance.now() - FIL.timeStart;

			FIL.divFileInfo.innerHTML =
			`
				<div>${ FIL.fileAttributes.name }</div>
				<div>bytes loaded: ${event.loaded.toLocaleString()}</div>
				<div>time to load: ${ parseInt( FIL.timeToLoad, 10 ).toLocaleString() } ms</div>
			`;

		}

};

// add getFileInfo()...


FIL.onParseString = function( string ) {
	console.log( 'string', string.length.toLocaleString() );

	const parser = new DOMParser();

	const lines = string.split(/\r\n|\n/).map( line => line.trim() );
	console.log( 'lines', lines.length.toLocaleString() );

	const text = lines.join( '' );
	console.log( 'text', text.length.toLocaleString()  );

	//setTimeout( function() {

		xml = parser.parseFromString( text, "text/xml" ); // "application/xml"

		//surfaces = xml.getElementsByTagName( "Surface" );

		//return surfaces;

	//}, 500 )


}



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



FIL.updateDefaultFilePath = function() {

	location.hash = FILinpFilePath.value;

	const thrFilePath = FILinpFilePath.value;
	localStorage.setItem( 'thrFilePath', thrFilePath );

};
