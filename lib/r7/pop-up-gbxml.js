/* global THREE, THR, THRU, GBX, divPopupData */
// jshint esversion: 6

// Copyright 2018 Ladybug Tools authors. MIT License

var POP = { "release": "R7.8" };
POP.getArray = item => Array.isArray( item ) ? item : ( item ? [ item ] : [] );


POP.currentStatus =
	`
	<details>

		<summary>Current status 2018-10-29</summary>

		<p>Identifying elements and attributes according to <a href="http://gbxml.org/schema_doc/6.01/GreenBuildingXML_Ver6.01.html" target="_blank">gbXML Schema.</a></p>

		<p>Coming next:<br>&bull; display rectangular geometry in model</p>

		<p>For fixing things see <a href="../../spider-gbxml-viewer-issues/index.html" target="_blank">issues module</a> </p>

		<p>Status: Getting to be stable. Needs more testing. Wishlists items welcome.</p>

		<!--
		<p>Toggling focus or visibility and identifying are two different things. As we design, let us try to keep these actions separate.</p>

		<p>If you are in a module, then you should never have to leave the module in order to complete the tasks assigned to that module</p>

		<p>What tooltips should appear and where?</p>
		-->

	</details>

	`;



////////// Inits

POP.getMenuHtmlPopUp = function() {

	POP.mouse = new THREE.Vector2();
	POP.raycaster = new THREE.Raycaster();
	POP.intersected = undefined;

	POP.particleMaterial = new THREE.SpriteMaterial( { color: 0xff0000 } );
	POP.particle = new THREE.Sprite( POP.particleMaterial );
	POP.line = undefined;

	THR.renderer.domElement.addEventListener( 'mousedown', POP.onDocumentMouseDown, false );
	THR.renderer.domElement.addEventListener( 'touchstart', POP.onDocumentTouchStart, false ); // for mobile


	const htm =
	`
		<div id = "divPopupData" >

			<p>
			click on the model and surface attributes appear here
			</p>

			<p>Axes Red/Green/Blue = X/Y/Z directions</p>

			<p>Spacebar: click to stop spinning</p>

			<p>Use one|two|three fingers to rotate|zoom|pan display in 3D. Or left|scroll|right with your pointing device</p>

			<p>Press Control-Shift-J|Command-Option-J to see if the JavaScript console reports any errors</p>

		</div>

		<div>
			<p style=text-align:right; >
				<a href="https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/cookbook/spider-gbxml-viewer-pop-up" title="View the read me file for the pop-up module" >${ POP.release }</a>
				<br>
				<button onclick=POP.onClickZoomAll(); title="Show entire campus & display attributes" >zoom all +</button>
			</p>
		</div>

	`;

	return htm;

};


////////// Events

POP.onClickZoomAll = function() {

	GBX.surfaceMeshes.children.forEach( child => child.visible = true );

	THRU.zoomObjectBoundingSphere(GBX.surfaceMeshes);

	divPopupData.innerHTML=
	`
		<b>Campus Attributes</b>
		<div>${ POP.getAttributesHtml(GBX.gbjson.Campus) }</div>
		<br>
		<b>Building Attributes</b>
		<div>${ POP.getAttributesHtml(GBX.gbjson.Campus.Building) }</div>

	`;

};



POP.setAllVisibleZoom = function() {

	const meshes = GBX.surfaceMeshes.children.filter( mesh => mesh.visible === true );
	//console.log( 'meshes', meshes );

	POP.setCameraControls( meshes );

};



POP.setCameraControls = function( meshes ) {

	const bbox = new THREE.Box3();
	meshes.forEach( mesh => bbox.expandByObject ( mesh ) );

	const sphere = bbox.getBoundingSphere( new THREE.Sphere() );
	const center = sphere.center;
	const radius = sphere.radius;
	//console.log( 'center * radius', center, radius );

	THR.controls.target.copy( center );
	THR.camera.position.copy( center.clone().add( new THREE.Vector3( 1.5 * radius, - 1.5 * radius, 1.5 * radius ) ) );

};



