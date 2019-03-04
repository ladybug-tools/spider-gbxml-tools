// Copyright 2018 Ladybug Tools authors. MIT License
/* globals GBX, POP, ISCOR, divPopUpData */
/* jshint esversion: 6 */


const ISICE = { "release": "R15.0", "date": "2019-02-28" };

ISICE.description =
	`
		Issues Interior Check If Exterior (ISICE) provides HTML and JavaScript 'boilerplate' to create a typical TooToo menu.

	`;

ISICE.currentStatus =
	`

		<summary>Interior Check If Exterior (ISICE) ${ ISICE.release} ~ ${ ISICE.date }</summary>

		<p>
			${ ISICE.description }
		</p>
		<p>
		Concept
			<ul>
				<li>Provides default current status text template</li>
				<li>Provides default description text template</li>
				<li>Includes JavaScript code to generate an HTML menu</li>
			</ul>
		</p>
		<p>
			<a href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/r15/js-gbxml/istmp-issues-check-if-exterior.js: target="_blank" >
				Issues Interior Check If Exterior source code
			</a>
		</p>
		<details>
			<summary>Change log</summary>
			<ul>
				<li>2019-02-28 ~ R15.0 ~ First commit</li>
			</ul>
		</details>
	`;


ISICE.getMenuInteriorCheckIfExterior = function() {

	const htm =

	`<details id="ISICEdetInteriorCheckIfExterior" ontoggle=ISICE.getInteriorCheckIfExteriorCheck(); >

		<summary>Vertical Surface Overlaps<span id="ISICEspnCount" ></span>
			<a id=ISICEsumHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(ISICEsumHelp,ISICE.currentStatus);" >&nbsp; ? &nbsp;</a>
		</summary>

		<p>
			just started. Checking verticals only
		</p>

		<p>
			<button onclick=ISICE.setInteriorCheckIfExteriorShowHide(this,ISICE.verticalSurfaces); >
				Show/hide vertical surfaces
			</button>
		</p>

		<p>
			<select id=ISICEselInteriorCheckIfExterior multiple onchange=ISICE.selectedSurfaceFocus(this); style=width:100%; size=10 >
			</select>
		</p>

		<p>
			1. <button onclick=ISICE.addNormals(this); >add normals to vertical surfaces</button><br>
		</p>

		<p>
			2. <button onclick=ISICE.castRaysGetIntersections(this); >cast rays get intersections</button><br>
		</p>

		<p id=ISICEoverlaps ></p>

		<p>
			<button onclick=ISICE.setInteriorCheckIfExteriorShowHide(this,ISICE.surfaceOverlaps); title="Starting to work!" >
				shw/hide overlaps
			</button>
		</p>

	</details>`;

	return htm;

};



ISICE.getInteriorCheckIfExteriorCheck = function() {
	//console.log( 'ISICEdetInteriorCheckIfExterior.open', ISICEdetInteriorCheckIfExterior.open );

	if ( ISICEdetInteriorCheckIfExterior.open === false && ISCOR.runAll === false ) { return; }

	if ( GBX.surfaces.length > ISCOR.surfaceCheckLimit ) { return; } // don't run test automatically on very large files

	ISICE.verticalSurfaces = [];

	const surfaces = GBX.surfaces;

	// refactor to a reduce??
	for ( let i = 0; i < surfaces.length; i++ ) {

		const surface = surfaces[ i ];

		const surfaceId = surface.match( /id="(.*?)"/)[ 1 ];

		const tilt = surface.match( /<Tilt>(.*?)<\/Tilt>/i );
		//console.log( 'tilt', tilt );

		if ( tilt && tilt[ 1 ]=== "90" ) {

			ISICE.verticalSurfaces.push( i );

		}

	}

	let htmOptions = '';

	for ( let surfaceIndex of ISICE.verticalSurfaces ) {

		const surfaceText = GBX.surfaces[ surfaceIndex ];
		//console.log( 'surfaceText', surfaceText );

		const id = surfaceText.match( 'id="(.*?)"' )[ 1 ];

		const cadIdMatch = surfaceText.match( /<CADObjectId>(.*?)<\/CADObjectId>/i );
		const cadId = cadIdMatch ? cadIdMatch[ 1 ] : "";

		const type = surfaceText.match( 'surfaceType="(.*?)"' )[ 1 ];
		let color = GBX.colors[ type ].toString( 16 );
		color = color.length > 4 ? color : '00' + color; // otherwise greens no show

		htmOptions +=
			`<option style=background-color:#${ color } value=${ surfaceIndex } title="${ cadId }" >${ id }</option>`;

	}

	ISICEselInteriorCheckIfExterior.innerHTML = htmOptions;
	ISICEspnCount.innerHTML = `: ${ ISICE.verticalSurfaces.length } found`;

	return ISICE.verticalSurfaces.length;

};



ISICE.setInteriorCheckIfExteriorShowHide = function( button, surfaceArray ) {
	//console.log( 'surfaceArray', surfaceArray );

	THR.scene.remove( ISICE.verticalNormalsFaces );

	button.classList.toggle( "active" );

	if ( button.classList.contains( 'active' ) && surfaceArray.length ) {

		GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

		surfaceArray.forEach( surfaceId => GBX.surfaceGroup.children[ surfaceId ].visible = true );

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	}

};



ISICE.selectedSurfaceFocus = function( select ) {

	THR.controls.enableKeys = false

	POP.intersected = GBX.surfaceGroup.children[ select.value ];

	POP.getIntersectedDataHtml();

	divPopUpData.innerHTML = POP.getIntersectedDataHtml();

};




