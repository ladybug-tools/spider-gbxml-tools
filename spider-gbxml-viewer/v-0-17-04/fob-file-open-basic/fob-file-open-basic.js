/* globals JSZip, showdown, divContents, FOBdivFileOpenBasic, FOBinpFilePath, FILdivProgress */
// jshint esversion: 6
/* jshint loopfunc: true */

var FOB = {

	"copyright": "Copyright 2019 pushMe pullYou authors",
	"date": "2019-09-06",
	"helpFile": "https://pushme-pullyou.github.io/tootoo14/js-14-08/fob-file-open-basic/README.md",
	"license": "MIT License",
	"urlSourceCode": "https://github.com/pushme-pullyou/tootoo14/blob/master/js-14-08/fob-file-open-basic/fob-file-open-basic.js",
	"version": "0.14.08-1fob"
};

FOB.urlDefaultFile = "README.md";

FOB.description =
	`
		TooToo File Open Basic (FOB) provides HTML and JavaScript to
		select, open and display local files using the file dialog box, drag and drop or URL.
	`;



FOB.reader = new FileReader();
FOB.xhr = new XMLHttpRequest(); // declare now to load event listeners in other modules

FOB.regexImages = /\.(jpe?g|png|gif|webp|ico|svg|bmp)$/i;
FOB.regexHtml = /\.(htm?l)$/i;

FOB.contentsCss = `box-sizing: border-box; border: 1px solid #888; height: ${ window.innerHeight - 4 }px; margin: 0; padding:0; width:100%;`;


FOB.getMenuFileOpenBasic = function( target = divContents ) {  // called from main HTML file

	window.addEventListener ( 'hashchange', FOB.onHashChange, false );

	FOBdivFileOpenBasic.addEventListener( "dragover", function( event ){ event.preventDefault(); }, true );
	FOBdivFileOpenBasic.addEventListener( 'drop', FOB.onDrop, false );

	FOB.target = target;

	const messages = document.body.querySelector( "#FOBdivMessages" );

	//console.log( '', messages );

	FOB.divMessages = messages;

	if ( FOB.divMessages ) {

		FOB.divMessages.innerHTML =
		`

			<details id=FOBdet open>

				<summary>File statistics</summary>

				<div id=FILdivProgress ></div>

				<div id=FOBdivInfo ></div>

			</details>
		`;

	}

	const htm =
	`
		<details id=FOBdetFileOpen class=detSubMenu open >

			<summary>Open file
				<button id=butFOB class=butHelp onclick="POP.setPopupShowHide(butFOB,FOB.helpFile);" >?</button>
			</summary>

			<div class="dragDropArea" >

				<p>
					<input type=file id=inpOpenFile onchange=FOB.onInputFileOpen(this);  >
				</p>
				<p>
					<button onclick=FOB.reloadFile(); >Reload  previously opened file</button>
				</p>
				<p>
					or drag & drop files here
					or enter a default file path <a class=helpItem href=https://www.ladybug.tools/spider/#pages/file-open.md title="Learn how to speed up your testing" target=-blank >?</a>
					<!--
						try this: https://www.ladybug.tools/spider/gbxml-sample-files/bristol-clifton-downs-broken.xml
					-->
					<input id=FOBinpFilePath onchange=FOB.updateDefaultFilePath(); style=width:95%; title='paste a file path or URL here then press Enter' >
				</p>

			</div>

		</details>
	`;

	return htm;

};



FOB.getMenuFileSaveBasic = function() {

	const htm =
	`
	<details>

		<summary>Save file
			<button id=butFILSave class=butHelp onclick="POP.setPopupShowHide(butFILSave,FOB.helpFile);" >?</button>
		</summary>

		<p>
			<button onclick=FOB.butSaveFile(); >Save file</button>
		</p>
		<p>
			<button onclick=FOB.butSaveFileZip(); >Save file in ZIP</button>
		</p>

	</details>

	`;

	return htm;

};


//////////

