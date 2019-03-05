

const SGT = {}


SGT.setGeneralCheck = function() {

	divContents.innerHTML =
	`
		<h3>General Check</h3>

		<section id=checkGeneral ></section>

		<div id=ISSdivCheckText ></div>

		<section id=ISMETsec ></section>

	`;

	ISSdivCheckText.innerHTML = SGT.checkLines();

	ISMETsec.innerHTML = ISMET.getMenuMetadataIssues();

	ISMET.getMetadataIssuesCheck();

	SGT.setSurfaces();

}


SGT.checkLines = function() {

	let htm = '';
	SGT.max = 0;
	SGT.timeStart = performance.now();

	SGT.lines = ( FIL.text.split( /\r\n|\n/ ) ).map( line => line.toLowerCase() );
	//console.log( 'SGT.lines', SGT.lines.length );



	if ( SGT.lines[ 0 ].includes( 'utf-16' ) ) {

		htm += `line 0: ${ SGT.lines[ 0 ] }\n`;

	}

	for ( let i = 0; i < SGT.lines.length; i++ ) {

		line = SGT.lines[ i ];

		if ( line.includes( '<area>0</area>') ) {

			htm += `line ${i}: ${line}\n`;

		} else if ( line.includes( '<volume>0</volume>') ) {

			htm += `line ${i}: ${line}\n`;

		} else if ( line.includes( '""') ) {

			htm += `Empty string at line ${i}: ${line}\n`;

		}

		const coord = line.match( /<Coordinate>(.*?)<\/Coordinate>/i );

		const number = coord ? Number( coord[ 1 ] ): 0;

		SGT.max = number > SGT.max ? number : SGT.max;

		checkGeneral.innerHTML =
		`
			<p>Lines checked: ${ SGT.lines.length.toLocaleString()}</p>
			<p>Max coordinate = ${ SGT.max }</p>
			<p>Time to read: ${ ( performance.now() - SGT.timeStart ).toLocaleString() } ms</p>

		`;

	}


	if ( htm === '' ) {

		htm +=
		`
			<p>All lines checked appear to contain valid XML data.</p>
			<p>No empty text strings or values equal to zero found.</p>
		`;

	} else {

		htm =
		`
			<textarea style=height:200px;width:100%>${ htm }</textarea>
		`;

	}

	return htm;


};


SGT.setSurfaces = function() {

	SGT.text = FIL.text.replace( /\r\n|\n/g, '' );
	SGT.surfaces = SGT.text.match( /<Surface(.*?)<\/Surface>/gi );
	console.log( 'SGT.surfaces', SGT.surfaces );
	

};