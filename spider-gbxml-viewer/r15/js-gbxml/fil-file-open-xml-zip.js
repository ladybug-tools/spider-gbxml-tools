// Copyright 2018 Ladybug Tools authors. MIT License
// jshint esversion: 6
/* globals GBX, JSZip */


const FIL = { "release": "r15.1", "date": "2019-02-28" };


FIL.reader = new FileReader();
FIL.xhr = new XMLHttpRequest(); // declare now to load event listeners in other modules

FIL.note = `<p>With large files, after loading, there is a pause of some seconds where nothing happens.</p>`;


FIL.currentStatus =
	`
		<h3>FIL ${ FIL.release } status ${ FIL.date }</h3>

		<p>File opening and saving of gbXML and ZIP files is generally working well and open for testing.</p>

		<p>
			Change log
			<ul>
				<li>2019-02-28 ~ Add close menu panels on open</li>
				<li>2019-02-24 ~ Update source and file-open.md links</li>
				<li>2018-12-29 ~ Add helpItem class</li>
				<li>2018-12-29 ~ Fix read me links</li>
				<li>2018-12-28 ~ Add pop-up status / Edit left menu</li>
				<li>2018-12-14 ~ Many internal fixes and code cleanups</li>
			</ul>
		</p>

		<p>
			<a href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/r15/js-gbxml/fil-file-open-xml-zip.js" target="_blank">
			fil-open-file.js source code</a>
		</p>
	`;



FIL.getMenuFileOpen = function() {  // called from main HTML file

	FIL.timeStart = performance.now();

	window.addEventListener ( 'hashchange', FIL.onHashChange, false );

	FILdivFileOpen.addEventListener( "dragover", function( event ){ event.preventDefault(); }, true );

	FILdivFileOpen.addEventListener( 'drop', FIL.drop, false );

	// see also event listener in: gbx-gbxml-text-parser.js


	const htm =
	`
		<details id=FILdetFileOpen >

			<summary>Open gbXML or ZIP file
				<a id=filSum class=helpItem href="JavaScript:MNU.setPopupShowHide(filSum,FIL.currentStatus);" >&nbsp; ? &nbsp;</a>
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

			<details id=GBXdetStats >

				<summary>gbXML parser statistics
					<a id=gbxSum class=helpItem href="JavaScript:MNU.setPopupShowHide(gbxSum,GBX.currentStatus);" >&nbsp; ? &nbsp;</a>
				</summary>

				<div id="GBXdivStatsGbx" ></div>

				<div id="GBXdivStatsThr" ></div>

				<hr>

			</details>

		</details>
	`;

	return htm;

};



FIL.getMenuFileSave = function() {


	htm =
	`
	<details>

		<summary>Save file
			<a id=filSav class=helpItem href="JavaScript:MNU.setPopupShowHide(filSav,FIL.currentStatus);" >&nbsp; ? &nbsp;</a>
		</summary>

		<div id = "divSaveFile" >

			<p>
				<button onclick=FIL.butSaveFile(); >Save file as gbXML</button>
			</p>
			<p>
				<button onclick=FIL.butSaveFileZip(); >Save file as gbXML in ZIP</button>
			</p>

			<hr>

		</div>

	</details>

	`;

	return htm;

}



FIL.onHashChange = function() {

	const url = !location.hash ? FIL.urlDefaultFile : location.hash.slice( 1 );
	//console.log( 'url', url );

	GBXdivStatsGbx.innerHTML = '';
	GBXdivStatsThr.innerHTML = '';

	detMenuEdit.open = false;
	detMenuView.open = false;
	detSectionCut.open = false;
	detSettings.open = false;
	detMenuHelp.open = false;

	FIL.name = url.split( '/').pop();

	if ( FIL.name.toLowerCase().endsWith( '.xml' ) ) {

		FIL.XhrRequestFileXml( url );

	} else if ( FIL.name.toLowerCase().endsWith( '.zip' )) {

		FIL.XhrRequestFileZip( url, FIL.callbackUrlUtf16 );

	} else 	if ( FIL.name.toLowerCase().endsWith( '.md' ) ) {

		FIL.XhrRequestFileXml( url );

	} else {

		console.log( 'oops', url );

	}

};



