// Copyright 2018 Ladybug Tools authors. MIT License

/* global THR, THREE, GBX */
/* jshint esversion: 6 */
/* jshint loopfunc:true */



const ISDC = { "release": "R9.1", "date": "2018-11-21"  }



ISDC.currentStatus =
`
<aside>

	<details>
		<summary>ISDC ${ ISDC.release} status ${ ISDC.date }</summary>

		<p>This module is ready for light testing, but is still at an early stage of development.</p>

		<p>Whatever further checks you might need could be added here...</p>

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


	const htm =

	`<details ontoggle=ISDC.getDuplicateCoordinatesCheck(); >

		<summary>Duplicate Coordinates: ${ ISDC.duplicates.length / 2 } found</summary>

		<p>
			Two surfaces with the same vertices
		</p>

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
			<button onclick=alert("coming_soon"); title="Starting to work!" >
				Fix duplicate surfaces
			</button>
		</p>

		<div${ ISDC.currentStatus }</div>

	</details>`;

	return htm;

};



////////// Duplicate Coordinates

ISDC.xxxgetDuplicateCoordinatesCheck = function() { //R14

	const surfacePolyLoops = [];
	const surfaceIndexes = [];
	//ISDC.duplicateCoordinates = [];
	ISDC.duplicates = [];

	THR.scene.remove( POP.line, POP.particle );

	GBX.surfaceGroup.children.forEach( element => element.visible = true );

	const surfaces = GBX.surfaces;

	//let spaceId;

	// https://stackoverflow.com/questions/840781/get-all-non-unique-values-i-e-duplicate-more-than-one-occurrence-in-an-array

	for ( let i = 0; i < surfaces.length; i++ ) {

		const surface = surfaces[ i ];

		planar = surface.match( /<PlanarGeometry>(.*?)<\/PlanarGeometry>/ )[ 1 ];

		console.log( 'surface', planar );

		ISDC.duplicates.push( i );


		/*
		const points = JSON.stringify( surface.PlanarGeometry.PolyLoop.CartesianPoint );
		const index = surfacePolyLoops.indexOf( points );

		if ( index < 0 ) {

			surfacePolyLoops.push( points );
			surfaceIndexes.push( i );

		} else {

			const surfaceOther = surfaces[ surfaceIndexes[ index ] ];

			const existing = ISDC.duplicates.find( item => item[ 0 ] === surfaceOther );

			if ( existing ) {

				existing.push( surface );

			} else {

				ISDC.duplicates.push( [ surfaceOther, surface ] );

			}

		}
		*/


	}
	//console.log( 'existing', existing );
	//console.log( 'ISDC.duplicates', ISDC.duplicates );

	/*
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
	*/

};



ISDC.setSurfaceArrayVisibleToggle = function( button, surfaceArray = [] ) {

	//THR.scene.remove( POP.line, POP.particle );

	if ( button.style.fontStyle !== 'italic' ) {

		//console.log( 'surfaceArray', surfaceArray );

		if ( surfaceArray.length ) {

			GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

			for ( let surface of surfaceArray ) {

				const surfaceMesh = GBX.surfaceGroup.children.find( element => Number( element.userData.index ) === surface );

				//console.log( 'surfaceMesh', surfaceMesh  );

				surfaceMesh.visible = true;

			}

		}

		button.style.backgroundColor = 'pink';
		button.style.fontStyle = 'italic';

	} else {

		//GBX.setAllVisible();
		GBX.surfaceGroup.children.forEach( element => element.visible = true );

		button.style.fontStyle = '';
		button.style.backgroundColor = '';
		button.style.fontWeight = '';

	}

};



ISDC.getDuplicateAttributes = function() {

	GBX.surfaceMeshes.children.forEach( element => element.visible = true );

	surfacesJson = ISDC.duplicates[ ISDCselDuplicate.value ];

	//console.log( 'surfacesJson', surfacesJson );

	const msg = surfacesJson[0].id === surfacesJson[1].id ? `<p style=color:red >Surfaces have duplicate surface IDs</p>` : ``;
	let htm =
	`
		<button onclick=ISDC.toggleSurfaceFocus(this,surfacesJson[0].id); >Surface 1</button>
		<button onclick=ISDC.toggleSurfaceVisible(this,surfacesJson[0].id); title="Show or hide selected surface" > &#x1f441; </button>
		<button onclick=ISDC.setSurfaceZoom(surfacesJson[0].id); title="Zoom into selected surface" >⌕</button>
		${ ISDC.getAdjacentSpaces( surfacesJson[ 0 ], "a" ) }
		<br>
		${ getAttributes( surfacesJson[ 0 ] ) }
		<br>

		<button onclick=ISDC.toggleSurfaceFocus(this,surfacesJson[1].id); >Surface 2</button>
		<button onclick=ISDC.toggleSurfaceVisible(this,surfacesJson[1].id); title="Show or hide selected surface" > &#x1f441; </button>
		<button onclick=ISDC.setSurfaceZoom(surfacesJson[1].id); title="Zoom into selected surface" >⌕</button>
		${ ISDC.getAdjacentSpaces( surfacesJson[ 1 ] , "b" ) }
		<br>
		${ getAttributes( surfacesJson[ 1 ] ) }
		${ msg }
	`;

	return htm;


	function getAttributes( obj ) {

		let attributes = '';

		for ( item in obj ) {

			if ( typeof obj[ item ] === 'object' ) { continue }

			attributes += `<div><span class=attributeTitle >${ item }</span>: <span class=attributeValue >${ obj[ item ] }</span></div>`
		}

		return attributes;

	}

};



ISDC.toggleSurfaceFocus = function( button, surfaceId ) {

	THR.scene.remove( POP.line, POP.particle );
	const color = button.style.backgroundColor === '' ? 'pink' : '';
	button.style.backgroundColor = color;

	//ISDCbutAdjacentSpace1.style.backgroundColor = '';
	//ISDCbutAdjacentSpace2.style.backgroundColor = '';

	if ( color === 'pink' ) {

		GBX.surfaceMeshes.children.forEach( child => child.visible = false );

		const surfaceMesh1 = GBX.surfaceMeshes.children.find( element => element.userData.gbjson.id === surfaceId );

		surfaceMesh1.visible = true;

	} else {

		GBX.surfaceMeshes.children.forEach( child => child.visible = true );

	}

	//const surfaceJson = ISDC.intersected.userData.gbjson;
	//ISDCelementAttributes.innerHTML = ISDC.getSurfaceAttributes( surfaceJson );

};




ISDC.toggleSurfaceVisible = function( button, id ) {

	THR.scene.remove( POP.line, POP.particle );

	const surfaceMesh1 = GBX.surfaceMeshes.children.find( element => element.userData.gbjson.id === id );
	surfaceMesh1.visible = !surfaceMesh1.visible;
	button.style.backgroundColor = button.style.backgroundColor === 'pink' ? '' : 'pink';

};



ISDC.getAdjacentSpaces = function( surfaceJson, suffix ) {

	//console.log( 'surfaceJson', surfaceJson  );

	THR.scene.remove( POP.line, POP.particle );

	if ( !surfaceJson.AdjacentSpaceId ) { return ''; }

	let htm = '';

	if ( Array.isArray( surfaceJson.AdjacentSpaceId ) ) {

		//console.log( 'surfaceJson.AdjacentSpaceId 0', surfaceJson.AdjacentSpaceId[ 0 ].spaceIdRef );
		//console.log( 'surfaceJson.AdjacentSpaceId 1', surfaceJson.AdjacentSpaceId[ 1 ].spaceIdRef );

		const adj1 = GBX.gbjson.Campus.Building.Space.find( item => item.id === surfaceJson.AdjacentSpaceId[ 0 ].spaceIdRef )
		const adj2 = GBX.gbjson.Campus.Building.Space.find( item => item.id === surfaceJson.AdjacentSpaceId[ 1 ].spaceIdRef )

		//console.log( 'adj1', adj1 );
		//console.log( 'adj2', adj2 );

		htm =
		`
			<br>adjacent spaces:
			<button id=ISDCbutAdjacentSpace1${ suffix } onclick=ISDC.toggleSpaceVisible(this,"${ adj1.id }","${ adj2.id }","ISDCbutAdjacentSpace1${ suffix }"); >${ adj1.Name }</button>
			<button id=ISDCbutAdjacentSpace2${ suffix } onclick=ISDC.toggleSpaceVisible(this,"${ adj1.id }","${ adj2.id }","ISDCbutAdjacentSpace1${ suffix }" ); >${ adj2.Name }</button>
		`
	} else {

		const adj = GBX.gbjson.Campus.Building.Space.find( item => item.id = surfaceJson.AdjacentSpaceId.spaceIdRef )

		htm =
		`
		<button id=ISDCbutAdjacentSpace1${ suffix } onclick=ISDC.toggleSpaceVisible(this,"${ adj.id}","","ISDCbutAdjacentSpace1${ suffix }"); >${ adj.Name }</button>
	`

	}

	return htm

};



ISDC.toggleSpaceVisible = function( button, spaceId1, spaceId2, id ) {
	console.log( 'id', id );
	const color = button.style.backgroundColor === '' ? 'pink' : '';
	button.style.backgroundColor = color;

	console.log( 'bb', ISDCbutAdjacentSpace1a );
	const color1=ISDCbutAdjacentSpace1a.style.backgroundColor;
	ref1 = color1 === '' ? '' : spaceId1;
	const color2 = ISDCbutAdjacentSpace2a.style.backgroundColor || '';
	ref2 = color2 === '' ? '' : spaceId2;

/* 	ISDCbutSurfaceFocus.style.backgroundColor = '';
	ISDCbutSurfaceVisible.style.backgroundColor = '';
	ISDCbutStoreyVisible.style.backgroundColor = '';
	ISDCbutZoneVisible.style.backgroundColor = ''; */

	const children =  GBX.surfaceMeshes.children;

	if ( color1 === '' && color2 === '' ) {

		children.forEach( child => child.visible = true );

	} else {

		children.forEach( child => child.visible = false );

		for ( let child of children ) {

			let adjacentSpaceId = child.userData.gbjson.AdjacentSpaceId;

			adjacentSpaceId = Array.isArray( adjacentSpaceId ) ? adjacentSpaceId : [ adjacentSpaceId ];

			adjacentSpaceId.forEach( item => child.visible = item && ( item.spaceIdRef === ref1 || item.spaceIdRef === ref2 ) ? true : false );

		}

	}

	spaceJson = GBX.gbjson.Campus.Building.Space.find( item => item.id === spaceId1 );
	//console.log( 'spaceJson', spaceJson );

	htmSpace = ISDC.getAttributesHtml( spaceJson );

	const htm =
	`
		<b>Space Attributes</b>
		${ htmSpace }
	`;

	ISDCelementAttributes.innerHTML = htm;

};


ISDC.xxxtoggleSpaceVisible = function( button, spaceId ) {

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


ISDC.setSurfaceZoom = function( surfaceId ) {
	//console.log( 'id', id );

	const surfaceMesh = GBX.surfaceMeshes.children.find( element => element.userData.gbjson.id === surfaceId );


	ISDC.setCameraControls( [ surfaceMesh ] );

};
