// Copyright 2018 Ladybug Tools authors. MIT License
/* globals GBX, POP, divPopupData */
/* jshint esversion: 6 */


const ISASE = { "release": "R10.1", "date": "2018-12-09" };


ISASE.currentStatus =
	`
		<aside>

			<details>

				<summary>ISASE ${ ISASE.release} status ${ ISASE.date }</summary>

				<p>This module is ready for light testing.</p>

				<p>2018-12-09 ~ appears to be operating as intended</p>
				<p>2018-12-07 ~ new module</p>

			</details>

		</aside>

		<hr>
	`;



ISASE.getAdjacentSpaceExtraCheck = function() {
	//console.log( 'ISASEdetAdjacentSpaceExtra.open', ISASEdetAdjacentSpaceExtra.open );

	if ( ISASEdetAdjacentSpaceExtra.open === false && ISCOR.runAll === false ) { return; }

	const oneSpace = [ 'ExteriorWall', 'Roof', 'ExposedFloor', 'UndergroundCeiling', 'UndergroundWall',
		'UndergroundSlab', 'RaisedFloor', 'SlabOnGrade', 'FreestandingColumn', 'EmbeddedColumn' ];

	ISASE.invalidAdjacentSpaceExtra = [];

	const surfaces = GBX.surfaces;

	// refactor to a reduce??
	for ( let i = 0; i < surfaces.length; i++ ) {

		const surface = surfaces[ i ];
		surfaceType = surface.match ( /surfaceType="(.*?)"/ )[ 1 ];
		adjacentSpaceArr = surface.match( /spaceIdRef="(.*?)"/gi );

		if ( surfaceType === "Shade" && adjacentSpaceArr > 0 ) {

			console.log( 'Shade with adjacent space found', 23 );

			ISASE.invalidAdjacentSpaceExtra.push( i );

		} else if ( oneSpace.includes( surfaceType ) && adjacentSpaceArr.length > 1 ) {

			spaces = adjacentSpaceArr.map( item => item.match( /spaceIdRef="(.*?)"/ )[ 1 ] );
			console.log( 'spaces', spaces );

			ISASE.invalidAdjacentSpaceExtra.push( i );

		}

	}

	let color;
	let htmOptions = '';

	for ( let surfaceIndex of ISASE.invalidAdjacentSpaceExtra ) {

		color = color === 'pink' ? '' : 'pink';

		const surfaceText = GBX.surfaces[ surfaceIndex ];

		const id = surfaceText.match( 'id="(.*?)"' )[ 1 ];

		htmOptions +=
			`<option style=background-color:${ color } value=${ surfaceIndex } >${ id }</option>`;
	}

	ISASEselAdjacentSpaceExtra.innerHTML = htmOptions;
	ISASEspnCount.innerHTML = `: ${ ISASE.invalidAdjacentSpaceExtra.length } found`;

	return ISASE.invalidAdjacentSpaceExtra.length;

};



ISASE.getMenuAdjacentSpaceExtra = function() {

	const htm =

	`<details id="ISASEdetAdjacentSpaceExtra" ontoggle=ISASE.getAdjacentSpaceExtraCheck(); >

		<summary>Adjacent Space Extra<span id="ISASEspnCount" ></span></summary>

		<p>
			Surfaces with an invalid adjacent space:
			<ul>
				<li>surface type Shade with one or more adjacent spaces</li>
				<li>surface type such as ExteriorWall or Roof with two or more adjacent spaces</li>
			</ul>
		</p>

		<p>
			<button onclick=ISASE.setAdjacentSpaceExtraShowHide(this,ISASE.invalidAdjacentSpaceExtra); >
				Show/hide Adjacent Space Duplicate surfaces
			</button>
		</p>

		<p>
			Select a surface:<br>
			<select id=ISASEselAdjacentSpaceExtra onchange=ISASE.selectSurfaceUpdate(this); style=width:100%; size=10 >
			</select>
		</p>

		<div id=ISASEdivAdjacentSpaceExtra ></div>

		<div>${ ISASE.currentStatus }</div>

	</details>`;

	return htm;

};



