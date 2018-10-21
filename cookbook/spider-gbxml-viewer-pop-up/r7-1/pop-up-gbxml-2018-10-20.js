/* global THREE, THR, THRU, GBX, divPopUpData */
// jshint esversion: 6

// Copyright 2018 Ladybug Tools authors. MIT License

const POP = {};



POP.getPopUpHtml = function() {

	POP.mouse = new THREE.Vector2();
	POP.raycaster = new THREE.Raycaster();
	//POP.objects = GBX.surfaceMeshes.children;
	POP.intersected = undefined;
	//POP.divPopupData = divPopUp;

	POP.particleMaterial = new THREE.SpriteMaterial( { color: 0xff0000 } );
	POP.particle = new THREE.Sprite( POP.particleMaterial );
	POP.line = undefined;

	THR.renderer.domElement.addEventListener( 'mousedown', POP.onDocumentMouseDown, false );
	THR.renderer.domElement.addEventListener( 'touchstart', POP.onDocumentTouchStart, false ); // for mobile

	const htm =
	`
		<div id = "divPopUpLog"  ></div>

		<div id = "divPopupData" >

			<p>
			click on the model amd surface attributes appear here
			</p>

			<p>Axes Red/Green/Blue = X/Y/Z directions</p>

			<p>Spacebar: click to stop spinning</p>

			<p>Use one|two|three fingers to rotate|zoom|pan display in 3D. Or left|scroll|right with your pointing device</p>

			<p>Press Control-Shift-J|Command-Option-J to see if the JavaScript console reports any errors</p>

		</div>

		<div>
			<p style=text-align:right; > <a href="https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/cookbook/spider-gbxml-viewer-pop-up" >SGV Pop-Up R7.3</a></p>
		</div>

	`;

	return htm;

};



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

	const intersects = POP.raycaster.intersectObjects( GBX.surfaceMeshes.children );
	//console.log( 'intersects', intersects );

	if ( intersects.length > 0 ) {

		POP.intersected = intersects[ 0 ].object;

		POP.faceIndex = intersects[ 0 ].faceIndex;
		//intersected.material.color.setHex( Math.random() * 0xffffff );

		divPopupData.style.display = '';

		POP.getIntersectedVertexBufferGeometry( POP.intersected, intersects );

		divPopupData.innerHTML = POP.getIntersectedDataHtml( POP.intersected, intersects );

	} else {

		POP.intersected = null;

		divPopupData.style.display = 'none';

		THR.scene.remove( POP.line, POP.particle );

		document.body.style.cursor = 'auto';

	}

};



POP.getIntersectedVertexBufferGeometry = function( intersected, intersects ) {
	//console.log( '', intersected );

	THR.scene.remove( POP.line, POP.particle );

	const vertices = intersected.userData.gbjson.PlanarGeometry.PolyLoop.CartesianPoint
		.map( point => new THREE.Vector3().fromArray( point.Coordinate  ) );
	//console.log( 'vertices', vertices );

	const geometry = new THREE.Geometry().setFromPoints( vertices )
	//console.log( 'geometry', geometry );

	const material = new THREE.LineBasicMaterial( { color: 0xff00ff, linewidth: 2, transparent: true } );


	POP.line = new THREE.LineLoop( geometry, material );
	THR.scene.add( POP.line );

	POP.particle.scale.x = POP.particle.scale.y = 0.03 * THRU.radius;
	POP.particle.position.copy( intersects[ 0 ].point );

	THR.scene.add( POP.line, POP.particle );

};



