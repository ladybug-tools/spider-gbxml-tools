/* eslint strict: ["error", "global"] */

"use strict";

/* globals GBX, THR, THRU, THREE */
// jshint esversion: 6
// jshint loopfunc: true


const G3NOR = {

	"script": {

		"copyright": "Copyright 2019 Ladybug Tools authors",
		"date": "2019-08-21",
		"description": "description",
		"helpFile": "js-fixer-3d/g3nor-gbxml-fixer-3d-normals.md",
		"license": "MIT License",
		"sourceCode": "js-fixer-3d/g3nor-gbxml-fixer-3d-normals.js",
		"version": "0.17.03-0tmp"

	}

};


G3NOR.addNormals = function ( button, selectedSurfaces = [] ) {

	// Console.log( 'selectedSurfaces', selectedSurfaces );

	button.classList.add( "active" );

	G3NOR.selectedSurfaces = selectedSurfaces;

	GBX.meshGroup.children.forEach( mesh => mesh.visible = false );

	G3NOR.selectedSurfaces.forEach( mesh => mesh.visible = true );

	G3NOR.addSurfaceNormalsHelpers();

};


G3NOR.addSurfaceNormalsHelpers = function () {


	THR.scene.remove( G3NOR.faceNormals );

	G3NOR.faceNormals = new THREE.Group();

	const material = new THREE.MeshNormalMaterial();
	const fraction = 0.05;
	const length = fraction * THRU.radius;
	const color = 0xff00ff;

	GBX.meshGroup.children.forEach( child => {

		if ( child.visible ) {

			const geometry = new THREE.Geometry();
			const geo = geometry.fromBufferGeometry( child.geometry );
			const mesh = new THREE.Mesh( geo, material );

			mesh.rotation.copy( child.rotation );
			mesh.position.copy( child.position );

			const faceNormalHelper =
				new THREE.FaceNormalsHelper( mesh, length, color );

			faceNormalHelper.userData.index = child.userData.index;

			G3NOR.faceNormals.add( faceNormalHelper );

		}

	} );

	G3NOR.faceNormals.name = "faceNormals";

	THR.scene.add( G3NOR.faceNormals );

};
