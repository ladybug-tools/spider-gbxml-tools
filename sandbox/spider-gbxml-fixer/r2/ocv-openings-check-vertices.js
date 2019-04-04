//Copyright 2019 Ladybug Tools authors. MIT License
/* globals SGF, OCVsumOpeningsVertices */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const OCV = { release: "2.0.0", date: "2019-04-03" };

OCV.description = `Openings: check openings with more than four vertices`;


OCV.currentStatus =
	`
		<h3>Get Openings Check Vertices(OCV) ${ OCV.release } status ${ OCV.date }</h3>

		<p>${ OCV.description }</p>
		<p>
			<a href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/sandbox/spider-gbxml-fixer/r2/tnp-template.js" target="_blank">
			tmp-template.js source code</a>
		</p>
		<details>
			<summary>Wish List / To Do</summary>
			<ul>
				<li>2019-04-03 ~ Delete any extra vertices in edges</li>
			</ul>
		</details>
		<details>
			<summary>Change log</summary>
			<ul>
  				<li>2019-04-03 ~ F - First commit</li>
			</ul>
		</details>
	`;



OCV.getOpeningsCheckVertices = function() {

	OCV.help = `<a id=OCVHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(OCVHelp,OCV.currentStatus);" >&nbsp; ? &nbsp;</a>`;

	const htm =
		`
			<details ontoggle="OCVdivOpeningsVertices.innerHTML=OCV.getOpeningsVertices();" >

			<summary id=OCVsumOpeningsVertices class=sumHeader >Check for openings with more than four vertices
				${ OCV.help }
			</summary>
				<div id=OCVdivOpeningsVertices ></div>

			</details>

		`;

	return htm;

};


OCV.getOpeningsVertices = function() {

	OCV.ids = [];

	SGF.openings.map( opening => {

		const planar = opening.match(  /<PlanarGeometry(.*?)<\/PlanarGeometry>/gi )[ 0 ];
		//console.log( 'planar', planar );

		OCV.vertices = getVertices( planar );
		//console.log( 'vertices', vertices.length );

		if ( OCV.vertices.length > 12 ) {

			const id = opening.match(  / id="(.*?)"/i )[ 1 ];
			OCV.ids.push( id );

		}

	} );

	OCVsumOpeningsVertices.innerHTML = `Check for openings with more than four vertices ~ ${ OCV.ids.length } found ${ OCV.help }`;

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
