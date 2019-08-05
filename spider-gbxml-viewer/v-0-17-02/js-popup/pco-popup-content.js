/* global THREE, THR, GBX, GBXU, GSA, THRU, POP, POPF, divDragMoveFooter,PINbutAdjacentSpace1, PINbutAdjacentSpace2,  navDragMove, divDragMoveContent, main, */
// jshint esversion:
// jshint loopfunc: true


const PCO = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-24",
		description: "TooToo Menu (PIN) generates standard HTML popup menu code and content and code that works on computers, tablets and phones",
		helpFile: "js-popup/pop-popup.md",
		version: "0.17.01-0pco",
	}

};


PCO.getContents = function( surfaceXml ) {

	PCO.surfaceId = surfaceXml.attributes.id.value;

	const htmAttributes = GSA.getSurfaceAttributes( surfaceXml, PCO.surfaceId, PIN.intersected.userData.index );
	//console.log( 'htmAttributes', htmAttributes );

	PCO.surfaceType = surfaceXml.attributes.surfaceType ? surfaceXml.attributes.surfaceType.value : '';

	const meshData = PIN.intersected.userData;

	const adjSpaceButtons = PCO.getAdjSpaceButtons( meshData.spaceIds );

	const storeyButton = meshData.storeyId ? `<button id=PCObutStoreyVisible onclick=PCOelementAttributes.innerHTML=PCO.toggleStoreyVisible(this,"${ meshData.storeyId }"); title="id: ${ meshData.storeyId }" >storey: ${ GSA.storeyName }</button>` : `<div id=PCObutStoreyVisible ></div>`;

	const zoneButton = meshData.zoneId ? `<button id=PCObutZoneVisible onclick=PCOelementAttributes.innerHTML=PCO.getToggleZoneVisible(this,"${ meshData.zoneId }"); title="id: ${ meshData.zoneId }" >zone: ${ GSA.zoneName }</button> &nbsp;` : `<span id=PCObutZoneVisible >None</span>`;

	const htm =
	`
		<p><b>Visibility</b> - show/hide elements</p>

		<div id=PCOdivShowHide >

			<p>
				<button id=PCObutSurfaceFocus onclick=PCO.toggleSurfaceFocus(this);
					title="${ meshData.surfaceType }" > surface: ${ meshData.surfaceId } </button>
				<button id=PCObutSurfaceVisible onclick=PCO.toggleSurfaceVisible();
					title="Show or hide selected surface" > &#x1f441; </button>
				<button onclick=PCO.setSurfaceZoom(); title="Zoom into selected surface" > ⌕ </button>

				<button onclick=PCO.toggleSurfaceNeighbors(); title="Show surfaces with vertexes shared with this surface" > # </button>
				<button onclick=PCO.toggleVertexPlacards(); title="Display vertex numbers" > * </button>
			</p>

			<p>
				${ adjSpaceButtons }
			</p>

			<p>
				${ storeyButton } ${ zoneButton }

				<button onclick=PCO.setAllVisibleZoom(); title="Zoom whatever is visible" >⌕</button>
			</p>

		</div>

		<div id=PCOelementAttributes >
			${ htmAttributes }
		</div>

	`;

	return htm;

};




PCO.getAdjSpaceButtons = function( spaceIds ) {

	let htm;

	// or turn into a for loop

	if ( spaceIds.length === 0 ) {

		htm = "<div id=PCObutAdjacentSpace1 ></div><div id=PCObutAdjacentSpace2 ></div>";

	} else if ( spaceIds.length === 1 ) {

		const spaceId = spaceIds[ 0 ];
		//console.log( 'spaceId', spaceId );

		htm =
		`
			<button id=PCObutAdjacentSpace1 onclick=PCO.toggleSpaceVisible(this,"${ spaceId }","");
				value="${ spaceId }" title="id: ${ spaceId }" >space: ${ GSA.spaceNames[ 0 ] }</button>
			</div><div id=PCObutAdjacentSpace2 ></div>
		`;


	} else if ( spaceIds.length === 2 ) {

		const spaceId1 = spaceIds[ 0 ];
		const spaceId2 = spaceIds[ 1 ];

		htm =
		`
			<button id=PCObutAdjacentSpace1 onclick=PCO.toggleSpaceVisible(this,"${ spaceId1 }","");
			value="${ spaceId1 }" title="id: ${ spaceId1 }" >space: ${ GSA.spaceNames[ 0 ] }</button>

			<button id=PCObutAdjacentSpace2 onclick=PCO.toggleSpaceVisible(this,"${ spaceId2 }","");
			value="${ spaceId2 }" title="id: ${ spaceId2 }" >space: ${ GSA.spaceNames[ 1 ] }</button>
		`;
	}

	return htm;

};



