// Copyright 2018 Ladybug Tools authors. MIT License
/* globals THR, THRU, THREE, GBX, POP, ISCOR, ISAOIOEdetAirOrInteriorOnExterior,ISAOIOEselAirOrInteriorOnExterior,
ISAOIOEspnCount, ISAOIOEbutViewSelected,ISAOIOEbutViewAll, ISAOIOEpNumberSurfacesVisible, ISAOIOEfixes, divPopUpData */
/* jshint esversion: 6 */


const ISAOIOE = { "release": "R15.1", "date": "2019-03-08" };

let count2 = 0;


ISAOIOE.description =
	`
		Interior Wall on Exterior (ISIOE) allows you display InteriorWall surface types that may be at the exterior of the model.

	`;


ISAOIOE.currentStatus =
	`
		<summary>Interior Wall on Exterior (ISIOE) ${ ISAOIOE.release} ~ ${ ISAOIOE.date }</summary>

		<p>
			${ ISAOIOE.description }
		</p>

		<p>
			<a href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/r15/js-gbxml/isAOIOE-issues-air-surface-type-editor.js" target="_blank" >
			Interior on Exterior source code
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

			<p>Select box and buttons should be working as expected.</p>

			<p>
				Identifying external InteriorWall surfaces is a work-in-progress.
				<span class=highlight>The web page must be reloaded between each session.</span>
				Click the numbered boxes in numerical order.
				Various normals and sprites at intersection will be drawn. These are for testing while developing and will not appear in final version.
			</p>

			<p>Editing surface types and saving your edits has not yet been started.</p>

		</details>

		<details>
			<summary>Methodology</summary>

			<p>See also Wikipedia: <a href="https://en.wikipedia.org/wiki/Point_in_polygon" target="_blank">Point in polygon</a></p>

			Create a Three.js 'ray' for each side of an Air surface type.
			The ray follows the normal for that surface at the center point of the surface.
			If one of the rays finds no intersections on one side then we know that the surface must be on the exterior.
			If both rays find intersections then we know the surface must be inside the model.

		</details>


		<details>
			<summary>Issues</summary>
			<ul>
				<li>2019-02-13 ~ what to show in select box? ID? Name?</li>
				<li>2019-02-13 ~ Only works once - must reload between each run </li>
			</ul>

		</details>


		<details>
			<summary>Wish List / To Do</summary>
			<ul>

				<li>2019-02-15 ~ Easy access to show edges external vertical and/or horizontal surfaces</li>
				<li>2019-02-15 ~ Save changes to files</li>
				<li>2019-02-15 ~ Identify separately vertical and horizontal surfaces</li>
				<li>2019-02-15 ~ Show/hide identified incorrect surfaces</li>
				<li>2019-02-14 ~ Reset variables when loading new file/li>
				<li>2019-02-14 ~ Handle models with concavities</li>
			</ul>
		</details>

		<details>
			<summary>Change log</summary>
			<ul>
				<li>2019-03-08 ~ R15.1 ~ Many fixes. Checks normals for both sides of surfaces</li>
				<li>2019-03-05 ~ first commit</li>
			</ul>
		</details>
	`;



ISAOIOE.getMenuAirOrInteriorOnExterior = function() {

	const htm =

	`<details id="ISAOIOEdetAirOrInteriorOnExterior" ontoggle=ISAOIOE.getAirOrInteriorOnExteriorCheck(); >

		<summary>InteriorWall on Exterior<span id="ISAOIOEspnCount" ></span>
			<a id=ISAOIOEsumHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(ISAOIOEsumHelp,ISAOIOE.currentStatus);" >&nbsp; ? &nbsp;</a>
		</summary>

		<p>
			${ ISAOIOE.description }
		</p>

		<p>The following is work-in-progress</p>

		<p>
			1. <button onclick=ISRC.addNormals(this,ISAOIOE.surfaceAirInteriorIndices,ISAOIOEselAirOrInteriorOnExterior,ISAOIOEfixes); >
				add normals to InteriorWall surfaces</button><br>
		</p>

		<p>
			2. <button onclick=ISAOIOE.castRaysGetIntersections(this,ISAOIOEfixes); >cast rays get intersections</button><br>
		</p>

		<p>
			<button onclick=ISAOIOE.setSurfaceArraysShowHide(this,ISAOIOE.surfaceIntersections); title="Starting to work!" >
			show/hide wall with issues
			</button>
		</p>

		<p>
			<select id=ISAOIOEselAirOrInteriorOnExterior onchange=ISRC.selectedSurfaceFocus(this); style=width:100%; multiple size=10 >
			</select>
		</p>

		<p id=ISAOIOEfixes >
			Air/Interior surfaces on exterior identified: run test<br>
			Identified by Inside Polygon method: run test
		</p>

		<p>
			Update surface(s) type to:
			<button onclick=ISAOIOE.setNewSurfaceType(this); style="background-color:#ffb400;" >ExteriorWall</button><br>
		</p>

	</details>`;

	return htm;

};