POP.getIntersectedDataHtml = function( intersected, intersects ) {
	//console.log( 'intersected', intersected );

	surfaceJson = POP.intersected.userData.gbjson;

	const adjSpaces = surfaceJson.AdjacentSpaceId; // [ '' ];
	//console.log( 'adjSpaces', adjSpaces );

	//let adjSpaceButtons, space, storeyButton, zoneButton;

	if ( adjSpaces ) {

		if ( Array.isArray( adjSpaces ) ) {

			space0 = GBX.gbjson.Campus.Building.Space.find( item => item.id === adjSpaces[ 0 ].spaceIdRef );
			space1 = GBX.gbjson.Campus.Building.Space.find( item => item.id === adjSpaces[ 1 ].spaceIdRef );
			adjSpaceButtons =
			`
			<button onclick=POP.toggleSpaceVisible(this,"${ adjSpaces[ 0 ].spaceIdRef }"); >space1 ${ space0.Name }</button>
			<button onclick=POP.toggleSpaceVisible(this,"${ adjSpaces[ 1 ].spaceIdRef }"); >space2 ${ space1.Name }</button>
			`;


		} else {

			space1 = GBX.gbjson.Campus.Building.Space.find( item => item.id === adjSpaces.spaceIdRef );
			adjSpaceButtons = `<button onclick=POP.toggleSpaceVisible(this,"${ adjSpaces.spaceIdRef }"); >space1: ${ space1.Name } </button>`;

		}

		storey = GBX.gbjson.Campus.Building.BuildingStorey.find( item => item.id === space1.buildingStoreyIdRef );
		storeyButton = ` <button onclick=POP.toggleStoreyVisible(this,"${ space1.buildingStoreyIdRef }"); >storey: ${ storey.Name } </button>`;
		zoneButton = '';

	} else {

		adjSpaceButtons = '';
		storeyButton = '';
		zoneButton = '';

	}


	const navigating =
	`
		<p>
			<i>Navigating and identifying are two different things.
			As we design, let us try to keep these actions separate.</i>
		</p>

		<p><b>Navigating</b></p>

		<p>
			<button onclick=POP.toggleSurfaceVisible(); >surface: ${ surfaceJson.id }</button>
			${ adjSpaceButtons }
		</p>
		<p>
			${ storeyButton }
			${ zoneButton }
		</p>
	`;


	htmSurface = POP.getAttributes( surfaceJson );
	htmAdjacentSpace = POP.getAdjacentSpace( surfaceJson );
	htmPlanarGeometry = POP.getPolyLoop( surfaceJson.PlanarGeometry.PolyLoop );
	htmRectangularGeometry = POP.getAttributes( surfaceJson.RectangularGeometry );

	htmAttributes = POP.getSurfaceAttributes( surfaceJson );

	const htm =
	`
		<p>
			<div>${ navigating }</div>
			<b>Identifying according to <a href="http://gbxml.org/schema_doc/6.01/GreenBuildingXML_Ver6.01.html" target="_blank">gbXML Schema</a></b>
		</p>

		<div id=elementAttributes >
			${ htmAttributes }
		</div>

	`;

	return htm;

};



POP.getSurfaceAttributes = function( surfaceJson ) {

	htmSurface = POP.getAttributes( surfaceJson );
	htmAdjacentSpace = POP.getAdjacentSpace( surfaceJson );
	htmPlanarGeometry = POP.getPolyLoop( surfaceJson.PlanarGeometry.PolyLoop );
	htmRectangularGeometry = POP.getAttributes( surfaceJson.RectangularGeometry );

	htm =
		`<p>
			<div><b>Surface Attributes</b></div>
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

}



POP.getAdjacentSpace = function( obj ){

	//console.log( 'AdjacentSpaceId', obj.AdjacentSpaceId );

	let htm;

	if ( obj.AdjacentSpaceId === undefined ) {

		htm = 'None';

	} else if ( Array.isArray( obj.AdjacentSpaceId ) ) {

		htm = 'arr'

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



POP.getAttributes = function( obj ) {

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
					<span class=attributeTitle >CartesianPoint:<span>
					<span class=attributeTitle >x:</span><span class=attributeValue >${ point[ 0 ] }</span>
					<span class=attributeTitle >y:</span><span class=attributeValue >${ point[ 1 ] }</span>
					<span class=attributeTitle >z:</span><span class=attributeValue >${ point[ 2 ] }</span><br>
				`;

			}

		} else {

			htm +=
			`
				<div>
					<span class=attributeTitle >${key}:</span>
					<span class=attributeValue >${ obj[ key ] }</span>
				</div>
			`;

		}

	}

	return htm;

};



