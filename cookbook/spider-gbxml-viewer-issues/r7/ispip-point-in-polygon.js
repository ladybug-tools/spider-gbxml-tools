// Copyright 2018 Ladybug Tools authors. MIT License
/* globals THREE, THR, GBX, POP, detPointInPolygon, ISPIPselPip, ISPIPdivPointInPolygonLog */
/* jshint esversion: 6 */

const ISPIP = { "release": "R7.2" };

ISPIP.getMenuPointInPolygon = function() {

	const htm =

	`<details id=detPointInPolygon ontoggle=ISPIP.getPointInPolygonCheck();  >

		<summary>Point In Polygon</summary>

		<p>
			<i>
				Check if coordinates of one surface are inside coordinates of another surface.
				ISPIP ${ ISPIP.release }.
			</i>
		</p>

		<p>
			Show/hide surfaces:<br>
			<button onclick=ISPIP.toggleSurfacesByAngles(this,["0","180"]); > horizontal </button>

			<button onclick=ISPIP.toggleSurfacesByAngles(this,"90"); > vertical </button>

			<button onclick=ISPIP.toggleSurfacesByAngles(this); > angled </button>
		</P

		<p>
			<button onclick=ISPIP.setPointInPolygonToggle(this); > Point in polygon toggle </button><br>
			Click to display surfaces found
		</p>


		<p>
			<select id=ISPIPselPip onclick=ISPIP.togglePip(); size=10 style=width:100%; ></select>
		</p>

		<p>
			yellow=polygon w/ vertex inside<br>
			magenta=polygon w/ the vertex<br>
			<button onclick=ISPIP.vertexZoom(); >⌕</button>
		</p>

		<p></p>
		<div id=ISPIPdivPointInPolygonLog ></div>

		<div id=ISPIPdivPointInPolygonLogTilts ></div>


		<details>

			<summary>ISPIP Status 2018-10-28</summary>

			<p>New WIP experiment. Looking interesting. Algorithm does a great job of finding points inside polygons.
			Now must learn to exclude points sitting exactly on or very close to the borderlines.<p>

			<p>Just a few false positives waiting to be eliminated. Fingers crossed it happens soon.</p>

		</details>

		<hr>

	</details>`;

	return htm;

};



ISPIP.getPointInPolygonCheck = function() {

	ISPIP.cleanUpScene();

	navMenu.scrollTop = detPointInPolygon.offsetTop;

	ISPIP.anglesTilt = [];
	ISPIP.anglesTiltSurfaces = [];


	GBX.gbjson.Campus.Surface.forEach( surface => {

		const tilt = surface.RectangularGeometry.Tilt;

		if ( ISPIP.anglesTilt.includes( tilt ) === false ) {

			ISPIP.anglesTilt.push( tilt );
			ISPIP.anglesTiltSurfaces.push( [ surface ] );

		} else {

			const index = ISPIP.anglesTilt.indexOf( tilt );
			ISPIP.anglesTiltSurfaces[ index ].push( surface );

		}

	} );

	ISPIPdivPointInPolygonLogTilts.innerHTML = `<p>tilt angles: ${ ISPIP.anglesTilt.map( item => Number( item ).toLocaleString() ).join( ', ' ) } </p>`;

};



ISPIP.toggleSurfacesByAngles = function( button, angles = [] ) {

	//console.log( 'anglesTilt', anglesTilt, anglesTiltSurfaces );

	ISPIP.cleanUpScene();

	angles = Array.isArray( angles ) ? angles : [ angles ];

	angles = angles.length === 0 ? ISPIP.anglesTilt.filter( angle => ["0", "90", "180"].includes( angle ) === false ) : angles;

	//console.log( 'angles', angles );

	let count = 0;

	if ( button.style.fontStyle !== 'italic' ) {

		GBX.surfaceMeshes.children.forEach( element => element.visible = false );

		for ( let angle of angles ) {

			let index = ISPIP.anglesTilt.indexOf( angle );
			let surfaceMeshes = GBX.surfaceMeshes.children.filter( element => ISPIP.anglesTiltSurfaces[ index ].find( item => item.id === element.userData.gbjson.id ) );
			surfaceMeshes.forEach( mesh => mesh.visible = true );

			count += surfaceMeshes.length;

		}

		detPointInPolygon.querySelectorAll( "button" ).forEach( button => 	button.style.cssText = "" );

		button.style.cssText = "background-color: pink; font-style: italic; font-weight: bold;";

		button.title = `surfaces count: ${ count }`;


	} else {

		GBX.surfaceMeshes.children.forEach( element => element.visible = true );

		button.style.cssText = "";

	}

};



