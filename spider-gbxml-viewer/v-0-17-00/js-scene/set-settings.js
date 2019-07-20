/* globals THREE, THR, THRU, GBX, timeStart, divSettingss */
// jshint esversion: 6
// jshint loopfunc: true

const SET = {

	"script": {

		"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
		"date": "2019-07-19",
		"description": "",
		"helpFile": "../v-0-17-00/js-scene/set-settings.md",
		license: "MIT License",
		"version": "0.17-00-0set",
		"urlSourceCode":
	"https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/spider-gbxml-viewer/v-0-17-00/js-scene/"

	}
};



SET.getMenuSettings = function() {

	const htm =
	`
		<details id="detSettings" ontoggle="" >

			<summary>Display settings</summary>

			<p>
				<button onclick="THR.controls.autoRotate = !THR.controls.autoRotate;" >toggle rotation</button>

				<button onclick=THRU.toggleAxesHelper(); >toggle axes</button>
			<p>

				<button onclick=GBXU.boundingBox.visible=!GBXU.boundingBox.visible; >toggle bounding box</button>

				<button onclick=THRU.toggleGroundHelper(); >toggle ground</button>

				<button onclick=SET.toggleShadows(); >toggle shadows</button>

			</p>

			<p>
				<button onclick=THRU.toggleSurfaces(); >toggle surfaces</button>

				<button onclick=GBXU.toggleOpenings(); >toggle openings</button>

			<p>
				<button onclick=THRU.toggleEdges(); >toggle edges three.js</button>
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

				<button accesskey="z" onclick=THR.controls.screenSpacePanning=!THR.controls.screenSpacePanning; title="Access key + B: Up/down curser kes to forward/backward or up/down" >toggle cursor keys</button>
			</p>

			<div>  </div>

		</details>

	`;

	return htm;

};



SET.toggleShadows = function() {

	THRU.lightDirectional.castShadow = !THRU.lightDirectional.castShadow;

};



SET.toggleSpaceTitles = function () {

	if ( GBX.placards === undefined ) {

		const scale = 0.0001 * THR.camera.position.distanceTo( THR.controls.target );

		GBX.placards = new THREE.Object3D();

		GBX.spaces.forEach( space => {

			const name = space.match( /<Name>(.*?)<\/Name>/i )[ 1 ];

			const polyLoop = GBX.getPolyLoops( space );
			//console.log( '', polyLoop );

			const coordinates = GBX.getCoordinates( polyLoop[ 0 ] );
			//console.log( 'coordinates', coordinates );

			const bbox = new THREE.Box3;
			bbox.setFromArray( coordinates );
			//console.log( 'bbox', bbox );

			const center = bbox.getCenter( new THREE.Vector3() );
			//console.log( 'center', center );

			const placard = THRU.drawPlacard( name, scale, 0x00ff00, center.x, center.y, center.z + 1.5 );

			GBX.placards.add( placard );

		} );

		THR.scene.add( GBX.placards );

	} else {

		GBX.placards.visible = !GBX.placards.visible;

	}

};