/* globals GBX, OCVsumOpeningsVertices */
// jshint esversion: 6
// jshint loopfunc: true


const OCV = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-23",
		description: "Openings: check openings with more than four vertices",
		helpFile: "../v-0-17-00/js-fixer/ocv-openings-check-vertices/ocv-openings-check-vertices.md",
		license: "MIT License",
		version: "0.17.00-0ocv"

	}

};



OCV.getOpeningsCheckVertices = function() {

	const htm =
		`
			<details ontoggle="OCVdivOpeningsVertices.innerHTML=OCV.getOpeningsVertices();" >

				<summary id=OCVsumOpeningsVertices >Check for openings with more than four vertices</summary>

				${ GBXF.getHelpButton( "OCVFbutHelp", OCV.script.helpFile ) }

				<div id=OCVdivOpeningsVertices ></div>

			</details>

		`;

	return htm;

};


OCV.getOpeningsVertices = function() {

	OCV.ids = [];

	GBX.openings.map( opening => {

		const planar = opening.match(  /<PlanarGeometry(.*?)<\/PlanarGeometry>/gi )[ 0 ];
		//console.log( 'planar', planar );

		OCV.vertices = getVertices( planar );
		//console.log( 'vertices', vertices.length );

		if ( OCV.vertices.length > 12 ) {

			const id = opening.match(  / id="(.*?)"/i )[ 1 ];
			OCV.ids.push( id );

		}

	} );

	const tag = OCV.ids.length === 0 ? "span" : "mark";

	OCVsumOpeningsVertices.innerHTML = `Check for openings with more than four vertices ~ <${ tag }>${ OCV.ids.length }</${ tag }> found`;

	const htm =
		`
			<p>
				Number of openings with greater then four vertices: ${ OCV.ids.length }
			</p>

			<p>
				IDs: ${ OCV.ids }
			</p>
		`;

	return htm;


		function getVertices( surface ) {

			const re = /<coordinate(.*?)<\/coordinate>/gi;
			const coordinatesText = surface.match( re );
			const coordinates = coordinatesText.map( coordinate => coordinate.replace(/<\/?coordinate>/gi, '' ) )
				.map( txt => Number( txt ) );

			return coordinates;

		}

};
