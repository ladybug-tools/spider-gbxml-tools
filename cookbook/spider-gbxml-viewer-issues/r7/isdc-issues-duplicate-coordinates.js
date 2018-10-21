
/* global THR, THREE, GBX */
/* jshint esversion: 6 */
/* jshint loopfunc:true */

// Copyright 2018 Ladybug Tools authors. MIT License


const ISDC = { "release": "SGV Issues R7.1" }

ISDC.getMenuDuplicateCoordinates= function( target ) {

	const htm =

	`<details ontoggle=ISDC.getDuplicateCoordinatesCheck(); >

		<summary>Find Duplicate Coordinates</summary>

		<p><small>
			Two surfaces with the same coordinates
		</small></p>

		<p id=divDuplicatesFound >Duplicate Coordinates</p>

		<p>
			<button id=butDuplicateCoordinates
				onclick=ISDC.setSurfaceArrayVisibleToggle(butDuplicateCoordinates,ISDC.duplicates); >
				toggle all duplicates
			</button>
		</p>
		<!--
		<p>
			<input placeholder="enter an id" >
		</p>
		-->

		<p>
			<select id=ISDCselDuplicate onchange=divDuplicateAttributes.innerHTML=ISDC.getDuplicateAttributes(); style=width:100%; size=10></select>
		</p>

		<!--
		<p>
			<select id=ISDselElementSelect onchange=ISDC.setElementSelect( this ) >
				<option value="id" >ID</option>
				<option value="Name" >Name</option>
				<option value="CADObjectId" >CAD Object ID</option>
			</select>
		</p>
		-->

		<div id=divDuplicateAttributes ></div>
		<p>
			<button onclick=ISDC.setISDCupDuplicateCoordinates(); title="Starting to work!" >
				Fix duplicate surfaces
			</button>
		</p>

		<hr>

	</details>`;

	return htm;

};



////////// Duplicate Coordinates

ISDC.getDuplicateCoordinatesCheck = function() { //R14

	const surfacePolyLoops = [];
	const surfaceIndexes = [];
	//ISDC.duplicateCoordinates = [];
	ISDC.duplicates = [];

	const surfacesJ = GBX.gbjson.Campus.Surface;

	//let spaceId;

	for ( let i = 0; i <  surfacesJ.length; i++ ) {

		const surface = surfacesJ[ i ];
		const points = JSON.stringify( surface.PlanarGeometry.PolyLoop.CartesianPoint );
		const index = surfacePolyLoops.indexOf( points );

		if ( index < 0 ) {

			surfacePolyLoops.push( points );
			surfaceIndexes.push( i );

		} else {

			const surfaceOther = surfacesJ[ surfaceIndexes[ index ] ];

			const existing = ISDC.duplicates.find( item => item[ 0 ] === surfaceOther );

			if ( existing ) {

				existing.push( surface );

			} else {

				ISDC.duplicates.push( [ surfaceOther, surface ] );

			}

		}

	}
	//console.log( 'existing', existing );
	//console.log( 'ISDC.duplicates', ISDC.duplicates );

	let color;
	let htm = '';
	let count = 0;

	for ( surfaces of ISDC.duplicates ) {

		color = color === 'pink' ? '' : 'pink';
		htm +=
		`
			<option style=background-color:${ color } value=${ count } >${ surfaces[0].id }</option>
			<option style=background-color:${ color } value=${ count++ } >${ surfaces[1].id }</option>
		`;

	}

	divDuplicatesFound.innerHTML = `Duplicate surfaces: ${ ISDC.duplicates.length } found`
	ISDCselDuplicate.innerHTML = htm;


};



