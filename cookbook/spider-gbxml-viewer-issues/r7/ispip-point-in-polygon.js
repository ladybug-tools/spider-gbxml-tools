// Copyright 2018 Ladybug Tools authors. MIT License
/* globals THREE, THR, GBX, POP, detPointInPolygon, ISPIPselPip, ISPIPdivPointInPolygonLog */
/* jshint esversion: 6 */

const ISPIP = { "release": "R7.1" };

ISPIP.getMenuPointInPolygon = function() {

	const htm =

	`<details id=detPointInPolygon ontoggle=ISPIP.getPointInPolygonCheck();  >

		<summary>Point In Polygon</summary>

		<p>
			<i>
				Check if the coordinates of one surface are inside the coordinates of another surface.
				ISPIP ${ ISPIP.release }.
			</i>
		</p>

		<p>
			<button onclick=ISPIP.toggleSurfacesByAngles(this,["0","180"]); > toggle horizontal surfaces </button>
		</p>

		<p>
			<button onclick=ISPIP.toggleSurfacesByAngles(this,"90"); > toggle vertical surfaces </button>
		</P

		<p>
			<button onclick=ISPIP.toggleSurfacesByAngles(this); > toggle angled surfaces </button>
		</P

		<p>
			<button onclick=ISPIP.setPointInPolygonToggle(this); > Point in polygon toggle </button>
		</p>

		<p>
			<select id=ISPIPselPip onclick=ISPIP.togglePip(); size=10 style=width:100%; ></select>
		</p>

		<div id=ISPIPdivPointInPolygonLog ></div>

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

	ISPIPdivPointInPolygonLog.innerHTML = `<p>tilt angles: ${ ISPIP.anglesTilt.map( item => Number( item ).toLocaleString() ).join( ', ' ) } </p>`;

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

							const same = ISPIP.checkBorders( vertexOther, polygon );

							if ( same === false ) {

								//console.log( 'p&v', polygon, vertexOther );

								const sprite = ISPIP.getSprite();
								sprite.position.copy( vertexOther );

								ISPIP.pips.push( [ polygon, polygonOther, vertexOther ] );

								//ISPIP.drawLine( polygonOther, 'magenta' );
								//ISPIP.drawLine( polygon, 'yellow' );

								insides ++;

							}

						}

						vertices ++;

					}

				}

			}

		}

		console.log( 'vertices', vertices, insides );

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

	let same = false;

	for ( let vertex of polygon ) {

		if ( vertexOther.x === vertex.x && vertexOther.y === vertex.y ) { same = true; } // we already checked z

	}

 	if ( same === true ) { return same; }

	for ( let i = 0; i < polygon.length - 1; i++ ) {

		const line = new THREE.Line3( polygon[ i ], polygon[ i + 1 ] );

		const point = line.closestPointToPoint( vertexOther, false, new THREE.Vector3() );

		if ( vertexOther.distanceTo( point ) < 0.01 ) {

			//console.log( 'point', vertexOther.distanceTo( point ) );

			same = true;

		}

	}

	return same;

};



ISPIP.setSelectPip = function() {

	let color;
	let options = '';
	let count = 1;

	for ( let pip of ISPIP.pips ) {

		color = color === 'lightgray' ? '' : 'lightgray';
		options +=
		`
			<option style=background-color:${ color } >pip ${ count++ }</option>

		`;
	}

	ISPIPselPip.innerHTML = options;

};



ISPIP.togglePip = function( select ) {

	THR.scene.remove( ISPIP.helpers );

	ISPIP.helpers = new THREE.Group();

	const index = ISPIPselPip.selectedIndex;

	console.log( '', ISPIP.pips[ index ] );

	ISPIP.drawLine( ISPIP.pips[ index ][ 0 ], 'yellow' );
	ISPIP.drawLine( ISPIP.pips[ index ][ 1 ], 'magenta' );


	const vertex = ISPIP.pips[ index ][ 2 ];
	const  geometry = new THREE.Geometry();
	geometry.vertices = [ vertex, new THREE.Vector3( vertex.x, vertex.y, vertex.z + 1 ) ];
	const material = new THREE.LineBasicMaterial( { color: 0x888888 } );
	const line = new THREE.Line( geometry, material );
	ISPIP.helpers.add( line );

	THR.scene.add( ISPIP.helpers );
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
