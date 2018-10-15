

const ISSI = {};

ISSI.errorsFound = {};
ISSI.inclusions = [];

// https://stackoverflow.com/questions/22521982/check-if-point-inside-a-polygon
// https://github.com/substack/point-in-polygon
// https://stackoverflow.com/questions/17223806/how-to-check-if-point-is-in-polygon-in-javascript


ISSI.getMenu = function() {

	let htm =
	`
		<details ontoggle=divInclusionsFound.innerHTML+=ISSI.getInclusions(); >

			<summary>Inclusions</summary>

			<div id=divInclusionsFound ></div>

		</details>

	`;

	return htm;

};



ISSI.getInclusions = function() {

	let htm;

	//arr =  GBX.surfaceMeshes.children.slice();
	ISSI.inclusions = [];

	children = GBX.surfaceMeshes.children;

	children2 = children.slice();


	for ( let surface of children ) {

		const box1 = new THREE.Box3().setFromObject ( surface );

		for ( let surfaceTest of children2 ) {

			const box2 = new THREE.Box3().setFromObject ( surfaceTest );

			if ( box1.containsBox( box2 ) && surface.uuid != surfaceTest.uuid ) {

				children2.pop();

				ISSI.inclusions.push ( {s1: surface, s2: surfaceTest } );

			}

		}

	}




	txt = '';
	/*

	for ( let inclusion of ISSI.inclusions ) {

		//const butts1 = ISSI.getButtonsSurfaceId( inclusion.s1.userData.data.id );
		//const butts2 = ISSI.getButtonsSurfaceId( inclusion.s2.userData.data.id );

		txt +=
		`
		${inclusion.s1.userData.data.Name}<br>
		${inclusion.s1.userData.data.Name}
		<hr>`;

	}

	*/


	ISSI.setSelectedFocus( ISSI.inclusions );
	txt = setInclusionsRed();

	htm = `inclusions found: ${ ISSI.inclusions.length }<br>${ txt }`;



	return htm;

};


ISSI.getVertices = function( polyloop ) {

	const points = polyloop.CartesianPoint.map( CartesianPoint => new THREE.Vector3().fromArray( CartesianPoint.Coordinate ) );
	return points;

};



function setInclusionsRed() {

	THR.scene.updateMatrixWorld();

	const raycaster = new THREE.Raycaster();

	const direction = new THREE.Vector3( 0, 0, 1 );

	//ISSI.inclusions.forEach( child => { child.s1.visible = false; } );

	const intersects2 = [];

	for ( let surfaces of ISSI.inclusions ) {

		verticesS2 = GBX.getVertices( surfaces.s2.userData.gbjson.PlanarGeometry.PolyLoop );

		for ( let vertex of verticesS2 ) {

			const vertexWorld = surfaces.s2.localToWorld( vertex.clone() );
			//console.log( 'vertex', vv );

			raycaster.set( vertexWorld, direction );

			const intersects = raycaster.intersectObject( surfaces.s1 );

			if ( intersects.length > 0 ) {

				surfaces.s1.visible = true;
				surfaces.s1.material.opacity = 0.1;

				//surfaces.s2.visible = true;

				//surfaces.s2.material = new THREE.MeshBasicMaterial( { color: 'green', side: 2 } );
				console.log( '', intersects );

				intersects2.push( intersects );

				const mesh = surfaces.s2;
				mesh.visible = true;
				//normalArray = mesh.geometry.attributes.normal.array.slice( 0, 3 );
				//mesh.position.add( new THREE.Vector3().fromArray( normalArray) );
				mesh.material.color.r = 1;

				const edgesGeometry = new THREE.WireframeGeometry( mesh.geometry );
				//console.log( '', edgesGeometry );
				const edgesMaterial = new THREE.LineBasicMaterial( { color: 'red', opacity: 0.85, transparent: true } );
				const edges = new THREE.LineSegments( edgesGeometry, edgesMaterial );
				THR.scene.add( edges );


			} else {

				//surfaces.s1.visible = false;
				//surfaces.s2.visible = false;

			}

		}

	}

	for ( let surfaces of ISSI.inclusions ) {

		if ( surfaces.s2.material.color.r !== 1 ) {

			//console.log( '', surfaces.s2 );

			surfaces.s1.visible = false;
			surfaces.s2.visible = false;
		}

	}

	return `<br>intersects2 ${ intersects2.length }`
}

ISSI.setDoubleCheck = function() {

	THR.scene.updateMatrixWorld();

	var raycaster = new THREE.Raycaster();

	for( surfaces of ISSI.inclusions ) {

		//const vertices = new THREE.Geometry().fromBufferGeometry( surfaces.s1.geometry ).vertices ;
		verticesS1 = GBX.getVertices( surfaces.s1.userData.gbjson.PlanarGeometry.PolyLoop );
		//console.log( 'verticesS1', verticesS1 );

		const center = surfaces.s2.geometry.boundingSphere.center;
		//console.log( 'center', center );

		const geometry = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5 );
		const material = new THREE.MeshNormalMaterial();

		const mesh = new THREE.Mesh( geometry, material );
		mesh.position.copy( center );
		THR.scene.add( mesh );

		for ( let vertex of verticesS1 ) {

			const direction = vertex.clone().sub( center ).normalize();
			console.log( 'direction', direction );

			const geometryLine = new THREE.Geometry();
			geometryLine.vertices = [ center, center.clone().add( direction ) ];
			const materialLine = new THREE.LineBasicMaterial( { color: 0x000000 } );
			const line = new THREE.Line( geometryLine, materialLine );
			THR.scene.add( line );

			raycaster.set( center, direction );

			var intersects = raycaster.intersectObject( surfaces.s1 );
			console.log( 'int', intersects.length );

		}




	}

};



ISSI.setSelectedFocus = function( surfaces ) {

	//console.log( 'select', select.value );

	const children = GBX.surfaceMeshes.children;

	children.forEach( child => child.visible = false );

	for ( let surface of surfaces) {

		//console.log( 'hh', surface);

		for ( child of children ) {

			if ( surface.s1.userData.gbjson.id === child.userData.gbjson.id ) { child.visible = true; }

			if ( surface.s2.userData.gbjson.id === child.userData.gbjson.id ) {

				const mesh = surface.s2;
				mesh.visible = true;
				normalArray = mesh.geometry.attributes.normal.array.slice( 0, 3 );
				//mesh.position.add( new THREE.Vector3().fromArray( normalArray) );
				//mesh.material.color.r = 1;

				const edgesGeometry = new THREE.WireframeGeometry( mesh.geometry );
				//console.log( '', edgesGeometry );
				const edgesMaterial = new THREE.LineBasicMaterial( { color: 'red', opacity: 0.85, transparent: true } );
				const edges = new THREE.LineSegments( edgesGeometry, edgesMaterial );
				//THR.scene.add( edges );

			}


		}

	}

};