FOB.updateDefaultFilePath = function() {

	//location.hash = FOBinpFilePath.value;

	const thrFilePath = FOBinpFilePath.value;
	localStorage.setItem( 'thrFilePath', thrFilePath );

};



//////////

FOB.onHashChange = function() {
	//console.log( 'FOB.urlDefaultFile', FOB.urlDefaultFile );
	//console.log( 'location.hash', location.hash );

	const url = !location.hash ? FOB.urlDefaultFile : location.hash.slice( 1 );

	FOB.requestFileDecider( url );

};



FOB.requestFileDecider = function( url ) { // from a button
	//console.log( 'url', url );

	if ( !url ) { return; }

	FOB.fileName = url.split( '/').pop();

	if ( FOB.regexHtml.test( url ) ) {

		FOB.target.innerHTML = `<iframe src=${ url } style="${ FOB.contentsCss }" ></iframe>`;

	} else if ( FOB.regexImages.test( url )  ) {

		FOB.target.innerHTML = `<img src=${ url } >`;

	} else if ( FOB.fileName.toLowerCase().endsWith( '.zip' )) {

		FOB.xhrRequestFileZip( url, FOB.callbackUrlUtf16 );

	} else { // let

		//FOB.xhr.addEventListener( 'load', FOB.callbackDecider, false );

		FOB.requestFileText( url );

	}

};



FOB.requestFileText = function( url ) {

	if ( !url ) { return; }

	FOB.timeStart = performance.now();

	FOB.xhr.open( 'GET', url, true );
	FOB.xhr.onerror = function( xhr ) { console.log( 'error:', xhr  ); };
	FOB.xhr.onprogress = function( xhr ) { FOB.onProgress( xhr.loaded, FOB.note ); };
	FOB.xhr.onload = function( xhr ) { FOB.onProgress( xhr.loaded ); FOB.callbackDecider( xhr ); };
	FOB.xhr.send( null );

};



//////////

FOB.onInputFileOpen = function( files ) {

	FOB.timeStart = performance.now();
	FOB.files = files;

	const file = files.files[ 0 ];
	//console.log( 'file', file );

	const type = file.type;
	//console.log( 'type', type );

	FOB.fileName = file.name;

	//FOB.reader.addEventListener( 'load', FOB.onReaderResult, false );

	FOB.reader.onprogress = function( event ) { FOB.onProgress( event.loaded ); };

	FOB.reader.onload = function( event ) {
		//console.log( 'FOB.reader', FOB.reader );

		const name = file.name.toLowerCase();

		if ( name.endsWith('.md' ) ) {

			FOB.setTargetWithMarkdownAsHtml( FOB.reader.result );

		} else if ( name.endsWith('.json' ) ) {

			FOB.callbackJson( FOB.reader.result );

		} else if ( FOB.regexImages.test( file.name )  ) {

			FOB.target.innerHTML = `<img src=${ FOB.reader.result } style=width:100%; >`;

		} else if ( FOB.regexHtml.test( file.name ) ) { // html mucks things up

			//FOB.target.innerHTML = `<iframe srcdoc="${ FOB.reader.result }" style=${ FOB.contentsCss } ></iframe>`;

			//FOB.target.innerText = FOB.reader.result;

			FOB.callbackOtherToTextarea( FOB.reader.result );

		} else if ( type === "text/xml" ) {

			FOB.fileOpenXml( FOB.reader.result );

		} else if ( type === "application/x-zip-compressed" ) {

			FOB.fileOpenZip( files );

		} else {

			FOB.callbackOtherToTextarea( FOB.reader.result );

		}

	};

	if ( FOB.regexImages.test( file.name ) ) {

		FOB.reader.readAsDataURL( file );

	} else {

		FOB.reader.readAsText( file );

	}

};



FOB.fileOpenXml = function( text ) {
	//console.log( 'file', files.files[ 0 ] );

		FOB.text = text;

		const eventLoad = new Event( 'FOBonXmlFileLoad' );
		//document.body.addEventListener( 'FOBonXmlFileLoad', () => { console.log( '', 23 ) }, false );

		document.body.dispatchEvent( eventLoad );

};



