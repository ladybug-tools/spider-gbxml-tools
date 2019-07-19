// jshint esversion: 6
/* globals THREE, THR, THRU, timeStart, divSettingss */


const SET = {

	Copyright: "2019 Ladybug Tools authors",
	license: "MIT License",
	"date": "2019-06-29",
	"version": "0.17.00"

};



SET.getSettingsMenu = function() {

	SET.spaceTitles = [];

	const htm =
	`
		<h4>Update display parameters</h4>

		<p>
			<button onclick="THR.controls.autoRotate = !THR.controls.autoRotate;" >toggle rotation</button>

			<button onclick=THRU.toggleAxesHelper(); >toggle axes</button>
		<p>

			<button onclick=GBXU.boundingBox.visible=!GBXU.boundingBox.visible; >toggle bounding box</button>

			<button onclick=THRU.toggleGroundHelper(); >toggle ground</button>
<!--
			<button onclick=SET.toggleShadows(); >toggle shadows</button>
-->
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
		<button onclick=SET.toggleSpaceTitles(); >toggle space titles</button>
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

	`;

	return htm;

};



SET.toggleShadows = function() {

	THR.renderer.shadowMap.enabled = !THR.renderer.shadowMap.enabled;

	THR.renderer.shadowMap.needsUpdate = true;

	THR.renderer.clearTarget( THRU.lightDirectional.shadow.map );

};



SET.xxtoggleEdgesThreejs = function () {

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


SET.toggleSpaceTitles = function () {

	titles = GBX.spaces.map( space => {

		const name = space.match( /<Name>(.*?)<\/Name>/i )[ 1 ];
		const id = space.match( / id="(.*?)"/ )[ 1 ];

		return ( { id, name } );

	} );
	//console.log( 'titles', titles );

	const floors = GBX.surfaces.filter( surface => surface.includes( "InteriorFloor" ) );
	//console.log( 'floors', floors );
	const scale = 0.001;
	const distance = THR.camera.position.distanceTo( THR.controls.target );

	points = floors.map( surface => {

		const id = surface.match( / id="(.*?)"/ )[ 1 ];

		const spaceId = surface.match( / spaceIdRef="(.*?)"/gi ).pop().slice( 13,-1);
		//console.log( 'spaceId', spaceId );

		const title = titles.find( title => title.id === spaceId )
		//console.log( '', title );

		const index = GBX.surfaces.indexOf( surface );

		const mesh = GBX.surfaceGroup.children[ index ];

		const center = mesh.geometry.boundingSphere.center;

		const placard = THRU.drawPlacard( title.name, 0.0001 * distance, 0x00ff00,
			center.x, center.y, center.z + 1);

		mesh.add( placard )

	} );




};