"use strict";

/* globals MNU, VGC, POP, navDragMove, divDragMoveContent */
// jshint esversion: 6
// jshint loopfunc: true


const FIOEH = {

	"script": {

		"copyright": "Copyright 2019 Ladybug Tools authors",
		"date": "2019-08-21",
		"description": "",
		"helpFile": "js-fixer-3d/fioeh-fix-interior-on-exterior-horizontal.md",
		"license": "MIT License",
		"sourceCode": "js-fixer-3d/fioeh-fix-interior-on-exterior-horizontal.js",
		"version": "0.17.03-0FIOEH",

	}

};


FIOEH.description =
	`
		Interior Floor or Air with Tilt of 0 or 180 on Exterior (FIOEH) allows you display surface types that may be at the exterior of the model incorrectly.

	`;


	//<a id=FIOEHsumHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(FINEHsumHelp,FIOEH.currentStatus);" >&nbsp; ? &nbsp;</a>

FIOEH.getMenuInteriorOnExteriorHorizontal = function() {

	const source =
	`<a href=${ MNU.urlSourceCode + FIOEH.script.sourceCode } target=_blank >${ MNU.urlSourceCodeIcon } source code</a>`;

	const help =
		VGC.getHelpButton('FIOEHsumHelp',FIOEH.script.helpFile,POP.footer,source);


	const htm =

	`<details id="FIOEHdetAirOrInteriorOnExterior" ontoggle=FIOEH.getInteriorOnExteriorCheckHorizontal(); >

		<summary>Check for horizontal interior surface on exterior <span id="FIOEHspnCount" ></span></summary>

		${ help }
		<p>
			${ FIOEH.description }
		</p>

		<p>The following is work-in-progress</p>

		<p>
			1. <button onclick=G3NOR.addNormals(this,FIOEH.meshesInterior); >
				Add normals to horizontal surfaces
			</button>
		</p>

		<p>
			2. <button onclick=FIOEH.castRaysGetIntersections(this,FIOEHfixes); >
				Cast rays and locate intersections
			</button>
		</p>

		<p>
			3. <button onclick=FIOEH.setSurfacesShowHide(this,FIOEH.surfaceIntersections,FIOEH.meshesExterior); title="Starting to work!" >
			Show/hide horizontal surfaces with issues
			</button>
		</p>

		<p>
			<select id=FIOEHselAirOrInteriorOnExterior
				onchange=GF3.selectedSurfaceFocus(this);
				style=width:100%; multiple size=10 >
			</select>
		</p>

		<p>
			<button onclick=FIOEH.showHideSelected(this,FIOEHselAirOrInteriorOnExterior); >
				show/hide selected surfaces</button>
		</p>

		<p id=FIOEHfixes ></p>

		<p>
			Update surface(s) type to:
			<button onclick=FIOEH.setNewSurfaceType(this); style="background-color:#800000;" >Roof</button><br>
		</p>

	</details>`;

	return htm;

};



FIOEH.getInteriorOnExteriorCheckHorizontal = function() {

	const typesInt =  [ "Air", "Ceiling", "InteriorFloor", "UndergroundCeiling" ];
	FIOEH.meshesInterior = GBX.meshGroup.children.filter( mesh => typesInt.includes( mesh.userData.surfaceType ) )

	const typesExt =  [ "ExposedFloor", "RaisedFloor", "Roof", "SlabOnGrade", "UndergroundSlab" ];
	FIOEH.meshesExterior = GBX.meshGroup.children.filter( mesh => typesExt.includes( mesh.userData.surfaceType ) );


	/*
	FIOEH.surfaceAirInteriorIndices = [];

	FIOEHselAirOrInteriorOnExterior.innerHTML = "";

	GBX.surfaces.forEach( ( surface, index ) => {

		const surfaceMatchInterior = surface.match( /surfaceType="InteriorFloor"/ );

		if ( surfaceMatchInterior ) {

			FIOEH.surfaceAirInteriorIndices.push( index );

		}

		const surfaceMatchCeiling = surface.match( /surfaceType="Ceiling"/ );

		if ( surfaceMatchCeiling ) {

			FIOEH.surfaceAirInteriorIndices.push( index );

		}

		const surfaceMatchAir = surface.match( /surfaceType="Air"/ );

		if ( surfaceMatchAir && ( GBX.surfaces[ index ].includes( `Tilt>0<\/Tilt` ) || GBX.surfaces[ index ].includes( `Tilt>180<\/Tilt` ) ) ) {

			FIOEH.surfaceAirInteriorIndices.push( index );

		}

	} );

	return FIOEH.surfaceAirInteriorIndices.length;

	*/

};


