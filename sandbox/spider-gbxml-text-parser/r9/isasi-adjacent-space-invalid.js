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

	for ( let i = 0; i < GBX.surfacesIndexed.length; i++ ) {

		const surface = GBX.surfacesIndexed[ i ];

		surfaceIndex = surface.match( /indexGbx="(.*?)"/ )[ 1 ];
		surfaceType = surface.match ( /surfaceType="(.*?)"/ )[ 1 ];
		//adjacentSpaces = surface.match( /AdjacentSpaceId/gi );
		spaceIdRef = surface.match( /spaceIdRef="(.*?)"/g );

		if ( surfaceType === 'Shade' && surface.includes( 'AdjacentSpaceId' ) === true ) {
			//console.log( 'shade surface', surface );
			ISASI.adjacentSpaceInvalid.push( surfaceIndex );

		} else if ( twoSpaces.includes( surfaceType ) && ( spaceIdRef.length !== 2 ||
			( spaceIdRef.length === 2 && spaceIdRef[ 0 ] === spaceIdRef[ 1 ] ) ) ) {

//  || surface.AdjacentSpaceId.length !== 2
			console.log( 'two space', spaceIdRef  );
			ISASI.adjacentSpaceInvalid.push( surfaceIndex );

/*
		} else if ( oneSpace.includes( surface.surfaceType ) && ( !surface.AdjacentSpaceId || surface.AdjacentSpaceId.length ) ) {

			//console.log( 'one space', surface );
			ISASI.adjacentSpaceInvalid.push( surface );
*/
		} else {

			//console.log( 'ok surface', surface );
			//ISASI.adjacentSpaceInvalid.push( surface );

		}

	}

	ISASIfound.innerHTML = `${ ISASI.adjacentSpaceInvalid.length } found`;

	//console.log( 'ISASI.adjacentSpaceInvalid',  ISASI.adjacentSpaceInvalid );

};



ISASI.setAdjacentSpaceInvalidToggle = function( button ) {

	THR.scene.remove( POP.line, POP.particle );

	surfaceArray = ISASI.adjacentSpaceInvalid; //[ GBX.gbjson.Campus.Surface[ 88 ],GBX.gbjson.Campus.Surface[ 1 ]  ]

	if ( button.style.fontStyle !== 'italic' ) {

		//console.log( 'surfaceArray', surfaceArray );

		if ( surfaceArray.length ) {

			GBX.surfaceGroup.children.forEach( element => element.visible = false );

			//surfaceMeshes = GBX.surfaceGroup.children.filter( element => surfaceArray.find( item => item === element.userData.index );
			//console.log( 'surfaceMeshes', surfaceMeshes );
			surfaceArray.forEach( index => {
				console.log( 'vv', index, GBX.surfaceGroup.children[ Number( index ) ] );
				GBX.surfaceGroup.children[ Number( index ) ].visible = true;

			} );

		} else {

			GBX.surfaceMeshes.children.forEach( element => element.visible = true );

		}

		button.style.backgroundColor = 'pink';
		button.style.fontStyle = 'italic';

	} else {

		//GBX.setAllVisible();
		GBX.surfaceGroup.children.forEach( element => element.visible = true );

		button.style.fontStyle = '';
		button.style.backgroundColor = '';

	}

};
