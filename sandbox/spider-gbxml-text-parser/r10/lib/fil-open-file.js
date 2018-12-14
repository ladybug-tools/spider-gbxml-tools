// Copyright 2018 Ladybug Tools authors. MIT License
// jshint esversion: 6
/* globals */


const FIL = { "release": "r10.1.1", "date": "2018-12-13" };

FIL.xhr = new XMLHttpRequest();
FIL.reader = new FileReader();
//zip = new JSZip();

FIL.note = `<p>With large files, after loading there may be a pause of some seconds where nothing happens.</p>`;


FIL.currentStatus =
	`
		<details>

			<summary>FIL ${ FIL.release } status ${ FIL.date }</summary>

			<p>File opening and saving of gbXML and ZIP files is generally working well and open for testing.</p>

			<p>
				Updates
				<ul>

					<li>2018-12-13 ~ Add save to gbXML ad to ZIP</li>
					<li>2018-12-13 ~ Open gbXML and open zip combined into single UI element. Major code refactor.</li>
					<li>2018-12-13 ~ Add cookbook test script</li>
					<li>2018-12-13 ~ Improve modularization and event-handing between modules</li>
					<li>2018-12-13 ~ Improve loading progress indication</li>
					<li></li>
				</ul>
			</p>

			<p>
				<a href="https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/sandbox/spider-gbxml-text-parser/r10/cookbook" target="_blank">
				fil-open-file.js Read Me</a>
			</p>
		</details>
	`;



FIL.getMenuFileOpen = function() {  // called from main HTML file

	FIL.timeStart = performance.now();

	window.addEventListener ( 'hashchange', FIL.onHashChange, false );

	FILdivFileOpen.addEventListener( "dragover", function( event ){ event.preventDefault(); }, true );
	FILdivFileOpen.addEventListener( 'drop', FIL.drop, false );

	//FIL.xhr.addEventListener( 'load', function( e ) { console.log( 'e', e.target.response ); }, false );
	// see event listener in: gbx-gbxml-text-parser.js

	FILdivCurrentStatus.innerHTML = FIL.currentStatus;

	const htm =
	`
		<div id="FILdivFileOpen" class="dragDropArea" >

			<p>
				<input type=file id=inpOpenFile onchange=FIL.inpFileOpenType(this); accept=".xml, .zip" >
				or drag & drop files here
				or enter a default file path &nbsp;<a href=#../assets/file-open.md title="Learn how to speed up your testing" >?</a>
				<!--
					try this: 	https://www.ladybug.tools/spider/gbxml-sample-files/bristol-clifton-downs-broken.xml
				-->
				<input id=FILinpFilePath onchange=FIL.updateDefaultFilePath(); style=width:95%; title='paste a file path or URL here then press Enter' >
			</p>

		</div>

		<aside>


			<div>File name:</div>

			<div id=FILdivProgress ></div>

		</aside>



	`;

	return htm;

};



FIL.onHashChange = function() {

	const url = !location.hash ? FIL.urlDefaultFile : location.hash.slice( 1 );
	//console.log( 'url', url );

	FIL.name = url.split( '/').pop();


	if ( url.toLowerCase().endsWith( '.xml' ) ) {

		THRU.setSceneDispose( [ GBX.surfaceMeshes ] ); // to GBX

		FIL.requestFile( url, FIL.callbackGbxml );

	} else if ( url.toLowerCase().endsWith( '.zip' )) {

		THRU.setSceneDispose( [ GBX.surfaceMeshes ] );

		FIL.getZipFromUrl( url, FIL.callbackUrlUtf16 );

	} else {

		console.log( 'oops', url );

	}

};



FIL.getZipFromUrl = function( url, callback ) {

	FIL.timeStart = performance.now();

	const xhr = new XMLHttpRequest();
	xhr.crossOrigin = 'anonymous';
	xhr.responseType = 'blob';
	xhr.open( 'GET', url, true );
	xhr.onerror = function( xhr ) { console.log( 'error:', xhr  ); };
	xhr.onprogress = onRequestFileProgress;
	xhr.onload = callback;
	xhr.send( null );

	function onRequestFileProgress( xhr ) {

		const timeToLoad = performance.now() - FIL.timeStart;

		FIL.onProgress( FIL.name, xhr.loaded.toLocaleString(), timeToLoad, FIL.note );

	}

};