ISAOIOE.getAirOrInteriorOnExteriorCheck = function() {

	THR.scene.remove( ISSOH.horizontalNormalsFaces );

	ISAOIOE.surfaceAirInteriorIndices = [];

	GBX.surfaces.forEach( ( surface, index ) => {
		//const surfaceMatchAir = surface.match( /surfaceType="Air"/ );

		const surfaceMatchInterior = surface.match( /surfaceType="InteriorWall"/ );

		if ( surfaceMatchInterior ) {

			ISAOIOE.surfaceAirInteriorIndices.push( index );

		}

	} );

	return ISAOIOE.surfaceAirInteriorIndices.length;

};



ISAOIOE.castRaysGetIntersections = function( button ) {

	button.classList.toggle( "active" );

	const v = ( x, y, z ) => new THREE.Vector3( x, y, z );
	let normalsCount = 0;
	ISAOIOE.surfaceIntersections = [];

	const normals = ISRC.normalsFaces.children;
	//console.log( 'normals', normals );

	ISAOIOE.meshesExterior = [];

	const surfacesExterior = ["ExteriorWall", "UndergroundWall"];

	GBX.surfaces.forEach( ( surface, index ) => {

		if ( surfacesExterior.includes( surface.match( /surfaceType="(.*?)"/ )[ 1 ] ) ) {

			ISAOIOE.meshesExterior.push( GBX.surfaceGroup.children[ index ] );

		}

	} );
	//console.log( 'ISAOIOE.meshesExterior', ISAOIOE.meshesExterior );

	ISAOIOE.meshesExterior.forEach( mesh => mesh.visible = true );


	for ( let normal of normals ) {

		const coordinates = normal.geometry.attributes.position.array;
		//console.log( 'coordinates', coordinates );

		for ( let i = 0; i < coordinates.length; ) {

			const vertex1 = v( coordinates[ i++ ], coordinates[ i++ ], coordinates[ i++ ] );
			const vertex2 = v( coordinates[ i++ ], coordinates[ i++ ],coordinates[ i++ ] );
			//console.log( 'vertex1', vertex1 );

			const direction = vertex2.clone().sub( vertex1 ).normalize();
			//console.log( 'direction', direction );

			ISAOIOE.findIntersections( normal.userData.index, vertex1, direction );
			//console.log( 'intersections', intersections );

			normalsCount++;

		}

	}
	//console.log( 'ISAOIOE.surfaceIntersectionArrays', ISAOIOE.surfaceIntersectionArrays );

	ISRC.targetLog.innerHTML =
	`
		Surfaces: ${ ISAOIOE.surfaceAirInteriorIndices.length.toLocaleString() }<br>
		Normals created: ${ normalsCount.toLocaleString() }<br>
		intersections found: ${ ISAOIOE.surfaceIntersections.length.toLocaleString() }

		<p>Use Pop-up menu to zoom and show/hide individual surfaces.</p>

		<p><i>Better user-interface and best ways of fixing issues: TBD.</i></p>
	`;

	ISRC.targetSelect.innerHTML = ISAOIOE.getSelectOptions( ISAOIOE.surfaceIntersections );

	THR.scene.remove( ISAOIOE.normalsFaces );

};



ISAOIOE.findIntersections = function( index, origin, direction ) {

	let count = 0;

	const raycaster = new THREE.Raycaster();
	raycaster.set( origin, direction ); // has to be the correct vertex order

	const intersects1 = raycaster.intersectObjects( ISAOIOE.meshesExterior );

	raycaster.set( origin, direction.negate() );
	const intersects2 = raycaster.intersectObjects( ISAOIOE.meshesExterior );

	if (  intersects1.length % 2 === 0 || intersects2.length % 2 === 0 ) {

			const mesh = GBX.surfaceGroup.children[ index ];
			//console.log( 'surface', surface );

			mesh.material = new THREE.MeshBasicMaterial( { color: 'red', side: 2 });
			mesh.material.needsUpdate = true;

			if ( ISAOIOE.surfaceIntersections.includes( index ) === false ) { ISAOIOE.surfaceIntersections.push( index ); }

			count ++;

	}

	return count;

};



ISAOIOE.setSurfaceArraysShowHide = function( button, surfaceIndexArray ) {
	//console.log( 'surfaceIndexArray', surfaceIndexArray );

	button.classList.toggle( "active" );

	if ( button.classList.contains( 'active' ) && surfaceIndexArray.length ) {

		GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

		surfaceIndexArray.forEach( index => GBX.surfaceGroup.children[ Number( index ) ].visible = true );

		THRU.groundHelper.visible = false;

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

		THRU.groundHelper.visible = true;

	}

};



ISAOIOE.getSelectOptions = function( surfaceArrays ) {

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
