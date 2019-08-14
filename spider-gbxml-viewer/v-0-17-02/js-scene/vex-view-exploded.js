"use strict";

/* globals THREE, THR, THRU, GBX, timeStart, divSettingss */
// jshint esversion: 6
// jshint loopfunc: true


const VEX = {

	copyright: "Copyright 2019 Ladybug Tools authors",
	date: "2019-08-13",
	description: "Toggle an exploded 3D view of the model",
	helpFile: "js-scene/vex-view-exploded.md",
	license: "MIT License",
	version: "0.17.02-1vex"

};



////////// Exploded Views

VEX.setDetExplodedViews = function( target ) {

	VEX.explodeStart = VEX.explodeStart || false;

	target.innerHTML =
	`
		<h4>Exploded views</h4>

		<p>Separate the floors of the model</p>

		<p>
			<button onclick=VEX.explodeByStoreys(); >Explode by storeys</button>
		</p>

		<p>Separate the surfaces of the model</p>

		<p>
			<button onclick=VEX.explodeMinus();> Minus </button>
			<button onclick=VEX.explodeReset(); >Reset</button>
			<button onclick=VEX.explodePlus();> Plus </button>
		</p>

	`;

};



VEX.explodeInit = function() {

	THR.scene.updateMatrixWorld();

	PIN.intersected = null;

	THR.scene.remove( PIN.line, PIN.particle );

	GBX.meshGroup.traverse( function ( child ) { // gather original positions

		if ( child instanceof THREE.Mesh ) {

			child.updateMatrixWorld();

			child.userData.positionStart = child.position.clone();

		}

	} );

	GBX.placards.children.forEach( placard => {

		const child = placard.children[ 0 ];

		child.updateMatrixWorld();

		child.userData.positionStart = child.position.clone();

	} );


	VEX.explodeStart = true;

};



VEX.explodeByStoreys = function() {

	if ( VEX.explodeStart === false ) { VEX.explodeInit(); }

	VEX.setViewSettings();

	GBX.meshGroup.traverse( function ( child ) {

		if ( child instanceof THREE.Mesh ) {

			child.updateMatrixWorld();

			if ( !child.userData.positionCurrent ) {

				//console.log( 'child', child.geometry );
				child.geometry.computeBoundingSphere ();
				const positionCurrent = child.geometry.boundingSphere.center.clone();
				positionCurrent.applyMatrix4( child.matrixWorld );
				child.userData.positionCurrent = positionCurrent;

			}

			const vec = child.userData.positionCurrent.clone();

			child.position.z += 3 * vec.z - THRU.radius;

		}

	} );

	GBX.placards.children.forEach( placard => {

		const child = placard.children[ 0 ];

		child.updateMatrixWorld();

		if ( !child.userData.positionCurrent ) {

			//console.log( 'child', child.geometry );
			child.geometry.computeBoundingSphere ();
			const positionCurrent = child.geometry.boundingSphere.center.clone();
			positionCurrent.applyMatrix4( child.matrixWorld );
			child.userData.positionCurrent = positionCurrent;

		}

		const vec = child.position.clone();

		child.position.z += 1 + 3 * vec.z - THRU.radius;

	} );

	THRU.zoomObjectBoundingSphere( GBX.meshGroup );

};



VEX.explodePlus = function() {

	if ( VEX.explodeStart === false ) { VEX.explodeInit(); }

	const size = 1;

	VEX.setViewSettings();

	GBX.meshGroup.traverse( function ( child ) {

		//if ( child.geometry && child.geometry.boundingSphere ) {

		if ( child instanceof THREE.Mesh ) {

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

		//if ( child.geometry && child.geometry.boundingSphere ) {
		if ( child instanceof THREE.Mesh ) {

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

		if ( child instanceof THREE.Mesh && child.userData.positionStart ) {

			child.position.copy( child.userData.positionStart );

		}

	} );

	GBX.placards.children.forEach( placard => {

		const child = placard.children[ 0 ];

		child.position.copy( child.userData.positionStart );

	} );

	THRU.zoomObjectBoundingSphere( GBX.meshGroup );

};



VEX.setViewSettings = function(){

	THRU.boundingBoxHelper.visible = false;

}