FIL.callbackUrlUtf16 = function( xhr ) {

	const response = xhr.target.response;
	//console.log( 'response', response );

	const zip = new JSZip();
	const names = [];

	zip.loadAsync( response )

	.then( function( zip ) {
		//console.log( 'zip', zip );

		zip.forEach( ( relativePath, zipEntry ) => names.push( zipEntry.name ) );

		// Read from the zip file!
		const array = zip.file( names[ 0 ] ).async( "uint8array" );

		return array;

	} )

	.then( function( uint8array ) {
		//console.log( 'uint8array', uint8array[ 0 ] );

		let text = '';

		if ( uint8array[ 0 ] !== 255 ||  uint8array[ 0 ] === 239 || uint8array[ 0 ] === 60 ) {

			text = new TextDecoder( "utf-8" ).decode( uint8array );
			//console.log( 'text', text );

		} else {

			const arr = new Uint8Array( uint8array.length / 2 );
			let index = 0;

			// console.log( 'uint8array', uint8array );

			for ( let i = 0; i < uint8array.length; i++ ) {

				if ( i % 2 === 0 ) {

					arr[ index++ ] = uint8array[ i ];

				}

			}
			//console.log( 'arr', arr );

			text = new TextDecoder( "utf-8" ).decode( arr );

		}
		//console.log( 'text', text );

		return text;

	} )

	.then(

		function success( text) {

			GBX.parseFile( text );  // to GBX

			const timeToLoad = performance.now() - FIL.timeStart;

			FIL.onProgress( FIL.name, text.length.toLocaleString(), timeToLoad );

		},

		function error( e ) { divFileContents.append(`error ${ e } `) }

	);

};



FIL.requestFile = function( url, callback ) {

	FIL.timeStart = performance.now();

	FIL.xhr.crossOrigin = 'anonymous';
	FIL.xhr.open( 'GET', url, true );
	FIL.xhr.onerror = function( xhr ) { console.log( 'error:', xhr  ); };
	FIL.xhr.onprogress = onRequestFileProgress;
	FIL.xhr.onload = callback;
	FIL.xhr.send( null );

		function onRequestFileProgress( xhr ) {

			const timeToLoad = performance.now() - FIL.timeStart;

			FIL.onProgress( FIL.name, xhr.loaded.toLocaleString(), timeToLoad, FIL.note );

		}

};



FIL.callbackGbxml = function( xhr ) {
	//console.log( 'xhr', xhr );

	const timeToLoad = performance.now() - FIL.timeStart;

	FIL.onProgress( FIL.name, xhr.loaded.toLocaleString(), timeToLoad );

};



FIL.inpFileOpenType = function( files ) {
	//console.log( 'files', files );

	FIL.timeStart = performance.now();

	const file = files.files[ 0 ];
	const type = file.type
	//console.log( 'type', type );

	if ( type === "text/xml" ) {

		FIL.inpFileOpenXml( files );

	} else if ( type === "application/x-zip-compressed" ) {

		FIL.inpFileOpenZip( files );

	} else {

		console.log( 'not supported', type );

	}

}


FIL.inpFileOpenXml = function( files ) {
	//console.log( 'file', files.files[ 0 ] );

	FIL.name = files.files[ 0 ].name;

	FIL.reader.onprogress = onRequestFileProgress;

	FIL.reader.onload = function( event ) {

		const timeToLoad = performance.now() - FIL.timeStart;

		FIL.onProgress( FIL.name, event.loaded, timeToLoad );

	};

	FIL.reader.readAsText( files.files[ 0 ] );


	function onRequestFileProgress( event ) {

		const timeToLoad = performance.now() - FIL.timeStart;

		FIL.onProgress( FIL.name, event.loaded.toLocaleString(), timeToLoad, FIL.note );

	}

};



