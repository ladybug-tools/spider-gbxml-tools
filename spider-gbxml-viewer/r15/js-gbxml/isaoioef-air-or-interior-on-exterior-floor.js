// Copyright 2018 Ladybug Tools authors. MIT License
/* globals THR, THRU, THREE, GBX, ISRC, ISAOIOEFdetAirOrInteriorOnExterior,ISAOIOEFselAirOrInteriorOnExterior */
/* jshint esversion: 6 */

// depends on ISRC

const ISAOIOEF = { "release": "R15.0", "date": "2019-03-11" };


ISAOIOEF.description =
	`
		Interior Floor or Air with Tilt of 0 or 180 on Exterior (ISIOE) allows you display surface types that may be at the exterior of the model incorrectly.

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
				The current test case file for this project <a href="#https://rawgit.com/ladybug-tools/spider/master/gbxml-sample-files/zip/TypicalProblems-AirSurface.zip" >TypicalProblems-AirSurface.zip</a>
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
			<button onclick=ISAOIOEF.setSurfaceArraysShowHide(this,ISAOIOEF.surfaceIntersections); title="Starting to work!" >
			show/hide walls with issues
			</button>
		</p>

		<p>
			<select id=ISAOIOEFselAirOrInteriorOnExterior onchange=ISRC.selectedSurfaceFocus(this); style=width:100%; multiple size=10 >
			</select>
		</p>

		<p id=ISAOIOEFfixes >
			Air/Interior surfaces on exterior identified: run test<br>
			Identified by Inside Polygon method: run test
		</p>

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

	const v = ( x, y, z ) => new THREE.Vector3( x, y, z );
	let normalsCount = 0;
	ISAOIOEF.surfaceIntersections = [];

	const normals = ISRC.normalsFaces.children;
	//console.log( 'normals', normals );

	ISAOIOEF.meshesExterior = [];

	const surfacesExterior = [ "ExposedFloor", "Roof", "SlabOnGrade", "UndergroundSlab" ];

	GBX.surfaces.forEach( ( surface, index ) => {

		if ( surfacesExterior.includes( surface.match( /surfaceType="(.*?)"/ )[ 1 ] ) ) {

			ISAOIOEF.meshesExterior.push( GBX.surfaceGroup.children[ index ] );

		}

	} );
	//console.log( 'ISAOIOEF.meshesExterior', ISAOIOEF.meshesExterior );

	ISAOIOEF.meshesExterior.forEach( mesh => mesh.visible = true );


	for ( let normal of normals ) {

		const coordinates = normal.geometry.attributes.position.array;
		//console.log( 'coordinates', coordinates );

		for ( let i = 0; i < coordinates.length; ) {

			const vertex1 = v( coordinates[ i++ ], coordinates[ i++ ], coordinates[ i++ ] );
			const vertex2 = v( coordinates[ i++ ], coordinates[ i++ ],coordinates[ i++ ] );
			//console.log( 'vertex1', vertex1 );

			const direction = vertex2.clone().sub( vertex1 ).normalize();
			//console.log( 'direction', direction );

			ISAOIOEF.findIntersections( normal.userData.index, vertex1, direction );
			//console.log( 'intersections', intersections );

			normalsCount++;

		}

	}
	//console.log( 'ISAOIOEF.surfaceIntersectionArrays', ISAOIOEF.surfaceIntersectionArrays );

	ISRC.targetLog.innerHTML =
	`
		Surfaces: ${ ISAOIOEF.surfaceAirInteriorIndices.length.toLocaleString() }<br>
		Normals created: ${ normalsCount.toLocaleString() }<br>
		intersections found: ${ ISAOIOEF.surfaceIntersections.length.toLocaleString() }

		<p>Use Pop-up menu to zoom and show/hide individual surfaces.</p>

		<p><i>Better user-interface and best ways of fixing issues: TBD.</i></p>
	`;

	ISRC.targetSelect.innerHTML = ISAOIOEF.getSelectOptions( ISAOIOEF.surfaceIntersections );

};



ISAOIOEF.findIntersections = function( index, origin, direction ) {

	const raycaster = new THREE.Raycaster();
	raycaster.set( origin, direction ); // has to be the correct vertex order

	const intersects1 = raycaster.intersectObjects( ISAOIOEF.meshesExterior );

	raycaster.set( origin, direction.negate() );
	const intersects2 = raycaster.intersectObjects( ISAOIOEF.meshesExterior );

	if ( intersects1.length % 2 === 0 || intersects2.length % 2 === 0 ) {

			const mesh = GBX.surfaceGroup.children[ index ];
			mesh.material = new THREE.MeshBasicMaterial( { color: 'red', side: 2 });
			mesh.material.needsUpdate = true;

			if ( ISAOIOEF.surfaceIntersections.includes( index ) === false ) { ISAOIOEF.surfaceIntersections.push( index ); }
	}

	return ISAOIOEF.surfaceIntersections.length;

};



ISAOIOEF.setSurfaceArraysShowHide = function( button, surfaceIndexArray ) {
	//console.log( 'surfaceIndexArray', surfaceIndexArray );

	button.classList.toggle( "active" );

	if ( button.classList.contains( 'active' ) && surfaceIndexArray.length ) {

		GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

		surfaceIndexArray.forEach( index => GBX.surfaceGroup.children[ Number( index ) ].visible = true );

		THR.scene.remove( ISRC.normalsFaces );

		THRU.groundHelper.visible = false;

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

		THRU.groundHelper.visible = true;

	}

};



ISAOIOEF.getSelectOptions = function( surfaceArrays ) {

	let htmOptions = '';
	let count = 1;

	for ( let index of surfaceArrays ) {

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