/////

POP.onDocumentTouchStart = function( event ) {

	event.preventDefault();

	event.clientX = event.touches[0].clientX;
	event.clientY = event.touches[0].clientY;

	POP.onDocumentMouseDown( event );

};



POP.onDocumentMouseDown = function( event ) {
	//console.log( 'event', event );

	event.preventDefault();

	POP.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	POP.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	POP.raycaster.setFromCamera( POP.mouse, THR.camera );

	POP.intersects = POP.raycaster.intersectObjects( GBX.surfaceMeshes.children );
	//console.log( 'POP.intersects', POP.intersects );

	if ( POP.intersects.length > 0 ) {

		POP.intersected = POP.intersects[ 0 ].object;

		POP.faceIndex = POP.intersects[ 0 ].faceIndex;
		//POP.intersected.material.color.setHex( Math.random() * 0xffffff );

		divPopupData.style.display = '';

		POP.getIntersectedVertexBufferGeometry( POP.intersects[ 0 ].point );

		divPopupData.innerHTML = POP.getIntersectedDataHtml();

	} else {

		POP.intersected = null;

		//divPopupData.style.display = 'none';

		divPopupData.innerHTML = '';

		THR.scene.remove( POP.line, POP.particle );

		document.body.style.cursor = 'auto';

	}

};



POP.getIntersectedDataHtml = function() {
	//console.log( 'intersected', intersected );

	const surfaceJson = POP.intersected.userData.gbjson;

	const adjSpaces = surfaceJson.AdjacentSpaceId;
	//console.log( 'adjSpaces', adjSpaces );

	let space1, space2, adjSpaceButtons, storeyButton, zoneButton;

	if ( adjSpaces ) { // also determines if zone and storey
		// all buttons need IDs so can toggle off and on easily

		if ( Array.isArray( adjSpaces ) ) {

			space1 = GBX.gbjson.Campus.Building.Space.find( space => space.id === adjSpaces[ 0 ].spaceIdRef );
			space2 = GBX.gbjson.Campus.Building.Space.find( space => space.id === adjSpaces[ 1 ].spaceIdRef );

			adjSpaceButtons = space1 ?
			`
				<button id=POPbutAdjacentSpace1 onclick=POP.toggleSpaceVisible(this,"${ space1.id }","${ space1.id }"); title="id: ${ space1.id }" >space 1: ${ space1.Name }</button>
				<button id=POPbutAdjacentSpace2 onclick=POP.toggleSpaceVisible(this,"${ space2.id }","${ space2.id }"); title="id: ${ space2.id }" >space 2: ${ space2.Name }</button>
			`
			:
			`<div id=POPbutAdjacentSpace1 ></div><div id=POPbutAdjacentSpace2 ></div>`;

		} else {

			space2 = GBX.gbjson.Campus.Building.Space.find( space => space.id === adjSpaces.spaceIdRef );

			adjSpaceButtons = space2 ?
			`
				<button id=POPbutAdjacentSpace1 onclick=POP.toggleSpaceVisible(this,"${ space2.id }",""); title="id: ${ space2.id }" >space: ${ space2.Name } </button>
				</div><div id=POPbutAdjacentSpace2 ></div>
			`
			:
			`
				<div id=POPbutAdjacentSpace1 ></div><div id=POPbutAdjacentSpace2 ></div>
			`;

		}

		const storey = GBX.gbjson.Campus.Building.BuildingStorey ? POP.getArray( GBX.gbjson.Campus.Building.BuildingStorey ).find( storey => storey.id === space2.buildingStoreyIdRef ) : undefined;
		storeyButton = storey? `<button id=POPbutStoreyVisible onclick=POP.toggleStoreyVisible("${ storey.id }"); title="id: ${ storey.id }" >storey: ${ storey.Name } </button>` : `<div id=POPbutStoreyVisible ></div>`;

		const zone = GBX.gbjson.Zone ? POP.getArray( GBX.gbjson.Zone ).find( zone => zone.id === space2.zoneIdRef ) : undefined;
		zoneButton = zone ? `<button id=POPbutZoneVisible onclick=POP.toggleZoneVisible("${ zone.id }"); title="id: ${ zone.id }" >zone: ${ zone.Name }</button> &nbsp;` : `<div id=POPbutZoneVisible ></div>`;

	} else {

		adjSpaceButtons = '<div id=POPbutAdjacentSpace1 ></div><div id=POPbutAdjacentSpace2 ></div>';
		storeyButton = '<div id=POPbutStoreyVisible ></div>';
		zoneButton = '<div id=POPbutZoneVisible ></div>';

	}


	const htmAttributes = POP.getSurfaceAttributes( surfaceJson );

	const htm =
	`
		<p><b>Visibility</b> - show/hide elements</p>

		<p>
			<button id=POPbutSurfaceFocus onclick=POP.toggleSurfaceFocus(); title="${ surfaceJson.CADObjectId }" > surface: ${ surfaceJson.id } </button>
			<button id=POPbutSurfaceVisible onclick=POP.toggleSurfaceVisible(); title="Show or hide selected surface" > &#x1f441; </button>
			<button onclick=POP.setSurfaceZoom(); title="Zoom into selected surface" > ⌕ </button>
			<button onclick=POP.toggleVertexPlacards(); title="Display vertex numbers" > # </button>
		</p>

		<p>
			${ adjSpaceButtons }
		</p>

		<p>
			${ storeyButton } ${ zoneButton }

			<button onclick=POP.setAllVisibleZoom(); title="Zoom whatever is visible" >⌕</button>
		</p>


		<div id=POPelementAttributes >
			${ htmAttributes }
		</div>

		<hr>

		<div>${ POP.currentStatus }</div>

	`;

	return htm;

};