ISASE.setAdjacentSpaceExtraShowHide = function( button, surfaceArray ) {
	//console.log( 'surfaceArray', surfaceArray );

	//THR.scene.remove( POP.line, POP.particle );

	button.classList.toggle( "active" );

	if ( button.classList.contains( 'active' ) && surfaceArray.length ) {

		GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

		surfaceArray.forEach( surfaceId => GBX.surfaceGroup.children[ surfaceId ].visible = true );

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	}

};



ISASE.selectSurfaceUpdate = function( select ) {

	const surfaceId = select.selectedOptions[ 0 ].innerHTML;
	//console.log( 'id', id );

	const surfaceText = GBX.surfaces.find( item => item.includes( surfaceId ) );
	//console.log( 'surfaceIndex', surfaceIndex );

	const adjacentSpaceArr = surfaceText.match( /spaceIdRef="(.*?)"/gi );
	//console.log( 'adjacentSpaceArr', adjacentSpaceArr );

	const spaceIds = adjacentSpaceArr.map( item => item.match( /spaceIdRef="(.*?)"/ )[ 1 ] );

	htm = spaceIds.reduce( ( text, id, index ) => text +
		`<p>
				space <i>${ id }</i>:<br>
				<button onclick=ISASE.spaceShowHide(this,"${ id }"); >show/hide</button><br>
				<button onclick=ISASE.adjacentSpaceDelete("${ id }"); value=${ index } >delete reference</button>
		</p>`,
	"" );

	ISASEdivAdjacentSpaceExtra.innerHTML = htm;

	ISASE.selectedSurfaceFocus( select );

};



ISASE.selectedSurfaceFocus = function( select ) {

	POP.intersected = GBX.surfaceGroup.children[ select.value ];

	POP.getIntersectedDataHtml();

	divPopupData.innerHTML = POP.getIntersectedDataHtml();

};



ISASE.spaceShowHide = function( button, spaceId ) {

	button.classList.toggle( "active" );

	const surfaceIndex = ISASEselAdjacentSpaceExtra.value;

	const children =  GBX.surfaceGroup.children;

	if ( button.classList.contains( 'active' ) ) {

		children.forEach( child => child.visible = false );

		for ( let child of children )  {

			const id = child.userData.index;
			const surface = GBX.surfaces[ id ];
			const arr = surface.match( / spaceIdRef="(.*?)"/g );
			//console.log( 'arr', arr );

			if ( !arr ) { break; }

			arr.forEach( item => child.visible = item.includes( spaceId ) ? true : child.visible );

		}

	} else {

		GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

		GBX.surfaceGroup.children[ surfaceIndex ].visible = true;

	}

};



ISASE.adjacentSpaceDelete = function( spaceId ) {

	//alert( `will delete space id ref ${ id }`)

	const surfaceIndex = ISASEselAdjacentSpaceExtra.value;

	const surfaceTextCurrent = GBX.surfaces[ surfaceIndex ];
	//console.log( 'surfaceText', surfaceText );

	//const adjacentSpaceId = surfaceTextCurrent.match( /<AdjacentSpaceId(.*?)>/gi );
	//console.log( 'adjacentSpaceId', adjacentSpaceId);

	const regex = new RegExp( `<AdjacentSpaceId spaceIdRef="${ spaceId }"\/>`, "gi" );
	const matches = surfaceTextCurrent.match ( regex );
	//console.log( 'matches', matches[ 0 ] );

	const surfaceTextNew = surfaceTextCurrent.replace( matches[ 0 ], '' );
	//console.log( 'surfaceTextNew', surfaceTextNew );

	//const adjacentSpaceId = surfaceTextNew.match( /<AdjacentSpaceId(.*?)>/gi );
	//console.log( 'adjacentSpaceId', adjacentSpaceId);

	const text = GBX.text.replace( surfaceTextCurrent, surfaceTextNew );

	const len = GBX.parseFile( text );
	//console.log( 'len', len );

	ISASEspnCount.innerHTML = '';
	ISASEdivAdjacentSpaceExtra.innerHTML = 'None found';

	ISASEdetAdjacentSpaceExtra.open = false;

};