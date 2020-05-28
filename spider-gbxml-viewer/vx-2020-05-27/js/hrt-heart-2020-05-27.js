
const HRT = {}; // Easter egg

HRT.initHeart = function ( position = new THREE.Vector3( 0, 150, 0 ), 
rotation = new THREE.Vector3( - 0.5 * Math.PI, 0, 0 ), scale = new THREE.Vector3( 0.3, 0.3, 0.3 )) {

	const x = 0, y = 0;

	const heartShape = new THREE.Shape() // From http://blog.burlock.org/html5/130-paths
		.moveTo( x + 25, y + 25 )
		.bezierCurveTo( x + 25, y + 25, x + 20, y, x, y )
		.bezierCurveTo( x - 30, y, x - 30, y + 35, x - 30, y + 35 )
		.bezierCurveTo( x - 30, y + 55, x - 10, y + 77, x + 25, y + 95 )
		.bezierCurveTo( x + 60, y + 77, x + 80, y + 55, x + 80, y + 35 )
		.bezierCurveTo( x + 80, y + 35, x + 80, y, x + 50, y )
		.bezierCurveTo( x + 35, y, x + 25, y + 25, x + 25, y + 25 );

	const extrudeSettings = { depth: 8, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 5, 
		bevelThickness: 3 };

	const material =  new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0xffffff } );
	const geometry = new THREE.ExtrudeBufferGeometry( heartShape, extrudeSettings );
	geometry.applyMatrix4( new THREE.Matrix4().makeTranslation( position.x, position.y, position.z ) );

	HRT.heart = new THREE.Mesh( geometry, material );
	//HRT.heart.position.copy( position );
	//heart.rotation.copy( rotation );
	HRT.heart.rotation.set( - 0.5 * Math.PI, -1, 0 );
	HRT.heart.scale.copy ( scale );

	THR.scene.add( HRT.heart );

};

