// Copyright 2018 Ladybug Tools authors. MIT License
/* globals THR, GBX, POP, ISASIfound */
/* jshint esversion: 6 */

const ISASI = { "release": "R7.1" };


ISASI.getMenuAdjacentSpaceInvalid = function() {

	const htm =

	`<details ontoggle=ISASI.getAdjacentSpaceInvalidCheck(); >

		<summary>Adjacent Space Invalid</summary>

		<p>
			<i>
				Surfaces with invalid adjacent spaces. <span id=ISASIfound ></span>
				ISASI ${ ISASI.release }.
			</i>
		</p>

		<p>
			<button onclick=ISASI.setAdjacentSpaceInvalidToggle(this); > AdjacentSpaceInvalid toggle </button>
		</p>

		<p>Click toggle button to show invalid surfaces. Then click surface on screen to view its details.</p>

		<details>

			<summary>ISASI Status 2018-11-03</summary>

			<p>Should we list errors here? or is on screen good enough?<p>

			<p>To do: How to fix the issues and save the changes</p>

		</details>

		<hr>

	</details>`;

	return htm;

};



ISASI.getAdjacentSpaceInvalidCheck = function() {

	ISASI.adjacentSpaceInvalid = [];

	const twoSpaces = ['Air', 'InteriorWall', 'InteriorFloor', 'Ceiling' ];
	const oneSpace = [ 'ExteriorWall', 'Roof', 'ExposedFloor', 'UndergroundCeiling', 'UndergroundWall', 'UndergroundSlab',
		'RaisedFloor', 'SlabOnGrade', 'FreestandingColumn', 'EmbeddedColumn' ];

	for ( let i = 0; i < GBX.surfacesJson.length; i++ ) {

		const surface = GBX.surfacesJson[ i ];

		if ( surface.surfaceType === 'Shade' && surface.AdjacentSpaceId !== undefined ) {
			//console.log( 'shade surface', surface );
			ISASI.adjacentSpaceInvalid.push( surface );

		} else if ( twoSpaces.includes( surface.surfaceType ) && ( Array.isArray( surface.AdjacentSpaceId ) === false || surface.AdjacentSpaceId.length !== 2 ) ) {

			//console.log( 'two space', surface );
			ISASI.adjacentSpaceInvalid.push( surface );

		} else if ( oneSpace.includes( surface.surfaceType ) && ( !surface.AdjacentSpaceId || surface.AdjacentSpaceId.length ) ) {

			//console.log( 'one space', surface );
			ISASI.adjacentSpaceInvalid.push( surface );

		} else {

			//console.log( 'ok surface', surface );
			//ISASI.adjacentSpaceInvalid.push( surface );

		}

	}

	ISASIfound.innerHTML = `${ ISASI.adjacentSpaceInvalid.length } found`;

	//console.log( 'ISASI.adjacentSpaceInvalid',  ISASI.adjacentSpaceInvalid );

};



ISASI.setAdjacentSpaceInvalidToggle = function( button, surfaceArray = [] ) {

	THR.scene.remove( POP.line, POP.particle );

	surfaceArray = ISASI.adjacentSpaceInvalid; //[ GBX.gbjson.Campus.Surface[ 88 ],GBX.gbjson.Campus.Surface[ 1 ]  ]

	if ( button.style.fontStyle !== 'italic' ) {

		//console.log( 'surfaceArray', surfaceArray );

		if ( surfaceArray.length ) {

			GBX.surfaceMeshes.children.forEach( element => element.visible = false );

			surfaceMeshes = GBX.surfaceMeshes.children.filter( element => surfaceArray.find( item => item.id === element.userData.gbjson.id ) );
			//console.log( 'surfaceMeshes', surfaceMeshes );
			surfaceMeshes.forEach( mesh => mesh.visible = true );

		} else {

			GBX.surfaceMeshes.children.forEach( element => element.visible = !element.visible );

		}

		button.style.backgroundColor = 'pink';
		button.style.fontStyle = 'italic';

	} else {

		//GBX.setAllVisible();
		GBX.surfaceMeshes.children.forEach( element => element.visible = true );

		button.style.fontStyle = '';
		button.style.backgroundColor = '';
		button.style.fontWeight = '';

	}

};
