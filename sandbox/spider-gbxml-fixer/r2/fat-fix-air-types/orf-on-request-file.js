// Copyright 2019 pushMe pullYou authors. MIT License
/* globals navMenu, showdown, divContents, OFRsecFileOpenBasic */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const OFR = { "release": "R13.0", "date": "2019-04-04" };

OFR.description =
	`
		TooToo On File Request (OFR) provides HTML and JavaScript to
		select, open and display local files using the file dialog box, drag and drop or URL.
	`;

OFR.currentStatus =
	`
		<h3>On File Request (OFR) ${ OFR.release} - ${ OFR.date }</h3>

		<p>
			${ OFR.description }
		</p>
		<p>
			Concept
			<ul>
				<li>Creates the HTML for the user interface</li>
				<li>Opens local files with JavaScript FileReader() or XMLHttpRequest() objects</li>
				<li>Converts Markdown to HTML</li>
				<li>Provides default current status text template</li>
				<li></li>
				<!-- <li></li> -->
			</ul>
		</p>
		<p>
			<a href="https://github.com/pushme-pullyou/tootoo13/tree/master/cookbook/fob-file-open-basic/" target="_blank" >
				TooToo File Open Basic (OFR) Read Me
			</a>
		</p>
		<p>
			Change log
			<ul>
				<li>2019-02-07 ~ Simplify: remove content editable / save file - will re-add elsewhere</li>
				<li>2019-01-15 ~ Add OFR.description variable and text</li>
				<li>2019-01-15 ~ Add display OFR.description in pop-up and in test file</li>
				<li>2019-01-14 ~ Add text here and there</li>
				<li>2019-01-13 ~ Add link to status</li>
				<li>2019-01-12 ~ Add cookbook HTML test script and read me file</li>
				<!-- <li></li>
				-->
			</ul>
		</p>
	`;


OFR.reader = new FileReader();
OFR.xhr = new XMLHttpRequest(); // declare now to load event listeners in other modules
OFR.regexImages = /\.(jpe?g|png|gif|webp|ico|svg|bmp)$/i;
OFR.regexHtml = /\.(htm?l)$/i;
OFR.regexXml = /\.(xml)$/i;
OFR.regexZip = /\.(zip)$/i;

OFR.contentsCss = `box-sizing: border-box; border: 1px solid #888; height: ${ window.innerHeight - 4 }px; margin: 0; padding:0; width:100%;`;


//////////

OFR.getMenuFileOpenBasic = function( target = divContents ) {  // called from main HTML file

	OFR.target = target;

	OFRsecFileOpenBasic.addEventListener( "dragover", function( event ){ event.preventDefault(); }, true );
	OFRsecFileOpenBasic.addEventListener( 'drop', OFR.drop, false );

	const htm =
	`
		<details id=OFRdetFileOpen class=detSubMenu open >

			<summary class=sumHeader >Open file
				<a id=filSum class=helpItem href="JavaScript:MNU.setPopupShowHide(filSum,OFR.currentStatus);" >&nbsp; ? &nbsp;</a>
			</summary>

			<div class="dragDropArea" >

				<p>
					<input type=file id=inpOpenFile onchange=OFR.onLoadReader(this);  >
					or drag & drop files here
				</p>

			</div>

			<p id=OFRdivProgress ></p>

		</details>
	`;

	return htm;

};



OFR.onRequestFile = function( url ) { // from a button
	//console.log( 'url', url );

	OFR.url = url;

	const name = url.split( '/').pop();

	//if ( OFR.regexHtml.test( url ) ) {

	if ( name.match( OFR.regexHtml ) ) {

		OFR.target.innerHTML = `<iframe src=${ url } style="${ OFR.contentsCss }" ></iframe>`;

	//} else if ( OFR.regexImages.test( url )  ) {

	} else if ( name.match( OFR.regexImages ) ) {

		OFR.target.innerHTML = `<img src=${ url } >`;

 	/* } else if ( name.match( OFR.regexXml ) ) {

		let event = new Event( "onRequestXml", {"bubbles": true, "cancelable": false, detail: true } );

		//	window.addEventListener( "bingo", addAvatar );
		//	window.addEventListener( "bingo", addControls, false );

		window.dispatchEvent( event ); */

	} else if ( name.match( OFR.regexZip ) ) {

		let event = new Event( "onRequestZip", {"bubbles": true, "cancelable": false, detail: true } );

		window.dispatchEvent( event );

	} else { // assume text or markdown file

		OFR.requestFile( url );

	}

};



