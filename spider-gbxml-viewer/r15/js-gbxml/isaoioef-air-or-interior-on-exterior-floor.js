// Copyright 2018 Ladybug Tools authors. MIT License
/* globals THREE, GBX, ISRC, ISAOIOEFdetAirOrInteriorOnExterior,ISAOIOEFselAirOrInteriorOnExterior */
/* jshint esversion: 6 */

// depends on ISRC

const ISAOIOEF = { "release": "R15.2", "date": "2019-03-13" };


ISAOIOEF.description =
	`
		Interior Floor or Air with Tilt of 0 or 180 on Exterior (ISAOIOEF) allows you display surface types that may be at the exterior of the model incorrectly.

	`;


ISAOIOEF.currentStatus =
	`
		<summary>Interior Floor or Air on Exterior (ISAOIOEF) ${ ISAOIOEF.release} ~ ${ ISAOIOEF.date }</summary>

		<p>
			${ ISAOIOEF.description }
		</p>

		<p>This module is a work-in-progress. See Issues and Wish List for details.</p>
		<p>
			<a href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/r15/js-gbxml/isaoioef-air-or-interior-on-exterior-floor.js" target="_blank" >
			Air or Interior Floor or on Exterior source code
			</a>
		</p>

		<details>

			<summary>Usage</summary>

			<p>
				The current test case file for this project <a href="#https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/zip/TypicalProblems-AirSurface.zip" >TypicalProblems-AirSurface.zip</a>
				in the <a href="https://github.com/ladybug-tools/spider/tree/master/gbxml-sample-files" target="_blank">Spider gbXML sample files folder</a>.
			</p>

			<p>
				The test case may be loaded by refreshing the web page or pressing F5.
				Click the title in the menu to return to the default file.
			</p>

			<p>Usage is still at an early stage. </p>

			<p>
				Identifying external InteriorWall surfaces is a work-in-progress.
				The web page should be reloaded between each session.
				Click the numbered boxes in numerical order.
				Various normals and sprites at intersection will be drawn. These are for testing while developing and will not appear in final version.
			</p>

			<p>Editing surface types and saving your edits has not yet been started.</p>

		</details>

		<details>

			<summary>Methodology</summary>

			<p>See also Wikipedia: <a href="https://en.wikipedia.org/wiki/Point_in_polygon" target="_blank">Point in polygon</a></p>

			1. Identify the triangles used to create a Three.js tht represents a gbXML surface.<br>
			2. Create a Three.js 'ray' for each side of the identified triangles.<br>
			3. The ray follows the normal for that triangle at the center point of the triangle.<br>
			4. If one of the rays finds no intersections or an even number of intersections on one side then we know that there is no exterior type surface between the current surface and the exterior.

		</details>


		<details>
			<summary>Issues</summary>

			<ul>

				<li>2019-03-12 ~ Move more functions to ISRC. Select list box now handles multi-select. Add button to show/hide selected.</li>
				<li>
					2019-03-11 ~ When the exterior of a model has holes/is non-manifold,
					a number of false positives may be generated
					- along with the actual surface that is on the exterior.
					Future versions of algorithm should reduce the number of false positives.
				</li>
				<li>2019-02-13 ~ what to show in select box? ID? Name?</li>
				<li>2019-02-13 ~ Only works once - must reload between each run << 2019-03-11 ~ getting better</li>
			</ul>

		</details>


		<details>
			<summary>Wish List / To Do</summary>
			<ul>
				<li>
					2019-02-15 ~ Easy access to identify the currently selected surfaces in the
					menu select list box and display these in the 3D model space
				</li>
				<li>2019-02-15 ~ Save changes to files</li>
			</ul>
		</details>

		<details>
			<summary>Change log</summary>
			<ul>
				<li>2019-03-13 ~ R15.2 ~ Many fixes</li>
				<li>2019-03-11 ~ Move normals remove to ISRC. Add back vertical air surface types</li>
				<li>2019-03-11 ~ Following well underway</li>
					<ul>
					<li>2019-02-15 ~ Identify separately vertical and horizontal surfaces</li>
					<li>2019-02-15 ~ Show/hide identified incorrect surfaces</li>
					<li>2019-02-14 ~ Reset variables when loading new file/li>
					<li>2019-02-14 ~ Handle models with concavities</li>
				</ul>
				<li>2019-03-08 ~ R15.1 ~ Many fixes. Checks normals for both sides of surfaces</li>
				<li>2019-03-05 ~ first commit</li>
			</ul>
		</details>
	`;



