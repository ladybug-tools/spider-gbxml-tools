/* global THREE, THR, THRU, GBX, divPopupData */
// jshint esversion: 6

// Copyright 2018 Ladybug Tools authors. MIT License.

var POP = { "release": "R9.2", "date": "2018-11-12" };

POP.urlSource = "https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/cookbook/spider-gbxml-viewer-pop-up"

POP.currentStatus =
	`<details>

		<summary>Pop-Up menu current status ${ POP.date }</summary>

		<p>
			Elements and attributes identified according to <a href="http://gbxml.org/schema_doc/6.01/GreenBuildingXML_Ver6.01.html" target="_blank">gbXML Schema.</a>
		</p>
		<p>
			Beginning to operate as expected. Storey and zone attributes not yet being displayed.
		</p>
		<p>
			For wish list and fixing things see <a href="../../spider-gbxml-viewer-issues/index.html" target="_blank">issues module</a>
		</p>

		<!--
		<p>Coming next:<br>&bull; display rectangular geometry in model</p>

		<p>Status: Getting to be stable. Needs more testing. Wishlists items welcome.</p>

		<p>Toggling focus or visibility and identifying are two different things. As we design, let us try to keep these actions separate.</p>

		<p>If you are in a module, then you should never have to leave the module in order to complete the tasks assigned to that module</p>

		<p>What tooltips should appear and where?</p>
		-->

	</details>`;



	////////// Inits

POP.getMenuHtmlPopUp = function() { // call from home page

	POP.mouse = new THREE.Vector2();
	POP.raycaster = new THREE.Raycaster();
	POP.intersected = undefined;
	POP.parser = new DOMParser();

	POP.particleMaterial = new THREE.SpriteMaterial( { color: 0xff0000 } );
	POP.particle = new THREE.Sprite( POP.particleMaterial );
	POP.line = undefined;

	POP.getArray = item => Array.isArray( item ) ? item : ( item ? [ item ] : [] );

	THR.renderer.domElement.addEventListener( 'mousedown', POP.onDocumentMouseDown, false );
	THR.renderer.domElement.addEventListener( 'touchstart', POP.onDocumentTouchStart, false ); // for mobile


	const htm =
	`
		<div id = "divPopupData" >
			<h3>Pop-Up menu</h3>
			<p>
				Click on the model and surface attributes appear here.
			</p>
			<p>
				Press spacebar: to stop model rotating
			</p>
			<p>
				Use one|two|three fingers to rotate|zoom|pan display in 3D.
				Or left|scroll|right with your pointing device.
			</p>
			<p>
				Press Control-Shift-J|Command-Option-J to see if the JavaScript console reports any errors
			</p>
			<p>
				Axes: Red/Green/Blue = X/Y/Z directions
			</p>

			${ POP.currentStatus }

		</div>


		<div id=POPfooter >

			<p style=text-align:right; >
				<a href= title="View the read me file for the pop-up module" >${ POP.release }</a>
				<br>
				<button onclick=POP.onClickZoomAll(); title="Show entire campus & display attributes" >zoom all +</button>
			</p>

		</div>

	`;

	return htm;

};


////////// Events

POP.onClickZoomAll = function() {

	GBX.surfaceGroup.children.forEach( child => child.visible = true );

	THRU.zoomObjectBoundingSphere( GBX.boundingBox );
/*
	divPopupData.innerHTML=
	`
		<b>Campus Attributes</b>
		<div>${ POP.getAttributesHtml( GBX.gbjson.Campus) }</div>
		<br>
		<b>Building Attributes</b>
		<div>${ POP.getAttributesHtml(GBX.gbjson.Campus.Building) }</div>

	`;
 */
};



