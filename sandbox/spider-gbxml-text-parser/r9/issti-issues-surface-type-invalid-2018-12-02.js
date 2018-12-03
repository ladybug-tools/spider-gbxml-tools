// Copyright 2018 Ladybug Tools authors. MIT License
/* globals */
/* jshint esversion: 6 */
/* jshint loopfunc:true */


const ISSTI = { "release": "R9.1", "date": "2018-12-02" };


ISSTI.currentStatus =
`
	<aside>

		<details>

			<summary>ISSTI ${ ISSTI.release} status ${ ISSTI.date }</summary>

			<p>This module is brand new.</p>

		</details>

	</aside>

	<hr>
`;



ISSTI.getSurfaceTypeInvalidCheck = function() {

	ISSTI.SurfaceTypeInvalid = [];

	const surfaces = GBX.surfaces;

	for ( let i = 0; i < surfaces.length; i++ ) {

		const surface = surfaces[ i ];

		surfaceType = surface.match( /surfaceType="(.*?)"/)[ 1 ];

		surfaceTypeInvalid = GBX.surfaces.filter( element => GBX.surfaceTypes.indexOf( surfaceType ) < 0 );
		//console.log( 'surfaceTypeInvalid', surfaceTypeInvalid );

		if ( surfaceTypeInvalid.length > 0 ) {

			ISSTI.SurfaceTypeInvalid.push( i );

		}

	}

	//console.log( 'duplicates', ISDC.duplicates );

};





ISSTI.getDivSurfaceTypeInvalid = function() {

	ISSTI.getSurfaceTypeInvalidCheck();

	let color;
	let htmOptions = '';
	let count = 0;

	for ( surfaceIndex of ISSTI.SurfaceTypeInvalid ) {

		color = color === 'pink' ? '' : 'pink';

		const surfaceText = GBX.surfaces[ surfaceIndex ];

		const id = surfaceText.match( 'id="(.*?)"' )[ 1 ];

		htmOptions +=
		`
		<option style=background-color:${ color } value=${ surfaceIndex } >${ id }</option>
		`;
	}

	ISSTI.optSurfaceTypeInvalid = htmOptions;

	const htm =
	`
		<details>

			<summary>Surface Type Invalid: ${ ISSTI.SurfaceTypeInvalid.length } found</summary>

			<p>
			Surfaces with an invalid surface type assignment.
		</p>

		<p>
			<button id=butSurfaceTypeInvalidShowHide
				onclick=ISSTI.setSurfaceTypeInvalidShowHide(); >
				show/hide invalid surface types
			</button>
		</p>

		<p>
			<select id=ISTIselSurfaceTypeInvalid onchange=ISSTI.selectedSurfaceFocus(); style=width:100%; size=10>
			${ ISSTI.optSurfaceTypeInvalid }
			</select>
		</p>


		<div id=divDuplicateAttributes ></div>
		<p>
			<button onclick=ISSTI.selectedSurfaceEdit(); title="will work soon!" >
				edit selected surface type
			</button>
		</p>

			<div${ ISSTI.currentStatus }</div>

		</details>
	`;

	return htm;

};



ISSTI.setSurfaceTypeInvalidShowHide = function( button, surfaceArray = [] ) {

	//THR.scene.remove( POP.line, POP.particle );

	butSurfaceTypeInvalidShowHide.classList.toggle( "active" );

	if ( butSurfaceTypeInvalidShowHide.classList.contains( 'active' ) ) {

		//console.log( 'surfaceArray', surfaceArray );

		if ( ISSTI.SurfaceTypeInvalid.length ) {

			GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

			for ( let surfaceId of ISSTI.SurfaceTypeInvalid ) {

				const surfaceMesh = GBX.surfaceGroup.children[ surfaceId ];
				//console.log( 'surfaceMesh', surfaceMesh  );

				surfaceMesh.visible = true;

			}

		}

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	}

};



ISSTI.selectedSurfaceFocus = function() {

	POP.intersected = GBX.surfaceGroup.children[ ISTIselSurfaceTypeInvalid.value ];

	POP.getIntersectedDataHtml();

	divPopupData.innerHTML = POP.getIntersectedDataHtml();

};



ISSTI.selectedSurfaceEdit = function() {
	//console.log( 'val', that.value );

	surfaceText = GBX.surfaces[ ISTIselSurfaceTypeInvalid.value ];

	//text = GBX.text.replace( surfaceText, '' );

	//len = GBX.parseFile( text );

	//console.log( '', len );

	alert( 'Coming soon!' );

};

