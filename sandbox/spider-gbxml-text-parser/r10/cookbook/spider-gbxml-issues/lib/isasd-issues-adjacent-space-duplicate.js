// Copyright 2018 Ladybug Tools authors. MIT License
/* globals GBX, POP, divPopupData */
/* jshint esversion: 6 */


const ISASD = { "release": "R10.1", "date": "2018-12-09" };

ISASD.twoSpaces = ['Air', 'InteriorWall', 'InteriorFloor', 'Ceiling' ];


ISASD.currentStatus =
	`
		<aside>

			<details>

				<summary>ISASD ${ ISASD.release} status ${ ISASD.date }</summary>

				<p>This module is new / in progress.</p>

				<p>2018-12-09 ~ Add more functions</p>
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

			//console.log( 'spaceIdRef', spaceIdRef );

			surfaceType = surface.match( /surfaceType="(.*?)"/)[ 1 ];
			if ( ISASD.twoSpaces.indexOf( surfaceType ) < 0 ) { console.log( 'wrong type ', surfaceType ); continue; }

			ISASD.invalidAdjacentSpaceDuplicate.push( i );

		}

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
			<select id=ISASDselAdjacentSpaceDuplicate onchange=ISASD.selectSurfaceUpdate(this); style=width:100%; size=10 >
			</select>
		</p>


		<div id=ISASDdivAdjacentSpaceDuplicate ></div>

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

		surfaceArray.forEach( surfaceId => GBX.surfaceGroup.children[ surfaceId ].visible = true );

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	}

};



ISASD.selectSurfaceUpdate = function( select ) {

	const surfaceId = select.selectedOptions[ 0 ].innerHTML;
	//console.log( 'id', id );

	const surfaceText = GBX.surfaces.find( item => item.includes( surfaceId ) );
	//console.log( 'surfaceIndex', surfaceIndex );

	const adjacentSpaceArr = surfaceText.match( /spaceIdRef="(.*?)"/gi );
	//console.log( 'adjacentSpaceArr', adjacentSpaceArr );

	const spaceIds = adjacentSpaceArr.map( item => item.match( /spaceIdRef="(.*?)"/ )[ 1 ] );

	options = GBX.spaces.reduce( ( text, item, index ) =>
		text + `<option>${ item.match( /<Name>(.*?)<\/Name>/gi ) }</option>`, ''  );


	htm = spaceIds.reduce( ( text, id, index ) => {

		spaceText = GBX.spaces.find( space => space.includes( id ) );
		spaceName = spaceText.match( /<Name>(.*?)<\/Name>/i );


		return text +
		`<p>
				space <i>${ spaceName[ 1 ] }</i>:
		</p>
		<p>
				<button onclick=ISASD.spaceShowHide(this,"${ id }"); >show/hide</button><br>
		<p>
				<select style=width:100%; size=5 >${ options }</select>
		</p>
		<p>

				<button onclick=ISASD.adjacentSpaceUpdate("${ id }"); value=${ index } >update reference</button><br>
		</p>` } ,
	"" );

	ISASDdivAdjacentSpaceDuplicate.innerHTML = htm;

	ISASD.selectedSurfaceFocus( select );

};



ISASD.selectedSurfaceFocus = function( select ) {

	POP.intersected = GBX.surfaceGroup.children[ select.value ];

	POP.getIntersectedDataHtml();

	divPopupData.innerHTML = POP.getIntersectedDataHtml();

};



ISASD.spaceShowHide = function( button, spaceId ) {

	button.classList.toggle( "active" );

	const surfaceIndex = ISASDselAdjacentSpaceDuplicate.value;

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



ISASD.adjacentSpaceUpdate = function( spaceId ) {

	alert( "coming soon");


};