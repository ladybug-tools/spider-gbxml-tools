// Copyright 2018 Ladybug Tools authors. MIT License
/* globals GBX, POP, ISCOR, divPopUpData */
/* jshint esversion: 6 */


const ISASTE = { "release": "R15.3", "date": "2019-02-15" };

ISASTE.description =
	`
		Air Surface Type Editor (ISASTE) allows you display all or some Air surfaces, update the surface type and identify Air surfaces that may be at the exterior of the model.

	`;

ISASTE.currentStatus =
	`
		<summary>Air Surface Type Editor (ISASTE) ${ ISASTE.release} ~ ${ ISASTE.date }</summary>

		<p>
			${ ISASTE.description }
		</p>

		<p>
			<a href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/r15/js-gbxml/isaste-issues-air-surface-type-editor.js" target="_blank" >
			Air Surface Type Editor source code
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
				<li>2019-02-15 ~ Easy access to show edges external vertical and/or horizontal suraces</li>
				<li>2019-02-15 ~ Check normals for both sides of surfaces</li>
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
				<li>2019-02-15 ~ Add vertical surfaces display in red, horizontal surfaces in blue. (Not perfectly yet.)</li>
				<li>2019-02-15 ~ Add text to popup help. Set default Air surface to display if none selected by user.</li>
				<li>2019-02-14 ~ Add beginning of working check if Air surface types are on exterior of a model</li>
				<li>2019-02-13 ~ Add find intersections between Air and other surfaces but not shade</li>
				<li>2019-02-13 ~ Fixed using cursor keys updates select 3D at same time</li>
				<li>2019-02-13 ~ Add colors to surface type buttons << started</li>
				<li>2019-02-13 ~ Add show number surfaces currently visible</li>
				<li>2019-02-12 ~ first commit</li>
				<!-- <li></li>
				-->
			</ul>
		</details>
	`;



ISASTE.getMenuAirSurfaceTypeEditor = function() {

	const htm =

	`<details id="ISASTEdetAirSurfaceTypeEditor" ontoggle=ISASTE.getAirSurfaceTypeEditorCheck(); >

		<summary class=highlight >Air Surface Type Editor<span id="ISASTEspnCount" ></span>
		<a id=ISASTEsumHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(ISASTEsumHelp,ISASTE.currentStatus);" >&nbsp; ? &nbsp;</a>

		</summary>

		<p>
			${ ISASTE.description }
		</p>

		<p>
			<button id=ISASTEbutViewAll onclick=ISASTE.setAirSurfaceTypeEditorShowHide(this,ISASTE.surfaceAirIndices); >
				Show/hide all air type surfaces
			</button>
		</p>

		<p>
			<select id=ISASTEselAirSurfaceTypeEditor onchange=ISASTE.selectedSurfaceFocus(this); style=width:100%; multiple size=10 >
			</select>
		</p>
		<p>
			Select multiple surfaces by pressing shift or control keys.
		</p>
		<p>
			<button id=ISASTEbutViewSelected onclick=ISASTE.selectedSurfaceShowHide(this,ISASTEselAirSurfaceTypeEditor); title="If none selected, first is taken as default" >
				show/hide currently selected air surfaces
			</button>
		</p>

		<p id=ISASTEpNumberSurfacesVisible ></p>

		<hr>

		<p>The following is work-in-progress</p>

		<p>
			1. <button onclick=ISASTE.addNormals(this); >add normals to Air surfaces</button><br>
		</p>

		<p>
			2. <button onclick=ISASTE.setTargetSurfacesVisible(this); >set target surfaces visible</button><br>
		</p>

		<p>
			3. <button onclick=ISASTE.castRaysGetIntersections(this); >cast rays get intersections</button><br>
		</p>

		<p id=ISASTEfixes ></p>
		<p>
			Update surface(s) type to:
			<button onclick=ISASTE.setNewSurfaceType(this); style="background-color:#aaa;" >ExposedFloor</button><br>
			<button onclick=ISASTE.setNewSurfaceType(this); style="background-color:#ffb400;" >ExteriorWall</button><br>
			<button onclick=ISASTE.setNewSurfaceType(this); style="background-color:#800000;" >Roof</button><br>
			<button onclick=ISASTE.setNewSurfaceType(this); style="background-color:#ffce9d;" >Shade</button><br>
			<button onclick=ISASTE.setNewSurfaceType(this); style="background-color:#804000;" >SlabOnGrade</button><br>
			<button onclick=ISASTE.setNewSurfaceType(this); style="background-color:#a55200;" >UndergroundWall</button><br>
			<button onclick=ISASTE.setNewSurfaceType(this); style="background-color:#804000;" >UndergroundSlab</button><br>
		</p>

	</details>`;

	return htm;

};



