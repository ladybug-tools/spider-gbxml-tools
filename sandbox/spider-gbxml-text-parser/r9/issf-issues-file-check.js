// Copyright 2018 Ladybug Tools authors. MIT License
/* globals */
/* jshint esversion: 6 */

const ISSF = { "release": "R9.0", "date": "2018-11-19" };




ISSF.getMenuFileCheck= function() {

	const htm =

	`<details>

		<summary>File Check</summary>

		<p>
			<i>
				Identify  problems with the XML file.
				File Check ${ ISSF.release }.
			</i>
		</p>

		<div id="divFileCheckOpen" class="dragDropArea" >

			<p id=pFileOpen>

				Open gbXML files:
				<input type=file id=inpOpenFile onchange=ISSF.inpOpenFiles(this); accept=".xml" >

			</p>

		</div>

		<br>

		<div id=ISSFdivFileInfo ></div>

		<hr>

	</details>`;

	return htm;

};



ISSF.inpOpenFiles = function( files ) {

	//console.log( 'file', files.files[ 0 ] );

	ISSF.timeStart = performance.now();

	THRU.setSceneDispose( [ GBX.surfaceMeshes, GBX.surfaceEdges, GBX.surfaceOpenings, GBX.helperNormalsFaces ] );

	ISSF.fileAttributes = files.files[ 0 ];

	const reader = new FileReader();

	reader.onprogress = onRequestFileProgress;

	reader.onload = function( event ) {

		ISSF.timeToLoad = performance.now() - ISSF.timeStart;

		ISSFdivFileInfo.innerHTML =
		`
			<div>${ ISSF.fileAttributes.name }</div>
			<div>bytes loaded: ${event.loaded.toLocaleString()}</div>
			<div>time to load: ${ parseInt( ISSF.timeToLoad, 10 ).toLocaleString() } ms</div>

		`;

		//ISSF.parseFile( reader.result );

		ISSF.timeStart2 = performance.now();
		ISSFdivFileInfo.innerHTML += ISSF.getGeneralCheck( reader.result );

	};

	reader.readAsText( files.files[ 0 ] );

		function onRequestFileProgress( event ) {

			ISSF.timeToLoad = performance.now() - ISSF.timeStart;

			ISSFdivFileInfo.innerHTML =
			`
				<div>${ ISSF.fileAttributes.name }</div>
				<div>bytes loaded: ${event.loaded.toLocaleString()}</div>
				<div>time to load: ${ parseInt( ISSF.timeToLoad, 10 ).toLocaleString() } ms</div>
			`;

		}

};



ISSF.getGeneralCheck = function( text ) {

	let htm = '';

	ISSF.lines = ( text.split( /\r\n|\n/ ) ).map( line => line.toLowerCase() );

	//console.log( 'ISSF.lines', ISSF.lines );

	if ( ISSF.lines[ 0 ].includes( 'utf-16' ) ) {

		htm += `line 0: ${ ISSF.lines[ 0 ] }\n`;

	}

	for ( i = 0; i < ISSF.lines.length; i++ ) {

		line = ISSF.lines[ i ];

		if ( line.includes( '<area>0</area>') ) {

			htm += `line ${i}: ${line}\n`;

		}

		if( line.includes( '<volume>0</volume>') ) {

			htm += `line ${i}: ${line}\n`;

		}

		if ( line.includes( '""') ) {

			htm += `Empty string at line ${i}: ${line}\n`;

		}


	}

	if ( ISSF.errorsFound ) {

		htm += JSON.stringify( ISSF.errorsFound, null, ' ' );

	}

	if ( htm === '' ) {

		htm +=
		`
			<h3>General Check</h3>
			<p>All lines checked appear to contain valid XML data.</p>
			<p>No empty text strings or values equaling zero found.</p>
			<p>Lines checked: ${ ISSF.lines.length.toLocaleString()}</p>
			<div id=ISSdivCheckText ></div>
		`;

	} else {

		htm =
		`
			<h3>General Check</h3>
			<p>Lines checked: ${ ISSF.lines.length.toLocaleString()}</p>
			<p>Time to read: ${ ( performance.now() - ISSF.timeStart2 ).toLocaleString() } ms</p>
			<div id=ISSdivCheckText ><textarea style=height:200px;width:100%>${ htm }</textarea></div>
		`;

	}

	return htm;

};



ISSF.parseFile = function( text ) {


	//lines = text.split(/\r\n|\n/);
	//console.log( 'lines', lines.length );

	const parser = new window.DOMParser();
	ISSF.gbxml = parser.parseFromString( text, 'text/xml' );
	ISSF.gbjson = ISSF.getXML2jsobj( ISSF.gbxml.documentElement );
	//console.log( 'ISSF.gbjson', ISSF.gbjson );

	//meshesArray = ISSF.parseFileXML( text );

	console.log( 'ISSFml', performance.now() - ISSF.timeStart );

};



// https://www.sitepoint.com/how-to-convert-xml-to-a-javascript-object/
// http://blogs.sitepointstatic.com/examples/tech/xml2json/index.html
// Theo: I have difficulty understanding how this function actually functions


ISSF.getXML2jsobj = function( node ) {

	let data = {};

	function Add( name, value ) {

		let arr = data[ name ];

		if ( arr ) {

			//if ( !Array.isArray( arr ) ) { arr = [ arr ]; }

			arr = Array.isArray( arr ) ? arr : [ arr ];

			arr[ arr.length ] = value;

		} else {

			arr = value;

		}

	}

	let child, childNode;

	for ( child = 0; childNode = node.attributes[ child ]; child++ ) {

		Add( childNode.name, childNode.value );

	}

	for ( child = 0; childNode = node.childNodes[ child ]; child++ ) {

		if ( childNode.nodeType === 1 ) {

			if ( childNode.childNodes.length === 1 && childNode.firstChild.nodeType === 3 ) { // text value

				Add( childNode.nodeName, childNode.firstChild.nodeValue );

			} else { // sub-object

				Add( childNode.nodeName, ISSF.getXML2jsobj( childNode ) );

			}

		}

	}

	return data;

};



ISSF.cccgetXML2jsobj = function( node ) {

	let data = {};

	function Add( name, value ) {



		if ( data[ name ] ) {

			//if ( data[ name ].constructor !== Array ) {
			if( Array.isArray( data[ name ] === false ) ) {

				data[ name ] = [ data[ name ] ];

			}

			data[ name ][ data[ name ].length ] = value;

		} else {

			data[ name ] = value;

		}

	}

	let child, childNode;

	for ( child = 0; childNode = node.attributes[ child ]; child++ ) {

		Add( childNode.name, childNode.value );

	}

	for ( child = 0; childNode = node.childNodes[ child ]; child++ ) {

		if ( childNode.nodeType === 1 ) {

			if ( childNode.childNodes.length === 1 && childNode.firstChild.nodeType === 3 ) { // text value

				Add( childNode.nodeName, childNode.firstChild.nodeValue );

			} else { // sub-object

				Add( childNode.nodeName, ISSF.getXML2jsobj( childNode ) );

			}

		}

	}

	return data;

};