ISPIP.setPointInPolygonToggle = function( button ) {

	ISPIP.cleanUpScene();

	const angles = ["0", "180" ];

	if ( button.style.fontStyle !== 'italic' ) {

		GBX.surfaceMeshes.children.forEach( element => element.visible = false );

		let vertices = 0;
		let insides = 0;
		let near = 0;
		ISPIP.pips = [];

		for ( let angle of angles ) {

			let index = ISPIP.anglesTilt.indexOf( angle );
			const surfaceMeshes = GBX.surfaceMeshes.children.filter( element => ISPIP.anglesTiltSurfaces[ index ].find( item => item.id === element.userData.gbjson.id ) );
			//console.log( 'surfaceMeshes', surfaceMeshes );
			surfaceMeshes.forEach( mesh => mesh.visible = true );

			const polygons = [];

			for ( let surfaceJson of ISPIP.anglesTiltSurfaces[ index ] ) {

				polygons.push( ISPIP.getVertices( surfaceJson.PlanarGeometry.PolyLoop ) );

			}

			//console.log( 'polygons ', polygons );

			for ( let polygon of polygons ) {

				for ( let polygonOther of polygons ) {

					if ( polygon === polygonOther ) { continue; }

					for ( let vertexOther of ( polygonOther ) ) {

						if ( vertexOther.z !== polygon[ 0 ].z ) { continue; }

						const inside = ISPIP.pointInPolygon( vertexOther, polygon );

						if ( inside ) {

							let onBorder = polygon.some( vertex => vertexOther.x === vertex.x && vertexOther.y === vertex.y );

							if ( onBorder === false ) {

								polygon.push( polygon[ 0 ] );

								//ISPIP.drawLine( polygon, 0x0ff00 );

								let line;
								const pointClose = polygon.slice( 0, -1 ).some( ( vertex, index ) => {

									line = new THREE.Line3( vertex, polygon[ index + 1 ] );

									point = line.closestPointToPoint( vertexOther, false, new THREE.Vector3() );
									distance = vertexOther.distanceTo( point );
									near += distance < 0.5 && distance > 0.02

									//return distance < 0.001 ? true : false ;

									return distance < 0.3 && distance > 0.02 ? true : false ;

								} );


								if ( pointClose === false ) {

									//ISPIP.drawLine( [ line.start, line.end ], 0xff00ff );


									//console.log( 'pp', pointClose );
									const sprite = ISPIP.getSprite();
									sprite.position.copy( vertexOther );

									//ISPIP.pips.push( [ polygon, polygonOther, vertexOther ] );

									//ISPIP.drawLine( polygonOther, 'magenta' );
									ISPIP.drawLine( polygon, 'yellow' );

								}


								insides ++;

							}




							//const obj = ISPIP.checkBorders( vertexOther, polygon );

							//if ( obj.same === false ) {

								//console.log( 'obj', obj );
								//console.log( 'p&v', polygon, vertexOther );

								//const sprite = ISPIP.getSprite();
								//sprite.position.copy( vertexOther );

								//ISPIP.pips.push( [ polygon, polygonOther, vertexOther, obj.closestPoint ] );

								//ISPIP.drawLine( polygonOther, 'magenta' );
								//ISPIP.drawLine( polygon, 'yellow' );


							//}

						}

						vertices ++;

					}

				}

			}

		}

		console.log( 'vertices', vertices, insides, near );

		ISPIP.setSelectPip();

		button.style.cssText = "background-color: pink; font-style: italic; font-weight: bold;";

	} else {

		GBX.surfaceMeshes.children.forEach( element => element.visible = true );

		button.style.cssText = "";

	}

};



ISPIP.getVertices = function( polyloop ) {

	const points = polyloop.CartesianPoint.map( CartesianPoint =>

		new THREE.Vector3().fromArray( CartesianPoint.Coordinate.map( txt => Number( txt ) ) )

	);

	return points;

};



ISPIP.pointInPolygon = function( pt, vs ) {

	// ray-casting algorithm based on
	// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

	let inside = false;

	for ( let i = 0, j = vs.length - 1; i < vs.length; j = i++ ) {

		const xi = vs[i].x, yi = vs[i].y;
		const xj = vs[j].x, yj = vs[j].y;

		const intersect = ( (yi > pt.y) !== (yj > pt.y) ) && ( pt.x < ( xj - xi ) * ( pt.y - yi ) / ( yj - yi ) + xi );

		if ( intersect ) inside = !inside;

	}

	return inside;

};