ISASTE.getAirSurfaceTypeEditorCheck = function() {
	//console.log( 'ISASTEdetAirSurfaceTypeEditor.open', ISASTEdetAirSurfaceTypeEditor.open );

	if ( ISASTEdetAirSurfaceTypeEditor.open === false && ISCOR.runAll === false ) { return; }

	if ( GBX.surfaces.length > ISCOR.surfaceCheckLimit ) { return; } // don't run test automatically on very large files

	ISASTE.surfaceAirIndices = [];

	const surfaces = GBX.surfaces;

	// refactor to a reduce??
	for ( let i = 0; i < surfaces.length; i++ ) {

		const surface = surfaces[ i ];
		//console.log( 'surface', surface );
		const surfaceMatch = surface.match( /surfaceType="Air"/ );
		//console.log( 'surfaceMatch', surfaceMatch );

		if ( surfaceMatch ) {

			ISASTE.surfaceAirIndices.push( i );

		}

	}

	let color;
	let htmOptions = '';

	for ( let surfaceIndex of ISASTE.surfaceAirIndices ) {

		color = color === 'pink' ? '' : 'pink';

		const surfaceText = GBX.surfaces[ surfaceIndex ];

		const id = surfaceText.match( 'id="(.*?)"' )[ 1 ];

		htmOptions +=
			`<option style=background-color:${ color } value=${ surfaceIndex } >${ id }</option>`;
	}

	ISASTEselAirSurfaceTypeEditor.innerHTML = htmOptions;
	ISASTEspnCount.innerHTML = `: ${ ISASTE.surfaceAirIndices.length } found`;

	return ISASTE.surfaceAirIndices.length;

};




ISASTE.setAirSurfaceTypeEditorShowHide = function( button, surfaceArray ) {

	button.classList.toggle( "active" );

	ISASTEbutViewSelected.classList.remove( "active" );

	if ( button.classList.contains( 'active' ) && surfaceArray.length ) {

		GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

		surfaceArray.forEach( surfaceId => GBX.surfaceGroup.children[ surfaceId ].visible = true );

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	}

};



ISASTE.selectedSurfaceFocus = function( select ) {

	THR.controls.enableKeys = false;

	POP.intersected = GBX.surfaceGroup.children[ select.value ];

	POP.getIntersectedDataHtml();

	divPopUpData.innerHTML = POP.getIntersectedDataHtml();

};



ISASTE.selectedSurfaceShowHide = function( button, select ) {

	THR.controls.enableKeys = false;

	if ( ISASTEselAirSurfaceTypeEditor.selectedOptions.length === 0 ) {

		ISASTEselAirSurfaceTypeEditor.selectedIndex = 0

	}

	options = Array.from( select.selectedOptions );
	//console.log( 'options', options );

	button.classList.toggle( "active" );

	ISASTEbutViewAll.classList.remove( "active" );

	if ( button.classList.contains( 'active' ) && options.length ) {

		GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

		options.forEach( option => GBX.surfaceGroup.children[ option.value ].visible = true );

		ISASTEpNumberSurfacesVisible.innerHTML = `Number surfaces visible: ${ options.length }`;

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

		ISASTEpNumberSurfacesVisible.innerHTML = `Number surfaces visible: ${ GBX.surfaceGroup.children.length }`;

	}


}



//////////


ISASTE.addNormals = function( button ) {

	button.classList.toggle( "active" );

	THRU.groundHelper.visible = !button.classList.contains( 'active' );

	if ( button.classList.contains( 'active' ) ) {

		GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

		ISASTE.surfaceAirIndices.forEach( surfaceId => GBX.surfaceGroup.children[ surfaceId ].visible = true );

	}

	ISASTE.toggleSurfaceNormals();

};



