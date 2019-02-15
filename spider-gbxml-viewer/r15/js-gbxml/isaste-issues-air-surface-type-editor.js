// Copyright 2018 Ladybug Tools authors. MIT License
/* globals GBX, POP, ISCOR, divPopUpData */
/* jshint esversion: 6 */


const ISASTE = { "release": "R15.2", "date": "2019-02-14" };

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
			Proposed methodology:<br>
			Create a Three.js 'ray' for each side of an Air surface type.
			The ray follows the normal for that surface at the center point of the surface.
			If one of the rays finds no intersections on one side then we know that the surface must be on the exterior.
			If both rays find intersections then we know the surface must be inside the model.
		</p>
		<p>
			<a href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/r15/js-gbxml/ISASTE-issues-air-surface-tpe-editor.js: target="_blank" >
			Air Surface Type Editor source code
			</a>
		</p>

		<p>
			Issues
			<ul>
				<li>2019-02-13 ~ Only works once - must reload between each ron </li>
			</ul>

		</p>

		<details>
			<summary>Wish List / To Do</summary>
			<ul>
				<li>2019-02-14 ~ Reset variables when loading new file/li>
				<li>2019-02-14 ~ Handle models with concavities</li>
			</ul>
		<details>

		<details>
			<summary>Change log</summary>
			<ul>
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

		<summary>Air Surface Type Editor<span id="ISASTEspnCount" ></span>
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
			Select multiple surfaces by pressing shift or control keys
		</p>
		<p>
			<button id=ISASTEbutViewSelected onclick=ISASTE.selectedSurfaceShowHide(this,ISASTEselAirSurfaceTypeEditor); title="" >
				show/hide selected air surfaces
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
			<button onclick=ISASTE.setNewSurfaceType(this) style="background-color:#ffb400;" >ExteriorWall</button><br>
			<button onclick=ISASTE.setNewSurfaceType(this) style="background-color:#800000;" >Roof</button><br>
			<button onclick=ISASTE.setNewSurfaceType(this) style="background-color:#ffce9d;" >Shade</button><br>
			<button onclick=ISASTE.setNewSurfaceType(this) style="background-color:#804000;" >SlabOnGrade</button><br>
			<button onclick=ISASTE.setNewSurfaceType(this) style="background-color:#a55200;" >UndergroundWall</button><br>
			<button onclick=ISASTE.setNewSurfaceType(this) style="background-color:#804000;" >UndergroundSlab</button><br>
		</p>

	</details>`;

	return htm;

};



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

	if ( ISASTE.airNormalsFaces === undefined ) {

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

	}

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

			fixes += findIntersections( GBX.surfaceGroup.children, vertex1, direction );

		}

	}

	ISASTEfixes.innerHTML = `Air surfaces on exterior identified: ${ fixes }`;

};



function findIntersections( objs, origin, direction ) {

	let count = 0;
	const spriteMaterial = new THREE.SpriteMaterial( { color: 'magenta' } );

	const raycaster = new THREE.Raycaster();
	near = 0.001 * THRU.radius;
	raycaster.set( origin, direction, near, THRU.radius ); // has to be the correct vertex order

	const intersects = raycaster.intersectObjects( objs );
	//console.log( 'intersects', intersects );

	for ( let intersect of intersects ) {

		if ( intersect.distance > 0 ) {

			const sprite = new THREE.Sprite( spriteMaterial );
			s = 0.005 * THRU.radius;
			sprite.scale.set( s, s, s,);
			sprite.position.copy( intersect.point );

			THR.scene.add( sprite );

		}


	}

	if ( intersects.length === 1 ) {

		//console.log( 'intersect.object', intersects[ 0 ].object );

		intersects[ 0 ].object.material = new THREE.MeshNormalMaterial( { side: 2 });

		intersects[ 0 ].object.material.needsUpdate = true;

		count++;

	}

	return count;

}



ISASTE.setNewSurfaceType = function( that ) {

	alert( "coming soon!" );

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

