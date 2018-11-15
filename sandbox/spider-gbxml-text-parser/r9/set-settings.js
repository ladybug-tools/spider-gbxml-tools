// Copyright 2018 Ladybug Tools authors. MIT License
// jshint esversion: 6
/* globals THREE, THR, THRU, timeStart, divSettingss */


const SET = {"release": "R9.0", "date": "2018-11-14" };

GBX.surfaceEdges = [];
SET.getSettingsMenu = function() {


	const htm =
	`
		<p><i>Update display parameters</i>
			<a title="View the Three.js Utilities Read Me" href="https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/cookbook/spider-viewer-threejs-utilities/" target="_blank">?</a></p>

		<p>
			<button onclick="THR.controls.autoRotate = !THR.controls.autoRotate;" >toggle rotation</button>

			<button onclick=THRU.toggleAxesHelper(); >toggle axes</button>
		</p>

		<p>
			<button onclick=THRU.toggleSurfaces(); >toggle surfaces</button>

			<button onclick=SET.toggleEdges(); >toggle edges</button>
		</p>


		<p>
			<button onclick=THRU.toggleWireframe(); >toggle wireframe</button>

			<button onclick=THRU.toggleSurfaceNormals(); title="All Three.js triangles have a normal. See them here." > toggle surface normals </button>
		</p>

		<p title="opacity: 0 to 100%" >opacity
			<output id=outOpacity class=floatRight >85%</output><br>

			<input type="range" id="rngOpacity" min=0 max=100 step=1 value=85 oninput=THRU.updateOpacity(); >
		</p>

		<p>
			<button onclick=THRU.zoomObjectBoundingSphere(GBX.surfaceMeshes);>zoom all</button>

			<button accesskey="z" onclick=THR.controls.screenSpacePanning=!THR.controls.screenSpacePanning; title="Access key + B: Up/down curser kes to forward/backward or up/down" >toggle cursor keys</button>
		</p>

		<div>  </div>

	`;

	return htm;

};


SET.toggleEdges = function() {

	//console.log( '', 22 );

	if ( GBX.surfaceEdges && GBX.surfaceEdges.length === 0 ) {

		GBX.surfaceEdges= new THREE.Group();
		GBX.surfaceEdges.name = 'GBX.surfaceEdges';
		GBX.surfaceEdges = GBX.getSurfaceEdges();

		THR.scene.add( GBX.surfaceEdges );

		return;

	}


	THR.scene.traverse( function ( child ) {

		if ( child instanceof THREE.Line ) {

			child.visible = !child.visible;

		}

	} );

};




GBX.getSurfaceEdgesGbxml = function() {

	const material = new THREE.LineBasicMaterial( { color: 0x888888, linewidth: 2, transparent: true } );
	const lines = [];

	for ( let surfaceJson of GBX.surfaces ) {

		const vertices = surfaceJson.PlanarGeometry.PolyLoop.CartesianPoint
			.map( point => new THREE.Vector3().fromArray( point.Coordinate  ) );
		//console.log( 'vertices', vertices );

		const geometry = new THREE.Geometry().setFromPoints( vertices )
		//console.log( 'geometry', geometry );

		const line = new THREE.LineLoop( geometry, material );
		lines.push( line );

	}

	THR.scene.add( ...lines );

	return lines;

};