OFR.onLoadReader = function( files ) {

	const file = files.files[ 0 ];

	OFR.reader.onload = function( event ) {
		//console.log( 'OFR.reader', OFR.reader );

		const name = file.name.toLowerCase();

		if ( name.endsWith( '.md' ) ) {

			OFR.callbackMarkdown( OFR.reader.result );

		} else if ( OFR.regexImages.test( file.name )  ) {

			OFR.target.innerHTML = `<img src=${ OFR.reader.result } >`;

		} else if ( OFR.regexHtml.test( file.name ) ) { // html mucks things up

			OFR.target.innerHTML = `<iframe srcdoc="${ OFR.reader.result }" style="${ OFR.contentsCss }" ></iframe>`;


		} else if ( OFR.regexXml.test( file.name )  ) {

			OFR.name = name;
			OFR.callbackXml( OFR.reader.result );

		} else {

			OFR.callbackOtherToTextarea( OFR.reader.result );

		}

	};

	if ( OFR.regexImages.test( file.name ) ) {

		OFR.reader.readAsDataURL( file );

	} else {

		OFR.reader.readAsText( file );

	}

		//function onRequestFileProgress( event ) {

			//divLog.innerHTML =
			//	fileAttributes.name + ' bytes loaded: ' + event.loaded.toLocaleString() +
			//	//( event.lengthComputable ? ' of ' + event.total.toLocaleString() : '' ) +
			//'';

		//}

};



OFR.onDrop = function( event ) {

	const dropUrl = event.dataTransfer.getData( 'URL' );

	if ( dropUrl ) {

		OFR.onRequestFile( dropUrl );

	} else {

		OFR.onLoadReader( event.dataTransfer );

	}

	event.preventDefault();

};



//////////

OFR.requestFile = function( url ) {

	OFR.name = url.split( '/').pop();

	OFR.timeStart = performance.now();

	OFR.xhr = new XMLHttpRequest();
	OFR.xhr.open( 'GET', url, true );
	OFR.xhr.onerror = function( xhr ) { console.log( 'error:', xhr  ); };
	OFR.xhr.onprogress = function( xhr ) { OFR.onProgress( xhr.loaded, OFR.note ); };
//	OFR.xhr.onload = function( xhr ) { OFR.text = xhr.target.response; OFR.onProgress( xhr.loaded, "loaded" ); };
	OFR.xhr.onload = OFR.callbackDecider;

	OFR.xhr.send( null );

};



////////// Utilities

OFR.onProgress = function( size = 0, note = '' ) {

	//console.log( 'note', note );
	OFRdetFileOpen.open = true;

	OFRdetFileOpen.scrollIntoView();

	const timeToLoad = ( performance.now() - OFR.timeStart ).toLocaleString();

	let htm =
	`
		<div style="padding: 1rem 0;" >
			<div style=padding:0; >File name:</div>
			<div style=color:blue;padding:0; >${ decodeURI( OFR.name ) }</div>
			<div  style=padding:0; >bytes loaded: ${ size.toLocaleString() }</div>
			<div style=padding:0; >time to load: ${ timeToLoad }ms</div>
			${ note }
		</div>
	`;

	OFRdivProgress.innerHTML = htm;

	if ( note === "loaded" ){

		console.log( 'loaded', size );

		const event = new Event( 'onXmlFileLoad' );
		document.body.dispatchEvent( event );

		// document.body.addEventListener( 'onXmlFileLoad', setStats, false );

	}
};


//////////

OFR.callbackDecider = function ( xhr ) {
	//console.log( 'xhr', xhr );

	OFR.onProgress( xhr.loaded, "loaded" );

	OFR.text = xhr.target.response;

	const ulc = xhr.target.responseURL.toLowerCase();

	if ( ulc.endsWith( '.md' ) ) {

		OFR.callbackMarkdown( xhr.target.response );

	} else if ( ulc.endsWith( '.xml' ) ) {

		OFR.callbackXml( OFR.text );

	} else {

		OFR.callbackOtherToTextarea( xhr.target.response );

	}

};



OFR.callbackXml = function( text ) {

	GGD.getData( text );

	htm1 = GGD.getGbxmlData( OFR.text );

	htm2 = FAT.getSurfaceTypeInvalid();

	divContents.innerHTML =
	`
	<br><br>

	<h2 id=SGFh1FileName >Check file: ${ decodeURI( OFR.name ) } </h2>

	<p>
		<button onclick=SGF.runAll(); >Run all checks</button>

		<button onclick=SGF.closeAll(); >Close all checks</button>
	</p>

	<p>
		<input type=checkbox id=SGFinpIgnoreAirSurfaceType > Ignore Air surface type
	</p>
	` + htm1 + htm2;

};



OFR.callbackMarkdown = function( markdown ) {

	showdown.setFlavor('github');
	const converter = new showdown.Converter();
	const html = converter.makeHtml( markdown );

	OFR.target.innerHTML = html;
	window.scrollTo( 0, 0 );

};



OFR.callbackOtherToTextarea = function( text ){

	OFR.target.innerHTML = `<textarea style="${ OFR.contentsCss }" >${ text }</textarea>`;

};
