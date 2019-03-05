// Copyright 2018 Ladybug Tools authors. MIT License
/* globals */
/* jshint esversion: 6 */

const ISFC = { "release": "R9.3", "date": "2018-12-02" };


ISFC.currentStatus =
`
<aside>

	<details>
	
		<summary>ISFC ${ ISFC.release} status ${ ISFC.date }</summary>

		<p>This module is ready for light testing, but is still at an early stage of development</p>

		<p>
			As and when the project gets access to more modules with errors,
			this module will be enhanced to identify and fix errors found.
		</p>

		<p>
			Current checks include:
			<ul>
				<li>File size</li>
				<li>Time to load</li>
				<li>UTF-1</li>
				<li>Area or volume = 0</li>
				<li>Attributes with empty strings ( "" )</li>
				<!--
				<li>Parse file into JSON</li>
				<li>Time elapsed to parse</li>
				<li>Number of lines in file</li>
				-->
			</ul>
		</p>

		<p>Whatever validations you might need could be added here...</p>

		<p>Should this module be more appropriately located in the File menu?</p>

	</details>

</aside>

<hr>
`;

ISFC.getMenuFileCheck= function() {

	const htm =

	`<details>

		<summary>File Check</summary>

		<p>
			<i>
				Identify  problems with XML files.
				This module does not display or fix models. It simply locates technical errors in files.
				File Check ${ ISFC.release }.
			</i>
		</p>

		<div id="divFileCheckOpen" class="dragDropArea" >

			<p id=pFileOpen>

				Open gbXML files:
				<input type=file id=inpOpenFile onchange=ISFC.inpOpenFiles(this); accept=".xml" >

			</p>

		</div>

		<br>

		<div id=ISFCdivFileInfo ></div>

		<div>${ ISFC.currentStatus }</div>

	</details>`;

	return htm;

};



ISFC.inpOpenFiles = function( files ) {

	//console.log( 'file', files.files[ 0 ] );

	ISFC.timeStart = performance.now();

	THRU.setSceneDispose( [ GBX.surfaceMeshes, GBX.surfaceEdges, GBX.surfaceOpenings, GBX.helperNormalsFaces ] );

	ISFC.fileAttributes = files.files[ 0 ];

	const reader = new FileReader();

	reader.onprogress = onRequestFileProgress;

	reader.onload = function( event ) {

		ISFC.timeToLoad = performance.now() - ISFC.timeStart;

		ISFC.data = reader.result;

		ISFCdivFileInfo.innerHTML =
		`
			<div>${ ISFC.fileAttributes.name }</div>
			<div>bytes loaded: ${event.loaded.toLocaleString()}</div>
			<div>time to load: ${ parseInt( ISFC.timeToLoad, 10 ).toLocaleString() } ms</div>

			<!-- has issues / check with original parser -->
			<!--
			<p>
				<button onclick=ISFC.parseFile(); >Parse file to JSON</button><br>
				With large files, may take a while...
			</p>
			-->
		`;



		ISFC.timeStart2 = performance.now();
		ISFCdivFileInfo.innerHTML += ISFC.getGeneralCheck( reader.result );

	};

	reader.readAsText( files.files[ 0 ] );


		function onRequestFileProgress( event ) {

			ISFC.timeToLoad = performance.now() - ISFC.timeStart;

			ISFCdivFileInfo.innerHTML =
			`
				<div>${ ISFC.fileAttributes.name }</div>
				<div>bytes loaded: ${event.loaded.toLocaleString()}</div>
				<div>time elapsed: ${ parseInt( ISFC.timeToLoad, 10 ).toLocaleString() } ms</div>
			`;

		}

};



ISFC.getGeneralCheck = function( text ) {

	let htm = '';

	ISFC.lines = ( text.split( /\r\n|\n/ ) ).map( line => line.toLowerCase() );

	//console.log( 'ISFC.lines', ISFC.lines );

	if ( ISFC.lines[ 0 ].includes( 'utf-16' ) ) {

		htm += `line 0: ${ ISFC.lines[ 0 ] }\n`;

	}

	for ( i = 0; i < ISFC.lines.length; i++ ) {

		line = ISFC.lines[ i ];

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

	if ( ISFC.errorsFound ) {

		htm += JSON.stringify( ISFC.errorsFound, null, ' ' );

	}

	if ( htm === '' ) {

		htm +=
		`
			<h3>General Check</h3>
			<p>All lines checked appear to contain valid XML data.</p>
			<p>No empty text strings or values equaling zero found.</p>
			<p>Lines checked: ${ ISFC.lines.length.toLocaleString()}</p>
			<div id=ISSdivCheckText ></div>
		`;

	} else {

		htm =
		`
			<h3>General Check</h3>
			<p>Lines checked: ${ ISFC.lines.length.toLocaleString()}</p>
			<p>Time to read: ${ ( performance.now() - ISFC.timeStart2 ).toLocaleString() } ms</p>
			<div id=ISSdivCheckText ><textarea style=height:200px;width:100%>${ htm }</textarea></div>

		`;

	}

	return htm;

};



ISFC.parseFile = function() {

	//lines = text.split(/\r\n|\n/);
	//console.log( 'lines', lines.length );

	const timeStart = performance.now();
	const parser = new window.DOMParser();
	ISFC.gbxml = parser.parseFromString( ISFC.data, 'text/xml' );
	console.log( 'ISFC.gbxml', ISFC.gbxml );
	ISFC.gbjson = ISFC.getXML2jsobj( ISFC.gbxml.documentElement );
	console.log( 'ISFC.gbjson', ISFC.gbjson );

	//meshesArray = ISFC.parseFileXML( text );

	ISFCdivFileInfo.innerHTML +=
	`
		<h3>JSON Parse</h3>

		<div>gbJSON time to parse ${ ( performance.now() - timeStart ).toLocaleString() }</div>
		<div>Campus id: ${ ISFC.gbjson.Campus.id }</div>

	`;

};



// https://www.sitepoint.com/how-to-convert-xml-to-a-javascript-object/
// http://blogs.sitepointstatic.com/examples/tech/xml2json/index.html
// Theo: I have difficulty understanding how this function actually functions


ISFC.xxxgetXML2jsobj = function( node ) {

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

				Add( childNode.nodeName, ISFC.getXML2jsobj( childNode ) );

			}

		}

	}

	return data;

};





//////////

ISFC.getXML2jsobj = function( node ) {

	let data = {};

	function Add( name, value ) {

		if ( data[ name ] ) {

			if ( data[ name ].constructor !== Array ) {
			//if( Array.isArray( data[ name ] === false ) ) {

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

				Add( childNode.nodeName, ISFC.getXML2jsobj( childNode ) );

			}

		}

	}

	return data;

};