FIOEH.castRaysGetIntersections = function( button ) {

	if ( !G3NOR.faceNormals ) { alert("first add the normals"); return; }

	button.classList.add( "active" );

	FIOEH.meshesExterior.forEach( mesh => mesh.visible = true );

	const v = ( x, y, z ) => new THREE.Vector3( x, y, z );
	const normals = G3NOR.faceNormals.children;
	const arr = [];
	let normalsCount = 0;

	for ( let normal of normals ) {

		const coordinates = normal.geometry.attributes.position.array;
		//console.log( 'coordinates', coordinates );

		for ( let i = 0; i < coordinates.length; ) {

			const vertex1 = v( coordinates[ i++ ], coordinates[ i++ ], coordinates[ i++ ] );
			const vertex2 = v( coordinates[ i++ ], coordinates[ i++ ],coordinates[ i++ ] );
			//console.log( 'vertex1', vertex1 );

			const direction = vertex2.clone().sub( vertex1 ).normalize();
			//console.log( 'direction', direction );

			const indexIntersects = FIOEH.getExteriors2( normal.userData.index, vertex1, direction );

			if ( indexIntersects ) {

				// Console.log( 'indexIntersects',  indexIntersects, normal.userData.index );

				const indexChecked = FIOEH.checkForInteriorIntersections( indexIntersects, vertex1, direction );

				if ( indexChecked && arr.includes( indexChecked ) === false ) {

					const mesh = GBX.meshGroup.children[ indexChecked ];
					mesh.material = new THREE.MeshBasicMaterial( { color: 'red', side: 2 });
					mesh.material.needsUpdate = true;

					arr.push( indexChecked );

				}

			}

			normalsCount ++;

		}

	}

	FIOEH.surfaceIntersections = arr;
	//.filter( ( value, index, array ) => array.indexOf ( value ) == index );
	//FIOEH.surfaceIntersections = [ ... new Set( arr ) ];
	//console.log( 'FIOEH.surfaceIntersections', .surfaceIntersections );

	FIOEHfixes.innerHTML =
	`
		Surfaces: ${ FIOEH.meshesInterior.length.toLocaleString() }<br>
		Normals created: ${ normalsCount.toLocaleString() }<br>
		Intersections found: ${ FIOEH.surfaceIntersections.length.toLocaleString() }

		<p>Select multiple surfaces by pressing shift or control keys.</p>

		<p>Use Pop-up menu to zoom and show/hide individual surfaces.</p>

	`;

	FIOEHselAirOrInteriorOnExterior.innerHTML =
		FIOEH.getSelectOptionsIndexes( FIOEH.surfaceIntersections );

};


FIOEH.getSelectOptionsIndexes = function( surfaceIndexes ) {

	let htmOptions = '';
	let count = 1;

	for ( let index of surfaceIndexes ) {

		const surfaceText = GBX.surfaces[ index ];
		//console.log( 'surfaceText', surfaceText );

		const id = surfaceText.match( 'id="(.*?)"' )[ 1 ];

		const cadIdMatch = surfaceText.match( /<CADObjectId>(.*?)<\/CADObjectId>/i );
		const cadId = cadIdMatch ? cadIdMatch[ 1 ] : "";

		const type = surfaceText.match( 'surfaceType="(.*?)"' )[ 1 ];
		let color = GBX.colors[ type ].toString( 16 );
		color = color.length > 4 ? color : '00' + color; // otherwise greens no show

		htmOptions +=
			`<option style=background-color:#${ color } value=${ index } title="${ cadId }" >${ count ++ } - ${ id }</option>`;

	}

	return htmOptions;

};


FIOEH.checkForInteriorIntersections = function( index, origin, direction ) {

	const raycaster = new THREE.Raycaster();

	raycaster.set( origin, direction ); // has to be the correct vertex order
	const intersects1 = raycaster.intersectObjects( FIOEH.meshesInterior ).length;

	raycaster.set( origin, direction.negate() );
	const intersects2 = raycaster.intersectObjects( FIOEH.meshesInterior ).length;

	let indexIntersects = index;

	if ( intersects1 !== 1 && intersects2 !== 1 ) {

		indexIntersects = undefined;

	} else {

		//console.log( 'intersects1', intersects1 );
		//console.log( 'intersects2', intersects2 );

	}

	return indexIntersects;

};


FIOEH.getExteriors2 = function( index, origin, direction ) {

	//console.log( 'FIOEH.meshesExterior', FIOEH.meshesExterior );
	//console.log( 'origin, direction', origin, direction );

	if ( direction.z === 0 ) { return; }

	let indexIntersects;

	const raycaster = new THREE.Raycaster();

	raycaster.set( origin, direction ); // has to be the correct vertex order
	const intersects1 = raycaster.intersectObjects( FIOEH.meshesExterior ).length;
	//console.log( 'intersects1', intersects1 );

	raycaster.set( origin, direction.negate() );
	const intersects2 = raycaster.intersectObjects( FIOEH.meshesExterior ).length;
	//console.log( 'intersects2', intersects2 );


	if ( intersects1 % 2 === 0 || intersects2 % 2 === 0 ) {

		indexIntersects = index;

	} else {

		// Console.log( 'indexIntersects', indexIntersects );

	}


	return indexIntersects;

};




FIOEH.setSurfacesShowHide = function( button, surfaceIndexes = [], meshesExterior = [] ) {
	// used by aoioe*
	//console.log( 'surfaceIndexes', surfaceIndexes );

	//const buttons = Array.from( detMenuEdit.querySelectorAll( 'button' ) );
	//buttons.filter( item => item !== button ).map( item => item.classList.remove( "active" ) );

	button.classList.toggle( "active" );

	if ( button.classList.contains( 'active' ) ) {

		if ( surfaceIndexes.length > 0 ) {

			GBX.meshGroup.children.forEach( mesh => mesh.visible = false );

			surfaceIndexes.forEach( index => GBX.meshGroup.children[ Number( index ) ].visible = true );

			THR.scene.remove( G3NOR.faceNormals );

			//THRU.groundHelper.visible = false;

		} else {

			alert( "No surfaces with issues identified");

		}


	} else {

		if ( meshesExterior.length > 0 ) {

			meshesExterior.forEach( mesh => mesh.visible = true );

		} else {

			GBX.meshGroup.children.forEach( element => element.visible = true );

		}

	}

};