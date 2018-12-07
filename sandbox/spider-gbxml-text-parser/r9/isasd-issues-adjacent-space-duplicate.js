// Copyright 2018 Ladybug Tools authors. MIT License
/* globals GBX, POP, divPopupData */
/* jshint esversion: 6 */


const ISASD = { "release": "R9.0", "date": "2018-12-06" };


ISASD.currentStatus =
	`
		<aside>

			<details>

				<summary>ISASD ${ ISASD.release} status ${ ISASD.date }</summary>

				<p>This module is ready for light testing.</p>

				<p>2018-12-05 ~ Add more functions</p>

			</details>

		</aside>

		<hr>
	`;



ISASD.getAdjacentSpaceDuplicateCheck = function() {
	//console.log( 'ISASDdetAdjacentSpaceDuplicate.open', ISASDdetAdjacentSpaceDuplicate.open );

	if ( ISASDdetAdjacentSpaceDuplicate.open === false && ISCOR.runAll === false ) { return; }

	ISASD.invalidAdjacentSpaceDuplicate = [];

	const surfaces = GBX.surfaces;

	// refactor to a reduce??
	for ( let i = 0; i < surfaces.length; i++ ) {

		const surface = surfaces[ i ];
		const surfaceId = surface.match( /id="(.*?)"/)[ 1 ];

		//const invalidTemplate = GBX.surfaces.find( element => GBX.surfaceTypes.indexOf( surfaceId ) < 0 );
		//console.log( 'invalidTemplate', invalidTemplate );

		spaceIdRef = surface.match( /spaceIdRef="(.*?)"/g );

		if ( spaceIdRef && spaceIdRef.length && spaceIdRef[ 0 ] === spaceIdRef[ 1 ] ) {

			console.log( 'spaceIdRef', spaceIdRef );

			ISASD.invalidAdjacentSpaceDuplicate.push( i );
		}

/*
		const invalidAdjacentSpaceDuplicate = GBX.surfaces.find( element => GBX.surfaceTypes.indexOf( surfaceId ) < 0 );
		//console.log( 'invalidAdjacentSpaceDuplicate', invalidAdjacentSpaceDuplicate );
 		if ( invalidAdjacentSpaceDuplicate ) {

			ISASD.invalidAdjacentSpaceDuplicate.push( i );

		}
		*/

	}

	let color;
	let htmOptions = '';

	for ( let surfaceIndex of ISASD.invalidAdjacentSpaceDuplicate ) {

		color = color === 'pink' ? '' : 'pink';

		const surfaceText = GBX.surfaces[ surfaceIndex ];

		const id = surfaceText.match( 'id="(.*?)"' )[ 1 ];

		htmOptions +=
			`<option style=background-color:${ color } value=${ surfaceIndex } >${ id }</option>`;
	}

	ISASDselAdjacentSpaceDuplicate.innerHTML = htmOptions;
	ISASDspnCount.innerHTML = `: ${ ISASD.invalidAdjacentSpaceDuplicate.length } found`;

	return ISASD.invalidAdjacentSpaceDuplicate.length;

};



ISASD.getMenuAdjacentSpaceDuplicate = function() {

	const htm =

	`<details id="ISASDdetAdjacentSpaceDuplicate" ontoggle=ISASD.getAdjacentSpaceDuplicateCheck(); >

		<summary>Adjacent Space Duplicate<span id="ISASDspnCount" ></span></summary>

		<p>
			Surfaces with two adjacent spaces that are identical
		</p>

		<p>
			<button onclick=ISASD.setAdjacentSpaceDuplicateShowHide(this,ISASD.invalidAdjacentSpaceDuplicate); >
				Show/hide Adjacent Space Duplicate surfaces
			</button>
		</p>

		<p>
			Select a surface:<br>
			<select id=ISASDselAdjacentSpaceDuplicate onchange=ISASD.selectedSurfaceFocus(this); style=width:100%; size=10 >
			</select>
		</p>

		<p>
			<button onclick=ISASD.selectedSurfaceDelete(); title="Starting to work!" >
				AdjacentSpaceDuplicate
			</button>
		</p>

		<div>${ ISASD.currentStatus }</div>

	</details>`;

	return htm;

};



ISASD.setAdjacentSpaceDuplicateShowHide = function( button, surfaceArray ) {
	//console.log( 'surfaceArray', surfaceArray );

	//THR.scene.remove( POP.line, POP.particle );

	button.classList.toggle( "active" );

	if ( button.classList.contains( 'active' ) && surfaceArray.length ) {

		GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

/* 		for ( let surfaceId of surfaceArray ) {

			const surfaceMesh = GBX.surfaceGroup.children[ surfaceId ];
			//console.log( 'surfaceMesh', surfaceMesh  );

			surfaceMesh.visible = true;

		} */

		surfaceArray.forEach( surfaceId => GBX.surfaceGroup.children[ surfaceId ].visible = true );



	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	}

};



ISASD.selectedSurfaceFocus = function( select ) {

	POP.intersected = GBX.surfaceGroup.children[ select.value ];

	POP.getIntersectedDataHtml();

	divPopupData.innerHTML = POP.getIntersectedDataHtml();

};