ISAOIOEF.getMenuAirOrInteriorFloorOnExterior = function() {

	const htm =

	`<details id="ISAOIOEFdetAirOrInteriorOnExterior" ontoggle=ISAOIOEF.getAirOrInteriorOnExteriorCheck(); >

		<summary>InteriorFloor on Exterior<span id="ISAOIOEFspnCount" ></span>
			<a id=ISAOIOEFsumHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(ISAOIOEFsumHelp,ISAOIOEF.currentStatus);" >&nbsp; ? &nbsp;</a>
		</summary>

		<p>
			${ ISAOIOEF.description }
		</p>

		<p>The following is work-in-progress</p>

		<p>
			1. <button onclick=ISRC.addNormals(this,ISAOIOEF.surfaceAirInteriorIndices,ISAOIOEFselAirOrInteriorOnExterior,ISAOIOEFfixes); >
				add normals to InteriorWall surfaces</button><br>
		</p>

		<p>
			2. <button onclick=ISAOIOEF.castRaysGetIntersections(this,ISAOIOEFfixes); >cast rays get intersections</button><br>
		</p>

		<p>
			<button onclick=ISRC.setSurfaceArrayShowHide(this,ISAOIOEF.surfaceIntersections); title="Starting to work!" >
			show/hide floors with issues
			</button>
		</p>

		<p>
			<select id=ISAOIOEFselAirOrInteriorOnExterior onchange=ISRC.selectedSurfaceFocus(this); style=width:100%; multiple size=10 >
			</select>
		</p>

		<p>
			<button onclick=ISRC.showHideSelected(this,ISAOIOEFselAirOrInteriorOnExterior); >show/hide selected surfaces</button>
		</p>

		<p id=ISAOIOEFfixes ></p>

		<p>
			Update surface(s) type to:
			<button onclick=ISAOIOEF.setNewSurfaceType(this); style="background-color:#800000;" >Roof</button><br>
		</p>

	</details>`;

	return htm;

};



ISAOIOEF.getAirOrInteriorOnExteriorCheck = function() {

	ISAOIOEF.surfaceAirInteriorIndices = [];

	const buttons = ISAOIOEFdetAirOrInteriorOnExterior.querySelectorAll( "button" );

	buttons.forEach( button => button.classList.remove( "active" ) );

	ISAOIOEFselAirOrInteriorOnExterior.innerHTML = "";

	GBX.surfaces.forEach( ( surface, index ) => {

		const surfaceMatchInterior = surface.match( /surfaceType="InteriorFloor"/ );

		if ( surfaceMatchInterior ) {

			ISAOIOEF.surfaceAirInteriorIndices.push( index );

		}

		const surfaceMatchCeiling = surface.match( /surfaceType="Ceiling"/ );

		if ( surfaceMatchCeiling ) {

			ISAOIOEF.surfaceAirInteriorIndices.push( index );

		}

		const surfaceMatchAir = surface.match( /surfaceType="Air"/ );

		if ( surfaceMatchAir && ( GBX.surfaces[ index ].includes( `Tilt>0<\/Tilt` ) || GBX.surfaces[ index ].includes( `Tilt>180<\/Tilt` ) ) ) {

			ISAOIOEF.surfaceAirInteriorIndices.push( index );

		}

	} );

	return ISAOIOEF.surfaceAirInteriorIndices.length;

};



ISAOIOEF.castRaysGetIntersections = function( button ) {

	button.classList.toggle( "active" );

	ISRC.setMeshesExterior( [ "ExposedFloor", "RaisedFloor", "Roof", "SlabOnGrade", "UndergroundSlab" ] );
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

			indexIntersects = ISAOIOEF.getExteriors2( normal.userData.index, vertex1, direction );

			//console.log( '',  indexIntersects, normal.userData.index );

			if ( indexIntersects ) {

				indexChecked = ISAOIOEF.checkForInteriorIntersections( indexIntersects, vertex1, direction );

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

	ISAOIOEF.surfaceIntersections = arr; //.filter( ( value, index, array ) => array.indexOf ( value ) == index );
	//ISAOIOEF.surfaceIntersections = [ ... new Set( arr ) ];
	//console.log( 'ISAOIOEF.surfaceIntersections', .surfaceIntersections );

	ISRC.targetLog.innerHTML =
	`
		Surfaces: ${ ISAOIOEF.surfaceAirInteriorIndices.length.toLocaleString() }<br>
		Normals created: ${ normalsCount.toLocaleString() }<br>
		intersections found: ${ ISAOIOEF.surfaceIntersections.length.toLocaleString() }

		<p>Select multiple surfaces by pressing shift or control keys.</p>

		<p>Use Pop-up menu to zoom and show/hide individual surfaces.</p>

	`;

	ISRC.targetSelect.innerHTML = ISRC.getSelectOptionsIndexes( ISAOIOEF.surfaceIntersections );

};




ISAOIOEF.checkForInteriorIntersections = function( index, origin, direction ) {

	if ( !ISAOIOEF.meshesInteriorVertical ) {

		ISAOIOEF.meshesInteriorVertical = ISRC.getMeshesByType( [ "Air", "Ceiling", "InteriorFloor", "UndergroundCeiling" ] );

	}
	//console.log( 'ISAOIOEF.meshesInteriorVertical', ISAOIOEF.meshesInteriorVertical);

	const raycaster = new THREE.Raycaster();

	raycaster.set( origin, direction ); // has to be the correct vertex order
	const intersects1 = raycaster.intersectObjects( ISAOIOEF.meshesInteriorVertical ).length;

	raycaster.set( origin, direction.negate() );
	const intersects2 = raycaster.intersectObjects( ISAOIOEF.meshesInteriorVertical ).length;

	let indexIntersects = index;

	if ( intersects1 !== 1 && intersects2 !== 1 ) {

		indexIntersects = undefined;

	} else {

		//console.log( 'intersects1', intersects1 );
		//console.log( 'intersects2', intersects2 );

	}

	return indexIntersects;

};



ISAOIOEF.getExteriors2 = function( index, origin, direction ) {

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