FIL.XhrRequestFileXml = function( url ) {

	FIL.timeStart = performance.now();

	//FIL.xhr = new XMLHttpRequest();
	FIL.xhr.open( 'GET', url, true );
	FIL.xhr.onerror = function( xhr ) { console.log( 'error:', xhr  ); };
	FIL.xhr.onprogress = function( xhr ) { FIL.onProgress( xhr.loaded, FIL.note ); };
	FIL.xhr.onload = function( xhr ) { FIL.onProgress( xhr.loaded ); };
	FIL.xhr.send( null );

};



FIL.XhrRequestFileZip = function( url ) {

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

		// Read from the zip file!
		const uint8array = zip.file( names[ 0 ] ).async( "uint8array" );

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

			const event = new Event( 'onZipFileParse' );
			document.body.dispatchEvent( event );

			FIL.onProgress( text.length );

		},

		function error( e ) { FILdivProgress.append( `error ${ e } ` ); }

	);

};



////////// Handle OS file dialog events

FIL.onInputFileOpen = function( files ) {
	//console.log( 'files', files );

	FIL.files = files;
	FIL.timeStart = performance.now();

	GBXdivStatsGbx.innerHTML = '';
	GBXdivStatsThr.innerHTML = '';

	detMenuEdit.open = false;
	detMenuView.open = false;
	detSectionCut.open = false;
	detSettings.open = false;
	detMenuHelp.open = false;

	const file = files.files[ 0 ];

	const type = file.type;
	console.log( 'type', type );

	if ( type === "text/xml" ) {

		FIL.fileOpenXml( files );

	} else if ( type === "application/x-zip-compressed" ) {

		FIL.fileOpenZip( files );

	} else {

		FIL.onFileOpenText( files );

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


	GBXdivStatsGbx.innerHTML = '';
	GBXdivStatsThr.innerHTML = '';

	detMenuEdit.open = false;
	detMenuView.open = false;
	detSectionCut.open = false;
	detSettings.open = false;
	detMenuHelp.open = false;

	if ( dropUrl ) {

		location.hash = dropUrl;

	} else {
		//console.log( 'event', event.dataTransfer.files[ 0 ] );

		const type = event.dataTransfer.files[ 0 ].type;
		console.log( 'type', type );

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
	FIL.reader.onload = function( event ) { FIL.onProgress( event.loaded ); };
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

		FIL.onProgress( FIL.text.length );

		const event = new Event( 'onZipFileParse' );
		document.body.dispatchEvent( event );

		// document.body.addEventListener( 'onGbxParse', GBXU.setStats, false );

	} );

};



FIL.onFileOpenText = function( files ) {
	//console.log( 'files', files );

	FIL.files = files;
	FIL.timeStart = performance.now();

	const file = files.files[ 0 ];
	console.log( 'file', file );

	FIL.reader.onload = function( event ) {
		console.log( 'FIL.reader', FIL.reader );

		const name = file.name.toLowerCase();
		console.log( 'name', name );
		if ( name.endsWith('.md' ) ) {

			FIL.callbackMarkdown( FIL.reader.result );

		} else {



		}

	}
	FIL.reader.readAsText( file );
};

FIL.callbackMarkdown = function( text ) {

	showdown.setFlavor('github');
	//const converter = new showdown.Converter();
	//const html = converter.makeHtml( xhr.target.response );

	MNU.setPopupShowHide( text );

};

////////// File Save

// better way than using GBX.text?

FIL.butSaveFile = function() {

	//const lines = GBX.text.split(/\r\n|\n/);
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

};



////////// Utilities

FIL.onProgress = function( size = 0, note = '' ) {

	FILdetFileOpen.open = true;

	FILdetFileOpen.scrollIntoView();

	const timeToLoad = ( performance.now() - FIL.timeStart ).toLocaleString();

	let htm =
	`
		<div style="padding: 1rem 0;" >
			<div style=padding:0; >File name:</div>
			<div style=color:blue;padding:0; >${ FIL.name }</div>
			<div  style=padding:0; >bytes loaded: ${ size.toLocaleString() }</div>
			<div style=padding:0; >time to load: ${ timeToLoad }ms</div>
			${ note }
		</div>
	`;

	FILdivProgress.innerHTML = htm;

};



FIL.updateDefaultFilePath = function() {

	location.hash = FILinpFilePath.value;

	const thrFilePath = FILinpFilePath.value;
	localStorage.setItem( 'thrFilePath', thrFilePath );

};