FIL.inpFileOpenZip = function( files ) {
	//console.log( 'files', files.files[0] );

	FIL.name = files.files[ 0 ].name;

	const zip = new JSZip();
	const decoder = new TextDecoder( "utf-8" );

	const names = [];

	zip.loadAsync( files.files[ 0 ] )

	.then( zip => {
		//console.log( 'zip', zip );

		zip.forEach( ( relativePath, zipEntry ) => names.push( zipEntry.name ) );
		FIL.name = names[ 0 ];

		const arrTemp = zip.files[ FIL.name].async( "uint8array", metadata =>
			FIL.onProgress( FIL.name, metadata.percent.toFixed(2) + '%', performance.now() - FIL.timeStart, FIL.note )
		);

		return arrTemp;

	}, ( err ) =>  FILdivProgress.innerHTML += err.message )

	.then( ( uint8array ) => {
		//console.log( 'uint8array', uint8array );

		if ( uint8array[ 0 ] !== 255 ||  uint8array[ 0 ] === 239 || uint8array[ 0 ] === 60 ) {

			FIL.txt = decoder.decode( uint8array );
			//console.log( 'txt', FIL.txt );

		} else {
			//console.log( 'uint8array', uint8array );

			let arr = new Uint8Array( uint8array.length / 2 );
			let index = 0;

			for ( let i = 0; i < uint8array.length; i++ ) {

				if ( i % 2 === 0 ) { arr[ index++ ] = uint8array[ i ]; }

			}
			//console.log( 'arr', arr );

			FIL.txt = decoder.decode( arr );

		}

		const timeToLoad = performance.now() - FIL.timeStart;

		FIL.onProgress( FIL.name, FIL.txt.length.toLocaleString(), timeToLoad );

		GBXdivStats.click(); // to GBX

	} );

};



FIL.onProgress = function( name, size, time, note = '' ) {

	FILdetFileOpen.open = true;
	//FILdetFileInfo.open = true;

	FILdetFileOpen.scrollIntoViewIfNeeded();

	let htm =
	`
		<div style=color:blue; >${ name }</div>
		<div>bytes loaded: ${ size }</div>
		<div>time to load: ${ Number( time ).toLocaleString() } ms</div>
		${ note }
	`;

	//if ( size.endsWith( '%' ) ) { htm += '<p>On large files, there wil ba a pause for some seconds where nothing seems to happen.</p>'; }

	FILdivProgress.innerHTML = htm;

};



////////// handle drag and drop events

FIL.drop = function( event ) {
	//console.log( 'event', event );

	const dropUrl = event.dataTransfer.getData( 'URL' );
	//console.log( 'dropUrl', dropUrl );

	if ( dropUrl ) {

		location.hash = dropUrl;

	} else {

		console.log( 'event', event.dataTransfer.files[ 0 ] );

		type = event.dataTransfer.files[ 0 ].type
		console.log( 'type', type );

		if ( type === "text/xml" ) {

			FIL.inpFileOpenXml( event.dataTransfer );

		} else if ( type === "application/x-zip-compressed" ) {

			FIL.inpFileOpenZip( event.dataTransfer );

		} else {

			console.log( 'not supported', type );

		}

	}

	event.preventDefault();

};



FIL.updateDefaultFilePath = function() {

	location.hash = FILinpFilePath.value;

	const thrFilePath = FILinpFilePath.value;
	localStorage.setItem( 'thrFilePath', thrFilePath );

};



//////////


FIL.butSaveFile = function() {

	const lines = GBX.text.split(/\r\n|\n/);
	//console.log( 'len', lines.length );

	const blob = new Blob( [ GBX.text ] );
	let a = document.body.appendChild( document.createElement( 'a' ) );
	a.href = window.URL.createObjectURL( blob );
	a.download = FIL.name;
	a.click();
	a = null;

};



FIL.butSaveFileZip = function() {

	const zip = new JSZip();

	zip.file( FIL.name, GBX.text );

	zip.generateAsync( { type:"blob", compression: "DEFLATE" } )

	.then( function( blob ) {

		let a = document.body.appendChild( document.createElement( 'a' ) );
		a.href = window.URL.createObjectURL( blob );
		a.download = FIL.name.replace( /.xml/i, '.zip' );
		a.click();
		a = null;

	});

}
