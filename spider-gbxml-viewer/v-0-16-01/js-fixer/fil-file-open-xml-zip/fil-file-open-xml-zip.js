/* globals MNU, inpOpenFile, GBX, JSZip, showdown, FILdivFileOpen, FILdivProgress, FILdetFileOpen, FILinpFilePath */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const FIL = {

	"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
	"date": "2019-05-30",
	"description": "Open and save gbXML and ZIP files using location.hash, the operating system file dialog box or drag&drop",
	"helpFile": "https://www.ladybug.tools/spider-gbxml-fixer/r0-4-0/fil-file-open-xml-zip/README.md",
	"version": "0.4.0-2",

};


FIL.urlDefaultFile = "../../test-samples/one-room-with-surface-type-errors.xml";
FIL.reader = new FileReader();
FIL.xhr = new XMLHttpRequest(); // declare now to load event listeners in other modules

FIL.note = `<p>With large files, after loading, there is a pause of some seconds where nothing happens.</p>`;

FIL.getMenuFileOpen = function() {  // called from main HTML file

	FIL.timeStart = performance.now();

	window.addEventListener ( 'hashchange', FIL.onHashChange, false );

	FILdivFileOpen.addEventListener( "dragover", function( event ){ event.preventDefault(); }, true );

	FILdivFileOpen.addEventListener( 'drop', FIL.drop, false );

	const htm =
	`
		<details id=FILdetFileOpen open >

			<summary>Open gbXML or ZIP file
				<button id=butFIL class=butHelp onclick="POP.setPopupShowHide(butFIL,FIL.helpFile);" >?</button>
			</summary>

			<div class="dragDropArea" >

				<p>
					<input type=file id=inpOpenFile onchange=FIL.onInputFileOpen(this); accept=".xml, .zip, .md" >
				</p>
				<p>
					<button onclick=FIL.reloadFile(); >reload file</button>
				</p>
				<p>
					or drag & drop files here
					or enter a default file path <a class=helpItem href=https://www.ladybug.tools/spider/#pages/file-open.md title="Learn how to speed up your testing" target=-blank >?</a>
					<!--
						try this: 	https://www.ladybug.tools/spider/gbxml-sample-files/bristol-clifton-downs-broken.xml
					-->
					<input id=FILinpFilePath onchange=FIL.updateDefaultFilePath(); style=width:95%; title='paste a file path or URL here then press Enter' >
				</p>

			</div>

			<details open >

				<summary>File open statistics</summary>

				<div id=FILdivProgress ></div>

			</details>

		</details>
	`;

	return htm;

};



FIL.getMenuFileSave = function() {

	const htm =
	`
	<details>

		<summary>Save file
			<button id=butFILSave class=butHelp onclick="POP.setPopupShowHide(butFILSave,FIL.helpFile);" >?</button>
		</summary>

		<p>
			<button onclick=FIL.butSaveFile(); >Save file as gbXML</button>
		</p>
		<p>
			<button onclick=FIL.butSaveFileZip(); >Save file as gbXML in ZIP</button>
		</p>

		<hr>

	</details>

	`;

	return htm;

};



FIL.onHashChange = function() {

	const url = !location.hash ? FIL.urlDefaultFile : location.hash.slice( 1 );
	//console.log( 'url', url );

	FIL.name = url.split( '/').pop();

	if ( FIL.name.toLowerCase().endsWith( '.xml' ) ) {

		FIL.xhrRequestFileXml( url );

	} else if ( FIL.name.toLowerCase().endsWith( '.zip' )) {

		FIL.xhrRequestFileZip( url, FIL.callbackUrlUtf16 );

	} else if ( FIL.name.toLowerCase().endsWith( '.md' )) {

		FIL.requestFileText( url );

	} else {

		console.log( 'oops', url );

	}

};



FIL.xhrRequestFileXml = function( url ) {

	FIL.timeStart = performance.now();

	FIL.name = url.split( '/').pop();

	FIL.xhr.open( 'GET', url, true );
	FIL.xhr.onerror = function( xhr ) { console.log( 'error:', xhr  ); };
	FIL.xhr.onprogress = function( xhr ) { FIL.onProgress( xhr.loaded, FIL.note ); };
	FIL.xhr.onload = function( xhr ) { FIL.text = xhr.target.response; FIL.onProgress( xhr.loaded, "load complete" ); };
	FIL.xhr.send( null );

};



