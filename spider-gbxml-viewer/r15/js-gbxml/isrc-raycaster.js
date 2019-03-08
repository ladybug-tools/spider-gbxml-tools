
const ISRC = {};


ISRC.addNormals = function( button, selectedSurfaces = [], targetSelect = "", targetLog = "" ) {

	ISRC.selectedSurfaces = selectedSurfaces;
	ISRC.targetSelect = targetSelect;
	ISRC.targetLog = targetLog;
	ISRC.normalsFaces = new THREE.Group();

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

	//THR.scene.traverse( function ( child ) {
	GBX.surfaceGroup.traverse( function ( child ) {

		if ( child instanceof THREE.Mesh && child.visible ) {

			if ( child.geometry.type === 'Geometry' ) {

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




ISRC.castRaysGetIntersections = function( button ) {

	button.classList.toggle( "active" );

	//ISRC.airSurfacesOnExterior = [];

	//GBX.surfaceGroup.children.forEach( mesh => mesh.visible = true );

	const v = ( x, y, z ) => new THREE.Vector3( x, y, z );
	let normalsCount = 0;
	let intersections = 0;
	ISRC.surfaceIntersectionArrays = [];
	ISRC.surfaceIntersections = [];

	const normals = ISRC.normalsFaces.children;
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

			intersections += ISRC.findIntersections( GBX.surfaceGroup.children, vertex1, direction );
			//intersections += ISRC.findIntersections( ISRC.horizontalSurfaces, vertex1, direction );
			//console.log( 'intersections', intersections );

			normalsCount++;

		}

	}
	//console.log( 'ISRC.surfaceIntersectionArrays', ISRC.surfaceIntersectionArrays );

	ISRC.targetLog.innerHTML =
	`
		Surfaces: ${ ISRC.selectedSurfaces.length.toLocaleString() }<br>
		Normals created: ${ normalsCount.toLocaleString() }<br>
		intersections found: ${ intersections.toLocaleString() }

		<p>Use Pop-up menu to zoom and show/hide individual surfaces.</p>

		<p><i>Better user-interface and best ways of fixing issues: TBD.</i></p>
	`;

	ISRC.targetSelect.innerHTML = ISRC.getSelectOptions( ISRC.surfaceIntersectionArrays );

	THR.scene.remove( ISRC.normalsFaces );

};



ISRC.findIntersections = function( objs, origin, direction ) {

	let count = 0;

	const raycaster = new THREE.Raycaster();

	raycaster.set( origin, direction ); // has to be the correct vertex order

	const intersects = raycaster.intersectObjects( objs );
	//console.log( 'intersects', intersects.length );

	if ( intersects.length > 1 ) {
		//console.log( 'intersects', intersects );

		ISRC.surfaceIntersections.push([ intersects[ 0 ].object.userData.index, intersects.length ] )

		if ( Math.abs( intersects[ 1 ].distance ) - Math.abs( intersects[ 0 ].distance ) < 0.00001 ) {

			const mesh = intersects[ 1 ].object;
			ISRC.addColor( mesh );

			surfaceIndices = intersects.map( intersect => intersect.object.userData.index );
			ISRC.surfaceIntersectionArrays.push( surfaceIndices );

			count++;
		}

	}

	return count;

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



ISRC.getSelectOptions = function( surfaceArrays ) {

	let htmOptions = '';
	let count = 1;

	for ( let surfaceIndices of surfaceArrays ) {

		for ( let index of surfaceIndices.slice( 0, 1 ) ) {

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


	}

	return htmOptions;

}



ISRC.setSurfaceArraysShowHide = function( button, surfaceArrays ) {
	//console.log( 'surfaceArray', surfaceArray );

	button.classList.toggle( "active" );

	if ( button.classList.contains( 'active' ) && surfaceArrays.length ) {

		GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

		surfaceArrays.forEach( array => array.slice( 0, 2 ).forEach( surfaceId => GBX.surfaceGroup.children[ surfaceId ].visible = true ) );

		THRU.groundHelper.visible = false;

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

		THRU.groundHelper.visible = true;

	}

};




ISRC.setSurfaceArraysExteriorShowHide = function( button, surfaceArrays ) {
	//console.log( 'surfaceArrays', surfaceArrays );

	button.classList.toggle( "active" );

	if ( button.classList.contains( 'active' ) && surfaceArrays.length ) {

		GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

		for ( surface of surfaceArrays ) {

			if ( surface[ 1 ] % 2 === 0 ) {

				console.log( '',  );

				GBX.surfaceGroup.children[ Number( surface[ 0 ] ) ].visible = true

			}

		}


		THRU.groundHelper.visible = false;

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

		THRU.groundHelper.visible = true;

	}

};


ISRC.selectedSurfaceFocus = function( select ) {

	THR.controls.enableKeys = false

	POP.intersected = GBX.surfaceGroup.children[ select.value ];

	POP.getIntersectedDataHtml();

	divPopUpData.innerHTML = POP.getIntersectedDataHtml();

};