FOB.reloadFile = function() {

	if ( FOB.files ) {

		FOB.onInputFileOpen( FOB.files );

	} else {

		alert( "First open a file.\nThen come back here to reopen a file with just one click" );

	}

};



//////////

FOB.onDrop = function( event ) {

	console.log( '', event );

	const dropUrl = event.dataTransfer.getData( 'URL' );

	if ( dropUrl ) {

		FOB.requestFileDecider( dropUrl );

	} else {

		FOB.openFile( event.dataTransfer );

	}

	event.preventDefault();

};



FOB.onProgress = function( size = 0, note = '' ) {

	const timeToLoad = ( performance.now() - FOB.timeStart ).toLocaleString();

	FOB.fileInfo =
	`
		<div>
			<div><span class=attributeTitle >Name: <span class=attributeValue >${ FOB.fileName }</span></div>
			<div><span class=attributeTitle >Bytes loaded: </span>: <span class=attributeValue >${ size.toLocaleString() }</span></div>
			<div><span class=attributeTitle >Time to load: </span>: <span class=attributeValue>${ timeToLoad } ms</span></div>
			${ note }
		</div>
	`;

	if ( FOB.divMessages ) { FOBdivInfo.innerHTML = FOB.fileInfo; }

};



//////////

FOB.callbackDecider = function ( xhr ) {
	//console.log( 'xhr', xhr );

	FOB.text = xhr.target.response;

	const ulc = xhr.target.responseURL.toLowerCase();

	if ( ulc.endsWith( '.md' ) ) {

		FOB.setTargetWithMarkdownAsHtml( xhr.target.response );

	} else if ( ulc.endsWith( '.json' ) ) {

		FOB.callbackJson( xhr.target.response );

	} else if ( ulc.endsWith( '.xml' ) ) {

		FOB.callbackXml( xhr.target.response );

	} else {

		FOB.callbackOtherToTextarea( xhr.target.response );

	}

};



FOB.callbackXml = function( text ) {

	FOB.onProgress( text.length, "load complete" );

	FOB.text = text;

	const eventLoad = new Event( 'FOBonXmlFileLoad' );
	//document.body.addEventListener( 'FOBonXmlFileLoad', () => { console.log( '', 23 ) }, false );

	document.body.dispatchEvent( eventLoad );


};



FOB.callbackJson = function( text ) {

	//const data = obj.target ? obj.target.response : obj;

	//FOB.target.innerHTML = html;
	//window.scrollTo( 0, 0 );

	FOB.onProgress( text.length, "load complete" );

	FOB.text = text;

	const eventLoad = new Event( 'FOBonJsonFileLoad' );

	// document.body.addEventListener( 'FOBonJsonFileLoad', () => {
	// 	console.log( 'loaded', FOB.fileName )
	// 	FOB.target.innerHTML = `<div style="${ FOB.contentsCss }" >${ text }</div>`;
	// }, false );

	document.body.dispatchEvent( eventLoad );

};



FOB.callbackOtherToTextarea = function( text ){

	FOB.target.innerHTML = `<textarea style="${ FOB.contentsCss }" >${ text }</textarea>`;

};



FOB.setTargetWithMarkdownAsHtml = function( markdown ) {

	showdown.setFlavor('github');
	const converter = new showdown.Converter();
	const html = converter.makeHtml( markdown );

	FOB.target.innerHTML = html;
	window.scrollTo( 0, 0 );

};



//////////

FOB.xhrRequestFileZip = function( url ) {
	//console.log( 'url', url );

	FOB.timeStart = performance.now();

	const xhr = new XMLHttpRequest();
	xhr.responseType = 'blob';
	xhr.open( 'GET', url, true );
	xhr.onerror = function( xhr ) { console.log( 'error:', xhr ); };
	xhr.onprogress = function( xhr ) { FOB.onProgress( xhr.loaded, FOB.note ); };
	xhr.onload = FOB.callbackUrlUtf16;
	xhr.send( null );

};