ISDC.setSurfaceArrayVisibleToggle = function( button, surfaceArray ) {

	if ( button.style.fontStyle !== 'italic' ) {

		//console.log( 'surfaceArray', surfaceArray );

		if ( surfaceArray.length ) {

			GBX.surfaceMeshes.children.forEach( element => element.visible = false );

			for ( let surface of surfaceArray ) {

				console.log( '', surface  );
				const surfaceMesh = GBX.surfaceMeshes.children.find( element => element.userData.gbjson.id === surface[ 0 ].id );
				surfaceMesh.visible = true;
				const surfaceMesh1 = GBX.surfaceMeshes.children.find( element => element.userData.gbjson.id === surface[ 1 ].id );
				surfaceMesh1.visible = true;

			}

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



ISDC.getDuplicateAttributes = function() {

	surfacesJson = ISDC.duplicates[ ISDCselDuplicate.value ];

	//console.log( 'surfacesJson', surfacesJson );

	let htm =
	`
		<button onclick=ISDC.toggleSurfaceVisible(this,surfacesJson[0].id); >Surface 1</button>
		${ ISDC.getAdjacentSpaces( surfacesJson[ 0 ] ) }
		<br>
		${ getAttributes( surfacesJson[ 0 ] ) }
		<br>
		<button onclick=ISDC.toggleSurfaceVisible(this,surfacesJson[1].id);>Surface 2</button>
		${ ISDC.getAdjacentSpaces( surfacesJson[ 1 ] ) }
		<br>
		${ getAttributes( surfacesJson[ 1 ] ) }
	`;

	return htm;


	function getAttributes( obj ) {

		let attributes = '';

		for ( item in obj ) {

			if ( typeof obj[ item ] === 'object' ) { continue }

			attributes += `<div><span class=attributeTitle >${ item }</span>: <span class=attribute >${ obj[ item ] }</span></div>`
		}

		return attributes;

	}

};



ISDC.toggleSurfaceVisible = function( button, id ) {

	const surfaceMesh1 = GBX.surfaceMeshes.children.find( element => element.userData.gbjson.id === id );
	surfaceMesh1.visible = !surfaceMesh1.visible;
	button.style.backgroundColor = button.style.backgroundColor === 'pink' ? '' : 'pink';

};


ISDC.getAdjacentSpaces = function( surfaceJson ) {

	console.log( 'surfaceJson', surfaceJson  );

	if ( !surfaceJson.AdjacentSpaceId ) { return ''; }

	let htm = ''

	if ( Array.isArray( surfaceJson.AdjacentSpaceId ) ) {

		const adj1 = GBX.gbjson.Campus.Building.Space.find( item => item.id = surfaceJson.AdjacentSpaceId[ 0 ].spaceIdRef )
		const adj2 = GBX.gbjson.Campus.Building.Space.find( item => item.id = surfaceJson.AdjacentSpaceId[ 1 ].spaceIdRef )

		htm =
		`
			<br>adjacent spaces:
			<button onclick=ISDC.toggleSpaceVisible(this,"${ adj1.id}"); >${ adj1.Name }</button>
			<button onclick=ISDC.toggleSpaceVisible(this,"${ adj2.id}"); >${ adj2.Name }</button>
		`
	} else {

		const adj = GBX.gbjson.Campus.Building.Space.find( item => item.id = surfaceJson.AdjacentSpaceId.spaceIdRef )

		htm =
		`
		<button onclick=ISDC.toggleSpaceVisible(this,"${ adj.id}"); >${ adj.Name }</button>
	`

	}

	return htm

};




ISDC.toggleSpaceVisible = function( button, spaceId ) {

	const color = button.style.backgroundColor === '' ? 'pink' : '';
	button.style.backgroundColor = color;

	const children =  GBX.surfaceMeshes.children;

	if ( color === '' ) {

		children.forEach( child => child.visible = true );

	} else {

		children.forEach( child => child.visible = false );

		for ( let child of children ) {

			const adjacentSpaceId = child.userData.gbjson.AdjacentSpaceId;
			//console.log( 'adjacentSpaceId', adjacentSpaceId );

			if ( adjacentSpaceId && adjacentSpaceId.spaceIdRef && spaceId === adjacentSpaceId.spaceIdRef ) {

				child.visible = true;

			} else if ( Array.isArray( adjacentSpaceId ) === true ) {

				if ( spaceId === adjacentSpaceId[ 0 ].spaceIdRef || spaceId === adjacentSpaceId[ 1 ].spaceIdRef ) {

					child.visible = true;

				}

			}

		}

	}

};
