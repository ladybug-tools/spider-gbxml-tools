/* global THREE, THR, THRU, GBX, divPopUpData, POPXdivShowHide, POPXelementAttributes, POPXbutAdjacentSpace1, POPXbutAdjacentSpace2 */
// jshint esversion: 6

// Copyright 2019 Ladybug Tools authors. MIT License.

var POPX = { "version": "0.16.0-0", "date": "2019-06-11" };

POPX.urlSource = "https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/cookbook/spider-gbxml-viewer-pop-up";


////////// Inits

POPX.init = function() { // call from home page

	POPX.mouse = new THREE.Vector2();
	POPX.raycaster = new THREE.Raycaster();
	POPX.intersected = undefined;
	POPX.parser = new DOMParser();

	POPX.particleMaterial = new THREE.SpriteMaterial( { color: 0xff0000 } );
	POPX.particle = new THREE.Sprite( POPX.particleMaterial );
	POPX.line = undefined;

	POPX.getArray = item => Array.isArray( item ) ? item : ( item ? [ item ] : [] );

	THR.renderer.domElement.addEventListener( 'mousedown', POPX.onDocumentMouseDown, false );
	THR.renderer.domElement.addEventListener( 'touchstart', POPX.onDocumentTouchStart, false ); // for mobile

};



////////// Events

POPX.onClickZoomAll = function() {

	GBX.surfaceGroup.children.forEach( child => child.visible = true );

	THRU.zoomObjectBoundingSphere( GBX.boundingBox );

	const time = performance.now();

	const campusXml = POPX.parser.parseFromString( GBX.text, "application/xml").documentElement;
	POPX.campusXml = campusXml;
	//console.log( 'campusXml', campusXml.attributes );

	const buildingXml = campusXml.getElementsByTagName( 'Building' )[ 0 ];

	POPdivPopupData.innerHTML=
	`
		<b>Campus Attributes</b>
		<div>${ POPX.getAttributesHtml( campusXml ) }</div>
		<br>
		<b>Building Attributes</b>
		<div>${ POPX.getAttributesHtml( buildingXml ) }</div>

	`;

	//console.log( '', performance.now() - time );
};



POPX.setAllVisibleZoom = function() {

	const meshes = GBX.surfaceGroup.children.filter( mesh => mesh.visible === true );
	//console.log( 'meshes', meshes );

	POPX.setCameraControls( meshes );

};



