/* global THREE, THR, GBX, GBXU, GSA, THRU, POP, POPF, divDragMoveFooter,PINbutAdjacentSpace1, PINbutAdjacentSpace2,  navDragMove, divDragMoveContent, main, */
// jshint esversion:
// jshint loopfunc: true


var PIN = {
	"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
	"date": "2019-07-24",
	"description": "TooToo Menu (PIN) generates standard HTML popup menu code and content and code that works on computers, tablets and phones",
	"helpFile": "js-popup/pop-popup.md",
	"version": "0.17.01-0pin",
	"urlSourceCode": "https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/cookbook/spider-gbxml-viewer-pop-up"
};



////////// Inits


PIN.init = function() { // call from home page

	PIN.mouse = new THREE.Vector2();
	PIN.raycaster = new THREE.Raycaster();
	PIN.intersected = undefined;
	PIN.parser = new DOMParser();

	PIN.particleMaterial = new THREE.SpriteMaterial( { color: 0xff0000 } );
	PIN.particle = new THREE.Sprite( PIN.particleMaterial );
	PIN.line = undefined;

	PIN.getArray = item => Array.isArray( item ) ? item : ( item ? [ item ] : [] );

	THR.renderer.domElement.addEventListener( 'mousedown', PIN.onDocumentMouseDown, false );
	THR.renderer.domElement.addEventListener( 'touchstart', PIN.onDocumentTouchStart, false ); // for mobile


};



PIN.onDocumentTouchStart = function( event ) {

	event.preventDefault();

	main.removeEventListener( 'click', POP.onClickClose );
	main.removeEventListener( 'touchstart', POP.onClickClose );

	//console.log( 'event', event );

	//event.clientX = event.touches[0].clientX - main.offsetLeft;
	//event.clientY = event.touches[0].clientY;
	//console.log( 'event.clientX', event.clientX );

	event.layerX = event.touches[0].clientX - main.offsetLeft;
	event.layerY = event.touches[0].clientY;

	PIN.onDocumentMouseDown( event );

};



PIN.onDocumentMouseDown = function( event ) {
	//console.log( 'event', event );

	//if ( event.button && event.button !== 0 ) { return ; }

	main.removeEventListener( 'click', POP.onClickClose );
	main.removeEventListener( 'touchstart', POP.onClickClose );

	const x = event.offsetX == undefined ? event.layerX : event.offsetX;
	const y = event.offsetY == undefined ? event.layerY : event.offsetY;
	//console.log( 'x', x );

	const size = THR.renderer.getSize( new THREE.Vector2() );

	PIN.mouse.x = ( x / size.width ) * 2 - 1;
	PIN.mouse.y = - ( y / size.height ) * 2 + 1;

	PIN.raycaster.setFromCamera( PIN.mouse, THR.camera );

	const objs = GBX.meshGroup ? GBX.meshGroup.children : [];
	PIN.intersects = PIN.raycaster.intersectObjects( objs );
	//console.log( 'PIN.intersects', PIN.intersects );

	if ( PIN.intersects.length > 0 ) {

		PIN.intersected = PIN.intersects[ 0 ].object;

		PIN.setIntersected( PIN.intersected );

	} else {

		PIN.intersected = null;

		divDragMoveContent.innerHTML = '';

		divDragMoveFooter.innerHTML = POP.footer;

		THR.scene.remove( PIN.line, PIN.particle );

	}

};



PIN.setIntersected = function( intersected = PIN.intersectedLast ) { // called by POPF.footer
	// console.log( '', intersected );

	PIN.intersected = intersected;

	PIN.surfaceXml = PIN.getIntersectedDataGbxml();

	if ( PIN.intersects && PIN.intersects.length > 0 ) {

		PIN.setIntersectedParticleAtPoint( PIN.intersects[ 0 ].point );

	}

	PIN.drawBorder( PIN.surfaceXml );

	divDragMoveContent.innerHTML = PCO.getContents( PIN.surfaceXml );

	divDragMoveFooter.innerHTML = PFO.footer;

	navDragMove.hidden = false;

	PIN.intersectedLast = intersected;

};



PIN.getIntersectedDataGbxml  = function() {
	console.log( 'PIN.intersected', PIN.intersected );

	const index = PIN.intersected.userData.index;

	const surface = GBX.surfaces[ index ];

	const surfaceXml = PIN.parser.parseFromString( surface, "application/xml").documentElement;

	return surfaceXml;

};


PIN.setIntersectedParticleAtPoint = function( point ) {
	//console.log( 'point', point );

	THR.scene.remove( PIN.particle );

	const distance = THR.camera.position.distanceTo( THR.controls.target );

	PIN.particle.scale.x = PIN.particle.scale.y = 0.01 * distance;
	PIN.particle.position.copy( point );

	THR.scene.add( PIN.particle );

};



PIN.drawBorder = function( surfaceXml ) {

	THR.scene.remove( PIN.line );

	// or get attributes or vertices from shape<< yes or adjust emissive

	const planar = surfaceXml.getElementsByTagName( 'PlanarGeometry' )[ 0 ];

	const points = Array.from( planar.getElementsByTagName( 'CartesianPoint' ) );
	//console.log( 'points', points );

	const vertices = points.map( point => {

		const cord = Array.from( point.children );

		const vertex = new THREE.Vector3( Number( cord[ 0 ].innerHTML ), Number( cord[ 1 ].innerHTML ), Number( cord[ 2 ].innerHTML ) );

		return vertex;

	} );

	const geometry = new THREE.Geometry().setFromPoints( vertices );
	//console.log( 'geometry', geometry );

	const material = new THREE.LineBasicMaterial( { color: 0xff00ff, linewidth: 2, transparent: true } );

	PIN.line = new THREE.LineLoop( geometry, material );

	THR.scene.add( PIN.line );

};
