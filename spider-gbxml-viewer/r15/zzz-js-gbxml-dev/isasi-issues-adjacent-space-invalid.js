// Copyright 2018 Ladybug Tools authors. MIT License
/* globals THR, GBX, POP, ISASIfound */
/* jshint esversion: 6 */

const ISASI = { "release": "R9.5", "date": "2018-12-06" };


ISASI.currentStatus =
`
<aside>

	<details>

		<summary>ISASI ${ ISASI.release} status ${ ISASI.date }</summary>

		<p>This module is ready for light testing, but is still a work in progress.</p>

		<p>
			2018-12-06 ~ Adds ability to run in 'check all issues'.<br>
			2018-12-05 ~ Adds select box to locate surfaces with issues
		</p>

		<p>To do: How to fix the issues and save the changes?
			May be best to split into three modules: for no/one/two adjacent space(s)</p>

		<p>Whatever further checks you might need could be added here...</p>

	</details>

</aside>

<hr>
`;


ISASI.setAdjacentSpaceInvalidCheck = function() {

	if ( ISASIdetAdjacentSpaceInvalid.open === false && ISCOR.runAll === false ) { return; }

	ISASI.adjacentSpaceInvalid = [];

	const twoSpaces = ['Air', 'InteriorWall', 'InteriorFloor', 'Ceiling' ];
	const oneSpace = [ 'ExteriorWall', 'Roof', 'ExposedFloor', 'UndergroundCeiling', 'UndergroundWall', 'UndergroundSlab',
		'RaisedFloor', 'SlabOnGrade', 'FreestandingColumn', 'EmbeddedColumn' ];

	for ( let i = 0; i < GBX.surfacesIndexed.length; i++ ) {

		const surface = GBX.surfacesIndexed[ i ];

		surfaceIndex = surface.match( /indexGbx="(.*?)"/ )[ 1 ];
		surfaceType = surface.match ( /surfaceType="(.*?)"/ )[ 1 ];
		spaceIdRef = surface.match( /spaceIdRef="(.*?)"/g );

		if ( surfaceType === 'Shade' && surface.includes( 'AdjacentSpaceId' ) === true ) {
			//console.log( 'shade surface', surface );
			ISASI.adjacentSpaceInvalid.push( surfaceIndex );

		} else if ( twoSpaces.includes( surfaceType ) && spaceIdRef && ( spaceIdRef.length !== 2 ||
			( spaceIdRef.length === 2 && spaceIdRef[ 0 ] === spaceIdRef[ 1 ] ) ) ) {

			//console.log( 'two space', spaceIdRef  );
			ISASI.adjacentSpaceInvalid.push( surfaceIndex );

/*
		} else if ( oneSpace.includes( surface.surfaceType )
			&& ( !surface.AdjacentSpaceId || surface.AdjacentSpaceId.length ) ) {

			//console.log( 'one space', surface );
			ISASI.adjacentSpaceInvalid.push( surface );
*/
		} else {

			//console.log( 'ok surface', surface );
			//ISASI.adjacentSpaceInvalid.push( surface );

		}

	}

	let color;
	let htmOptions = '';

	for ( let surfaceIndex of ISASI.adjacentSpaceInvalid) {

		color = color === 'pink' ? '' : 'pink';

		const surfaceText = GBX.surfaces[ surfaceIndex ];

		const id = surfaceText.match( 'id="(.*?)"' )[ 1 ];

		htmOptions +=
		`
			<option style=background-color:${ color } value=${ surfaceIndex } >${ id }</option>
		`;
	}

	ISASIselSurfaceAdjacentSpaceInvalid.innerHTML = htmOptions;

	ISASIspnCount.innerHTML = `: ${ ISASI.adjacentSpaceInvalid.length } found`;

	//console.log( 'ISASI.adjacentSpaceInvalid',  ISASI.adjacentSpaceInvalid );

	return ISASI.adjacentSpaceInvalid.length;

};



ISASI.getMenuAdjacentSpaceInvalid = function() {

	//ISASI.setAdjacentSpaceInvalidCheck();

	const htm =

	`<details id="ISASIdetAdjacentSpaceInvalid" ontoggle=ISASI.setAdjacentSpaceInvalidCheck(); >

		<summary>Adjacent Space Invalid<span id="ISASIspnCount" ></span></summary>

		<p>
			To be deprecated.<br>
			Being replaced by multiple shorter and simpler modules dedicated to identifing and fixing very specific issues.
			'Adjacent Space Duplicate/ is the first of these modules.</p>
		<p>
			<i>
				Surfaces with invalid adjacent spaces. <span id=ISASIfound ></span>
			</i>
		</p>

		<p>
			<button onclick=ISASI.setAdjacentSpaceInvalidToggle(this); >
				Show/hide surfaces with invalid adjacent space</button>
		</p>

		<p>Click toggle button to show invalid surfaces. Then click surfaces on screen to view details.</p>

		<p>
		Select a surface:<br>
			<select id=ISASIselSurfaceAdjacentSpaceInvalid onchange=ISASI.selectedSurfaceFocus(); style=width:100%; size=10 ></select>
		</p>

		<div>${ ISASI.currentStatus }</div>

	</details>`;

	return htm;

};



ISASI.setAdjacentSpaceInvalidToggle = function( button ) {

	THR.scene.remove( POP.line, POP.particle );

	surfaceArray = ISASI.adjacentSpaceInvalid;

	if ( button.style.fontStyle !== 'italic' ) {

		console.log( 'surfaceArray', surfaceArray );

		if ( surfaceArray.length ) {

			GBX.surfaceGroup.children.forEach( element => element.visible = false );

			//surfaceMeshes = GBX.surfaceGroup.children.filter( element => surfaceArray.find( item => item === element.userData.index );
			//console.log( 'surfaceMeshes', surfaceMeshes );
			surfaceArray.forEach( index => {

				console.log( 'surface', index, GBX.surfaceGroup.children[ Number( index ) ] );
				console.log( 'surface', index, GBX.surfacesIndexed[ index ] );
				GBX.surfaceGroup.children[ index ].visible = true;

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


ISASI.selectedSurfaceFocus = function() {

	POP.intersected = GBX.surfaceGroup.children[ ISASIselSurfaceAdjacentSpaceInvalid.value ];

	POP.getIntersectedDataHtml();

	divPopUpData.innerHTML = POP.getIntersectedDataHtml();

};
