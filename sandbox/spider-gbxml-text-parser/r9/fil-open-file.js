// Copyright 2018 Ladybug Tools authors. MIT License
// jshint esversion: 6
/* globals THREE, THR, THRU */


const FIL = { "release": "R9.0", "date": "2018-11-17" };



FIL.onHashChange = function() {

	//FIL.timeStart = performance.now();

	const url = !location.hash ? urlDefaultFile : location.hash.slice( 1 );

	if ( url.toLowerCase().endsWith( '.xml' ) ) {

		THRU.setSceneDispose( [ GBX.surfaceMeshes ] );

		FIL.requestFile( url, FIL.callbackGbXML );

	} else {

		console.log( 'oops', url );

	}

};



FIL.requestFile = function( url, callback ) {

	FIL.timeStart = performance.now();

	detStats.open = false;
	detReports.open = false;
	detSettings.open = false;

	detMenuEdit.open = false
	detMenuView.open = false;
	detMenuHelp.open = false;

	const xhr = new XMLHttpRequest();
	xhr.crossOrigin = 'anonymous';
	xhr.open( 'GET', url, true );
	xhr.onerror = function( xhr ) { console.log( 'error:', xhr  ); };
	xhr.onprogress = onRequestFileProgress;
	xhr.onload = callback;
	xhr.send( null );


		function onRequestFileProgress( xhr ) {

			GBX.name = xhr.target.responseURL.split( '/').pop();

			const timeToLoad = performance.now() - FIL.timeStart;

			FIL.onProgress( GBX.name, xhr.loaded, timeToLoad );

		}

}



FIL.callbackGbXML = function( xhr ) {

	const len = GBX.parseFile( xhr.target.response );
	//console.log( 'len', len );

	const timeToLoad = performance.now() - FIL.timeStart;

	FIL.onParseFile();

	FIL.onProgress( GBX.name, xhr.loaded, timeToLoad );

}



FIL.inpOpenFileXml = function( files ) {
	//console.log( 'file', files.files[ 0 ] );

	const timeStart = performance.now();

	const fileAttributes = files.files[ 0 ];

	const reader = new FileReader();

	reader.onprogress = onRequestFileProgress;

	detMenuEdit.open=false
	detStats.open = false;
	detReports.open = false;
	detMenuView.open = false;
	detMenuHelp.open = false;

	reader.onload = function( event ) {

		detStats.open = true;

		const text = reader.result;
		//divGeneralCheck.innerHTML = getGeneralCheck( reader.result );

		const len = GBX.parseFile( text );
		//console.log( 'len', len );

		FIL.onParseFile();

		const timeToLoad = performance.now() - timeStart;

		FIL.onProgress( fileAttributes.name, event.loaded, timeToLoad );

	};

	reader.readAsText( files.files[ 0 ] );


	function onRequestFileProgress( event ) {

		const timeToLoad = performance.now() - timeStart;

		FIL.onProgress( fileAttributes.name, event.loaded, timeToLoad );

	}

}



FIL.inpOpenFileZip = function( files ) {
	//console.log( 'files', files.files[0] );

	const timeStart = performance.now();

	detStats.open = false;
	detReports.open = false;
	detSettings.open = false;

	const zip = new JSZip();

	const names = [];

	zip.loadAsync( files.files[0] )

	.then( ( zip ) => {

		zip.forEach( function ( relativePath, zipEntry ) {

			names.push( zipEntry.name );

			divFileInfo.innerHTML += '<p>file name: ' + zipEntry.name + '</p>';
			//console.log( 'file name: ', zipEntry.name );

		});
		//console.log( 'zip', zip );

		return zip;

	} )

	.then( ( data ) => {
		//console.log( 'data', data  );

		const arrTemp = data.files[ names[ 0 ] ].async( "uint8array", metadata =>
			divFileInfo.innerHTML = `progression: ${ metadata.percent.toFixed(2) }%`
		);

		return arrTemp;

	}, ( err ) =>  divFileInfo.innerHTML += err.message )

	.then( ( uint8array ) => {
		//console.log( 'uint8array', uint8array );

		divGbxmlInfo.innerHTML = 'Decoding text';
		let txt = '';

		if ( uint8array[ 0 ] !== 255 ||  uint8array[ 0 ] === 239 || uint8array[ 0 ] === 60 ) {

			txt = new TextDecoder( "utf-8" ).decode( uint8array );
			//console.log( 'txt', txt );

		} else {
			//console.log( 'uint8array', uint8array );

			let arr = new Uint8Array( uint8array.length / 2 );
			index = 0;

			for ( let i = 0; i < uint8array.length; i++ ) {

				if ( i % 2 === 0 ) {

					arr[ index++ ] = uint8array[ i ];

				}

			}
			//console.log( 'arr', arr );

			txt = new TextDecoder( "utf-8" ).decode( arr );

		}

		const len = GBX.parseFile( txt );
		//console.log( 'len', len );

		const timeToLoad = performance.now() - timeStart;

		FIL.onParseFile();

		FIL.onProgress( names[ 0 ], txt.length, timeToLoad );

	} );

}



FIL.onParseFile = function() {

	detStats.open = true;
	//detReports.open = true; // see click on toggle

	VWSRF.setSurfaceTypesVisible( VWSRF.filtersDefault );

}



FIL.onProgress = function( name, size, time ) {

	divFileInfo.innerHTML =
	`
		<div>${ name }</div>
		<div>bytes loaded: ${ Number( size ).toLocaleString()}</div>
		<div>time to load: ${ Number( time ).toLocaleString() } ms</div>
	`;

}




/*
info.innerHTML = '<a href="" ><h1>' + document.title + '</h1></a>' +
	'<p><button onclick=saveFile(); >Save File</button></p>' +
	'<div id=msg ></div>' +
	'<div>' +
	'<textarea id=txtArea name="txt1" cols="80" rows="50" placeholder="Stuff" >' +
	'Iteration system wide engenders economies of scale, cross-media technology, presentation action items and life cycle replication.' +
	'</textarea>' +
'</div>';
*/

FIL.butSaveFile = function() {

	var lines = GBX.text.split(/\r\n|\n/);
	console.log( 'len', lines.length );
	let blob = new Blob( [ GBX.text ] );
	let a = document.body.appendChild( document.createElement( 'a' ) );
	a.href = window.URL.createObjectURL( blob );
	a.download = 'hello-world.xml';
	a.click();
//		delete a;
	a = null;

}

