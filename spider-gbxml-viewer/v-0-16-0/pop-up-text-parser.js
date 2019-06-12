/* global THREE, THR, THRU, GBX, divPopUpData, POPdivShowHide, POPelementAttributes, POPbutAdjacentSpace1, POPbutAdjacentSpace2 */
// jshint esversion: 6

// Copyright 2019 Ladybug Tools authors. MIT License.

var POP = { "version": "0.16.0-0", "date": "2019-06-11" };

POP.urlSource = "https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/cookbook/spider-gbxml-viewer-pop-up";


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
		<div id = "divPopUpData" >

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

		</div>
	`;

	divMessage.innerHTML =
	`
		<div id=POPfooter >

			<p style=text-align:right; >
				<a id=popFoot class=helpItem href="JavaScript:MNU.setPopupShowHide(popFoot,POP.currentStatus);" title="View the read me file for the pop-up module" >&nbsp; ? &nbsp;</a>
				<br>
				<button onclick=POP.onClickZoomAll(); title="Show entire campus & display attributes" >zoom all +</button>
				<button onclick=SET.toggleOpenings(); >toggle openings</button>
				</p>

		</div>

	`;

	return htm;

};


////////// Events

POP.onClickZoomAll = function() {

	GBX.surfaceGroup.children.forEach( child => child.visible = true );

	THRU.zoomObjectBoundingSphere( GBX.boundingBox );

	const time = performance.now();

	const campusXml = POP.parser.parseFromString( GBX.text, "application/xml").documentElement;
	POP.campusXml = campusXml;
	//console.log( 'campusXml', campusXml.attributes );

	const buildingXml = campusXml.getElementsByTagName( 'Building' )[ 0 ];

	divPopUpData.innerHTML=
	`
		<b>Campus Attributes</b>
		<div>${ POP.getAttributesHtml( campusXml ) }</div>
		<br>
		<b>Building Attributes</b>
		<div>${ POP.getAttributesHtml( buildingXml ) }</div>

	`;

	//console.log( '', performance.now() - time );
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

	//console.log( 'event', event );

	event.clientX = event.touches[0].clientX;
	event.clientY = event.touches[0].clientY;

	POP.onDocumentMouseDown( event );

};



POP.onDocumentMouseDown = function( event ) {
	//console.log( 'event', event.button );

	if ( event.button !== 0 ) { return ; }

	event.preventDefault();

	/*
	POP.mouse.x = ( event.clientX / size.width ) * 2 - 1;
	POP.mouse.y = - ( event.clientY / size.height ) * 2 + 1;
	*/

	const x = event.offsetX == undefined ? event.layerX : event.offsetX;
	const y = event.offsetY == undefined ? event.layerY : event.offsetY;
	//console.log( 'x', x );

	const size = THR.renderer.getSize( new THREE.Vector2() );

	POP.mouse.x = ( x / size.width ) * 2 - 1;
	POP.mouse.y = - ( y / size.height ) * 2 + 1;

	POP.raycaster.setFromCamera( POP.mouse, THR.camera );

	POP.intersects = POP.raycaster.intersectObjects( GBX.surfaceGroup.children );
	//console.log( 'POP.intersects', POP.intersects );

	if ( POP.intersects.length > 0 ) {

		POP.intersected = POP.intersects[ 0 ].object;

		POP.getIntersectedVertexBufferGeometry( POP.intersects[ 0 ].point );

		divPopUpData.innerHTML = POP.getIntersectedDataHtml();

	} else {

		POP.intersected = null;

		divPopUpData.innerHTML = '';

		THR.scene.remove( POP.line, POP.particle );

	}

};



POP.getIntersectedVertexBufferGeometry = function( point ) {
	//console.log( 'point', point );

	THR.scene.remove( POP.particle );

	const distance = THR.camera.position.distanceTo( THR.controls.target );

	POP.particle.scale.x = POP.particle.scale.y = 0.01 * distance;
	POP.particle.position.copy( point );

	THR.scene.add( POP.particle );

};



POP.getIntersectedDataHtml = function() {
	console.log( 'POP.intersected', POP.intersected );

	const index = POP.intersected.userData.index;

	const surfaceIndexed = GBX.surfacesIndexed[ index ];

	const surfaceText = surfaceIndexed.slice( surfaceIndexed.indexOf( '"<' ) + 1 );

	const surfaceXml = POP.parser.parseFromString( surfaceText, "application/xml").documentElement;
	POP.surfaceXml = surfaceXml;
	//console.log( 'surfaceXml', surfaceXml.attributes );

	POP.drawBorder( surfaceXml );

	const htmAttributes = POP.getSurfaceAttributes( surfaceXml );

	POP.surfaceId = surfaceXml.attributes.id.value;

	POP.surfaceType = surfaceXml.attributes.surfaceType ? surfaceXml.attributes.surfaceType.value : '';

	const adjSpaceButtons = POP.getAdjSpaceButtons();

	const storeyButton = POP.storeyId ? `<button id=POPbutStoreyVisible onclick=POPelementAttributes.innerHTML=POP.toggleStoreyVisible(this,"${ POP.storeyId }"); title="id: ${ POP.storeyId }" >storey: ${ POP.storeyName}</button>` : `<div id=POPbutStoreyVisible ></div>`;

	const zoneButton = POP.zoneId ? `<button id=POPbutZoneVisible onclick=POPelementAttributes.innerHTML=POP.getToggleZoneVisible(this,"${ POP.zoneId }"); title="id: ${ POP.zoneId }" >zone: ${ POP.zoneName }</button> &nbsp;` : `<span id=POPbutZoneVisible >None</span>`;

	const htm =
	`
		<p><b>Visibility</b> - show/hide elements</p>

		<div id=POPdivShowHide >

			<p>
				<button id=POPbutSurfaceFocus onclick=POP.toggleSurfaceFocus(this);
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

		</div>

		<div id=POPelementAttributes >
			${ htmAttributes }
		</div>
		<hr>

	`;
	// to do <button onclick=POP.toggleVertexPlacards(); title="Display vertex numbers" > # </button>

	return htm;

};



POP.drawBorder = function( surfaceXml ) {

	THR.scene.remove( POP.line );

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

	POP.line = new THREE.LineLoop( geometry, material );

	THR.scene.add( POP.line );

};



POP.getAdjSpaceButtons = function() {

	let htm;

	if ( POP.adjacentSpaceId.length === 0 ) {

		htm = "";

	} else if ( POP.adjacentSpaceId.length === 1 ) {

		const spaceId = POP.adjacentSpaceId[ 0 ];


		//console.log( 'space', space );

		htm =
		`
			<button id=POPbutAdjacentSpace1 onclick=POP.toggleSpaceVisible(this,"${ spaceId }","");
				title="id: ${ spaceId }" >space: ${ POP.spaceNames[ 0 ] }</button>
			</div><div id=POPbutAdjacentSpace2 ></div>
		`;


	} else if ( POP.adjacentSpaceId.length === 2 ) {

		const spaceId1 = POP.adjacentSpaceId[ 0 ];
		const spaceId2 = POP.adjacentSpaceId[ 1 ];

		htm =
		`
			<button id=POPbutAdjacentSpace1 onclick=POP.toggleSpaceVisible(this,"${ spaceId1 }","");
				title="id: ${ spaceId1 }" >space: ${ POP.spaceNames[ 0 ] }</button>

			<button id=POPbutAdjacentSpace2 onclick=POP.toggleSpaceVisible(this,"${ spaceId2 }","");
				title="id: ${ spaceId2 }" >space: ${ POP.spaceNames[ 1 ] }</button>
		`;
	}

	return htm;

};



//////////

POP.getAttributesHtml = function( obj ) {
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
			const campusXml = POP.parser.parseFromString( GBX.text, "application/xml").documentElement;
			//POP.campusXml = campusXml;
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



POP.getSurfaceAttributes = function( surfaceXml ) {
	//console.log( 'surfaceXml', surfaceXml );
	//s = surfaceXml;

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



POP.getAttributesAdjacentSpace = function( surfaceXml ){

	const adjacentSpaceId = surfaceXml.getElementsByTagName( "AdjacentSpaceId" );
	//console.log( 'adjacentSpaceId', adjacentSpaceId );
	//a = adjacentSpaceId

	let htm;

	if ( adjacentSpaceId.length === 0 ) {

		POP.adjacentSpaceId = [];
		POP.storey = '';

		htm = 'No adjacent space';

	} else if ( adjacentSpaceId.length === 2 ) {

		//console.log( 'obj.AdjacentSpaceId', obj.AdjacentSpaceId );

		const space1 = adjacentSpaceId[ 0 ].getAttribute( "spaceIdRef" );
		const space2 = adjacentSpaceId[ 1 ].getAttribute( "spaceIdRef" );

		POP.adjacentSpaceId = [ space1, space2 ];

		spaceText1 = GBX.spaces.find( space => space.includes( space1 ) )
		spaceName1 = spaceText1.match( /<Name>(.*?)<\/Name>/i )[ 1 ];


		spaceText2 = GBX.spaces.find( space => space.includes( space2 ) )
		spaceName2 = spaceText2.match( /<Name>(.*?)<\/Name>/i )[ 1 ];

		POP.spaceNames = [ spaceName1, spaceName2 ];
		POP.setAttributesStoreyAndZone( space2 );

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
		POP.adjacentSpaceId = [ spaceId];

		const spaceText1 = GBX.spaces.find( space => space.includes( spaceId ) )
		const spaceName1 = spaceText1.match( /<Name>(.*?)<\/Name>/i )[ 1 ];


		POP.spaceNames = [ spaceName1 ];

		POP.setAttributesStoreyAndZone( spaceId );

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



POP.setAttributesStoreyAndZone = function( spaceId ) {

	const spaceText = GBX.spaces.find( item => item.includes( spaceId ) );
	//console.log( 'spaceText', spaceText );

	POP.storeyId = spaceText.match ( /buildingStoreyIdRef="(.*?)"/ )[ 1 ];
	//console.log( 'storeyId', POP.storeyId[ 1 ] );

	const storeyText = GBX.storeys.find( item => item.includes( POP.storeyId ) );
	//console.log( 'storeyText', storeyText );

	const storeyName = storeyText.match ( '<Name>(.*?)</Name>' );

	POP.storeyName = storeyName ? storeyName[ 1 ] : "no storey name in file";
	//console.log( 'POP.storeyName', POP.storeyName );

	POP.zoneId = spaceText.match ( /zoneIdRef="(.*?)"/ );

	if ( POP.zoneId ) {

		POP.zoneId = POP.zoneId[ 1 ];
		//console.log( 'zoneId', POP.zoneId[ 1 ] );

		const zoneText = GBX.zones.find( item => item.includes( POP.zoneId ) );
		//console.log( 'storeyText', zoneText );

		POP.zoneName = zoneText.match ( '<Name>(.*?)</Name>' )[ 1 ];
		//console.log( 'POP.zoneName', POP.zoneName );


	} else {

		POP.zoneName = "None";

	}


};



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


//////////

POP.setOneButtonActive = function( button ) {

	const buttons = POPdivShowHide.querySelectorAll( "button" );

	Array.from( buttons ).forEach( butt => { if ( butt !== button ) ( button.classList.remove( "active" ) ); } );

	//button.classList.add( "active" );

};



POP.toggleSurfaceFocus = function( button ) {

	button.classList.toggle( "active" );

	//POP.setOneButtonActive( button );

	const focus = button.classList.contains( "active" );

	if ( focus === true ) {

		GBX.surfaceGroup.children.forEach( child => child.visible = false );

		POP.intersected.visible = true;


		const bbox = new THREE.Box3();
		const meshes = [ POP.intersected ];

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

	//const surfaceJson = POP.intersected.userData.gbjson;

	POPelementAttributes.innerHTML = POP.getSurfaceAttributes( POP.surfaceXml );

};



POP.toggleSurfaceVisible = function() {

	POP.intersected.visible = !POP.intersected.visible;

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

	const visible1 = POPbutAdjacentSpace1.classList.contains( "active" );
	const spaceId1 = POPbutAdjacentSpace1.innerHTML.slice( 7 );

	const visible2 = POPbutAdjacentSpace2.classList.contains( "active" );
	const spaceId2 = POPbutAdjacentSpace2.innerHTML.slice( 7 );
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



POP.toggleStoreyVisible = function( button, storeyId ) {

	button.classList.toggle( "active" );

	const focus = button.classList.contains( "active" );

	const children =  GBX.surfaceGroup.children;

	if ( focus === true ) {

		children.forEach( element => element.visible = false );

		const spaces = GBX.spaces;

		//const spaceIdRef = POP.adjacentSpaceId.length === 1 ? POP.adjacentSpaceId[ 0 ] : POP.adjacentSpaceId[ 1 ];

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

	const storeyXml = POP.parser.parseFromString( storeyTxt, "application/xml").documentElement;
	//console.log( 'spaceXml ', spaceXml );

	const htmStorey = POP.getAttributesHtml( storeyXml );

	const htm =
	`
		<b>Selected Storey Attributes</b>
		${ htmStorey }
	`;

	return htm;

};



POP.getToggleZoneVisible = function ( button, zoneIdRef ) {

	button.classList.toggle( "active" );

	const focus = button.classList.contains( "active" );
	const children = GBX.surfaceGroup.children;

	if ( focus === true ) {

		children.forEach( element => element.visible = false );

		const spaces = GBX.spaces;

		//const spaceIdRef = POP.adjacentSpaceId.length === 1 ? POP.adjacentSpaceId[ 0 ] : POP.adjacentSpaceId[ 1 ];

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

	const zoneXml = POP.parser.parseFromString( zoneTxt, "application/xml").documentElement;
	//console.log( 'spaceXml ', spaceXml );

	const htmZone = POP.getAttributesHtml( zoneXml );

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

POP.setSurfaceZoom = function() {

	const surfaceMesh = POP.intersected;

	POP.setCameraControls( [ surfaceMesh ] );

};