POP.getIntersectedVertexBufferGeometry = function( point ) {
	//console.log( '', intersected );

	THR.scene.remove( POP.line, POP.particle );

	const vertices = POP.intersected.userData.gbjson.PlanarGeometry.PolyLoop.CartesianPoint
		.map( point => new THREE.Vector3().fromArray( point.Coordinate  ) );
	//console.log( 'vertices', vertices );

	const geometry = new THREE.Geometry().setFromPoints( vertices );
	//console.log( 'geometry', geometry );

	const material = new THREE.LineBasicMaterial( { color: 0xff00ff, linewidth: 2, transparent: true } );

	POP.line = new THREE.LineLoop( geometry, material );
	THR.scene.add( POP.line );

	const distance = THR.camera.position.distanceTo( THR.controls.target );

	POP.particle.scale.x = POP.particle.scale.y = 0.01 * distance;
	POP.particle.position.copy( point );

	THR.scene.add( POP.line, POP.particle );

};




//////////

POP.getSurfaceAttributes = function( surfaceJson ) {

	htmSurface = POP.getAttributesHtml( surfaceJson );
	htmAdjacentSpace = POP.getAttributesAdjacentSpace( surfaceJson );
	htmPlanarGeometry = POP.getAttributesPolyLoop( surfaceJson.PlanarGeometry.PolyLoop );
	htmRectangularGeometry = POP.getAttributesHtml( surfaceJson.RectangularGeometry );

	htm =
		`<p>
			<div><b>Selected Surface Attributes</b></div>
			${ htmSurface }
		</p>
		<p>
			<div><b>AdjacentSpace</b></div>
			${ htmAdjacentSpace }
		</p>
		<p>
			<div><b>Planar Geometry</b></div>
			${ htmPlanarGeometry }
		</p>
		<p>
			<div><b>Rectangular Geometry</b></div>
			${ htmRectangularGeometry }
		</p>
	`;

	return htm;

};



