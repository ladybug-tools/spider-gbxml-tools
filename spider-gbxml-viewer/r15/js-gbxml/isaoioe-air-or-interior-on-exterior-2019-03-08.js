// Copyright 2018 Ladybug Tools authors. MIT License
/* globals THR, THRU, THREE, GBX, POP, ISCOR, ISAOIOEdetAirOrInteriorOnExterior,ISAOIOEselAirOrInteriorOnExterior,
ISAOIOEspnCount, ISAOIOEbutViewSelected,ISAOIOEbutViewAll, ISAOIOEpNumberSurfacesVisible, ISAOIOEfixes, divPopUpData */
/* jshint esversion: 6 */


const ISAOIOE = { "release": "R15.0", "date": "2019-03-05" };

let count2 = 0;


ISAOIOE.description =
	`
		Air or Interior on Exterior (ISAOIOE) allows you display Air or Interior surface types that may be at the exterior of the model.

	`;


ISAOIOE.currentStatus =
	`
		<summary>Air or Interior on Exterior (ISAOIOE) ${ ISAOIOE.release} ~ ${ ISAOIOE.date }</summary>

		<p>
			${ ISAOIOE.description }
		</p>

		<p>
			<a href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/r15/js-gbxml/isAOIOE-issues-air-surface-type-editor.js" target="_blank" >
			Air or Interior on Exterior source code
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
				Identifying external Air surfaces is a work-in-progress.
				<span class=highlight>The web page must be reloaded between each session.</span>
				Click the numbered boxes in numerical order.
				Various normals and sprites at intersection will be drawn. These are for testing while devloping and will not appear in final version.
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
				<li>2019-02-15 ~ Check normals for both sides of surfaces</li>f
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
				<li>2019-03-05 ~ first commit</li>
			</ul>
		</details>
	`;