FIL.xhrRequestFileZip = function( url ) {

	FIL.timeStart = performance.now();

	const xhr = new XMLHttpRequest();
	xhr.responseType = 'blob';
	xhr.open( 'GET', url, true );
	xhr.onerror = function( xhr ) { console.log( 'error:', xhr ); };
	xhr.onprogress = function( xhr ) { FIL.onProgress( xhr.loaded, FIL.note ); };
	xhr.onload = FIL.callbackUrlUtf16;
	xhr.send( null );

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

		// Read first file from the zip file!
		const uint8array = zip.file( names[ 0 ] ).async( "uint8array" );
		//console.log( 'names[ 0 ]', names[ 0 ] );

		FIL.name = names[ 0 ];

		return uint8array;

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

			FIL.text = text;

			//const event = new Event( 'onZipFileParse' );
			//document.body.dispatchEvent( event );

			FIL.onProgress( text.length, "load complete" );

		},

		function error( e ) { FILdivProgress.append( `error ${ e } ` ); }

	);

};



FIL.requestFileText = function( url ) {

	FIL.timeStart = performance.now();

	FIL.xhr.open( 'GET', url, true );
	FIL.xhr.onerror = function( xhr ) { console.log( 'error:', xhr  ); };
	FIL.xhr.onprogress = function( xhr ) { FIL.onProgress( xhr.loaded, FIL.note ); };
	FIL.xhr.onload = function( xhr ) { FIL.displayMarkdown( xhr.target.response ); };
	FIL.xhr.send( null );

};



////////// Handle OS file dialog events

FIL.onInputFileOpen = function( files ) {
	//console.log( 'files', files );

	FIL.timeStart = performance.now();
	FIL.files = files;

	const file = files.files[ 0 ];
	const type = file.type;
	console.log( 'type', type );

	if ( type === "text/xml" ) {

		FIL.fileOpenXml( files );

	} else if ( type === "application/x-zip-compressed" ) {

		FIL.fileOpenZip( files );

	} else {

		FIL.onFileOpenText( files ); // can be markdown

		//console.log( 'not supported', type );

	}

};



FIL.reloadFile = function() {

	FIL.onInputFileOpen( FIL.files );

	//FIL.fileOpenXml( FIL.files );

};



////////// handle OS drag and drop events

FIL.drop = function( event ) {
	//console.log( 'event', event );

	const dropUrl = event.dataTransfer.getData( 'URL' );
	//console.log( 'dropUrl', dropUrl );

	if ( dropUrl ) {

		location.hash = dropUrl;

	} else {
		//console.log( 'event', event.dataTransfer.files[ 0 ] );

		const type = event.dataTransfer.files[ 0 ].type;
		//console.log( 'type', type );

		if ( type === "text/xml" ) {

			FIL.files = event.dataTransfer;

			FIL.fileOpenXml( event.dataTransfer );

		} else if ( type === "application/x-zip-compressed" ) {

			FIL.fileOpenZip( event.dataTransfer );

		} else {

			console.log( 'not supported', type );

		}

	}

	event.preventDefault();

};



//////////

FIL.fileOpenXml = function( files ) {
	//console.log( 'file', files.files[ 0 ] );

	FIL.name = files.files[ 0 ].name;
	FIL.reader.onprogress = function( event ) { FIL.onProgress( event.loaded, FIL.note ); };
	FIL.reader.onload = function( event ) {
		FIL.text = FIL.reader.result;
		FIL.onProgress( event.loaded, "load complete" );
	};
	FIL.reader.readAsText( files.files[ 0 ] );

};