POP.getAttributesHtml = function( obj ) {

	let htm ='';

	const keys = Object.keys( obj );
	//console.log( 'keys', keys );

	for ( let key of keys ) {
		//console.log( 'key', key );

		if ( typeof( obj[ key ] ) === 'object' ) {
			//console.log( 'key', key );

			if ( key === 'CartesianPoint' ) {

				const point = obj[ key ].Coordinate;
				//console.log(  'point', point  );

				htm +=
				`
					<span class=attributeTitle >CartesianPoint:</span><br>
					&nbsp; <span class=attributeTitle >x:</span> <span class=attributeValue >${ Number( point[ 0 ] ).toLocaleString() }</span>
					<span class=attributeTitle >y:</span> <span class=attributeValue >${ Number( point[ 1 ] ).toLocaleString() }</span>
					<span class=attributeTitle >z:</span> <span class=attributeValue >${ Number( point[ 2 ] ).toLocaleString() }</span><br>
				`;

			}

		} else {

			const val = obj[ key ];

			let value = isNaN( Number( val ) ) || val !== 'CADObjectId' ? val : Number( val ).toLocaleString();
			value = key === 'Width' || key === 'Height' ? Number( val ).toLocaleString() : value;

			htm +=
			`
				<div>
					<span class="attributeTitle" >${key}:</span>
					<span class="attributeValue" >${ value }</span>
				</div>
			`;

		}

	}

	return htm;

};



POP.getAttributesAdjacentSpace = function( obj ){

	//console.log( 'AdjacentSpaceId', obj.AdjacentSpaceId );

	let htm;

	if ( obj.AdjacentSpaceId === undefined ) {

		htm = 'No adjacent space';

	} else if ( Array.isArray( obj.AdjacentSpaceId ) ) {

		//console.log( 'obj.AdjacentSpaceId', obj.AdjacentSpaceId );

		htm =
		`
			<div>
				<span class=attributeTitle >spaceIdRef 1:</span>
				<span class=attributeValue >${ obj.AdjacentSpaceId[ 0 ].spaceIdRef }</span>
			</div>
			<div>
				<span class=attributeTitle >spaceIdRef 1:</span>
				<span class=attributeValue >${ obj.AdjacentSpaceId[ 1 ].spaceIdRef }</span>
			</div>
		`;

	} else {

		//console.log( 'obj.AdjacentSpaceId', obj.AdjacentSpaceId );

		htm =

		`<div>
			<span class=attributeTitle >spaceIdRef:</span>
			<span class=attributeValue >${ obj.AdjacentSpaceId.spaceIdRef }</span>
		</div>`;

	}

	return htm;

};



POP.getAttributesPolyLoop = function( polyloop ) {

	const points = polyloop.CartesianPoint.map( CartesianPoint => new THREE.Vector3().fromArray( CartesianPoint.Coordinate ) );

	let htm = '', count = 1;

	for ( let point of points ) {

		htm += // put in table or flex??
		`
			#${ count++ }.
			<span class=attributeTitle >x:</span><span class=attributeValue >${ Number( point.x ).toLocaleString() }</span>
			<span class=attributeTitle >y:</span><span class=attributeValue >${ Number( point.y ).toLocaleString() }</span>
			<span class=attributeTitle >z:</span><span class=attributeValue >${ Number( point.z ).toLocaleString() }</span><br>
		`;

	}
	//console.log( 'points', JSON.stringify( points ) );

	return htm;

};



//////////

POP.toggleSurfaceFocus = function() {

	const color = POPbutSurfaceFocus.style.backgroundColor === '' ? 'pink' : '';
	POPbutSurfaceFocus.style.backgroundColor = color;

	POPbutSurfaceVisible.style.backgroundColor = '';
	POPbutStoreyVisible.style.backgroundColor = '';
	POPbutZoneVisible.style.backgroundColor = '';

	POPbutAdjacentSpace1.style.backgroundColor = '';
	POPbutAdjacentSpace2.style.backgroundColor = '';

	if ( color === 'pink' ) {

		GBX.surfaceMeshes.children.forEach( child => child.visible = false );

		POP.intersected.visible = true;

	} else {

		GBX.surfaceMeshes.children.forEach( child => child.visible = true );

	}

	const surfaceJson = POP.intersected.userData.gbjson;

	POPelementAttributes.innerHTML = POP.getSurfaceAttributes( surfaceJson );

};