FOB.callbackUrlUtf16 = function( xhr ) {

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

		FOB.fileName = names[ 0 ];

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

		function success( text ) {

			FOB.text = text;
			//console.log( '', FOB.text );

			const event = new Event( 'FOBonZipFileLoad' );

			// document.body.addEventListener( 'FOBonZipFileLoad', () => {
			// 	console.log( 'loaded', FOB.fileName )
			// 	FOB.target.innerHTML = `<div style="${ FOB.contentsCss }" >${ FOB.text }</div>`;
			// }, false );

			document.body.dispatchEvent( event );

			FOB.onProgress( text.length, "load complete" );

		},

		function error( e ) { FOB.divMessages.append( `error ${ e } ` ); }

	);

};



FOB.fileOpenZip = function( files ) {
	//console.log( 'files', files.files[0] );

	const zip = new JSZip();
	const decoder = new TextDecoder( "utf-8" );
	const names = [];

	zip.loadAsync( files.files[ 0 ] )

	.then( zip => {
		//console.log( 'zip', zip );

		zip.forEach( ( relativePath, zipEntry ) => names.push( zipEntry.name ) );
		FOB.fileName = names[ 0 ];
		//console.log( 'FOB.fileName', FOB.fileName );

		const arrTemp = zip.files[ FOB.fileName].async(
			"uint8array",
			metadata => FOB.onProgress( metadata.percent.toFixed(2) + '%', FOB.note )
		);

		return arrTemp;

	}, ( err ) =>  FILdivProgress.innerHTML += err.message )

	.then( ( uint8array ) => {
		//console.log( 'uint8array', uint8array );

		if ( uint8array[ 0 ] !== 255 ||  uint8array[ 0 ] === 239 || uint8array[ 0 ] === 60 ) {

			FOB.text = decoder.decode( uint8array );

		} else {

			let arr = new Uint8Array( uint8array.length / 2 );
			let index = 0;

			for ( let i = 0; i < uint8array.length; i++ ) {

				if ( i % 2 === 0 ) { arr[ index++ ] = uint8array[ i ]; }

			}

			FOB.text = decoder.decode( arr );

		}


		FOB.onProgress( FOB.text.length, "load complete" ); // creates event

		const event = new Event( 'FOBonZipFileLoad' );

		//document.body.addEventListener( 'FOBonZipFileLoad', FOB.onFileZipLoad, false );

		// document.body.addEventListener( 'FOBonZipFileLoad', () => {
		// 	console.log( 'loaded', FOB.fileName )
		// 	FOB.target.innerHTML = `<div style="${ FOB.contentsCss }" >${ FOB.text }</div>`;
		// }, false );

		document.body.dispatchEvent( event );

	} );

};



FOB.onFileZipLoad = function() {

	console.log( 'bytes', FOB.text.length );

};


////////// File Save

// better way than using text?

FOB.butSaveFile = function( text ) {

	//console.log( 'FOB.fileName', FOB.fileName );

	const name = FOB.fileName ? FOB.fileName : "test.txt" ;

	FOB.text = FOB.text || "Hello, World!";

	const blob = new Blob( [ FOB.text ] );
	let a = document.body.appendChild( document.createElement( 'a' ) );
	a.href = window.URL.createObjectURL( blob );
	a.download = name;
	a.click();
	a = null;

};



FOB.butSaveFileZip = function() {

	let name = FOB.fileName ? FOB.fileName.replace( /\.xml/i, ".zip" ) : "test.zip";

	const zip = new JSZip();

	zip.file( FOB.fileName, GBX.text );

	zip.generateAsync( { type:"blob", compression: "DEFLATE" } )

	.then( function( blob ) {

		let a = document.body.appendChild( document.createElement( 'a' ) );
		a.href = window.URL.createObjectURL( blob );
		a.download = name;
		a.click();
		a = null;

	});

};
