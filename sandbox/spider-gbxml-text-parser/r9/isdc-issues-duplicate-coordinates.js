// Copyright 2018 Ladybug Tools authors. MIT License

/* global THR, THREE, GBX */
/* jshint esversion: 6 */
/* jshint loopfunc:true */



const ISDC = { "release": "R9.2", "date": "2018-11-30"  }



ISDC.currentStatus =
`
	<aside>

		<details>

			<summary>ISDC ${ ISDC.release} status ${ ISDC.date }</summary>

			<p>This module is ready for light testing.</p>

		</details>

	</aside>

	<hr>
`;



ISDC.getDuplicateCoordinatesCheck = function() {

	ISDC.duplicates = [];

	const surfaces = GBX.surfaces;

	// https://stackoverflow.com/questions/840781/get-all-non-unique-values-i-e-duplicate-more-than-one-occurrence-in-an-array

	for ( let i = 0; i < surfaces.length; i++ ) {

		const surface1 = surfaces[ i ];

		const plane1 = surface1.match( /<PlanarGeometry>(.*?)<\/PlanarGeometry>/ )[ 1 ];

		for ( let j = 0; j < surfaces.length; j++ ) {

			const surface2 = surfaces[ j ];

			plane2 = surface2.match( /<PlanarGeometry>(.*?)<\/PlanarGeometry>/ )[ 1 ];

			if ( i !== j && plane1 === plane2 ) {

				//console.log( 'surface', plane1 );

				ISDC.duplicates.push( i );

			}

		}

	}

	//console.log( 'duplicates', ISDC.duplicates );

};



ISDC.getMenuDuplicateCoordinates= function( target ) {

	ISDC.getDuplicateCoordinatesCheck();

	let color;
	let htmOptions = '';
	let count = 0;

	for ( surfaceIndex of ISDC.duplicates ) {

		color = color === 'pink' ? '' : 'pink';

		const surfaceText = GBX.surfaces[ surfaceIndex ];

		const id = surfaceText.match( 'id="(.*?)"' )[ 1 ];

		htmOptions +=
		`
		<option style=background-color:${ color } value=${ surfaceIndex } >${ id }</option>
		`;
	}

	ISDC.optDublicates = htmOptions;

	const htm =

	`<details ontoggle=ISDC.getDuplicateCoordinatesCheck(); >

		<summary>Duplicate Coordinates: ${ ISDC.duplicates.length / 2 } found</summary>

		<p>
			Two surfaces with the identical vertices
		</p>

		<p>
			<button id=butDuplicateCoordinates
				onclick=ISDC.setSurfaceArrayVisibleToggle(butDuplicateCoordinates,ISDC.duplicates); >
				toggle all duplicates
			</button>
		</p>

		<p>
			<select id=ISDCselDuplicate onchange=ISDC.selectedSurfaceFocus(); style=width:100%; size=10>
			${ ISDC.optDublicates }
			</select>
		</p>


		<div id=divDuplicateAttributes ></div>
		<p>
			<button onclick=ISDC.selectedSurfaceDelete(); title="Starting to work!" >
				delete selected surface
			</button>
		</p>

		<div${ ISDC.currentStatus }</div>

	</details>`;

	return htm;

};


ISDC.selectedSurfaceFocus = function() {

	POP.intersected = GBX.surfaceGroup.children[ ISDCselDuplicate.value ];

	POP.getIntersectedDataHtml();

	divPopupData.innerHTML = POP.getIntersectedDataHtml();

};



ISDC.selectedSurfaceDelete = function() {
	//console.log( 'val', that.value );

	surfaceText = GBX.surfaces[ ISDCselDuplicate.value ];

	text = GBX.text.replace( surfaceText, '' );

	len = GBX.parseFile( text );

	console.log( '', len );

};

