/* global THREE, divContents */
// jshint esversion: 6
// jshint loopfunc: true

"use strict";

var THR = {

	copyright: "Copyright 2019 Ladybug Tools authors. MIT License",
	date: "2019-10-18",
	description: "Three.js core - the basic function to bring Three.js up in your browser",
	helpFile: "../core-thr-threejs/thr-threejs.md",
	license: "MIT License",
	version: "0.17.07-0thr"

};


THR.getThreejs = function ( target = divContents ) {

	THR.renderer = new THREE.WebGLRenderer( { alpha: 1, antialias: true } );
	THR.renderer.setPixelRatio( window.devicePixelRatio );
	THR.renderer.setSize( target.clientWidth, target.clientHeight );

	target.appendChild( THR.renderer.domElement );

	THR.camera = new THREE.PerspectiveCamera( 40, target.clientWidth / target.clientHeight, 0.1, 1000 );
	THR.camera.position.set( - 100, - 100, 100 );
	THR.camera.up.set( 0, 0, 1 );

	THR.controls = new THREE.OrbitControls( THR.camera, THR.renderer.domElement );

	THR.scene = new THREE.Scene();

	window.addEventListener( 'resize', () => THR.onWindowResize( target ), false );
	window.addEventListener( 'orientationchange', () => THR.onWindowResize( target ), false );

};



THR.onWindowResize = function( target = divContents ) {

	THR.camera.aspect = target.clientWidth / target.clientHeight;
	THR.camera.updateProjectionMatrix();
	THR.renderer.setSize( target.clientWidth, target.clientHeight );
	//THR.controls.handleResize(); // trackball only

	//console.log( 'onWindowResize  target.innerWidth', target.innerWidth );

};



THR.animate = function() {

	requestAnimationFrame( THR.animate );
	THR.renderer.render( THR.scene, THR.camera );
	THR.controls.update();

};