POP.setAllVisibleZoom = function() {

	const meshes = GBX.surfaceGroup.children.filter( mesh => mesh.visible === true );
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

	POP.intersects = POP.raycaster.intersectObjects( GBX.surfaceGroup.children );
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
	console.log( 'POP.intersected', POP.intersected );

	const index = POP.intersected.userData.index;

	let surfaceIndexed = GBX.surfacesIndexed[ index ];

	const surfaceText = surfaceIndexed.slice( surfaceIndexed.indexOf( '"<' ) + 1 );
	//console.log( 'text', text  );

	surfaceXml = POP.parser.parseFromString( surfaceText, "application/xml").documentElement;
	//console.log( 'surfaceXml', surfaceXml.attributes );

	const htmAttributes = POP.getSurfaceAttributes( surfaceXml );

	POP.surfaceId = surfaceXml.attributes.id.value;
	//console.log( 'surface', id );

	POP.surfaceType = surfaceXml.attributes.surfaceType ? surfaceXml.attributes.surfaceType.value : '';

	POP.drawBorder( surfaceXml );

	adjSpaceButtons = POP.getAdjSpaceButtons();

	storeyButton = POP.storeyId ? `<button id=POPbutStoreyVisible onclick=POP.toggleStoreyVisible("${ POP.storeyId }"); title="id: ${ POP.storeyId }" >storey: ${ POP.storeyName}</button>` : `<div id=POPbutStoreyVisible ></div>`;

	zoneButton = POP.zoneId ? `<button id=POPbutZoneVisible onclick=POP.toggleZoneVisible("${ POP.zoneId }"); title="id: ${ POP.zoneId }" >zone: ${ POP.zoneName }</button> &nbsp;` : `<div id=POPbutZoneVisible ></div>`;

	const htm =
	`
		<p><b>Visibility</b> - show/hide elements</p>
		<p>
			<button id=POPbutSurfaceFocus onclick=POP.toggleSurfaceFocus();
				title="${ POP.surfaceType }" > surface: ${POP.surfaceId } </button>
			<button id=POPbutSurfaceVisible onclick=POP.toggleSurfaceVisible();
				title="Show or hide selected surface" > &#x1f441; </button>
			<button onclick=POP.setSurfaceZoom(); title="Zoom into selected surface" > ⌕ </button>
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

	`;

	// <button onclick=POP.toggleVertexPlacards(); title="Display vertex numbers" > # </button>
	return htm;

};


POP.getAdjSpaceButtons = function() {

	let htm;

	if ( POP.adjacentSpaceId.length === 0 ) {

		htm = "";


	} else if ( POP.adjacentSpaceId.length === 1 ) {

		spaceId = POP.adjacentSpaceId[ 0 ];

		htm =
		`
			<button id=POPbutAdjacentSpace1 onclick=POP.toggleSpaceVisible(this,"${ spaceId }","");
				title="id: ${ spaceId }" >space: ${ spaceId }</button>
			</div><div id=POPbutAdjacentSpace2 ></div>
		`;


	} else if ( POP.adjacentSpaceId.length === 2 ) {

		spaceId1 = POP.adjacentSpaceId[ 0 ];
		spaceId2 = POP.adjacentSpaceId[ 1 ];

		htm =
		`
			<button id=POPbutAdjacentSpace1 onclick=POP.toggleSpaceVisible(this,"${ spaceId1 }","");
				title="id: ${ spaceId1 }" >space: ${ spaceId1 }</button>

			<button id=POPbutAdjacentSpace2 onclick=POP.toggleSpaceVisible(this,"${ spaceId2 }","");
				title="id: ${ spaceId2 }" >space: ${ spaceId2 }</button>
		`;
	}

	return htm;

};



POP.getIntersectedVertexBufferGeometry = function( point ) {
	//console.log( '', intersected );

	THR.scene.remove( POP.particle );

	const distance = THR.camera.position.distanceTo( THR.controls.target );

	POP.particle.scale.x = POP.particle.scale.y = 0.01 * distance;
	POP.particle.position.copy( point );

	THR.scene.add( POP.particle );

};



