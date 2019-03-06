// Copyright 2018 Ladybug Tools authors. MIT License
/* globals GBX, POP, ISCOR, divPopUpData */
/* jshint esversion: 6 */


const ISSOH = { "release": "R15.0", "date": "2019-03-04" };

ISSOH.description =
	`
		Issues Surface Overlap Horizontals (ISSOH) checks if a horizontal surface includes another surface.

	`;

ISSOH.currentStatus =
	`

		<summary>Surface Overlap Horizontals (ISSOH) ${ ISSOH.release} ~ ${ ISSOH.date }</summary>

		<p>
			${ ISSOH.description }
		</p>
		<p>
		Concept
			<ul>
				<li>Module is work-in-progress. Checking horizontals only. <i class=highlight >You will need to reload the web page between each run.</i></li>
			</ul>
		</p>
		<p>
			<a href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/r15/js-gbxml/issoh-issues-surface-overlap-horizonteals.js: target="_blank" >
				Issues Surface Overlap Horizontals source code
			</a>
		</p>
		<details>
			<summary>Change log</summary>
			<ul>
				<li>2019-03-03 ~ R15.1 ~ beginning to find overlaps nicely</li>
				<li>2019-03-01 ~ R15.0 ~ First commit</li>
			</ul>
		</details>
	`;


ISSOH.getMenuSurfaceOverlapHorizontals = function() {

	const htm =

	`<details id="ISSOHdetSurfaceOverlapHorizontals" ontoggle=ISSOH.getSurfaceOverlapHorizontalsCheck(); >

		<summary>Surface Overlap Horizntls<span id="ISSOHspnCount" ></span>
			<a id=ISSOHsumHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(ISSOHsumHelp,ISSOH.currentStatus);" >&nbsp; ? &nbsp;</a>
		</summary>

		<p>
			Module is work-in-progress. Checking horizontals only.  <i class=highlight >You will need to reload the web page between each run.</i>
		</p>
<!--
		<p>
			<button onclick=ISSOH.setSurfaceOverlapHorizontalsShowHide(this,ISSOH.horizontalSurfaces); >
				Show/hide horizontal surfaces
			</button>
		</p>
-->
		<p>
			1. <button onclick=ISRC.addNormals(this,ISSOH.horizontalSurfaces,ISSOHselSurfaceOverlapHorizontals,ISSOHoverlaps); >add normals to horizontal surfaces</button><br>
		</p>

		<p>
			2. <button onclick=ISRC.castRaysGetIntersections(this,ISSOHoverlaps); >cast rays get intersections</button><br>
		</p>

		<p>
			<button onclick=ISSOH.setSurfaceOverlapHorizontalsShowHide(this,ISRC.surfaceIntersectionArrays); title="Starting to work!" >
			show/hide overlaps
			</button>
		</p>

		<p>
			<select id=ISSOHselSurfaceOverlapHorizontals multiple onchange=ISSOH.selectedSurfaceFocus(this); style=width:100%; size=10 >
			</select>
		</p>

		<p id=ISSOHoverlaps ></p>


	</details>`;

	return htm;

};



ISSOH.getSurfaceOverlapHorizontalsCheck = function() {
	//console.log( 'ISSOHdetSurfaceOverlapHorizontals.open', ISSOHdetSurfaceOverlapHorizontals.open );

	if ( ISSOHdetSurfaceOverlapHorizontals.open === false && ISCOR.runAll === false ) { return; }

	if ( GBX.surfaces.length > ISCOR.surfaceCheckLimit ) { return; } // don't run test automatically on very large files

	THR.scene.remove( ISSOH.horizontalNormalsFaces );

	ISSOH.horizontalSurfaces = [];

	const surfaces = GBX.surfaces;

	// refactor to a reduce??
	for ( let i = 0; i < surfaces.length; i++ ) {

		const surface = surfaces[ i ];

		const surfaceId = surface.match( /id="(.*?)"/)[ 1 ];

		const tilt = surface.match( /<Tilt>(.*?)<\/Tilt>/i );
		//console.log( 'tilt', tilt );

		if ( tilt && ( tilt[ 1 ] === "0" || tilt[ 1 ] === "180" ) ) {

			ISSOH.horizontalSurfaces.push( i );

		}

	}

	// ISSOHselSurfaceOverlapHorizontals.innerHTML = ISSOH.getSelectOptions( ISSOH.horizontalSurfaces );
	//ISSOHspnCount.innerHTML = `: ${ ISSOH.horizontalSurfaces.length } found`;

	return ISSOH.horizontalSurfaces.length;

};



ISSOH.setSurfaceOverlapHorizontalsShowHide = function( button, surfaceArrays ) {
	//console.log( 'surfaceArray', surfaceArray );

	button.classList.toggle( "active" );

	if ( button.classList.contains( 'active' ) && surfaceArrays.length ) {

		GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

		surfaceArrays.forEach( array => array.forEach( surfaceId => GBX.surfaceGroup.children[ surfaceId ].visible = true ) );

		THRU.groundHelper.visible = false;

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

		THRU.groundHelper.visible = true;

	}

};