POP.toggleSurfaceVisible = function() {

	POP.intersected.visible = !POP.intersected.visible;

	const color = POPbutSurfaceVisible.style.backgroundColor === '' ? 'pink' : '';
	POPbutSurfaceVisible.style.backgroundColor = color;

	POPbutSurfaceFocus.style.backgroundColor = '';
	POPbutStoreyVisible.style.backgroundColor = '';
	POPbutZoneVisible.style.backgroundColor = '';

	POPbutAdjacentSpace1.style.backgroundColor = '';
	POPbutAdjacentSpace2.style.backgroundColor = '';

	const surfaceJson = POP.intersected.userData.gbjson;
	POPelementAttributes.innerHTML = POP.getSurfaceAttributes( surfaceJson );

};



POP.toggleVertexPlacards = function() {

	const vertices = POP.intersected.userData.gbjson.PlanarGeometry.PolyLoop.CartesianPoint
	.map( point => new THREE.Vector3().fromArray( point.Coordinate.map( point => Number( point ) )  ) );

	console.log( 'vvv', vertices );

	const distance = THR.camera.position.distanceTo( THR.controls.target );
	const scale = 0.01;
	placards = vertices.map( ( vertex, index ) =>
		THRU.drawPlacard( '#' + ( 1 + index ), 0.0003 * distance, 0x00ff00, vertex.x + scale * distance, vertex.y + scale * distance, vertex.z + scale * distance )
	);

	console.log( '', placards );
	POP.line.add( ...placards )

};



POP.toggleSpaceVisible = function( button, space1Id, space2Id ) {

	const color = button.style.backgroundColor === '' ? 'pink' : '';
	button.style.backgroundColor = color;

	const visible1 = POPbutAdjacentSpace1.style.backgroundColor !== '' ? true : false;
	const visible2 = POPbutAdjacentSpace2.style.backgroundColor !== '' ? true : false;

	POPbutSurfaceFocus.style.backgroundColor = '';
	POPbutSurfaceVisible.style.backgroundColor = '';
	POPbutStoreyVisible.style.backgroundColor = '';
	POPbutZoneVisible.style.backgroundColor = '';

	const children =  GBX.surfaceMeshes.children;

	if ( visible1 === false && visible2 === false ) {

		children.forEach( child => child.visible = true );

	} else if ( visible1 === true && visible2 === false ) {

		children.forEach( child => child.visible = false );

		for ( let child of children )  {

			const adjacentSpaceId = POP.getArray( child.userData.gbjson.AdjacentSpaceId );

			adjacentSpaceId.forEach( item => child.visible = item && item.spaceIdRef === space1Id ? true : child.visible );
			// if shade then no item
		}

	} else if ( visible1 === false && visible2 === true ) {

		children.forEach( child => child.visible = false );

		for ( let child of children )  {

			const adjacentSpaceId = POP.getArray( child.userData.gbjson.AdjacentSpaceId );

			adjacentSpaceId.forEach( item => child.visible = item && item.spaceIdRef === space2Id ? true : child.visible );

		}

	} else if ( visible1 === true && visible2 === true ) {

		for ( let child of children )  {

			const adjacentSpaceId = POP.getArray( child.userData.gbjson.AdjacentSpaceId );

			adjacentSpaceId.forEach( item => child.visible = item && ( item.spaceIdRef === space1Id || item.spaceIdRef === space2Id )? true : child.visible );

		}

	}

	spaceJson = GBX.gbjson.Campus.Building.Space.find( item => item.id === space1Id );
	//console.log( 'spaceJson', spaceJson );

	htmSpace = POP.getAttributesHtml( spaceJson );

	const htm =
	`
		<b>Select Space Attributes</b>
		${ htmSpace }
	`;

	POPelementAttributes.innerHTML = htm;

};