FIL.fileOpenZip = function( files ) {
	//console.log( 'files', files.files[0] );

	const zip = new JSZip();
	const decoder = new TextDecoder( "utf-8" );
	const names = [];

	zip.loadAsync( files.files[ 0 ] )

	.then( zip => {
		//console.log( 'zip', zip );

		zip.forEach( ( relativePath, zipEntry ) => names.push( zipEntry.name ) );
		FIL.name = names[ 0 ];
		console.log( 'FIL.name', FIL.name );

		const arrTemp = zip.files[ FIL.name].async(
			"uint8array",
			metadata => FIL.onProgress( metadata.percent.toFixed(2) + '%', FIL.note )
		);

		return arrTemp;

	}, ( err ) =>  FILdivProgress.innerHTML += err.message )

	.then( ( uint8array ) => {
		//console.log( 'uint8array', uint8array );

		if ( uint8array[ 0 ] !== 255 ||  uint8array[ 0 ] === 239 || uint8array[ 0 ] === 60 ) {

			FIL.text = decoder.decode( uint8array );

		} else {

			let arr = new Uint8Array( uint8array.length / 2 );
			let index = 0;

			for ( let i = 0; i < uint8array.length; i++ ) {

				if ( i % 2 === 0 ) { arr[ index++ ] = uint8array[ i ]; }

			}

			FIL.text = decoder.decode( arr );

		}


		FIL.onProgress( FIL.text.length, "load complete" ); // creates event

		//const event = new Event( 'onXmlFileLoad' );
		//document.body.dispatchEvent( event );

		// document.body.addEventListener( 'onXmlFileLoad', GBXU.setStats, false );

	} );

};


FIL.onFileOpenText = function( files ) {

	FIL.files = files;
	FIL.timeStart = performance.now();

	const file = files.files[ 0 ];
	//console.log( '', file );

	FIL.reader.onload = function( event ) {
		//console.log( 'FIL.reader', FIL.reader );

		FIL.displayMarkdown( FIL.reader.result )

	};

	FIL.reader.readAsText( file );

};



FIL.displayMarkdown = function( markdown ) {
	//console.log( 'Markdown', markdown );

	showdown.setFlavor('github');
	const converter = new showdown.Converter();
	const html = converter.makeHtml( markdown );

	POP.setPopupShowHide( inpOpenFile, html );

};


////////// File Save

// better way than using GBX.text?

FIL.butSaveFile = function() {

	const name = FIL.name.replace( /\.xml/i, "-spifix.xml" );
	const blob = new Blob( [ GBX.text ] );
	let a = document.body.appendChild( document.createElement( 'a' ) );
	a.href = window.URL.createObjectURL( blob );
	a.download = name;
	a.click();
	a = null;

};



FIL.butSaveFileZip = function() {

	const name = FIL.name.replace( /\.xml/i, "-spifix.zip" );
	const zip = new JSZip();

	zip.file( FIL.name, GBX.text );

	zip.generateAsync( { type:"blob", compression: "DEFLATE" } )

	.then( function( blob ) {

		let a = document.body.appendChild( document.createElement( 'a' ) );
		a.href = window.URL.createObjectURL( blob );
		a.download = name;
		a.click();
		a = null;

	});

};



////////// Utilities

FIL.onProgress = function( size = 0, note = '' ) {
	//console.log( 'note', note );

	FILdetFileOpen.open = true;

	//FILdetFileOpen.scrollIntoView();

	const timeToLoad = ( performance.now() - FIL.timeStart ).toLocaleString();

	let htm =
	`
		<div style="padding: 1rem 0;" >
			<div style=padding:0; >File name:</div>
			<div style=color:blue;padding:0; >${ decodeURI( FIL.name ) }</div>
			<div  style=padding:0; >bytes loaded: ${ size.toLocaleString() }</div>
			<div style=padding:0; >time to load: ${ timeToLoad }ms</div>
			${ note }
		</div>
	`;

	FILdivProgress.innerHTML = htm;

	if ( note === "load complete" ){
		//console.log( 'loaded', size );

		const event = new Event( 'onXmlFileLoad' );
		// document.body.addEventListener( 'onXmlFileLoad', setStats, false );
		document.body.dispatchEvent( event );


	}
};



FIL.updateDefaultFilePath = function() {

	location.hash = FILinpFilePath.value;

	const thrFilePath = FILinpFilePath.value;
	localStorage.setItem( 'thrFilePath', thrFilePath );

};
