// Copyright 2019 Ladybug Tools authors. MIT License
/* globals THR, THRU, THREE, GBX, POP, divPopUpData */
/* jshint esversion: 6 */

const ISRC = { "release": "R15.1", "date": "2019-03-14" };

ISRC.description =
	`
		Issues Ray Caster Core ( ISRC) - utilities used by several modules
	`;

////////// used by many

// used by aoioe*
// used by isso*
ISRC.addNormals = function( button, selectedSurfaces = [], targetSelect = "", targetLog = "" ) {

	THR.scene.remove( ISRC.normalsFaces );
	ISRC.normalsFaces = new THREE.Group();

	ISRC.selectedSurfaces = selectedSurfaces;
	ISRC.targetSelect = targetSelect;
	ISRC.targetLog = targetLog;

	button.classList.toggle( "active" );

	THRU.groundHelper.visible = false;

	if ( button.classList.contains( 'active' ) ) {

		GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

		selectedSurfaces.forEach( surfaceId => GBX.surfaceGroup.children[ surfaceId ].visible = true );

	}

	ISRC.toggleSurfaceNormals();

};



ISRC.toggleSurfaceNormals = function() {

	let material = new THREE.MeshNormalMaterial();

	const types = [ 'BoxBufferGeometry', 'BufferGeometry', 'ConeBufferGeometry', 'CylinderBufferGeometry',
		'ShapeBufferGeometry', 'SphereBufferGeometry' ];

	GBX.surfaceGroup.traverse( function ( child ) {

		if ( child instanceof THREE.Mesh && child.visible ) {

			if ( child.geometry.type === 'Geometry' ) {
				// never occurs ??
				child.geometry.computeFaceNormals();

				const helperNormalsFace = new THREE.FaceNormalsHelper( child, 2, 0xff00ff, 3 );
				ISRC.normalsFaces.add( helperNormalsFace );
				ISRC.normalsFaces.visible = false;
				console.log( 'helperNormalsFace', helperNormalsFace );

			} else if ( types.includes( child.geometry.type ) === true ) {

				//console.log( 'child', child.position, child.rotation );

				const geometry = new THREE.Geometry();
				const geo = geometry.fromBufferGeometry( child.geometry );
				const mesh = new THREE.Mesh( geo, material );
				mesh.rotation.copy( child.rotation );
				mesh.position.copy( child.position );


				const helperNormalsFace = new THREE.FaceNormalsHelper( mesh, 0.05 * THRU.radius, 0xff00ff, 3 );
				helperNormalsFace.userData.index = child.userData.index;

				ISRC.normalsFaces.add( helperNormalsFace );
				//ISRC.normalsFaces.visible = false;

			} else {

				//console.log( 'child.geometry.type', child.geometry.type );

			}

		}

	} );

	ISRC.normalsFaces.name = 'normalsFaces';
	THR.scene.add( ISRC.normalsFaces );

};


// used by aoioe*
// used by isso*
ISRC.showHideSelected = function( button, select ) {

	if ( select.selectedOptions.length ) {

		const arr = Array.from( select.selectedOptions );

		const indices = arr.map( item => Number( item.value ) );
		//console.log( 'arr', arr );

		ISRC.setSurfaceArrayShowHide( button, indices );

	}

};



//////////

// used by isso*
ISRC.castRaysSetIntersectionArrays = function( button ) {

	button.classList.toggle( "active" );

	const normals = ISRC.normalsFaces.children;
	//console.log( 'normals', normals );
	let normalsCount = 0;
	const v = ( x, y, z ) => new THREE.Vector3( x, y, z );
	const arrs = [];

	for ( let normal of normals ) {

		const coordinates = normal.geometry.attributes.position.array;
		//console.log( 'coordinates', coordinates );

		for ( let i = 0; i < coordinates.length; ) {

			const vertex1 = v( coordinates[ i++ ], coordinates[ i++ ], coordinates[ i++ ] );
			const vertex2 = v( coordinates[ i++ ], coordinates[ i++ ], coordinates[ i++ ] );
			//console.log( 'vertex1', vertex1 );

			const direction = vertex2.clone().sub( vertex1 ).normalize();
			//console.log( 'direction', direction );

			const intersections = ISRC.getIntersectionArrays( vertex1, direction, GBX.surfaceGroup.children );
			//console.log( 'intersections', intersections );

			if ( intersections ) { arrs.push( intersections ); }

			normalsCount++;

		}

	}
	//ISRC.surfaceIntersectionArrays = arr.filter( ( value, index, array ) => array.indexOf ( value ) == index );

	ISRC.surfaceIntersectionArrays = [];
	const strings = [];

	for ( let arr of arrs ) {

		const str = arr.join();

		if ( strings.indexOf( str ) === -1 ) {

			strings.push( str );
			ISRC.surfaceIntersectionArrays.push( arr );

		}

	}

	console.log( 'ISRC.surfaceIntersectionArrays', ISRC.surfaceIntersectionArrays );

	ISRC.targetLog.innerHTML =
	`
		Surfaces: ${ ISRC.selectedSurfaces.length.toLocaleString() }<br>
		Normals created: ${ normalsCount.toLocaleString() }<br>
		intersections found: ${ ISRC.surfaceIntersectionArrays.length.toLocaleString() }

		<p>Select multiple surfaces by pressing shift or control keys.</p>

		<p>Use Pop-up menu at top right to zoom and show/hide individual surfaces.</p>

	`;

	ISRC.targetSelect.innerHTML = ISRC.getSelectOptions( ISRC.surfaceIntersectionArrays );

	THR.scene.remove( ISRC.normalsFaces );

};




