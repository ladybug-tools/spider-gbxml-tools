// Copyright 2019 pushMe pullYou authors. MIT License
// jshint esversion: 6
/* globals navMenu, showdown, divContents, FOBsecFileOpenBasic */

const FOB = { "release": "R13.1", "date": "2019-01-04" };

FOB.currentStatus =
	`
		<h3>FOB ${ FOB.release} status ${ FOB.date }</h3>

		<p>File Open Basic (FOB)</p>

		<p>Lists files and folders in a repo in a menu</p>
	`;


FOB.reader = new FileReader();
FOB.xhr = new XMLHttpRequest(); // declare now to load event listeners in other modules
FOB.regexImages = /\.(jpe?g|png|gif|webp|ico|svg|bmp)$/i;
FOB.regexHtml = /\.(htm?l)$/i;
FOB.contentsCss = `box-sizing: border-box; border: 1px solid #888; height: ${ window.innerHeight - 4 }px; margin: 0; padding:0; width:100%;`;



FOB.getMenuFileOpenBasic = function( target = divContents ) {  // called from main HTML file

	FOB.target = target;

	FOBsecFileOpenBasic.addEventListener( "dragover", function( event ){ event.preventDefault(); }, true );
	FOBsecFileOpenBasic.addEventListener( 'drop', FOB.drop, false );

	const htm =
	`
		<details id=FOBdetFileOpen open >

			<summary>Open file
				<a id=filSum class=helpItem href="JavaScript:MNU.setPopupShowHide(filSum,FOB.currentStatus);" >&nbsp; ? &nbsp;</a>
			</summary>

			<div class="dragDropArea" >

				<p>
					<input type=file id=inpOpenFile onchange=FOB.openFile(this);  >
					or drag & drop files here
				</p>

			</div>

			<p id=FOBdivProgress ></p>

		</details>
	`;

	return htm;

};



FOB.requestFile = function( url ) { // from a button
	//console.log( 'url', url );

	if ( FOB.regexHtml.test( url ) ) {

		FOB.target.innerHTML = `<iframe src=${ url } style="${ FOB.contentsCss }" ></iframe>`;

	} else if ( FOB.regexImages.test( url )  ) {

		FOB.target.innerHTML = `<img src=${ url } >`;

	} else {

		FOB.xhr.open( 'GET', url, true );
		FOB.xhr.onerror = function( xhr ) { console.log( 'error:', xhr  ); };
		//xhr.onprogress = function( xhr ) { console.log(  'bytes loaded: ' + xhr.loaded.toLocaleString() ) }; /// or something
		FOB.xhr.onload = FOB.callbackDecider;
		FOB.xhr.send( null );

	}

};



FOB.openFile = function( files ) {

	const file = files.files[ 0 ];

	FOB.reader.onload = function( event ) {
		//console.log( 'FOB.reader', FOB.reader );

		const name = file.name.toLowerCase();

		if ( name.endsWith('.md' ) ) {

			FOB.callbackMarkdown( FOB.reader.result );

		} else if ( FOB.regexImages.test( file.name )  ) {

			FOB.target.innerHTML = `<img src=${ FOB.reader.result } >`;

		//} else if ( FOB.regexHtml.test( url ) ) { // html mucks things up

			//FOB.target.innerHTML = `<iframe srcdoc="${ FOB.reader.result }" style=${ FOB.contentsCss } ></iframe>`;

		} else {

			FOB.callbackOtherToTextarea( FOB.reader.result );

		}

	};

	if ( FOB.regexImages.test( file.name ) ) {

		FOB.reader.readAsDataURL( file );

	} else {

		FOB.reader.readAsText( file );

	}

		//function onRequestFileProgress( event ) {

			//divLog.innerHTML =
			//	fileAttributes.name + ' bytes loaded: ' + event.loaded.toLocaleString() +
			//	//( event.lengthComputable ? ' of ' + event.total.toLocaleString() : '' ) +
			//'';

		//}

};



FOB.onDrop = function( event ) {

	const dropUrl = event.dataTransfer.getData( 'URL' );

	if ( dropUrl ) {

		FOB.requestFile( dropUrl );

	} else {

		FOB.openFile( event.dataTransfer );

	}

	event.preventDefault();

};



//////////

FOB.callbackDecider = function ( xhr ) {
	//console.log( 'xhr', xhr );

	const ulc = xhr.target.responseURL.toLowerCase();

	if ( ulc.endsWith( '.md' ) ) {

		FOB.callbackMarkdown( xhr.target.response );

	} else {

		FOB.callbackOtherToTextarea( xhr.target.response );

	}

};



FOB.callbackMarkdown = function( markdown ) {

	showdown.setFlavor('github');
	const converter = new showdown.Converter();
	const html = converter.makeHtml( markdown );

	FOB.target.innerHTML = html;
	window.scrollTo( 0, 0 );

};



FOB.callbackOtherToTextarea = function( text ){

	FOB.target.innerHTML = `<textarea style="${ FOB.contentsCss }" >${ text }</textarea>`;

};