POP.getPolyLoop = function( polyloop ) {

	const points = polyloop.CartesianPoint.map( CartesianPoint => new THREE.Vector3().fromArray( CartesianPoint.Coordinate ) );

	let htm = '', count = 1;

	for ( point of points ) {

		htm +=
		`
			${ count++ }.
			<span class=attributeTitle >x:</span><span class=attributeValue >${ point.x }</span>
			<span class=attributeTitle >y:</span><span class=attributeValue >${ point.y }</span>
			<span class=attributeTitle >z:</span><span class=attributeValue >${ point.z }</span><br>
		`;

	}
	//console.log( 'points', JSON.stringify( points ) );

	return htm;

};




POP.toggleSurfaceVisible = function( id ) {

	POP.intersected.visible = !POP.intersected.visible;

	surfaceJson = POP.intersected.userData.gbjson;
	elementAttributes.innerHTML = POP.getSurfaceAttributes( surfaceJson )

};



POP.toggleSpaceVisible = function( button, spaceId ) {

	const color = button.style.backgroundColor === '' ? 'pink' : '';
	button.style.backgroundColor = color;

	const children =  GBX.surfaceMeshes.children;

	if ( color === '' ) {

		children.forEach( child => child.visible = true );

	} else {

		children.forEach( child => child.visible = false );

		for ( let child of children ) {

			const adjacentSpaceId = child.userData.gbjson.AdjacentSpaceId;
			//console.log( 'adjacentSpaceId', adjacentSpaceId );

			if ( adjacentSpaceId && adjacentSpaceId.spaceIdRef && spaceId === adjacentSpaceId.spaceIdRef ) {

				child.visible = true;

			} else if ( Array.isArray( adjacentSpaceId ) === true ) {

				if ( spaceId === adjacentSpaceId[ 0 ].spaceIdRef || spaceId === adjacentSpaceId[ 1 ].spaceIdRef ) {

					child.visible = true;

				}

			}

		}

	}

	spaceJson = GBX.gbjson.Campus.Building.Space.find( item => item.id === spaceId );
	//console.log( 'spaceJson', spaceJson );

	htmSpace = POP.getAttributes( spaceJson );

	htm =
	`
		<b>Space Attributes</b>
		${ htmSpace }
	`

	elementAttributes.innerHTML = htm;

};



POP.toggleStoreyVisible = function( button, storeyId ) {

	const color = button.style.backgroundColor === '' ? 'pink' : '';
	button.style.backgroundColor = color;

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

	storeyJson = GBX.gbjson.Campus.Building.BuildingStorey.find( item => item.id === storeyId );
	//console.log( 'spaceJson', spaceJson );

	htmStorey = POP.getAttributes( storeyJson );

	htm =
	`
		<b>Storey Attributes</b>
		${ htmStorey }
	`

	elementAttributes.innerHTML = htm;

};



POP.setZoneVisible = function () {

	/*
	const spaces = GBX.gbjson.Campus.Building.Space;

	GBX.surfaceMeshes.children.forEach( element => element.visible = false );

	for ( let option of REPselReportResults.selectedOptions ) {

		const zoneIdRef = option.value;

		for ( let child of GBX.surfaceMeshes.children ) {

			const adjacentSpaceId = child.userData.gbjson.AdjacentSpaceId;
			//console.log( 'adjacentSpaceId', adjacentSpaceId );

			if ( !adjacentSpaceId ) { continue; }

			const spaceIdRef = Array.isArray( adjacentSpaceId ) ? adjacentSpaceId[ 1 ].spaceIdRef : adjacentSpaceId.spaceIdRef;

			spaces.forEach( element => child.visible = element.id === spaceIdRef && element.zoneIdRef === zoneIdRef ? true : child.visible );

		}

		let zone;

		if ( Array.isArray( GBX.gbjson.Zone ) ) {

			zone = GBX.gbjson.Zone.find( function( item ) { return item.id === zoneIdRef; } );

		} else {

			zone = GBX.gbjson.Zone;

		}

	}
	*/

};

