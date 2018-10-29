// Copyright 2018 Ladybug Tools authors. MIT License
/* globals THR, GBX, POP, ISPIPdivPointInPolygonLog */
/* jshint esversion: 6 */

const ISPIP = { "release": "R7.0" };

ISPIP.getMenuPointInPolygon = function() {

	const htm =

	`<details ontoggle=ISPIP.getPointInPolygonCheck(); open >

		<summary>Point In Polygon</summary>

		<p>
			<i>
				Check if the coordinates of one surface are inside the coordinates of another surface.
				ISPIP ${ ISPIP.release }.
			</i>
		</p>

		<p>
			<button onclick=ISPIP.toggleSurfacesHorizontal(this); > Surfaces horizontal toggle </button>
		</p>

		<p>Click above to identify just the horizontal surfaces</p>
		<p>
			<button onclick=ISPIP.setPointInPolygonToggle(this); > Point in polygon toggle </button>
		</p>

		<div id=ISPIPdivPointInPolygonLog ></div>

		<details>

			<summary>ISPIP Status 2018-10-27</summary>

			<p>New WIP experiment. Looking interesting. Algorithm does a great job of finding points inside polygons.
			Now must learn to exclude points sitting exactly on or very close to the borderlines.<p>

		</details>

		<hr>

	</details>`;

	return htm;

};



ISPIP.toggleSurfacesHorizontal = function( button ) {

	const tilt = surface.RectangularGeometry.Tilt;

	ISPIP.horizontalsJson = GBX.gbjson.Campus.Surface.filter( surface => tilt === "0" || tilt === "180" );


	//console.log( 'horizontals', ISPIP.horizontalsJson );

	if ( button.style.fontStyle !== 'italic' ) {

		if ( ISPIP.horizontalsJson.length ) {

			GBX.surfaceMeshes.children.forEach( element => element.visible = false );

			surfaceMeshes = GBX.surfaceMeshes.children.filter( element => ISPIP.horizontalsJson.find( item => item.id === element.userData.gbjson.id ) );
			//console.log( 'surfaceMeshes', surfaceMeshes );
			surfaceMeshes.forEach( mesh => mesh.visible = true );

		} else {

			GBX.surfaceMeshes.children.forEach( element => element.visible = !element.visible );

		}

		button.style.backgroundColor = 'pink';
		button.style.fontStyle = 'italic';

	} else {

		GBX.surfaceMeshes.children.forEach( element => element.visible = true );

		button.style.fontStyle = '';
		button.style.backgroundColor = '';
		button.style.fontWeight = '';

	}

};



ISPIP.setPointInPolygonToggle = function( button ) {

	THR.scene.remove( POP.line, POP.particle );

	surfaceArray = ISPIP.horizontalsJson;

	if ( !surfaceArray ) { alert( "first toggle horizontals"); return; }

	if ( button.style.fontStyle !== 'italic' ) {

		//console.log( 'surfaceArray', surfaceArray );

		polygons = [];
		vertices = 0;
		insides = 0;

		if ( surfaceArray.length ) {

			for ( surfaceJson of surfaceArray ) {

				polygons.push( ISSI.getVertices ( surfaceJson.PlanarGeometry.PolyLoop ) );

			}

			//console.log( 'polygons ', polygons );

			for ( polygon of polygons ) {

				for ( polygonOther of polygons ) {

					for ( vertex of ( polygonOther ) ) {

						if ( polygon !== polygonOther && vertex.z === polygon[ 0 ].z ) {

							const inside = ISSI.pointInPolygon( vertex, polygon );

							if ( inside ) {

								let same = false;

								for ( vertex2 of polygon ) {

									if ( vertex2.x === vertex.x && vertex2.y === vertex.y ) { same = true };

								}

								if ( same === false ) {

									console.log( 'p&v', polygon, vertex );
									const sprite = ISPIP.getSprite();
									sprite.position.copy( vertex );

									ISPIP.drawLine( polygonOther, 'magenta' );
									ISPIP.drawLine( polygon, 'yellow' );


									insides ++;

								}




							}


						}

						vertices ++;
					}
				}
			}

			console.log( 'vertices', vertices, insides );

		} else {

			GBX.surfaceMeshes.children.forEach( element => element.visible = !element.visible );

		}

		button.style.backgroundColor = 'pink';
		button.style.fontStyle = 'italic';

	} else {

		GBX.surfaceMeshes.children.forEach( element => element.visible = true );

		button.style.fontStyle = '';
		button.style.backgroundColor = '';
		button.style.fontWeight = '';

	}

};



ISSI.getVertices = function( polyloop ) {

	const points = polyloop.CartesianPoint.map( CartesianPoint => new THREE.Vector3().fromArray( CartesianPoint.Coordinate ) );
	return points;

};


ISSI.pointInPolygon = function( pt, vs ) {

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



ISPIP.getSprite = function() {

	const spriteMaterial = new THREE.SpriteMaterial( { color: 0xff0000 } );
	sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set( 0.5, 0.5, 0.5 )

	THR.scene.add( sprite );

	return sprite;

};



ISPIP.drawLine = function( vertices, color ) {

	const  geometry = new THREE.Geometry();
	geometry.vertices = vertices;

	const material = new THREE.LineBasicMaterial( { color: color } );
	const line = new THREE.Line( geometry, material );
	THR.scene.add( line );
	return line;

};



ISPIP.getPointInPolygonCheck = function() {

	ISPIPdivPointInPolygonLog.innerHTML = `<p>date & time: ${ ( new Date() ).toLocaleString() } </p>`;

};
