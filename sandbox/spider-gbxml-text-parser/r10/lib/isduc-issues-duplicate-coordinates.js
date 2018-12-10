// Copyright 2018 Ladybug Tools authors. MIT License

/* global THR, THREE, GBX */
/* jshint esversion: 6 */
/* jshint loopfunc:true */


const ISDC = { "release": "R9.4", "date": "2018-12-05"  }



ISDC.currentStatus =
`
	<aside>

		<details>

			<summary>ISDC ${ ISDC.release} status ${ ISDC.date }</summary>

			<p>
				This module is ready for light testing.
				Very slow on large files.
				Much can be done to speed things up here.</p>

			<p>
				2018-12-06 ~ Adds ability to run in 'check all issues'.<br>
			</p>

		</details>

	</aside>

	<hr>
`;



ISDC.getDuplicateCoordinatesCheck = function() {

	if ( ISDCdetDuplicateCoordinates.open === false && ISCOR.runAll === false ) { return; }

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

	ISDCselDuplicate.innerHTML = htmOptions;
	ISDCspnCount.innerHTML = `: ${ ISDC.duplicates.length / 2 } found`;

	return ISDC.duplicates.length / 2;

};



ISDC.getMenuDuplicateCoordinates= function( target ) {

	const htm =

	`<details id="ISDCdetDuplicateCoordinates" ontoggle=ISDC.getDuplicateCoordinatesCheck(); >

		<summary>Duplicate Coordinates<span id="ISDCspnCount" ></span></summary>

		<p>
			Two surfaces with the identical vertices
		</p>

		<p>
			<button id=butDuplicateCoordinates onclick=ISDC.setSurfaceArrayShowHide(); >
				show/hide all duplicates
			</button>
		</p>

		<p>
			<select id=ISDCselDuplicate onchange=ISDC.selectedSurfaceFocus(); style=width:100%; size=10>
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


ISDC.setSurfaceArrayShowHide = function() {

	butDuplicateCoordinates.classList.toggle( "active" );

	if ( butDuplicateCoordinates.classList.contains( 'active' ) ) {

		if ( ISDC.duplicates.length ) {

			GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

			for ( let surface of ISDC.duplicates ) {

				const surfaceMesh = GBX.surfaceGroup.children.find( element => Number( element.userData.index ) === surface );

				//console.log( 'surfaceMesh', surfaceMesh  );

				surfaceMesh.visible = true;

			}

		}

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	}

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

	console.log( 'len', len );

};