POP.drawBorder = function( surfaceXml ) {

	THR.scene.remove( POP.line );

	const planar = surfaceXml.getElementsByTagName( 'PlanarGeometry' )[ 0 ];

	const points = Array.from( planar.getElementsByTagName( 'CartesianPoint' ) );

	//console.log( 'points', points );

	vertices = points.map( point => {

		//console.log( 'vert', point );

		const coor = Array.from( point.children );

		const pt = new THREE.Vector3( Number( coor[ 0 ].innerHTML ), Number( coor[ 1 ].innerHTML ), Number( coor[ 2 ].innerHTML ) )

		return pt;

	} );


	const geometry = new THREE.Geometry().setFromPoints( vertices );
	//console.log( 'geometry', geometry );

	const material = new THREE.LineBasicMaterial( { color: 0xff00ff, linewidth: 2, transparent: true } );

	POP.line = new THREE.LineLoop( geometry, material );
	THR.scene.add( POP.line );



};



//////////

POP.getSurfaceAttributes = function( surfaceXml ) {
	//console.log( 'surfaceXml', surfaceXml );
	s = surfaceXml;

	const htmSurface = POP.getAttributesHtml( surfaceXml );
	const htmAdjacentSpace = POP.getAttributesAdjacentSpace( surfaceXml );
	const htmPlanarGeometry = POP.getAttributesPlanarGeometry( surfaceXml );

	const rect = surfaceXml.getElementsByTagName( "RectangularGeometry" )[ 0 ];
	//console.log( '', rect );
	const htmRectangularGeometry = POP.getAttributesHtml( rect );

	const htm =
	`
		<p>
			<div><b>Selected Surface Attributes</b></div>
			${ htmSurface }
		</p>

		<details>
			<summary> AdjacentSpace</summary>

			<p> ${ htmAdjacentSpace }
		</details>

		<details>
			<summary> Planar Geometry </summary>
			${ htmPlanarGeometry }
		</details>

		<details>
			<summary> Rectangular Geometry </summary>
			<div>${ htmRectangularGeometry } </div>
		</details>
	`;

	return htm;

};



POP.getAttributesHtml = function( obj ) {
	//console.log( 'obj', obj );

	let htm ='';

	for ( let attribute of obj.attributes ) {

		htm +=
		`<div>
			<span class=attributeTitle >${ attribute.name }</span>:
			<span class=attributeValue >${ attribute.value }</span>
		</div>`;
	}

	const nodes = obj.childNodes;
	const numbers = ['Azimuth', 'Height', 'Tilt', 'Width' ];

	for ( let node of nodes ) {
		//console.log( 'node', node);

		if ( node.nodeName !== "#text" ) {
			//console.log( 'node', node.nodeName, node );

			if ( node.childElementCount > 0 ) {
				//console.log( 'node', node );

			} else if ( node.innerHTML ) {
				//console.log( 'node', node );

				const value = numbers.includes( node.nodeName ) ? Number( node.innerHTML ).toLocaleString() : node.innerHTML;
				htm +=

				`<div>
					<span class=attributeTitle >${ node.nodeName }</span>:
					<span class=attributeValue >${ value }</span>
				</div>`;

			}

		} else {

			//console.log( 'node', node );

		}

	}

	return htm;

};



POP.getAttributesAdjacentSpace = function( surfaceXml ){

	adjacentSpaceId = surfaceXml.getElementsByTagName( "AdjacentSpaceId" );
	//console.log( 'adjacentSpaceId', adjacentSpaceId );
	//a = adjacentSpaceId

	let htm;

	if ( adjacentSpaceId.length === 0 ) {

		POP.adjacentSpaceId = [];
		POP.storey = '';

		htm = 'No adjacent space';

	} else if ( adjacentSpaceId.length === 2 ) {

		//console.log( 'obj.AdjacentSpaceId', obj.AdjacentSpaceId );

		space1 = adjacentSpaceId[ 0 ].getAttribute( "spaceIdRef" );
		space2 = adjacentSpaceId[ 1 ].getAttribute( "spaceIdRef" );

		POP.adjacentSpaceId = [ space1, space2 ];

		POP.setAttributesStoreyAndZone( space2 );

		htm =
		`
			<div>
				<span class=attributeTitle >spaceIdRef 1:</span>
				<span class=attributeValue >${ space1 }</span>
			</div>
			<div>
				<span class=attributeTitle >spaceIdRef 2:</span>
				<span class=attributeValue >${ space2 }</span>
			</div>
		`;

	} else {

		//console.log( 'obj.AdjacentSpaceId', obj.AdjacentSpaceId );

		spaceId = adjacentSpaceId[ 0 ].getAttribute( "spaceIdRef" );
		POP.adjacentSpaceId = [ spaceId];

		POP.setAttributesStoreyAndZone( spaceId );

		htm =

		`<div>
			<span class=attributeTitle >spaceIdRef:</span>
			<span class=attributeValue >${ spaceId }</span>
		</div>`;

	}

	return htm;

};