POP.toggleStoreyVisible = function( storeyId ) {

	const color = POPbutStoreyVisible.style.backgroundColor === '' ? 'pink' : '';

	POPbutStoreyVisible.style.backgroundColor = color;
	POPbutSurfaceFocus.style.backgroundColor = '';
	POPbutSurfaceVisible.style.backgroundColor = '';
	POPbutZoneVisible.style.backgroundColor = '';

	POPbutAdjacentSpace1.style.backgroundColor = '';
	POPbutAdjacentSpace2.style.backgroundColor = '';

	const children =  GBX.surfaceMeshes.children;

	if ( color === '' ) {

		children.forEach( child => child.visible = true );

	} else {

		const spaces = GBX.gbjson.Campus.Building.Space;

		GBX.surfaceMeshes.children.forEach( element => element.visible = false );

		for ( let child of GBX.surfaceMeshes.children ) {

			const adjacentSpaceId = child.userData.gbjson.AdjacentSpaceId;

			if ( !adjacentSpaceId ) { continue; }

			const spaceIdRef = Array.isArray( adjacentSpaceId ) ? adjacentSpaceId[ 1 ].spaceIdRef : adjacentSpaceId.spaceIdRef;

			spaces.forEach( element => child.visible = element.id === spaceIdRef && element.buildingStoreyIdRef === storeyId ? true : child.visible );

		}

	}

	let storeyJson = GBX.gbjson.Campus.Building.BuildingStorey ? GBX.gbjson.Campus.Building.BuildingStorey : [ GBX.gbjson.Campus.Building.BuildingStorey ];
	storeyJson = GBX.gbjson.Campus.Building.BuildingStorey.find( item => item.id === storeyId );
	//console.log( 'spaceJson', spaceJson );

	const htmStorey = POP.getAttributesHtml( storeyJson );

	const htm =
	`
		<b>Storey Attributes</b>
		${ htmStorey }
	`;

	POPelementAttributes.innerHTML = htm;

};



POP.toggleZoneVisible = function ( zoneIdRef ) {

	const color = POPbutZoneVisible.style.backgroundColor === '' ? 'pink' : '';
	POPbutZoneVisible.style.backgroundColor = color;

	POPbutStoreyVisible.style.backgroundColor = '';
	POPbutSurfaceFocus.style.backgroundColor = '';
	POPbutSurfaceVisible.style.backgroundColor = '';

	POPbutAdjacentSpace1.style.backgroundColor = '';
	POPbutAdjacentSpace2.style.backgroundColor = '';

	if ( color === 'pink' ) {

		const spaces = GBX.gbjson.Campus.Building.Space;

		GBX.surfaceMeshes.children.forEach( element => element.visible = false );


		for ( let child of GBX.surfaceMeshes.children ) {

			const adjacentSpaceId = child.userData.gbjson.AdjacentSpaceId;
			//console.log( 'adjacentSpaceId', adjacentSpaceId );

			if ( !adjacentSpaceId ) { continue; }

			const spaceIdRef = Array.isArray( adjacentSpaceId ) ? adjacentSpaceId[ 1 ].spaceIdRef : adjacentSpaceId.spaceIdRef;

			spaces.forEach( element => child.visible = element.id === spaceIdRef && element.zoneIdRef === zoneIdRef ? true : child.visible );

		}

	} else {

		GBX.surfaceMeshes.children.forEach( element => element.visible = true );

	}

	let zoneJson = Array.isArray( GBX.gbjson.Zone ) ? GBX.gbjson.Zone : [ GBX.gbjson.Zone ];
	zoneJson = zoneJson.find( item => item.id === zoneIdRef );
	//console.log( 'zoneJson', zoneJson );

	htmZone = POP.getAttributesHtml( zoneJson );

	const htm =
	`
		<b>Zone Attributes</b>
		${ htmZone }
	`;

	POPelementAttributes.innerHTML = htm;


};


//////////

POP.setSurfaceZoom = function() {
	//console.log( 'id', id );

	const surfaceMesh = POP.intersected;

	POP.setCameraControls( [ surfaceMesh ] );

};



