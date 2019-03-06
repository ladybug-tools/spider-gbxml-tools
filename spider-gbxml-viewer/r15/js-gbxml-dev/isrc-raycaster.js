
const ISRC = {};


ISRC.addNormals = function( button, selectedSurfaces = [], targetSelect = "", targetLog = "" ) {

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

	ISRC.normalsFaces = new THREE.Group();

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

	const v = ( x, y, z ) => new THREE.Vector3( x, y, z );
	let normalsCount = 0;
	let intersections = 0;
	ISRC.surfaceIntersectionArrays = [];

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

	ISRC.targetSelect.innerHTML = ISRC.getSelectOptions( ISRC.surfaceIntersectionArrays);

	THR.scene.remove( ISRC.normalsFaces );

};



ISRC.findIntersections = function( objs, origin, direction ) {

	let count1 = 0;

	const raycaster = new THREE.Raycaster();
	//const near = 0.2 * THRU.radius;
	//raycaster.set( origin, direction, 0, THRU.radius ); // has to be the correct vertex order

	raycaster.set( origin, direction ); // has to be the correct vertex order

	const intersects = raycaster.intersectObjects( objs );
	//console.log( 'intersects', intersects.length );

	if ( intersects.length === 0 ) {

		//console.log( 'intersects', 0 );

	} else if ( intersects.length > 1 ) {

		surfaceIndex1 = intersects[ 0 ].object.userData.index;

		surfaceIndex2 = intersects[ 1 ].object.userData.index;

		if ( surfaceIndex1 === surfaceIndex2 ) {

			//console.log( 'intersects', intersects );

			//surfaceText1 = GBX.surfaces[ surfaceIndex1 ];

			//surfaceText2 = GBX.surfaces[ surfaceIndex2 ];

			//azimuth1 = surfaceText1.match( /<azimuth>(.*?)<\/azimuth/i )[ 1 ];

			//azimuth2 = surfaceText2.match( /<azimuth>(.*?)<\/azimuth/i )[ 1 ];
			//console.log( 'azimuth1', azimuth1 );


			//if ( ( azimuth1 === azimuth2 || azimuth1 === 180 + azimuth2 || 180 + azimuth1 === azimuth2) &&

			//if ( intersects[ 1 ].distance < 0.01 ) {

			//console.log( '0 Math.abs( intersects[ 0 ].distance )', Math.abs( intersects[ 0 ].distance ) );
			//console.log( '1 Math.abs( intersects[ 1 ].distance )', Math.abs( intersects[ 1 ].distance ) );

		} else if ( Math.abs( intersects[ 1 ].distance ) - Math.abs( intersects[ 0 ].distance ) < 0.00001 ) {

			normal1 = intersects[ 0 ].object.geometry.attributes.normal.array.slice( 0, 3 );
			//console.log( 'normal1', normal1 );

			normal2 = intersects[ 1 ].object.geometry.attributes.normal.array.slice( 0, 3 );
			//console.log( 'normal2', normal2 );

			//if ( Math.abs( normal1[ 0 ] ) - Math.abs( normal2[ 0 ] ) < 0.001
			//	&& Math.abs( normal1[ 1 ] ) - Math.abs( normal2[ 1 ] ) < 0.001
			//	&& Math.abs( normal1[ 2 ] ) - Math.abs( normal2[ 2 ] ) < 0.001 ) {

				//console.log( 'azimuth1', azimuth1 );
				//console.log( 'azimuth2', azimuth2 );

				//console.log( 'intersects', intersects[ 1 ].distance );

				count1++;

				const mesh = intersects[ 1 ].object;

				ISRC.surfaceIntersectionArrays.push( [ surfaceIndex1, surfaceIndex2 ] );

				ISRC.addColor( mesh );


			//}

		}

	}

	return count1;

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
	let count = 0;

	for ( let surfaceIndices of surfaceArrays ) {

		count ++;

		for ( let index of surfaceIndices ) {

			const surfaceText = GBX.surfaces[ index ];
			//console.log( 'surfaceText', surfaceText );

			const id = surfaceText.match( 'id="(.*?)"' )[ 1 ];

			const cadIdMatch = surfaceText.match( /<CADObjectId>(.*?)<\/CADObjectId>/i );
			const cadId = cadIdMatch ? cadIdMatch[ 1 ] : "";

			const type = surfaceText.match( 'surfaceType="(.*?)"' )[ 1 ];
			let color = GBX.colors[ type ].toString( 16 );
			color = color.length > 4 ? color : '00' + color; // otherwise greens no show

			htmOptions +=
				`<option style=background-color:#${ color } value=${ index } title="${ cadId }" >${ count } - ${ id }</option>`;


		}


	}

	return htmOptions;

}