POP.setAttributesStoreyAndZone = function( spaceId ) {

	const spaceText = GBX.spaces.find( item => item.includes( spaceId ) )
	//console.log( 'spaceText', spaceText );

	POP.storeyId = spaceText.match ( /buildingStoreyIdRef="(.*?)"/ )[ 1 ];
	//console.log( 'storeyId', POP.storeyId[ 1 ] );

	const storeyText = GBX.storeys.find( item => item.includes( POP.storeyId ) );
	//console.log( 'storeyText', storeyText );

	POP.storeyName = storeyText.match ( '<Name>(.*?)</Name>' )[ 1 ];
	//console.log( 'POP.storeyName', POP.storeyName );

	POP.zoneId = spaceText.match ( /zoneIdRef="(.*?)"/ )[ 1 ];
	//console.log( 'zoneId', POP.zoneId[ 1 ] );

	const zoneText = GBX.zones.find( item => item.includes( POP.zoneId ) );
	//console.log( 'storeyText', zoneText );

	POP.zoneName = zoneText.match ( '<Name>(.*?)</Name>' )[ 1 ];
	//console.log( 'POP.zoneName', POP.zoneName );

}




POP.getAttributesPlanarGeometry = function( surfaceXml ) {

	const plane = surfaceXml.getElementsByTagName( 'PlanarGeometry' );

	const points = plane[ 0 ].getElementsByTagName( 'Coordinate' );
	//console.log( 'points', points );

	let htm = '';
	for ( let i = 0; i < points.length; ) {

		htm +=
		`
			<div><span class=attributeTitle >CartesianPoint:</span></div>
			&nbsp;
			<span class=attributeTitle >x:</span> <span class=attributeValue >${ Number( points[ i++ ].innerHTML ).toLocaleString() }</span>
			<span class=attributeTitle >y:</span> <span class=attributeValue >${ Number( points[ i++ ].innerHTML ).toLocaleString() }</span>
			<span class=attributeTitle >z:</span> <span class=attributeValue >${ Number( points[ i++ ].innerHTML ).toLocaleString() }</span><br>
		`;

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

/* 	POPbutSurfaceVisible.style.backgroundColor = '';
	POPbutStoreyVisible.style.backgroundColor = '';
	POPbutZoneVisible.style.backgroundColor = '';

	POPbutAdjacentSpace1.style.backgroundColor = '';
	POPbutAdjacentSpace2.style.backgroundColor = '';
 */
	if ( color === 'pink' ) {

		GBX.surfaceGroup.children.forEach( child => child.visible = false );

		POP.intersected.visible = true;

	} else {

		GBX.surfaceGroup.children.forEach( child => child.visible = true );

	}

	//const surfaceJson = POP.intersected.userData.gbjson;

	//POPelementAttributes.innerHTML = POP.getSurfaceAttributes( surfaceJson );

};



POP.toggleSurfaceVisible = function() {

	POP.intersected.visible = !POP.intersected.visible;

	const color = POPbutSurfaceVisible.style.backgroundColor === '' ? 'pink' : '';
	POPbutSurfaceVisible.style.backgroundColor = color;

	/*
	POPbutSurfaceFocus.style.backgroundColor = '';
	POPbutStoreyVisible.style.backgroundColor = '';
	POPbutZoneVisible.style.backgroundColor = '';

	POPbutAdjacentSpace1.style.backgroundColor = '';
	POPbutAdjacentSpace2.style.backgroundColor = '';
	*/

	//const surfaceJson = POP.intersected.userData.gbjson;
	//POPelementAttributes.innerHTML = POP.getSurfaceAttributes( POP.intersected );

};



POP.toggleVertexPlacards = function() {

	const vertices = POP.intersected.userData.gbjson.PlanarGeometry.PolyLoop.CartesianPoint
	.map( point => new THREE.Vector3().fromArray( point.Coordinate.map( point => Number( point ) )  ) );

	console.log( 'vvv', vertices );

	const distance = THR.camera.position.distanceTo( THR.controls.target );
	const scale = 0.01;
	const placards = vertices.map( ( vertex, index ) =>
		THRU.drawPlacard( '#' + ( 1 + index ), 0.0003 * distance, 0x00ff00, vertex.x + scale * distance, vertex.y + scale * distance, vertex.z + scale * distance )
	);

	console.log( '', placards );
	POP.line.add( ...placards );

};



POP.toggleSpaceVisible = function( button, spaceId ) {

	button.classList.toggle( "active" );

	visible1 = POPbutAdjacentSpace1.classList.contains( "active" );
	spaceId1 = POPbutAdjacentSpace1.innerHTML.slice( 7 );

	visible2 = POPbutAdjacentSpace2.classList.contains( "active" );
	spaceId2 = POPbutAdjacentSpace2.innerHTML.slice( 7 );

	//console.log( 'adj space vis', visible1, visible2 );


	const children =  GBX.surfaceGroup.children;

	if ( visible1 === false && visible2 === false ) {

		children.forEach( child => child.visible = true );

	} else if ( ( visible1 === true && visible2 === false ) || ( visible1 === false && visible2 === true ) ) {

		children.forEach( child => child.visible = false );

		for ( let child of children )  {

			const id = child.userData.index;
			const surface = GBX.surfaces[ id ];
			const arr = surface.match( / spaceIdRef="(.*?)"/g );
			//console.log( 'arr', arr );

			if ( !arr ) { break; }

			arr.forEach( item => child.visible = item.includes( spaceId ) ? true : child.visible );

		}

	} else if ( visible1 === true && visible2 === true ) {

		children.forEach( child => child.visible = false );

		for ( let child of children )  {

			const id = child.userData.index;
			const surface = GBX.surfaces[ id ];
			const arr = surface.match( / spaceIdRef="(.*?)"/g );

			if ( !arr ) { break; };

			arr.forEach( item => child.visible = item.includes( spaceId1 ) || item.includes( spaceId2 ) ? true : child.visible );

		}

	}

	const spaceTxt = GBX.spaces.find( item => item.includes( ` id="${ spaceId }"` ) );

	const spaceXml = POP.parser.parseFromString( spaceTxt, "application/xml").documentElement;
	//console.log( 'spaceXml ', spaceXml );

	const htmSpace = POP.getAttributesHtml( spaceXml );

	const htm =
	`
		<b>Selected Space Attributes</b>
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

	const children =  GBX.surfaceGroup.children;

	if ( color === '' ) {

		children.forEach( child => child.visible = true );

	} else {

		const spaces = GBX.gbjson.Campus.Building.Space;

		GBX.surfaceGroup.children.forEach( element => element.visible = false );

		for ( let child of GBX.surfaceGroup.children ) {

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

		GBX.surfaceGroup.children.forEach( element => element.visible = false );


		for ( let child of GBX.surfaceGroup.children ) {

			const adjacentSpaceId = child.userData.gbjson.AdjacentSpaceId;
			//console.log( 'adjacentSpaceId', adjacentSpaceId );

			if ( !adjacentSpaceId ) { continue; }

			const spaceIdRef = Array.isArray( adjacentSpaceId ) ? adjacentSpaceId[ 1 ].spaceIdRef : adjacentSpaceId.spaceIdRef;

			spaces.forEach( element => child.visible = element.id === spaceIdRef && element.zoneIdRef === zoneIdRef ? true : child.visible );

		}

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	}

	let zoneJson = Array.isArray( GBX.gbjson.Zone ) ? GBX.gbjson.Zone : [ GBX.gbjson.Zone ];
	zoneJson = zoneJson.find( item => item.id === zoneIdRef );
	//console.log( 'zoneJson', zoneJson );

	const htmZone = POP.getAttributesHtml( zoneJson );

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