ISRC.getIntersectionArrays = function( origin, direction, meshes ) {

	let surfaceIndices;

	const raycaster = new THREE.Raycaster();

	raycaster.set( origin, direction ); // has to be the correct vertex order

	const intersects = raycaster.intersectObjects( meshes );
	//console.log( 'intersects', intersects.length );

	if ( intersects.length > 1 ) {

		if ( Math.abs( intersects[ 1 ].distance ) - Math.abs( intersects[ 0 ].distance ) < 0.00001 ) {

			const mesh = intersects[ 1 ].object;
			ISRC.addColor( mesh );

			surfaceIndices = intersects.map( intersect => intersect.object.userData.index ).slice( 0, 2 );

		}

	}
	//console.log( 'surfaceIndices', surfaceIndices );

	return surfaceIndices;

};



ISRC.addColor = function( mesh ){

	const surface = GBX.surfaces[ mesh.userData.index ];
	//console.log( 'surface', surface );

	const tilt = surface.match( /<tilt>(.*?)<\/tilt/i )[ 1 ];
	//console.log( 'tilt', tilt );

	const color = ( tilt !== "90" ) ? 'blue' : 'red';

	mesh.material = new THREE.MeshBasicMaterial( { color: color, side: 2 });

	mesh.material.needsUpdate = true;


};



// used by isso*
ISRC.getSelectOptions = function( surfaceArrays ) {

	let htmOptions = "";
	let count = 1;

	for ( let surfaceIndices of surfaceArrays ) {
		//console.log( 'surfaceIndices', surfaceIndices );

		for ( let index of surfaceIndices ) {

			const surfaceText = GBX.surfaces[ index ];
			//console.log( 'surfaceText', surfaceText );

			const id = surfaceText.match( 'id="(.*?)"' )[ 1 ];
			//console.log( 'id', id );

			const cadIdMatch = surfaceText.match( /<CADObjectId>(.*?)<\/CADObjectId>/i );
			const cadId = cadIdMatch ? cadIdMatch[ 1 ] : "";

			const type = surfaceText.match( 'surfaceType="(.*?)"' )[ 1 ];
			let color = GBX.colors[ type ].toString( 16 );
			color = color.length > 4 ? color : '00' + color; // otherwise greens no show

			htmOptions +=
				`<option style=background-color:#${ color } value=${ index } title="${ cadId }" >${ count } - ${ id }</option>`;

		}

		count ++;

	}

	return htmOptions;

};



ISRC.setSurfaceArraysShowHide = function( button, surfaceArrays ) {
	//console.log( 'surfaceArrays', surfaceArrays );

	button.classList.toggle( "active" );

	if ( button.classList.contains( 'active' ) && surfaceArrays.length ) {

		GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

		surfaceArrays.forEach( array => array.slice( 0, 2 ).forEach( surfaceId => GBX.surfaceGroup.children[ surfaceId ].visible = true ) );

		THR.scene.remove( ISRC.normalsFaces );

		THRU.groundHelper.visible = false;

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

		THRU.groundHelper.visible = true;

	}

};



//////////


ISRC.getExteriors = function( index, origin, direction ) {
	// used by aoioe*

	const raycaster = new THREE.Raycaster();

	raycaster.set( origin, direction ); // has to be the correct vertex order
	const intersects1 = raycaster.intersectObjects( ISRC.meshesExterior ).length;

	raycaster.set( origin, direction.negate() );
	const intersects2 = raycaster.intersectObjects( ISRC.meshesExterior ).length;

	const arr = [];

	if ( intersects1 % 2 === 0 || intersects2 % 2 === 0 ) {

		const mesh = GBX.surfaceGroup.children[ index ];
		mesh.material = new THREE.MeshBasicMaterial( { color: 'red', side: 2 });
		mesh.material.needsUpdate = true;

		if ( arr.includes( index ) === false ) { arr.push( index ); }

	}


	return arr;

};



ISRC.getSelectOptionsIndexes = function( surfaceIndexes ) {
	// used by aoioe*

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



ISRC.setSurfaceArrayShowHide = function( button, surfaceIndexArray ) {
	// used by aoioe*
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



ISRC.setMeshesExterior = function( types ) {
	// used by aoioe* to be deprecated

	const wallTypes = [ "ExteriorWall", "Roof", "UndergroundWall" ];
	//const floorTypes = [ "ExposedFloor", "Roof", "SlabOnGrade", "UndergroundSlab" ];

	types = types ? types : wallTypes;

	ISRC.meshesExterior = GBX.surfaces.filter(
		surface => types.includes( surface.match( /surfaceType="(.*?)"/ )[ 1 ] )
	)
	.map( item => GBX.surfaceGroup.children[ GBX.surfaces.indexOf( item ) ] );
	//console.log( 'ISRC.meshesExterior', ISRC.meshesExterior );

};



// used by aoioe*
ISRC.getMeshesByType = function( types ) {

	const wallTypes = [ "ExteriorWall", "Roof", "UndergroundWall" ];
	//const floorTypes = [ "ExposedFloor", "Roof", "SlabOnGrade", "UndergroundSlab" ];

	types = types ? types : wallTypes;

	const meshes = GBX.surfaces.filter(
		surface => types.includes( surface.match( /surfaceType="(.*?)"/ )[ 1 ] )
	)
	.map( item => GBX.surfaceGroup.children[ GBX.surfaces.indexOf( item ) ] );
	//console.log( 'ISRC.meshesExterior', ISRC.meshesExterior );

	return meshes;

};



// used by aoioe*
ISRC.selectedSurfaceFocus = function( select ) {

	THR.controls.enableKeys = false;

	POP.intersected = GBX.surfaceGroup.children[ select.value ];

	POP.getIntersectedDataHtml();

	divPopUpData.innerHTML = POP.getIntersectedDataHtml();

};