ISPIP.checkBorders = function( vertexOther, polygon ) {

	THR.camera.near = 0.001;
	//THR.camera.far = 10 * radius;
	THR.camera.updateProjectionMatrix();

	let closestPoint = undefined;

	let onBorder = polygon.some( vertex => vertexOther.x === vertex.x && vertexOther.y === vertex.y );

 	if ( onBorder === true ) { return { onBorder, closestPoint }; }

	for ( let i = 0; i < polygon.length - 1; i++ ) {

		const line = new THREE.Line3( polygon[ i ], polygon[ i + 1 ] );

		const point = line.closestPointToPoint( vertexOther, false, new THREE.Vector3() );
		//console.log( 'p', point,  );
		closestPoint = point;

		if ( vertexOther.distanceTo( point ) < 0.01 ) {

			//const sprite = ISPIP.getSprite();
			//sprite.position.copy( point );

			line2 = ISPIP.drawLine( [vertexOther, point ], 0x000000 );
			THR.scene.add( line2 )

			onBorder = true;


		} else {

			console.log( 'closestPoint', vertexOther.distanceTo( point ) );

			return { onBorder, closestPoint };


		}

	}

	return { same, closestPoint };

};



ISPIP.setSelectPip = function() {

	let color;
	let options = '';
	let count = 1;

	for ( let pip of ISPIP.pips ) {

		color = color === 'lightgray' ? '' : 'lightgray';
		options +=
		`
			<option style=background-color:${ color } >point in polygon ${ count++ }</option>

		`;
	}

	ISPIPselPip.innerHTML = options;

};



ISPIP.togglePip = function( select ) {

	THR.scene.remove( ISPIP.helpers );

	ISPIP.helpers = new THREE.Group();

	const index = ISPIPselPip.selectedIndex;

	console.log( '', ISPIP.pips[ index ] );

	polyVertices = ISPIP.pips[ index ][ 0 ];
	polyOtherVertices = ISPIP.pips[ index ][ 1 ];

	polyVerticesTxt = polyVertices.map( vertex =>
		`
			x:<span class=attributeValue>${ vertex.x }</span>
			y:<span class=attributeValue>${vertex.y }</span>
		`
	).join( '<br>' );

	ISPIP.drawLine( polyVertices, 'yellow' );

	ISPIP.drawLine( polyOtherVertices, 'magenta' );


	ISPIP.vertex = ISPIP.pips[ index ][ 2 ];
	const  geometry = new THREE.Geometry();
	geometry.vertices = [ ISPIP.vertex, new THREE.Vector3( ISPIP.vertex.x, ISPIP.vertex.y, ISPIP.vertex.z + 1 ) ];
	const material = new THREE.LineBasicMaterial( { color: 0x888888 } );
	const line = new THREE.Line( geometry, material );
	ISPIP.helpers.add( line );

	if ( ISPIP.pips[ index ][ 3 ] ) {

		ISPIP.vertex2 = ISPIP.pips[ index ][ 3 ];
		geometry2 = new THREE.Geometry();
		geometry2.vertices = [ ISPIP.vertex2, new THREE.Vector3( ISPIP.vertex2.x, ISPIP.vertex2.y, ISPIP.vertex2.z + 0.5 ) ];
		material2 = new THREE.LineBasicMaterial( { color: 0x00ff00 } );
		line2 = new THREE.Line( geometry2, material2 );
		ISPIP.helpers.add( line2 );

	}

	THR.scene.add( ISPIP.helpers );



	const htm =
	`
		vertex<br>
		x:${ ISPIP.vertex.x } y:${ ISPIP.vertex.y } z:${ ISPIP.vertex.z }<br>
		polygon yellow<br>
		${ polyVerticesTxt }
	`;

	ISPIPdivPointInPolygonLog.innerHTML = htm;

};



ISPIP.getSprite = function() {

	const spriteMaterial = new THREE.SpriteMaterial( { color: 0xff0000 } );
	const scale = 0.1;
	const sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set( scale, scale, scale );

	ISPIP.helpers.add( sprite );

	return sprite;

};



ISPIP.drawLine = function( vertices, color ) {

	const  geometry = new THREE.Geometry();
	vertices.push( vertices[ 0 ] );
	geometry.vertices = vertices;

	const material = new THREE.LineBasicMaterial( { color: color } );
	const line = new THREE.Line( geometry, material );
	ISPIP.helpers.add( line );

	return line;

};



ISPIP.cleanUpScene = function() {

	THR.scene.remove( POP.line, POP.particle );
	THR.scene.remove( ISPIP.helpers );

	ISPIP.helpers = new THREE.Group();

	THR.scene.add( ISPIP.helpers );

	GBX.surfaceMeshes.children.forEach( element => element.visible = true );

	detPointInPolygon.querySelectorAll( "button" ).forEach( button => 	button.style.cssText = "" );

};


ISPIP.vertexZoom = function() {

	console.log( '', ISPIP.vertex );
	const vertex = ISPIP.vertex;

	var radius = 3;
	//THR.controls.reset();
	THR.controls.target.copy( vertex ); // needed because model may be far from origin
	//THR.controls.maxDistance = 5 * radius;

	THR.camera.position.copy( vertex.clone().add( new THREE.Vector3( radius, radius, radius ) ) );
	THR.camera.near = 0.001;
	//THR.camera.far = 10 * radius;
	THR.camera.updateProjectionMatrix();

}