ISASTE.toggleSurfaceNormals = function() {

	let material = new THREE.MeshNormalMaterial();

	const types = [ 'BoxBufferGeometry', 'BufferGeometry', 'ConeBufferGeometry', 'CylinderBufferGeometry',
		'ShapeBufferGeometry', 'SphereBufferGeometry' ];

	//if ( ISASTE.airNormalsFaces === undefined ) {

		ISASTE.airNormalsFaces = new THREE.Group();

		THR.scene.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh && child.visible ) {

				if ( child.geometry.type === 'Geometry' ) {

					child.geometry.computeFaceNormals();

					const helperNormalsFace = new THREE.FaceNormalsHelper( child, 2, 0xff00ff, 3 );
					ISASTE.airNormalsFaces.add( helperNormalsFace );
					ISASTE.airNormalsFaces.visible = false;
					console.log( 'helperNormalsFace', helperNormalsFace );

				} else if ( types.includes( child.geometry.type ) === true ) {

					//console.log( 'child', child.position, child.rotation );

					const geometry = new THREE.Geometry();
					const geo = geometry.fromBufferGeometry( child.geometry );
					const mesh = new THREE.Mesh( geo, material );
					mesh.rotation.copy( child.rotation );
					mesh.position.copy( child.position );
					const helperNormalsFace = new THREE.FaceNormalsHelper( mesh, 0.05 * THRU.radius, 0xff00ff, 3 );

					ISASTE.airNormalsFaces.add( helperNormalsFace );
					ISASTE.airNormalsFaces.visible = false;

				} else {

					//console.log( 'child.geometry.type', child.geometry.type );

				}

			}

		} );

		ISASTE.airNormalsFaces.name = 'airNormalsFaces';
		THR.scene.add( ISASTE.airNormalsFaces );
		ISASTE.airNormalsFaces.visible = false;

	//}

	ISASTE.airNormalsFaces.visible = !ISASTE.airNormalsFaces.visible;

};



ISASTE.setTargetSurfacesVisible = function( button ) {

	button.classList.toggle( "active" );

	ISASTE.surfaceNotShadeIndices = [];

	const surfaces = GBX.surfaces;

	// refactor to a reduce??
	for ( let i = 0; i < surfaces.length; i++ ) {

		const surface = surfaces[ i ];
		//console.log( 'surface', surface );
		const surfaceMatch = surface.match( /surfaceType="Shade"/ );
		//console.log( 'surfaceMatch', surfaceMatch );

		if ( !surfaceMatch ) {

			ISASTE.surfaceNotShadeIndices.push( i );

		}

	}

	if ( button.classList.contains( 'active' ) ) {

		GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

		ISASTE.surfaceNotShadeIndices.forEach( surfaceId => GBX.surfaceGroup.children[ surfaceId ].visible = true );

	}

};



ISASTE.castRaysGetIntersections = function( button ) {

	button.classList.toggle( "active" );

	ISASTE.airSurfacesOnExterior = [];

	let fixes = 0;

	const normals = ISASTE.airNormalsFaces;
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

			fixes += ISASTE.findIntersections( GBX.surfaceGroup.children, vertex1, direction );

		}

	}

	ISASTEfixes.innerHTML = `Air surfaces on exterior identified: ${ fixes }`;

	GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

	ISASTE.surfaceAirIndices.forEach( surfaceId => GBX.surfaceGroup.children[ surfaceId ].visible = true );

	ISASTE.airNormalsFaces.visible = false;

	THRU.groundHelper.visible = false;

};



ISASTE.findIntersections = function( objs, origin, direction ) {


	let count = 0;
	const spriteMaterial = new THREE.SpriteMaterial( { color: 'magenta' } );

	const raycaster = new THREE.Raycaster();
	near = 0.001 * THRU.radius;
	raycaster.set( origin, direction, near, THRU.radius ); // has to be the correct vertex order

	const intersects = raycaster.intersectObjects( objs );
	//console.log( 'intersects', intersects );

	/*
	ISASTE.sprites = new THREE.Group();
	const s = 0.005 * THRU.radius;

	for ( let intersect of intersects ) {

		if ( intersect.distance > 0 ) {

			const sprite = new THREE.Sprite( spriteMaterial );
			sprite.scale.set( s, s, s,);
			sprite.position.copy( intersect.point );

			ISASTE.sprites.add( sprite );

		}

	}

	THR.scene.add( ISASTE.sprites );

	*/

	if ( intersects.length === 1 ) {

		//console.log( 'intersect.object', intersects[ 0 ].object );

		mesh = intersects[ 0 ].object;

		color = ( Math.abs( mesh.geometry.attributes.normal.array[ 2 ] ) === 1 ) ? 'blue' : 'red';

		mesh.material = new THREE.MeshBasicMaterial( { color: color, side: 2 });

		mesh.material.needsUpdate = true;

		ISASTE.airSurfacesOnExterior.push( mesh.userData.index )

		count++;

	}

	return count;

}



ISASTE.setNewSurfaceType = function( that ) {

	alert( "coming soon!" );

};