ISICE.addNormals = function( button ) {

	button.classList.toggle( "active" );

	THRU.groundHelper.visible = !button.classList.contains( 'active' );

	if ( button.classList.contains( 'active' ) ) {

		GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

		ISICE.verticalSurfaces.forEach( surfaceId => GBX.surfaceGroup.children[ surfaceId ].visible = true );

	}

	ISICE.toggleSurfaceNormals();

};



ISICE.toggleSurfaceNormals = function() {

	let material = new THREE.MeshNormalMaterial();

	const types = [ 'BoxBufferGeometry', 'BufferGeometry', 'ConeBufferGeometry', 'CylinderBufferGeometry',
		'ShapeBufferGeometry', 'SphereBufferGeometry' ];

	ISICE.verticalNormalsFaces = new THREE.Group();

	//THR.scene.traverse( function ( child ) {
	GBX.surfaceGroup.traverse( function ( child ) {

		if ( child instanceof THREE.Mesh && child.visible ) {

			if ( child.geometry.type === 'Geometry' ) {

				child.geometry.computeFaceNormals();

				const helperNormalsFace = new THREE.FaceNormalsHelper( child, 2, 0xff00ff, 3 );
				ISICE.verticalNormalsFaces.add( helperNormalsFace );
				ISICE.verticalNormalsFaces.visible = false;
				console.log( 'helperNormalsFace', helperNormalsFace );

			} else if ( types.includes( child.geometry.type ) === true ) {

				//console.log( 'child', child.position, child.rotation );

				const geometry = new THREE.Geometry();
				const geo = geometry.fromBufferGeometry( child.geometry );
				const mesh = new THREE.Mesh( geo, material );
				mesh.rotation.copy( child.rotation );
				mesh.position.copy( child.position );
				const helperNormalsFace = new THREE.FaceNormalsHelper( mesh, 0.05 * THRU.radius, 0xff00ff, 3 );

				ISICE.verticalNormalsFaces.add( helperNormalsFace );
				ISICE.verticalNormalsFaces.visible = false;

			} else {

				//console.log( 'child.geometry.type', child.geometry.type );

			}

		}

	} );

	ISICE.verticalNormalsFaces.name = 'verticalNormalsFaces';
	THR.scene.add( ISICE.verticalNormalsFaces );
	ISICE.verticalNormalsFaces.visible = false;

	ISICE.verticalNormalsFaces.visible = !ISICE.verticalNormalsFaces.visible;

};



ISICE.castRaysGetIntersections = function( button ) {

	button.classList.toggle( "active" );

	//ISICE.airSurfacesOnExterior = [];

	const v = ( x, y, z ) => new THREE.Vector3( x, y, z );
	let normalsCount = 0;
	let overlaps = 0;
	ISICE.surfaceOverlaps = [];

	const normals = ISICE.verticalNormalsFaces.children;
	//console.log( 'normals', normals );

	for ( let normal of normals ) {

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


	for ( let normal of normals ) {

		const coordinates = normal.geometry.attributes.position.array;
		//console.log( 'coordinates', coordinates );

		for ( let i = 0; i < coordinates.length; ) {

			const vertex1 = v( coordinates[ i++ ], coordinates[ i++ ], coordinates[ i++ ] );
			const vertex2 = v( coordinates[ i++ ], coordinates[ i++ ],coordinates[ i++ ] );
			//console.log( 'vertex1', vertex1 );

			const direction = vertex2.clone().sub( vertex1 ).normalize();
			//console.log( 'direction', direction );

			overlaps += ISICE.findIntersections( GBX.surfaceGroup.children, vertex1, direction );
			//overlaps += ISICE.findIntersections( ISICE.verticalSurfaces, vertex1, direction );

			normalsCount++;

		}

	}
	//console.log( 'count2', count2 );

	console.log( 'ISICE.surfaceOverlaps', ISICE.surfaceOverlaps );

	ISICEoverlaps.innerHTML =
	`
		Vertical surfaces: ${ ISICE.verticalSurfaces.length }<br>
		normals: ${ normalsCount }<br>
		overlaps: ${ overlaps }
	`;

	//GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

	//ISICE.surfaceAirIndices.forEach( surfaceId => GBX.surfaceGroup.children[ surfaceId ].visible = true );

	//ISICE.verticalNormalsFaces.visible = false;

	//THRU.groundHelper.visible = false;

};



ISICE.findIntersections = function( objs, origin, direction ) {

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


		if ( intersects[ 1 ].distance < 0.05 ) {

			console.log( 'intersects', intersects[ 1 ].distance );

			count1++;

			const mesh = intersects[ 1 ].object;

			ISICE.surfaceOverlaps.push( intersects[ 0 ].object.userData.index , intersects[ 1 ].object.userData.index );

			ISICE.addColor( mesh );

		}

	}


	return count1;

	/*
	else if ( intersects.length === 1 ) {

		//console.log( 'intersect.object', intersects[ 0 ].object );

		const mesh = intersects[ 0 ].object;

		count1++;
		ISICE.addColor( mesh );

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

			ISICE.addColor( intersects[ 0 ].object );
			//console.log( 'intersects even', intersects );

			count1++;
			count2++;

		}

	}

	*/



};



ISICE.addColor = function( mesh ){

	const surface = GBX.surfaces[ mesh.userData.index ];
	//console.log( 'surface', surface );

	const tilt = surface.match( /<tilt>(.*?)<\/tilt/i )[ 1 ];
	//console.log( 'tilt', tilt );

	const color = ( tilt !== "90" ) ? 'blue' : 'red';

	mesh.material = new THREE.MeshBasicMaterial( { color: color, side: 2 });

	mesh.material.needsUpdate = true;

	//ISICE.airSurfacesOnExterior.push( mesh.userData.index );

};

