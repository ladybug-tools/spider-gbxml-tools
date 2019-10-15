"use strict";

/* globals MNU, VGC, POP, navDragMove, divDragMoveContent */
// jshint esversion: 6
// jshint loopfunc: true


const FIOEH = {

	"script": {

		"copyright": "Copyright 2019 Ladybug Tools authors",
		"date": "2019-08-21",
		"description": "",
		"helpFile": "js-fixer-3d/fioeh-fix-interior-on-exterior-horizontal/fioeh-fix-interior-on-exterior-horizontal.md",
		"license": "MIT License",
		"sourceCode": "js-fixer-3d/fioeh-fix-interior-on-exterior-horizontal/fioeh-fix-interior-on-exterior-horizontal.js",
		"version": "0.17.04-0FIOEH",

	}

};


FIOEH.description =
	`
		Interior Floor or Air with Tilt of 0 or 180 on Exterior (FIOEH) allows you
		to display surface types that may be at the exterior of the model incorrectly.
	`;


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
			1. <button onclick=FIOEH.addNormals(this,FIOEH.meshesInterior); >
				Add normals to horizontal surfaces
			</button>
		</p>

		<p>
			2. <button onclick=FIOEH.castRaysGetIntersections(this); >
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
				Show/hide selected surfaces</button>
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

};



FIOEH.addNormals = function ( button, selectedSurfaces = [] ) {

	// Console.log( 'selectedSurfaces', selectedSurfaces );

	button.classList.add( "active" );

	FIOEH.selectedSurfaces = selectedSurfaces;

	GBX.meshGroup.children.forEach( mesh => mesh.visible = false );

	FIOEH.selectedSurfaces.forEach( mesh => mesh.visible = true );

	//G3NOR.addSurfaceNormalsHelpers();

	THRU.toggleSurfaceNormals();

};



FIOEH.castRaysGetIntersections = function( button ) {

	if ( !THRU.helperNormalsFaces ) { alert("first add the normals"); return; }

	button.classList.add( "active" );

	FIOEH.meshesExterior.forEach( mesh => mesh.visible = true );

	const v = ( x, y, z ) => new THREE.Vector3( x, y, z );
	//const normals = G3NOR.faceNormals.children;
	const normals = THRU.helperNormalsFaces.children;

	const arr = [];
	let raysCastCount = 0;

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

			raysCastCount ++;

		}

	}

	FIOEH.surfaceIntersections = arr;

	FIOEHfixes.innerHTML =
	`
		Surfaces: ${ FIOEH.meshesInterior.length.toLocaleString() }<br>
		Normals created: ${ raysCastCount.toLocaleString() }<br>
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

		// Switch to mesh.userData?
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

		// Console.log( 'intersects1', intersects1 );
		// Console.log( 'intersects2', intersects2 );

	}

	return indexIntersects;

};


FIOEH.getExteriors2 = function( index, origin, direction ) {

	//console.log( 'FIOEH.meshesExterior', FIOEH.meshesExterior );
	// console.log( 'origin, direction', origin, direction );

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


FIOEH.setSurfacesShowHide = function( button, surfaceIndexes = [] ) {

	if ( !THRU.helperNormalsFaces ) { alert("first: 1. add normals and 2. locate intersections"); return; }

	button.classList.toggle( "active" );

	if ( button.classList.contains( 'active' ) ) {

		if ( surfaceIndexes.length > 0 ) {

			GBX.meshGroup.children.forEach( mesh => mesh.visible = false );

			surfaceIndexes.forEach( index => GBX.meshGroup.children[ Number( index ) ].visible = true );

			THRU.helperNormalsFaces.visible = false;

			//THRU.groundHelper.visible = false;

		} else {

			alert( "No surfaces with issues identified");

		}

	} else {

		// if ( FIOEH.meshesExterior.length > 0 ) {

		// 	FIOEH.meshesExterior.forEach( mesh => mesh.visible = true );

		// } else {

			GBX.meshGroup.children.forEach( element => element.visible = true );

		//}

	}



};



FIOEH.showHideSelected = function ( button, select ) {

	const selectedIndices = Array.from( select.selectedOptions ).map( option => option.value );

	FIOEH.setSurfacesShowHide( button, selectedIndices );

}