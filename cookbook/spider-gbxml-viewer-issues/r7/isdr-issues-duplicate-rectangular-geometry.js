// Copyright 2018 Ladybug Tools authors. MIT License
/* globals */
/* jshint esversion: 6 */

const ISDR = { "release": "R7.0" }

ISDR.getMenuDuplicateRectangularGeometry = function() {


	const htm =

	`<details ontoggle=ISDR.getDuplicateCoordinatesCheck(); >

		<summary>Duplicate Rectangular Geometry</summary>

		<p>
			<i>
				Identify surfaces with identical rectangular geometry
				File Check ${ ISDR.release }.
			</i>
		</p>

		<p>
			<button onclick=ISDR.setSurfaceArrayVisibleToggle(this,${ISDR.duplicateWidths}); >show/hide duplicate rectangles </button>
		</p>

		<div id=ISDRdivLog ></div>

		<details>

			<summary>Current Status 2018-10-26</summary>

			<p>Not yet properly re-initiating in between file loads</p>

			<p>Checking for identical origins, width and height only. Azimuth and tilt to be added.</p>

			<p>At this stage, it looks like this routine is finding the same duplicated as the duplicate coordinates routine.</p>

			<p>If results do prove to be the same, this routine will be deprecated.</p>
		</details>

		<hr>

	</details>`;

	return htm;

};



ISDR.getDuplicateCoordinatesCheck = function() {


	let surfaceRectangles = [];
	let surfaceIndexes = [];
	ISDR.duplicatePoints = [];
	ISDR.duplicateWidths = [];

	THR.scene.remove( POP.line, POP.particle );

	GBX.surfaceMeshes.children.forEach( element => element.visible = true );

	const surfacesJson = GBX.gbjson.Campus.Surface;

	for ( let i = 0; i < surfacesJson.length; i++ ) {

		const surface = surfacesJson[ i ];
		const point = JSON.stringify( surface.RectangularGeometry.CartesianPoint );

		const width = surface.RectangularGeometry.Width;
		const height = surface.RectangularGeometry.Height;

		//console.log( 'point', point );
		const index = surfaceRectangles.indexOf( point + width + height );

		if ( index < 0 ) {

			surfaceRectangles.push( point + width + height );
			surfaceIndexes.push( i );

		} else {

			const surfaceOther = surfacesJson[ surfaceIndexes[ index ] ];

			const existing = ISDR.duplicatePoints.find( item => item[ 0 ] === surfaceOther );

			if ( existing ) {

				existing.push( surface );

			} else {

				ISDR.duplicatePoints.push( [ surfaceOther, surface ] );

			}

		}

	}

/*

	surfaceDims = [];
	surfaceIndexes = [];
	ISDR.duplicateDims = [];

	for ( let i = 0; i < ISDR.duplicatePoints.length; i++ ) {

		const surface = ISDR.duplicatePoints[ i ][ 0 ];

		console.log( 'surface.RectangularGeometry', surface.RectangularGeometry );

		//const width = JSON.stringify( surface.RectangularGeometry.Width );
		//const height = JSON.stringify( surface.RectangularGeometry.Height );

		const width = surface.RectangularGeometry.Width;
		const height = surface.RectangularGeometry.Height;

		//console.log( 'width', width );
		const index = surfaceDims.indexOf( width + " " + height );
		//const indexHeight = surfaceHeights.indexOf( height );

		if ( index < 0 ) {

			surfaceDims.push( width + " " + height );
			surfaceIndexes.push( i );

		} else {

			const surfaceOther = surfacesJson[ surfaceIndexes[ index ] ];

			const existing = ISDR.duplicateDims.find( item => item[ 0 ] === surfaceOther );

			if ( existing ) {

				existing.push( surface );

			} else {

				ISDR.duplicateDims.push( [ surfaceOther, surface ] );

			}

		}

	}
*/

	console.log( 'ISDR.duplicatePoints', ISDR.duplicatePoints );

};




ISDR.setSurfaceArrayVisibleToggle = function( button ) {

	THR.scene.remove( POP.line, POP.particle );

	if ( button.style.fontStyle !== 'italic' ) {

		//console.log( 'surfaceArray', surfaceArray );

		if ( ISDR.duplicatePoints.length ) {

			GBX.surfaceMeshes.children.forEach( element => element.visible = false );

			for ( let surface of ISDR.duplicatePoints ) {

				//console.log( '', surface  );
				const surfaceMesh = GBX.surfaceMeshes.children.find( element => element.userData.gbjson.id === surface[ 0 ].id );
				surfaceMesh.visible = true;
				const surfaceMesh1 = GBX.surfaceMeshes.children.find( element => element.userData.gbjson.id === surface[ 1 ].id );
				surfaceMesh1.visible = true;

			}

		}

		button.style.backgroundColor = 'pink';
		button.style.fontStyle = 'italic';

		ISDRdivLog.innerHTML = `${ ISDR.duplicatePoints.length } duplicates found`;

	} else {

		//GBX.setAllVisible();
		GBX.surfaceMeshes.children.forEach( element => element.visible = true );

		button.style.fontStyle = '';
		button.style.backgroundColor = '';
		button.style.fontWeight = '';

		ISDRdivLog.innerHTML = "None found";

	}

};
