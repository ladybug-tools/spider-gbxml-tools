// Copyright 2019 pushMe-pulYou authors. MIT License
// jshint esversion: 6
/* globals GBX, JSZip */


const FIL = { "release": "r11.0", "date": "2019-01-01" };



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
				<li>2018-12-29 ~ Add helpItem class</li>
				<li>2018-12-29 ~ Fix read me links</li>
				<li>2018-12-28 ~ Add pop-up status / Edit left menu</li>
				<li>2018-12-14 ~ Many internal fixes and code cleanups</li>
			</ul>
		</p>

		<p>
			<a href="https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/sandbox/spider-gbxml-text-parser/r10/cookbook/spider-gbxml-file-open/" target="_blank">
			fil-open-file.js Read Me</a>
		</p>
	`;



FIL.getMenuFileOpen = function( target = divContents ) {  // called from main HTML file

	FIL.target = target;

	FIL.timeStart = performance.now();

	//window.addEventListener ( 'hashchange', FIL.onHashChange, false );

	FILdivFileOpen.addEventListener( "dragover", function( event ){ event.preventDefault(); }, true );

	FILdivFileOpen.addEventListener( 'drop', FIL.drop, false );

	// see also event listener in: gbx-gbxml-text-parser.js

	// input: accept=".xml, .zip" ??

	const htm =
	`
		<details id=FILdetFileOpen open >

			<summary>Open file
				<a id=filSum class=helpItem href="JavaScript:MNU.setPopupShowHide(filSum,FIL.currentStatus);" >&nbsp; ? &nbsp;</a>
			</summary>

			<div class="dragDropArea" >

				<p>
					<input type=file id=inpOpenFile onchange=FIL.openFile(this);  >
					or drag & drop files here
				</p>

			</div>

			<p id=FILdivProgress ></p>

		</details>
	`;

	return htm;

};



FIL.requestFile = function( url, callback ) {

	const xhr = new XMLHttpRequest();
	xhr.crossOrigin = 'anonymous';
	xhr.open( 'GET', url, true );
	xhr.onerror = function( xhr ) { console.log( 'error:', xhr  ); };
	//xhr.onprogress = function( xhr ) { console.log(  'bytes loaded: ' + xhr.loaded.toLocaleString() ) }; /// or something
	xhr.onload = callback;
	xhr.send( null );

};



FIL.callbackMarkdown = function( xhr ){

	showdown.setFlavor('github');
	const converter = new showdown.Converter();
	const response = xhr.target.response;
	const html = converter.makeHtml( response );

	FIL.target.style.maxWidth = '50rem;';
	FIL.target.innerHTML = html;
	window.scrollTo( 0, 0 );

};



FIL.callbackToTextarea = function( xhr ){

	const response = xhr.target.response;

	FIL.target.innerHTML = `<textarea style=height:100%;width:100%; >${ response }</textarea>`;

};



FIL.onDrop = function( event ) {

	//console.log( 'event', event );

	const dropUrl = event.dataTransfer.getData( 'URL' );

	if ( dropUrl ) {

		location.hash = dropUrl;
		FIL.requestFile( dropUrl, callback )

	} else {

		//var file = event.dataTransfer.files[0];
		//console.log(file.name);

		FIL.openFile( event.dataTransfer );
		//console.log( 'ed', event.dataTransfer );

	}

	event.preventDefault();

};



FIL.openFile = function( files ) {

	file = files.files[ 0 ];

	FIL.reader.onprogress = FIL.onProgress;
	//const FIL.reader = new FileFIL.Reader();

	FIL.reader.onload = function( event ) {

		//console.log( 'FIL.reader', FIL.reader );

		if ( file.name.endsWith('.md' ) ) {

			showdown.setFlavor('github');
			const converter = new showdown.Converter();
			const html = converter.makeHtml( FIL.reader.result );

			FIL.target.style.maxWidth = '50rem;';
			//FIL.target.style.overflow = '';
			FIL.target.innerHTML = html;
			window.scrollTo( 0, 0 );

		} else if ( /\.(jpe?g|png|ico|svg|gif)$/i.test( file.name)  ) {

			FIL.target.innerHTML = `<img src=${ FIL.reader.result } >`;

		} else {

			FIL.target.innerHTML = `<textarea style=height:100%;width:100%; >${ FIL.reader.result }</textarea>`;

		}


	};

	if ( /\.(jpe?g|png|ico|svg|gif)$/i.test(file.name) ) {

		FIL.reader.readAsDataURL(file);

	} else {

		FIL.reader.readAsText( file );

	}


		function onRequestFileProgress( event ) {

			divLog.innerHTML =
				fileAttributes.name + ' bytes loaded: ' + event.loaded.toLocaleString() +
				//( event.lengthComputable ? ' of ' + event.total.toLocaleString() : '' ) +
			'';

		}

};

////////// Utilities

FIL.onProgress = function( size = 0, note = '' ) {

	FILdetFileOpen.open = true;

	FILdetFileOpen.scrollIntoViewIfNeeded();

	const timeToLoad = ( performance.now() - FIL.timeStart ).toLocaleString();

	let htm =
	`
		<div style=margin:1rem; >
			<div>File name:</div>
			<div style=color:blue; >${ FIL.name }</div>
			<div>bytes loaded: ${ size.toLocaleString() }</div>
			<div>time to load: ${ timeToLoad }ms</div>
			${ note }
		</div>
	`;

	FILdivProgress.innerHTML = htm;

};