PCO.toggleSurfaceFocus = function( button ) {

	button.classList.toggle( "active" );

	//PCO.setOneButtonActive( button );
	PCObutAdjacentSpace1.classList.remove( "active" );
	PCObutAdjacentSpace2.classList.remove( "active" );
	PCObutStoreyVisible.classList.remove( "active" );
	PCObutZoneVisible.classList.remove( "active" );

	const focus = button.classList.contains( "active" );

	if ( focus === true ) {

		GBX.meshGroup.children.forEach( child => {

			child.visible = false;
			//child.material.opacity = 0.3;

		} );

		PIN.intersected.visible = true;
		PIN.intersected.material.opacity = 1;

/* 		const bbox = new THREE.Box3();
		const meshes = [ PCO.intersected ];

		meshes.forEach( mesh => bbox.expandByObject ( mesh ) );

		const sphere = bbox.getBoundingSphere( new THREE.Sphere() );
		const center = sphere.center;
		//const radius = sphere.radius;
		const radius = THRU.radius;
		const vector = THR.camera.position.clone().sub( THR.controls.target );

		THR.controls.target.copy( center );
		THR.camera.position.copy( center.clone().add( vector ) );
*/

	} else {

		GBX.meshGroup.children.forEach( child => child.visible = true );

	}
	//const surfaceJson = PCO.intersected.userData.gbjson;

	PCOelementAttributes.innerHTML = GSA.getSurfaceAttributes( PIN.surfaceXml, PCO.surfaceId, PIN.intersected.userData.index );

};



PCO.toggleSurfaceVisible = function() {

	PIN.intersected.visible = !PIN.intersected.visible;

};



PCO.setSurfaceZoom = function() {

	const surfaceMesh = PIN.intersected;

	const bbox = new THREE.Box3();
	const meshes = [ PIN.intersected ];

	meshes.forEach( mesh => bbox.expandByObject ( mesh ) );

	const sphere = bbox.getBoundingSphere( new THREE.Sphere() );
	const center = sphere.center;
	//const radius = sphere.radius;
	//const radius = THRU.radius;
	const vector = THR.camera.position.clone().sub( THR.controls.target );

	THR.controls.target.copy( center );
	THR.camera.position.copy( center.clone().add( vector ) );

	PCO.setCameraControls( [ surfaceMesh ] );

};



PCO.setCameraControls = function( meshes ) {

	const bbox = new THREE.Box3();
	meshes.forEach( mesh => bbox.expandByObject ( mesh ) );

	const sphere = bbox.getBoundingSphere( new THREE.Sphere() );
	const center = sphere.center;
	const radius = sphere.radius;
	//console.log( 'center * radius', center, radius );

	THR.controls.target.copy( center );
	THR.camera.position.copy( center.clone().add( new THREE.Vector3( 1.5 * radius, - 1.5 * radius, 1.5 * radius ) ) );

};



PCO.toggleSurfaceNeighbors = function() {

	const surfaceText  = GBX.surfaces[ PIN.intersected.userData.index ];
	//console.log( 'surfaceText', surfaceText );

	const planarGeometry = surfaceText.match( /<PlanarGeometry(.*?)<\/PlanarGeometry>/gi )[ 0 ];
	//console.log( 'planarGeometry', planarGeometry );

	const cartesianPoints = planarGeometry.match( /<CartesianPoint(.*?)<\/CartesianPoint>/gi );
	//console.log( 'cartesianPoints', cartesianPoints );

	const surfaces = [];
	GBX.surfaces.forEach( ( surface, index ) => {

		const points = cartesianPoints.filter( point => surface.includes( point ) );

		if ( points.length > 0 ) { surfaces.push( surface ); }

	} );

	//console.log( '', surfaces );

	GBXU.sendSurfacesToThreeJs( surfaces );

};



PCO.toggleVertexPlacards = function() {

	const vertices = PIN.line.geometry.vertices;
	//console.log( 'vertices', vertices );

	const distance = THR.camera.position.distanceTo( THR.controls.target );
	const scale = 0.01;
	const placards = vertices.map( ( vertex, index ) =>
		THRU.drawPlacard( '#' + ( 1 + index ), 0.0003 * distance, 0x00ff00, vertex.x + scale * distance, vertex.y + scale * distance, vertex.z + scale * distance )
	);
	//console.log( '', placards );

	PIN.line.add( ...placards );

};



PCO.toggleSpaceVisible = function( button, spaceId ) {

	button.classList.toggle( "active" );

	PCObutSurfaceFocus.classList.remove( "active" );
	PCObutStoreyVisible.classList.remove( "active" );
	PCObutZoneVisible.classList.remove( "active" );

	const visible1 = PCObutAdjacentSpace1.classList.contains( "active" );
	const spaceId1 = PCObutAdjacentSpace1.value;

	const visible2 = PCObutAdjacentSpace2.classList.contains( "active" );
	const spaceId2 = PCObutAdjacentSpace2.value;


	const children =  GBX.meshGroup.children;

	if ( visible1 === false && visible2 === false ) {

		children.forEach( child => child.visible = false );

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

		console.log( 'adj space vis', spaceId1, visible1, spaceId2, visible2 );
		GBX.surfaces.forEach( ( surface, index ) => {
			//console.log( 'index', index );

			if ( surface.includes( spaceId1 ) || surface.includes( spaceId2 ) ) {
				children[ index ].visible = true;

			}
		} );

	}

	PIN.intersected.visible = true;

	const htm = PCO.getSpaceAttributes( spaceId );

	PCOelementAttributes.innerHTML = htm;

};



