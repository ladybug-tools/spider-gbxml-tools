
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



VEX.explodeInit = function() {

	THR.scene.updateMatrixWorld();

	PIN.intersected = null;

	THR.scene.remove( PIN.line, PIN.particle );

	GBX.meshGroup.traverse( function ( child ) { // gather original positions

		if ( child instanceof THREE.Mesh ) {

			child.updateMatrixWorld();

			child.userData.positionStart1 = child.position.clone();

		}

	} );

	VEX.explodeStart = true;

};



VEX.explodeByStoreys = function() {

	if ( VEX.explodeStart === false ) { VEX.explodeInit(); }

	VEX.setViewSettings();

	GBX.meshGroup.traverse( function ( child ) {

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

			child.position.z += 3 * vec.z - THRU.radius;

		}

	} );

	THRU.zoomObjectBoundingSphere( GBX.meshGroup );

};



VEX.explodePlus = function() {

	if ( VEX.explodeStart === false ) { VEX.explodeInit(); }

	const size = 1;

	VEX.setViewSettings();

	GBX.meshGroup.traverse( function ( child ) {

		if ( child.geometry && child.geometry.boundingSphere ) {

			const position = child.geometry.boundingSphere.center.clone();
			position.applyMatrix4( child.matrixWorld );

			const vec = position.sub( THRU.center ).normalize().multiplyScalar( size );

			child.position.add( vec );

		}

	} );

};



VEX.explodeMinus = function() {

	if ( VEX.explodeStart === false ) { VEX.explodeInit(); }

	const size = 1;

	VEX.setViewSettings();

	GBX.meshGroup.traverse( function ( child ) {

		if ( child.geometry && child.geometry.boundingSphere ) {

			child.updateMatrixWorld();

			const position = child.geometry.boundingSphere.center.clone();
			position.applyMatrix4( child.matrixWorld );

			const vec = position.sub( THRU.center ).normalize().multiplyScalar( size );

			child.position.sub( vec );

		}

	} );

};



VEX.explodeReset = function() {

	if ( VEX.explodeStart === false ) { VEX.explodeInit(); }

	GBX.meshGroup.traverse( function ( child ) {

		if ( child instanceof THREE.Mesh && child.userData.positionStart1 ) {

			child.position.copy( child.userData.positionStart1 );

		}

	} );

	THRU.zoomObjectBoundingSphere( GBX.meshGroup );

};


VEX.setViewSettings = function(){

	THRU.boundingBoxHelper.visible = false;
	//GBX.openingGroup.visible = false );


}