ISSOH.selectedSurfaceFocus = function( select ) {

	THR.controls.enableKeys = false

	POP.intersected = GBX.surfaceGroup.children[ select.value ];

	POP.getIntersectedDataHtml();

	divPopUpData.innerHTML = POP.getIntersectedDataHtml();

};




ISSOH.addNormals = function( button ) {

	button.classList.toggle( "active" );

	THR.scene.remove( ISSOH.horizontalNormalsFaces );

	if ( !ISSOH.horizontalSurfaces || ISSOH.horizontalSurfaces.length === 0 ) { alert( 'The current model has no rectangular geometry. Cannot proceed (for now).'); return; }

	THRU.groundHelper.visible = false; //!button.classList.contains( 'active' );

	if ( button.classList.contains( 'active' ) ) {

		GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

		ISSOH.horizontalSurfaces.forEach( surfaceId => GBX.surfaceGroup.children[ surfaceId ].visible = true );

	}

	ISSOH.toggleSurfaceNormals();

};



ISSOH.toggleSurfaceNormals = function() {

	let material = new THREE.MeshNormalMaterial();

	const types = [ 'BoxBufferGeometry', 'BufferGeometry', 'ConeBufferGeometry', 'CylinderBufferGeometry',
		'ShapeBufferGeometry', 'SphereBufferGeometry' ];

	ISSOH.horizontalNormalsFaces = new THREE.Group();

	//THR.scene.traverse( function ( child ) {
	GBX.surfaceGroup.traverse( function ( child ) {

		if ( child instanceof THREE.Mesh && child.visible ) {

			if ( child.geometry.type === 'Geometry' ) {

				child.geometry.computeFaceNormals();

				const helperNormalsFace = new THREE.FaceNormalsHelper( child, 2, 0xff00ff, 3 );
				ISSOH.horizontalNormalsFaces.add( helperNormalsFace );
				ISSOH.horizontalNormalsFaces.visible = false;
				console.log( 'helperNormalsFace', helperNormalsFace );

			} else if ( types.includes( child.geometry.type ) === true ) {

				//console.log( 'child', child.position, child.rotation );

				const geometry = new THREE.Geometry();
				const geo = geometry.fromBufferGeometry( child.geometry );
				const mesh = new THREE.Mesh( geo, material );
				mesh.rotation.copy( child.rotation );
				mesh.position.copy( child.position );
				const helperNormalsFace = new THREE.FaceNormalsHelper( mesh, 0.05 * THRU.radius, 0xff00ff, 3 );

				ISSOH.horizontalNormalsFaces.add( helperNormalsFace );
				//ISSOH.horizontalNormalsFaces.visible = false;

			} else {

				//console.log( 'child.geometry.type', child.geometry.type );

			}

		}

	} );

	ISSOH.horizontalNormalsFaces.name = 'horizontalNormalsFaces';
	THR.scene.add( ISSOH.horizontalNormalsFaces );

	//ISSOH.horizontalNormalsFaces.visible = false;
	//ISSOH.horizontalNormalsFaces.visible = !ISSOH.horizontalNormalsFaces.visible;

};



ISSOH.castRaysGetIntersections = function( button ) {

	button.classList.toggle( "active" );

	//ISSOH.airSurfacesOnExterior = [];

	const v = ( x, y, z ) => new THREE.Vector3( x, y, z );
	let normalsCount = 0;
	let overlaps = 0;
	ISSOH.surfaceOverlaps = [];

	const normals = ISSOH.horizontalNormalsFaces.children;
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

			overlaps += ISSOH.findIntersections( GBX.surfaceGroup.children, vertex1, direction );
			//overlaps += ISSOH.findIntersections( ISSOH.horizontalSurfaces, vertex1, direction );

			normalsCount++;

		}

	}
	//console.log( 'ISSOH.surfaceOverlaps', ISSOH.surfaceOverlaps );

	ISSOHoverlaps.innerHTML =
	`
		Horizontal surfaces: ${ ISSOH.horizontalSurfaces.length.toLocaleString() }<br>
		Normals created: ${ normalsCount.toLocaleString() }<br>
		Overlaps found: ${ overlaps.toLocaleString() }

		<p>Use Pop-up menu to zoom and show/hide individual surfaces.</p>

		<p><i>Better user-interface and best ways of fixing issues: TBD.</i></p>
	`;

	ISSOHselSurfaceOverlapHorizontals.innerHTML = ISSOH.getSelectOptions( ISSOH.surfaceOverlaps);

	THR.scene.remove( ISSOH.horizontalNormalsFaces );

};



ISSOH.findIntersections = function( objs, origin, direction ) {

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

				ISSOH.surfaceOverlaps.push( [ surfaceIndex1, surfaceIndex2 ] );

				ISSOH.addColor( mesh );


			//}



		}

	}

	return count1;

};



ISSOH.addColor = function( mesh ){

	const surface = GBX.surfaces[ mesh.userData.index ];
	//console.log( 'surface', surface );

	const tilt = surface.match( /<tilt>(.*?)<\/tilt/i )[ 1 ];
	//console.log( 'tilt', tilt );

	const color = ( tilt !== "90" ) ? 'blue' : 'red';

	mesh.material = new THREE.MeshBasicMaterial( { color: color, side: 2 });

	mesh.material.needsUpdate = true;


};



ISSOH.getSelectOptions = function( surfaceArrays ) {

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