ISAOIOE.getMenuAirOrInteriorOnExterior = function() {

	const htm =

	`<details id="ISAOIOEdetAirOrInteriorOnExterior" ontoggle=ISAOIOE.getAirOrInteriorOnExteriorCheck(); >

		<summary>Air/Interior on Exterior<span id="ISAOIOEspnCount" ></span>
			<a id=ISAOIOEsumHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(ISAOIOEsumHelp,ISAOIOE.currentStatus);" >&nbsp; ? &nbsp;</a>
		</summary>

		<p>
			${ ISAOIOE.description }
		</p>
<!--
		<p>
			<button id=ISAOIOEbutViewAll onclick=ISAOIOE.setAirOrInteriorOnExteriorShowHide(this,ISAOIOE.surfaceAirInteriorIndices); >
				Show/hide all air type surfaces
			</button>
		</p>


		<p>
			Select multiple surfaces by pressing shift or control keys.
		</p>
		<p>
			<button id=ISAOIOEbutViewSelected onclick=ISAOIOE.selectedSurfaceShowHide(this,ISAOIOEselAirOrInteriorOnExterior); title="If none selected, first is taken as default" >
				show/hide currently selected air surfaces
			</button>
		</p>

		<p id=ISAOIOEpNumberSurfacesVisible ></p>

		<hr>
-->

		<p>The following is work-in-progress</p>

		<p>
			1. <button onclick=ISAOIOE.addNormals(this); >add normals to Air/InteriorWall surfaces</button><br>
		</p>

		<p>
			2. <button onclick=ISAOIOE.castRaysGetIntersections(this); >cast rays get intersections</button><br>
		</p>

		<p>
			<select id=ISAOIOEselAirOrInteriorOnExterior onchange=ISAOIOE.selectedSurfaceFocus(this); style=width:100%; multiple size=10 >
			</select>
		</p>

		<p>
			<button onclick=ISAOIOE.setAirOrInteriorOnExteriorShowHide(this,ISAOIOE.surfaceAirInteriorIndices); title="Starting to work!" >
			show/hide overlaps
			</button>
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



ISAOIOE.selectSurfaces = function( color ) {

	if ( color ) {

		GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );
		ISAOIOE.surfaceAirInteriorIndices.forEach( surfaceId => {

			const mesh = GBX.surfaceGroup.children[ surfaceId ];
			mesh.visible = mesh.material.color.getHexString() === color ? true : false;

		} );

	} else {

		GBX.surfaceGroup.children.forEach( mesh => {
			//console.log( '', mesh.material.color.getHexString() );
			mesh.visible = mesh.material.color.getHexString() === "ffff00" ? true : false;

		} );

	}

};



ISAOIOE.getAirOrInteriorOnExteriorCheck = function() {
	//console.log( 'ISAOIOEdetAirOrInteriorOnExterior.open', ISAOIOEdetAirOrInteriorOnExterior.open );

	//if ( ISAOIOEdetAirOrInteriorOnExterior.open === false && ISCOR.runAll === false ) { return; }

	//if ( GBX.surfaces.length > ISCOR.surfaceCheckLimit ) { return; } // don't run test automatically on very large files

	ISAOIOE.surfaceAirInteriorIndices = [];

	const surfaces = GBX.surfaces;

	// refactor to a reduce??
	for ( let i = 0; i < surfaces.length; i++ ) {

		const surface = surfaces[ i ];
		//console.log( 'surface', surface );

		let surfaceMatch = surface.match( /surfaceType="Air"/ );
		//console.log( 'surfaceMatch', surfaceMatch );

		if ( surfaceMatch ) {

			ISAOIOE.surfaceAirInteriorIndices.push( i );

		}

		surfaceMatch = surface.match( /surfaceType="InteriorWall"/ );
		//console.log( 'surfaceMatch', surfaceMatch );

		if ( surfaceMatch ) {

			ISAOIOE.surfaceAirInteriorIndices.push( i );

		}

	}

	/*
	let color;
	let htmOptions = '';

	for ( let surfaceIndex of ISAOIOE.surfaceAirInteriorIndices ) {

		color = color === 'pink' ? '' : 'pink';

		const surfaceText = GBX.surfaces[ surfaceIndex ];

		const id = surfaceText.match( 'id="(.*?)"' )[ 1 ];

		htmOptions +=
			`<option style=background-color:${ color } value=${ surfaceIndex } >${ id }</option>`;

	}

	ISAOIOEselAirOrInteriorOnExterior.innerHTML = htmOptions;

	*/

	//ISAOIOEspnCount.innerHTML = `: ${ ISAOIOE.surfaceAirInteriorIndices.length } found`;

	return ISAOIOE.surfaceAirInteriorIndices.length;

};




ISAOIOE.setAirOrInteriorOnExteriorShowHide = function( button, surfaceArray ) {

	button.classList.toggle( "active" );

	//ISAOIOEbutViewSelected.classList.remove( "active" );

	if ( button.classList.contains( 'active' ) && surfaceArray.length ) {

		GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

		surfaceArray.forEach( surfaceId => GBX.surfaceGroup.children[ surfaceId ].visible = true );

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	}

};



ISAOIOE.selectedSurfaceFocus = function( select ) {

	THR.controls.enableKeys = false;

	POP.intersected = GBX.surfaceGroup.children[ select.value ];

	POP.getIntersectedDataHtml();

	divPopUpData.innerHTML = POP.getIntersectedDataHtml();

};



ISAOIOE.selectedSurfaceShowHide = function( button, select ) {

	THR.controls.enableKeys = false;

	if ( ISAOIOEselAirOrInteriorOnExterior.selectedOptions.length === 0 ) {

		ISAOIOEselAirOrInteriorOnExterior.selectedIndex = 0;

	}

	const options = Array.from( select.selectedOptions );
	//console.log( 'options', options );

	button.classList.toggle( "active" );

	ISAOIOEbutViewAll.classList.remove( "active" );

	if ( button.classList.contains( 'active' ) && options.length ) {

		GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

		options.forEach( option => GBX.surfaceGroup.children[ option.value ].visible = true );

		ISAOIOEpNumberSurfacesVisible.innerHTML = `Number surfaces visible: ${ options.length }`;

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

		ISAOIOEpNumberSurfacesVisible.innerHTML = `Number surfaces visible: ${ GBX.surfaceGroup.children.length }`;

	}


};



//////////


ISAOIOE.addNormals = function( button ) {

	button.classList.toggle( "active" );

	THRU.groundHelper.visible = false; //!button.classList.contains( 'active' );

	if ( button.classList.contains( 'active' ) ) {

		GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

		ISAOIOE.surfaceAirInteriorIndices.forEach( surfaceId => GBX.surfaceGroup.children[ surfaceId ].visible = true );

	}

	ISAOIOE.toggleSurfaceNormals();

};



ISAOIOE.toggleSurfaceNormals = function() {

	let material = new THREE.MeshNormalMaterial();

	const types = [ 'BoxBufferGeometry', 'BufferGeometry', 'ConeBufferGeometry', 'CylinderBufferGeometry',
		'ShapeBufferGeometry', 'SphereBufferGeometry' ];

	//if ( ISAOIOE.airNormalsFaces === undefined ) {

		ISAOIOE.airNormalsFaces = new THREE.Group();

		THR.scene.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh && child.visible ) {

				if ( child.geometry.type === 'Geometry' ) {

					child.geometry.computeFaceNormals();

					const helperNormalsFace = new THREE.FaceNormalsHelper( child, 2, 0xff00ff, 3 );
					ISAOIOE.airNormalsFaces.add( helperNormalsFace );
					//ISAOIOE.airNormalsFaces.visible = false;
					console.log( 'helperNormalsFace', helperNormalsFace );

				} else if ( types.includes( child.geometry.type ) === true ) {

					//console.log( 'child', child.position, child.rotation );

					const geometry = new THREE.Geometry();
					const geo = geometry.fromBufferGeometry( child.geometry );
					const mesh = new THREE.Mesh( geo, material );
					mesh.rotation.copy( child.rotation );
					mesh.position.copy( child.position );
					const helperNormalsFace = new THREE.FaceNormalsHelper( mesh, 0.05 * THRU.radius, 0xff00ff, 3 );

					ISAOIOE.airNormalsFaces.add( helperNormalsFace );
					//ISAOIOE.airNormalsFaces.visible = false;

				} else {

					//console.log( 'child.geometry.type', child.geometry.type );

				}

			}

		} );

		ISAOIOE.airNormalsFaces.name = 'airNormalsFaces';
		THR.scene.add( ISAOIOE.airNormalsFaces );
		//ISAOIOE.airNormalsFaces.visible = false;

	//}

	//ISAOIOE.airNormalsFaces.visible = !ISAOIOE.airNormalsFaces.visible;

};



ISAOIOE.setTargetSurfacesVisible = function( button ) {

	button.classList.toggle( "active" );

	ISAOIOE.surfaceNotShadeIndices = [];

	const surfaces = GBX.surfaces;

	// refactor to a reduce??
	for ( let i = 0; i < surfaces.length; i++ ) {

		const surface = surfaces[ i ];
		//console.log( 'surface', surface );
		const surfaceMatch = surface.match( /surfaceType="Shade"/ );
		//console.log( 'surfaceMatch', surfaceMatch );

		if ( !surfaceMatch ) {

			ISAOIOE.surfaceNotShadeIndices.push( i );

		}

	}

	if ( button.classList.contains( 'active' ) ) {

		GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

		ISAOIOE.surfaceNotShadeIndices.forEach( surfaceId => GBX.surfaceGroup.children[ surfaceId ].visible = true );

	}

};





ISAOIOE.castRaysGetIntersections = function( button ) {

	button.classList.toggle( "active" );

	ISAOIOE.airSurfacesOnExterior = [];

	let fixes = 0;

	const normals = ISAOIOE.airNormalsFaces;
	//console.log( 'normals', normals );

	for ( let normal of normals.children ) {

		const coordinates = normal.geometry.attributes.position.array;
		//console.log( 'coordinates', coordinates );

		for ( let i  = 0; i < coordinates.length;) {

			const geometry = new THREE.BoxBufferGeometry( 0.2, 0.2, 0.2 );
			const material = new THREE.MeshNormalMaterial();
			const mesh = new THREE.Mesh( geometry, material );
			mesh.position.set( coordinates[ i++ ], coordinates[ i++ ],coordinates[ i++ ] );
			//THR.scene.add( mesh );

		}

	}

	const v = ( x, y, z ) => new THREE.Vector3( x, y, z );

	for ( let normal of normals.children ) {

		const coordinates = normal.geometry.attributes.position.array;
		//console.log( 'coordinates', coordinates );

		for ( let i = 0; i < coordinates.length; ) {

			const vertex1 = v( coordinates[ i++ ], coordinates[ i++ ], coordinates[ i++ ] );
			const vertex2 = v( coordinates[ i++ ], coordinates[ i++ ],coordinates[ i++ ] );
			//console.log( 'vertex1', vertex1 );

			const direction = vertex2.clone().sub( vertex1 ).normalize();
			//console.log( 'direction', direction );

			fixes += ISAOIOE.findIntersections( GBX.surfaceGroup.children, vertex1, direction );

		}

	}
	//console.log( 'count2', count2 );

	ISAOIOEfixes.innerHTML =
		`Air surfaces on exterior identified: ${ fixes }
		<br>
		Identified by Inside Polygon method: ${ count2 }`;

	GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

	ISAOIOE.surfaceAirInteriorIndices.forEach( surfaceId => GBX.surfaceGroup.children[ surfaceId ].visible = true );

	ISAOIOE.airNormalsFaces.visible = false;

	THRU.groundHelper.visible = false;

};





ISAOIOE.castRaysGetIntersections = function( button ) {

	button.classList.toggle( "active" );

	//ISAOIOE.airSurfacesOnExterior = [];

	const v = ( x, y, z ) => new THREE.Vector3( x, y, z );
	let normalsCount = 0;
	let overlaps = 0;
	ISAOIOE.surfaceOverlaps = [];

	const normals = ISAOIOE.horizontalNormalsFaces.children;
	//console.log( 'normals', normals );

	for ( let normal of normals ) {

		const coordinates = normal.geometry.attributes.position.array;
		//console.log( 'coordinates', coordinates );

		for ( let i  = 0; i < coordinates.length;) {

			const geometry = new THREE.BoxBufferGeometry( 0.2, 0.2, 0.2 );
			const material = new THREE.MeshNormalMaterial();
			const mesh = new THREE.Mesh( geometry, material );
			mesh.position.set( coordinates[ i++ ], coordinates[ i++ ], coordinates[ i++ ] );
			//THR.scene.add( mesh );

		}

	}


	for ( let normal of normals ) {

		const coordinates = normal.geometry.attributes.position.array;
		//console.log( 'coordinates', coordinates );

		for ( let i = 0; i < coordinates.length; ) {

			const vertex1 = v( coordinates[ i++ ], coordinates[ i++ ], coordinates[ i++ ] );
			const vertex2 = v( coordinates[ i++ ], coordinates[ i++ ],coordinates[ i++ ] );
			//console.log( 'vertex1', vertex1 );

			const direction = vertex2.clone().sub( vertex1 ).normalize();
			//console.log( 'direction', direction );

			overlaps += ISAOIOE.findIntersections( GBX.surfaceGroup.children, vertex1, direction );
			//overlaps += ISAOIOE.findIntersections( ISAOIOE.horizontalSurfaces, vertex1, direction );

			normalsCount++;

		}

	}
	//console.log( 'ISAOIOE.surfaceOverlaps', ISAOIOE.surfaceOverlaps );

	ISAOIOEoverlaps.innerHTML =
	`
		Horizontal surfaces: ${ ISAOIOE.horizontalSurfaces.length.toLocaleString() }<br>
		Normals created: ${ normalsCount.toLocaleString() }<br>
		Overlaps found: ${ overlaps.toLocaleString() }

		<p>Use Pop-up menu to zoom and show/hide individual surfaces.</p>

		<p><i>Better user-interface and best ways of fixing issues: TBD.</i></p>
	`;

	ISAOIOEselSurfaceOverlapHorizontals.innerHTML = ISAOIOE.getSelectOptions( ISAOIOE.surfaceOverlaps);

	THR.scene.remove( ISAOIOE.horizontalNormalsFaces );

};




ISAOIOE.findIntersections = function( objs, origin, direction ) {

	let count1 = 0;

	const raycaster = new THREE.Raycaster();
	const near = 0.2 * THRU.radius;
	raycaster.set( origin, direction, near, THRU.radius ); // has to be the correct vertex order

	const intersects = raycaster.intersectObjects( objs );
	//console.log( 'intersects', intersects.length );

	const surfacesExterior = ["ExposedFloor","ExteriorWall","Roof","SlabOnGrade","UndergroundWall","UndergroundSlab" ];

	if ( intersects.length === 0 ) {

		//console.log( 'intersects', intersects ); //??

	} else if ( intersects.length === 1 ) {

		//console.log( 'intersect.object', intersects[ 0 ].object );

		const mesh = intersects[ 0 ].object;

		count1++;
		ISAOIOE.addColor( mesh );

	} else if ( intersects.length > 1 && ( intersects.length - 1 ) % 2 === 0 ) {

		let countExt = 0;

		for ( let i = 1; i < intersects.length; i++) {

			const index = intersects[ i ].object.userData.index;

			const surface = GBX.surfaces[ index ];
			//console.log( 'surface', surface );

			const surfaceType = surface.match( /surfaceType="(.*?)"/ )[ 1 ];

			if ( surfacesExterior.includes( surfaceType ) ) {

				//console.log( 'surfaceType', surfaceType );

				countExt++;

			}

		}


		if ( countExt % 2 === 0 ) {

			ISAOIOE.addColor( intersects[ 0 ].object );
			//console.log( 'intersects even', intersects );

			count1++;
			count2++;

		}

	}


	return count1;

};



ISAOIOE.addColor = function( mesh ){

	const surface = GBX.surfaces[ mesh.userData.index ];
	//console.log( 'surface', surface );

	const tilt = surface.match( /tilt>(.*?)<\/tilt/i )[ 1 ];
	//console.log( 'tilt', tilt );

	const color = ( tilt !== "90" ) ? 'blue' : 'red';

	mesh.material = new THREE.MeshBasicMaterial( { color: color, side: 2 });

	mesh.material.needsUpdate = true;

	ISAOIOE.airSurfacesOnExterior.push( mesh.userData.index );

};



ISAOIOE.setNewSurfaceType = function( that ) {

	alert( "coming soon!" );

};