PCO.getSpaceAttributes = function( spaceId ) {

	const spaceTxt = GBX.spaces.find( item => item.includes( ` id="${ spaceId }"` ) );

	const spaceXml = PIN.parser.parseFromString( spaceTxt, "application/xml").documentElement;
	//console.log( 'spaceXml ', spaceXml );

	const htmSpace = GSA.getAttributesHtml( spaceXml );

	const htm =
	`
		<b>${ spaceId } Space Attributes</b>

		<p>${ htmSpace }</p>

		<details>

			<summary>gbXML data</summary>

			<textarea style=height:10rem;width:100%; >${ spaceTxt }</textarea>

		</details>
		`;

	return htm;

};




PCO.toggleStoreyVisible = function( button, storeyId ) {

	button.classList.toggle( "active" );

	PCObutSurfaceFocus.classList.remove( "active" );
	PCObutAdjacentSpace1.classList.remove( "active" );
	PCObutAdjacentSpace2.classList.remove( "active" );
	PCObutZoneVisible.classList.remove( "active" );

	const focus = button.classList.contains( "active" );

	GBX.meshGroup.children.forEach( element => element.visible = false );

	//const surfaces = ( POPF.surfacesFilteredByType && POPF.surfacesFilteredByType.length ) ? POPF.surfacesFilteredByType : GBX.surfaces;

	surfaces = GBX.surfaces;

	if ( focus === true ) {

		const spaces = GBX.spaces;

		surfaces.forEach( ( surface, index ) => {

			const adjacentSpaceIds = surface.match( /spaceIdRef="(.*?)"/gi );

			if ( adjacentSpaceIds && adjacentSpaceIds.length ) {

				//const id = surface.match( / id="(.*?)"/i )[ 1 ];

				let spaceIdRef = adjacentSpaceIds.pop().slice( 12, -1 );

				spaces.forEach( space => {

					const spaceId = space.match( / id="(.*?)"/i )[ 1 ];
					const spaceBuildingStoreyIdRef = space.match( / buildingStoreyIdRef="(.*?)"/i )[ 1 ];

					const mesh = GBX.meshGroup.children[ index ];
					mesh.visible = spaceId === spaceIdRef && spaceBuildingStoreyIdRef === storeyId ? true : mesh.visible;

				} );

			}

		} );


	}

	PIN.intersected.visible = true;

	const htm = PCO.getStoreyAttributes( storeyId );

	return htm;

};



PCO.getStoreyAttributes = function ( storeyId ) {

	const storeyTxt = GBX.storeys.find( item => item.includes( ` id="${ storeyId }"` ) );

	const storeyXml = PIN.parser.parseFromString( storeyTxt, "application/xml").documentElement;
	//console.log( 'spaceXml ', spaceXml );

	const htmStorey = GSA.getAttributesHtml( storeyXml );

	const htm =
	`
		<b>${ storeyId } Storey Attributes</b>

		<p>${ htmStorey }</p>

		<details>

			<summary>gbXML data</summary>

			<textarea style=height:10rem;width:100%; >${ storeyTxt }</textarea>

		</details>
		`;

	return htm;

};




PCO.getToggleZoneVisible = function ( button, zoneIdRef ) {

	button.classList.toggle( "active" );

	PCObutSurfaceFocus.classList.remove( "active" );
	PCObutAdjacentSpace1.classList.remove( "active" );
	PCObutAdjacentSpace2.classList.remove( "active" );
	PCObutStoreyVisible.classList.remove( "active" );

	const focus = button.classList.contains( "active" );
	const children = GBX.meshGroup.children;

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

		children.forEach( child => child.visible = false );

	}

	PIN.intersected.visible = true;

	const htm = PCO.getZoneAttributes( zoneIdRef );

	return htm;

};



PCO.getZoneAttributes = function( zoneIdRef ) {

	const zoneTxt = GBX.zones.find( item => item.includes( ` id="${ zoneIdRef }"` ) );

	const zoneXml = PIN.parser.parseFromString( zoneTxt, "application/xml").documentElement;
	//console.log( 'spaceXml ', spaceXml );

	const htmZone = GSA.getAttributesHtml( zoneXml );

	const htm =
	`
		<b>${ zoneIdRef } Attributes</b>

		<p>${ htmZone }</p>

		<details>

			<summary>gbXML data</summary>

			<textarea style=height:10rem;width:100%; >${ zoneTxt }</textarea>

		</details>
	`;

	return htm;

};



PCO.setAllVisibleZoom = function() {

	const meshes = GBX.meshGroup.children.filter( mesh => mesh.visible === true );
	//console.log( 'meshes', meshes );

	PCO.setCameraControls( meshes );

};