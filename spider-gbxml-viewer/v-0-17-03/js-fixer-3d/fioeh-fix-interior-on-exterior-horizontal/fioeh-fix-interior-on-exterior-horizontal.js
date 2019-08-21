// Copyright 2018 Ladybug Tools authors. MIT License
// globals THREE, GBX, ISRC, FIOEHdetAirOrInteriorOnExterior,FIOEHselAirOrInteriorOnExterior
// jshint esversion: 6

// depends on ISRC

const FIOEH = {

	"release": "R15.2", "date": "2019-03-13"

};


FIOEH.description =
	`
		Interior Floor or Air with Tilt of 0 or 180 on Exterior (FIOEH) allows you display surface types that may be at the exterior of the model incorrectly.

	`;



FIOEH.getMenuInteriorOnExteriorHorizontal = function() {

	const htm =

	`<details id="FIOEHdetAirOrInteriorOnExterior" ontoggle=FIOEH.getInteriorOnExteriorCheckHorizontal(); >

		<summary>Interior surface on exterior horizontal<span id="FIOEHspnCount" ></span>
		</summary>

		<a id=FIOEHsumHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(FIOEHsumHelp,FIOEH.currentStatus);" >&nbsp; ? &nbsp;</a>
		<p>
			${ FIOEH.description }
		</p>

		<p>The following is work-in-progress</p>

		<p>
			1. <button onclick=ISRC.addNormals(this,FIOEH.surfaceAirInteriorIndices,FIOEHselAirOrInteriorOnExterior,FIOEHfixes); >
				add normals to InteriorWall surfaces</button><br>
		</p>

		<p>
			2. <button onclick=FIOEH.castRaysGetIntersections(this,FIOEHfixes); >cast rays get intersections</button><br>
		</p>

		<p>
			3. <button onclick=ISRC.setSurfacesShowHide(this,FIOEH.surfaceIntersections,ISRC.meshesExterior); title="Starting to work!" >
			show/hide floors with issues
			</button>
		</p>

		<p>
			<select id=FIOEHselAirOrInteriorOnExterior onchange=ISRC.selectedSurfaceFocus(this); style=width:100%; multiple size=10 >
			</select>
		</p>

		<p>
			<button onclick=ISRC.showHideSelected(this,FIOEHselAirOrInteriorOnExterior); >show/hide selected surfaces</button>
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

	FIOEH.surfaceAirInteriorIndices = [];

	const buttons = FIOEHdetAirOrInteriorOnExterior.querySelectorAll( "button" );

	buttons.forEach( button => button.classList.remove( "active" ) );

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

};



FIOEH.castRaysGetIntersections = function( button ) {

	if ( !ISRC.normalsFaces ) { alert("first add the normals"); return; }

	button.classList.toggle( "active" );

	ISRC.meshesExterior = ISRC.getMeshesByType( [ "ExposedFloor", "RaisedFloor", "Roof", "SlabOnGrade", "UndergroundSlab" ] );
	ISRC.meshesExterior.forEach( mesh => mesh.visible = true );

	const normals = ISRC.normalsFaces.children;
	//console.log( 'normals', normals );
	let normalsCount = 0;
	const arr = [];
	const v = ( x, y, z ) => new THREE.Vector3( x, y, z );

	for ( let normal of normals ) {

		const coordinates = normal.geometry.attributes.position.array;
		//console.log( 'coordinates', coordinates );

		for ( let i = 0; i < coordinates.length; ) {

			const vertex1 = v( coordinates[ i++ ], coordinates[ i++ ], coordinates[ i++ ] );
			const vertex2 = v( coordinates[ i++ ], coordinates[ i++ ],coordinates[ i++ ] );
			//console.log( 'vertex1', vertex1 );

			const direction = vertex2.clone().sub( vertex1 ).normalize();
			//console.log( 'direction', direction );

			//arr.push( ...ISRC.getExteriors( normal.userData.index, vertex1, direction ) );

			indexIntersects = FIOEH.getExteriors2( normal.userData.index, vertex1, direction );

			//console.log( '',  indexIntersects, normal.userData.index );

			if ( indexIntersects ) {

				indexChecked = FIOEH.checkForInteriorIntersections( indexIntersects, vertex1, direction );

				if ( indexChecked && arr.includes( indexChecked ) === false ) {

					const mesh = GBX.surfaceGroup.children[ indexChecked ];
					mesh.material = new THREE.MeshBasicMaterial( { color: 'red', side: 2 });
					mesh.material.needsUpdate = true;

					arr.push( indexChecked );

				}

			}

			normalsCount ++;

		}

	}

	FIOEH.surfaceIntersections = arr; //.filter( ( value, index, array ) => array.indexOf ( value ) == index );
	//FIOEH.surfaceIntersections = [ ... new Set( arr ) ];
	//console.log( 'FIOEH.surfaceIntersections', .surfaceIntersections );

	ISRC.targetLog.innerHTML =
	`
		Surfaces: ${ FIOEH.surfaceAirInteriorIndices.length.toLocaleString() }<br>
		Normals created: ${ normalsCount.toLocaleString() }<br>
		intersections found: ${ FIOEH.surfaceIntersections.length.toLocaleString() }

		<p>Select multiple surfaces by pressing shift or control keys.</p>

		<p>Use Pop-up menu to zoom and show/hide individual surfaces.</p>

	`;

	ISRC.targetSelect.innerHTML = ISRC.getSelectOptionsIndexes( FIOEH.surfaceIntersections );

};




FIOEH.checkForInteriorIntersections = function( index, origin, direction ) {

	if ( !FIOEH.meshesInteriorVertical ) {

		FIOEH.meshesInteriorVertical = ISRC.getMeshesByType( [ "Air", "Ceiling", "InteriorFloor", "UndergroundCeiling" ] );

	}
	//console.log( 'FIOEH.meshesInteriorVertical', FIOEH.meshesInteriorVertical);

	const raycaster = new THREE.Raycaster();

	raycaster.set( origin, direction ); // has to be the correct vertex order
	const intersects1 = raycaster.intersectObjects( FIOEH.meshesInteriorVertical ).length;

	raycaster.set( origin, direction.negate() );
	const intersects2 = raycaster.intersectObjects( FIOEH.meshesInteriorVertical ).length;

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

	const raycaster = new THREE.Raycaster();

	raycaster.set( origin, direction ); // has to be the correct vertex order
	const intersects1 = raycaster.intersectObjects( ISRC.meshesExterior ).length;

	raycaster.set( origin, direction.negate() );
	const intersects2 = raycaster.intersectObjects( ISRC.meshesExterior ).length;

	let indexIntersects;

	if ( intersects1 % 2 === 0 || intersects2 % 2 === 0 ) {

		indexIntersects = index;

	}

	return indexIntersects;

};