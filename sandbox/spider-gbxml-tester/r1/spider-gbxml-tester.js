

const SGT = {}

let GBX = {};

GBX.colorsDefault = {

	InteriorWall: 0x008000,
	ExteriorWall: 0xFFB400,
	Roof: 0x800000,
	InteriorFloor: 0x80FFFF,
	ExposedFloor: 0x40B4FF,
	Shade: 0xFFCE9D,
	UndergroundWall: 0xA55200,
	UndergroundSlab: 0x804000,
	Ceiling: 0xFF8080,
	Air: 0xFFFF00,
	UndergroundCeiling: 0x408080,
	RaisedFloor: 0x4B417D,
	SlabOnGrade: 0x804000,
	FreestandingColumn: 0x808080,
	EmbeddedColumn: 0x80806E,
	Undefined: 0x88888888

};

GBX.colors = Object.assign( {}, GBX.colorsDefault ); // create working copy of default colors

GBX.surfaceTypes = Object.keys( GBX.colors );






SGT.setGeneralCheck = function() {

	divContents.innerHTML =
	`
		<h3>General Check</h3>

		<section id=checkGeneral ></section>

		<div id=ISSdivCheckText ></div>

		<section id=ISMETsec ></section>

		<section id=ISSTIsec>

			<details id=ISSTIdetSurfaceTypeInvalid open >
				<summary>Surface Type Invalid<span id=ISSTIspnCount ></span> </summary>

				<select id=ISTIselSurfaceTypeInvalid ></select>
			</details>

		</section>

	`;

	//ISSdivCheckText.innerHTML = SGT.checkLines();



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

	GBX.text = FIL.text.replace( /\r\n|\n/g, '' );
	GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );
	//console.log( 'GBX.surfaces', GBX.surfaces );

	ISMETsec.innerHTML = ISMET.getMenuMetadataIssues();

	ISMET.getMetadataIssuesCheck();

	ISSTI.getSurfaceTypeInvalidCheck();

};