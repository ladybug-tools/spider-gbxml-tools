/* global THREE */
// jshint esversion: 6

// Copyright 2018 Ladybug Tools authors. MIT License

var THR = { release: ' THR 2018-10-02'};



THR.getThreejs = function( target ) {

	THR.renderer = new THREE.WebGLRenderer( { alpha: 1, antialias: true } );
	THR.renderer.setPixelRatio( window.devicePixelRatio );
	THR.renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( THR.renderer.domElement );

	THR.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 1000 );
	THR.camera.position.set( - 100, - 100, 100 );
	THR.camera.up.set( 0, 0, 1 );

	THR.controls = new THREE.OrbitControls( THR.camera, THR.renderer.domElement );

	THR.scene = new THREE.Scene();

	window.addEventListener( 'resize', THR.onWindowResize, false );
	window.addEventListener( 'orientationchange', THR.onWindowResize, false );

}



THR.onWindowResize = function() {

	THR.camera.aspect = window.innerWidth / window.innerHeight;
	THR.camera.updateProjectionMatrix();
	THR.renderer.setSize( window.innerWidth, window.innerHeight );
	//THR.controls.handleResize(); // trackball only

	//console.log( 'onWindowResize  window.innerWidth', window.innerWidth );

};



THR.animate = function() {

	requestAnimationFrame( THR.animate );
	THR.renderer.render( THR.scene, THR.camera );
	THR.controls.update();

};