POPX.setCameraControls = function( meshes ) {

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

POPX.onDocumentTouchStart = function( event ) {

	event.preventDefault();

	//console.log( 'event', event );

	event.clientX = event.touches[0].clientX;
	event.clientY = event.touches[0].clientY;

	POPX.onDocumentMouseDown( event );

};



POPX.onDocumentMouseDown = function( event ) {
	//console.log( 'event', event.button );

	if ( event.button !== 0 ) { return ; }

	event.preventDefault();

	/*
	POPX.mouse.x = ( event.clientX / size.width ) * 2 - 1;
	POPX.mouse.y = - ( event.clientY / size.height ) * 2 + 1;
	*/

	const x = event.offsetX == undefined ? event.layerX : event.offsetX;
	const y = event.offsetY == undefined ? event.layerY : event.offsetY;
	//console.log( 'x', x );

	const size = THR.renderer.getSize( new THREE.Vector2() );

	POPX.mouse.x = ( x / size.width ) * 2 - 1;
	POPX.mouse.y = - ( y / size.height ) * 2 + 1;

	POPX.raycaster.setFromCamera( POPX.mouse, THR.camera );

	POPX.intersects = POPX.raycaster.intersectObjects( GBX.surfaceGroup.children );
	//console.log( 'POPX.intersects', POPX.intersects );

	if ( POPX.intersects.length > 0 ) {

		POPX.intersected = POPX.intersects[ 0 ].object;

		POPX.getIntersectedVertexBufferGeometry( POPX.intersects[ 0 ].point );

		navPopup.hidden = false;

		POPdivPopupData.innerHTML = POPX.getIntersectedDataHtml();

		POPdivMessage.innerHTML =
		`
			<p style=text-align:right; >
				<button onclick=POPX.onClickZoomAll(); title="Show entire campus & display attributes" >zoom all +</button>
				<button onclick=SET.toggleOpenings(); >toggle openings</button>
			</p>
		`;

	} else {

		POPX.intersected = null;

		POPdivPopupData.innerHTML = '';

		THR.scene.remove( POPX.line, POPX.particle );

	}

};



POPX.getIntersectedVertexBufferGeometry = function( point ) {
	//console.log( 'point', point );

	THR.scene.remove( POPX.particle );

	const distance = THR.camera.position.distanceTo( THR.controls.target );

	POPX.particle.scale.x = POPX.particle.scale.y = 0.01 * distance;
	POPX.particle.position.copy( point );

	THR.scene.add( POPX.particle );

};



POPX.getIntersectedDataHtml = function() {
	console.log( 'POPX.intersected', POPX.intersected );

	const index = POPX.intersected.userData.index;

	const surfaceIndexed = GBX.surfacesIndexed[ index ];

	const surfaceText = surfaceIndexed.slice( surfaceIndexed.indexOf( '"<' ) + 1 );

	const surfaceXml = POPX.parser.parseFromString( surfaceText, "application/xml").documentElement;
	POPX.surfaceXml = surfaceXml;
	//console.log( 'surfaceXml', surfaceXml.attributes );

	POPX.drawBorder( surfaceXml );

	const htmAttributes = GSA.getSurfaceAttributes( surfaceXml );
	//console.log( 'htmAttributes', htmAttributes );

	POPX.surfaceId = surfaceXml.attributes.id.value;

	POPX.surfaceType = surfaceXml.attributes.surfaceType ? surfaceXml.attributes.surfaceType.value : '';

	const adjSpaceButtons = POPX.getAdjSpaceButtons();

	const storeyButton = POPX.storeyId ? `<button id=POPXbutStoreyVisible onclick=POPXelementAttributes.innerHTML=POPX.toggleStoreyVisible(this,"${ POPX.storeyId }"); title="id: ${ POPX.storeyId }" >storey: ${ POPX.storeyName}</button>` : `<div id=POPXbutStoreyVisible ></div>`;

	const zoneButton = POPX.zoneId ? `<button id=POPXbutZoneVisible onclick=POPXelementAttributes.innerHTML=POPX.getToggleZoneVisible(this,"${ POPX.zoneId }"); title="id: ${ POPX.zoneId }" >zone: ${ POPX.zoneName }</button> &nbsp;` : `<span id=POPXbutZoneVisible >None</span>`;

	const htm =
	`
		<p><b>Visibility</b> - show/hide elements</p>

		<div id=POPXdivShowHide >

			<p>
				<button id=POPXbutSurfaceFocus onclick=POPX.toggleSurfaceFocus(this);
					title="${ POPX.surfaceType }" > surface: ${POPX.surfaceId } </button>
				<button id=POPXbutSurfaceVisible onclick=POPX.toggleSurfaceVisible();
					title="Show or hide selected surface" > &#x1f441; </button>
				<button onclick=POPX.setSurfaceZoom(); title="Zoom into selected surface" > ⌕ </button>

				<button onclick=POPX.toggleSurfaceNeighbors(); title="Show adjacent surfaces" > # </button>
			</p>

			<p>
				${ adjSpaceButtons }
			</p>

			<p>
				${ storeyButton } ${ zoneButton }

				<button onclick=POPX.setAllVisibleZoom(); title="Zoom whatever is visible" >⌕</button>
			</p>

		</div>

		<div id=POPXelementAttributes >
			${ htmAttributes }
		</div>
		<hr>

	`;
	// to do <button onclick=POPX.toggleVertexPlacards(); title="Display vertex numbers" > # </button>

	return htm;

};



POPX.drawBorder = function( surfaceXml ) {

	THR.scene.remove( POPX.line );

	const planar = surfaceXml.getElementsByTagName( 'PlanarGeometry' )[ 0 ];

	const points = Array.from( planar.getElementsByTagName( 'CartesianPoint' ) );
	//console.log( 'points', points );

	const vertices = points.map( point => {

		const cord = Array.from( point.children );

		const vertex = new THREE.Vector3( Number( cord[ 0 ].innerHTML ), Number( cord[ 1 ].innerHTML ), Number( cord[ 2 ].innerHTML ) );

		return vertex;

	} );

	const geometry = new THREE.Geometry().setFromPoints( vertices );
	//console.log( 'geometry', geometry );

	const material = new THREE.LineBasicMaterial( { color: 0xff00ff, linewidth: 2, transparent: true } );

	POPX.line = new THREE.LineLoop( geometry, material );

	THR.scene.add( POPX.line );

};



POPX.getAdjSpaceButtons = function() {

	let htm;

	if ( GSA.adjacentSpaceIds.length === 0 ) {

		htm = "";

	} else if ( GSA.adjacentSpaceIds.length === 1 ) {

		const spaceId = GSA.adjacentSpaceIds[ 0 ];


		//console.log( 'space', space );

		htm =
		`
			<button id=POPXbutAdjacentSpace1 onclick=POPX.toggleSpaceVisible(this,"${ spaceId }","");
				title="id: ${ spaceId }" >space: ${ POPX.spaceNames[ 0 ] }</button>
			</div><div id=POPXbutAdjacentSpace2 ></div>
		`;


	} else if ( GSA.adjacentSpaceIds.length === 2 ) {

		const spaceId1 = GSA.adjacentSpaceIds[ 0 ];
		const spaceId2 = GSA.adjacentSpaceIds[ 1 ];

		htm =
		`
			<button id=POPXbutAdjacentSpace1 onclick=POPX.toggleSpaceVisible(this,"${ spaceId1 }","");
				title="id: ${ spaceId1 }" >space: ${ POPX.spaceNames[ 0 ] }</button>

			<button id=POPXbutAdjacentSpace2 onclick=POPX.toggleSpaceVisible(this,"${ spaceId2 }","");
				title="id: ${ spaceId2 }" >space: ${ POPX.spaceNames[ 1 ] }</button>
		`;
	}

	return htm;

};



//////////

POPX.xxxgetSurfaceAttributes = function( surfaceXml ) {
	//console.log( 'surfaceXml', surfaceXml );

	const htmSurface = POPX.getAttributesHtml( surfaceXml );
	const htmAdjacentSpace = POPX.getAttributesAdjacentSpace( surfaceXml );
	const htmPlanarGeometry = POPX.getAttributesPlanarGeometry( surfaceXml );

	const rect = surfaceXml.getElementsByTagName( "RectangularGeometry" )[ 0 ];
	//console.log( '', rect );
	const htmRectangularGeometry = POPX.getAttributesHtml( rect );

	const htm =
	`
		<p>
			<div><b>Selected Surface Attributes</b></div>
			${ htmSurface }
		</p>

		<details>
			<summary> AdjacentSpace</summary>
			${ htmAdjacentSpace }
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



POPX.xxxgetAttributesHtml = function( obj ) {
	//console.log( 'obj', obj );

	let htm ='';

	if ( !obj.attributes ) { return htm; }  //////////  make more forgiving

	for ( let attribute of obj.attributes ) {

		htm +=
		`<div>
			<span class=attributeTitle >${ attribute.name }</span>:
			<span class=attributeValue >${ attribute.value }</span>
		</div>`;

		if ( attribute.name === "constructionIdRef" ) {

			//console.log( 'attribute.value', attribute.value );
			//constructions = GBX.text.match( /<Construction(.*?)<\/Construction>/gi );

			// silly way of doing things, but it's a start
			const campusXml = POPX.parser.parseFromString( GBX.text, "application/xml").documentElement;
			//POPX.campusXml = campusXml;
			//console.log( 'campusXml', campusXml.attributes );

			constructions = Array.from( campusXml.getElementsByTagName( 'Construction' ) );
			construction = constructions.find( item => item.id === attribute.value )
			//console.log( 'construction', construction);

			xmlText = new XMLSerializer().serializeToString( construction );
			//console.log( 'xmlText', xmlText );

			htm += `<textarea style=height:5rem;width:100%; >${ xmlText }</textarea>`;

		}

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



POPX.getAttributesAdjacentSpace = function( surfaceXml ){

	const adjacentSpaceId = surfaceXml.getElementsByTagName( "AdjacentSpaceId" );
	//console.log( 'adjacentSpaceId', adjacentSpaceId );
	//a = adjacentSpaceId

	let htm;

	if ( adjacentSpaceId.length === 0 ) {

		GSA.adjacentSpaceIds = [];
		POPX.storey = '';

		htm = 'No adjacent space';

	} else if ( adjacentSpaceId.length === 2 ) {

		//console.log( 'obj.AdjacentSpaceId', obj.AdjacentSpaceId );

		const space1 = adjacentSpaceId[ 0 ].getAttribute( "spaceIdRef" );
		const space2 = adjacentSpaceId[ 1 ].getAttribute( "spaceIdRef" );

		GSA.adjacentSpaceIds = [ space1, space2 ];

		spaceText1 = GBX.spaces.find( space => space.includes( space1 ) )
		spaceName1 = spaceText1.match( /<Name>(.*?)<\/Name>/i )[ 1 ];


		spaceText2 = GBX.spaces.find( space => space.includes( space2 ) )
		spaceName2 = spaceText2.match( /<Name>(.*?)<\/Name>/i )[ 1 ];

		POPX.spaceNames = [ spaceName1, spaceName2 ];
		POPX.setAttributesStoreyAndZone( space2 );

		htm =
		`
			<div>
				<span class=attributeTitle >spaceIdRef 1:</span>
				<span class=attributeValue >${ space1 }</span>
				<br>
				<span class=attributeTitle >Name:</span>
				<span class=attributeValue >${ spaceName1 }</span>
			</div>
			<br>
			<div>
				<span class=attributeTitle >spaceIdRef 2:</span>
				<span class=attributeValue >${ space2 }</span>
				<br>
				<span class=attributeTitle >Name:</span>
				<span class=attributeValue >${ spaceName2 }</span>
			</div>
		`;

	} else {

		//console.log( 'obj.AdjacentSpaceId', obj.AdjacentSpaceId );

		const spaceId = adjacentSpaceId[ 0 ].getAttribute( "spaceIdRef" );
		GSA.adjacentSpaceIds = [ spaceId];

		const spaceText1 = GBX.spaces.find( space => space.includes( spaceId ) )
		const spaceName1 = spaceText1.match( /<Name>(.*?)<\/Name>/i )[ 1 ];


		POPX.spaceNames = [ spaceName1 ];

		POPX.setAttributesStoreyAndZone( spaceId );

		htm =

		`<div>
			<span class=attributeTitle >spaceIdRef:</span>
			<span class=attributeValue >${ spaceId }</span>
			<br>
			<span class=attributeTitle >Name:</span>
			<span class=attributeValue >${ spaceName1 }</span>
		</div>`;

	}

	return htm;

};



POPX.setAttributesStoreyAndZone = function( spaceId ) {

	const spaceText = GBX.spaces.find( item => item.includes( spaceId ) );
	//console.log( 'spaceText', spaceText );

	POPX.storeyId = spaceText.match ( /buildingStoreyIdRef="(.*?)"/ )[ 1 ];
	//console.log( 'storeyId', POPX.storeyId[ 1 ] );

	const storeyText = GBX.storeys.find( item => item.includes( POPX.storeyId ) );
	//console.log( 'storeyText', storeyText );

	const storeyName = storeyText.match ( '<Name>(.*?)</Name>' );

	POPX.storeyName = storeyName ? storeyName[ 1 ] : "no storey name in file";
	//console.log( 'POPX.storeyName', POPX.storeyName );

	POPX.zoneId = spaceText.match ( /zoneIdRef="(.*?)"/ );

	if ( POPX.zoneId ) {

		POPX.zoneId = POPX.zoneId[ 1 ];
		//console.log( 'zoneId', POPX.zoneId[ 1 ] );

		const zoneText = GBX.zones.find( item => item.includes( POPX.zoneId ) );
		//console.log( 'storeyText', zoneText );

		POPX.zoneName = zoneText.match ( '<Name>(.*?)</Name>' )[ 1 ];
		//console.log( 'POPX.zoneName', POPX.zoneName );


	} else {

		POPX.zoneName = "None";

	}


};



POPX.getAttributesPlanarGeometry = function( surfaceXml ) {

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


//////////

POPX.setOneButtonActive = function( button ) {

	const buttons = POPXdivShowHide.querySelectorAll( "button" );

	Array.from( buttons ).forEach( butt => { if ( butt !== button ) ( button.classList.remove( "active" ) ); } );

	//button.classList.add( "active" );

};



POPX.toggleSurfaceFocus = function( button ) {

	button.classList.toggle( "active" );

	//POPX.setOneButtonActive( button );

	const focus = button.classList.contains( "active" );

	if ( focus === true ) {

		GBX.surfaceGroup.children.forEach( child => child.visible = false );

		POPX.intersected.visible = true;


		const bbox = new THREE.Box3();
		const meshes = [ POPX.intersected ];

		meshes.forEach( mesh => bbox.expandByObject ( mesh ) );

		const sphere = bbox.getBoundingSphere( new THREE.Sphere() );
		const center = sphere.center;
		//const radius = sphere.radius;
		const radius = THRU.radius;
		const vector = THR.camera.position.clone().sub( THR.controls.target );

		THR.controls.target.copy( center );
		THR.camera.position.copy( center.clone().add( vector ) );


	} else {

		GBX.surfaceGroup.children.forEach( child => child.visible = true );

	}

	//const surfaceJson = POPX.intersected.userData.gbjson;

	POPXelementAttributes.innerHTML = POPX.getSurfaceAttributes( POPX.surfaceXml );

};



POPX.toggleSurfaceVisible = function() {

	POPX.intersected.visible = !POPX.intersected.visible;

};



POPX.toggleVertexPlacards = function() {

	const vertices = POPX.intersected.userData.gbjson.PlanarGeometry.PolyLoop.CartesianPoint
		.map( point => new THREE.Vector3().fromArray( point.Coordinate.map( point => Number( point ) )  ) );

	console.log( 'vvv', vertices );

	const distance = THR.camera.position.distanceTo( THR.controls.target );
	const scale = 0.01;
	const placards = vertices.map( ( vertex, index ) =>
		THRU.drawPlacard( '#' + ( 1 + index ), 0.0003 * distance, 0x00ff00, vertex.x + scale * distance, vertex.y + scale * distance, vertex.z + scale * distance )
	);

	console.log( '', placards );
	POPX.line.add( ...placards );

};



POPX.toggleSpaceVisible = function( button, spaceId ) {

	button.classList.toggle( "active" );

	const visible1 = POPXbutAdjacentSpace1.classList.contains( "active" );
	const spaceId1 = POPXbutAdjacentSpace1.innerHTML.slice( 7 );

	const visible2 = POPXbutAdjacentSpace2.classList.contains( "active" );
	const spaceId2 = POPXbutAdjacentSpace2.innerHTML.slice( 7 );
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

			if ( !arr ) { break; }

			arr.forEach( item => child.visible = item.includes( spaceId1 ) || item.includes( spaceId2 ) ? true : child.visible );

		}

	}

	const spaceTxt = GBX.spaces.find( item => item.includes( ` id="${ spaceId }"` ) );

	const spaceXml = POPX.parser.parseFromString( spaceTxt, "application/xml").documentElement;
	//console.log( 'spaceXml ', spaceXml );

	const htmSpace = POPX.getAttributesHtml( spaceXml );

	const htm =
	`
		<b>Selected Space Attributes</b>
		${ htmSpace }
	`;

	POPXelementAttributes.innerHTML = htm;

};



POPX.toggleStoreyVisible = function( button, storeyId ) {

	button.classList.toggle( "active" );

	const focus = button.classList.contains( "active" );

	const children =  GBX.surfaceGroup.children;

	if ( focus === true ) {

		children.forEach( element => element.visible = false );

		const spaces = GBX.spaces;

		//const spaceIdRef = GSA.adjacentSpaceIds.length === 1 ? GSA.adjacentSpaceIds[ 0 ] : GSA.adjacentSpaceIds[ 1 ];

		const spaceIdsInStory = [];

		for ( let space of spaces ) {

			const spaceStoryId = space.match( `buildingStoreyIdRef="(.*?)"` )[ 1 ];

			if ( spaceStoryId === storeyId ) {

				const spaceId = space.match( ` id="(.*?)"` )[ 1 ];
				//console.log( 'spaceId', spaceId );

				spaceIdsInStory.push( spaceId );

			}

		}
		//console.log( 'spaceIdsInStory', spaceIdsInStory );


		for ( let child of children ) {

			const id = child.userData.index;
			const surface = GBX.surfaces[ id ];
			const spacesArr = surface.match( / spaceIdRef="(.*?)"/g );

			if ( !spacesArr ) { break; }

			const spacesIdsArr = spacesArr.map( space => space.match( `="(.*?)"` )[ 1 ] );

			//console.log( 'spacesIdsArr', spacesIdsArr );

			for ( let spaceId of spaceIdsInStory ) {

				child.visible = spacesIdsArr.includes( spaceId ) ? true : child.visible;

			}

		}

	} else {

		children.forEach( child => child.visible = true );
	}

	const storeyTxt = GBX.storeys.find( item => item.includes( ` id="${ storeyId }"` ) );

	const storeyXml = POPX.parser.parseFromString( storeyTxt, "application/xml").documentElement;
	//console.log( 'spaceXml ', spaceXml );

	const htmStorey = POPX.getAttributesHtml( storeyXml );

	const htm =
	`
		<b>Selected Storey Attributes</b>
		${ htmStorey }
	`;

	return htm;

};



POPX.getToggleZoneVisible = function ( button, zoneIdRef ) {

	button.classList.toggle( "active" );

	const focus = button.classList.contains( "active" );
	const children = GBX.surfaceGroup.children;

	if ( focus === true ) {

		children.forEach( element => element.visible = false );

		const spaces = GBX.spaces;

		//const spaceIdRef = GSA.adjacentSpaceIds.length === 1 ? GSA.adjacentSpaceIds[ 0 ] : GSA.adjacentSpaceIds[ 1 ];

		const spaceIdsInZone = [];

		for ( let space of spaces ) {

			const spaceZoneId = space.match( /zoneIdRef="(.*?)"/ );

			if ( spaceZoneId && spaceZoneId[ 1 ] === zoneIdRef ) {
				//console.log( 'spaceZoneId', spaceZoneId[ 1 ] );

				const spaceId = space.match( ` id="(.*?)"` )[ 1 ];
				//console.log( 'spaceId', spaceId );

				spaceIdsInZone.push( spaceId );

			}

		}
		//console.log( 'spaceIdsInZone', spaceIdsInZone );


		for ( let child of children ) {

			const id = child.userData.index;
			const surface = GBX.surfaces[ id ];
			const spacesArr = surface.match( / spaceIdRef="(.*?)"/g );
			//console.log( 'spacesArr', spacesArr );

			if ( spacesArr ) {

				const spacesIdsArr = spacesArr.map( space => space.match( `="(.*?)"` )[ 1 ] );
				//console.log( 'spacesIdsArr', spacesIdsArr );

				for ( let spaceId of spaceIdsInZone ) {

					child.visible = spacesIdsArr.includes( spaceId ) ? true : child.visible;

				}

			}

		}

	} else {

		children.forEach( child => child.visible = true );

	}

	const zoneTxt = GBX.zones.find( item => item.includes( ` id="${ zoneIdRef }"` ) );

	const zoneXml = POPX.parser.parseFromString( zoneTxt, "application/xml").documentElement;
	//console.log( 'spaceXml ', spaceXml );

	const htmZone = POPX.getAttributesHtml( zoneXml );

	GBX.surfaceOpenings.traverse( function ( child ) {

		if ( child instanceof THREE.Line ) {

			child.visible = false;

		}

	} );

	const htm =
	`
		<b>Selected Zone Attributes</b>
		${ htmZone }
	`;

	return htm;

};



//////////

POPX.setSurfaceZoom = function() {

	const surfaceMesh = POPX.intersected;

	POPX.setCameraControls( [ surfaceMesh ] );

};


POPX.toggleSurfaceNeighbors = function() {

	const surfaceMesh = POPX.intersected;

	surfaceText  = GBX.surfaces[ POPX.intersected.userData.index ]
	//console.log( 'surfaceText', surfaceText );

	cartesianPoints = [];

	planarGeometry = surfaceText.match( /<PlanarGeometry(.*?)<\/PlanarGeometry>/gi )[ 0 ];
	//console.log( 'planarGeometry', planarGeometry );

	cartesianPoints = planarGeometry.match( /<CartesianPoint(.*?)<\/CartesianPoint>/gi );
	//console.log( 'cartesianPoints', cartesianPoints );

	surfaces = [];
	GBX.surfacesIndexed.forEach( ( surface, index ) => {

		ss = cartesianPoints.filter( point => surface.includes( point ) )

		if ( ss.length > 0 ) { surfaces.push( surface ) };

	} );

	//console.log( '', surfaces );

	GBX.sendSurfacesToThreeJs( surfaces );

};