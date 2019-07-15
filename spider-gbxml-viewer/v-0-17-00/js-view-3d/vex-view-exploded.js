
const VEX = {}



////////// Exploded Views

VEX.setDetExplodedViews = function( target ) {

	VEX.explodeStart = false;

	target.innerHTML =

	`
		<h4>Exploded views</h4>

		<p><small>Separate the floors of the building</small></p>

		<p>
			<button onclick=VEX.explodeByStoreys(); >Explode by storeys</button>
		</p>

		<button onclick=VEX.explodeMinus();> Minus </button>
		<button onclick=VEX.explodeReset(); >Reset</button>
		<button onclick=VEX.explodePlus();> Plus </button>

	`;

};



VEX.explodeByStoreys = function() {

	if ( VEX.explodeStart === false ) { VEX.explodeInit(); }

	GBXU.boundingBox.visible = false;
	GBX.openingGroup.children.forEach( opening => opening.visible = false );
	THRU.edgeGroup.children.forEach( opening => opening.visible = false );

	const bbox = new THREE.Box3().setFromObject( GBX.surfaceGroup );
	const sphere = bbox.getBoundingSphere( new THREE.Sphere() );
	const radius = sphere.radius;

	THR.scene.updateMatrixWorld();

	GBX.surfaceGroup.traverse( function ( child ) {

		if ( child instanceof THREE.Mesh ) {

			child.updateMatrixWorld();

			if ( !child.userData.positionStart2 ) {

				//console.log( 'child', child.geometry );
				child.geometry.computeBoundingSphere ();
				const positionStart2 = child.geometry.boundingSphere.center.clone();
				positionStart2.applyMatrix4( child.matrixWorld );
				child.userData.positionStart2 = positionStart2;

			}

			child.userData.vectorStart = child.userData.positionStart2.clone();
			const vec = child.userData.vectorStart.clone();

			child.position.z += 3 * vec.z - radius;

		}

	} );

	THRU.zoomObjectBoundingSphere( GBX.surfaceGroup );

};



VEX.explodeInit = function() {

	THR.scene.updateMatrixWorld();

	POPX.intersected = null;

	THR.scene.remove( POPX.line, POPX.particle );

	GBX.surfaceGroup.traverse( function ( child ) { // gather original positions

		if ( child instanceof THREE.Mesh ) {

			child.updateMatrixWorld();

			child.userData.positionStart1 = child.position.clone();

		}

	} );

	VEX.explodeStart = true;

};



VEX.explodePlus = function() {

	if ( VEX.explodeStart === false ) { VEX.explodeInit(); }

	const size = 1;

	GBXU.boundingBox.visible = false;
	GBX.openingGroup.children.forEach( opening => opening.visible = false );
	THRU.edgeGroup.children.forEach( opening => opening.visible = false );

	const bbox = new THREE.Box3().setFromObject( GBX.surfaceGroup );
	const sphere = bbox.getBoundingSphere( new THREE.Sphere() );
	const center = sphere.center;
	//const radius = sphere.radius;

	//THR.scene.updateMatrixWorld();

	GBX.surfaceGroup.traverse( function ( child ) {

		if ( child.geometry && child.geometry.boundingSphere ) {

			//child.updateMatrixWorld();

			const position = child.geometry.boundingSphere.center.clone();
			position.applyMatrix4( child.matrixWorld );

			const vec = position.sub( center ).normalize().multiplyScalar( size );

			child.position.add( vec );

		}

	} );

};



VEX.explodeMinus = function() {

	if ( VEX.explodeStart === false ) { VEX.explodeInit(); }

	const size = 1;

	GBXU.boundingBox.visible = false;
	GBX.openingGroup.children.forEach( opening => opening.visible = false );
	THRU.edgeGroup.children.forEach( opening => opening.visible = false );

	const bbox = new THREE.Box3().setFromObject( GBX.surfaceGroup );
	const sphere = bbox.getBoundingSphere( new THREE.Sphere() );
	const center = sphere.center;
	//const radius = sphere.radius;

	THR.scene.updateMatrixWorld();

	GBX.surfaceGroup.traverse( function ( child ) {

		if ( child.geometry && child.geometry.boundingSphere ) {

			child.updateMatrixWorld();

			const position = child.geometry.boundingSphere.center.clone();
			position.applyMatrix4( child.matrixWorld );

			const vec = position.sub( center ).normalize().multiplyScalar( size );

			child.position.sub( vec );

		}

	} );

};



VEX.explodeReset = function() {

	if ( VEX.explodeStart === false ) { VEX.explodeInit(); }

	GBX.surfaceGroup.traverse( function ( child ) {

		if ( child instanceof THREE.Mesh && child.userData.positionStart1 ) {

			child.position.copy( child.userData.positionStart1 );

		}

	} );

	//GBX.surfaceEdges.visible = true;
	//GBX.surfaceOpenings.visible = true;
	THRU.zoomObjectBoundingSphere( GBX.surfaceGroup );

};

