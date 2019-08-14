/* globals THREE, THR, THRU, GBX, timeStart, divSettingss */
// jshint esversion: 6
// jshint loopfunc: true

const SET = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors. MIT License",
		date: "2019-07-19",
		description: "Toggle various scene display parameters",
		helpFile: "js-scene/set-settings.md",
		license: "MIT License",
		version: "0.17-01-0set"

	}
};



SET.getMenuSettings = function() {

	const htm =
	`
		<details id="SETdetMenuSettings" >

			<summary>Display settings</summary>

			${ SET.getPanelSettings() }

		</details>
	`;

	return htm;

};




SET.getPanelSettings = function() { // add help??

	const htm =
	`
		<p>
			<button onclick="THR.controls.autoRotate = !THR.controls.autoRotate;" >toggle rotation</button>

			<button onclick=THRU.toggleAxesHelper(); >toggle axes</button>
		<p>
			<button onclick=THRU.boundingBoxHelper.visible=!THRU.boundingBoxHelper.visible; >toggle bounding box</button>

			<button onclick=THRU.toggleGroundHelper(); >toggle ground</button>
		</p>

		<p>
			<button onclick=SET.toggleShadows(); >toggle shadows</button>
		</p>

		<p>
			<button onclick=THRU.toggleSurfaces(); >toggle surfaces</button>

			<button onclick=GBXU.toggleOpenings(); >toggle openings</button>

		<p>
			<button onclick=THRU.toggleEdges(GBX.meshGroup); >toggle edges three.js</button>
		</p>


		<p>
			<button onclick=THRU.toggleWireframe(); >toggle wireframe</button>

			<button onclick=THRU.toggleSurfaceNormals(); title="All Three.js triangles have a normal. See them here." > toggle surface normals </button>
		</p>

		<p>
			<button class=highlight onclick=SET.toggleSpaceTitles(); >toggle space titles</button>
		</p>

		<p title="opacity: 0 to 100%" >
			opacity <output id=outOpacity class=floatRight >85%</output><br>
			<input type="range" id="rngOpacity" min=0 max=100 step=1 value=85 oninput=THRU.setObjectOpacity(); >
		</p>

		<p>
			<button onclick=THRU.zoomObjectBoundingSphere(GBXU.boundingBox);>zoom all</button>

			<button accesskey="b" onclick=THR.controls.enableKeys=true;THR.controls.screenSpacePanning=!THR.controls.screenSpacePanning; title="Alt + B: Up/down curser keys to forward/backward or up/down" >toggle cursor keys</button>
		</p>

	`;

	return htm;

};



SET.toggleShadows = function() {

	THRU.lightDirectional.castShadow = !THRU.lightDirectional.castShadow;

};



SET.toggleSpaceTitles = function () {

	if ( GBX.placards.children.length === 0 ) {

		const scale = 0.0001 * THR.camera.position.distanceTo( THR.controls.target );

		GBX.placards = new THREE.Object3D();

		GBX.spaces.forEach( ( space, index ) => {

			const polyLoop = GBX.getPolyLoops( space );
			//console.log( '', polyLoop );

			const coordinates = GBX.getCoordinates( polyLoop[ 0 ] );
			//console.log( 'coordinates', coordinates );

			const bbox = new THREE.Box3;
			bbox.setFromArray( coordinates );
			//console.log( 'bbox', bbox );

			const center = bbox.getCenter( new THREE.Vector3() );
			//console.log( 'center', center );

			

			const name = space.match( /<Name>(.*?)<\/Name>/i )[ 1 ];

			const placard = THRU.drawPlacard( name, scale, 0x00ff00, center.x, center.y, center.z + 1.5 );

			placard.userData = GBX.spacesJson[ index ];

			GBX.placards.add( placard );

		} );

		THR.scene.add( GBX.placards );

		PFO.surfaceTypesActive = PFO.surfaceTypesInUse.slice();

		PFO.storeyIdsActive = PFO.storeyIdsInUse.slice();

		PFO.setVisible();

	} else {

		GBX.placards.visible = !GBX.placards.visible;

	}


};