/* global THREE, THR, THRU, GBX, divPopUpData */
// jshint esversion: 6

// Copyright 2018 Ladybug Tools authors. MIT License

const POP = {};




POP.getPopUpHtml = function() {

	POP.mouse = new THREE.Vector2();
	POP.raycaster = new THREE.Raycaster();
	//POP.objects = GBX.surfaceMeshes.children;
	POP.intersected = undefined;
	POP.divTarget = divPopUpData;

	POP.particleMaterial = new THREE.SpriteMaterial( { color: 0xff0000 } );
	POP.particle = new THREE.Sprite( POP.particleMaterial );
	POP.line = undefined;

	THR.renderer.domElement.addEventListener( 'mousedown', POP.onDocumentMouseDown, false );
	THR.renderer.domElement.addEventListener( 'touchstart', POP.onDocumentTouchStart, false ); // for mobile

	const htm =
	`
		<div id = "divPopUpLog"  ></div>

		<div>

			<p>
			click on the model amd surface attributes appear here
			</p>

			<p>Axes Red/Green/Blue = X/Y/Z directions</p>

			<p>Spacebar: click to stop spinning</p>

			<p>Use one|two|three fingers to rotate|zoom|pan display in 3D. Or left|scroll|right with your pointing device</p>

			<p>Press Control-Shift-J|Command-Option-J to see if the JavaScript console reports any errors</p>

			<p style=text-align:right; > <a href="https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/cookbook/spider-gbxml-viewer-pop-up" >SGV Pop-Up R7.1</a></p>


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

		POP.divTarget.style.display = '';

		POP.getIntersectedVertexBufferGeometry( POP.intersected, intersects );

		POP.divTarget.innerHTML = POP.getIntersectedDataHtml( POP.intersected, intersects );

	} else {

		POP.intersected = null;

		POP.divTarget.style.display = 'none';

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

	const surfaceJson = POP.intersected.userData.gbjson;

	const adjSpaces = surfaceJson.AdjacentSpaceId; // [ '' ];
	//console.log( 'adjSpaces', adjSpaces );

	let adjSpaceButtons, space, storeyButton, zoneButton;

	if ( adjSpaces ) {

		if ( Array.isArray( adjSpaces ) ) {

			adjSpaceButtons =
			`
			<button onclick=POP.toggleSpaceVisible(this,"${ adjSpaces[ 0 ].spaceIdRef }"); >space1 ${ adjSpaces[ 0 ].spaceIdRef }</button>
			<button onclick=POP.toggleSpaceVisible(this,"${ adjSpaces[ 1 ].spaceIdRef }"); >space2 ${ adjSpaces[ 1 ].spaceIdRef }</button>
			`;

			space = GBX.gbjson.Campus.Building.Space.find( item => item.id === adjSpaces[ 0 ].spaceIdRef );

		} else {

			adjSpaceButtons = `<button onclick=POP.toggleSpaceVisible(this,"${ adjSpaces.spaceIdRef }"); >space ${ adjSpaces.spaceIdRef } </button>`;
			space = GBX.gbjson.Campus.Building.Space.find( item => item.id === adjSpaces.spaceIdRef );
		}

		storeyButton = `<button onclick=POP.toggleStoreyVisible(this,"${ space.buildingStoreyIdRef }"); >storey ${ space.buildingStoreyIdRef } </button>`;
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
			<button onclick=POP.toggleVisible(); >${ surfaceJson.id }</button>
			${ adjSpaceButtons }
		</p>
			${ storeyButton }
			${ zoneButton }
		</p>
	`;

	let attributes ='';
	let elements = '';

	const keys = Object.keys( surfaceJson ).sort();
	//console.log( 'keys', keys );

	for ( let key of keys ) {
		//console.log( 'key', key );

		if ( surfaceJson[ key ] !== null ) {

			if ( typeof( surfaceJson[ key ] ) === 'object' ) {

				//console.log( '', key);
				const obj = surfaceJson[ key ];

				elements +=
				`<div>
					<span class=attributeTitle >${key}:</span>
				</div>`;

				for ( let prop in obj ) {



					if ( prop === 'PolyLoop') {

						points = GBX.getVertices( obj[ prop ] );

						let txt = '', count = 1;

						for ( point of points ) {

							txt += `${ count++ }. x:${ point.x } y:${ point.y } z:${ point.z }<br>`;
						}
						//console.log( 'points', JSON.stringify( points ) );

						elements +=
						`<div>
							<span class=attributeTitle >${prop}:</span><br>
							<span class=attributeValue >${ txt }</span>

						</div>`;

					} else {

						elements +=
						`<div>
							<span class=attributeTitle >${prop}:</span>
							<span class=attributeValue >${ obj[ prop ] }</span>

						</div>`;

					}

				}

				elements += '<br>';

			} else {

				attributes +=
				`<div>
					<span class=attributeTitle >${key}:</span>
					<span class=attributeValue >${surfaceJson[ key ]}</span>
				</div>`;

			}

		}

	}


	const htm =
	`
		<div>${ navigating }</div>
		<b>Identifying according to <a href="http://gbxml.org/schema_doc/6.01/GreenBuildingXML_Ver6.01.html" target="_blank">gbXML Schema</a></b>
		${ attributes }
		<p>${ elements }</p>
	`;

	return htm;

};


POP.toggleVisible = function( id ) {

	POP.intersected.visible = !POP.intersected.visible;

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

