// Copyright 2018 Ladybug Tools authors. MIT License
// jshint esversion: 6
/* globals THREE, THR, THRU, timeStart, divSettingss */


const SET = {"release": "R15.1", "date": "2019-01-31" };

SET.getSettingsMenu = function() {

	const htm =
	`
		<p><i>Update display parameters</i>
			<a title="View the Three.js Utilities Read Me" href="https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/cookbook/spider-viewer-threejs-utilities/" target="_blank">?</a><
			/p>

		<p>
			<button onclick="THR.controls.autoRotate = !THR.controls.autoRotate;" >toggle rotation</button>

			<button onclick=THRU.toggleAxesHelper(); >toggle axes</button>

			<button onclick=GBX.boundingBox.visible=!GBX.boundingBox.visible; >toggle bounding box</button>

			<button onclick=GBXU.toggleGroundHelper(); >toggle ground</button>

			<button onclick=SET.toggleShadows(); >toggle shadows</button>
		</p>

		<p>
			<button onclick=THRU.toggleSurfaces(); >toggle surfaces</button>

			<button onclick=SET.toggleOpenings(); >toggle openings</button>

			<button onclick=SET.toggleEdgesThreejs(); >toggle edges three.js</button>
		</p>


		<p>
			<button onclick=THRU.toggleWireframe(); >toggle wireframe</button>

			<button onclick=THRU.toggleSurfaceNormals(); title="All Three.js triangles have a normal. See them here." > toggle surface normals </button>
		</p>

		<p title="opacity: 0 to 100%" >
			opacity
			<output id=outOpacity class=floatRight >85%</output><br>

			<input type="range" id="rngOpacity" min=0 max=100 step=1 value=85 oninput=THRU.updateOpacity(); >
		</p>

		<p>
			<button onclick=THRU.zoomObjectBoundingSphere(GBX.boundingBox);>zoom all</button>

			<button accesskey="z" onclick=THR.controls.screenSpacePanning=!THR.controls.screenSpacePanning; title="Access key + B: Up/down curser kes to forward/backward or up/down" >toggle cursor keys</button>
		</p>

		<div>  </div>

	`;

	return htm;

};



SET.toggleShadows = function() {

	THR.renderer.shadowMap.enabled = !THR.renderer.shadowMap.enabled;

	THR.renderer.shadowMap.needsUpdate = true;

	THR.renderer.clearTarget( THRU.lightDirectional.shadow.map );

};



SET.toggleOpenings = function() {
	//console.log( '', 22 );

	if ( GBX.surfaceOpenings && GBX.surfaceOpenings.length === 0 ) {

		GBX.surfaceOpenings= new THREE.Group();
		GBX.surfaceOpenings.name = 'GBX.surfaceOpenings';
		surfaceOpenings = GBX.getSurfaceOpenings();
		//console.log( 'surfaceOpenings', surfaceOpenings );

		if ( !surfaceOpenings.length ) { return; }

		GBX.surfaceOpenings.add( ...surfaceOpenings );

		THR.scene.add( GBX.surfaceOpenings );

		return;

	}

	GBX.surfaceOpenings.traverse( function ( child ) {

		if ( child instanceof THREE.Line ) {

			child.visible = !child.visible;

		}

	} );

};


SET.toggleEdgesThreejs = function() {

	if ( GBX.surfaceEdgesThreejs && GBX.surfaceEdgesThreejs.length === 0 ) {

		GBX.surfaceEdgesThreejs = new THREE.Group();
		GBX.surfaceEdgesThreejs.name = 'GBX.surfaceEdgesThreejs';
		const surfaceEdgesThreejs = GBX.getSurfaceEdgesThreejs();
		//console.log( 'surfaceEdgesThreejs', surfaceEdgesThreejs );

		GBX.surfaceEdgesThreejs.add( ...surfaceEdgesThreejs );

		THR.scene.add( GBX.surfaceEdgesThreejs );

		return;

	}


	GBX.surfaceEdgesThreejs.traverse( function ( child ) {

		if ( child instanceof THREE.Line ) {

			child.visible = !child.visible;

		}

	} );

};




